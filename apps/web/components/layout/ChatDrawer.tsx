'use client'

import React, { useState, useEffect } from 'react'
import { MessageCircle, Send, X, Users, Hash, AtSign } from 'lucide-react'
import { useChatAdvanced, useNotifications } from '@/hooks'
import { renderMessageWithMentions } from '@/lib/utils/render-mentions'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface ChatDrawerProps {
  channel?: string
  clientId?: string
}

interface User {
  id: string
  name: string
  email: string
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({
  channel = 'public-chat',
  clientId,
}) => {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false)
  const [mentionType, setMentionType] = useState<
    'user' | 'project' | 'milestone' | null
  >(null)

  const supabase = createClientComponentClient()
  const { messages, sendMessage, loading, currentUser } = useChatAdvanced(
    clientId ? `chat:client-${clientId}` : channel
  )
  const { notifications } = useNotifications()

  // Current user is provided by useChatAdvanced hook

  // Detectar quando o usuário está digitando menções
  useEffect(() => {
    const lastChar = inputValue.slice(-1)
    const words = inputValue.split(/\s/)
    const lastWord = words[words.length - 1]

    if (lastWord.startsWith('@')) {
      setShowMentionSuggestions(true)
      setMentionType('user')
    } else if (lastWord.startsWith('#')) {
      setShowMentionSuggestions(true)
      setMentionType('milestone')
    } else if (lastWord.startsWith('&')) {
      setShowMentionSuggestions(true)
      setMentionType('project')
    } else {
      setShowMentionSuggestions(false)
      setMentionType(null)
    }
  }, [inputValue])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || !currentUser) return

    try {
      await sendMessage(inputValue.trim())
      setInputValue('')
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Contar notificações não lidas relacionadas ao chat
  const unreadChatNotifications = notifications.filter(
    (n) => n.type === 'mention' && !n.is_read
  ).length

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
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b bg-gray-50">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} className="text-gray-600" />
              <h3 className="font-semibold text-gray-800">
                Chat {clientId ? `- Cliente` : '- Geral'}
              </h3>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </header>

          {/* Messages */}
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
                  <p>Nenhuma mensagem ainda</p>
                  <p className="text-sm">
                    Seja o primeiro a enviar uma mensagem!
                  </p>
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

          {/* Input */}
          <div className="p-4 border-t bg-gray-50">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Digite sua mensagem... (@usuário #milestone &projeto)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                {/* Suggestions for mentions */}
                {showMentionSuggestions && (
                  <div className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg max-h-32 overflow-y-auto">
                    <div className="p-2 text-xs text-gray-500 border-b">
                      {mentionType === 'user' && (
                        <div className="flex items-center gap-1">
                          <AtSign size={12} />
                          <span>Mencionar usuário</span>
                        </div>
                      )}
                      {mentionType === 'milestone' && (
                        <div className="flex items-center gap-1">
                          <Hash size={12} />
                          <span>Mencionar milestone</span>
                        </div>
                      )}
                      {mentionType === 'project' && (
                        <div className="flex items-center gap-1">
                          <Users size={12} />
                          <span>Mencionar projeto</span>
                        </div>
                      )}
                    </div>
                    <div className="p-2 text-xs text-gray-400">
                      Digite para buscar...
                    </div>
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

            {/* Mention help */}
            <div className="mt-2 text-xs text-gray-500 flex items-center gap-4">
              <span className="flex items-center gap-1">
                <AtSign size={10} />
                @usuário
              </span>
              <span className="flex items-center gap-1">
                <Hash size={10} />
                #milestone
              </span>
              <span className="flex items-center gap-1">
                <Users size={10} />
                &projeto
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatDrawer
