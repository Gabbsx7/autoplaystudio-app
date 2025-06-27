'use client'

import React from 'react'
import { ChevronRight, Users, Calendar, Clock } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  avatar: string
}

interface FeaturedProjectBannerProps {
  project: {
    id: string
    title: string
    description: string
    status: string
    progress: number
    teamMembers: TeamMember[]
    dueDate?: string
  }
  onClick?: () => void
  className?: string
}

export function FeaturedProjectBanner({
  project,
  onClick,
  className,
}: FeaturedProjectBannerProps) {
  return (
    <div
      className={`w-full min-h-[260px] bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-md border border-blue-100 p-5 sm:p-6 md:p-8 cursor-pointer hover:shadow-lg transition-all duration-200 ${
        className || ''
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 md:gap-6">
        {/* Left side - Project info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
              Featured Project
            </span>
            <span className="px-3 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
              {project.status.toUpperCase()}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
            {project.title}
          </h2>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {project.description}
          </p>
          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600">Project Progress</span>
              <span className="text-xs font-semibold text-gray-900">
                {project.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
          {/* Meta info */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{project.teamMembers.length} team members</span>
            </div>
            {project.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>
                  Due {new Date(project.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
        {/* Right side - Team members and action */}
        <div className="flex flex-col items-center gap-3">
          {/* Team Members */}
          <div className="flex items-center">
            {project.teamMembers.slice(0, 4).map((member, index) => (
              <div
                key={member.id}
                className={`w-8 h-8 bg-white rounded-full overflow-hidden border-2 border-white shadow-sm ${
                  index > 0 ? '-ml-2' : ''
                }`}
              >
                <img
                  className="w-8 h-8 object-cover"
                  src={member.avatar}
                  alt={member.name}
                />
              </div>
            ))}
            {project.teamMembers.length > 4 && (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white shadow-sm -ml-2">
                +{project.teamMembers.length - 4}
              </div>
            )}
          </div>
          {/* Action Button */}
          <button className="inline-flex items-center px-5 py-2 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors shadow text-sm">
            <span>View Project</span>
            <ChevronRight size={16} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default FeaturedProjectBanner
