'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Search,
  Folder,
  FolderOpen,
  CheckCircle,
  Clock,
  Circle,
  Image,
  Video,
  FileText,
} from 'lucide-react'
import { FolderItem } from '@/components/asset-navigator/FolderItem'
import { MilestoneGrid } from '@/components/asset-navigator/MilestoneGrid'
import { AssetList } from '@/components/asset-navigator/AssetList'

export default function AssetsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedView, setSelectedView] = useState<
    'folders' | 'milestones' | 'assets'
  >('folders')
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  )
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(
    null
  )
  const [activeTab, setActiveTab] = useState<'projects' | 'folders'>('projects')
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [selectedItemContent, setSelectedItemContent] = useState<any[]>([])

  // For now, assuming client user
  const isStudioUser = false // TODO: get from auth context

  // Function to get content of selected item (milestones and assets)
  const getItemContent = (item: any): any[] => {
    if (!item || !item.children) return []

    // Flatten all children (milestones and assets)
    const content: any[] = []

    const addItemsRecursively = (items: any[]) => {
      items.forEach((child) => {
        if (child.type === 'milestone' || child.type === 'asset') {
          content.push(child)
        }
        if (child.children && child.children.length > 0) {
          addItemsRecursively(child.children)
        }
      })
    }

    addItemsRecursively(item.children)
    return content
  }

  const handleItemSelect = (item: any) => {
    setSelectedItem(item)
    setSelectedItemContent(getItemContent(item))
  }

  const handleAssetSelect = (
    assetId: string,
    projectId?: string,
    milestoneId?: string
  ) => {
    console.log('Asset selected:', { assetId, projectId, milestoneId })
    // Navigate to asset detail page
    router.push(`/dashboard/assets/${assetId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <Folder className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-semibold">Asset Navigator</h1>
              </div>
            </div>

            {/* Search */}
            <div className="w-full max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assets, projects, folders..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r">
          <div className="h-full flex flex-col">
            <div className="grid grid-cols-2 m-4 mb-0 bg-gray-100 rounded-lg p-1">
              <button
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'projects'
                    ? 'bg-white shadow-sm'
                    : 'hover:bg-white/50'
                }`}
                onClick={() => setActiveTab('projects')}
              >
                Projects
              </button>
              <button
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'folders'
                    ? 'bg-white shadow-sm'
                    : 'hover:bg-white/50'
                }`}
                onClick={() => setActiveTab('folders')}
              >
                Folders
              </button>
            </div>

            <div className="flex-1 p-4 pt-2 overflow-y-auto">
              {activeTab === 'projects' ? (
                <div className="p-2">
                  <FolderItem
                    type="projects-root"
                    onProjectSelect={(projectId) => {
                      setSelectedProjectId(projectId)
                      setSelectedView('milestones')
                    }}
                    onItemSelect={handleItemSelect}
                    onViewChange={setSelectedView}
                    initialExpanded={true}
                  />
                </div>
              ) : (
                <div className="p-2">
                  <FolderItem
                    type="folders-root"
                    onItemSelect={handleItemSelect}
                    initialExpanded={true}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main View */}
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          {selectedItem ? (
            <div className="flex-1 p-6">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {selectedItem.name}
                </h2>
                <p className="text-gray-600 capitalize">
                  {selectedItem.type} • {selectedItemContent.length} items
                </p>
              </div>

              {/* Content Grid */}
              {selectedItemContent.length > 0 ? (
                <div className="space-y-8">
                  {/* Milestones Section */}
                  {selectedItemContent.some(
                    (item) => item.type === 'milestone'
                  ) && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Milestones
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedItemContent
                          .filter((item) => item.type === 'milestone')
                          .map((milestone) => (
                            <div
                              key={milestone.id}
                              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => handleItemSelect(milestone)}
                            >
                              <div className="flex items-center gap-3 mb-3">
                                {milestone.status === 'completed' && (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                )}
                                {milestone.status === 'in-progress' && (
                                  <Clock className="w-5 h-5 text-blue-500" />
                                )}
                                {milestone.status === 'pending' && (
                                  <Circle className="w-5 h-5 text-gray-400" />
                                )}
                                <h4 className="font-medium text-gray-900">
                                  {milestone.name}
                                </h4>
                              </div>
                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <span className="capitalize">
                                  {milestone.status}
                                </span>
                                <span>
                                  {milestone.children?.length || 0} assets
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Assets Section */}
                  {selectedItemContent.some(
                    (item) => item.type === 'asset'
                  ) && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Assets
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {selectedItemContent
                          .filter((item) => item.type === 'asset')
                          .map((asset) => (
                            <div
                              key={asset.id}
                              className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() =>
                                (window.location.href = `/dashboard/assets/${asset.id}`)
                              }
                            >
                              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                                {asset.assetType === 'image' && (
                                  <Image className="w-8 h-8 text-purple-500" />
                                )}
                                {asset.assetType === 'video' && (
                                  <Video className="w-8 h-8 text-red-500" />
                                )}
                                {asset.assetType === 'document' && (
                                  <FileText className="w-8 h-8 text-blue-500" />
                                )}
                              </div>
                              <p className="text-xs text-gray-900 font-medium truncate">
                                {asset.name}
                              </p>
                              <p className="text-xs text-gray-500 capitalize">
                                {asset.assetType}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Esta pasta está vazia</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Select a project or folder to view its contents
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
