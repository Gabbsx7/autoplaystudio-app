'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { usePermissions } from '@/components/role-based/permissions'
import { supabase } from '@/lib/supabase/client'

interface DebugInfo {
  userId: string | null
  userEmail: string | null
  roleFromHook: string | null
  isStudioMemberFromHook: boolean
  clientIdFromHook: string | null
  studioIdFromHook: string | null
  permissionsFromHook: any
  rawStudioMemberData: any[]
  rawClientUsersData: any[]
  rawRolesData: any[]
  loading: boolean
}

export function RoleDebug() {
  const { user } = useAuth()
  const {
    role,
    permissions,
    loading: permissionLoading,
    isStudioMember,
    clientId,
    studioId,
  } = usePermissions()
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    userId: null,
    userEmail: null,
    roleFromHook: null,
    isStudioMemberFromHook: false,
    clientIdFromHook: null,
    studioIdFromHook: null,
    permissionsFromHook: null,
    rawStudioMemberData: [],
    rawClientUsersData: [],
    rawRolesData: [],
    loading: true,
  })

  useEffect(() => {
    const fetchDebugInfo = async () => {
      if (!user) {
        setDebugInfo((prev) => ({ ...prev, loading: false }))
        return
      }

      try {
        // Get raw data from studio_members table
        const { data: studioMemberData, error: studioMemberError } =
          await supabase
            .from('studio_members')
            .select(
              `
              *,
              studio:studio(*),
              role:roles(*)
            `
            )
            .eq('user_id', user.id)

        // Get raw data from client_users table
        const { data: clientUsersData, error: clientUsersError } =
          await supabase
            .from('client_users')
            .select(
              `
              *,
              client:clients(*),
              role:roles(*)
            `
            )
            .eq('user_id', user.id)

        // Get all roles for reference
        const { data: rolesData, error: rolesError } = await supabase
          .from('roles')
          .select('*')

        setDebugInfo({
          userId: user.id,
          userEmail: user.email || null,
          roleFromHook: role,
          isStudioMemberFromHook: isStudioMember,
          clientIdFromHook: clientId ?? null,
          studioIdFromHook: studioId ?? null,
          permissionsFromHook: permissions,
          rawStudioMemberData: studioMemberData || [],
          rawClientUsersData: clientUsersData || [],
          rawRolesData: rolesData || [],
          loading: false,
        })

        console.log('🔍 Role Debug Info:', {
          user,
          role,
          isStudioMember,
          clientId,
          studioId,
          permissions,
          studioMemberData,
          studioMemberError,
          clientUsersData,
          clientUsersError,
          rolesData,
          rolesError,
        })
      } catch (error) {
        console.error('Error fetching debug info:', error)
        setDebugInfo((prev) => ({ ...prev, loading: false }))
      }
    }

    fetchDebugInfo()
  }, [user, role, permissions, isStudioMember, clientId, studioId])

  if (debugInfo.loading || permissionLoading) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800">Loading debug info...</h3>
      </div>
    )
  }

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="font-semibold text-blue-800 mb-4">
        🔍 Role Debug Information (NEW SCHEMA)
      </h3>

      <div className="space-y-4 text-sm">
        <div>
          <h4 className="font-medium text-blue-700">User Info:</h4>
          <p>ID: {debugInfo.userId}</p>
          <p>Email: {debugInfo.userEmail}</p>
        </div>

        <div>
          <h4 className="font-medium text-blue-700">Hook Results:</h4>
          <div className="bg-white p-2 rounded border">
            <p>
              Role:{' '}
              <span
                className={`font-mono ${
                  debugInfo.roleFromHook ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {debugInfo.roleFromHook || 'null'}
              </span>
            </p>
            <p>
              Is Studio Member:{' '}
              <span
                className={`font-mono ${
                  debugInfo.isStudioMemberFromHook
                    ? 'text-green-600'
                    : 'text-orange-600'
                }`}
              >
                {debugInfo.isStudioMemberFromHook ? 'Yes' : 'No'}
              </span>
            </p>
            <p>
              Client ID:{' '}
              <span className="font-mono">
                {debugInfo.clientIdFromHook || 'null'}
              </span>
            </p>
            <p>
              Studio ID:{' '}
              <span className="font-mono">
                {debugInfo.studioIdFromHook || 'null'}
              </span>
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-blue-700">
            Raw studio_members Data:
          </h4>
          <pre className="bg-white p-2 rounded border text-xs overflow-auto max-h-40">
            {JSON.stringify(debugInfo.rawStudioMemberData, null, 2)}
          </pre>
          <p
            className={`text-xs mt-1 ${
              debugInfo.rawStudioMemberData.length > 0
                ? 'text-green-600'
                : 'text-gray-500'
            }`}
          >
            {debugInfo.rawStudioMemberData.length > 0
              ? '✅ Found in studio_members'
              : '❌ Not found in studio_members'}
          </p>
        </div>

        <div>
          <h4 className="font-medium text-blue-700">Raw client_users Data:</h4>
          <pre className="bg-white p-2 rounded border text-xs overflow-auto max-h-40">
            {JSON.stringify(debugInfo.rawClientUsersData, null, 2)}
          </pre>
          <p
            className={`text-xs mt-1 ${
              debugInfo.rawClientUsersData.length > 0
                ? 'text-green-600'
                : 'text-gray-500'
            }`}
          >
            {debugInfo.rawClientUsersData.length > 0
              ? '✅ Found in client_users'
              : '❌ Not found in client_users'}
          </p>
        </div>

        <div>
          <h4 className="font-medium text-blue-700">Permissions from Hook:</h4>
          <pre className="bg-white p-2 rounded border text-xs overflow-auto">
            {JSON.stringify(debugInfo.permissionsFromHook, null, 2)}
          </pre>
        </div>

        <div>
          <h4 className="font-medium text-blue-700">Available Roles in DB:</h4>
          <pre className="bg-white p-2 rounded border text-xs overflow-auto">
            {JSON.stringify(debugInfo.rawRolesData, null, 2)}
          </pre>
        </div>

        <div>
          <h4 className="font-medium text-blue-700">Dashboard Access:</h4>
          <div className="bg-white p-2 rounded border">
            <p>
              Can Access Studio Dashboard:
              <span
                className={
                  debugInfo.permissionsFromHook?.canAccessStudioDashboard
                    ? 'text-green-600'
                    : 'text-red-600'
                }
              >
                {debugInfo.permissionsFromHook?.canAccessStudioDashboard
                  ? ' ✅ Yes'
                  : ' ❌ No'}
              </span>
            </p>
            <p>
              Can Access Client Dashboard:
              <span
                className={
                  debugInfo.permissionsFromHook?.canAccessClientDashboard
                    ? 'text-green-600'
                    : 'text-red-600'
                }
              >
                {debugInfo.permissionsFromHook?.canAccessClientDashboard
                  ? ' ✅ Yes'
                  : ' ❌ No'}
              </span>
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-blue-700">
            Expected Dashboard Route:
          </h4>
          <div className="bg-white p-2 rounded border">
            {debugInfo.isStudioMemberFromHook ? (
              <p className="text-purple-600">
                👉 Should redirect to: <strong>/dashboard/studio</strong>
              </p>
            ) : (
              <p className="text-blue-600">
                👉 Should redirect to: <strong>/dashboard/client</strong>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
