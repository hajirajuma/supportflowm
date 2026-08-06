'use client'

import { useKnowledgeBase } from '@/hooks/use-knowledge-base'
import { KnowledgeAnalyticsChart } from '@/components/knowledge-base/knowledge-analytics-chart'
import { KnowledgeStatsCard } from '@/components/knowledge-base/knowledge-stats-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BarChart3, TrendingUp, Users, Eye } from 'lucide-react'

export default function KnowledgeAnalyticsPage() {
  const { analytics, isLoadingAnalytics } = useKnowledgeBase()

  if (isLoadingAnalytics) {
    return <AnalyticsSkeleton />
  }

  if (!analytics) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    )
  }

  const stats = [
    {
      title: 'Total Views',
      value: analytics.totalViews,
      icon: Eye,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Total Articles',
      value: analytics.totalArticles,
      icon: BarChart3,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
    {
      title: 'Avg Rating',
      value: analytics.averageRating.toFixed(1),
      icon: TrendingUp,
      color: 'text-success',
      bg: 'bg-success/10',
      suffix: '/5',
    },
    {
      title: 'Published',
      value: analytics.publishedArticles,
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Knowledge Analytics</h1>
        <p className="text-muted-foreground">
          Track article performance and customer engagement
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <KnowledgeStatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <KnowledgeAnalyticsChart
          title="Views Over Time"
          data={analytics.viewsOverTime}
          type="area"
        />

        <Card>
          <CardHeader>
            <CardTitle>Popular Articles</CardTitle>
            <CardDescription>
              Most viewed articles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.popularArticles.slice(0, 5).map((article) => (
                <div key={article.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{article.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {article.views} views
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success">
                    {article.helpfulPercentage}% helpful
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
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