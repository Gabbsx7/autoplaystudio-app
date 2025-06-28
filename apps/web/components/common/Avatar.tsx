import React from 'react'

interface AvatarProps {
  name: string
  avatarUrl?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Avatar({
  name,
  avatarUrl,
  size = 'md',
  className = '',
}: AvatarProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
    xl: 'w-12 h-12 text-lg',
  }

  const getInitials = (name: string) => {
    if (!name) return '?'

    const names = name.trim().split(' ')
    if (names.length === 1) {
      return names[0][0]?.toUpperCase() || '?'
    }

    return (names[0][0] + names[names.length - 1][0]).toUpperCase()
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
    ]

    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
      />
    )
  }

  return (
    <div
      className={`
        rounded-full flex items-center justify-center font-semibold text-white
        ${sizeClasses[size]} ${getAvatarColor(name)} ${className}
      `}
    >
      {getInitials(name)}
    </div>
  )
}
