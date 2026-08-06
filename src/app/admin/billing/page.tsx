'use client'

import { useBilling } from '@/hooks/use-billing'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import {
  DollarSign,
  Users,
  AlertCircle,
  TrendingUp,
  PieChart,
  CreditCard,
  Building2,
} from 'lucide-react'

export default function AdminBillingDashboard() {
  const { useBillingStats, useAdminSubscriptions } = useBilling()
  const { data: stats, isLoading: isLoadingStats } = useBillingStats()
  const { data: subscriptions, isLoading: isLoadingSubscriptions } = useAdminSubscriptions({
    page: 1,
    limit: 10,
  })

  if (isLoadingStats || isLoadingSubscriptions) {
    return <AdminBillingSkeleton />
  }

  if (!stats) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">No billing data available</p>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue, 'USD'),
      icon: DollarSign,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      title: 'Active Subscriptions',
      value: stats.activeSubscriptions,
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Failed Payments',
      value: stats.failedPayments,
      icon: AlertCircle,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
    },
    {
      title: 'Monthly Recurring Revenue',
      value: formatCurrency(stats.mrr, 'USD'),
      icon: TrendingUp,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing Administration</h1>
        <p className="text-muted-foreground">
          Monitor and manage all subscriptions
        </p>
      </div>

      {/* Stats Cards */}
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

      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue by Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Plan</CardTitle>
            <CardDescription>
              Breakdown of revenue across plans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.revenueByPlan.map((item) => (
                <div key={item.plan}>
                  <div className="flex items-center justify-between">
                    <span className="capitalize">{item.plan}</span>
                    <span className="font-medium">
                      {formatCurrency(item.revenue, 'USD')}
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${(item.revenue / stats.totalRevenue) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{item.count} subscriptions</span>
                    <span>
                      {((item.revenue / stats.totalRevenue) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
            <CardDescription>
              Important billing metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ARR</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.arr, 'USD')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Churn Rate</p>
                <p className="text-2xl font-bold">
                  {stats.churnRate.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Revenue per User</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.averageRevenuePerUser, 'USD')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                <p className="text-2xl font-bold">{stats.activeSubscriptions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Subscriptions</CardTitle>
          <CardDescription>
            Latest subscription activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptions?.data.map((subscription) => (
              <div
                key={subscription.id}
                className="flex items-center justify-between border-b pb-3 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{subscription.organizationId}</p>
                    <p className="text-sm text-muted-foreground">
                      {subscription.plan.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">
                    {formatCurrency(subscription.amount, subscription.currency)}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn('capitalize', {
                      'bg-success/10 text-success': subscription.status === 'active',
                      'bg-warning/10 text-warning': subscription.status === 'trialing',
                      'bg-destructive/10 text-destructive': subscription.status === 'past_due',
                      'bg-muted text-muted-foreground': subscription.status === 'canceled',
                    })}
                  >
                    {subscription.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(subscription.currentPeriodEnd)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AdminBillingSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-64" />
        <Skeleton className="mt-2 h-4 w-48" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-1 h-8 w-20" />
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
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j}>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="mt-1 h-2 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}