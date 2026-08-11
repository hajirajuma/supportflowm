import { apiClient } from './api-client'
import {
  Tenant,
  TenantStatus,
  PlatformUser,
  PlatformSubscription,
  PlatformPlan,
  AuditLog,
  AuditAction,
  PlatformStats,
  SystemSettings,
  AdminFilters,
} from '@/types/admin'

// The platform-admin surface lives under /platform-admin on the backend
// (there is no /admin controller). All methods below map onto those routes
// and normalize the backend's { items, total, page, limit } pagination
// envelope into the { data, total } shape the admin pages consume.
const ADMIN_BASE = '/platform-admin'

function normalizeStatus(status: string): TenantStatus {
  const lower = (status ?? '').toLowerCase()
  if (lower === 'active' || lower === 'suspended' || lower === 'pending' || lower === 'inactive') {
    return lower as TenantStatus
  }
  return 'active'
}

// Backend organization row -> Tenant shape for the admin table.
function mapTenant(raw: any): Tenant {
  const subscription = Array.isArray(raw.subscriptions) ? raw.subscriptions[0] : undefined
  const owner = Array.isArray(raw.users) ? raw.users[0] : undefined
  const counts = raw._count ?? {}
  const plan = subscription?.plan

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    subdomain: raw.subdomain,
    owner: owner
      ? {
          id: owner.id,
          firstName: owner.firstName ?? '',
          lastName: owner.lastName ?? '',
          email: owner.email ?? '',
        }
      : { id: '', firstName: '—', lastName: '', email: '' },
    plan: plan?.name ?? plan?.code ?? 'Free',
    status: normalizeStatus(raw.status),
    users: counts.users ?? 0,
    tickets: counts.tickets ?? 0,
    storageUsed: 0,
    storageLimit: 0,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    subscription: subscription
      ? {
          id: subscription.id,
          status: (subscription.status ?? '').toLowerCase(),
          interval: (subscription.billingInterval ?? subscription.interval ?? '').toLowerCase(),
          amount: subscription.amount ?? 0,
          currency: subscription.currency ?? 'USD',
          currentPeriodEnd: subscription.currentPeriodEnd ?? '',
        }
      : {
          id: '',
          status: '',
          interval: '',
          amount: 0,
          currency: 'USD',
          currentPeriodEnd: '',
        },
  }
}

