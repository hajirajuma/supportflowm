'use client'

import { QueryClient, QueryClientProvider as TanStackQueryProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function QueryClientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            retry: 3,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            refetchOnWindowFocus: false,
            refetchOnMount: true,
          },
          mutations: {
            retry: 1,
            retryDelay: 1000,
          },
        },
      })
  )

  return (
    <TanStackQueryProvider client={queryClient}>
      {children}
    </TanStackQueryProvider>
  )
}