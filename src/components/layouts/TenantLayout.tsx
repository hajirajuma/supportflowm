'use client'

import { ReactNode } from 'react'
import { TenantSidebar } from '@/components/layouts/TenantSidebar'
import { Header } from '@/components/layouts/Header'

interface TenantLayoutProps {
  children: ReactNode
}

export function TenantLayout({ children }: TenantLayoutProps) {
  return (
    <div className="min-h-screen bg-surface">
      <TenantSidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}