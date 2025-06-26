// components/dashboard/ProjectCard.tsx - Responsivo
'use client'

import React from 'react'
import { ChevronRight } from 'lucide-react'

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
  onClick?: () => void
  className?: string
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
  onClick,
  className,
}: ProjectCardProps) {
  const config = statusConfig[status]

  return (
    <div
      className={`w-full max-w-sm mx-auto lg:max-w-none lg:w-96 h-48 p-5 bg-white rounded shadow-[1px_2px_4px_0px_rgba(0,0,0,0.10)] flex flex-col justify-start items-start gap-[5px] hover:shadow-lg transition-shadow cursor-pointer ${
        className || ''
      }`}
      onClick={onClick}
    >
      {/* Header with Team Members and Status */}
      <div className="w-full flex justify-between items-start gap-2.5">
        {/* Team Member Avatars */}
        <div className="flex items-center">
          {teamMembers.slice(0, 4).map((member, index) => (
            <div
              key={member.id}
              className={`w-4 h-4 bg-white rounded-full overflow-hidden ${
                index > 0
                  ? 'outline outline-1 outline-offset-[-1px] outline-zinc-200 -ml-1'
                  : ''
              }`}
            >
              <img
                className="w-4 h-4 object-cover"
                src={member.avatar}
                alt={member.name}
              />
            </div>
          ))}

          {teamMembers.length > 4 && (
            <div className="w-4 h-4 bg-zinc-200 rounded-full flex items-center justify-center text-[6px] font-medium text-zinc-600 outline outline-1 outline-offset-[-1px] outline-zinc-200 -ml-1">
              +{teamMembers.length - 4}
            </div>
          )}
        </div>

        {/* Status Section */}
        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <div
            className={`h-3.5 px-2 py-1 ${config.bgColor} rounded-[20px] flex justify-center items-center`}
          >
            <span
              className={`text-center ${config.textColor} text-[8px] font-normal font-['Inter'] whitespace-nowrap`}
            >
              {config.label}
            </span>
          </div>

          {/* Status Dot */}
          <div className={`w-[5px] h-[5px] ${config.dotColor} rounded-full`} />
        </div>
      </div>

      {/* Project Info */}
      <div className="w-full flex flex-col justify-start items-start gap-2.5 flex-1">
        <h3 className="w-full text-black text-lg lg:text-xl font-medium font-['Inter'] line-clamp-1">
          {title}
        </h3>
        <p className="w-full text-zinc-600 text-[10px] font-normal font-['Inter'] line-clamp-2">
          {description}
        </p>
      </div>

      {/* Milestones - Only show for in_progress projects */}
      {status === 'in_progress' && milestones.length > 0 && (
        <div className="w-full flex justify-start items-end gap-[5px] flex-wrap">
          {milestones.slice(0, 4).map((milestone) => (
            <div
              key={milestone.id}
              className={`px-[5px] py-0.5 ${
                milestoneStatusConfig[milestone.status]
              } rounded-[5px] flex justify-center items-center`}
            >
              <span className="text-stone-500 text-[10px] font-normal font-['Inter']">
                {milestone.name}
              </span>
            </div>
          ))}

          {milestones.length > 4 && (
            <div className="px-[5px] py-0.5 bg-zinc-300 rounded-[5px] flex justify-center items-center">
              <span className="text-zinc-500 text-[10px] font-normal font-['Inter']">
                +{milestones.length - 4} more
              </span>
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      <div className="w-full flex justify-end items-end">
        <button className="px-6 py-1.5 bg-black rounded-[50px] flex justify-center items-center hover:bg-gray-800 transition-colors">
          <ChevronRight className="text-white" size={12} />
        </button>
      </div>
    </div>
  )
}

export default ProjectCard
