import { create } from 'zustand'
import { Notification } from '@/types/notification'

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isOpen: boolean
  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
  setUnreadCount: (count: number) => void
  incrementUnread: () => void
  decrementUnread: () => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  toggleDropdown: () => void
  setDropdownOpen: (isOpen: boolean) => void
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isOpen: false,

  setNotifications: (notifications) => {
    const unreadCount = notifications.filter((n) => !n.read).length
    set({ notifications, unreadCount })
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
    }))
  },

  setUnreadCount: (count) => {
    set({ unreadCount: count })
  },

  incrementUnread: () => {
    set((state) => ({ unreadCount: state.unreadCount + 1 }))
  },

  decrementUnread: () => {
    set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) }))
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }))
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }))
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },

  toggleDropdown: () => {
    set((state) => ({ isOpen: !state.isOpen }))
  },

  setDropdownOpen: (isOpen) => {
    set({ isOpen })
  },
}))