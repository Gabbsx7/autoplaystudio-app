'use client'
import { RoleGuard } from '@/components/role-based/role-guard'

export default function ClientDashboard() {
  return (
    <RoleGuard allowedRoles={['client_admin', 'client_member', 'guest']}>
      {/* conteudo igual ao que você enviou, mas SEM o wrapper p-6 */}
    </RoleGuard>
  )
}
