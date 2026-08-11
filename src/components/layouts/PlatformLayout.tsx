'use client'

import { ReactNode } from 'react'
import { AdminLayout } from '@/components/layouts/AdminLayout'

interface PlatformLayoutProps {
  children: ReactNode
}

export function PlatformLayout({ children }: PlatformLayoutProps) {
  return <AdminLayout>{children}</AdminLayout>
}
