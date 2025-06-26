import { ReactNode } from 'react'

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      {/* Sidebar do studio será adicionado aqui */}
      <div className="flex-1">{children}</div>
    </div>
  )
}
