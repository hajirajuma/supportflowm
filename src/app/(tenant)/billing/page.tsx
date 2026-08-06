'use client'

import { useBilling } from '@/hooks/use-billing'
import { useOrganization } from '@/hooks/use-organization'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from 'next/link'
import { formatDate, formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import {
  CreditCard,
  Calendar,
  TrendingUp,
  Users,
  Database,
  Ticket,
  MessageSquare,
  Zap,
  ChevronRight,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'

export default function BillingDashboardPage() {
  const { subscription, usage, isLoadingSubscription, isLoadingUsage } = useBilling()
  const { organization } = useOrganization()

  if (isLoadingSubscription || isLoadingUsage) {
    return <BillingDashboardSkeleton />
  }

  if (!subscription || !usage) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No subscription active</h3>
          <p className="text-muted-foreground">
            Choose a plan to get started
          </p>
          <Link href="/pricing">
            <Button className="mt-4">View Plans</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-success/10 text-success',
      trialing: 'bg-primary/10 text-primary',
      past_due: 'bg-destructive/10 text-destructive',
      canceled: 'bg-muted text-muted-foreground',
      incomplete: 'bg-warning/10 text-warning',
      incomplete_expired: 'bg-destructive/10 text-destructive',
    }
    return colors[status as keyof typeof colors] || 'bg-muted text-muted-foreground'
  }

  const usageItems = [
    {
      label: 'Tickets',
      current: usage.current.tickets,
      limit: usage.limit.tickets,
      percentage: usage.percentage.tickets,
      icon: Ticket,
    },
    {
      label: 'Agents',
      current: usage.current.agents,
      limit: usage.limit.agents,
      percentage: usage.percentage.agents,
      icon: Users,
    },
    {
      label: 'Customers',
      current: usage.current.customers,
      limit: usage.limit.customers,
      percentage: usage.percentage.customers,
      icon: Users,
    },
    {
      label: 'Storage',
      current: usage.current.storage,
      limit: usage.limit.storage,
      percentage: usage.percentage.storage,
      icon: Database,
      unit: 'GB',
    },
    {
      label: 'API Calls',
      current: usage.current.apiCalls,
      limit: usage.limit.apiCalls,
      percentage: usage.percentage.apiCalls,
      icon: Zap,
    },
    {
      label: 'Feedback',
      current: usage.current.feedbackResponses,
      limit: usage.limit.feedbackResponses,
      percentage: usage.percentage.feedbackResponses,
      icon: MessageSquare,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground">
            Manage your subscription and billing details
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/billing/manage">
            <Button variant="outline">Manage Subscription</Button>
          </Link>
          <Link href="/billing/history">
            <Button variant="outline">Billing History</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Current Plan */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                  {organization?.name}
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className={cn('capitalize', getStatusColor(subscription.status))}
              >
                {subscription.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold">{subscription.plan.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {subscription.plan.description}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(subscription.amount, subscription.currency)}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{subscription.interval}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Next Billing</p>
                  <p className="font-medium">
                    {formatDate(subscription.currentPeriodEnd)}
                  </p>
                </div>
                {subscription.trialEnd && (
                  <div>
                    <p className="text-sm text-muted-foreground">Trial Ends</p>
                    <p className="font-medium">
                      {formatDate(subscription.trialEnd)}
                    </p>
                  </div>
                )}
              </div>

              {subscription.cancelAtPeriodEnd && (
                <div className="rounded-lg bg-warning/10 p-3 text-sm text-warning">
                  <AlertCircle className="inline mr-2 h-4 w-4" />
                  Your subscription will end on {formatDate(subscription.currentPeriodEnd)}
                  <Link href="/billing/manage">
                    <Button variant="link" className="h-auto p-0 text-warning">
                      Reactivate
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Billing Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Billing Summary</CardTitle>
            <CardDescription>Current month overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Current Month Cost</p>
              <p className="text-2xl font-bold">
                {formatCurrency(subscription.amount, subscription.currency)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Outstanding Balance</p>
              <p className="text-2xl font-bold text-success">
                {formatCurrency(0, subscription.currency)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Seats</p>
              <p className="text-2xl font-bold">{subscription.seats}</p>
            </div>
            <Link href="/billing/history">
              <Button variant="outline" className="w-full">
                View History
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Usage Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Overview</CardTitle>
          <CardDescription>
            Monitor your resource usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {usageItems.map((item) => {
              const Icon = item.icon
              const isNearLimit = item.percentage >= 80
              const isOverLimit = item.percentage >= 100

              return (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.current} / {item.limit} {item.unit || ''}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(item.percentage, 100)}
                    className={cn(
                      'h-2',
                      isOverLimit && 'bg-destructive/20',
                      isNearLimit && !isOverLimit && 'bg-warning/20'
                    )}
                    indicatorClassName={cn(
                      isOverLimit && 'bg-destructive',
                      isNearLimit && !isOverLimit && 'bg-warning'
                    )}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{item.percentage.toFixed(0)}% used</span>
                    {isNearLimit && (
                      <span className="text-warning">
                        {isOverLimit ? 'Exceeded limit' : 'Approaching limit'}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function BillingDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="mt-1 h-4 w-48" />
              </div>
              <Skeleton className="h-6 w-24" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
              <div className="flex items-center gap-6">
                <Skeleton className="h-16 w-32" />
                <Skeleton className="h-16 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-1 h-8 w-24" />
              </div>
            ))}
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}