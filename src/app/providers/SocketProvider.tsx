'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { socketManager } from '@/lib/socket'

interface SocketContextType {
  socket: ReturnType<typeof socketManager.getSocket>
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!accessToken) {
      socketManager.disconnect()
      setIsConnected(false)
      return
    }

    socketManager.connect()
    const unsubscribe = socketManager.onConnectionChange(setIsConnected)

    return () => {
      unsubscribe()
    }
  }, [accessToken])

  return (
    <SocketContext.Provider value={{ socket: socketManager.getSocket(), isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
