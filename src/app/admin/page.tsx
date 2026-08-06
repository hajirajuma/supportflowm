'use client'

import { useAdmin } from '@/hooks/use-admin'
import { PlatformMetricCard } from '@/components/admin/platform-metric-card'
import { ActivityTimeline } from '@/components/admin/activity-timeline'
import { AdminDashboardChart } from '@/components/admin/admin-dashboard-chart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Building2,
  Users,
  CreditCard,
  Ticket,
  TrendingUp,
  AlertCircle,
  Database,
  Activity,
} from 'lucide-react'

export default function AdminDashboardPage() {
  const { stats, isLoadingStats } = useAdmin()

  if (isLoadingStats) {
    return <AdminDashboardSkeleton />
  }

  if (!stats) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Unable to load platform stats</p>
      </div>
    )
  }

  const metrics = [
    {
      title: 'Total Organizations',
      value: stats.organizations.total,
      icon: Building2,
      color: 'text-primary',
      bg: 'bg-primary/10',
      trend: `+${stats.organizations.newThisMonth} this month`,
    },
    {
      title: 'Active Users',
      value: stats.users.active,
      icon: Users,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
      trend: `+${stats.users.newRegistrations} new registrations`,
    },
    {
      title: 'Monthly Recurring Revenue',
      value: `$${stats.revenue.monthlyRecurringRevenue.toLocaleString()}`,
      icon: CreditCard,
      color: 'text-success',
      bg: 'bg-success/10',
      trend: `${stats.revenue.totalPayments} payments`,
    },
    {
      title: 'Total Tickets',
      value: stats.usage.totalTickets,
      icon: Ticket,
      color: 'text-primary',
      bg: 'bg-primary/10',
      trend: `${stats.usage.totalFeedback} feedback submissions`,
    },
    {
      title: 'Suspended Tenants',
      value: stats.organizations.suspended,
      icon: AlertCircle,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
    },
    {
      title: 'Failed Payments',
      value: stats.revenue.failedPayments,
      icon: CreditCard,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
    },
    {
      title: 'Storage Used',
      value: `${(stats.usage.storageUsed / 1024 / 1024 / 1024).toFixed(1)} GB`,
      icon: Database,
      color: 'text-warning',
      bg: 'bg-warning/10',
      subtitle: `of ${(stats.usage.storageLimit / 1024 / 1024 / 1024).toFixed(1)} GB`,
    },
    {
      title: 'Total Feedback',
      value: stats.usage.totalFeedback,
      icon: Activity,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Platform Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your SaaS platform performance
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <PlatformMetricCard key={metric.title} {...metric} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
            <CardDescription>
              Organizations, users, and revenue over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminDashboardChart
              data={stats.growthData}
              type="area"
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest platform events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityTimeline activities={stats.recentActivity} />
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
          <Skeleton key={i} className="h-28 w-full" />
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