'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { supabase } from '@/lib/supabase/client'

type Role =
  | 'studio_admin'
  | 'studio_member'
  | 'client_admin'
  | 'client_member'
  | 'guest'

interface Permission {
  canInviteUsers: boolean
  canManageProjects: boolean
  canDeleteProjects: boolean
  canViewAllClients: boolean
  canManageTeam: boolean
  canViewFinancials: boolean
  canUploadAssets: boolean
  canCreateTemplates: boolean
  canAccessStudioDashboard: boolean
  canAccessClientDashboard: boolean
}

interface PermissionContextType {
  role: Role | null
  permissions: Permission
  loading: boolean
}

const defaultPermissions: Permission = {
  canInviteUsers: false,
  canManageProjects: false,
  canDeleteProjects: false,
  canViewAllClients: false,
  canManageTeam: false,
  canViewFinancials: false,
  canUploadAssets: false,
  canCreateTemplates: false,
  canAccessStudioDashboard: false,
  canAccessClientDashboard: false,
}

const PermissionContext = createContext<PermissionContextType>({
  role: null,
  permissions: defaultPermissions,
  loading: true,
})

export function PermissionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const [role, setRole] = useState<Role | null>(null)
  const [permissions, setPermissions] = useState<Permission>(defaultPermissions)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchUserRole = async () => {
      try {
        const { data, error } = await supabase
          .from('client_users')
          .select(
            `
            roles!inner(name),
            is_primary
          `
          )
          .eq('user_id', user.id)
          .single()

        if (error) throw error

        const userRole = (data as any)?.roles?.name as Role
        setRole(userRole)
        setPermissions(getPermissionsForRole(userRole, (data as any)?.is_primary || false))
      } catch (error) {
        console.error('Error fetching user role:', error)
        setRole('guest')
        setPermissions(getPermissionsForRole('guest', false))
      } finally {
        setLoading(false)
      }
    }

    fetchUserRole()
  }, [user])

  return (
    <PermissionContext.Provider value={{ role, permissions, loading }}>
      {children}
    </PermissionContext.Provider>
  )
}

function getPermissionsForRole(role: Role, isPrimary: boolean): Permission {
  const basePermissions = { ...defaultPermissions }

  switch (role) {
    case 'studio_admin':
      return {
        canInviteUsers: true,
        canManageProjects: true,
        canDeleteProjects: true,
        canViewAllClients: true,
        canManageTeam: true,
        canViewFinancials: true,
        canUploadAssets: true,
        canCreateTemplates: true,
        canAccessStudioDashboard: true,
        canAccessClientDashboard: true,
      }

    case 'studio_member':
      return {
        ...basePermissions,
        canManageProjects: true,
        canUploadAssets: true,
        canAccessStudioDashboard: true,
        canAccessClientDashboard: true,
      }

    case 'client_admin':
      return {
        ...basePermissions,
        canInviteUsers: true,
        canManageProjects: true,
        canManageTeam: true,
        canViewFinancials: isPrimary,
        canUploadAssets: true,
        canAccessClientDashboard: true,
      }

    case 'client_member':
      return {
        ...basePermissions,
        canUploadAssets: true,
        canAccessClientDashboard: true,
      }

    case 'guest':
    default:
      return {
        ...basePermissions,
        canAccessClientDashboard: true, // Only Specific Projects
      }
  }
}

export const usePermissions = () => {
  const context = useContext(PermissionContext)
  if (!context) {
    throw new Error('usePermissions must be used within PermissionProvider')
  }
  return context
}
