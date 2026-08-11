import { apiClient } from './api-client'
import {
  DashboardStats,
  AnalyticsData,
  PlatformAnalytics,
  DashboardFilters,
  AgentPerformance,
  DateRangePreset,
  ActivityItem,
} from '@/types/dashboard'

const DASHBOARD_BASE = '/dashboard'

const PRESET_TO_TREND: Partial<Record<DateRangePreset, string>> = {
  today: 'day',
  week: 'week',
  month: 'month',
  quarter: 'month',
  year: 'year',
}

function buildFilters(
  filters: DashboardFilters
): Record<string, string | number | undefined> {
  const query: Record<string, string | number | undefined> = {
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    organizationId: filters.organizationId,
    trend: filters.dateRange ? PRESET_TO_TREND[filters.dateRange] : undefined,
    departmentId: filters.departments?.[0],
    agentId: filters.agents?.[0],
    assignedToId: filters.agents?.[0],
  }
  return query
}

function mapPlatformAnalytics(raw: any): PlatformAnalytics {
  const overview = raw?.overview ?? {}
  const revenue = raw?.revenue ?? {}
  const kpis = raw?.kpis ?? {}
  const growthTrend: Array<{ period: string; count: number }> =
    raw?.platformGrowth?.trend ?? []
  const recent = raw?.recent ?? {}

  const toActivity = (
    items: any[] | undefined,
    type: ActivityItem['type'],
    description: (item: any) => string
  ): ActivityItem[] =>
    (items ?? []).map((item) => ({
      id: item.id ?? item.paymentId ?? `${type}-${item.createdAt ?? Math.random()}`,
      type,
      description: description(item),
      timestamp: item.createdAt ?? item.paidAt ?? item.timestamp ?? new Date().toISOString(),
    }))

  return {
    organizations: {
      total: overview.organizations?.total ?? 0,
      active: overview.organizations?.active ?? 0,
      newThisMonth: growthTrend[growthTrend.length - 1]?.count ?? 0,
    },
    revenue: {
      total: revenue.total ?? 0,
      monthly: revenue.monthlyRevenue ?? revenue.mrr ?? 0,
      mrr: revenue.mrr ?? 0,
      arr: revenue.arr ?? 0,
    },
    users: {
      total: overview.users?.total ?? 0,
      active: overview.users?.active ?? 0,
    },
    tickets: {
      total: overview.tickets?.total ?? 0,
      open: overview.tickets?.open ?? 0,
      resolved: overview.tickets?.resolved ?? 0,
      averageResolutionTime: Math.round((kpis.averageResolutionTimeMinutes ?? 0) / 60),
    },
    subscriptionDistribution: (raw?.subscriptionDistribution?.byPlan ?? []).map(
      (plan: any) => ({
        plan: plan.name,
        count: plan.count ?? 0,
      })
    ),
    growthData: growthTrend.map((entry) => ({
      label: entry.period,
      value: entry.count ?? 0,
    })),
    revenueData: (revenue.trend ?? []).map((entry: any) => ({
      label: entry.period,
      value: entry.value ?? 0,
    })),
    recentActivity: [
      ...toActivity(recent.organizations, 'user_joined', (org) => `Organization "${org.name}" registered`),
      ...toActivity(recent.payments, 'payment_received', (payment) => `Payment received of $${payment.amount ?? 0}`),
      ...toActivity(recent.feedback, 'feedback_received', (fb) => `New feedback${fb.rating ? ` (${fb.rating} stars)` : ''}`),
      ...toActivity(recent.tickets, 'ticket_created', (ticket) => `Ticket "${ticket.title ?? ticket.subject ?? 'New'}" created`),
    ],
  }
}

/**
 * Maps the backend's tenant dashboard payload (overview/kpis/planUsage/…)
 * onto the DashboardStats shape consumed by the tenant dashboard page.
 */
