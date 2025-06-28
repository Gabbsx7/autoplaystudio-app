'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePermissions } from '@/components/role-based/permissions'
import { useAuth } from '@/components/auth/auth-provider'
import { RoleDebug } from '@/components/debug/RoleDebug'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const { role, loading } = usePermissions()
  const router = useRouter()

  useEffect(() => {
    console.log('🚦 DASHBOARD REDIRECT - Current state:', {
      user: user?.id,
      authLoading,
      role,
      loading,
      userEmail: user?.email,
    })

    if (authLoading || loading) {
      console.log('⏳ Still loading auth or permissions...')
      return
    }

    if (!user) {
      console.log('❌ No user found, redirecting to login')
      router.push('/auth/login')
      return
    }

    console.log('🎯 REDIRECTING based on role:', role)

    // Redirecionar baseado na role
    switch (role) {
      case 'studio_admin':
      case 'studio_member':
        console.log(
          '🏢 Studio member detected, redirecting to /dashboard/studio'
        )
        router.push('/dashboard/studio')
        break

      case 'client_admin':
      case 'client_member':
      case 'guest':
        console.log(
          '👥 Client member detected, redirecting to /dashboard/client'
        )
        router.push('/dashboard/client')
        break

      default:
        console.log('❓ Unknown role, redirecting to login:', role)
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

  // Temporary debug component to investigate role issues
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Debug Mode</h1>
      <RoleDebug />
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="font-semibold mb-2">Manual Navigation:</h2>
        <div className="space-x-4">
          <button
            onClick={() => router.push('/dashboard/studio')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Studio Dashboard
          </button>
          <button
            onClick={() => router.push('/dashboard/client')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Go to Client Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
