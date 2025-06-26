import React from 'react'
export interface AvatarProps {
  src?: string
  alt?: string
  size?: number // px – defaults to 32
  fallback?: string // initials
}
const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'avatar',
  size = 32,
  fallback,
}) => {
  const cls =
    'inline-flex items-center justify-center rounded-full overflow-hidden bg-zinc-200'
  return (
    <div className={cls} style={{ width: size, height: size }}>
      {src ? (
        <img src={src} alt={alt} className="object-cover w-full h-full" />
      ) : (
        <span className="text-xs font-medium text-zinc-600">{fallback}</span>
      )}
    </div>
  )
}
export default Avatar
