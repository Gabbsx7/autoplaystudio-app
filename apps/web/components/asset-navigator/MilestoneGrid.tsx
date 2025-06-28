'use client'

import React from 'react'
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface MilestoneGridProps {
  projectId: string
  onMilestoneSelect?: (milestoneId: string) => void
}

export function MilestoneGrid({
  projectId,
  onMilestoneSelect,
}: MilestoneGridProps) {
  // Mock data - will be replaced with API call
  const mockMilestones = [
    {
      id: 'milestone-1',
      title: 'Pre-production',
      status: 'completed',
      dueDate: '2024-01-15',
      assetsCount: 12,
      thumbnail:
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'milestone-2',
      title: 'Production Phase 1',
      status: 'in_progress',
      dueDate: '2024-02-01',
      assetsCount: 24,
      thumbnail:
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'milestone-3',
      title: 'Post-production',
      status: 'pending',
      dueDate: '2024-02-15',
      assetsCount: 8,
      thumbnail:
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'milestone-4',
      title: 'Final Delivery',
      status: 'pending',
      dueDate: '2024-03-01',
      assetsCount: 4,
      thumbnail:
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=300&q=80',
    },
  ]

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-100',
          label: 'Completed',
        }
      case 'in_progress':
        return {
          icon: Clock,
          color: 'text-blue-600',
          bg: 'bg-blue-100',
          label: 'In Progress',
        }
      case 'pending':
        return {
          icon: AlertCircle,
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          label: 'Pending',
        }
      default:
        return {
          icon: Clock,
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          label: 'Unknown',
        }
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockMilestones.map((milestone) => {
        const statusConfig = getStatusConfig(milestone.status)
        const StatusIcon = statusConfig.icon

        return (
          <div
            key={milestone.id}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onMilestoneSelect?.(milestone.id)}
          >
            {/* Thumbnail */}
            <div className="aspect-video w-full bg-gray-200 rounded-t-lg overflow-hidden">
              <img
                src={milestone.thumbnail}
                alt={milestone.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900 line-clamp-2">
                  {milestone.title}
                </h3>
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}
                >
                  <StatusIcon className="w-3 h-3" />
                  <span>{statusConfig.label}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(milestone.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                  {milestone.assetsCount} assets
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
