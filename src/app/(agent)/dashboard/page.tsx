'use client'

import { useDashboard } from '@/hooks/use-dashboard'
import { MetricCard } from '@/components/dashboard/metric-card'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  Ticket,
  CheckCircle,
  Clock,
  Users,
  Star,
  TrendingUp,
  MessageSquare,
} from 'lucide-react'
import Link from 'next/link'

export default function AgentDashboardPage() {
  const { agentStats, isLoadingAgent } = useDashboard()

  if (isLoadingAgent) {
    return <AgentDashboardSkeleton />
  }

  if (!agentStats) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Unable to load dashboard</p>
      </div>
    )
  }

  const metrics = [
    {
      title: 'Assigned Tickets',
      value: agentStats.stats.tickets.open,
      icon: Ticket,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Resolved Tickets',
      value: agentStats.stats.tickets.resolved,
      icon: CheckCircle,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      title: 'Pending Responses',
      value: agentStats.stats.tickets.pending,
      icon: Clock,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      title: 'Avg Response Time',
      value: `${agentStats.performance.averageResponseTime}m`,
      icon: TrendingUp,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Agent Dashboard</h1>
        <p className="text-muted-foreground">
          Your support performance overview
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Assigned Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {agentStats.assignedTickets.slice(0, 5).map((ticket: any) => (
                <Link key={ticket.id} href={`/support/tickets/${ticket.id}`}>
                  <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                    <div>
                      <p className="font-medium">#{ticket.ticketNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {ticket.title}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn('capitalize', {
                        'bg-blue-500/10 text-blue-500': ticket.status === 'open',
                        'bg-warning/10 text-warning': ticket.status === 'pending',
                        'bg-success/10 text-success': ticket.status === 'resolved',
                      })}
                    >
                      {ticket.status}
                    </Badge>
                  </div>
                </Link>
              ))}
              {agentStats.assignedTickets.length === 0 && (
                <p className="text-center text-muted-foreground">
                  No assigned tickets
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Productivity</p>
                <p className="text-2xl font-bold">{agentStats.performance.productivity}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Resolution Rate</p>
                <p className="text-2xl font-bold">
                  {agentStats.performance.ticketsResolved > 0
                    ? `${((agentStats.performance.ticketsResolved / agentStats.performance.ticketsAssigned) * 100).toFixed(0)}%`
                    : '0%'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Resolution Time</p>
                <p className="text-2xl font-bold">
                  {agentStats.performance.averageResolutionTime}h
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Satisfaction Score</p>
                <p className="text-2xl font-bold">
                  {agentStats.performance.satisfactionScore.toFixed(1)}
                  <span className="text-sm font-normal text-muted-foreground">/5</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AgentDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-64" />
        <Skeleton className="mt-2 h-4 w-48" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    </div>
  )
}