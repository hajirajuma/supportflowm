'use client'

import { useDashboard } from '@/hooks/use-dashboard'
import { MetricCard } from '@/components/dashboard/metric-card'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { ChartContainer } from '@/components/dashboard/chart-container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import {
  Building2,
  Users,
  CreditCard,
  Ticket,
  TrendingUp,
  Activity,
  Database,
  CheckCircle,
} from 'lucide-react'

export default function AdminDashboardPage() {
  const { platformStats, isLoadingPlatform } = useDashboard()

  if (isLoadingPlatform) {
    return <AdminDashboardSkeleton />
  }

  if (!platformStats) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">No platform data available</p>
      </div>
    )
  }

  const metrics = [
    {
      title: 'Total Organizations',
      value: platformStats.organizations.total,
      icon: Building2,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Active Organizations',
      value: platformStats.organizations.active,
      icon: Building2,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      title: 'Total Revenue',
      value: `$${platformStats.revenue.total.toLocaleString()}`,
      icon: CreditCard,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      title: 'Monthly Revenue',
      value: `$${platformStats.revenue.monthly.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Total Users',
      value: platformStats.users.total,
      icon: Users,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
    {
      title: 'Active Users',
      value: platformStats.users.active,
      icon: Users,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      title: 'Total Tickets',
      value: platformStats.tickets.total,
      icon: Ticket,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Avg Resolution Time',
      value: `${platformStats.tickets.averageResolutionTime}h`,
      icon: Activity,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Platform Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your SaaS platform performance
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Organization Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              type="area"
              data={platformStats.growthData}
              xKey="label"
              yKey="value"
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              type="area"
              data={platformStats.revenueData}
              xKey="label"
              yKey="value"
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      {/* Subscription Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              type="doughnut"
              data={platformStats.subscriptionDistribution.map(item => ({
                label: item.plan,
                value: item.count,
              }))}
              xKey="label"
              yKey="value"
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityFeed activities={platformStats.recentActivity} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-64" />
        <Skeleton className="mt-2 h-4 w-48" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-80 w-full" />
        ))}
      </div>
    </div>
  )
}