'use client'

import { usePermissions } from './permissions'

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
    return <div>Loading...</div>
  }

  // Check role
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <>{fallback}</>
  }

  // Check permission
  if (requiredPermission && !permissions[requiredPermission]) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
