'use client'

import { ReactNode } from 'react'
import { Navbar } from '@/components/marketing/navbar'
import { Footer } from '@/components/marketing/footer'

interface PublicLayoutProps {
  children: ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}