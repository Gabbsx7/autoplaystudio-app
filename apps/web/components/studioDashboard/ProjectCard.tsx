'use client'

import React from 'react'
import { ChevronRight, Folder, Calendar, Users } from 'lucide-react'

interface ProjectCardProps {
  id: string
  name: string
  client: string
  status: 'active' | 'completed' | 'pending' | 'draft'
  assetsCount: number
  milestonesCount: number
  dueDate?: string
  teamMembers?: Array<{
    id: string
    name: string
    avatar: string
  }>
  onClick?: () => void
  className?: string
}

const statusConfig = {
  active: {
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    label: 'ACTIVE',
  },
  completed: {
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    label: 'COMPLETED',
  },
  pending: {
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    label: 'PENDING',
  },
  draft: {
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    label: 'DRAFT',
  },
}

export default function ProjectCard({
  id,
  name,
  client,
  status,
  assetsCount,
  milestonesCount,
  dueDate,
  teamMembers = [],
  onClick,
  className,
}: ProjectCardProps) {
  const config = statusConfig[status]

  return (
    <div
      className={`w-full rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer bg-white ${
        className || ''
      }`}
      onClick={onClick}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
              {name}
            </h3>
            <p className="text-sm text-gray-600 mb-2">Client: {client}</p>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${config.bgColor} ${config.textColor}`}
              >
                {config.label}
              </span>
              {dueDate && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(dueDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Folder className="w-4 h-4" />
            <span>{assetsCount} assets</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{milestonesCount} milestones</span>
          </div>
        </div>

        {/* Team Members */}
        {teamMembers.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {teamMembers.slice(0, 3).map((member, index) => (
                <div
                  key={member.id}
                  className={`w-6 h-6 bg-white rounded-full overflow-hidden border border-gray-200 ${
                    index > 0 ? '-ml-1' : ''
                  }`}
                >
                  <img
                    className="w-6 h-6 object-cover"
                    src={member.avatar}
                    alt={member.name}
                  />
                </div>
              ))}
              {teamMembers.length > 3 && (
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 border border-gray-200 -ml-1">
                  +{teamMembers.length - 3}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onClick?.()
            }}
          >
            View Dashboard
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
