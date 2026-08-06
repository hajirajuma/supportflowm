import { apiClient } from './api-client'
import {
  DashboardStats,
  AnalyticsData,
  PlatformAnalytics,
  DashboardFilters,
  AgentPerformance,
  DateRangePreset,
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

export const dashboardService = {
  // Tenant Dashboard
  async getTenantDashboard(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>(DASHBOARD_BASE)
  },

  // Tenant Analytics
  async getTenantAnalytics(filters: DashboardFilters): Promise<AnalyticsData> {
    return apiClient.get<AnalyticsData>(`${DASHBOARD_BASE}/analytics`, {
      params: buildFilters(filters),
    })
  },

  // Platform Admin Dashboard
  async getPlatformDashboard(): Promise<PlatformAnalytics> {
    return apiClient.get<PlatformAnalytics>(DASHBOARD_BASE)
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
