'use client'

import { useState } from 'react'
import { useFeedback } from '@/hooks/use-feedback'
import { FeedbackTable } from '@/components/feedback/feedback-table'
import { RatingDistributionChart } from '@/components/feedback/rating-distribution-chart'
import { SatisfactionChart } from '@/components/feedback/satisfaction-chart'
import { SatisfactionCard } from '@/components/feedback/satisfaction-card'
import { FeedbackFilters } from '@/components/feedback/feedback-filters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { MessageSquare, Star, ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function FeedbackDashboardPage() {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [filters, setFilters] = useState({})

  const { useFeedbackList, analytics, isLoadingAnalytics } = useFeedback()
  const { data, isLoading } = useFeedbackList({ page, limit, filters })

  const statCards = [
    {
      title: 'Total Feedback',
      value: analytics?.total || 0,
      icon: MessageSquare,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Average Rating',
      value: analytics?.averageRating ? analytics.averageRating.toFixed(1) : '0.0',
      icon: Star,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      title: 'Satisfaction Rate',
      value: analytics?.satisfactionPercentage ? `${Math.round(analytics.satisfactionPercentage)}%` : '0%',
      icon: ThumbsUp,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      title: 'Negative Feedback',
      value: analytics?.negativeCount || 0,
      icon: ThumbsDown,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
    },
  ]

  if (isLoadingAnalytics) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Feedback Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor customer satisfaction and feedback
          </p>
        </div>
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

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RatingDistributionChart
          data={analytics?.ratingDistribution || []}
          total={analytics?.total || 0}
        />
        <SatisfactionChart
          data={analytics?.trendData || []}
          type="trend"
        />
      </div>

      {/* Feedback Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Feedback</CardTitle>
          <FeedbackFilters onFilterChange={setFilters} />
        </CardHeader>
        <CardContent>
          <FeedbackTable
            data={data?.data || []}
            total={data?.total || 0}
            page={page}
            limit={limit}
            onPageChange={setPage}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function DashboardSkeleton() {
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
                  <Skeleton className="mt-1 h-8 w-12" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-2 w-full" />
                </div>
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
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-full" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}