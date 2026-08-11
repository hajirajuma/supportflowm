'use client'

import { ReactNode } from 'react'
import { AdminLayout } from '@/components/layouts/AdminLayout'

interface TenantLayoutProps {
  children: ReactNode
}

export function TenantLayout({ children }: TenantLayoutProps) {
  return <AdminLayout>{children}</AdminLayout>
}