function mapTenantDashboard(raw: any): DashboardStats {
  const overview = raw?.overview ?? {}
  const kpis = raw?.kpis ?? {}
  const planUsage = raw?.planUsage ?? {}
  const remainingLimits = raw?.remainingLimits ?? {}
  const storage = raw?.storage ?? {}
  const subscription = raw?.subscription ?? {}
  const recent = raw?.recent ?? {}
  const feedbackTrends = raw?.feedbackTrends ?? []

  const tickets = overview.tickets ?? {}
  const totalTickets = tickets.total ?? 0
  const activeAgents = overview.supportAgents ?? 0
  // Feedback submitted within the selected range (sum of trend buckets).
  const totalFeedback = feedbackTrends.reduce(
    (sum: number, entry: any) => sum + (entry.count ?? 0),
    0
  )

  // Prefer the plan's configured caps; fall back to used + remaining.
  const plan = subscription?.plan ?? {}
  const storageLimitBytes =
    plan?.storageLimitBytes ??
    (planUsage.storageBytes ?? 0) + (remainingLimits.storageBytes ?? 0)
  const ticketsLimit =
    plan?.maxTicketsPerMonth ??
    (planUsage.ticketsThisMonth ?? 0) + (remainingLimits.ticketsThisMonth ?? 0)

  return {
    tickets: {
      total: totalTickets,
      open: tickets.open ?? 0,
      pending: tickets.pending ?? 0,
      resolved: tickets.resolved ?? 0,
      closed: tickets.closed ?? 0,
      overdue: tickets.overdue ?? 0,
    },
    satisfaction: {
      averageRating: kpis.averageRating ?? 0,
      satisfactionRate: kpis.customerSatisfaction ?? 0,
      totalFeedback,
      pendingFeedback: 0,
    },
    team: {
      totalAgents: activeAgents,
      activeAgents,
      // The page multiplies by 60000 / 3600000 to feed milliseconds into
      // formatDuration, so map the backend's minute-based KPIs to those
      // expected units (minutes / hours).
      averageResponseTime: kpis.averageFirstResponseTimeMinutes ?? 0,
      averageResolutionTime: (kpis.averageResolutionTimeMinutes ?? 0) / 60,
      ticketsPerAgent: activeAgents
        ? Math.round((totalTickets / activeAgents) * 10) / 10
        : 0,
    },
    usage: {
      storageUsed: storage.gb ?? 0,
      storageLimit: storageLimitBytes > 0 ? storageLimitBytes / 1e9 : 1,
      ticketsThisMonth: planUsage.ticketsThisMonth ?? 0,
      ticketsLimit: ticketsLimit > 0 ? ticketsLimit : 1,
    },
    recentActivity: (recent.activities ?? []).map(
      (activity: any): ActivityItem => ({
        id: activity.id ?? `activity-${activity.createdAt ?? Date.now()}`,
        type: 'ticket_updated',
        description:
          `${activity.action ?? 'Activity'} ${activity.entityType ?? ''}`.trim() ||
          'Activity',
        user: activity.actorName
          ? { id: activity.actorId ?? '', name: activity.actorName }
          : undefined,
        timestamp: activity.createdAt ?? new Date().toISOString(),
      })
    ),
  }
}

/**
 * Maps the backend's aggregate analytics payload (tickets/feedback/customers/
 * revenue sections) onto the AnalyticsData shape the tenant analytics page
 * expects (ticketAnalytics/customerAnalytics/teamAnalytics/revenueAnalytics).
 */
