'use client'

import React from 'react'

interface FeaturedProjectBannerProps {
  title: string
  description: string
  onClick?: () => void
  className?: string
}

export function FeaturedProjectBanner({
  title,
  description,
  onClick,
  className,
}: FeaturedProjectBannerProps) {
  return (
    <div
      className={`w-full max-w-[1153px] h-44 p-5 rounded shadow-[1px_2px_4px_0px_rgba(0,0,0,0.10)] inline-flex flex-col justify-start items-center gap-[5px] bg-white cursor-pointer hover:shadow-lg transition-shadow ${
        className || ''
      }`}
      onClick={onClick}
    >
      <div className="py-[5px] flex flex-col justify-start items-center gap-2.5">
        <div className="w-[611px] text-center justify-start text-black text-4xl font-medium font-['Inter'] line-clamp-2">
          {title}
        </div>
        <div className="w-[571px] text-center justify-start text-black text-[10px] font-normal font-['Inter'] line-clamp-3">
          {description}
        </div>
      </div>

      <div className="self-stretch flex-1 flex flex-col justify-start items-center gap-2.5">
        <button className="px-6 py-1.5 bg-black rounded-[50px] inline-flex justify-center items-center gap-2.5 hover:bg-gray-800 transition-colors">
          <div className="justify-start text-white text-xs font-normal font-['Inter']">
            VIEW PROJECT
          </div>
        </button>
      </div>
    </div>
  )
}

export default FeaturedProjectBanner
