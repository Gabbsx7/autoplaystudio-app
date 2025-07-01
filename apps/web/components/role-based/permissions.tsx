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
  isStudioMember: boolean
  clientId?: string | null
  studioId?: string | null
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
  isStudioMember: false,
  clientId: null,
  studioId: null,
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
  const [isStudioMember, setIsStudioMember] = useState(false)
  const [clientId, setClientId] = useState<string | null>(null)
  const [studioId, setStudioId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchUserRole = async () => {
      try {
        console.log('🔍 Fetching user role for:', user.id)

        // DEVELOPMENT FALLBACK: Se usuário não existe, usar usuário de teste
        let currentUserId = user.id
        if (user.id === '9f8db4fc-575b-4d7a-a12f-379a8beb9cb0') {
          // Use Gabriel Studio as test user
          currentUserId = 'a1ed3c6a-cd77-4518-af90-02627aaa0afe'
          console.log('🔧 DEV MODE: Using test user Gabriel Studio')
        }

        // NEW LOGIC: First check if user is a studio member
        // Versão simplificada para debug
        const { data: studioMemberSimple, error: studioErrorSimple } =
          await supabase
            .from('studio_members')
            .select('*')
            .eq('user_id', currentUserId)
            .maybeSingle()

        console.log('🏢 Studio member query SIMPLE result:', {
          studioMemberSimple,
          studioErrorSimple,
        })

        if (studioMemberSimple) {
          // Se encontrou na versão simples, buscar dados completos
          const { data: studioData } = await supabase
            .from('studio_members')
            .select(
              `
              studio_id,
              studio:studio!inner(id, name),
              role:roles!inner(name)
            `
            )
            .eq('user_id', currentUserId)
            .single()

          console.log('🏢 Studio member query DETAILED result:', { studioData })

          if (studioData?.role) {
            const userRole = (studioData.role as any)?.name as Role
            console.log('✅ Studio member found:', userRole, studioData)

            setRole(userRole)
            setIsStudioMember(true)
            setStudioId(studioData.studio_id)
            setClientId(null)
            setPermissions(getPermissionsForRole(userRole, false, true))

            console.log('🎯 Final state for studio member:', {
              role: userRole,
              isStudioMember: true,
              studioId: studioData.studio_id,
              canAccessStudioDashboard: true,
            })

            return // IMPORTANTE: Return aqui para não continuar verificando client_users
          }
        }

        console.log(
          'ℹ️ User not found in studio_members, checking client_users...'
        )

        // If not studio member, check client_users
        const { data: clientUser, error: clientError } = await supabase
          .from('client_users')
          .select(
            `
            client_id,
            is_primary,
            client:clients(id, name),
            role:roles(name)
          `
          )
          .eq('user_id', currentUserId)
          .maybeSingle()

        console.log('👥 Client user query result:', {
          clientUser,
          clientError,
        })

        if (clientError && clientError.code !== 'PGRST116') {
          console.error('❌ Error checking client membership:', clientError)
        }

        if (clientUser?.role) {
          // User is a client member
          const userRole = (clientUser.role as any)?.name as Role
          console.log('✅ Client member found:', userRole, clientUser)

          setRole(userRole)
          setIsStudioMember(false)
          setClientId(clientUser.client_id)
          setStudioId(null)
          setPermissions(
            getPermissionsForRole(
              userRole,
              clientUser.is_primary || false,
              false
            )
          )

          console.log('🎯 Final state for client member:', {
            role: userRole,
            isStudioMember: false,
            clientId: clientUser.client_id,
            canAccessClientDashboard: true,
          })
        } else {
          // User not found in either table - set as guest
          console.log(
            '⚠️ User not found in studio_members or client_users, setting as guest'
          )
          setRole('guest')
          setIsStudioMember(false)
          setClientId(null)
          setStudioId(null)
          setPermissions(getPermissionsForRole('guest', false, false))
        }
      } catch (error) {
        console.error('Error fetching user role:', error)
        setRole('guest')
        setIsStudioMember(false)
        setClientId(null)
        setStudioId(null)
        setPermissions(getPermissionsForRole('guest', false, false))
      } finally {
        setLoading(false)
      }
    }

    fetchUserRole()
  }, [user])

  return (
    <PermissionContext.Provider
      value={{
        role,
        permissions,
        loading,
        isStudioMember,
        clientId,
        studioId,
      }}
    >
      {children}
    </PermissionContext.Provider>
  )
}

function getPermissionsForRole(
  role: Role,
  isPrimary: boolean,
  isStudio: boolean
): Permission {
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
        canViewAllClients: true,
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
