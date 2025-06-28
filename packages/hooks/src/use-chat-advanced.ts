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
    tasks: string[]
  }
}

export interface ParsedMentions {
  users: string[]
  projects: string[]
  milestones: string[]
  tasks: string[]
}

export interface ChatUser {
  id: string
  name: string
  email: string
  role?: string
}

export interface ChatProject {
  id: string
  name: string
  status: string
}

export interface ChatMilestone {
  id: string
  title: string
  status: string
  project_id: string
}

export interface ChatTask {
  id: string
  name: string
  status: string
  milestone_id: string
}

export interface ChatClient {
  id: string
  name: string
}

export interface SuggestionItem {
  id: string
  name: string
  type: 'user' | 'project' | 'milestone' | 'task'
}

// Function to parse mentions in text (improved)
export function parseMentions(text: string): ParsedMentions {
  const users = Array.from(
    text.matchAll(/@([a-zA-Z0-9\s]+?)(?=\s|$|[@&#$])/g)
  ).map((m) => m[1].trim())
  const projects = Array.from(
    text.matchAll(/&([a-zA-Z0-9\s]+?)(?=\s|$|[@&#$])/g)
  ).map((m) => m[1].trim())
  const milestones = Array.from(
    text.matchAll(/#([a-zA-Z0-9\s]+?)(?=\s|$|[@&#$])/g)
  ).map((m) => m[1].trim())
  const tasks = Array.from(
    text.matchAll(/\$([a-zA-Z0-9\s]+?)(?=\s|$|[@&#$])/g)
  ).map((m) => m[1].trim())

  return {
    users: users.filter((u) => u.length > 0),
    projects: projects.filter((p) => p.length > 0),
    milestones: milestones.filter((m) => m.length > 0),
    tasks: tasks.filter((t) => t.length > 0),
  }
}

export const useChatAdvanced = (clientId?: string) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isStudioMember, setIsStudioMember] = useState(false)
  const [availableClients, setAvailableClients] = useState<ChatClient[]>([])
  const [selectedClient, setSelectedClient] = useState<string | null>(
    clientId || null
  )
  const [selectedClientName, setSelectedClientName] = useState<string | null>(
    null
  )
  const [channelUsers, setChannelUsers] = useState<ChatUser[]>([])
  const [channelProjects, setChannelProjects] = useState<ChatProject[]>([])
  const [channelMilestones, setChannelMilestones] = useState<ChatMilestone[]>(
    []
  )
  const [channelTasks, setChannelTasks] = useState<ChatTask[]>([])

  const supabase = createClientComponentClient()

  // Determine channel based on selected client
  const channelName = selectedClient
    ? `chat:client-${selectedClient}`
    : 'chat:general'

  // Get current user data and determine if studio or client member
  useEffect(() => {
    const getCurrentUserData = async () => {
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
          setCurrentUser(userData)
        }

        // NEW LOGIC: Check if studio member first
        const { data: studioMember } = await supabase
          .from('studio_members')
          .select(
            `
            studio_id,
            studio:studio(id, name),
            role:roles(name)
          `
          )
          .eq('user_id', user.id)
          .maybeSingle()

        if (studioMember?.role) {
          // User is studio member
          setIsStudioMember(true)
          setUserRole((studioMember.role as any)?.name)
          console.log(
            'Studio member detected:',
            (studioMember.role as any)?.name
          )
        } else {
          // Check if client user
          const { data: clientUser } = await supabase
            .from('client_users')
            .select(
              `
              client_id,
              client:clients(id, name),
              role:roles(name)
            `
            )
            .eq('user_id', user.id)
            .maybeSingle()

          if (clientUser?.role) {
            // User is client member
            setIsStudioMember(false)
            setUserRole((clientUser.role as any)?.name)
            setSelectedClient(clientUser.client_id)
            setSelectedClientName((clientUser.client as any)?.name)
            console.log(
              'Client member detected:',
              (clientUser.role as any)?.name,
              'for client:',
              clientUser.client_id
            )
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    getCurrentUserData()
  }, [supabase])

  // Get available clients for studio users
  useEffect(() => {
    const fetchAvailableClients = async () => {
      if (!isStudioMember) return

      try {
        const { data: clients } = await supabase
          .from('clients')
          .select('id, name')
          .eq('is_active', true)
          .order('name')

        setAvailableClients(clients || [])
      } catch (error) {
        console.error('Error fetching clients:', error)
      }
    }

    fetchAvailableClients()
  }, [isStudioMember, supabase])

  // Get specific channel data using consolidated view
  useEffect(() => {
    const fetchChannelData = async () => {
      if (!selectedClient) {
        setChannelUsers([])
        setChannelProjects([])
        setChannelMilestones([])
        setChannelTasks([])
        setSelectedClientName(null)
        return
      }

      try {
        // Use consolidated view to fetch all data at once
        const { data: consolidatedData, error } = await supabase
          .from('chat_consolidated_view')
          .select('*')
          .eq('client_id', selectedClient)

        if (error) {
          console.error('Error fetching consolidated data:', error)
          return
        }

        if (consolidatedData) {
          // Group by entity type
          const users = consolidatedData.filter(
            (item) => item.entity_type === 'user'
          )
          const projects = consolidatedData.filter(
            (item) => item.entity_type === 'project'
          )
          const milestones = consolidatedData.filter(
            (item) => item.entity_type === 'milestone'
          )
          const tasks = consolidatedData.filter(
            (item) => item.entity_type === 'task'
          )

          setChannelUsers(
            users.map((u) => ({
              id: u.id,
              name: u.name,
              email: u.email || '',
              role: u.user_type,
            }))
          )

          setChannelProjects(
            projects.map((p) => ({
              id: p.id,
              name: p.name,
              status: 'active',
            }))
          )

          setChannelMilestones(
            milestones.map((m) => ({
              id: m.id,
              title: m.name,
              status: 'pending',
              project_id: '',
            }))
          )

          setChannelTasks(
            tasks.map((t) => ({
              id: t.id,
              name: t.name,
              status: 'pending',
              milestone_id: '',
            }))
          )

          // Set client name from first item
          if (consolidatedData.length > 0) {
            setSelectedClientName(consolidatedData[0].client_name)
          }
        }
      } catch (error) {
        console.error('Exception in fetchChannelData:', error)
      }
    }

    fetchChannelData()
  }, [selectedClient, supabase])

  // Get initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!channelName) return

      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('channel_id', channelName)
          .order('created_at', { ascending: true })

        if (error) throw error
        setMessages(data || [])
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [channelName, supabase])

  // Realtime for new messages
  useEffect(() => {
    if (!channelName) return

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
    async (content: string) => {
      try {
        if (!currentUser || !channelName) {
          throw new Error('User data or channel not available')
        }

        const mentions = parseMentions(content)

        const messageData = {
          content,
          user_id: currentUser.id,
          username: currentUser.name || currentUser.email || 'User',
          channel_id: channelName,
          mentions:
            mentions.users.length > 0 ||
            mentions.projects.length > 0 ||
            mentions.milestones.length > 0 ||
            mentions.tasks.length > 0
              ? mentions
              : null,
        }

        const { error } = await supabase.from('messages').insert(messageData)

        if (error) {
          console.error('Detailed error sending message:', error)
          throw error
        }
      } catch (error) {
        console.error('Error sending message:', error)
        throw error
      }
    },
    [currentUser, channelName, supabase]
  )

  // Function to get suggestions using SQL function with NEW LOGIC
  const getSuggestions = useCallback(
    async (type: string, query: string = ''): Promise<SuggestionItem[]> => {
      if (!currentUser) return []

      try {
        // NEW: Pass user_id instead of client_id
        // Function will determine permissions internally
        const { data } = await supabase.rpc('get_mention_suggestions', {
          user_id_param: currentUser.id,
          mention_type: type,
          search_query: query,
        })

        return data || []
      } catch (error) {
        console.error('Error fetching suggestions:', error)
        return []
      }
    },
    [currentUser, supabase]
  )

  // Studio members can select client, client members cannot
  const canSelectClient = isStudioMember

  return {
    messages,
    sendMessage,
    loading,
    currentUser,
    userRole,
    isStudioMember,
    availableClients,
    selectedClient,
    setSelectedClient,
    selectedClientName,
    canSelectClient,
    channelUsers,
    channelProjects,
    channelMilestones,
    channelTasks,
    channelName,
    getSuggestions,
  }
}
