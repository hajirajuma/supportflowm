'use client'

import { useAuthStore } from '@/store/auth-store'

export function usePermission() {
  const { permissions, user } = useAuthStore()

  const hasPermission = (permission: string) => {
    return permissions.includes(permission)
  }

  const hasAllPermissions = (permissionList: string[]) => {
    return permissionList.every((p) => permissions.includes(p))
  }

  const hasAnyPermission = (permissionList: string[]) => {
    return permissionList.some((p) => permissions.includes(p))
  }

  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    permissions,
    user,
  }
}