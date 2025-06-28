'use client'

import { ReactNode, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { usePermissions } from '@/components/role-based/permissions'
import { RoleGuard } from '@/components/role-based/role-guard'
import TopNav from '@/components/layout/TopNav'
import { Sidebar } from '@/lib/layout/sidebar'
import { redirect } from 'next/navigation'

interface StudioLayoutProps {
  children: ReactNode
}

export default function StudioLayout({ children }: StudioLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()
  const { role, loading } = usePermissions()

  // Role-based logic
  if (!loading) {
    // If user is not a studio member, redirect to client dashboard
    if (role && !['studio_admin', 'studio_member'].includes(role)) {
      redirect('/dashboard/client')
    }
  }

  return (
    <RoleGuard allowedRoles={['studio_admin', 'studio_member']}>
      <div className="min-h-screen flex flex-col bg-stone-50">
        <TopNav />
        <div className="flex flex-1">
          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            userRole={role || 'studio_member'}
          />
          <main className="flex-1 px-6 py-8 overflow-auto">{children}</main>
        </div>
      </div>
    </RoleGuard>
  )
}
