'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { dashboardService } from '@/services/dashboard.service'
import { socketManager } from '@/lib/socket'
import { DashboardFilters, DashboardStats } from '@/types/dashboard'

export const DASHBOARD_QUERY_KEYS = {
  tenant: ['dashboard', 'tenant'],
  tenantAnalytics: ['dashboard', 'tenant', 'analytics'],
  platform: ['dashboard', 'platform'],
  agent: ['dashboard', 'agent'],
  ticketAnalytics: ['dashboard', 'analytics', 'tickets'],
  customerAnalytics: ['dashboard', 'analytics', 'customers'],
  performanceAnalytics: ['dashboard', 'analytics', 'performance'],
  revenueAnalytics: ['dashboard', 'analytics', 'revenue'],
  usage: ['dashboard', 'analytics', 'usage'],
}

export function useDashboard() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: 'month',
    metrics: ['tickets', 'satisfaction', 'performance'],
    compare: false,
  })

  // Tenant Dashboard
  const {
    data: tenantStats,
    isLoading: isLoadingTenant,
    refetch: refetchTenant,
  } = useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.tenant,
    queryFn: () => dashboardService.getTenantDashboard(),
    refetchInterval: 60000, // Refresh every minute
  })

  // Tenant Analytics
  const {
    data: analytics,
    isLoading: isLoadingAnalytics,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: [...DASHBOARD_QUERY_KEYS.tenantAnalytics, filters],
    queryFn: () => dashboardService.getTenantAnalytics(filters),
    refetchInterval: 60000,
  })

  // Platform Dashboard
  const {
    data: platformStats,
    isLoading: isLoadingPlatform,
    refetch: refetchPlatform,
  } = useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.platform,
    queryFn: () => dashboardService.getPlatformDashboard(),
    refetchInterval: 30000,
    enabled: false, // Only enable for platform admins
  })

  // Agent Dashboard
  const {
    data: agentStats,
    isLoading: isLoadingAgent,
    refetch: refetchAgent,
  } = useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.agent,
    queryFn: () => dashboardService.getAgentDashboard(),
    refetchInterval: 30000,
    enabled: false, // Only enable for agents
  })

  // Real-time updates
  useEffect(() => {
    const unsubscribeTicket = socketManager.on('ticket:updated', () => {
      refetchTenant()
      refetchAnalytics()
    })

    const unsubscribeFeedback = socketManager.on('feedback:new', () => {
      refetchTenant()
      refetchAnalytics()
    })

    const unsubscribePayment = socketManager.on('payment:completed', () => {
      if (platformStats) {
        refetchPlatform()
      }
    })

    return () => {
      unsubscribeTicket()
      unsubscribeFeedback()
      unsubscribePayment()
    }
  }, [refetchTenant, refetchAnalytics, refetchPlatform, platformStats])

  return {
    // Tenant
    tenantStats,
    isLoadingTenant,
    refetchTenant,

    // Analytics
    analytics,
    isLoadingAnalytics,
    refetchAnalytics,
    filters,
    setFilters,

    // Platform
    platformStats,
    isLoadingPlatform,
    refetchPlatform,

    // Agent
    agentStats,
    isLoadingAgent,
    refetchAgent,
  }
}