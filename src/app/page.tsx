'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuthStore()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        const role = user.roles[0]
        switch (role) {
          case 'platform_admin':
            router.push('/platform-admin/dashboard')
            break
          case 'tenant_owner':
            router.push('/tenant/dashboard')
            break
          case 'support_agent':
            router.push('/platform/tickets')
            break
          case 'customer':
            router.push('/customer/tickets')
            break
          default:
            router.push('/dashboard')
        }
      } else {
        router.push('/login')
      }
    }
  }, [isAuthenticated, isLoading, user, router])

  return (
    <div className="flex h-screen items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}