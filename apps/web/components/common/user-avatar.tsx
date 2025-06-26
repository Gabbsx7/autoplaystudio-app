'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronDown, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/components/auth/auth-provider'

interface UserAvatarProps {
  src: string
  alt: string
  status?: 'online' | 'away' | 'offline'
  borderColor?: string
  showDropdown?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function UserAvatar({
  src,
  alt,
  status,
  borderColor = 'zinc-200',
  showDropdown = false,
  size = 'md',
}: UserAvatarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { signOut } = useAuth()

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    offline: 'bg-gray-400',
  }

  return (
    <div className="relative">
      <div
        className={`${sizeClasses[size]} bg-white rounded-full outline outline-2 outline-offset-[-2px] outline-${borderColor} overflow-hidden relative cursor-pointer`}
        onClick={() => showDropdown && setIsDropdownOpen(!isDropdownOpen)}
      >
        <Image
          width={32}
          height={32}
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />

        {/* Status indicator */}
        {status && (
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${statusColors[status]} rounded-full border border-white`}
          />
        )}

        {/* Dropdown arrow */}
        {showDropdown && (
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </div>
        )}
      </div>

      {/* Dropdown menu */}
      {showDropdown && isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-2">
            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </button>
            <button
              onClick={signOut}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
