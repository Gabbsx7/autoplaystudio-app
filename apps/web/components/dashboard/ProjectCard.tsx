// components/dashboard/ProjectCard.tsx - Responsivo
'use client'

import React from 'react'
import { ChevronRight, Calendar, Users, Clock } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  avatar: string
}

interface Milestone {
  id: string
  name: string
  status: 'completed' | 'in_progress' | 'pending'
}

interface ProjectCardProps {
  id: string
  title: string
  description: string
  status: 'in_progress' | 'draft' | 'proposal'
  teamMembers: TeamMember[]
  milestones?: Milestone[]
  progress?: number
  dueDate?: string
  onClick?: () => void
  className?: string
  viewMode?: 'grid' | 'list'
}

const statusConfig = {
  in_progress: {
    bgColor: 'bg-amber-300',
    textColor: 'text-yellow-100',
    label: 'IN PROGRESS',
    dotColor: 'bg-lime-600',
  },
  draft: {
    bgColor: 'bg-blue-400',
    textColor: 'text-yellow-100',
    label: 'DRAFT',
    dotColor: 'bg-neutral-400',
  },
  proposal: {
    bgColor: 'bg-pink-400',
    textColor: 'text-yellow-100',
    label: 'PROPOSAL',
    dotColor: 'bg-neutral-400',
  },
}

const milestoneStatusConfig = {
  completed: 'bg-green-400',
  in_progress: 'bg-amber-300',
  pending: 'bg-zinc-300',
}

export function ProjectCard({
  id,
  title,
  description,
  status,
  teamMembers,
  milestones = [],
  progress = 0,
  dueDate,
  onClick,
  className,
  viewMode = 'grid',
}: ProjectCardProps) {
  const config = statusConfig[status]

  if (viewMode === 'list') {
    return (
      <div
        className={`w-full rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer ${
          className || ''
        }`}
        onClick={onClick}
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            {/* Left side - Project info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {title}
                </h3>
                {/* Status Badge */}
                <div
                  className={`h-6 px-3 py-1 ${config.bgColor} rounded-full flex items-center`}
                >
                  <span
                    className={`text-center ${config.textColor} text-xs font-medium whitespace-nowrap`}
                  >
                    {config.label}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {description}
              </p>

              {/* Progress Bar */}
              {progress > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium text-gray-900">
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Milestones */}
              {status === 'in_progress' && milestones.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {milestones.slice(0, 4).map((milestone) => (
                    <div
                      key={milestone.id}
                      className={`px-2 py-1 ${
                        milestoneStatusConfig[milestone.status]
                      } rounded text-xs font-medium text-gray-700`}
                    >
                      {milestone.name}
                    </div>
                  ))}
                  {milestones.length > 4 && (
                    <div className="px-2 py-1 bg-gray-200 rounded text-xs font-medium text-gray-600">
                      +{milestones.length - 4} more
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right side - Meta info */}
            <div className="flex flex-col items-end gap-4 ml-6">
              {/* Team Members */}
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-400" />
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

              {/* Due Date */}
              {dueDate && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={14} />
                  <span>{new Date(dueDate).toLocaleDateString()}</span>
                </div>
              )}

              {/* Action Button */}
              <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <ChevronRight size={16} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid view (original)
  return (
    <div
      className={`w-full h-full min-h-[320px] max-h-[340px] p-5 rounded-2xl shadow-md flex flex-col justify-between gap-4 hover:shadow-lg transition-shadow cursor-pointer ${
        className || ''
      }`}
      onClick={onClick}
      style={{ boxSizing: 'border-box' }}
    >
      {/* Avatares */}
      <div className="flex items-center mb-2">
        {teamMembers.slice(0, 4).map((member, idx) => (
          <div
            key={member.id}
            className={`w-7 h-7 rounded-full overflow-hidden outline outline-2 outline-offset-[-2px] outline-zinc-200${
              idx > 0 ? ' -ml-2' : ''
            }`}
          >
            <img
              className="w-7 h-7 object-cover"
              src={member.avatar}
              alt={member.name}
            />
          </div>
        ))}
      </div>
      {/* Status */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${config.bgColor} ${config.textColor}`}
        >
          {config.label}
        </span>
        <span className={`w-2 h-2 rounded-full ${config.dotColor}`}></span>
      </div>
      {/* Nome e descrição */}
      <div className="mb-2 flex-1">
        <div className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
          {title}
        </div>
        <div className="text-gray-500 text-sm line-clamp-2">{description}</div>
      </div>
      {/* Milestones */}
      <div className="flex flex-wrap gap-2 mb-2">
        {milestones.map((milestone, idx) => (
          <span
            key={milestone.id}
            className={`px-2 py-0.5 text-xs rounded ${
              milestoneStatusConfig[milestone.status]
            } text-white`}
          >
            {milestone.name}
          </span>
        ))}
      </div>
      {/* Botão de ação */}
      <div className="flex justify-end">
        <button className="px-4 py-1 bg-black text-white rounded-full text-xs font-medium hover:bg-gray-800 transition-colors">
          &gt;
        </button>
      </div>
    </div>
  )
}

export default ProjectCard
