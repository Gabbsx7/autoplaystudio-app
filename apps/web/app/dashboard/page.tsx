'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePermissions } from '@/components/role-based/permissions'

export default function DashboardPage() {
  const { role, loading } = usePermissions()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    // Redirecionar baseado na role
    switch (role) {
      case 'studio_admin':
      case 'studio_member':
        router.push('/dashboard/studio')
        break

      case 'client_admin':
      case 'client_member':
      case 'guest':
        router.push('/dashboard/client')
        break

      default:
        router.push('/auth/login')
    }
  }, [role, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return null
}
