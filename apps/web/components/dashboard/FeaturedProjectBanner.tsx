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
    image?: string
  }
  onClick?: () => void
  className?: string
}

export function FeaturedProjectBanner({
  project,
  onClick,
  className,
}: FeaturedProjectBannerProps) {
  const bgImage =
    project.image ||
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=900&q=80'
  return (
    <div
      className={`w-full min-h-[260px] md:min-h-[320px] rounded-xl overflow-hidden shadow-md relative flex items-end ${
        className || ''
      }`}
      onClick={onClick}
      style={{
        background: `url('${bgImage}') center center / cover no-repeat`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      <div className="relative z-10 p-6 md:p-10 flex flex-col items-start justify-end w-full max-w-[600px]">
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">
          {project.title}
        </h2>
        <p className="text-white text-base md:text-lg mb-6 drop-shadow-lg line-clamp-2">
          {project.description}
        </p>
        <button className="px-6 py-2 bg-white text-black border border-black rounded-[99px] font-semibold text-base hover:bg-gray-100 transition-colors">
          VIEW PROJECT
        </button>
      </div>
    </div>
  )
}

export default FeaturedProjectBanner
