'use client'

import React, { useState } from 'react'
import { Download, Play, Image as ImageIcon } from 'lucide-react'

interface Asset {
  id: string
  type: 'image' | 'video'
  src: string
  thumbnail?: string
  alt?: string
  width?: number
  height?: number
}

interface AssetGalleryProps {
  assets: Asset[]
  className?: string
}

export function AssetGallery({ assets, className }: AssetGalleryProps) {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${
        className || ''
      }`}
    >
      {assets.map((asset) => (
        <AssetCard
          key={asset.id}
          asset={asset}
          onClick={() => setSelectedAsset(asset)}
        />
      ))}
    </div>
  )
}

function AssetCard({ asset, onClick }: { asset: Asset; onClick?: () => void }) {
  const [imageError, setImageError] = useState(false)

  return (
    <div
      className="relative rounded shadow-[1px_2px_4px_0px_rgba(0,0,0,0.10)] overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
      onClick={onClick}
      style={{
        width: asset.width || 256,
        height: asset.height || 256,
      }}
    >
      {!imageError ? (
        <img
          className="w-full h-full object-cover"
          src={asset.thumbnail || asset.src}
          alt={asset.alt || `Asset ${asset.id}`}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
      )}

      {/* Media Type Icon */}
      {asset.type === 'video' && (
        <div className="w-6 h-6 absolute bottom-2 right-2">
          <div className="w-5 h-5 left-[2.40px] top-[2.40px] absolute rounded outline outline-1 outline-offset-[-0.50px] outline-white" />
          <div className="w-5 h-1.5 left-[2.40px] top-[9.10px] absolute outline outline-1 outline-offset-[-0.50px] outline-white" />
          <div className="w-[2.88px] h-[2.88px] left-[14.38px] top-[5.75px] absolute bg-neutral-800 rounded-full outline outline-1 outline-offset-[-0.50px] outline-white" />
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation()
          console.log('Download asset:', asset.id)
        }}
        className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
      >
        <Download size={14} className="text-white" />
      </button>
    </div>
  )
}

export default AssetGallery
