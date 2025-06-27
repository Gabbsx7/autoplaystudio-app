'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePermissions } from '@/components/role-based/permissions'
import { useAuth } from '@/components/auth/auth-provider'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const { role, loading } = usePermissions()
  const router = useRouter()

  useEffect(() => {
    console.log(
      'user:',
      user,
      'authLoading:',
      authLoading,
      'role:',
      role,
      'loading:',
      loading
    )
    if (authLoading || loading) return

    if (!user) {
      router.push('/auth/login')
      return
    }

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
  }, [user, authLoading, role, loading, router])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Fallback: se não houver user ou role, redireciona para login
  if (!user || !role) {
    if (typeof window !== 'undefined') {
      router.push('/auth/login')
    }
    return null
  }

  return null
}
