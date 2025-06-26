import React from 'react'
import Avatar, { AvatarProps } from './Avatar'
interface AvatarGroupProps {
  users: AvatarProps[]
  max?: number
  size?: number
}
const AvatarGroup: React.FC<AvatarGroupProps> = ({
  users,
  max = 4,
  size = 28,
}) => {
  const visible = users.slice(0, max)
  const extra = users.length - visible.length
  return (
    <div className="flex -space-x-2">
      {visible.map((u, i) => (
        <Avatar key={i} {...u} size={size} />
      ))}
      {extra > 0 && (
        <div
          className="inline-flex items-center justify-center rounded-full bg-zinc-300 text-[10px] font-medium text-zinc-600"
          style={{ width: size, height: size }}
        >
          +{extra}
        </div>
      )}
    </div>
  )
}
export default AvatarGroup
