'use client'

import React, { useState } from 'react'
import { X, Search, Folder } from 'lucide-react'
import { FolderItem } from './FolderItem'
import { MilestoneGrid } from './MilestoneGrid'
import { AssetList } from './AssetList'

interface AssetNavigatorProps {
  isOpen: boolean
  onClose: () => void
  userRole?: 'studio_admin' | 'studio_member' | 'client_admin' | 'client_member'
  onAssetSelect?: (
    assetId: string,
    projectId?: string,
    milestoneId?: string
  ) => void
  initialView?: 'folders' | 'milestones' | 'assets'
  initialTab?: 'clients' | 'templates' | 'projects' | 'folders'
}

export function AssetNavigator({
  isOpen,
  onClose,
  userRole = 'client_admin',
  onAssetSelect,
  initialView = 'folders',
  initialTab,
}: AssetNavigatorProps) {
  const isStudioUser =
    userRole === 'studio_admin' || userRole === 'studio_member'

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedView, setSelectedView] = useState<
    'folders' | 'milestones' | 'assets'
  >(initialView)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  )
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(
    null
  )
  const [activeTab, setActiveTab] = useState<string>(
    initialTab || (isStudioUser ? 'clients' : 'projects')
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Folder className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold">Asset Navigator</h2>
          </div>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b">
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

        {/* Main Content */}
        <div className="flex-1 flex min-h-0">
          {/* Sidebar */}
          <div className="w-80 border-r bg-gray-50">
            <div className="h-full flex flex-col">
              <div className="grid grid-cols-2 m-4 mb-0 bg-gray-100 rounded-lg p-1">
                {isStudioUser ? (
                  <>
                    <button
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === 'clients'
                          ? 'bg-white shadow-sm'
                          : 'hover:bg-white/50'
                      }`}
                      onClick={() => setActiveTab('clients')}
                    >
                      Clients
                    </button>
                    <button
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === 'templates'
                          ? 'bg-white shadow-sm'
                          : 'hover:bg-white/50'
                      }`}
                      onClick={() => setActiveTab('templates')}
                    >
                      Templates
                    </button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>

              <div className="flex-1 p-4 pt-2">
                <div className="h-full overflow-y-auto">
                  {isStudioUser ? (
                    activeTab === 'clients' ? (
                      <FolderItem
                        type="clients-root"
                        onProjectSelect={setSelectedProjectId}
                        onViewChange={setSelectedView}
                        initialExpanded={true}
                      />
                    ) : (
                      <FolderItem
                        type="templates-root"
                        onProjectSelect={setSelectedProjectId}
                        onViewChange={setSelectedView}
                        initialExpanded={true}
                      />
                    )
                  ) : activeTab === 'projects' ? (
                    <FolderItem
                      type="projects-root"
                      onProjectSelect={setSelectedProjectId}
                      onViewChange={setSelectedView}
                      initialExpanded={true}
                    />
                  ) : (
                    <FolderItem
                      type="folders-root"
                      onProjectSelect={setSelectedProjectId}
                      onViewChange={setSelectedView}
                      initialExpanded={true}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main View */}
          <div className="flex-1 flex flex-col">
            {selectedView === 'folders' && (
              <div className="flex-1 p-6">
                <div className="text-center text-gray-500 mt-20">
                  <Folder className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Select a project or folder to view its contents</p>
                </div>
              </div>
            )}

            {selectedView === 'milestones' && selectedProjectId && (
              <div className="flex-1 p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Project Milestones</h3>
                  <p className="text-gray-600">
                    Select a milestone to view its assets
                  </p>
                </div>
                <MilestoneGrid
                  projectId={selectedProjectId}
                  onMilestoneSelect={(milestoneId: string) => {
                    setSelectedMilestoneId(milestoneId)
                    setSelectedView('assets')
                  }}
                />
              </div>
            )}

            {selectedView === 'assets' && selectedMilestoneId && (
              <div className="flex-1 p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Milestone Assets</h3>
                  <p className="text-gray-600">Click an asset to select it</p>
                </div>
                <AssetList
                  milestoneId={selectedMilestoneId}
                  projectId={selectedProjectId}
                  onAssetSelect={(assetId: string) => {
                    onAssetSelect?.(
                      assetId,
                      selectedProjectId || undefined,
                      selectedMilestoneId
                    )
                    onClose()
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
