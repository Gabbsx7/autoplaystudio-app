// apps/web/app/dashboard/layout.tsx - REMOVER TopNav daqui
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/auth-provider'
import { usePermissions } from '@/components/role-based/permissions'
// ❌ REMOVER esta linha: import TopNav from '@/components/layout/TopNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading: authLoading } = useAuth()
  const { role, loading: permissionLoading } = usePermissions()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  // Show loading while auth/permissions are being fetched
  if (authLoading || permissionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Redirect to login if no user
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ❌ REMOVER esta linha: <TopNav /> */}
      {/* ❌ REMOVER esta linha: <main className="pt-11">{children}</main> */}

      {/* ✅ APENAS isto: */}
      {children}
    </div>
  )
}
