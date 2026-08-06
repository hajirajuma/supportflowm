'use client'

import { ThemeProvider } from 'next-themes'
import { QueryClientProvider } from './QueryClientProvider'
import { SocketProvider } from './SocketProvider'
import { Toaster } from '@/components/ui/sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider>
        <SocketProvider>
          {children}
          <Toaster richColors position="top-right" />
        </SocketProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}