export const adminService = {
  // Dashboard (consumed by useAdmin; the admin dashboard page uses /dashboard)
  async getPlatformStats(): Promise<PlatformStats> {
    const raw = await apiClient.get<any>(`${ADMIN_BASE}/overview`)
    const counts = raw?.counts ?? {}
    const stats: PlatformStats = {
      organizations: {
        total: counts.organizations ?? 0,
        active: counts.organizations ?? 0,
        suspended: 0,
        newThisMonth: 0,
      },
      users: {
        total: counts.users ?? 0,
        active: counts.users ?? 0,
        newRegistrations: 0,
      },
      revenue: {
        monthlyRecurringRevenue: 0,
        totalPayments: 0,
        failedPayments: 0,
      },
      usage: {
        totalTickets: counts.tickets ?? 0,
        totalFeedback: 0,
        storageUsed: 0,
        storageLimit: 0,
      },
      recentActivity: [],
      growthData: [],
    }
    return stats
  },

  // Tenants
  async getTenants(filters?: AdminFilters): Promise<{ data: Tenant[]; total: number }> {
    const raw = await apiClient.get<any>(`${ADMIN_BASE}/organizations`, { params: filters })
    return {
      data: (raw?.items ?? []).map(mapTenant),
      total: raw?.total ?? 0,
    }
  },

  async getTenantById(id: string): Promise<Tenant> {
    const raw = await apiClient.get<any>(`${ADMIN_BASE}/organizations/${id}`)
    return mapTenant(raw)
  },

  async updateTenantStatus(id: string, status: Tenant['status']): Promise<Tenant> {
    const action = status === 'suspended' ? 'suspend' : 'activate'
    const raw = await apiClient.post<any>(`${ADMIN_BASE}/organizations/${id}/${action}`)
    return mapTenant(raw)
  },

  async deleteTenant(id: string): Promise<{ message: string }> {
    return apiClient.post(`${ADMIN_BASE}/organizations/${id}/archive`)
  },

  // Users
  async getUsers(filters?: AdminFilters): Promise<{ data: PlatformUser[]; total: number }> {
    const raw = await apiClient.get<any>(`${ADMIN_BASE}/users`, { params: filters })
    return {
      data: (raw?.items ?? []).map((u: any) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        role: (u.role ?? '').toLowerCase(),
        organization: u.organization
          ? { id: u.organization.id, name: u.organization.name, slug: u.organization.slug }
          : null,
        status: (u.status ?? '').toLowerCase(),
        lastActive: u.lastLoginAt ?? undefined,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      })),
      total: raw?.total ?? 0,
    }
  },

  async getUserById(id: string): Promise<PlatformUser> {
    const raw = await apiClient.get<any>(`${ADMIN_BASE}/users/${id}`)
    return {
      id: raw.id,
      firstName: raw.firstName,
      lastName: raw.lastName,
      email: raw.email,
      role: (raw.role ?? '').toLowerCase(),
      organization: raw.organization
        ? { id: raw.organization.id, name: raw.organization.name, slug: raw.organization.slug }
        : null,
      status: (raw.status ?? '').toLowerCase(),
      lastActive: raw.lastLoginAt ?? undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  },

  async updateUserStatus(id: string, status: 'active' | 'inactive' | 'suspended'): Promise<PlatformUser> {
    const action = status === 'suspended' ? 'suspend' : 'activate'
    const raw = await apiClient.post<any>(`${ADMIN_BASE}/users/${id}/${action}`)
    return this.getUserById(id)
  },

  // Subscriptions
  async getSubscriptions(filters?: AdminFilters): Promise<{ data: PlatformSubscription[]; total: number }> {
    const raw = await apiClient.get<any>(`${ADMIN_BASE}/subscriptions`, { params: filters })
    return {
      data: (raw?.items ?? []).map((s: any) => ({
        id: s.id,
        organization: {
          id: s.organization?.id,
          name: s.organization?.name,
          slug: s.organization?.slug,
        },
        plan: s.plan,
        status: (s.status ?? '').toLowerCase(),
        interval: (s.billingInterval ?? '').toLowerCase(),
        amount: s.amount ?? 0,
        currency: s.currency ?? 'USD',
        currentPeriodStart: s.currentPeriodStart ?? '',
        currentPeriodEnd: s.currentPeriodEnd ?? '',
        cancelAtPeriodEnd: s.cancelAtPeriodEnd ?? false,
        seats: s.seats ?? 0,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      })),
      total: raw?.total ?? 0,
    }
  },

  async getSubscriptionById(id: string): Promise<PlatformSubscription> {
    const raw = await apiClient.get<any>(`${ADMIN_BASE}/subscriptions/${id}`)
    return {
      id: raw.id,
      organization: {
        id: raw.organization?.id,
        name: raw.organization?.name,
        slug: raw.organization?.slug,
      },
      plan: raw.plan,
      status: (raw.status ?? '').toLowerCase(),
      interval: (raw.billingInterval ?? '').toLowerCase(),
      amount: raw.amount ?? 0,
      currency: raw.currency ?? 'USD',
      currentPeriodStart: raw.currentPeriodStart ?? '',
      currentPeriodEnd: raw.currentPeriodEnd ?? '',
      cancelAtPeriodEnd: raw.cancelAtPeriodEnd ?? false,
      seats: raw.seats ?? 0,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  },

  async updateSubscription(id: string, data: Partial<PlatformSubscription>): Promise<PlatformSubscription> {
    return apiClient.patch(`${ADMIN_BASE}/subscriptions/${id}`, data)
  },

  async cancelSubscription(id: string): Promise<{ message: string }> {
    return apiClient.post(`${ADMIN_BASE}/subscriptions/${id}/suspend`)
  },

  // Plans
  async getPlans(): Promise<PlatformPlan[]> {
    const raw = await apiClient.get<any[]>(`${ADMIN_BASE}/subscriptions/plans`)
    return (raw ?? []).map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.code?.toLowerCase() ?? '',
      description: p.description ?? '',
      priceMonthly: p.priceMonthly ?? 0,
      priceYearly: p.priceYearly ?? 0,
      currency: p.currency ?? 'USD',
      features: Array.isArray(p.features)
        ? Object.entries(p.features)
            .filter(([, v]) => v === true)
            .map(([k]) => k)
        : [],
      limits: {
        users: p.maxUsers ?? 0,
        tickets: p.maxTicketsPerMonth ?? 0,
        storage: Number(p.storageLimitBytes ?? 0),
        apiCalls: p.apiMonthlyQuota ?? 0,
        departments: 0,
        feedbackResponses: p.maxFeedbackForms ?? 0,
        knowledgeArticles: p.maxKnowledgeArticles ?? 0,
      },
      isActive: p.isActive ?? true,
      isPopular: false,
      trialDays: p.trialDays ?? 0,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }))
  },

  async getPlanById(id: string): Promise<PlatformPlan> {
    const raw = await apiClient.get<any>(`${ADMIN_BASE}/subscriptions/plans/${id}`)
    return (await this.getPlans()).find((p) => p.id === id) ?? (raw as unknown as PlatformPlan)
  },

  async createPlan(data: Omit<PlatformPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlatformPlan> {
    const payload = {
      name: data.name,
      code: (data.slug ?? data.name).toUpperCase(),
      description: data.description,
      priceMonthly: data.priceMonthly,
      priceYearly: data.priceYearly,
      currency: data.currency,
      maxUsers: data.limits?.users,
      maxTicketsPerMonth: data.limits?.tickets,
      maxKnowledgeArticles: data.limits?.knowledgeArticles,
      maxFeedbackForms: data.limits?.feedbackResponses,
      storageLimitBytes: data.limits?.storage,
      apiMonthlyQuota: data.limits?.apiCalls,
      trialDays: data.trialDays,
      isActive: data.isActive,
    }
    return apiClient.post(`${ADMIN_BASE}/subscriptions/plans`, payload)
  },

  async updatePlan(id: string, data: Partial<PlatformPlan>): Promise<PlatformPlan> {
    return apiClient.patch(`${ADMIN_BASE}/subscriptions/plans/${id}`, data)
  },

  async deletePlan(id: string): Promise<{ message: string }> {
    return apiClient.delete(`${ADMIN_BASE}/subscriptions/plans/${id}`)
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
    const raw = await apiClient.get<any>(`${ADMIN_BASE}/audit-logs`, { params: filters })
    return {
      data: (raw?.items ?? []).map((l: any) => ({
        id: l.id,
        user: {
          id: l.actorId ?? '',
          firstName: l.actorName?.split(' ')[0] ?? 'Unknown',
          lastName: l.actorName?.split(' ').slice(1).join(' ') ?? '',
          email: l.actorEmail ?? '',
        },
        organization: l.organizationId ? { id: l.organizationId, name: '' } : undefined,
        action: (l.action ?? '').toLowerCase() as AuditAction,
        module: l.entityType ?? '',
        description: `${l.action ?? ''} ${l.entityType ?? ''} ${l.entityId ?? ''}`.trim(),
        ipAddress: l.ipAddress ?? '',
        userAgent: l.userAgent ?? '',
        metadata: l.metadata,
        createdAt: l.createdAt,
      })),
      total: raw?.total ?? 0,
      page: raw?.page ?? 1,
      limit: raw?.limit ?? filters?.limit ?? 10,
    }
  },

  async exportAuditLogs(filters?: any): Promise<Blob> {
    return apiClient.get(`${ADMIN_BASE}/audit-logs/export`, {
      params: filters,
      responseType: 'blob',
    })
  },

  // Settings
  async getSettings(): Promise<SystemSettings> {
    const raw = await apiClient.get<any[]>(`${ADMIN_BASE}/settings`)
    const entries = Array.isArray(raw) ? raw : []
    const get = (key: string, fallback: any) => {
      const found = entries.find((e) => e.key === key)
      return found ? found.value : fallback
    }
    const settings: SystemSettings = {
      platform: {
        name: get('app_name', 'SupportFlow'),
        supportEmail: get('support_email', ''),
        timezone: get('default_timezone', 'UTC'),
      },
      email: {
        provider: 'smtp',
        fromEmail: get('support_email', ''),
        fromName: get('app_name', 'SupportFlow'),
        settings: {},
      },
      security: {
        passwordMinLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        sessionTimeout: 60,
        maxLoginAttempts: 5,
        lockoutDuration: 15,
      },
      features: {
        tickets: true,
        feedback: true,
        knowledgeBase: true,
        analytics: true,
        billing: true,
      },
      modules: {
        support: true,
        feedback: true,
        knowledgeBase: true,
        billing: true,
        analytics: true,
      },
      updatedAt: new Date().toISOString(),
    }
    return settings
  },

  async updateSettings(data: Partial<SystemSettings>): Promise<SystemSettings> {
    const body = (data as any).settings ?? data
    return apiClient.put(`${ADMIN_BASE}/settings`, body)
  },
}
