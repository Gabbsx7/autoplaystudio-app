// components/layout/sidebar/client-sidebar.tsx - Responsivo
'use client'

import React from 'react'
import { Folder } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FolderItem } from '@/components/asset-navigator/FolderItem'

interface ClientSidebarProps {
  className?: string
}

export function ClientSidebar({ className }: ClientSidebarProps) {
  const router = useRouter()

  const handleItemSelect = (item: any) => {
    // Navigate to the assets page with the selected item
    router.push(`/dashboard/assets?selected=${item.id}`)
  }

  return (
    <div className={`flex flex-col h-full min-h-0 bg-white ${className || ''}`}>
      {/* Files Section */}
      <div className="flex-1 flex flex-col rounded-xl bg-white border border-zinc-100 shadow-sm overflow-hidden">
        <div
          className="px-4 py-3 border-b border-zinc-100 flex items-center gap-2 cursor-pointer hover:bg-zinc-50 transition-colors"
          onClick={() => router.push('/dashboard/assets')}
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-base font-semibold text-black">Files</span>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-3">
          <FolderItem
            type="clients-root"
            onItemSelect={handleItemSelect}
            initialExpanded={false}
          />
        </div>
      </div>
    </div>
  )
}

export default ClientSidebar
