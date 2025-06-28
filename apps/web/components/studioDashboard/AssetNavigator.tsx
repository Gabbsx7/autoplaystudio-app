'use client'

import React, { useState } from 'react'
import {
  Folder,
  Users,
  FolderOpen,
  Settings,
  ChevronDown,
  ChevronRight,
  Plus,
} from 'lucide-react'

interface AssetNavigatorProps {
  className?: string
}

interface FolderItem {
  id: string
  name: string
  type: 'app' | 'client' | 'project' | 'folder' | 'member'
  isOpen?: boolean
  children?: FolderItem[]
  count?: number
}

export default function AssetNavigator({ className }: AssetNavigatorProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['apps', 'clients'])
  )

  // Mock data baseado no Figma
  const folderStructure: FolderItem[] = [
    {
      id: 'apps',
      name: 'Apps',
      type: 'app',
      count: 3,
      children: [
        { id: 'figma', name: 'Figma', type: 'app' },
        { id: 'notion', name: 'Notion', type: 'app' },
        { id: 'slack', name: 'Slack', type: 'app' },
      ],
    },
    {
      id: 'clients',
      name: 'Clients',
      type: 'client',
      count: 5,
      children: [
        { id: 'footlocker', name: 'Footlocker', type: 'client' },
        { id: 'nike', name: 'Nike', type: 'client' },
        { id: 'adidas', name: 'Adidas', type: 'client' },
        { id: 'pepsi', name: 'Pepsi Co', type: 'client' },
      ],
    },
    {
      id: 'projects',
      name: 'Projects',
      type: 'project',
      count: 12,
      children: [
        {
          id: 'footlocker-cgi',
          name: 'Footlocker CGI Production',
          type: 'project',
        },
        { id: 'nike-campaign', name: 'Nike Brand Campaign', type: 'project' },
        { id: 'adidas-launch', name: 'Adidas Product Launch', type: 'project' },
      ],
    },
    {
      id: 'folders',
      name: 'Folders',
      type: 'folder',
      count: 8,
      children: [
        { id: 'assets', name: 'Assets', type: 'folder' },
        { id: 'templates', name: 'Templates', type: 'folder' },
        { id: 'documents', name: 'Documents', type: 'folder' },
      ],
    },
    {
      id: 'members',
      name: 'Members',
      type: 'member',
      count: 15,
      children: [
        { id: 'john-doe', name: 'John Doe', type: 'member' },
        { id: 'jane-smith', name: 'Jane Smith', type: 'member' },
        { id: 'bob-johnson', name: 'Bob Johnson', type: 'member' },
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

  const getIcon = (type: string) => {
    switch (type) {
      case 'app':
        return <Settings className="w-4 h-4 text-gray-600" />
      case 'client':
        return <Users className="w-4 h-4 text-gray-600" />
      case 'project':
        return <FolderOpen className="w-4 h-4 text-gray-600" />
      case 'folder':
        return <Folder className="w-4 h-4 text-gray-600" />
      case 'member':
        return <Users className="w-4 h-4 text-gray-600" />
      default:
        return <Folder className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className={`flex flex-col h-full min-h-0 bg-white ${className || ''}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between">
        <h2 className="text-base font-semibold text-black">Asset Navigator</h2>
        <button className="p-1 hover:bg-gray-100 rounded">
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {folderStructure.map((folder) => (
          <div key={folder.id}>
            <div
              className="flex items-center gap-2 cursor-pointer py-2 px-2 rounded hover:bg-zinc-50 transition-colors"
              onClick={() => folder.children && toggleFolder(folder.id)}
            >
              {folder.children &&
                (expandedFolders.has(folder.id) ? (
                  <ChevronDown className="w-3 h-3 text-gray-600" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-gray-600" />
                ))}
              {getIcon(folder.type)}
              <span className="text-sm text-zinc-700 font-medium flex-1">
                {folder.name}
              </span>
              {folder.count && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {folder.count}
                </span>
              )}
            </div>

            {folder.children && expandedFolders.has(folder.id) && (
              <div className="pl-6 space-y-1">
                {folder.children.map((subfolder) => (
                  <div
                    key={subfolder.id}
                    className="flex items-center gap-2 py-1 px-2 rounded hover:bg-zinc-50 cursor-pointer"
                  >
                    {getIcon(subfolder.type)}
                    <span className="text-xs text-zinc-700">
                      {subfolder.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
