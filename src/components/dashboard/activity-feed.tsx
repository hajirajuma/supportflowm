'use client'

import { ActivityItem } from '@/types/dashboard'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import {
  Ticket,
  CheckCircle,
  Star,
  UserPlus,
  CreditCard,
  Activity,
} from 'lucide-react'

interface ActivityFeedProps {
  activities: ActivityItem[]
  className?: string
  limit?: number
}

export function ActivityFeed({ activities, className, limit = 10 }: ActivityFeedProps) {
  const getIcon = (type: ActivityItem['type']) => {
    const icons: Partial<Record<ActivityItem['type'], any>> = {
      ticket_created: Ticket,
      ticket_resolved: CheckCircle,
      ticket_replied: Ticket,
      ticket_updated: Ticket,
      feedback_received: Star,
      user_joined: UserPlus,
      payment_received: CreditCard,
    }
    return icons[type] || Activity
  }

  const getColor = (type: ActivityItem['type']) => {
    const colors: Partial<Record<ActivityItem['type'], string>> = {
      ticket_created: 'text-primary',
      ticket_resolved: 'text-success',
      ticket_replied: 'text-primary',
      ticket_updated: 'text-primary',
      feedback_received: 'text-warning',
      user_joined: 'text-secondary',
      payment_received: 'text-success',
    }
    return colors[type] || 'text-muted-foreground'
  }

  const displayedActivities = activities.slice(0, limit)

  if (activities.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-8 text-center', className)}>
        <Activity className="h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">No recent activity</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {displayedActivities.map((activity) => {
        const Icon = getIcon(activity.type)
        return (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Icon className={cn('h-4 w-4', getColor(activity.type))} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">{activity.description}</p>
              <div className="flex items-center gap-2 mt-1">
                {activity.user && (
                  <span className="text-xs text-muted-foreground">
                    {activity.user.name}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.timestamp), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}