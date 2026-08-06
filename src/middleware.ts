import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/accept-invitation',
  '/unauthorized',
  '/forbidden',
]

// Auth routes (redirect to dashboard if authenticated)
const authRoutes = ['/login', '/forgot-password', '/reset-password']

// Role-based route access
const roleRoutes = {
  platform_admin: ['/platform-admin', '/platform-admin/*'],
  tenant_owner: ['/tenant', '/tenant/*'],
  support_agent: ['/platform', '/platform/*'],
  customer: ['/customer', '/customer/*'],
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('accessToken')?.value

  // Check if route is public
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Check if route is auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // If authenticated and trying to access auth route, redirect to dashboard
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If not authenticated and trying to access protected route
  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Role-based protection
  if (token && !isPublicRoute) {
    // Get user roles from session/cookie
    const userRoles = request.cookies.get('userRoles')?.value?.split(',') || []
    
    // Check if user has access to this route
    const hasAccess = Object.entries(roleRoutes).some(([role, routes]) => {
      if (userRoles.includes(role)) {
        return routes.some((route) => {
          if (route.endsWith('/*')) {
            const baseRoute = route.slice(0, -2)
            return pathname.startsWith(baseRoute)
          }
          return pathname === route
        })
      }
      return false
    })

    if (!hasAccess && !isPublicRoute) {
      return NextResponse.redirect(new URL('/forbidden', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp)$).*)',
  ],
}