import React from 'react'

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole?: string
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  userRole = 'guest',
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-8 py-6">{children}</div>
    </div>
  )
}
