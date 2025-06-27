// components/dashboard/SearchBar.tsx - Responsivo
'use client'

import React from 'react'

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({
  onSearch,
  placeholder = 'Search for projects or assets',
  className,
}: {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <div
      className={`w-full max-w-[1162px] h-96 rounded-lg flex flex-col justify-center items-start gap-2.5 px-2 sm:px-4 md:px-8 ${
        className || ''
      }`}
    >
      <div className="w-[577px] h-56 p-5 rounded flex flex-col justify-start items-start gap-[5px]">
        <div className="py-[5px] flex flex-col justify-start items-start gap-2.5">
          <div className="w-[542px] justify-start text-black text-4xl font-normal font-['Inter']">
            Welcome back! Check out all the projects and assets
          </div>
        </div>
        <div className="self-stretch h-24 flex flex-col justify-center items-start gap-2.5 mt-8">
          <div className="w-96 px-10 py-3.5 bg-white rounded-[50px] inline-flex justify-start items-center gap-2.5">
            <input
              type="text"
              onChange={(e) => onSearch?.(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent border-none outline-none text-neutral-400 text-xs font-normal font-['Inter'] placeholder-neutral-400"
              style={{ minWidth: 0 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
