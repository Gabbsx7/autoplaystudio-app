import React from 'react'
import { Avatar } from './Avatar'

interface AvatarGroupProps {
  users: Array<{
    id: string
    name: string
    avatar_url?: string
  }>
  max?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function AvatarGroup({
  users,
  max = 3,
  size = 'md',
  className = '',
}: AvatarGroupProps) {
  const displayUsers = users.slice(0, max)
  const remainingCount = users.length - max

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {displayUsers.map((user, index) => (
        <Avatar
          key={user.id}
          name={user.name}
          avatarUrl={user.avatar_url}
          size={size}
          className="ring-2 ring-white"
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={`
          rounded-full flex items-center justify-center font-semibold text-white
          bg-gray-300 ring-2 ring-white
          ${
            size === 'sm'
              ? 'w-6 h-6 text-xs'
              : size === 'md'
              ? 'w-8 h-8 text-sm'
              : size === 'lg'
              ? 'w-10 h-10 text-base'
              : 'w-12 h-12 text-lg'
          }
        `}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  )
}
