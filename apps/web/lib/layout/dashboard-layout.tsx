'use client'

import { useState } from 'react'
import { AuthProvider } from '@/components/auth/auth-provider'
import { Sidebar } from './sidebar'
import { TopNav } from './top-nav'

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole?: 'studio_admin' | 'studio_member' | 'client_admin' | 'client_member' | 'guest'
}

export function DashboardLayout({ children, userRole = 'client_member' }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AuthProvider>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <Sidebar 
          open={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          userRole={userRole}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav 
            onMenuClick={() => setSidebarOpen(true)}
            userRole={userRole}
          />
          
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}
