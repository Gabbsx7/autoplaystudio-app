// apps/web/app/dashboard/client/layout.tsx
import { ReactNode } from 'react'
import { Sidebar } from '@/components/layout/sidebar/client-sidebar' // novo!
import { TopNav } from '@/components/layout/top-nav' // já criado
import { ChatDrawer } from '@/components/layout/chat-drawer' // opcional

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-stone-50">
      <Sidebar />

      <main className="flex flex-col flex-1">
        <TopNav />

        {/* conteúdo da página dashboard/client */}
        <section className="flex-1 px-6 py-8">{children}</section>
      </main>

      {/* drawer de chat em tempo-real (opcional) */}
      <ChatDrawer />
    </div>
  )
}
