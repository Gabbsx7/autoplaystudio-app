'use client'

import React, { useState } from 'react'
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Plus,
  MoreHorizontal,
  Target,
  CheckCircle,
  Clock,
  Circle,
  FileText,
  Image,
  Video,
  File,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FolderItemProps {
  type: 'clients-root' | 'templates-root' | 'projects-root' | 'folders-root'
  onProjectSelect?: (projectId: string) => void
  onViewChange?: (view: 'folders' | 'milestones' | 'assets') => void
  onItemSelect?: (item: any) => void
  initialExpanded?: boolean
}

export function FolderItem({
  type,
  onProjectSelect,
  onViewChange,
  onItemSelect,
  initialExpanded = false,
}: FolderItemProps) {
  const router = useRouter()

  // Mock data based on type with Figma-like structure
  const getMockData = () => {
    switch (type) {
      case 'projects-root':
        return [
          {
            id: 'collections',
            name: 'Collections',
            type: 'folder',
            children: [
              {
                id: 'acme',
                name: 'Acme',
                type: 'folder',
                children: [
                  {
                    id: 'molecule',
                    name: 'Molecule',
                    type: 'project',
                    children: [
                      {
                        id: 'milestone-1',
                        name: 'Concept Development',
                        type: 'milestone',
                        status: 'completed',
                        children: [
                          {
                            id: 'asset-1',
                            name: 'Brand_Guidelines.pdf',
                            type: 'asset',
                            assetType: 'document',
                          },
                          {
                            id: 'asset-2',
                            name: 'Logo_Concepts.jpg',
                            type: 'asset',
                            assetType: 'image',
                          },
                          {
                            id: 'asset-3',
                            name: 'Color_Palette.png',
                            type: 'asset',
                            assetType: 'image',
                          },
                        ],
                      },
                      {
                        id: 'milestone-2',
                        name: 'Visual Production',
                        type: 'milestone',
                        status: 'in-progress',
                        children: [
                          {
                            id: 'asset-4',
                            name: 'Hero_Video.mp4',
                            type: 'asset',
                            assetType: 'video',
                          },
                          {
                            id: 'asset-5',
                            name: 'Product_Shots.jpg',
                            type: 'asset',
                            assetType: 'image',
                          },
                        ],
                      },
                      {
                        id: 'milestone-3',
                        name: 'Final Delivery',
                        type: 'milestone',
                        status: 'pending',
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 'acme-sub',
                    name: 'Acme Campaign',
                    type: 'project',
                    children: [
                      {
                        id: 'milestone-4',
                        name: 'Research & Strategy',
                        type: 'milestone',
                        status: 'completed',
                        children: [
                          {
                            id: 'asset-6',
                            name: 'Market_Research.pdf',
                            type: 'asset',
                            assetType: 'document',
                          },
                          {
                            id: 'asset-7',
                            name: 'Strategy_Deck.pptx',
                            type: 'asset',
                            assetType: 'document',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                id: 'molecule-root',
                name: 'Molecule',
                type: 'project',
                children: [
                  {
                    id: 'milestone-5',
                    name: 'Pre-Production',
                    type: 'milestone',
                    status: 'in-progress',
                    children: [
                      {
                        id: 'asset-8',
                        name: 'Storyboard.pdf',
                        type: 'asset',
                        assetType: 'document',
                      },
                      {
                        id: 'asset-9',
                        name: 'Mood_Board.jpg',
                        type: 'asset',
                        assetType: 'image',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ]
      case 'folders-root':
        // Estrutura inspirada nas capturas do Figma
        return [
          {
            id: 'all-folders',
            name: 'All Folders',
            type: 'folder',
            children: [
              {
                id: 'projects-folder',
                name: 'Projects',
                type: 'folder',
                children: [
                  {
                    id: 'marathon',
                    name: 'Marathon',
                    type: 'project',
                    children: [],
                  },
                ],
              },
              {
                id: 'collections-folder',
                name: 'Collections',
                type: 'folder',
                children: [],
              },
              {
                id: 'finished-projects-folder',
                name: 'Finished Projects',
                type: 'folder',
                children: [
                  {
                    id: 'finished-project-1',
                    name: 'Project 1',
                    type: 'folder',
                    children: [
                      {
                        id: 'sub-folder-1',
                        name: 'Sub Folder',
                        type: 'folder',
                        children: [
                          {
                            id: 'images-folder',
                            name: 'Images',
                            type: 'folder',
                            children: [],
                          },
                          {
                            id: 'pdf-folder',
                            name: 'PDF',
                            type: 'folder',
                            children: [],
                          },
                          {
                            id: 'videos-folder',
                            name: 'Videos',
                            type: 'folder',
                            children: [],
                          },
                        ],
                      },
                      {
                        id: 'sub-folder-2',
                        name: 'Sub Folder 1 2',
                        type: 'folder',
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 'finished-project-2',
                    name: 'Project 2',
                    type: 'folder',
                    children: [],
                  },
                ],
              },
              {
                id: 'assets-folder',
                name: 'Assets',
                type: 'folder',
                children: [],
              },
            ],
          },
          {
            id: 'apps-root',
            name: 'Apps',
            type: 'folder',
            children: [
              { id: 'app-figma', name: 'Figma', type: 'folder', children: [] },
              {
                id: 'app-notion',
                name: 'Notion',
                type: 'folder',
                children: [],
              },
            ],
          },
          {
            id: 'another-collection-root',
            name: 'Another Collection',
            type: 'folder',
            children: [],
          },
        ]
      case 'clients-root':
        return [
          {
            id: 'client-collections',
            name: 'Client Projects',
            type: 'folder',
            children: [
              {
                id: 'footlocker',
                name: 'Footlocker',
                type: 'folder',
                children: [
                  {
                    id: 'footlocker-cgi',
                    name: 'CGI Production',
                    type: 'project',
                  },
                  {
                    id: 'footlocker-brand',
                    name: 'Brand Campaign',
                    type: 'project',
                  },
                ],
              },
              {
                id: 'nike',
                name: 'Nike',
                type: 'folder',
                children: [
                  {
                    id: 'nike-launch',
                    name: 'Product Launch',
                    type: 'project',
                  },
                ],
              },
            ],
          },
        ]
      case 'templates-root':
        return [
          {
            id: 'template-collection',
            name: 'Templates',
            type: 'folder',
            children: [
              {
                id: 'template-1',
                name: 'CGI Project Template',
                type: 'template',
              },
              {
                id: 'template-2',
                name: 'Animation Template',
                type: 'template',
              },
              { id: 'template-3', name: 'Branding Template', type: 'template' },
            ],
          },
        ]
      default:
        return []
    }
  }

  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    if (initialExpanded) {
      const rootItems = getMockData().map((item) => item.id)
      return new Set(rootItems)
    }
    return new Set()
  })

  const toggleExpanded = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const handleFolderClick = (item: any) => {
    if (item.type === 'asset') {
      // Navigate to asset detail page
      router.push(`/dashboard/assets/${item.id}`)
    } else if (item.type === 'project' || item.type === 'folder') {
      // Select item to show its content
      onItemSelect?.(item)
      // Also expand/collapse
      const newExpanded = new Set(expandedItems)
      if (newExpanded.has(item.id)) {
        newExpanded.delete(item.id)
      } else {
        newExpanded.add(item.id)
      }
      setExpandedItems(newExpanded)
    } else if (item.type === 'milestone') {
      // Select milestone to show its assets
      onItemSelect?.(item)
      // Also expand/collapse
      const newExpanded = new Set(expandedItems)
      if (newExpanded.has(item.id)) {
        newExpanded.delete(item.id)
      } else {
        newExpanded.add(item.id)
      }
      setExpandedItems(newExpanded)
    }
  }

  const getItemIcon = (
    item: any,
    isExpanded: boolean,
    hasChildren: boolean
  ) => {
    switch (item.type) {
      case 'milestone':
        const statusIcon = {
          completed: <CheckCircle className="w-4 h-4 text-green-500" />,
          'in-progress': <Clock className="w-4 h-4 text-blue-500" />,
          pending: <Circle className="w-4 h-4 text-gray-400" />,
        }
        return (
          statusIcon[item.status as keyof typeof statusIcon] || (
            <Target className="w-4 h-4 text-gray-500" />
          )
        )

      case 'asset':
        const assetIcon = {
          image: <Image className="w-4 h-4 text-purple-500" />,
          video: <Video className="w-4 h-4 text-red-500" />,
          document: <FileText className="w-4 h-4 text-blue-500" />,
        }
        return (
          assetIcon[item.assetType as keyof typeof assetIcon] || (
            <File className="w-4 h-4 text-gray-500" />
          )
        )

      case 'project':
        return isExpanded && hasChildren ? (
          <FolderOpen className="w-4 h-4 text-orange-500" />
        ) : (
          <Folder className="w-4 h-4 text-orange-500" />
        )

      default:
        return isExpanded && hasChildren ? (
          <FolderOpen className="w-4 h-4 text-blue-500" />
        ) : (
          <Folder className="w-4 h-4 text-blue-500" />
        )
    }
  }

  const renderItem = (item: any, level = 0) => {
    const isExpanded = expandedItems.has(item.id)
    const hasChildren = item.children && item.children.length > 0
    const indent = level * 20

    return (
      <div key={item.id} className="select-none">
        <div
          className={`group flex items-center gap-1 py-1 px-2 hover:bg-gray-50 rounded cursor-pointer relative ${
            item.type === 'asset' ? 'hover:bg-blue-50' : ''
          }`}
          style={{ paddingLeft: `${12 + indent}px` }}
          onClick={() => handleFolderClick(item)}
        >
          {/* Vertical line for tree structure */}
          {level > 0 && (
            <div
              className="absolute left-0 top-0 bottom-0 border-l border-gray-200"
              style={{ left: `${indent - 8}px` }}
            />
          )}

          {/* Expand/Collapse Icon */}
          <div className="w-4 h-4 flex items-center justify-center -ml-1">
            {hasChildren && item.type !== 'asset' && (
              <div className="hover:bg-gray-200 rounded p-0.5">
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-gray-500" />
                )}
              </div>
            )}
          </div>

          {/* Item Icon */}
          <div className="flex-shrink-0">
            {getItemIcon(item, isExpanded, hasChildren)}
          </div>

          {/* Item Name */}
          <span
            className={`text-[13px] flex-1 truncate ml-1.5 ${
              item.type === 'asset' ? 'text-gray-600' : 'text-gray-700'
            }`}
          >
            {item.name}
          </span>

          {/* Actions */}
          {item.type !== 'asset' && (
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  console.log('Add new folder')
                }}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <Plus className="w-3 h-3 text-gray-400" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  console.log('More options')
                }}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <MoreHorizontal className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="relative">
            {item.children.map((child: any) => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  const data = getMockData()

  return (
    <div className="space-y-0">
      {type === 'projects-root' && (
        <div className="flex items-center justify-between px-3 py-2 mb-1">
          <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            PROJECTS
          </h3>
          <button
            onClick={() => console.log('Add new collection')}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <Plus className="w-3 h-3 text-gray-400" />
          </button>
        </div>
      )}

      {data.map((item) => renderItem(item))}

      {/* Add New Collection Button */}
      {type === 'folders-root' && (
        <button
          className="w-full flex items-center gap-2 py-2 px-3 mt-2 text-gray-500 hover:bg-gray-50 rounded text-[13px]"
          onClick={() => console.log('Add new collection')}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Collection</span>
        </button>
      )}
    </div>
  )
}
