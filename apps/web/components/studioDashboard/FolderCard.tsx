'use client'

import React from 'react'
import { Folder, ChevronRight, File, Image, Video } from 'lucide-react'

interface FolderCardProps {
  id: string
  name: string
  description?: string
  assetsCount: number
  subfoldersCount?: number
  assetTypes?: {
    images?: number
    videos?: number
    documents?: number
  }
  onClick?: () => void
  onExpand?: () => void
  className?: string
}

export default function FolderCard({
  id,
  name,
  description,
  assetsCount,
  subfoldersCount = 0,
  assetTypes = {},
  onClick,
  onExpand,
  className,
}: FolderCardProps) {
  const { images = 0, videos = 0, documents = 0 } = assetTypes

  return (
    <div
      className={`w-full rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer bg-white ${
        className || ''
      }`}
      onClick={onClick}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Folder className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {name}
              </h3>
            </div>
            {description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {description}
              </p>
            )}
          </div>
          {onExpand && (
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                onExpand()
              }}
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Assets</span>
            <span className="text-sm font-semibold text-gray-900">
              {assetsCount}
            </span>
          </div>

          {subfoldersCount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Subfolders</span>
              <span className="text-sm font-semibold text-gray-900">
                {subfoldersCount}
              </span>
            </div>
          )}

          {/* Asset Type Breakdown */}
          {(images > 0 || videos > 0 || documents > 0) && (
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {images > 0 && (
                  <div className="flex items-center gap-1">
                    <Image className="w-3 h-3" />
                    <span>{images} images</span>
                  </div>
                )}
                {videos > 0 && (
                  <div className="flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    <span>{videos} videos</span>
                  </div>
                )}
                {documents > 0 && (
                  <div className="flex items-center gap-1">
                    <File className="w-3 h-3" />
                    <span>{documents} docs</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
