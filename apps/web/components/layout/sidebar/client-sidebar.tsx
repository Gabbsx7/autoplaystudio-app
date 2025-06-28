// components/layout/sidebar/client-sidebar.tsx - Responsivo
'use client'

import React, { useState } from 'react'
import {
  Folder,
  Plus,
  MessageCircle,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FolderItem {
  id: string
  name: string
  type: 'folder' | 'subfolder'
  isOpen?: boolean
  children?: FolderItem[]
}

interface ClientSidebarProps {
  className?: string
}

export function ClientSidebar({ className }: ClientSidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['subclients'])
  )
  const router = useRouter()

  // Mock data baseado no Figma
  const folderStructure: FolderItem[] = [
    {
      id: 'finished',
      name: 'Finished Projects',
      type: 'folder',
    },
    {
      id: 'subclients',
      name: 'Subclients (clients of the clients)',
      type: 'folder',
      children: [
        { id: 'footlocker', name: 'Footlocker', type: 'subfolder' },
        { id: 'pepsi', name: 'Pepsi Co', type: 'subfolder' },
      ],
    },
  ]

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  return (
    <div className={`flex flex-col h-full min-h-0 bg-white ${className || ''}`}>
      {/* Files Section */}
      <div className="flex-1 flex flex-col rounded-xl bg-white border border-zinc-100 shadow-sm mb-4 overflow-hidden">
        <div
          className="px-4 py-3 border-b border-zinc-100 flex items-center gap-2 cursor-pointer hover:bg-zinc-50 transition-colors"
          onClick={() => router.push('/dashboard/assets')}
        >
          <Folder className="w-5 h-5 text-gray-600" />
          <span className="text-base font-semibold text-black">Files</span>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {folderStructure.map((folder) => (
            <div key={folder.id}>
              <div
                className="flex items-center gap-2 cursor-pointer py-2 px-2 rounded hover:bg-zinc-50 transition-colors"
                onClick={() => {
                  if (folder.children) {
                    toggleFolder(folder.id)
                  }
                  router.push('/dashboard/assets')
                }}
              >
                {folder.children &&
                  (expandedFolders.has(folder.id) ? (
                    <ChevronDown className="w-3 h-3 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-gray-600" />
                  ))}
                <Folder className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-zinc-700 font-medium flex-1">
                  {folder.name}
                </span>
              </div>
              {folder.children && expandedFolders.has(folder.id) && (
                <div className="pl-6 space-y-1">
                  {folder.children.map((subfolder) => (
                    <div
                      key={subfolder.id}
                      className="flex items-center gap-2 py-1 px-2 rounded hover:bg-zinc-50 cursor-pointer"
                      onClick={() => router.push('/dashboard/assets')}
                    >
                      <Folder className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-zinc-700">
                        {subfolder.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button className="w-full flex items-center gap-2 py-2 px-2 mt-2 text-zinc-700 hover:bg-zinc-50 rounded transition-colors text-sm">
            <Plus className="w-4 h-4" />
            New Folder
          </button>
        </div>
      </div>
      {/* Chat Section */}
      <div className="flex flex-col rounded-xl bg-white border border-zinc-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-100 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-gray-600" />
          <span className="text-base font-semibold text-black">Chat</span>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {/* Mensagem exemplo */}
          <div className="flex items-start gap-3 pb-2 border-b border-zinc-100">
            <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
              <img
                className="w-8 h-8 object-cover"
                src="https://placehold.co/32x32"
                alt="Glenn"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-black text-sm font-semibold">Glenn</span>
                <span className="text-neutral-400 text-xs">2h ago</span>
              </div>
              <div className="text-xs text-zinc-600 mb-1">Autoplay.studio</div>
              <div className="text-xs leading-relaxed">
                <span className="text-black">With the </span>
                <span className="text-zinc-400">Task1</span>
                <span className="text-black"> in </span>
                <span className="text-amber-300">#Milestone 1</span>
                <br />
                <span className="text-black">
                  We need to finish asap liked the video{' '}
                </span>
                <span className="text-neutral-400">V 1.1</span>
              </div>
              <button className="text-neutral-400 text-xs mt-2 hover:text-neutral-600">
                Reply
              </button>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 border-t border-zinc-100">
          <div className="flex items-center gap-2 bg-neutral-100 rounded-md p-2">
            <input
              type="text"
              placeholder="Write your comment here"
              className="flex-1 bg-transparent text-xs text-gray-600 font-medium border-none outline-none placeholder-gray-400"
            />
            <button className="text-neutral-400 text-xs font-medium hover:text-neutral-600">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientSidebar
