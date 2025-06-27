'use client'

import React from 'react'

interface ProjectTemplateProps {
  title: string
  description: string
  onClick?: () => void
  className?: string
}

export function ProjectTemplate({
  title,
  description,
  onClick,
  className,
}: ProjectTemplateProps) {
  return (
    <div
      className={`w-full min-h-[320px] bg-gradient-to-b from-zinc-900/80 to-black rounded-2xl shadow-xl flex flex-col justify-between items-center p-8 ${
        className || ''
      }`}
      onClick={onClick}
    >
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-xs mx-auto">
        <div className="text-2xl font-bold text-white mb-3 text-center break-words line-clamp-2 w-full">
          {title}
        </div>
        <div className="text-white text-sm mb-6 opacity-80 text-center break-words line-clamp-3 w-full">
          {description}
        </div>
      </div>
      <button className="px-6 py-2 bg-white rounded-full text-black font-semibold text-base shadow hover:bg-zinc-100 transition w-full max-w-[180px] mx-auto">
        NEW PROJECT
      </button>
    </div>
  )
}

export default ProjectTemplate
