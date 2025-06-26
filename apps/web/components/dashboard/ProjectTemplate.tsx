'use client'

import React from 'react'

interface ProjectTemplateProps {
  id: string
  title: string
  description: string
  type: 'template' | 'project'
  backgroundImage?: string
  width?: 'narrow' | 'wide' | 'medium'
  onClick?: () => void
  className?: string
}

const widthClasses = {
  narrow: 'w-64',
  medium: 'w-[553px]',
  wide: 'w-[1153px]',
}

export function ProjectTemplate({
  id,
  title,
  description,
  type,
  backgroundImage,
  width = 'narrow',
  onClick,
  className,
}: ProjectTemplateProps) {
  const buttonText = type === 'template' ? 'NEW PROJECT' : 'VIEW PROJECT'

  return (
    <div
      className={`${
        widthClasses[width]
      } h-96 bg-gradient-to-b from-black/0 to-black rounded-lg shadow-[1px_2px_4px_0px_rgba(0,0,0,0.10)] inline-flex flex-col justify-end items-start gap-2.5 cursor-pointer hover:shadow-lg transition-shadow relative overflow-hidden ${
        className || ''
      }`}
      onClick={onClick}
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-96 h-44 p-5 rounded shadow-[1px_2px_4px_0px_rgba(0,0,0,0.10)] flex flex-col justify-start items-start gap-[5px] relative z-10">
        <div className="py-[5px] flex flex-col justify-start items-start gap-2.5">
          <div className="w-72 justify-start text-white text-xl font-medium font-['Inter'] line-clamp-2">
            {title}
          </div>
          <div className="w-96 justify-start text-white text-[10px] font-normal font-['Inter'] line-clamp-3">
            {description}
          </div>
        </div>

        <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-2.5">
          <button className="px-6 py-1.5 bg-white rounded-[50px] inline-flex justify-center items-center gap-2.5 hover:bg-gray-100 transition-colors">
            <div className="justify-start text-black text-xs font-normal font-['Inter']">
              {buttonText}
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProjectTemplate
