'use client'

import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 to-secondary/5">
      <div className="flex min-h-screen w-full items-center justify-center overflow-y-auto px-4 py-10">
        {children}
      </div>
    </div>
  )
}