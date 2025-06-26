'use client'

import React, { useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { usePermissions } from '@/components/role-based/permissions'
import {
  Bell,
  Flag,
  ChevronDown,
  LogOut,
  User,
  Upload,
  Plus,
} from 'lucide-react'
import {
  UploadButton,
  NotificationsButton,
  TasksButton,
} from '@/components/common'
import InviteMemberModal from './InviteMemberModal'

export default function TopNav() {
  const { user, signOut } = useAuth()
  const { role, permissions } = usePermissions()
  const [logoDropdownOpen, setLogoDropdownOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [inviteModalOpen, setInviteModalOpen] = useState(false)

  // Mock data - substituir por dados reais depois
  const teamMembers = [
    {
      id: 1,
      name: 'John Doe',
      avatar: 'https://placehold.co/32x32',
      color: 'fuchsia-400',
    },
    {
      id: 2,
      name: 'Jane Smith',
      avatar: 'https://placehold.co/32x32',
      color: 'sky-500',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      avatar: 'https://placehold.co/32x32',
      color: 'purple-600',
    },
  ]

  const handleUpload = (files: File[]) => {
    console.log('Upload files:', files)
    // Implementar lógica de upload
  }

  return (
    <>
      <header className="w-full h-11 bg-white border-b border-zinc-300 relative">
        {/* Hamburger Menu Button (left side) */}
        <div className="absolute left-[20px] top-[4px] w-8 h-8 bg-zinc-300 rounded flex items-center justify-center">
          <div className="w-4 h-3 flex flex-col justify-between">
            <div className="w-full h-0.5 bg-gray-600 rounded" />
            <div className="w-full h-0.5 bg-gray-600 rounded" />
            <div className="w-full h-0.5 bg-gray-600 rounded" />
          </div>
        </div>

        {/* Logo/Company Name with Dropdown */}
        <div className="absolute left-[65px] top-[14px] relative">
          <button
            onClick={() => setLogoDropdownOpen(!logoDropdownOpen)}
            className="flex items-center gap-1 text-black text-xs font-medium hover:text-gray-700"
          >
            Molecule
            <ChevronDown size={12} />
          </button>

          {logoDropdownOpen && (
            <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[120px] z-50">
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                Profile
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                Settings
              </button>
            </div>
          )}
        </div>

        {/* Team Member Avatars */}
        <div className="absolute left-[189px] top-[5px] flex gap-6">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className={`w-8 h-8 bg-white rounded-full outline outline-2 outline-offset-[-2px] outline-${member.color} overflow-hidden`}
            >
              <img
                className="w-8 h-8 object-cover"
                src={member.avatar}
                alt={member.name}
              />
            </div>
          ))}
        </div>

        {/* Add Member Button */}
        <div className="absolute left-[275px] top-0 w-10 h-10">
          <div className="w-8 h-8 left-[5.25px] top-[5.25px] absolute bg-zinc-100 rounded-full" />
          <button
            onClick={() => setInviteModalOpen(true)}
            className="absolute inset-0 flex items-center justify-center hover:bg-zinc-200 rounded-full transition-colors"
          >
            <Plus size={16} className="text-neutral-800" />
          </button>
        </div>

        {/* Right Side Controls */}
        <div className="absolute right-0 top-0 flex items-center gap-3 h-11 pr-4">
          {/* Upload Button */}
          <UploadButton onSelect={handleUpload} multiple />

          {/* SHARE Button */}
          {permissions.canInviteUsers && (
            <button
              onClick={() => setInviteModalOpen(true)}
              className="w-20 h-7 bg-black rounded-3xl flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <span className="text-white text-xs font-normal">SHARE</span>
            </button>
          )}

          {/* Tasks and Notifications */}
          <TasksButton />
          <NotificationsButton />

          {/* User Avatar with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="w-8 h-8 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-zinc-200 overflow-hidden hover:outline-gray-400 transition-colors"
            >
              <img
                className="w-8 h-8 object-cover"
                src="https://placehold.co/32x32"
                alt={user?.email || 'User'}
              />
            </button>

            {userDropdownOpen && (
              <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[140px] z-50">
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                  <User size={14} />
                  View Profile
                </button>
                <hr className="my-1" />
                <button
                  onClick={signOut}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                >
                  <LogOut size={14} />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Invite Modal */}
      <InviteMemberModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
      />

      {/* Click outside handlers */}
      {(logoDropdownOpen || userDropdownOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setLogoDropdownOpen(false)
            setUserDropdownOpen(false)
          }}
        />
      )}
    </>
  )
}
