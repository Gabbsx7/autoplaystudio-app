'use client'

import { cn } from '@/lib/utils'
import { renderMessageWithMentions } from '@/lib/utils/render-mentions'
import type { ChatMessage } from '@/hooks'

interface ChatMessageItemProps {
  message: ChatMessage
  isOwnMessage: boolean
  showHeader: boolean
  showAvatar?: boolean
}

export const ChatMessageItem = ({
  message,
  isOwnMessage,
  showHeader,
  showAvatar = true,
}: ChatMessageItemProps) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div
      className={cn(
        'flex gap-3 mb-4',
        isOwnMessage ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {showAvatar && (
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0',
            isOwnMessage
              ? 'bg-blue-500 text-white'
              : 'bg-gray-300 text-gray-700'
          )}
        >
          {getInitials(message.user.name)}
        </div>
      )}

      <div
        className={cn(
          'flex-1 min-w-0',
          !showAvatar && 'ml-11',
          isOwnMessage && !showAvatar && 'mr-11 ml-0'
        )}
      >
        {showHeader && (
          <div
            className={cn(
              'flex items-center gap-2 mb-1',
              isOwnMessage ? 'justify-end' : 'justify-start'
            )}
          >
            <span className="font-medium text-sm text-gray-900">
              {message.user.name}
            </span>
            <span className="text-xs text-gray-500">
              {formatTime(message.createdAt)}
            </span>
          </div>
        )}

        <div
          className={cn(
            'py-2 px-3 rounded-lg text-sm w-fit max-w-[75%] break-words',
            isOwnMessage
              ? 'bg-blue-500 text-white ml-auto'
              : 'bg-gray-100 text-gray-900'
          )}
        >
          {renderMessageWithMentions(message.content)}
        </div>
      </div>
    </div>
  )
}

interface TypingIndicatorProps {
  users: string[]
}

export const TypingIndicator = ({ users }: TypingIndicatorProps) => {
  if (users.length === 0) return null

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: '0.1s' }}
        ></div>
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: '0.2s' }}
        ></div>
      </div>
      <span>
        {users.length === 1
          ? `${users[0]} está digitando...`
          : `${users.length} pessoas estão digitando...`}
      </span>
    </div>
  )
}
