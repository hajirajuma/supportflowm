'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { adminService } from '@/services/admin.service'
import { AdminFilters, Tenant, PlatformUser } from '@/types/admin'

export const ADMIN_QUERY_KEYS = {
  stats: ['admin', 'stats'],
  tenants: ['admin', 'tenants'],
  tenant: (id: string) => ['admin', 'tenants', id],
  users: ['admin', 'users'],
  user: (id: string) => ['admin', 'users', id],
  subscriptions: ['admin', 'subscriptions'],
  subscription: (id: string) => ['admin', 'subscriptions', id],
  plans: ['admin', 'plans'],
  plan: (id: string) => ['admin', 'plans', id],
  auditLogs: ['admin', 'audit-logs'],
  settings: ['admin', 'settings'],
}

export function useAdmin() {
  const queryClient = useQueryClient()

  // Dashboard Stats
  const {
    data: stats,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ADMIN_QUERY_KEYS.stats,
    queryFn: () => adminService.getPlatformStats(),
    refetchInterval: 60000,
  })

  // Tenants
  const useTenants = (filters?: AdminFilters) => {
    return useQuery({
      queryKey: [...ADMIN_QUERY_KEYS.tenants, filters],
      queryFn: () => adminService.getTenants(filters),
      // Keep the list in sync with the dashboard metrics so newly registered
      // organizations appear without a manual refresh.
      refetchInterval: 60000,
    })
  }

  const useTenant = (id: string) => {
    return useQuery({
      queryKey: ADMIN_QUERY_KEYS.tenant(id),
      queryFn: () => adminService.getTenantById(id),
      enabled: !!id,
    })
  }

  const updateTenantStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Tenant['status'] }) =>
      adminService.updateTenantStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.tenants })
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.stats })
      toast.success('Tenant status updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update tenant status')
    },
  })

  const deleteTenantMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteTenant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.tenants })
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.stats })
      toast.success('Tenant deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete tenant')
    },
  })

  // Users
  const useUsers = (filters?: AdminFilters) => {
    return useQuery({
      queryKey: [...ADMIN_QUERY_KEYS.users, filters],
      queryFn: () => adminService.getUsers(filters),
    })
  }

  const useUser = (id: string) => {
    return useQuery({
      queryKey: ADMIN_QUERY_KEYS.user(id),
      queryFn: () => adminService.getUserById(id),
      enabled: !!id,
    })
  }

  const updateUserStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'inactive' | 'suspended' }) =>
      adminService.updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.users })
      toast.success('User status updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update user status')
    },
  })

  // Subscriptions
  const useSubscriptions = (filters?: AdminFilters) => {
    return useQuery({
      queryKey: [...ADMIN_QUERY_KEYS.subscriptions, filters],
      queryFn: () => adminService.getSubscriptions(filters),
    })
  }

  const useSubscription = (id: string) => {
    return useQuery({
      queryKey: ADMIN_QUERY_KEYS.subscription(id),
      queryFn: () => adminService.getSubscriptionById(id),
      enabled: !!id,
    })
  }

  const updateSubscriptionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminService.updateSubscription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.subscriptions })
      toast.success('Subscription updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update subscription')
    },
  })

  // Plans
  const {
    data: plans,
    isLoading: isLoadingPlans,
    refetch: refetchPlans,
  } = useQuery({
    queryKey: ADMIN_QUERY_KEYS.plans,
    queryFn: () => adminService.getPlans(),
  })

  const createPlanMutation = useMutation({
    mutationFn: (data: any) => adminService.createPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.plans })
      toast.success('Plan created successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create plan')
    },
  })

  const updatePlanMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminService.updatePlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.plans })
      toast.success('Plan updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update plan')
    },
  })

  const deletePlanMutation = useMutation({
    mutationFn: (id: string) => adminService.deletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.plans })
      toast.success('Plan deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete plan')
    },
  })

  // Audit Logs
  const useAuditLogs = (filters?: any) => {
    return useQuery({
      queryKey: [...ADMIN_QUERY_KEYS.auditLogs, filters],
      queryFn: () => adminService.getAuditLogs(filters),
    })
  }

  // Settings
  const {
    data: settings,
    isLoading: isLoadingSettings,
    refetch: refetchSettings,
  } = useQuery({
    queryKey: ADMIN_QUERY_KEYS.settings,
    queryFn: () => adminService.getSettings(),
  })

  const updateSettingsMutation = useMutation({
    mutationFn: (data: any) => adminService.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.settings })
      toast.success('Settings updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update settings')
    },
  })

  return {
    // Dashboard
    stats,
    isLoadingStats,
    refetchStats,

    // Tenants
    useTenants,
    useTenant,
    updateTenantStatus: updateTenantStatusMutation.mutate,
    isUpdatingTenantStatus: updateTenantStatusMutation.isPending,
    deleteTenant: deleteTenantMutation.mutate,
    isDeletingTenant: deleteTenantMutation.isPending,

    // Users
    useUsers,
    useUser,
    updateUserStatus: updateUserStatusMutation.mutate,
    isUpdatingUserStatus: updateUserStatusMutation.isPending,

    // Subscriptions
    useSubscriptions,
    useSubscription,
    updateSubscription: updateSubscriptionMutation.mutate,
    isUpdatingSubscription: updateSubscriptionMutation.isPending,

    // Plans
    plans,
    isLoadingPlans,
    refetchPlans,
    createPlan: createPlanMutation.mutate,
    isCreatingPlan: createPlanMutation.isPending,
    updatePlan: updatePlanMutation.mutate,
    isUpdatingPlan: updatePlanMutation.isPending,
    deletePlan: deletePlanMutation.mutate,
    isDeletingPlan: deletePlanMutation.isPending,

    // Audit Logs
    useAuditLogs,

    // Settings
    settings,
    isLoadingSettings,
    refetchSettings,
    updateSettings: updateSettingsMutation.mutate,
    isUpdatingSettings: updateSettingsMutation.isPending,
  }
}