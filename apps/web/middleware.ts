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

    // If user is authenticated and accessing auth pages, determine their role and redirect
    if (isAuthPath && session) {
      console.log(
        '🔀 MIDDLEWARE: Auth user accessing auth path, determining role for:',
        session.user.id
      )

      try {
        // Check if user is studio member first - versão simplificada
        const { data: studioMember, error: studioError } = await supabase
          .from('studio_members')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle()

        console.log('🏢 MIDDLEWARE: Studio member check:', {
          studioMember,
          studioError,
        })

        if (studioMember) {
          // Studio member - redirect to studio dashboard
          console.log(
            '🚀 MIDDLEWARE: Redirecting studio member to /dashboard/studio'
          )
          return NextResponse.redirect(new URL('/dashboard/studio', req.url))
        } else {
          // Check if client member - versão simplificada
          const { data: clientUser, error: clientError } = await supabase
            .from('client_users')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle()

          console.log('👥 MIDDLEWARE: Client user check:', {
            clientUser,
            clientError,
          })

          if (clientUser) {
            // Client member - redirect to client dashboard
            console.log(
              '🚀 MIDDLEWARE: Redirecting client member to /dashboard/client'
            )
            return NextResponse.redirect(new URL('/dashboard/client', req.url))
          } else {
            // User not found in either table - redirect to client dashboard as guest
            console.log('🚀 MIDDLEWARE: Redirecting guest to /dashboard/client')
            return NextResponse.redirect(new URL('/dashboard/client', req.url))
          }
        }
      } catch (error) {
        console.error('❌ MIDDLEWARE: Role check error:', error)
        // Fallback to client dashboard
        console.log(
          '🚀 MIDDLEWARE: Error fallback, redirecting to /dashboard/client'
        )
        return NextResponse.redirect(new URL('/dashboard/client', req.url))
      }
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
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
