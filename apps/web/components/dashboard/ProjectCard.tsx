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
  status:
    | 'active'
    | 'in_progress'
    | 'completed'
    | 'paused'
    | 'cancelled'
    | 'draft'
    | 'proposal'
  teamMembers: TeamMember[]
  milestones?: Milestone[]
  progress?: number
  dueDate?: string
  onClick?: () => void
  className?: string
  viewMode?: 'grid' | 'list'
}

const statusConfig = {
  active: {
    bgColor: 'bg-amber-300',
    textColor: 'text-yellow-100',
    label: 'IN PROGRESS',
    dotColor: 'bg-lime-600',
  },
  in_progress: {
    bgColor: 'bg-amber-300',
    textColor: 'text-yellow-100',
    label: 'IN PROGRESS',
    dotColor: 'bg-lime-600',
  },
  completed: {
    bgColor: 'bg-green-400',
    textColor: 'text-white',
    label: 'COMPLETED',
    dotColor: 'bg-green-600',
  },
  paused: {
    bgColor: 'bg-gray-400',
    textColor: 'text-white',
    label: 'PAUSED',
    dotColor: 'bg-gray-600',
  },
  cancelled: {
    bgColor: 'bg-red-400',
    textColor: 'text-white',
    label: 'CANCELLED',
    dotColor: 'bg-red-600',
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
  const config = statusConfig[status] || statusConfig.active // Fallback para status ativo

  // Grid view (Figma-like)
  return (
    <div
      className={`bg-white w-full h-full min-h-[200px] max-w-[370px] p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between transition-shadow hover:shadow-md ${
        className || ''
      }`}
      onClick={onClick}
    >
      {/* Top: Avatares e status */}
      <div className="flex items-start justify-between mb-2">
        {/* Avatares sobrepostos */}
        <div className="flex -space-x-2">
          {teamMembers.slice(0, 3).map((member, idx) => (
            <img
              key={member.id}
              src={member.avatar}
              alt={member.name}
              className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm"
              style={{ zIndex: 10 - idx }}
            />
          ))}
        </div>
        {/* Badge de status */}
        <div
          className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${config.bgColor} text-white`}
        >
          {config.label}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
            {title}
          </h3>
          <p className="text-gray-500 text-sm mb-3 line-clamp-2">
            {description}
          </p>
        </div>
        {/* Milestones */}
        {milestones && milestones.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {milestones.slice(0, 3).map((milestone) => (
              <span
                key={milestone.id}
                className={`px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-medium`}
              >
                {milestone.name}
              </span>
            ))}
            {milestones.length > 3 && (
              <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-600 text-xs font-medium">
                +{milestones.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Botão de ação */}
      <div className="flex justify-end mt-4">
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-black hover:bg-gray-800 transition-colors">
          <ChevronRight size={18} className="text-white" />
        </button>
      </div>
    </div>
  )
}

export default ProjectCard
