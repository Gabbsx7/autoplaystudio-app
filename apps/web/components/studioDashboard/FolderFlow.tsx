'use client'

import React, { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  File,
} from 'lucide-react'

interface FolderFlowProps {
  className?: string
}

interface FlowItem {
  id: string
  name: string
  type: 'client' | 'project' | 'milestone' | 'asset'
  isOpen?: boolean
  children?: FlowItem[]
  status?: 'active' | 'completed' | 'pending'
  count?: number
}

export default function FolderFlow({ className }: FolderFlowProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(['footlocker'])
  )

  // Mock data baseado no Figma - hierarquia cliente > projeto > milestone > asset
  const flowStructure: FlowItem[] = [
    {
      id: 'footlocker',
      name: 'Footlocker',
      type: 'client',
      count: 3,
      children: [
        {
          id: 'footlocker-cgi',
          name: 'CGI Production',
          type: 'project',
          status: 'active',
          count: 4,
          children: [
            {
              id: 'milestone-1',
              name: 'Concept Design',
              type: 'milestone',
              status: 'completed',
              count: 12,
              children: [
                { id: 'asset-1', name: 'Concept Sketch 1', type: 'asset' },
                { id: 'asset-2', name: 'Concept Sketch 2', type: 'asset' },
                { id: 'asset-3', name: 'Mood Board', type: 'asset' },
              ],
            },
            {
              id: 'milestone-2',
              name: '3D Modeling',
              type: 'milestone',
              status: 'active',
              count: 8,
              children: [
                { id: 'asset-4', name: 'Shoe Model', type: 'asset' },
                { id: 'asset-5', name: 'Environment Setup', type: 'asset' },
              ],
            },
            {
              id: 'milestone-3',
              name: 'Animation',
              type: 'milestone',
              status: 'pending',
              count: 0,
            },
          ],
        },
        {
          id: 'footlocker-brand',
          name: 'Brand Campaign',
          type: 'project',
          status: 'pending',
          count: 2,
        },
      ],
    },
    {
      id: 'nike',
      name: 'Nike',
      type: 'client',
      count: 2,
      children: [
        {
          id: 'nike-campaign',
          name: 'Brand Refresh',
          type: 'project',
          status: 'active',
          count: 6,
        },
      ],
    },
  ]

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const getIcon = (type: string, isExpanded: boolean) => {
    switch (type) {
      case 'client':
        return <Folder className="w-4 h-4 text-blue-600" />
      case 'project':
        return isExpanded ? (
          <FolderOpen className="w-4 h-4 text-green-600" />
        ) : (
          <Folder className="w-4 h-4 text-green-600" />
        )
      case 'milestone':
        return <File className="w-4 h-4 text-orange-600" />
      case 'asset':
        return <File className="w-4 h-4 text-gray-600" />
      default:
        return <Folder className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const renderItem = (item: FlowItem, level: number = 0) => {
    const isExpanded = expandedItems.has(item.id)
    const hasChildren = item.children && item.children.length > 0

    return (
      <div key={item.id}>
        <div
          className={`flex items-center gap-2 cursor-pointer py-2 px-2 rounded hover:bg-zinc-50 transition-colors ${
            level > 0 ? `ml-${level * 4}` : ''
          }`}
          onClick={() => hasChildren && toggleItem(item.id)}
        >
          {hasChildren &&
            (isExpanded ? (
              <ChevronDown className="w-3 h-3 text-gray-600" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-600" />
            ))}
          {getIcon(item.type, isExpanded)}
          <span className="text-sm text-zinc-700 font-medium flex-1">
            {item.name}
          </span>
          {item.status && (
            <span
              className={`text-xs px-2 py-1 rounded ${getStatusColor(
                item.status
              )}`}
            >
              {item.status}
            </span>
          )}
          {item.count && item.count > 0 && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {item.count}
            </span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-4">
            {item.children!.map((child) => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-full min-h-0 bg-white ${className || ''}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-100">
        <h2 className="text-base font-semibold text-black">Folder Flow</h2>
        <p className="text-xs text-gray-500 mt-1">
          Click to expand folders and view hierarchy
        </p>
      </div>

      {/* Flow Items */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
        {flowStructure.map((item) => renderItem(item))}
      </div>
    </div>
  )
}
