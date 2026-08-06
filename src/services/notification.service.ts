import { apiClient } from './api-client'
import {
  Notification,
  NotificationPreferences,
  NotificationFilters,
} from '@/types/notification'

const NOTIFICATION_BASE = '/notifications'

function buildParams(params?: {
  page?: number
  limit?: number
  filters?: NotificationFilters
}): Record<string, string | number> {
  const p = params ?? {}
  const query: Record<string, string | number | undefined> = {
    page: p.page,
    limit: p.limit,
    read: p.filters?.read === undefined ? undefined : String(p.filters.read),
    type: p.filters?.type?.[0],
    priority: p.filters?.priority?.[0],
    dateFrom: p.filters?.dateFrom,
    dateTo: p.filters?.dateTo,
  }
  const result: Record<string, string | number> = {}
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') {
      result[key] = value
    }
  }
  return result
}

export const notificationService = {
  // Get notifications
  async getNotifications(params?: {
    page?: number
    limit?: number
    filters?: NotificationFilters
  }): Promise<{
    data: Notification[]
    total: number
    unread: number
    page: number
    limit: number
  }> {
    return apiClient.get(NOTIFICATION_BASE, { params: buildParams(params) })
  },

  // Get unread notifications
  async getUnreadNotifications(): Promise<Notification[]> {
    return apiClient.get(`${NOTIFICATION_BASE}/unread`)
  },

  // Get unread count
  async getUnreadCount(): Promise<{ count: number }> {
    return apiClient.get(`${NOTIFICATION_BASE}/unread-count`)
  },

  // Mark notification as read
  async markAsRead(id: string): Promise<{ message: string }> {
    return apiClient.patch(`${NOTIFICATION_BASE}/${id}/read`)
  },

  // Mark all notifications as read
  async markAllAsRead(): Promise<{ message: string }> {
    return apiClient.patch(`${NOTIFICATION_BASE}/read-all`)
  },

  // Archive notification
  async archiveNotification(id: string): Promise<{ message: string }> {
    return apiClient.patch(`${NOTIFICATION_BASE}/${id}/archive`)
  },

  // Restore notification
  async restoreNotification(id: string): Promise<{ message: string }> {
    return apiClient.patch(`${NOTIFICATION_BASE}/${id}/restore`)
  },

  // Delete notification
  async deleteNotification(id: string): Promise<{ message: string }> {
    return apiClient.delete(`${NOTIFICATION_BASE}/${id}`)
  },

  // Get notification preferences
  async getPreferences(): Promise<NotificationPreferences> {
    return apiClient.get(`${NOTIFICATION_BASE}/preferences`)
  },

  // Update notification preferences
  async updatePreferences(
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    return apiClient.patch(`${NOTIFICATION_BASE}/preferences`, preferences)
  },
}
