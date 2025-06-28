'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  MessageCircle,
  Send,
  X,
  Users,
  Hash,
  Bell,
  User,
  Building,
  CheckSquare,
  Search,
  Plus,
  ArrowLeft,
} from 'lucide-react'
import { useRealtimeChat, useNotifications } from '@/hooks'
import { ChatMessageItem, TypingIndicator } from './chat-message'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface RealtimeChatProps {
  clientId?: string
}

interface ChatSection {
  id: string
  name: string
  type: 'notifications' | 'general' | 'project' | 'team' | 'direct'
  channel?: string
  members?: Array<{
    id: string
    name: string
    email: string
    status?: 'online' | 'offline'
  }>
  unreadCount?: number
}

const RealtimeChat: React.FC<RealtimeChatProps> = ({ clientId }) => {
  const [open, setOpen] = useState(false)
  const [currentView, setCurrentView] = useState<'sections' | 'chat'>(
    'sections'
  )
  const [activeSection, setActiveSection] = useState<ChatSection | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [teamMembers, setTeamMembers] = useState<
    Array<{
      id: string
      name: string
      email: string
      status?: 'online' | 'offline'
    }>
  >([])
  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>(
    []
  )

  const supabase = createClientComponentClient()
  const { notifications } = useNotifications()

  // Chat hook - only initialized when we have an active section
  const roomName = activeSection?.channel || ''
  const {
    messages,
    loading,
    connected,
    typing,
    currentUser,
    sendMessage,
    sendTypingEvent,
    messagesEndRef,
  } = useRealtimeChat({
    roomName,
    onMessage: (messages) => {
      // Handle message persistence if needed
      console.log(`New messages in ${roomName}:`, messages.length)
    },
  })

  // Load team members and projects
  useEffect(() => {
    const loadData = async () => {
      if (!clientId) return

      try {
        // Load team members
        const { data: members } = await supabase
          .from('client_users')
          .select(
            `
            user_id,
            users!inner(id, name, email)
          `
          )
          .eq('client_id', clientId)

        if (members) {
          setTeamMembers(
            members.map((m: any) => ({
              id: m.user_id,
              name: m.users.name || m.users.email,
              email: m.users.email,
              status: 'offline' as const,
            }))
          )
        }

        // Load projects
        const { data: projectsData } = await supabase
          .from('projects')
          .select('id, name')
          .eq('client_id', clientId)
          .eq('is_active', true)

        if (projectsData) {
          setProjects(projectsData)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    loadData()
  }, [clientId, supabase])

  // Define sections based on data
  const sections = useMemo((): ChatSection[] => {
    const unreadNotifications = notifications.filter((n) => !n.is_read).length

    const baseSections: ChatSection[] = [
      {
        id: 'notifications',
        name: 'Notificações',
        type: 'notifications',
        unreadCount: unreadNotifications,
      },
      {
        id: 'general',
        name: 'Geral',
        type: 'general',
        channel: clientId ? `chat:client-${clientId}` : 'chat:general',
        unreadCount: 0,
      },
    ]

    // Add projects section
    if (projects.length > 0) {
      baseSections.push({
        id: 'projects',
        name: 'Projetos',
        type: 'project',
        unreadCount: 0,
      })
    }

    // Add team section
    if (teamMembers.length > 0) {
      baseSections.push({
        id: 'team',
        name: 'Equipe',
        type: 'team',
        members: teamMembers,
        unreadCount: 0,
      })
    }

    return baseSections
  }, [notifications, clientId, projects, teamMembers])

  const handleSectionClick = (section: ChatSection) => {
    setActiveSection(section)

    if (section.type === 'notifications') {
      // Handle notifications view
      return
    }

    if (section.type === 'team') {
      // Stay in sections view for team member selection
      return
    }

    if (section.type === 'project') {
      // Stay in sections view for project selection
      return
    }

    // For general chat, go directly to chat view
    setCurrentView('chat')
  }

  const handleDirectMessage = (member: {
    id: string
    name: string
    email: string
  }) => {
    const directChannel = `chat:direct-${[currentUser?.id, member.id]
      .sort()
      .join('-')}`
    setActiveSection({
      id: `direct-${member.id}`,
      name: member.name,
      type: 'direct',
      channel: directChannel,
    })
    setCurrentView('chat')
  }

  const handleProjectChat = (project: { id: string; name: string }) => {
    setActiveSection({
      id: `project-${project.id}`,
      name: project.name,
      type: 'project',
      channel: `chat:project-${project.id}`,
    })
    setCurrentView('chat')
  }

  const handleBackToSections = () => {
    setCurrentView('sections')
    setActiveSection(null)
    setSearchQuery('')
  }

  const [inputValue, setInputValue] = useState('')

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    try {
      await sendMessage(inputValue.trim())
      setInputValue('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const filteredSections = sections.filter((section) =>
    section.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const unreadChatNotifications = notifications.filter(
    (n) => n.type === 'mention' && !n.is_read
  ).length

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const shouldShowHeader = (index: number) => {
    if (index === 0) return true
    const currentMessage = messages[index]
    const previousMessage = messages[index - 1]

    return (
      currentMessage.user.id !== previousMessage.user.id ||
      new Date(currentMessage.createdAt).getTime() -
        new Date(previousMessage.createdAt).getTime() >
        300000 // 5 minutes
    )
  }

  return (
    <>
      {/* Chat Button */}
      <button
        className="relative p-2 rounded-full hover:bg-zinc-100 transition-colors"
        onClick={() => setOpen(true)}
      >
        <MessageCircle size={18} />
        {unreadChatNotifications > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadChatNotifications > 9 ? '9+' : unreadChatNotifications}
          </span>
        )}
      </button>

      {/* Chat Drawer */}
      {open && (
        <div className="fixed right-0 top-0 z-50 w-96 h-full bg-white border-l shadow-xl flex flex-col">
          {/* Sections View */}
          {currentView === 'sections' && (
            <>
              {/* Header */}
              <header className="flex items-center justify-between p-4 border-b bg-gray-50">
                <div className="flex items-center gap-2">
                  <MessageCircle size={20} className="text-gray-600" />
                  <h3 className="font-semibold text-gray-800">Chat</h3>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </header>

              {/* Search */}
              <div className="p-4 border-b">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Buscar conversas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sections List */}
              <div className="flex-1 overflow-y-auto">
                {filteredSections.map((section) => (
                  <div key={section.id}>
                    <button
                      onClick={() => handleSectionClick(section)}
                      className="w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {section.type === 'notifications' && (
                            <Bell size={18} className="text-orange-500" />
                          )}
                          {section.type === 'general' && (
                            <Hash size={18} className="text-blue-500" />
                          )}
                          {section.type === 'project' && (
                            <Building size={18} className="text-green-500" />
                          )}
                          {section.type === 'team' && (
                            <Users size={18} className="text-purple-500" />
                          )}

                          <div>
                            <div className="font-medium text-gray-900">
                              {section.name}
                            </div>
                            {section.type === 'team' && (
                              <div className="text-xs text-gray-500">
                                {section.members?.length} membros
                              </div>
                            )}
                          </div>
                        </div>

                        {section.unreadCount && section.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {section.unreadCount > 9
                              ? '9+'
                              : section.unreadCount}
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Show team members when team section is active */}
                    {section.type === 'team' &&
                      activeSection?.id === section.id && (
                        <div className="bg-gray-50 border-b">
                          <div className="px-4 py-2 text-xs text-gray-500 font-medium">
                            MEMBROS DA EQUIPE
                          </div>
                          {teamMembers.map((member) => (
                            <button
                              key={member.id}
                              onClick={() => handleDirectMessage(member)}
                              className="w-full p-3 pl-8 text-left hover:bg-gray-100 transition-colors flex items-center gap-3"
                            >
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600">
                                  {member.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm text-gray-900">
                                  {member.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {member.email}
                                </div>
                              </div>
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  member.status === 'online'
                                    ? 'bg-green-500'
                                    : 'bg-gray-400'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      )}

                    {/* Show projects when projects section is active */}
                    {section.type === 'project' &&
                      activeSection?.id === section.id && (
                        <div className="bg-gray-50 border-b">
                          <div className="px-4 py-2 text-xs text-gray-500 font-medium">
                            PROJETOS
                          </div>
                          {projects.map((project) => (
                            <button
                              key={project.id}
                              onClick={() => handleProjectChat(project)}
                              className="w-full p-3 pl-8 text-left hover:bg-gray-100 transition-colors flex items-center gap-3"
                            >
                              <Building size={16} className="text-green-500" />
                              <div className="font-medium text-sm text-gray-900">
                                {project.name}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Chat View */}
          {currentView === 'chat' && activeSection && (
            <>
              {/* Chat Header */}
              <header className="flex items-center justify-between p-4 border-b bg-gray-50">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBackToSections}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {activeSection.name}
                    </h3>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      {activeSection.type === 'direct' && <User size={10} />}
                      {activeSection.type === 'general' && <Hash size={10} />}
                      {activeSection.type === 'project' && (
                        <Building size={10} />
                      )}
                      <span>
                        {activeSection.type === 'direct'
                          ? 'Conversa direta'
                          : activeSection.type === 'general'
                          ? 'Canal geral'
                          : activeSection.type === 'project'
                          ? 'Projeto'
                          : 'Canal'}
                      </span>
                      {connected && (
                        <span className="text-green-500">• Online</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </header>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <MessageCircle
                        size={48}
                        className="mx-auto mb-2 opacity-50"
                      />
                      <p className="font-medium">Nenhuma mensagem ainda</p>
                      <p className="text-sm">
                        Seja o primeiro a enviar uma mensagem!
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => (
                      <ChatMessageItem
                        key={message.id}
                        message={message}
                        isOwnMessage={message.user.id === currentUser?.id}
                        showHeader={shouldShowHeader(index)}
                        showAvatar={shouldShowHeader(index)}
                      />
                    ))}
                    <TypingIndicator users={typing} />
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-gray-50">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => sendTypingEvent(true)}
                    onBlur={() => sendTypingEvent(false)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default RealtimeChat
