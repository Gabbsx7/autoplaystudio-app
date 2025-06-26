// apps/web/app/dashboard/client/layout.tsx - Responsivo
'use client'

import { ReactNode, useState } from 'react'
import { ClientSidebar } from '@/components/layout/sidebar/client-sidebar'
import TopNav from '@/components/layout/TopNav'
import { Menu, X } from 'lucide-react'

export default function ClientLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-stone-50">
      {/* TopNav */}
      <TopNav />

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-8 h-8 bg-white rounded-lg shadow-lg flex items-center justify-center"
      >
        {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      <div className="flex pt-11">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
          fixed lg:static inset-y-0 left-0 z-50 w-80 lg:w-96 bg-white border-r border-gray-200 
          h-[calc(100vh-44px)] lg:h-[calc(100vh-44px)] overflow-y-auto
          transform transition-transform duration-300 ease-in-out pt-11 lg:pt-0
          ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }
        `}
        >
          <ClientSidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-44px)] overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
