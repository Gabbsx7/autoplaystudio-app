'use client'

import React from 'react'
import { Avatar } from '@/components/common/Avatar'
import { Badge } from 'lucide-react'

interface MemberCardProps {
  id: string
  name: string
  role: string
  client?: string
  avatar: string
  isFTE?: boolean
  email?: string
  onClick?: () => void
  className?: string
}

export default function MemberCard({
  id,
  name,
  role,
  client,
  avatar,
  isFTE = false,
  email,
  onClick,
  className,
}: MemberCardProps) {
  return (
    <div
      className={`w-full rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer bg-white ${
        className || ''
      }`}
      onClick={onClick}
    >
      <div className="p-6">
        {/* Header with Avatar and FTE Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar name={name} avatarUrl={avatar} size="lg" />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {name}
              </h3>
              <p className="text-sm text-gray-600 truncate">{role}</p>
              {client && (
                <p className="text-xs text-gray-500 truncate">{client}</p>
              )}
            </div>
          </div>
          {isFTE && (
            <div className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              FTE
            </div>
          )}
        </div>

        {/* Contact Info */}
        {email && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600 truncate">{email}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
          <button className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            View Profile
          </button>
          <button className="px-3 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            Message
          </button>
        </div>
      </div>
    </div>
  )
}
