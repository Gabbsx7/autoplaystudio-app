import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth/auth-provider'
import { PermissionProvider } from '@/components/role-based/permissions'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Autoplaystudio - Collaborative Design Platform',
  description:
    'Professional design collaboration platform with AI-powered features',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <PermissionProvider>{children}</PermissionProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
