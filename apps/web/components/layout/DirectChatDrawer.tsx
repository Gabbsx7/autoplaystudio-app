'use client'

import React, { useState, useEffect } from 'react'
import { MessageCircle, Send, X, User, ArrowLeft, Search } from 'lucide-react'
import { useRealtimeChat } from '@/hooks'
import { ChatMessageItem, TypingIndicator } from './chat-message'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface DirectChatDrawerProps {
  isOpen: boolean
  onClose: () => void
  currentUserId?: string
  clientId?: string
}

interface TeamMember {
  id: string
  name: string
  email: string
  status?: 'online' | 'offline'
}

const DirectChatDrawer: React.FC<DirectChatDrawerProps> = ({
  isOpen,
  onClose,
  currentUserId,
  clientId,
}) => {
  const [currentView, setCurrentView] = useState<'members' | 'chat'>('members')
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [inputValue, setInputValue] = useState('')

  const supabase = createClientComponentClient()

  // Generate channel name for direct chat
  const directChannel =
    selectedMember && currentUserId
      ? `chat:direct-${[currentUserId, selectedMember.id].sort().join('-')}`
      : ''

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
    roomName: directChannel,
  })

  // Load team members
  useEffect(() => {
    const loadTeamMembers = async () => {
      if (!clientId || !currentUserId) return

      try {
        const { data: members } = await supabase
          .from('client_users')
          .select(
            `
            user_id,
            users!inner(id, name, email)
          `
          )
          .eq('client_id', clientId)
          .neq('user_id', currentUserId) // Exclude current user

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
      } catch (error) {
        console.error('Error loading team members:', error)
      }
    }

    loadTeamMembers()
  }, [clientId, currentUserId, supabase])

  const handleMemberSelect = (member: TeamMember) => {
    setSelectedMember(member)
    setCurrentView('chat')
    setSearchQuery('')
  }

  const handleBackToMembers = () => {
    setCurrentView('members')
    setSelectedMember(null)
  }

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

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

  if (!isOpen) return null

  return (
    <div className="fixed right-0 top-0 z-50 w-96 h-full bg-white border-l shadow-xl flex flex-col">
      {/* Members List View */}
      {currentView === 'members' && (
        <>
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b bg-gray-50">
            <div className="flex items-center gap-2">
              <User size={20} className="text-purple-600" />
              <h3 className="font-semibold text-gray-800">Mensagens Diretas</h3>
            </div>
            <button
              onClick={onClose}
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
                placeholder="Buscar membros da equipe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Members List */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-2 text-xs text-gray-500 font-medium">
              MEMBROS DA EQUIPE ({filteredMembers.length})
            </div>

            {filteredMembers.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-gray-500">
                <div className="text-center">
                  <User size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum membro encontrado</p>
                </div>
              </div>
            ) : (
              filteredMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => handleMemberSelect(member)}
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 flex items-center gap-3"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-600">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Member Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {member.name}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {member.email}
                    </div>
                  </div>

                  {/* Status */}
                  <div
                    className={`w-3 h-3 rounded-full ${
                      member.status === 'online'
                        ? 'bg-green-500'
                        : 'bg-gray-400'
                    }`}
                  />
                </button>
              ))
            )}
          </div>
        </>
      )}

      {/* Direct Chat View */}
      {currentView === 'chat' && selectedMember && (
        <>
          {/* Chat Header */}
          <header className="flex items-center justify-between p-4 border-b bg-gray-50">
            <div className="flex items-center gap-2">
              <button
                onClick={handleBackToMembers}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-purple-600">
                  {selectedMember.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {selectedMember.name}
                </h3>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <User size={10} />
                  <span>Conversa direta</span>
                  {connected && (
                    <span className="text-green-500">• Online</span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <MessageCircle
                    size={48}
                    className="mx-auto mb-2 opacity-50"
                  />
                  <p className="font-medium">Início da conversa</p>
                  <p className="text-sm">
                    Envie uma mensagem para {selectedMember.name}
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
                placeholder={`Mensagem para ${selectedMember.name}...`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <Send size={16} />
              </button>
            </form>

            {/* Quick Actions */}
            <div className="mt-2 text-xs text-gray-500">
              <span>
                💡 Dica: Mensagens diretas são privadas entre você e{' '}
                {selectedMember.name}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default DirectChatDrawer
