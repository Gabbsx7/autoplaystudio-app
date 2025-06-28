'use client'

import React from 'react'
import { Users, Folder, Calendar, ChevronRight } from 'lucide-react'

interface ClientCardProps {
  id: string
  name: string
  description?: string
  projectsCount: number
  membersCount: number
  lastActive?: string
  status?: 'active' | 'inactive' | 'pending'
  logo?: string
  onClick?: () => void
  className?: string
}

const statusConfig = {
  active: {
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    label: 'ACTIVE',
  },
  inactive: {
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    label: 'INACTIVE',
  },
  pending: {
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    label: 'PENDING',
  },
}

export default function ClientCard({
  id,
  name,
  description,
  projectsCount,
  membersCount,
  lastActive,
  status = 'active',
  logo,
  onClick,
  className,
}: ClientCardProps) {
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
          <div className="flex items-center gap-3">
            {logo ? (
              <img
                src={logo}
                alt={`${name} logo`}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-lg font-semibold text-gray-600">
                  {name.charAt(0)}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {name}
              </h3>
              {description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {description}
                </p>
              )}
            </div>
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${config.bgColor} ${config.textColor}`}
          >
            {config.label}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {projectsCount}
              </p>
              <p className="text-xs text-gray-500">Projects</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {membersCount}
              </p>
              <p className="text-xs text-gray-500">Members</p>
            </div>
          </div>
        </div>

        {/* Last Active */}
        {lastActive && (
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Last active: {lastActive}</span>
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
