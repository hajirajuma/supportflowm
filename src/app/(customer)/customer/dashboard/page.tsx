'use client'

import Link from 'next/link'
import { useCustomer } from '@/hooks/use-customer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import {
  Ticket,
  TicketCheck,
  Clock,
  Star,
  Bell,
  Plus,
  Search,
  FileText,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function CustomerDashboardPage() {
  const { profile, stats, isLoadingProfile, isLoadingStats } = useCustomer()

  if (isLoadingProfile || isLoadingStats) {
    return <DashboardSkeleton />
  }

  if (!profile || !stats) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Unable to load dashboard</p>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Open Tickets',
      value: stats.openTickets,
      icon: Ticket,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Pending Tickets',
      value: stats.pendingTickets,
      icon: Clock,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      title: 'Resolved Tickets',
      value: stats.resolvedTickets,
      icon: TicketCheck,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      title: 'Pending Feedback',
      value: stats.pendingFeedback,
      icon: Star,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {profile.user.firstName}
          </h1>
          <p className="text-muted-foreground">
            {profile.organization.name} Support Portal
          </p>
        </div>
        <Link href="/customer/tickets/new">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Create Ticket
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common support tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Link href="/customer/tickets/new">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              New Ticket
            </Button>
          </Link>
          <Link href="/customer/tickets">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              My Tickets
            </Button>
          </Link>
          <Link href="/customer/knowledge-base">
            <Button variant="outline" className="w-full justify-start">
              <Search className="mr-2 h-4 w-4" />
              Knowledge Base
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates on your tickets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivities.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No recent activity
              </p>
            ) : (
              stats.recentActivities.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 border-b pb-3 last:border-0"
                >
                  <div className="rounded-full bg-primary/10 p-2">
                    {activity.type === 'ticket_created' && (
                      <Ticket className="h-4 w-4 text-primary" />
                    )}
                    {activity.type === 'ticket_updated' && (
                      <Clock className="h-4 w-4 text-primary" />
                    )}
                    {activity.type === 'ticket_resolved' && (
                      <TicketCheck className="h-4 w-4 text-success" />
                    )}
                    {activity.type === 'reply' && (
                      <MessageSquare className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.description}</p>
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

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-1 h-8 w-12" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
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
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
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