function mapTenantAnalytics(raw: any): AnalyticsData {
  const tickets = raw?.tickets ?? {}
  const feedback = raw?.feedback ?? {}
  const customers = raw?.customers ?? {}
  const revenue = raw?.revenue ?? {}
  const ticketsSummary = tickets.summary ?? {}

  const series = (rows: any[], key: string) =>
    (rows ?? []).map((row: any) => ({
      label: String(row[key] ?? 'Unknown'),
      value: row._count?._all ?? 0,
    }))

  const volume = (tickets.trend ?? []).map((t: any) => ({
    label: t.period,
    value: t.count ?? 0,
  }))
  const byStatus = series(tickets.byStatus, 'status')
  const byPriority = series(tickets.byPriority, 'priority')

  const fbTrend = (feedback.trend ?? []).map((t: any) => ({
    label: t.period,
    value: t.count ?? 0,
  }))
  const dist: Record<string, number> = feedback.ratingDistribution ?? {}
  const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
    label: `${rating} Star`,
    value: dist[rating] ?? 0,
  }))
  const positive = (dist[4] ?? 0) + (dist[5] ?? 0)
  const neutral = dist[3] ?? 0
  const negative = (dist[1] ?? 0) + (dist[2] ?? 0)
  const fbTotal = positive + neutral + negative
  const pct = (n: number) => (fbTotal > 0 ? Math.round((n / fbTotal) * 1000) / 10 : 0)

  return {
    period: {
      from: raw?.dateRange?.from ?? '',
      to: raw?.dateRange?.to ?? '',
      label: '',
    },
    summary: ticketsSummary,
    ticketAnalytics: {
      volume,
      resolutionRate: [
        { label: 'Resolution Rate', value: ticketsSummary.resolutionRate ?? 0 },
      ],
      byStatus,
      byPriority,
      byCategory: [],
    },
    customerAnalytics: {
      totalCustomers: customers.summary?.total ?? 0,
      satisfactionTrend: (feedback.trend ?? []).map((t: any) => ({
        label: t.period,
        value: t.average ?? 0,
      })),
      ratingDistribution,
      feedbackVolume: fbTrend,
      sentimentBreakdown: {
        positive: pct(positive),
        neutral: pct(neutral),
        negative: pct(negative),
      },
    },
    teamAnalytics: {
      agentPerformance: [],
      workloadDistribution: byStatus,
    },
    revenueAnalytics: {
      revenueTrend: (revenue.trend ?? []).map((t: any) => ({
        label: t.period,
        value: t.value ?? 0,
      })),
      revenueByPlan: (revenue.revenueByPlan ?? []).map((p: any) => ({
        label: p.label ?? 'Unknown',
        value: p.value ?? 0,
      })),
    },
  }
}

export const dashboardService = {
  // Tenant Dashboard
  async getTenantDashboard(): Promise<DashboardStats> {
    const raw = await apiClient.get<any>(DASHBOARD_BASE)
    return mapTenantDashboard(raw)
  },

  // Tenant Analytics
  async getTenantAnalytics(filters: DashboardFilters): Promise<AnalyticsData> {
    const raw = await apiClient.get<any>(`${DASHBOARD_BASE}/analytics`, {
      params: buildFilters(filters),
    })
    return mapTenantAnalytics(raw)
  },

  // Platform Admin Dashboard
  async getPlatformDashboard(): Promise<PlatformAnalytics> {
    const raw = await apiClient.get<any>(DASHBOARD_BASE)
    return mapPlatformAnalytics(raw)
  },

  // Agent Dashboard
  async getAgentDashboard(): Promise<{
    stats: DashboardStats
    assignedTickets: any[]
    performance: AgentPerformance
  }> {
    return apiClient.get(DASHBOARD_BASE)
  },

  // Custom Analytics
  async getTicketAnalytics(filters: DashboardFilters): Promise<any> {
    return apiClient.get(`${DASHBOARD_BASE}/analytics`, {
      params: buildFilters(filters),
    })
  },

  async getCustomerAnalytics(filters: DashboardFilters): Promise<any> {
    return apiClient.get(`${DASHBOARD_BASE}/analytics`, {
      params: buildFilters(filters),
    })
  },

  async getPerformanceAnalytics(filters: DashboardFilters): Promise<any> {
    return apiClient.get(`${DASHBOARD_BASE}/analytics`, {
      params: buildFilters(filters),
    })
  },

  async getRevenueAnalytics(filters: DashboardFilters): Promise<any> {
    return apiClient.get(`${DASHBOARD_BASE}/analytics`, {
      params: buildFilters(filters),
    })
  },

  async getUsageAnalytics(): Promise<any> {
    return apiClient.get(`${DASHBOARD_BASE}/analytics`)
  },

  // Real-time updates (WebSocket events)
  async getLiveUpdates(): Promise<any> {
    // This would be handled via WebSocket
    return null
  },
}
