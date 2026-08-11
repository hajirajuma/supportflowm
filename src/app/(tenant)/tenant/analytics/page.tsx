'use client'

import { useState } from 'react'
import { useDashboard } from '@/hooks/use-dashboard'
import { DateRangeFilter } from '@/components/dashboard/date-range-filter'
import { MetricCard } from '@/components/dashboard/metric-card'
import { AnalyticsCard } from '@/components/dashboard/analytics-card'
import { ChartContainer } from '@/components/dashboard/chart-container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { DateRange } from '@/types/dashboard'
import { TrendingUp, Users, Star, Clock, Ticket, Activity } from 'lucide-react'

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('month')
  const [activeTab, setActiveTab] = useState('tickets')

  const { analytics, isLoadingAnalytics, filters, setFilters } = useDashboard()

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Deep insights into your support performance
          </p>
        </div>
        <DateRangeFilter
          value={filters.dateRange}
          onChange={(range) => setFilters({ ...filters, dateRange: range })}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tickets">
            <Ticket className="mr-2 h-4 w-4" />
            Tickets
          </TabsTrigger>
          <TabsTrigger value="customers">
            <Users className="mr-2 h-4 w-4" />
            Customers
          </TabsTrigger>
          <TabsTrigger value="team">
            <Activity className="mr-2 h-4 w-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="revenue">
            <TrendingUp className="mr-2 h-4 w-4" />
            Revenue
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard
              title="Total Tickets"
              value={analytics.ticketAnalytics.volume.reduce((acc, d) => acc + d.value, 0)}
              icon={Ticket}
              color="text-primary"
              bg="bg-primary/10"
            />
            <MetricCard
              title="Resolution Rate"
              value={`${analytics.ticketAnalytics.resolutionRate[analytics.ticketAnalytics.resolutionRate.length - 1]?.value || 0}%`}
              icon={TrendingUp}
              color="text-success"
              bg="bg-success/10"
            />
            <MetricCard
              title="Avg Response Time"
              value="2.5h"
              icon={Clock}
              color="text-blue-500"
              bg="bg-blue-500/10"
            />
            <MetricCard
              title="Avg Resolution Time"
              value="12.5h"
              icon={Activity}
              color="text-primary"
              bg="bg-primary/10"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <AnalyticsCard title="Ticket Volume">
              <ChartContainer
                type="area"
                data={analytics.ticketAnalytics.volume}
                xKey="label"
                yKey="value"
                height={300}
              />
            </AnalyticsCard>
            <AnalyticsCard title="Tickets by Status">
              <ChartContainer
                type="pie"
                data={analytics.ticketAnalytics.byStatus}
                xKey="label"
                yKey="value"
                height={300}
              />
            </AnalyticsCard>
            <AnalyticsCard title="Tickets by Priority">
              <ChartContainer
                type="bar"
                data={analytics.ticketAnalytics.byPriority}
                xKey="label"
                yKey="value"
                height={300}
              />
            </AnalyticsCard>
            <AnalyticsCard title="Tickets by Category">
              <ChartContainer
                type="pie"
                data={analytics.ticketAnalytics.byCategory}
                xKey="label"
                yKey="value"
                height={300}
              />
            </AnalyticsCard>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard
              title="Satisfaction Rate"
              value={`${analytics.customerAnalytics.sentimentBreakdown.positive}%`}
              icon={Star}
              color="text-success"
              bg="bg-success/10"
            />
            <MetricCard
              title="Average Rating"
              value="4.2"
              icon={Star}
              color="text-primary"
              bg="bg-primary/10"
              suffix="/5"
            />
            <MetricCard
              title="Total Feedback"
              value={analytics.customerAnalytics.feedbackVolume.reduce((acc, d) => acc + d.value, 0)}
              icon={Activity}
              color="text-primary"
              bg="bg-primary/10"
            />
            <MetricCard
              title="Active Customers"
              value={analytics.customerAnalytics.totalCustomers}
              icon={Users}
              color="text-secondary"
              bg="bg-secondary/10"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <AnalyticsCard title="Satisfaction Trend">
              <ChartContainer
                type="area"
                data={analytics.customerAnalytics.satisfactionTrend}
                xKey="label"
                yKey="value"
                height={300}
              />
            </AnalyticsCard>
            <AnalyticsCard title="Rating Distribution">
              <ChartContainer
                type="bar"
                data={analytics.customerAnalytics.ratingDistribution}
                xKey="label"
                yKey="value"
                height={300}
              />
            </AnalyticsCard>
            <AnalyticsCard title="Feedback Volume">
              <ChartContainer
                type="bar"
                data={analytics.customerAnalytics.feedbackVolume}
                xKey="label"
                yKey="value"
                height={300}
              />
            </AnalyticsCard>
            <AnalyticsCard title="Sentiment Breakdown">
              <ChartContainer
                type="doughnut"
                data={[
                  { label: 'Positive', value: analytics.customerAnalytics.sentimentBreakdown.positive },
                  { label: 'Neutral', value: analytics.customerAnalytics.sentimentBreakdown.neutral },
                  { label: 'Negative', value: analytics.customerAnalytics.sentimentBreakdown.negative },
                ]}
                xKey="label"
                yKey="value"
                height={300}
              />
            </AnalyticsCard>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard
              title="Active Agents"
              value={analytics.teamAnalytics.agentPerformance.length}
              icon={Users}
              color="text-secondary"
              bg="bg-secondary/10"
            />
            <MetricCard
              title="Total Tickets Handled"
              value={analytics.teamAnalytics.agentPerformance.reduce((acc, a) => acc + a.ticketsResolved, 0)}
              icon={Ticket}
              color="text-primary"
              bg="bg-primary/10"
            />
            <MetricCard
              title="Avg Response Time"
              value="4.5m"
              icon={Clock}
              color="text-blue-500"
              bg="bg-blue-500/10"
            />
            <MetricCard
              title="Resolution Rate"
              value="92%"
              icon={TrendingUp}
              color="text-success"
              bg="bg-success/10"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <AnalyticsCard title="Agent Performance">
              <div className="space-y-4">
                {analytics.teamAnalytics.agentPerformance.map((agent) => (
                  <div key={agent.agentId} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{agent.agentName}</p>
                      <p className="text-sm text-muted-foreground">
                        {agent.ticketsResolved} resolved
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{agent.productivity}%</p>
                      <p className="text-sm text-muted-foreground">
                        {agent.averageResponseTime}m response
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </AnalyticsCard>
            <AnalyticsCard title="Workload Distribution">
              <ChartContainer
                type="pie"
                data={analytics.teamAnalytics.workloadDistribution}
                xKey="label"
                yKey="value"
                height={300}
              />
            </AnalyticsCard>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard
              title="Total Revenue"
              value="$12,450"
              icon={TrendingUp}
              color="text-success"
              bg="bg-success/10"
            />
            <MetricCard
              title="MRR"
              value="$4,150"
              icon={Activity}
              color="text-primary"
              bg="bg-primary/10"
            />
            <MetricCard
              title="ARR"
              value="$49,800"
              icon={TrendingUp}
              color="text-secondary"
              bg="bg-secondary/10"
            />
            <MetricCard
              title="Churn Rate"
              value="2.5%"
              icon={Activity}
              color="text-destructive"
              bg="bg-destructive/10"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <AnalyticsCard title="Revenue Trend">
              <ChartContainer
                type="area"
                data={analytics.revenueAnalytics.revenueTrend}
                xKey="label"
                yKey="value"
                height={300}
              />
            </AnalyticsCard>
            <AnalyticsCard title="Revenue by Plan">
              <ChartContainer
                type="pie"
                data={analytics.revenueAnalytics.revenueByPlan}
                xKey="label"
                yKey="value"
                height={300}
              />
            </AnalyticsCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-48" />
      </div>

      <Skeleton className="h-12 w-full" />

      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-80 w-full" />
        ))}
      </div>
    </div>
  )
}