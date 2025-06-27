'use client'

import React from 'react'
import {
  MessageSquare,
  CheckCircle,
  Upload,
  Clock,
  MoreHorizontal,
} from 'lucide-react'

interface RecentUpdateProps {
  id: string
  type: 'comment' | 'milestone' | 'asset' | 'project'
  message: string
  project: string
  time: string
  user: string
  onClick?: () => void
}

export function RecentUpdateCard({
  type,
  message,
  project,
  time,
  user,
  onClick,
}: RecentUpdateProps) {
  const getIcon = () => {
    switch (type) {
      case 'comment':
        return <MessageSquare size={16} className="text-blue-500" />
      case 'milestone':
        return <CheckCircle size={16} className="text-green-500" />
      case 'asset':
        return <Upload size={16} className="text-purple-500" />
      case 'project':
        return <CheckCircle size={16} className="text-orange-500" />
      default:
        return <Clock size={16} className="text-gray-400" />
    }
  }

  const getTypeLabel = () => {
    switch (type) {
      case 'comment':
        return 'Comment'
      case 'milestone':
        return 'Milestone'
      case 'asset':
        return 'Asset'
      case 'project':
        return 'Project'
      default:
        return 'Update'
    }
  }

  return (
    <div
      className="w-full rounded-lg border border-gray-100 p-4 cursor-pointer hover:shadow-sm transition-all duration-200 hover:border-gray-200"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
            {getIcon()}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm text-gray-900 font-medium line-clamp-2 mb-1">
                {message}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <span className="font-medium">{user}</span>
                <span>•</span>
                <span>{getTypeLabel()}</span>
                <span>•</span>
                <span className="truncate">{project}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock size={12} />
                <span>{time}</span>
              </div>
            </div>

            {/* Action Menu */}
            <button className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors">
              <MoreHorizontal size={14} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecentUpdateCard
