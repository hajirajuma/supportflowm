import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/features',
  '/pricing',
  '/about',
  '/contact',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/accept-invitation',
  '/unauthorized',
  '/forbidden',
]

// Auth routes (redirect to dashboard if authenticated)
const authRoutes = ['/login', '/forgot-password', '/reset-password']

// Role -> home dashboard
type RoleKey = 'platform_admin' | 'tenant_owner' | 'support_agent' | 'customer'
const roleHome: Record<RoleKey, string> = {
  platform_admin: '/admin/dashboard',
  tenant_owner: '/tenant/dashboard',
  support_agent: '/support/dashboard',
  customer: '/customer/dashboard',
}

// Role-based route access
const roleRoutes: Record<RoleKey, string[]> = {
  platform_admin: ['/admin', '/admin/*'],
  tenant_owner: ['/tenant', '/tenant/*'],
  support_agent: ['/support', '/support/*'],
  customer: ['/customer', '/customer/*'],
}

// Decode a JWT's payload (base64url, segment 2) without verifying the
// signature, so we can check exp/role in middleware without the secret.
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const segment = token.split('.')[1]
    if (!segment) return null
    const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const json = Buffer.from(padded, 'base64').toString('utf8')
    return JSON.parse(json) as Record<string, unknown>
  } catch {
    return null
  }
}

// A cookie with a token present is only "authenticated" if the JWT is still
// valid. Otherwise an expired session gets bounced /login -> dashboard ->
// /login forever and the login page never renders.
function isTokenValid(request: NextRequest): boolean {
  const token = request.cookies.get('accessToken')?.value
  if (!token) return false
  const payload = decodeJwtPayload(token)
  if (!payload) return false
  const exp = Number(payload.exp ?? 0)
  if (!exp) return true
  return Date.now() < exp * 1000
}

function getUserRole(request: NextRequest): RoleKey | null {
  const rawRoles =
    request.cookies.get('userRoles')?.value?.split(',').filter(Boolean) || []
  const normalized = rawRoles.map((r) => r.toLowerCase())
  return (Object.keys(roleHome) as RoleKey[]).find((role) =>
    normalized.includes(role),
  ) || null
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const role = getUserRole(request)

  // Public routes: "/" matches only the exact root so the landing page stays
  // public while every other path gets a proper auth check.
  const isPublicRoute = publicRoutes.some(
    (route) =>
      route === '/' ? pathname === '/' : pathname.startsWith(route),
  )

  // Check if route is auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Any accessToken cookie (even an expired JWT) proves the user has a
  // session. Token refresh is the client's job (401 -> refresh -> retry), so
  // middleware must not hard-bounce a signed-in user whose JWT simply lapsed
  // mid-use — that is what used to send platform admins from /admin/tenants
  // back to /login. Only a missing session cookie redirects to login.
  const hasSessionCookie = !!request.cookies.get('accessToken')?.value

  // A cookie only counts as strictly "authenticated" while the JWT is valid.
  // Auth routes (login/forgot/reset) still use the strict check so an expired
  // session can always reach /login instead of looping login -> dashboard.
  const authenticated = hasSessionCookie && isTokenValid(request)
  const effectiveRole = role

  // Authenticated users hitting auth routes (login/forgot/reset) go straight
  // to their role-specific dashboard. The marketing root "/" stays public.
  if (authenticated && effectiveRole && isAuthRoute) {
    return NextResponse.redirect(new URL(roleHome[effectiveRole], request.url))
  }

  // If there is no session at all and the route is protected, send them to
  // login (with a return path so they land back here after signing in).
  if (!hasSessionCookie && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Role-based protection: only enforce when the path lives under a
  // role-specific prefix, so shared authenticated pages (notifications, etc.)
  // keep working.
  if (effectiveRole && !isPublicRoute) {
    const isRoleScopedPath = Object.values(roleRoutes)
      .flat()
      .some((route) => {
        if (route.endsWith('/*')) {
          return pathname.startsWith(route.slice(0, -2))
        }
        return pathname === route
      })

    if (isRoleScopedPath) {
      const allowed = roleRoutes[effectiveRole] || []
      const hasAccess = allowed.some((route) => {
        if (route.endsWith('/*')) {
          return pathname.startsWith(route.slice(0, -2))
        }
        return pathname === route
      })

      if (!hasAccess) {
        return NextResponse.redirect(new URL('/forbidden', request.url))
      }
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
     * - static asset file extensions (incl. site.webmanifest generated by
     *   Next metadata) so they're never redirected to the login page
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp|webmanifest|xml|json|txt|map|woff2?|ttf|eot|otf)$).*)',
  ],
}