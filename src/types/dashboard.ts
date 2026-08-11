export type ChartType = 'line' | 'bar' | 'area' | 'pie' | 'doughnut'

export type DateRangePreset = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom' | 'all'

export type DateRange = DateRangePreset

export interface DashboardFilters {
  dateRange?: DateRangePreset
  dateFrom?: string
  dateTo?: string
  metrics?: string[]
  compare?: boolean
  departments?: string[]
  agents?: string[]
  [key: string]: any
}

export type ActivityType =
  | 'ticket_created'
  | 'ticket_resolved'
  | 'ticket_replied'
  | 'ticket_updated'
  | 'feedback_received'
  | 'user_joined'
  | 'member_joined'
  | 'payment_received'
  | 'invitation_sent'

export interface ActivityItem {
  id: string
  type: ActivityType
  description: string
  user?: {
    id: string
    name: string
    avatar?: string
  }
  metadata?: Record<string, any>
  timestamp: string
}

export interface DashboardStats {
  tickets: {
    total: number
    open: number
    pending: number
    resolved: number
    closed: number
    overdue: number
  }
  satisfaction: {
    averageRating: number
    satisfactionRate: number
    totalFeedback: number
    pendingFeedback: number
  }
  team: {
    totalAgents: number
    activeAgents: number
    averageResponseTime: number
    averageResolutionTime: number
    ticketsPerAgent: number
  }
  usage: {
    storageUsed: number
    storageLimit: number
    ticketsThisMonth: number
    ticketsLimit: number
  }
  recentActivity: ActivityItem[]
}

export interface AnalyticsData {
  period: {
    from: string
    to: string
    label: string
  }
  summary: Record<string, number | string>
  ticketAnalytics: {
    volume: Array<{ label: string; value: number }>
    resolutionRate: Array<{ label: string; value: number }>
    byStatus: Array<{ label: string; value: number }>
    byPriority: Array<{ label: string; value: number }>
    byCategory: Array<{ label: string; value: number }>
  }
  customerAnalytics: {
    totalCustomers: number
    satisfactionTrend: Array<{ label: string; value: number }>
    ratingDistribution: Array<{ label: string; value: number }>
    feedbackVolume: Array<{ label: string; value: number }>
    sentimentBreakdown: {
      positive: number
      neutral: number
      negative: number
    }
  }
  teamAnalytics: {
    agentPerformance: Array<{
      agentId: string
      agentName: string
      ticketsResolved: number
      productivity: number
      averageResponseTime: number
    }>
    workloadDistribution: Array<{ label: string; value: number }>
  }
  revenueAnalytics: {
    revenueTrend: Array<{ label: string; value: number }>
    revenueByPlan: Array<{ label: string; value: number }>
  }
}

export interface PlatformAnalytics {
  organizations: {
    total: number
    active: number
    newThisMonth: number
  }
  revenue: {
    total: number
    monthly: number
    mrr: number
    arr: number
  }
  users: {
    total: number
    active: number
  }
  tickets: {
    total: number
    open: number
    resolved: number
    averageResolutionTime: number
  }
  subscriptionDistribution: Array<{
    plan: string
    count: number
  }>
  growthData: Array<{ label: string; value: number }>
  revenueData: Array<{ label: string; value: number }>
  recentActivity: ActivityItem[]
}

export interface AgentPerformance {
  resolvedTickets: number
  openTickets: number
  productivity?: number
  ticketsResolved: number
  ticketsAssigned: number
  averageResponseTime: number
  averageResolutionTime: number
  satisfactionScore: number
  slaCompliance: number
  assignedTickets: Array<{
    id: string
    ticketNumber: string
    title: string
    priority: string
    status: string
    createdAt: string
  }>
}
