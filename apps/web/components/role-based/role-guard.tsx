'use client'

import { usePermissions } from './permissions'

type Permission = {
  canInviteUsers: boolean
  canManageProjects: boolean
  canDeleteProjects: boolean
  canViewAllClients: boolean
  canManageTeam: boolean
  canViewFinancials: boolean
}

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles?: string[]
  requiredPermission?: keyof Permission
  fallback?: React.ReactNode
}

export function RoleGuard({
  children,
  allowedRoles,
  requiredPermission,
  fallback = null,
}: RoleGuardProps) {
  const { role, permissions, loading } = usePermissions()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    )
  }

  // Check role
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Your role:</strong> {role || 'None'}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Required roles:</strong>{' '}
              {allowedRoles?.join(', ') || 'None specified'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Check permission
  if (
    requiredPermission &&
    !permissions[requiredPermission as keyof typeof permissions]
  ) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Permission Required
          </h1>
          <p className="text-gray-600 mb-4">
            You don't have the required permission to access this feature.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Required permission:</strong> {requiredPermission}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
