'use client'

import { ReactNode, useState } from 'react'
import { Sidebar } from '@/components/layouts/Sidebar'
import { Header } from '@/components/layouts/Header'
import { cn } from '@/lib/utils'

interface PlatformLayoutProps {
  children: ReactNode
}

export function PlatformLayout({ children }: PlatformLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div
        className={cn(
          'transition-all duration-300',
          sidebarOpen ? 'ml-64' : 'ml-16'
        )}
      >
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}