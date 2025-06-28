'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Image,
  Video,
  FileText,
} from 'lucide-react'

export default function AssetDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Mock data based on asset ID
  const getAssetData = (id: string) => {
    const mockAssets = {
      'asset-1': {
        id: 'asset-1',
        name: 'Brand_Guidelines.pdf',
        type: 'document',
        size: '2.3 MB',
        createdAt: '2024-01-15',
        project: 'Molecule',
        milestone: 'Concept Development',
        url: '/placeholder-document.jpg',
        description:
          'Complete brand guidelines including logo usage, color palette, and typography specifications.',
      },
      'asset-2': {
        id: 'asset-2',
        name: 'Logo_Concepts.jpg',
        type: 'image',
        size: '1.8 MB',
        createdAt: '2024-01-16',
        project: 'Molecule',
        milestone: 'Concept Development',
        url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop',
        description:
          'Initial logo concepts and variations for the Molecule brand identity.',
      },
      'asset-3': {
        id: 'asset-3',
        name: 'Color_Palette.png',
        type: 'image',
        size: '856 KB',
        createdAt: '2024-01-17',
        project: 'Molecule',
        milestone: 'Concept Development',
        url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=600&fit=crop',
        description:
          'Primary and secondary color palette with hex codes and usage guidelines.',
      },
      'asset-4': {
        id: 'asset-4',
        name: 'Hero_Video.mp4',
        type: 'video',
        size: '45.2 MB',
        createdAt: '2024-02-01',
        project: 'Molecule',
        milestone: 'Visual Production',
        url: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=600&fit=crop',
        description:
          'Main hero video for the campaign landing page and social media.',
      },
      'asset-5': {
        id: 'asset-5',
        name: 'Product_Shots.jpg',
        type: 'image',
        size: '3.1 MB',
        createdAt: '2024-02-02',
        project: 'Molecule',
        milestone: 'Visual Production',
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
        description:
          'High-resolution product photography for marketing materials.',
      },
    }

    return (
      mockAssets[id as keyof typeof mockAssets] || {
        id,
        name: 'Unknown Asset',
        type: 'unknown',
        size: '0 KB',
        createdAt: '2024-01-01',
        project: 'Unknown',
        milestone: 'Unknown',
        url: '/placeholder-image.jpg',
        description: 'Asset not found.',
      }
    )
  }

  // Get all related assets from the same milestone
  const allAssets = [
    getAssetData('asset-1'),
    getAssetData('asset-2'),
    getAssetData('asset-3'),
    getAssetData('asset-4'),
    getAssetData('asset-5'),
  ]

  // Find current asset index
  const currentAssetIndex = allAssets.findIndex((a) => a.id === params.id)
  const [currentAsset, setCurrentAsset] = useState(
    allAssets[currentAssetIndex] || allAssets[0]
  )

  const isVideo = currentAsset.type === 'video'
  const isDocument = currentAsset.type === 'document'

  // Mock related assets
  const relatedAssets = allAssets.filter(
    (a) => a.milestone === currentAsset.milestone
  )

  const handleAssetChange = (assetIndex: number) => {
    const newAsset = relatedAssets[assetIndex]
    setCurrentAsset(newAsset)
    setSelectedImageIndex(assetIndex)
    // Update URL without page reload
    window.history.replaceState(null, '', `/dashboard/assets/${newAsset.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-blue-500" />
            <span className="font-medium">Asset Navigator</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{currentAsset.project}</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{currentAsset.milestone}</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900">{currentAsset.name}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Main Image */}
              <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
                <div className="aspect-[4/3] bg-gray-100">
                  <img
                    src={currentAsset.url}
                    alt={currentAsset.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Image Navigation */}
                <div className="absolute inset-y-0 left-4 flex items-center">
                  <button
                    onClick={() =>
                      handleAssetChange(Math.max(0, selectedImageIndex - 1))
                    }
                    className="p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors"
                    disabled={selectedImageIndex === 0}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute inset-y-0 right-4 flex items-center">
                  <button
                    onClick={() =>
                      handleAssetChange(
                        Math.min(
                          relatedAssets.length - 1,
                          selectedImageIndex + 1
                        )
                      )
                    }
                    className="p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors"
                    disabled={selectedImageIndex === relatedAssets.length - 1}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Related Assets Thumbnails */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-medium text-gray-900 mb-3">
                  Related Assets
                </h3>
                <div className="grid grid-cols-6 gap-2">
                  {relatedAssets.map((relatedAsset, index) => (
                    <button
                      key={relatedAsset.id}
                      onClick={() => handleAssetChange(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        relatedAsset.id === currentAsset.id
                          ? 'border-blue-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {relatedAsset.type === 'document' ? (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-gray-500" />
                        </div>
                      ) : (
                        <img
                          src={relatedAsset.url}
                          alt={relatedAsset.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Asset Info */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Asset Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500">Name</label>
                    <p className="font-medium">{currentAsset.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Type</label>
                    <p className="font-medium capitalize">
                      {currentAsset.type}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Size</label>
                    <p className="font-medium">{currentAsset.size}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Created</label>
                    <p className="font-medium">
                      {new Date(currentAsset.createdAt).toLocaleDateString(
                        'pt-BR'
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Project</label>
                    <p className="font-medium">{currentAsset.project}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Milestone</label>
                    <p className="font-medium">{currentAsset.milestone}</p>
                  </div>
                </div>

                <button className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Description
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {currentAsset.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
