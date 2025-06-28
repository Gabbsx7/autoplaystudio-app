'use client'

import React from 'react'
import { FileImage, Play, FileText, Download } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AssetListProps {
  milestoneId: string
  projectId?: string | null
  onAssetSelect?: (assetId: string) => void
}

export function AssetList({
  milestoneId,
  projectId,
  onAssetSelect,
}: AssetListProps) {
  const router = useRouter()

  // Mock data - will be replaced with API call
  const mockAssets = [
    {
      id: 'asset-1',
      name: 'hero-image-final.jpg',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=300&q=80',
      size: '2.4 MB',
      createdAt: '2024-01-15',
    },
    {
      id: 'asset-2',
      name: 'product-showcase.mp4',
      type: 'video',
      url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=300&q=80',
      size: '15.2 MB',
      createdAt: '2024-01-16',
    },
    {
      id: 'asset-3',
      name: 'brand-guidelines.pdf',
      type: 'document',
      url: null,
      size: '1.8 MB',
      createdAt: '2024-01-17',
    },
    {
      id: 'asset-4',
      name: 'background-texture.png',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=300&q=80',
      size: '3.1 MB',
      createdAt: '2024-01-18',
    },
    {
      id: 'asset-5',
      name: 'animation-sequence.mov',
      type: 'video',
      url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=300&q=80',
      size: '28.5 MB',
      createdAt: '2024-01-19',
    },
    {
      id: 'asset-6',
      name: 'style-reference.jpg',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=300&q=80',
      size: '1.9 MB',
      createdAt: '2024-01-20',
    },
  ]

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'image':
        return FileImage
      case 'video':
        return Play
      case 'document':
        return FileText
      default:
        return FileText
    }
  }

  const getAssetColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'text-green-600'
      case 'video':
        return 'text-blue-600'
      case 'document':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {mockAssets.map((asset) => {
        const AssetIcon = getAssetIcon(asset.type)
        const iconColor = getAssetColor(asset.type)

        return (
          <div
            key={asset.id}
            className="group relative bg-white rounded-lg shadow-sm border hover:shadow-md transition-all cursor-pointer"
            onClick={() => router.push(`/dashboard/assets/${asset.id}`)}
          >
            {/* Thumbnail/Preview */}
            <div className="aspect-square w-full bg-gray-100 rounded-t-lg overflow-hidden relative">
              {asset.url ? (
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <AssetIcon className={`w-12 h-12 ${iconColor}`} />
                </div>
              )}

              {/* Video overlay */}
              {asset.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-gray-700 ml-1" />
                  </div>
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="p-2 bg-white rounded-full shadow-lg">
                  <Download className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="p-3">
              <div className="flex items-start gap-2 mb-2">
                <AssetIcon
                  className={`w-4 h-4 mt-0.5 flex-shrink-0 ${iconColor}`}
                />
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                  {asset.name}
                </h4>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{asset.size}</span>
                <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
