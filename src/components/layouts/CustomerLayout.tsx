'use client'

import { ReactNode } from 'react'
import { CustomerSidebar } from '@/components/layouts/CustomerSidebar'

interface CustomerLayoutProps {
  children: ReactNode
}

export function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <div className="min-h-screen bg-surface">
      <CustomerSidebar />
      <div className="lg:pl-64">
        <main className="container mx-auto max-w-6xl px-4 py-8">{children}</main>
      </div>
    </div>
  )
}