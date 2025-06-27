'use client'
import { ReactNode } from 'react'
import TopNav from '@/components/layout/TopNav'
import { Sidebar } from '@/lib/layout/sidebar'

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <TopNav />
      <div className="flex flex-1">
        <Sidebar open={true} onClose={() => {}} userRole="studio_admin" />
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  )
}
