'use client'

import { useDashboard } from '@/hooks/use-dashboard'
import { DashboardCard } from '@/components/dashboard/dashboard-card'
import { MetricCard } from '@/components/dashboard/metric-card'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { TicketChart } from '@/components/dashboard/charts/ticket-chart'
import { CustomerSatisfactionChart } from '@/components/dashboard/charts/customer-satisfaction-chart'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDuration, formatNumber, formatPercentage } from '@/lib/utils'
import { cn } from '@/lib/utils'
import {
  Ticket,
  TicketCheck,
  Clock,
  AlertCircle,
  Star,
  Users,
  TrendingUp,
  Database,
} from 'lucide-react'

export default function TenantDashboardPage() {
  const { tenantStats, isLoadingTenant } = useDashboard()

  if (isLoadingTenant) {
    return <DashboardSkeleton />
  }

  if (!tenantStats) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Unable to load dashboard</p>
      </div>
    )
  }

  const ticketMetrics = [
    {
      title: 'Total Tickets',
      value: tenantStats.tickets.total,
      icon: Ticket,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Open Tickets',
      value: tenantStats.tickets.open,
      icon: AlertCircle,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Resolved Tickets',
      value: tenantStats.tickets.resolved,
      icon: TicketCheck,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      title: 'Pending Tickets',
      value: tenantStats.tickets.pending,
      icon: Clock,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
  ]

  const satisfactionMetrics = [
    {
      title: 'Average Rating',
      value: tenantStats.satisfaction.averageRating.toFixed(1),
      icon: Star,
      color: 'text-primary',
      bg: 'bg-primary/10',
      suffix: '/5',
    },
    {
      title: 'Satisfaction Rate',
      value: formatPercentage(tenantStats.satisfaction.satisfactionRate),
      icon: TrendingUp,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      title: 'Total Feedback',
      value: tenantStats.satisfaction.totalFeedback,
      icon: Star,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ]

  const teamMetrics = [
    {
      title: 'Active Agents',
      value: tenantStats.team.activeAgents,
      icon: Users,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
    {
      title: 'Avg Response Time',
      value: formatDuration(tenantStats.team.averageResponseTime * 60000),
      icon: Clock,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Avg Resolution Time',
      value: formatDuration(tenantStats.team.averageResolutionTime * 3600000),
      icon: TicketCheck,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      title: 'Tickets Per Agent',
      value: tenantStats.team.ticketsPerAgent.toFixed(1),
      icon: TrendingUp,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your support performance
        </p>
      </div>

      {/* Ticket Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {ticketMetrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Ticket Chart */}
        <DashboardCard title="Ticket Volume" className="md:col-span-1">
          <TicketChart data={[]} />
        </DashboardCard>

        {/* Satisfaction Chart */}
        <DashboardCard title="Customer Satisfaction" className="md:col-span-1">
          <CustomerSatisfactionChart data={[]} />
        </DashboardCard>
      </div>

      {/* Satisfaction & Team Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="grid gap-4 grid-cols-3">
          {satisfactionMetrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>
        <div className="grid gap-4 grid-cols-2">
          {teamMetrics.slice(0, 4).map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="grid gap-6 md:grid-cols-2">
        <DashboardCard title="Recent Activity">
          <ActivityFeed activities={[]} />
        </DashboardCard>
        <DashboardCard title="Usage Overview">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Storage</span>
                <span>
                  {tenantStats.usage.storageUsed.toFixed(1)}GB / {tenantStats.usage.storageLimit}GB
                </span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${(tenantStats.usage.storageUsed / tenantStats.usage.storageLimit) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tickets This Month</span>
                <span>
                  {tenantStats.usage.ticketsThisMonth} / {tenantStats.usage.ticketsLimit}
                </span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${(tenantStats.usage.ticketsThisMonth / tenantStats.usage.ticketsLimit) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
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

      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}