import { ReactNode } from 'react'

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      {/* Sidebar do client será adicionado aqui */}
      <div className="flex-1">{children}</div>
    </div>
  )
}
