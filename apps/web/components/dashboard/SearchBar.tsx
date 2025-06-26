// components/dashboard/SearchBar.tsx - Responsivo
'use client'

import React, { useState } from 'react'
import { Search } from 'lucide-react'

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({
  onSearch,
  placeholder = 'Search for projects or assets',
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onSearch?.(value)
  }

  return (
    <div
      className={`w-full max-w-none lg:max-w-[1162px] rounded-lg shadow-[1px_2px_4px_0px_rgba(0,0,0,0.10)] bg-white ${
        className || ''
      }`}
    >
      <div className="w-full lg:w-[577px] p-5 rounded flex flex-col justify-start items-start gap-[5px]">
        {/* Welcome Message */}
        <div className="py-[5px] flex flex-col justify-start items-start gap-2.5">
          <h1 className="w-full lg:w-[542px] text-black text-2xl lg:text-4xl font-normal font-['Inter'] leading-tight">
            Welcome back! Check out all the projects and assets
          </h1>
        </div>

        {/* Search Input */}
        <div className="w-full flex flex-col justify-center items-start gap-2.5 mt-4">
          <div className="w-full max-w-md lg:w-96 px-4 lg:px-10 py-3.5 bg-white rounded-[50px] border border-gray-100 hover:border-gray-200 focus-within:border-gray-300 transition-colors shadow-sm">
            <div className="flex items-center gap-2.5">
              <Search size={16} className="text-neutral-400 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="flex-1 text-neutral-400 text-xs font-normal font-['Inter'] bg-transparent border-none outline-none placeholder-neutral-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
