'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { UserRole } from '@/types/auth'

interface AuthGuardProps {
  children: ReactNode
  requiredRoles?: UserRole[]
  requiredPermissions?: string[]
}

export function AuthGuard({
  children,
  requiredRoles,
  requiredPermissions,
}: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, isLoading, roles, permissions } = useAuthStore()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${pathname}`)
    }

    if (!isLoading && isAuthenticated && user) {
      // Check roles
      if (requiredRoles && requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.some((role) => roles.includes(role))
        if (!hasRequiredRole) {
          router.push('/forbidden')
        }
      }

      // Check permissions
      if (requiredPermissions && requiredPermissions.length > 0) {
        const hasRequiredPermission = requiredPermissions.every((permission) =>
          permissions.includes(permission)
        )
        if (!hasRequiredPermission) {
          router.push('/forbidden')
        }
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    user,
    roles,
    permissions,
    requiredRoles,
    requiredPermissions,
    router,
    pathname,
  ])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  // Check roles
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) => roles.includes(role))
    if (!hasRequiredRole) {
      return null
    }
  }

  // Check permissions
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasRequiredPermission = requiredPermissions.every((permission) =>
      permissions.includes(permission)
    )
    if (!hasRequiredPermission) {
      return null
    }
  }

  return <>{children}</>
}