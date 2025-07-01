'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home,
  FolderOpen,
  Users,
  Settings,
  MessageSquare,
  FileText,
  BarChart3,
  Palette,
  X,
} from 'lucide-react'
import { FolderItem } from '@/components/asset-navigator/FolderItem'

interface SidebarProps {
  open: boolean
  onClose: () => void
  userRole:
    | 'studio_admin'
    | 'studio_member'
    | 'client_admin'
    | 'client_member'
    | 'guest'
}

// Navigation items based on user role
const getNavigationItems = (role: string) => {
  const baseItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  ]

  const studioItems = [
    { name: 'Clients', href: '/dashboard/studio/clients', icon: Users },
    { name: 'Analytics', href: '/dashboard/studio/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/studio/settings', icon: Settings },
  ]

  const clientAdminItems = [
    { name: 'Team', href: '/dashboard/client/team', icon: Users },
    { name: 'Invoices', href: '/dashboard/client/invoices', icon: FileText },
    { name: 'Settings', href: '/dashboard/client/settings', icon: Settings },
  ]

  if (role.startsWith('studio')) {
    return [...baseItems, ...studioItems]
  }

  if (role === 'client_admin') {
    return [...baseItems, ...clientAdminItems]
  }

  return baseItems
}

export function Sidebar({ open, onClose, userRole }: SidebarProps) {
  const pathname = usePathname()
  const navigationItems = getNavigationItems(userRole)

  const handleItemSelect = (item: any) => {
    // Navigate to the assets page with the selected item
    // You can store the selected item in a context or URL params
    window.location.href = `/dashboard/assets?selected=${item.id}`
  }

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold">Autoplaystudio</h1>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navigation */}
          <nav className="px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                  onClick={onClose}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Files Section */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="border-t pt-4">
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                FILES
              </h3>
              <FolderItem
                type="folders-root"
                onItemSelect={handleItemSelect}
                initialExpanded={false}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                Role: {userRole.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
