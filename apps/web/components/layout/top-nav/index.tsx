'use client'

import { useState } from 'react'
import { Bell, Upload, Flag, ChevronDown, Settings, LogOut } from 'lucide-react'
import Image from 'next/image'
import { usePermissions } from '@/components/role-based/permissions'
import { RoleGuard } from '@/components/role-based/role-guard'
import { InviteModal } from '@/components/common/invite-modal'
import { useAuth } from '@/components/auth/auth-provider'

interface TopNavProps {
  onMenuClick?: () => void
  title?: string
}

interface TeamMember {
  id: string
  name: string
  avatar: string
  status: 'online' | 'away' | 'offline'
  borderColor: string
}

// Mock team data - replace with real data from Supabase
const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'https://placehold.co/32x32',
    status: 'online',
    borderColor: 'outline-fuchsia-400',
  },
  {
    id: '2',
    name: 'Mike Rodriguez',
    avatar: 'https://placehold.co/32x32',
    status: 'online',
    borderColor: 'outline-sky-500',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    avatar: 'https://placehold.co/32x32',
    status: 'away',
    borderColor: 'outline-purple-600',
  },
]

export default function TopNav({
  onMenuClick,
  title = 'Molecule',
}: TopNavProps) {
  const { user, signOut } = useAuth()
  const { role } = usePermissions()
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const handleAddUser = () => {
    setShowInviteModal(true)
  }

  const handleUpload = () => {
    // TODO: Implement upload functionality
    console.log('Upload clicked')
  }

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share clicked')
  }

  return (
    <>
      {/* Main Nav Container */}
      <div className="w-full h-11 bg-white border-b border-zinc-300 relative">
        {/* Nav Left */}
        <div className="absolute left-5 top-[14px] flex items-center gap-4">
          {/* Logo */}
          <div className="w-8 h-8 bg-zinc-300 rounded"></div>

          {/* App Name */}
          <div className="text-black text-xs font-medium font-['Inter']">
            {title}
          </div>

          {/* Active Users */}
          <div className="flex items-center gap-1 ml-20">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className={`w-8 h-8 bg-white rounded-full outline outline-2 outline-offset-[-2px] ${member.borderColor} overflow-hidden relative`}
                title={member.name}
              >
                <Image
                  width={32}
                  height={32}
                  src={member.avatar}
                  alt={member.name}
                  className="w-8 h-8"
                />
                {/* Status indicator */}
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${
                    member.status === 'online'
                      ? 'bg-green-500'
                      : member.status === 'away'
                      ? 'bg-yellow-500'
                      : 'bg-gray-400'
                  }`}
                />
              </div>
            ))}

            {/* Add User Button - Only for admins */}
            <RoleGuard requiredPermission="canInviteUsers">
              <button
                onClick={handleAddUser}
                className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center hover:bg-zinc-200 transition-colors relative"
                title="Invite team member"
              >
                <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-0 border border-neutral-800 rounded-sm"></div>
                  <div className="w-0 h-2.5 border border-neutral-800 rounded-sm absolute"></div>
                </div>
              </button>
            </RoleGuard>
          </div>
        </div>

        {/* Nav Right */}
        <div className="absolute right-5 top-[4px] flex items-center gap-3">
          {/* Upload Button */}
          <RoleGuard requiredPermission="canUploadAssets">
            <button
              onClick={handleUpload}
              className="w-20 h-8 bg-white rounded shadow-[1px_2px_4px_0px_rgba(0,0,0,0.10)] flex items-center gap-2 px-2 hover:shadow-md transition-shadow"
            >
              <div className="w-5 h-5 rounded border border-neutral-500 flex items-center justify-center">
                <Upload className="w-3 h-3 text-neutral-500" />
              </div>
              <span className="text-zinc-400 text-[10px] font-normal font-['Inter']">
                Upload
              </span>
            </button>
          </RoleGuard>

          {/* Share Button - Admin only */}
          <RoleGuard allowedRoles={['studio_admin', 'client_admin']}>
            <button
              onClick={handleShare}
              className="w-20 h-7 bg-black rounded-3xl flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <span className="text-white text-xs font-normal font-['Inter']">
                SHARE
              </span>
            </button>
          </RoleGuard>

          {/* Bell Icon - Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-6 h-6 rounded-full border border-stone-300 flex items-center justify-center hover:bg-gray-50 transition-colors relative"
            >
              <Bell className="w-3 h-3 text-neutral-800" />
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-white text-[8px] flex items-center justify-center">
                3
              </span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="p-4 border-b hover:bg-gray-50">
                    <p className="text-sm">New comment on Marathon Project</p>
                    <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                  </div>
                  <div className="p-4 border-b hover:bg-gray-50">
                    <p className="text-sm">Task assigned to you</p>
                    <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                  </div>
                  <div className="p-4 hover:bg-gray-50">
                    <p className="text-sm">Project deadline approaching</p>
                    <p className="text-xs text-gray-500 mt-1">3 hours ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Flag Icon */}
          <button className="w-6 h-6 rounded-full border border-stone-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Flag className="w-3 h-3 text-neutral-800 opacity-50" />
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="w-8 h-8 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-zinc-200 overflow-hidden flex items-center justify-center hover:shadow-sm transition-shadow"
            >
              <Image
                width={32}
                height={32}
                src={
                  user?.user_metadata?.avatar_url ||
                  'https://placehold.co/32x32'
                }
                alt={user?.user_metadata?.full_name || 'User'}
                className="w-8 h-8"
              />
            </button>

            {/* User Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b">
                  <p className="text-sm font-medium">
                    {user?.user_metadata?.full_name || user?.email}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {role?.replace('_', ' ')}
                  </p>
                </div>
                <div className="py-2">
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </button>
                  <button
                    onClick={signOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />
    </>
  )
}
