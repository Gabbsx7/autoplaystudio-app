import { useState, useCallback, useEffect, useRef } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export interface ChatMessage {
  id: string
  content: string
  user: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  channel: string
  mentions?: {
    users: string[]
    projects: string[]
    milestones: string[]
    tasks: string[]
  }
}

export interface RealtimeChatUser {
  id: string
  name: string
  email: string
  avatar?: string
  status?: 'online' | 'offline'
}

export interface RealtimeChatChannel {
  id: string
  name: string
  type: 'general' | 'client' | 'direct'
  participants?: RealtimeChatUser[]
  unreadCount?: number
}

interface UseRealtimeChatProps {
  roomName: string
  userId?: string
  initialMessages?: ChatMessage[]
  onMessage?: (messages: ChatMessage[]) => void
}

export const useRealtimeChat = ({
  roomName,
  userId,
  initialMessages = [],
  onMessage,
}: UseRealtimeChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const [typing, setTyping] = useState<string[]>([])
  const [currentUser, setCurrentUser] = useState<RealtimeChatUser | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const supabase = createClientComponentClient()

  // Scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        const { data: userData } = await supabase
          .from('users')
          .select('id, name, email')
          .eq('id', user.id)
          .single()

        if (userData) {
          setCurrentUser({
            id: userData.id,
            name: userData.name || userData.email,
            email: userData.email,
          })
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    getCurrentUser()
  }, [supabase])

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      if (!roomName) return

      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('messages')
          .select(
            `
            id,
            content,
            created_at,
            channel_id,
            mentions,
            user_id,
            username,
            users!inner(id, name, email)
          `
          )
          .eq('channel_id', roomName)
          .order('created_at', { ascending: true })
          .limit(50)

        if (error) throw error

        const formattedMessages: ChatMessage[] = (data || []).map(
          (msg: any) => ({
            id: msg.id,
            content: msg.content,
            user: {
              id: msg.user_id,
              name:
                msg.username || msg.users?.name || msg.users?.email || 'User',
              email: msg.users?.email || '',
            },
            createdAt: msg.created_at,
            channel: msg.channel_id,
            mentions: msg.mentions,
          })
        )

        setMessages(formattedMessages)
        onMessage?.(formattedMessages)
      } catch (error) {
        console.error('Error loading messages:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMessages()
  }, [roomName, supabase, onMessage])

  // Setup realtime subscription
  useEffect(() => {
    if (!roomName || !currentUser) return

    const channel = supabase
      .channel(`room:${roomName}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${roomName}`,
        },
        async (payload) => {
          // Get user data for the new message
          const { data: userData } = await supabase
            .from('users')
            .select('id, name, email')
            .eq('id', payload.new.user_id)
            .single()

          const newMessage: ChatMessage = {
            id: payload.new.id,
            content: payload.new.content,
            user: {
              id: payload.new.user_id,
              name:
                payload.new.username ||
                userData?.name ||
                userData?.email ||
                'User',
              email: userData?.email || '',
            },
            createdAt: payload.new.created_at,
            channel: payload.new.channel_id,
            mentions: payload.new.mentions,
          }

          setMessages((prev) => {
            const updated = [...prev, newMessage]
            onMessage?.(updated)
            return updated
          })
        }
      )
      .on('presence', { event: 'sync' }, () => {
        setConnected(true)
      })
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        setTyping((prev) => {
          if (payload.isTyping && !prev.includes(payload.userId)) {
            return [...prev, payload.userId]
          } else if (!payload.isTyping) {
            return prev.filter((id) => id !== payload.userId)
          }
          return prev
        })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomName, currentUser, supabase, onMessage])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !currentUser || !roomName) return

      try {
        // Parse mentions
        const users = Array.from(
          content.matchAll(/@([a-zA-Z0-9\s]+?)(?=\s|$|[@&#$])/g)
        ).map((m) => m[1].trim())
        const projects = Array.from(
          content.matchAll(/&([a-zA-Z0-9\s]+?)(?=\s|$|[@&#$])/g)
        ).map((m) => m[1].trim())
        const milestones = Array.from(
          content.matchAll(/#([a-zA-Z0-9\s]+?)(?=\s|$|[@&#$])/g)
        ).map((m) => m[1].trim())
        const tasks = Array.from(
          content.matchAll(/\$([a-zA-Z0-9\s]+?)(?=\s|$|[@&#$])/g)
        ).map((m) => m[1].trim())

        const mentions = {
          users: users.filter((u) => u.length > 0),
          projects: projects.filter((p) => p.length > 0),
          milestones: milestones.filter((m) => m.length > 0),
          tasks: tasks.filter((t) => t.length > 0),
        }

        const { error } = await supabase.from('messages').insert({
          content: content.trim(),
          user_id: currentUser.id,
          username: currentUser.name,
          channel_id: roomName,
          mentions: Object.values(mentions).some((arr) => arr.length > 0)
            ? mentions
            : null,
        })

        if (error) throw error
      } catch (error) {
        console.error('Error sending message:', error)
        throw error
      }
    },
    [currentUser, roomName, supabase]
  )

  const sendTypingEvent = useCallback(
    (isTyping: boolean) => {
      if (!currentUser || !roomName) return

      supabase.channel(`room:${roomName}`).send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId: currentUser.id, isTyping },
      })
    },
    [currentUser, roomName, supabase]
  )

  return {
    messages,
    loading,
    connected,
    typing,
    currentUser,
    sendMessage,
    sendTypingEvent,
    scrollToBottom,
    messagesEndRef,
  }
}
