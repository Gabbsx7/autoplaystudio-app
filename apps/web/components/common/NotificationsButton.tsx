import React from 'react'
import { Bell } from 'lucide-react'
const NotificationsButton = () => (
  <button className="relative p-2 rounded-full hover:bg-zinc-100">
    <Bell size={18} />
    <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full" />
  </button>
)
export default NotificationsButton
