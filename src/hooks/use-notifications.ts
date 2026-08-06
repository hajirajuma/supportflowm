'use client'

import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { notificationService } from '@/services/notification.service'
import { socketManager } from '@/lib/socket'
import { useNotificationStore } from '@/store/notification-store'
import { Notification } from '@/types/notification'

export const NOTIFICATION_QUERY_KEYS = {
  all: ['notifications'],
  list: ['notifications', 'list'],
  unread: ['notifications', 'unread'],
  count: ['notifications', 'count'],
  preferences: ['notifications', 'preferences'],
}

export function useNotifications() {
  const queryClient = useQueryClient()
  const { addNotification, incrementUnread, setUnreadCount } = useNotificationStore()

  // Get notifications
  const useNotificationList = (params?: any) => {
    return useQuery({
      queryKey: [...NOTIFICATION_QUERY_KEYS.list, params],
      queryFn: () => notificationService.getNotifications(params),
    })
  }

  // Get unread count
  const {
    data: unreadCount,
    refetch: refetchUnreadCount,
  } = useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.count,
    queryFn: () => notificationService.getUnreadCount(),
    refetchInterval: 30000,
  })

  // Get preferences
  const {
    data: preferences,
    isLoading: isLoadingPreferences,
    refetch: refetchPreferences,
  } = useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.preferences,
    queryFn: () => notificationService.getPreferences(),
  })

  // Mark as read
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.list })
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.count })
    },
  })

  // Mark all as read
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.list })
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.count })
      setUnreadCount(0)
      toast.success('All notifications marked as read')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark all as read')
    },
  })

  // Delete notification
  const deleteNotificationMutation = useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.list })
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.count })
      toast.success('Notification deleted')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete notification')
    },
  })

  // Update preferences
  const updatePreferencesMutation = useMutation({
    mutationFn: (preferences: any) => notificationService.updatePreferences(preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.preferences })
      toast.success('Preferences updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update preferences')
    },
  })

  // Real-time notification listener
  useEffect(() => {
    const unsubscribe = socketManager.on('notification:new', (notification: Notification) => {
      addNotification(notification)
      incrementUnread()
      
      // Show toast notification
      toast.info(notification.title, {
        description: notification.description,
        duration: 5000,
        action: {
          label: 'View',
          onClick: () => {
            window.location.href = notification.link || '/notifications'
          },
        },
      })
    })

    return () => {
      unsubscribe()
    }
  }, [addNotification, incrementUnread])

  return {
    useNotificationList,
    unreadCount: unreadCount?.count || 0,
    refetchUnreadCount,
    preferences,
    isLoadingPreferences,
    refetchPreferences,
    markAsRead: markAsReadMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
    markAllAsRead: markAllAsReadMutation.mutate,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    deleteNotification: deleteNotificationMutation.mutate,
    isDeleting: deleteNotificationMutation.isPending,
    updatePreferences: updatePreferencesMutation.mutate,
    isUpdatingPreferences: updatePreferencesMutation.isPending,
  }
}