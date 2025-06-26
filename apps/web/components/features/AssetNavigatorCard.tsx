import React from 'react'
import { Folder } from 'lucide-react'
interface Props {
  title: string
  description?: string
  onClick?: () => void
}
const AssetNavigatorCard: React.FC<Props> = ({
  title,
  description,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="w-64 h-28 p-4 bg-white rounded shadow flex flex-col text-left hover:shadow-md"
  >
    <Folder className="mb-2 text-zinc-500" />
    <h4 className="font-medium text-sm mb-1 line-clamp-1">{title}</h4>
    {description && (
      <p className="text-[10px] text-zinc-500 line-clamp-2">{description}</p>
    )}
  </button>
)
export default AssetNavigatorCard

// packages/ui/src/components/features/index.ts
export { default as AssetNavigatorCard } from './AssetNavigatorCard'
