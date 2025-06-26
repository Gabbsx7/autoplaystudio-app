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
    <div
      className={`w-full bg-white flex flex-col gap-4 p-4 h-full ${
        className || ''
      }`}
    >
      {/* Files Section */}
      <div className="flex-1 bg-white rounded shadow-[1px_2px_4px_0px_rgba(0,0,0,0.10)] flex flex-col min-h-0">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Folder className="w-5 h-5 text-gray-600" />
            <span className="text-black text-sm font-medium font-['Inter']">
              Files
            </span>
          </div>
        </div>

        {/* Folder Structure */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          {folderStructure.map((folder) => (
            <div key={folder.id} className="space-y-2">
              {/* Main Folder */}
              <div
                className="w-full bg-slate-100 rounded shadow-sm p-3 cursor-pointer hover:bg-slate-200 transition-colors"
                onClick={() => folder.children && toggleFolder(folder.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {folder.children &&
                      (expandedFolders.has(folder.id) ? (
                        <ChevronDown className="w-3 h-3 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-gray-600" />
                      ))}
                    <Folder className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-slate-700 text-xs font-normal font-['Inter'] flex-1 leading-relaxed">
                    {folder.name}
                  </span>
                </div>

                {/* Subfolders */}
                {folder.children && expandedFolders.has(folder.id) && (
                  <div className="mt-3 space-y-2 pl-6">
                    {folder.children.map((subfolder) => (
                      <div
                        key={subfolder.id}
                        className="bg-white rounded shadow-sm p-2 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <Folder className="w-3 h-3 text-gray-500" />
                        <span className="text-slate-700 text-xs font-normal font-['Inter']">
                          {subfolder.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* New Folder Button */}
          <button className="w-full flex items-center gap-3 p-3 text-slate-700 hover:bg-gray-50 rounded transition-colors">
            <Plus className="w-4 h-4" />
            <span className="text-xs font-normal font-['Inter']">
              New Folder
            </span>
          </button>
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 bg-white rounded shadow-[1px_2px_4px_0px_rgba(0,0,0,0.10)] flex flex-col min-h-0">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-gray-600" />
            <span className="text-black text-sm font-medium font-['Inter']">
              Chat
            </span>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          <div className="space-y-4">
            {/* Sample Message */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                  <img
                    className="w-8 h-8 object-cover"
                    src="https://placehold.co/32x32"
                    alt="Glenn"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-black text-sm font-medium font-['Inter']">
                      Glenn
                    </span>
                    <span className="text-neutral-400 text-xs font-normal font-['Inter']">
                      2h ago
                    </span>
                  </div>
                  <div className="text-black text-xs font-normal font-['Inter'] mb-1">
                    Autoplay.studio
                  </div>
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
                  <button className="text-neutral-400 text-xs font-normal font-['Inter'] mt-2 hover:text-neutral-600">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="w-full p-3 bg-neutral-100 rounded-md">
            <input
              type="text"
              placeholder="Write your comment here"
              className="w-full bg-transparent text-xs text-gray-600 font-medium font-['Inter'] border-none outline-none placeholder-gray-400"
            />
            <div className="text-right mt-2">
              <button className="text-neutral-400 text-xs font-normal font-['Inter'] hover:text-neutral-600">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientSidebar
