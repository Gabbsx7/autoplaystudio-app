'use client'

import React from 'react'

interface ProjectTemplateProps {
  title: string
  description: string
  image?: string
  onClick?: () => void
}

export const ProjectTemplate: React.FC<ProjectTemplateProps> = ({
  title,
  description,
  image,
  onClick,
}) => {
  const bgImage =
    image ||
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=900&q=80'
  return (
    <div
      className="w-full min-h-[260px] md:min-h-[280px] rounded-xl overflow-hidden shadow-md relative flex items-end cursor-pointer"
      style={{
        background: `url('${bgImage}') center center / cover no-repeat`,
      }}
      onClick={onClick}
    >
      {/* Overlay escuro com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      {/* Conteúdo */}
      <div className="relative z-10 p-6 md:p-8 flex flex-col items-start justify-end w-full max-w-[420px]">
        <h2 className="text-white text-xl md:text-2xl font-semibold mb-2 drop-shadow-lg">
          {title}
        </h2>
        <p className="text-white text-base mb-6 drop-shadow-lg line-clamp-2 overflow-hidden text-ellipsis whitespace-normal break-words max-w-full">
          {description}
        </p>
        <button className="px-6 py-2 bg-white text-black border border-black rounded-[99px] font-semibold text-base hover:bg-gray-100 transition-colors">
          VIEW PROJECT
        </button>
      </div>
    </div>
  )
}

export default ProjectTemplate
