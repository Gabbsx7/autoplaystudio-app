'use client'

interface NotificationItemProps {
  id: string
  title: string
  message: string
  time: string
  isRead: boolean
  onClick?: () => void
}

export function NotificationItem({
  title,
  message,
  time,
  isRead,
  onClick,
}: NotificationItemProps) {
  return (
    <div
      className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
        !isRead ? 'bg-blue-50' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600 mt-1">{message}</p>
        </div>
        {!isRead && (
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 ml-2"></div>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2">{time}</p>
    </div>
  )
}
