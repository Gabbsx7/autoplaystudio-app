'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  MessageCircle,
  Send,
  X,
  Users,
  Hash,
  AtSign,
  Building,
  CheckSquare,
} from 'lucide-react'
import { useChatAdvanced, useNotifications } from '@/hooks'
import { renderMessageWithMentions } from '@/lib/utils/render-mentions'

interface ChatDrawerAdvancedProps {
  clientId?: string
}

interface SuggestionItem {
  id: string
  name: string
  type: 'user' | 'project' | 'milestone' | 'task'
}

const ChatDrawerAdvanced: React.FC<ChatDrawerAdvancedProps> = ({
  clientId,
}) => {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false)
  const [mentionType, setMentionType] = useState<
    'user' | 'project' | 'milestone' | 'task' | null
  >(null)
  const [mentionQuery, setMentionQuery] = useState('')

  const {
    messages,
    sendMessage,
    loading,
    currentUser,
    userRole,
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
    isStudioMember,
  } = useChatAdvanced(clientId)

  const { notifications } = useNotifications()

  // Detect when user is typing mentions
  useEffect(() => {
    const words = inputValue.split(/\s/)
    const lastWord = words[words.length - 1]

    if (lastWord.startsWith('@')) {
      setShowMentionSuggestions(true)
      setMentionType('user')
      setMentionQuery(lastWord.slice(1))
    } else if (lastWord.startsWith('#')) {
      setShowMentionSuggestions(true)
      setMentionType('milestone')
      setMentionQuery(lastWord.slice(1))
    } else if (lastWord.startsWith('&')) {
      setShowMentionSuggestions(true)
      setMentionType('project')
      setMentionQuery(lastWord.slice(1))
    } else if (lastWord.startsWith('$')) {
      setShowMentionSuggestions(true)
      setMentionType('task')
      setMentionQuery(lastWord.slice(1))
    } else {
      setShowMentionSuggestions(false)
      setMentionType(null)
      setMentionQuery('')
    }
  }, [
    inputValue,
    channelUsers,
    channelProjects,
    channelMilestones,
    channelTasks,
  ])

  // Filtrar sugestões baseado no tipo e query
  const suggestions = useMemo((): SuggestionItem[] => {
    if (!mentionType || !showMentionSuggestions) {
      return []
    }

    const query = mentionQuery.toLowerCase()
    let items: SuggestionItem[] = []

    switch (mentionType) {
      case 'user':
        items = channelUsers.map((u) => ({
          id: u.id,
          name: u.name || u.email,
          type: 'user' as const,
        }))
        break
      case 'project':
        items = channelProjects.map((p) => ({
          id: p.id,
          name: p.name,
          type: 'project' as const,
        }))
        break
      case 'milestone':
        items = channelMilestones.map((m) => ({
          id: m.id,
          name: m.title,
          type: 'milestone' as const,
        }))
        break
      case 'task':
        items = channelTasks.map((t) => ({
          id: t.id,
          name: t.name,
          type: 'task' as const,
        }))
        break
    }

    const filtered = items
      .filter((item) => item.name.toLowerCase().includes(query))
      .slice(0, 5)

    return filtered
  }, [
    mentionType,
    mentionQuery,
    channelUsers,
    channelProjects,
    channelMilestones,
    channelTasks,
    showMentionSuggestions,
  ])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || !currentUser) return

    try {
      await sendMessage(inputValue.trim())
      setInputValue('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleSuggestionClick = (suggestion: SuggestionItem) => {
    const words = inputValue.split(/\s/)
    const lastWordIndex = words.length - 1
    const symbols = { user: '@', project: '&', milestone: '#', task: '$' }

    words[lastWordIndex] = `${symbols[suggestion.type]}${suggestion.name}`
    setInputValue(words.join(' ') + ' ')
    setShowMentionSuggestions(false)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const unreadChatNotifications = notifications.filter(
    (n) => n.type === 'mention' && !n.is_read
  ).length

  const getClientDisplayName = () => {
    if (!selectedClient) return 'General'
    // Prioritize selectedClientName from hook, which comes from consolidated view
    if (selectedClientName) return selectedClientName
    // Fallback to availableClients (for studio users)
    const client = availableClients.find((c) => c.id === selectedClient)
    return client?.name || 'Client'
  }

  return (
    <>
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

      {open && (
        <div className="fixed right-0 top-0 z-50 w-96 h-full bg-white border-l shadow-xl flex flex-col">
          <header className="flex flex-col p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between mb-2">
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
            </div>

            <div className="bg-white border-l border-gray-200 w-80 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Chat</h3>
                  {/* Client selector for studio members only */}
                  {canSelectClient && availableClients.length > 0 && (
                    <select
                      value={selectedClient || ''}
                      onChange={(e) => setSelectedClient(e.target.value)}
                      className="ml-2 border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="">Select Client</option>
                      {availableClients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Show current context */}
                <div className="text-xs text-gray-500">
                  {isStudioMember ? (
                    selectedClient ? (
                      <>Studio View: {selectedClientName}</>
                    ) : (
                      <>Studio View: General</>
                    )
                  ) : (
                    <>Client: {selectedClientName}</>
                  )}
                </div>

                {/* User role badge */}
                <div className="mt-2">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      isStudioMember
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {userRole} {isStudioMember ? '(Studio)' : '(Client)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              <Building size={12} />
              <span>Channel: {getClientDisplayName()}</span>
              {channelUsers.length > 0 && (
                <span className="ml-2 flex items-center gap-1">
                  <Users size={12} />
                  {channelUsers.length} users
                </span>
              )}
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                  <p>No messages yet</p>
                  <p className="text-sm">Be the first to send a message!</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {message.username?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-900">
                        {message.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTime(message.created_at)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 break-words">
                      {renderMessageWithMentions(message.content)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t bg-gray-50">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message... (@user #milestone &project $task)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />

                {showMentionSuggestions && suggestions.length > 0 && (
                  <div className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
                    <div className="p-2 text-xs text-gray-500 border-b flex items-center gap-1">
                      {mentionType === 'user' && (
                        <>
                          <AtSign size={12} />
                          <span>Users</span>
                        </>
                      )}
                      {mentionType === 'milestone' && (
                        <>
                          <Hash size={12} />
                          <span>Milestones</span>
                        </>
                      )}
                      {mentionType === 'project' && (
                        <>
                          <Users size={12} />
                          <span>Projects</span>
                        </>
                      )}
                      {mentionType === 'task' && (
                        <>
                          <CheckSquare size={12} />
                          <span>Tasks</span>
                        </>
                      )}
                    </div>
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full p-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        {suggestion.type === 'user' && (
                          <AtSign size={14} className="text-blue-500" />
                        )}
                        {suggestion.type === 'milestone' && (
                          <Hash size={14} className="text-yellow-500" />
                        )}
                        {suggestion.type === 'project' && (
                          <Users size={14} className="text-green-500" />
                        )}
                        {suggestion.type === 'task' && (
                          <CheckSquare size={14} className="text-purple-500" />
                        )}
                        <span className="truncate">{suggestion.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <Send size={16} />
              </button>
            </form>

            <div className="mt-2 text-xs text-gray-500 flex items-center gap-4">
              <span className="flex items-center gap-1">
                <AtSign size={10} />
                @user
              </span>
              <span className="flex items-center gap-1">
                <Hash size={10} />
                #milestone
              </span>
              <span className="flex items-center gap-1">
                <Users size={10} />
                &project
              </span>
              <span className="flex items-center gap-1">
                <CheckSquare size={10} />
                $task
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatDrawerAdvanced
