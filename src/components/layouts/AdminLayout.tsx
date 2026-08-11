'use client'

import { ReactNode, useState } from 'react'
import { AdminSidebar } from '@/components/layouts/AdminSidebar'
import { Header } from '@/components/layouts/Header'
import { cn } from '@/lib/utils'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleMenuClick = () => {
    const isDesktop =
      typeof window !== 'undefined' &&
      window.matchMedia('(min-width: 1024px)').matches

    if (isDesktop) {
      setCollapsed((prev) => !prev)
    } else {
      setMobileOpen(true)
    }
  }

  return (
    <div className="min-h-screen bg-surface/40">
      <AdminSidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((prev) => !prev)}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
      />

      <div
        className={cn(
          'flex min-h-screen flex-col transition-[padding] duration-300',
          collapsed ? 'lg:pl-[72px]' : 'lg:pl-64'
        )}
      >
        <Header onMenuClick={handleMenuClick} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
