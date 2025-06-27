// apps/web/app/dashboard/client/layout.tsx - Responsivo
'use client'

import { ReactNode, useState } from 'react'
import { ClientSidebar } from '@/components/layout/sidebar/client-sidebar'
import TopNav from '@/components/layout/TopNav'
import { Menu, X } from 'lucide-react'

export default function ClientLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* TopNav */}
      <TopNav />

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside
          className={`
            hidden lg:flex flex-col w-[300px] bg-white border-r border-zinc-200 min-h-0 h-[calc(100vh-44px)] sticky top-11 z-20
          `}
        >
          <ClientSidebar />
        </aside>

        {/* Sidebar Mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside
          className={`
            fixed top-11 left-0 z-50 w-[260px] h-[calc(100vh-44px)] bg-white border-r border-zinc-200 transition-transform duration-300 lg:hidden
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        >
          <ClientSidebar />
        </aside>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 w-8 h-8 bg-white rounded-lg shadow-lg flex items-center justify-center border border-gray-200"
          aria-label="Abrir menu"
        >
          {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
        </button>

        {/* Main Content */}
        <main className="flex-1 min-h-0 overflow-y-auto w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-8 pb-16">
          {children}
        </main>
      </div>
    </div>
  )
}
