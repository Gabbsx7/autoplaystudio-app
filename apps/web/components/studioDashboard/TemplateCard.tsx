'use client'

import React from 'react'
import { Plus } from 'lucide-react'

interface TemplateCardProps {
  title: string
  description: string
  gradient?: string
  onClick?: () => void
  className?: string
}

export default function TemplateCard({
  title,
  description,
  gradient = 'from-zinc-900/80 to-black',
  onClick,
  className,
}: TemplateCardProps) {
  return (
    <div
      className={`rounded-2xl shadow bg-gradient-to-b ${gradient} p-6 flex flex-col justify-end items-start min-h-[260px] max-w-full hover:shadow-lg transition-shadow cursor-pointer ${
        className || ''
      }`}
      onClick={onClick}
    >
      <div className="text-white">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-300 mb-4 line-clamp-3">{description}</p>
        <button
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onClick?.()
          }}
        >
          <Plus className="w-4 h-4" />
          NEW PROJECT
        </button>
      </div>
    </div>
  )
}
