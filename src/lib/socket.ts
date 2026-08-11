'use client'

import { io, Socket, type SocketOptions } from 'socket.io-client'
import type { ManagerOptions } from 'socket.io-client'
import { useAuthStore } from '@/store/auth-store'
import { RealtimeEvent } from '@/types/notification'

const SOCKET_URL = (
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'
).replace(/\/+$/, '')

// Maps backend gateway events to the event names consumed by hooks/components.
const EVENT_MAP: Record<string, string[]> = {
  'notification.created': ['notification:new'],
  'announcement.created': ['notification:new'],
  'ticket.notification': ['ticket:updated'],
  'feedback.notification': ['feedback:new'],
  'notification.read': ['notification:read'],
  'notification.deleted': ['notification:deleted'],
  'notification.unreadCount': ['notification:unreadCount'],
}

class SocketManager {
  private static instance: SocketManager
  private notificationSocket: Socket | null = null
  private dashboardSocket: Socket | null = null
  private listeners: Map<string, Set<(data: any) => void>> = new Map()
  private connectionListeners: Set<(connected: boolean) => void> = new Set()
  private connectedSockets = 0

  private constructor() {}

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager()
    }
    return SocketManager.instance
  }

  public connect(): void {
    const token = useAuthStore.getState().accessToken
    if (!token) {
      return
    }

    if (this.notificationSocket?.connected) {
      return
    }

    const options: Partial<ManagerOptions> & SocketOptions = {
      // Function form of auth: re-reads the token from the store on every
      // connection attempt, so a token refresh or backend restart that drops
      // sockets re-authenticates with the latest token.
      auth: (cb: (data: object) => void) =>
        cb({ token: useAuthStore.getState().accessToken }),
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    }

    this.notificationSocket = io(`${SOCKET_URL}/notifications`, options)
    this.dashboardSocket = io(`${SOCKET_URL}/dashboard`, options)

    this.bindEvents(this.notificationSocket)
    this.bindEvents(this.dashboardSocket)
  }

  private bindEvents(socket: Socket): void {
    socket.on('connect', () => {
      this.connectedSockets++
      this.emitConnectionState(true)
    })

    socket.on('disconnect', (reason) => {
      this.connectedSockets = Math.max(0, this.connectedSockets - 1)
      this.emitConnectionState(this.connectedSockets > 0)

      // The server force-disconnects sockets whose JWT is missing/expired
      // (gateway handleConnection calls client.disconnect(true)). Socket.IO
      // does not auto-reconnect on a server-initiated disconnect, so reconnect
      // manually after a short delay. The function-form `auth` re-reads the
      // latest token from the store, so a token refreshed by the axios layer
      // in the meantime is used on the next attempt.
      if (reason === 'io server disconnect') {
        setTimeout(() => {
          if (useAuthStore.getState().accessToken) {
            socket.connect()
          }
        }, 2000)
      }
    })

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })

    socket.on('event', (event: RealtimeEvent) => {
      this.notifyListeners(event.type, event.data)
    })

    Object.entries(EVENT_MAP).forEach(([backendEvent, frontendEvents]) => {
      socket.on(backendEvent, (payload: any) => {
        frontendEvents.forEach((event) => this.notifyListeners(event, payload))
      })
    })
  }

  private emitConnectionState(connected: boolean): void {
    this.connectionListeners.forEach((listener) => listener(connected))
  }

  public disconnect(): void {
    if (this.notificationSocket) {
      this.notificationSocket.disconnect()
      this.notificationSocket = null
    }
    if (this.dashboardSocket) {
      this.dashboardSocket.disconnect()
      this.dashboardSocket = null
    }
    this.connectedSockets = 0
    this.listeners.clear()
    this.emitConnectionState(false)
  }

  public emit(event: string, data: any): void {
    if (this.notificationSocket?.connected) {
      this.notificationSocket.emit(event, data)
    } else {
      console.warn('Socket not connected, event not sent:', event)
    }
  }

  public on(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)

    return () => {
      const callbacks = this.listeners.get(event)
      if (callbacks) {
        callbacks.delete(callback)
        if (callbacks.size === 0) {
          this.listeners.delete(event)
        }
      }
    }
  }

  public onConnectionChange(callback: (connected: boolean) => void): () => void {
    this.connectionListeners.add(callback)
    return () => {
      this.connectionListeners.delete(callback)
    }
  }

  private notifyListeners(event: string, data: any): void {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach((callback) => callback(data))
    }
  }

  public isConnected(): boolean {
    return this.connectedSockets > 0
  }

  public getSocket(): Socket | null {
    return this.notificationSocket
  }
}

export const socketManager = SocketManager.getInstance()
