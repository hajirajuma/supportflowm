'use client'

import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { Notification } from '@/types/notification'
import { useNotifications } from '@/hooks/use-notifications'
import { useNotificationStore } from '@/store/notification-store'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  Ticket,
  MessageSquare,
  Star,
  Users,
  Bell,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react'

interface NotificationListProps {
  notifications: Notification[]
  isLoading?: boolean
  onNotificationClick?: () => void
  className?: string
}

export function NotificationList({
  notifications,
  isLoading,
  onNotificationClick,
  className,
}: NotificationListProps) {
  const router = useRouter()
  const { markAsRead } = useNotifications()
  const { markAsRead: markAsReadStore } = useNotificationStore()

  const getIcon = (type: Notification['type']) => {
    const icons = {
      ticket_created: Ticket,
      ticket_updated: Ticket,
      ticket_assigned: Ticket,
      ticket_resolved: CheckCircle,
      ticket_closed: Ticket,
      ticket_replied: MessageSquare,
      feedback_received: Star,
      feedback_replied: Star,
      message_received: MessageSquare,
      system_announcement: Bell,
      invitation_accepted: Users,
      member_joined: Users,
      sla_warning: AlertTriangle,
    }
    return icons[type] || Bell
  }

  const getPriorityColor = (priority: Notification['priority']) => {
    const colors = {
      low: 'bg-blue-500/10 text-blue-500',
      medium: 'bg-warning/10 text-warning',
      high: 'bg-destructive/10 text-destructive',
    }
    return colors[priority]
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
      markAsReadStore(notification.id)
    }

    if (notification.link) {
      router.push(notification.link)
    }

    onNotificationClick?.()
  }

  if (isLoading) {
    return (
      <div className={cn('space-y-3 p-4', className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
        <Bell className="h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">No notifications</p>
        <p className="text-xs text-muted-foreground">
          You're all caught up!
        </p>
      </div>
    )
  }

  return (
    <div className={cn('divide-y', className)}>
      {notifications.map((notification) => {
        const Icon = getIcon(notification.type)
        return (
          <button
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            className={cn(
              'w-full px-4 py-3 text-left transition-colors hover:bg-muted/50',
              !notification.read && 'bg-primary/5 hover:bg-primary/10'
            )}
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div
                  className={cn(
                    'rounded-full p-2',
                    !notification.read ? 'bg-primary/10' : 'bg-muted'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4',
                      !notification.read ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={cn(
                      'text-sm font-medium line-clamp-1',
                      !notification.read && 'text-primary'
                    )}
                  >
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <Badge
                      variant="outline"
                      className={cn('text-xs', getPriorityColor(notification.priority))}
                    >
                      New
                    </Badge>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
                  {notification.description}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}