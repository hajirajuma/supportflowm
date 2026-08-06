'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface PublicLayoutProps {
  children: ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            SupportFlow
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} SupportFlow. All rights reserved.
        </div>
      </footer>
    </div>
  )
}