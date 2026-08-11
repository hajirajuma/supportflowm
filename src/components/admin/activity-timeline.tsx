'use client'

import { LucideIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { AuditLog, AuditAction } from '@/types/admin'
import {
  LogIn,
  LogOut,
  KeyRound,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  UserX,
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  Activity,
} from 'lucide-react'

interface ActivityTimelineProps {
  activities: AuditLog[]
  className?: string
  limit?: number
}

const actionIcons: Record<AuditAction, LucideIcon> = {
  login: LogIn,
  logout: LogOut,
  password_change: KeyRound,
  subscription_update: CreditCard,
  tenant_suspend: AlertTriangle,
  tenant_activate: CheckCircle,
  user_invite: UserPlus,
  user_remove: UserX,
  permission_change: ShieldCheck,
  plan_create: Plus,
  plan_update: Pencil,
  plan_delete: Trash2,
}

const actionColors: Record<AuditAction, string> = {
  login: 'text-primary',
  logout: 'text-muted-foreground',
  password_change: 'text-warning',
  subscription_update: 'text-success',
  tenant_suspend: 'text-destructive',
  tenant_activate: 'text-success',
  user_invite: 'text-secondary',
  user_remove: 'text-destructive',
  permission_change: 'text-primary',
  plan_create: 'text-success',
  plan_update: 'text-warning',
  plan_delete: 'text-destructive',
}

export function ActivityTimeline({
  activities,
  className,
  limit = 8,
}: ActivityTimelineProps) {
  const displayedActivities = activities.slice(0, limit)

  if (activities.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center py-10 text-center',
          className
        )}
      >
        <Activity className="h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">No recent activity</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-5', className)}>
      {displayedActivities.map((activity) => {
        const Icon = actionIcons[activity.action] || Activity
        return (
          <div key={activity.id} className="relative flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-muted p-2">
                <Icon
                  className={cn(
                    'h-4 w-4',
                    actionColors[activity.action] || 'text-muted-foreground'
                  )}
                />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm">{activity.description}</p>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                {activity.user && (
                  <span>
                    {activity.user.firstName} {activity.user.lastName}
                  </span>
                )}
                {activity.organization && <span>{activity.organization.name}</span>}
                <span>•</span>
                <span>
                  {formatDistanceToNow(new Date(activity.createdAt), {
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
