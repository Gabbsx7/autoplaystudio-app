import { useState, useCallback, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export interface Message {
  id: string
  content: string
  user_id: string
  username: string
  channel_id: string
  created_at: string
  mentions?: {
    users: string[]
    projects: string[]
    milestones: string[]
  }
}

export interface ParsedMentions {
  users: string[]
  projects: string[]
  milestones: string[]
}

// Função para parsear menções no texto
export function parseMentions(text: string): ParsedMentions {
  const users = Array.from(text.matchAll(/@(\w+)/g)).map((m) => m[1])
  const projects = Array.from(text.matchAll(/&([^&\s]+)/g)).map((m) => m[1])
  const milestones = Array.from(text.matchAll(/#([^#\s]+)/g)).map((m) => m[1])

  return { users, projects, milestones }
}

export const useChatWithMentions = (channelName: string) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  // Buscar mensagens iniciais
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('channel_id', channelName)
          .order('created_at', { ascending: true })

        if (error) throw error
        setMessages(data || [])
      } catch (error) {
        console.error('Erro ao buscar mensagens:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [channelName, supabase])

  // Realtime para novas mensagens
  useEffect(() => {
    const realtimeChannel = supabase
      .channel(`messages:${channelName}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelName}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(realtimeChannel)
    }
  }, [channelName, supabase])

  const sendMessage = useCallback(
    async (content: string, username: string) => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          throw new Error('Usuário não autenticado')
        }

        const mentions = parseMentions(content)

        const { error } = await supabase.from('messages').insert({
          content,
          user_id: user.id,
          username,
          channel_id: channelName,
          mentions:
            mentions.users.length > 0 ||
            mentions.projects.length > 0 ||
            mentions.milestones.length > 0
              ? mentions
              : null,
        })

        if (error) throw error
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error)
        throw error
      }
    },
    [channelName, supabase]
  )

  return {
    messages,
    sendMessage,
    loading,
  }
}
