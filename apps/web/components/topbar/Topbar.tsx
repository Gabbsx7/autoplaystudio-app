'use client'

import { Bell, Menu, Plus } from 'lucide-react'
import { Avatar } from '@/components/common/Avatar'
import { useAuth } from '@/components/auth/auth-provider'
import { usePermissions } from '@/components/role-based/permissions'
import RealtimeChat from '@/components/layout/RealtimeChat'

interface TopbarProps {
  onMenuToggle?: () => void
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
  const { user } = useAuth()
  const { permissions } = usePermissions()

  // Mock de dados do usuário - substituir por dados reais
  const userData = {
    name: user?.email?.split('@')[0] || 'User',
    avatarUrl: 'https://placehold.co/32x32',
  }

  const handleNewProject = () => {
    console.log('Create new project')
    // TODO: Implementar lógica de criação de projeto
  }

  return (
    <header className="w-full flex items-center justify-between bg-white border-b px-4 py-3 lg:px-6">
      {/* Botão menu (só visível em mobile) */}
      <div className="flex items-center">
        {onMenuToggle && (
          <button
            className="mr-2 lg:hidden p-2"
            onClick={onMenuToggle}
            aria-label="Open Menu"
          >
            <Menu className="h-5 w-5 text-muted-foreground" />
          </button>
        )}
        <h1 className="text-xl font-semibold">Client Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Botão "New Project" */}
        {permissions?.canManageProjects && (
          <button
            onClick={handleNewProject}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </button>
        )}

        {/* Ícone de Notificações */}
        <button
          className="relative p-1 rounded-full text-muted-foreground hover:text-foreground"
          aria-label="Notificações"
          title="Notificações"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Chat Drawer */}
        <RealtimeChat />

        {/* Avatar do Usuário */}
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-xs font-medium text-gray-600">
            {userData.name.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  )
}
