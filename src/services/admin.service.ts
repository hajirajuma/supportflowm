import { apiClient } from './api-client'
import {
  Tenant,
  PlatformUser,
  PlatformSubscription,
  PlatformPlan,
  AuditLog,
  AuditAction,
  PlatformStats,
  SystemSettings,
  AdminFilters,
} from '@/types/admin'

const ADMIN_BASE = '/admin'

export const adminService = {
  // Dashboard
  async getPlatformStats(): Promise<PlatformStats> {
    return apiClient.get<PlatformStats>(`${ADMIN_BASE}/stats`)
  },

  // Tenants
  async getTenants(filters?: AdminFilters): Promise<{ data: Tenant[]; total: number }> {
    return apiClient.get(`${ADMIN_BASE}/tenants`, { params: filters })
  },

  async getTenantById(id: string): Promise<Tenant> {
    return apiClient.get<Tenant>(`${ADMIN_BASE}/tenants/${id}`)
  },

  async updateTenantStatus(id: string, status: Tenant['status']): Promise<Tenant> {
    return apiClient.patch(`${ADMIN_BASE}/tenants/${id}/status`, { status })
  },

  async deleteTenant(id: string): Promise<{ message: string }> {
    return apiClient.delete(`${ADMIN_BASE}/tenants/${id}`)
  },

  // Users
  async getUsers(filters?: AdminFilters): Promise<{ data: PlatformUser[]; total: number }> {
    return apiClient.get(`${ADMIN_BASE}/users`, { params: filters })
  },

  async getUserById(id: string): Promise<PlatformUser> {
    return apiClient.get<PlatformUser>(`${ADMIN_BASE}/users/${id}`)
  },

  async updateUserStatus(id: string, status: 'active' | 'inactive' | 'suspended'): Promise<PlatformUser> {
    return apiClient.patch(`${ADMIN_BASE}/users/${id}/status`, { status })
  },

  // Subscriptions
  async getSubscriptions(filters?: AdminFilters): Promise<{ data: PlatformSubscription[]; total: number }> {
    return apiClient.get(`${ADMIN_BASE}/subscriptions`, { params: filters })
  },

  async getSubscriptionById(id: string): Promise<PlatformSubscription> {
    return apiClient.get<PlatformSubscription>(`${ADMIN_BASE}/subscriptions/${id}`)
  },

  async updateSubscription(id: string, data: Partial<PlatformSubscription>): Promise<PlatformSubscription> {
    return apiClient.patch(`${ADMIN_BASE}/subscriptions/${id}`, data)
  },

  async cancelSubscription(id: string): Promise<{ message: string }> {
    return apiClient.post(`${ADMIN_BASE}/subscriptions/${id}/cancel`)
  },

  // Plans
  async getPlans(): Promise<PlatformPlan[]> {
    return apiClient.get<PlatformPlan[]>(`${ADMIN_BASE}/plans`)
  },

  async getPlanById(id: string): Promise<PlatformPlan> {
    return apiClient.get<PlatformPlan>(`${ADMIN_BASE}/plans/${id}`)
  },

  async createPlan(data: Omit<PlatformPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlatformPlan> {
    return apiClient.post(`${ADMIN_BASE}/plans`, data)
  },

  async updatePlan(id: string, data: Partial<PlatformPlan>): Promise<PlatformPlan> {
    return apiClient.patch(`${ADMIN_BASE}/plans/${id}`, data)
  },

  async deletePlan(id: string): Promise<{ message: string }> {
    return apiClient.delete(`${ADMIN_BASE}/plans/${id}`)
  },

  // Audit Logs
  async getAuditLogs(filters?: {
    page?: number
    limit?: number
    action?: AuditAction
    userId?: string
    organizationId?: string
    dateFrom?: string
    dateTo?: string
  }): Promise<{ data: AuditLog[]; total: number; page: number; limit: number }> {
    return apiClient.get(`${ADMIN_BASE}/audit-logs`, { params: filters })
  },

  async exportAuditLogs(filters?: any): Promise<Blob> {
    return apiClient.get(`${ADMIN_BASE}/audit-logs/export`, {
      params: filters,
      responseType: 'blob',
    })
  },

  // Settings
  async getSettings(): Promise<SystemSettings> {
    return apiClient.get<SystemSettings>(`${ADMIN_BASE}/settings`)
  },

  async updateSettings(data: Partial<SystemSettings>): Promise<SystemSettings> {
    return apiClient.patch(`${ADMIN_BASE}/settings`, data)
  },
}