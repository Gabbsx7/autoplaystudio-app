'use client'

import React from 'react'
import { File, Folder } from 'lucide-react'

interface RecentUpdateProps {
  id: string
  title: string
  type: 'project' | 'client' | 'file'
  subtitle?: string
  projectCount?: number
  assetCount?: number
  onClick?: () => void
}

export function RecentUpdateCard({
  title,
  type,
  subtitle,
  projectCount,
  assetCount,
  onClick,
}: RecentUpdateProps) {
  const renderIcon = () => {
    switch (type) {
      case 'file':
        return <File className="w-3 h-3.5" />
      case 'client':
        return (
          <div className="w-6 h-7 relative">
            <div className="w-3.5 h-3.5 left-[6px] top-[5.62px] absolute border border-neutral-800" />
            <div className="w-3.5 h-3.5 left-[3px] top-[9px] absolute rounded-sm border border-neutral-800" />
          </div>
        )
      default:
        return <File className="w-3.5 h-3.5" />
    }
  }

  return (
    <div
      className="w-64 h-28 bg-white rounded shadow-[1px_2px_4px_0px_rgba(0,0,0,0.10)] p-4 cursor-pointer hover:shadow-md transition-shadow relative"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 text-neutral-800">{renderIcon()}</div>

        <div className="flex-1 min-w-0">
          <h4 className="text-black text-xs font-medium font-['Inter'] line-clamp-2 mb-1">
            {title}
          </h4>

          {type === 'client' &&
          (projectCount !== undefined || assetCount !== undefined) ? (
            <div className="flex gap-4 mt-auto">
              {projectCount !== undefined && (
                <span className="text-neutral-500 text-[10px] font-medium font-['Inter']">
                  {projectCount} Projects
                </span>
              )}
              {assetCount !== undefined && (
                <span className="text-neutral-400 text-[10px] font-medium font-['Inter']">
                  {assetCount} Assets
                </span>
              )}
            </div>
          ) : subtitle ? (
            <p className="text-neutral-400 text-[10px] font-medium font-['Inter'] mt-auto">
              {subtitle}
            </p>
          ) : null}
        </div>

        <button className="self-start p-1 hover:bg-gray-100 rounded">
          <div className="flex flex-col gap-1">
            <div className="w-0.5 h-0.5 bg-stone-500 rounded-full" />
            <div className="w-0.5 h-0.5 bg-stone-500 rounded-full" />
            <div className="w-0.5 h-0.5 bg-stone-500 rounded-full" />
          </div>
        </button>
      </div>
    </div>
  )
}

export default RecentUpdateCard
