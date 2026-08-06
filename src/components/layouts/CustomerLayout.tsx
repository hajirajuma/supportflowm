'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface CustomerLayoutProps {
  children: ReactNode
}

export function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/customer" className="text-2xl font-bold text-primary">
            SupportFlow
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}