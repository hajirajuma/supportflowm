'use client'

import { useSupport } from '@/hooks/use-support'
import { useRole } from '@/hooks/use-role'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Ticket,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  UserPlus,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

export default function SupportDashboardPage() {
  const { isSupportAgent, isTenantOwner } = useRole()
  const { stats, isLoadingStats } = useSupport()

  if (isLoadingStats) {
    return <DashboardSkeleton />
  }

  if (!stats) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Unable to load dashboard</p>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Tickets',
      value: stats.total,
      icon: Ticket,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Open & In Progress',
      value: stats.open + stats.inProgress,
      icon: Clock,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: CheckCircle,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      title: 'Closed',
      value: stats.closed,
      icon: XCircle,
      color: 'text-muted-foreground',
      bg: 'bg-muted',
    },
    {
      title: 'Unassigned',
      value: stats.unassigned,
      icon: UserPlus,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: AlertTriangle,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
    },
  ]

  const priorityStats = [
    {
      label: 'High Priority',
      value: stats.highPriority,
      color: 'text-destructive',
    },
    {
      label: 'SLA Violations',
      value: stats.slaViolations,
      color: 'text-destructive',
    },
    {
      label: 'Avg Response',
      value: formatTime(stats.averageFirstResponse),
      color: 'text-primary',
    },
    {
      label: 'Avg Resolution',
      value: formatTime(stats.averageResolution),
      color: 'text-success',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Support Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your support operations
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/support/tickets">
            <Button variant="outline">View All Tickets</Button>
          </Link>
          <Link href="/support/tickets/new">
            <Button>Create Ticket</Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={cn('rounded-full p-2', stat.bg)}>
                  <stat.icon className={cn('h-4 w-4', stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Priority Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {priorityStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest updates across all tickets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivity.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No recent activity
              </p>
            ) : (
              stats.recentActivity.slice(0, 10).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 border-b pb-3 last:border-0"
                >
                  <div className="rounded-full bg-primary/10 p-2">
                    {activity.type === 'created' && (
                      <Ticket className="h-4 w-4 text-primary" />
                    )}
                    {activity.type === 'assigned' && (
                      <User className="h-4 w-4 text-primary" />
                    )}
                    {activity.type === 'resolved' && (
                      <CheckCircle className="h-4 w-4 text-success" />
                    )}
                    {activity.type === 'closed' && (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                    {activity.type === 'overdue' && (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">#{activity.ticketNumber}</span>{' '}
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function formatTime(minutes: number): string {
  if (!minutes) return '—'
  if (minutes < 60) return `${Math.round(minutes)}m`
  const hours = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  return `${hours}h ${mins}m`
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="mt-1 h-8 w-12" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="mt-1 h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="mt-1 h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}