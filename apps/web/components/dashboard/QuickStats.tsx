'use client'

import React from 'react'
import { TrendingUp, CheckCircle, Clock, FileText } from 'lucide-react'

interface QuickStatsProps {
  stats: {
    activeProjects: number
    completedProjects: number
    totalAssets: number
    pendingReviews: number
  }
  className?: string
}

export function QuickStats({ stats, className }: QuickStatsProps) {
  const statItems = [
    {
      label: 'Active Projects',
      value: stats.activeProjects,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Completed',
      value: stats.completedProjects,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Total Assets',
      value: stats.totalAssets,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Pending Reviews',
      value: stats.pendingReviews,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <div className={`rounded-lg shadow-sm p-6 ${className || ''}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Project Overview
      </h3>

      <div className="space-y-4">
        {statItems.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 ${item.bgColor} rounded-lg flex items-center justify-center`}
                >
                  <Icon size={16} className={item.color} />
                </div>
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {item.value}
              </span>
            </div>
          )
        })}
      </div>

      {/* Progress Summary */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Overall Progress</span>
          <span className="text-sm font-semibold text-gray-900">
            {Math.round(
              (stats.completedProjects /
                (stats.activeProjects + stats.completedProjects)) *
                100
            )}
            %
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${Math.round(
                (stats.completedProjects /
                  (stats.activeProjects + stats.completedProjects)) *
                  100
              )}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default QuickStats
