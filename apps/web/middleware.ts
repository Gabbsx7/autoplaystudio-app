import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  try {
    // No edge runtime, as variáveis precisam ser acessadas assim
    const supabase = createMiddlewareClient({ req, res })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Protected routes
    const protectedPaths = ['/dashboard', '/project', '/studio', '/client']
    const isProtectedPath = protectedPaths.some((path) =>
      req.nextUrl.pathname.startsWith(path)
    )

    // Auth routes
    const authPaths = ['/auth/login', '/auth/signup', '/auth/reset-password']
    const isAuthPath = authPaths.some((path) =>
      req.nextUrl.pathname.startsWith(path)
    )

    // Redirect to login if accessing protected route without session
    if (isProtectedPath && !session) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    // Redirect to dashboard if accessing auth pages with active session
    if (isAuthPath && session) {
      return NextResponse.redirect(new URL('/dashboard/client', req.url))
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // Em caso de erro, permitir acesso (para não quebrar o app)
    return res
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
