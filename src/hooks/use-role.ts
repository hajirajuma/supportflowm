'use client'

import { useAuthStore } from '@/store/auth-store'
import { UserRole } from '@/types/auth'

export function useRole() {
  const { roles, user } = useAuthStore()

  const hasRole = (role: UserRole | UserRole[]) => {
    if (Array.isArray(role)) {
      return role.some((r) => roles.includes(r))
    }
    return roles.includes(role)
  }

  const isPlatformAdmin = hasRole('platform_admin')
  const isTenantOwner = hasRole('tenant_owner')
  const isSupportAgent = hasRole('support_agent')
  const isCustomer = hasRole('customer')
  const isGuest = hasRole('guest')

  return {
    hasRole,
    isPlatformAdmin,
    isTenantOwner,
    isSupportAgent,
    isCustomer,
    isGuest,
    currentRoles: roles,
    user,
  }
}