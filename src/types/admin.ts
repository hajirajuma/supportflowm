export type TenantStatus = 'active' | 'suspended' | 'pending' | 'inactive'
export type PlatformUserRole = 'platform_admin' | 'tenant_owner' | 'support_agent' | 'customer'
export type AuditAction = 
  | 'login' 
  | 'logout' 
  | 'password_change' 
  | 'subscription_update' 
  | 'tenant_suspend' 
  | 'tenant_activate' 
  | 'user_invite' 
  | 'user_remove' 
  | 'permission_change' 
  | 'plan_create' 
  | 'plan_update' 
  | 'plan_delete'

export interface Tenant {
  id: string
  name: string
  slug: string
  owner: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  plan: string
  status: TenantStatus
  users: number
  tickets: number
  storageUsed: number
  storageLimit: number
  createdAt: string
  updatedAt: string
  subscription: {
    id: string
    status: string
    interval: string
    amount: number
    currency: string
    currentPeriodEnd: string
  }
}

export interface PlatformUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: PlatformUserRole
  organization: {
    id: string
    name: string
    slug: string
  } | null
  status: 'active' | 'inactive' | 'suspended'
  lastActive?: string
  createdAt: string
  updatedAt: string
}

export interface PlatformPlan {
  id: string
  name: string
  slug: string
  description: string
  priceMonthly: number
  priceYearly: number
  currency: string
  features: string[]
  limits: {
    users: number
    tickets: number
    storage: number
    apiCalls: number
    departments: number
    feedbackResponses: number
    knowledgeArticles: number
  }
  isActive: boolean
  isPopular: boolean
  trialDays: number
  createdAt: string
  updatedAt: string
}

export interface PlatformSubscription {
  id: string
  organization: {
    id: string
    name: string
    slug: string
  }
  plan: PlatformPlan
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete'
  interval: 'monthly' | 'yearly'
  amount: number
  currency: string
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  seats: number
  createdAt: string
  updatedAt: string
}

export interface AuditLog {
  id: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  organization?: {
    id: string
    name: string
  }
  action: AuditAction
  module: string
  description: string
  ipAddress: string
  userAgent: string
  metadata?: Record<string, any>
  createdAt: string
}

export interface PlatformStats {
  organizations: {
    total: number
    active: number
    suspended: number
    newThisMonth: number
  }
  users: {
    total: number
    active: number
    newRegistrations: number
  }
  revenue: {
    monthlyRecurringRevenue: number
    totalPayments: number
    failedPayments: number
  }
  usage: {
    totalTickets: number
    totalFeedback: number
    storageUsed: number
    storageLimit: number
  }
  recentActivity: AuditLog[]
  growthData: {
    date: string
    organizations: number
    users: number
    revenue: number
  }[]
}

export interface SystemSettings {
  platform: {
    name: string
    logo?: string
    supportEmail: string
    timezone: string
  }
  email: {
    provider: 'smtp' | 'sendgrid' | 'brevo'
    fromEmail: string
    fromName: string
    settings: Record<string, any>
  }
  security: {
    passwordMinLength: number
    requireUppercase: boolean
    requireLowercase: boolean
    requireNumbers: boolean
    requireSpecialChars: boolean
    sessionTimeout: number
    maxLoginAttempts: number
    lockoutDuration: number
  }
  features: {
    tickets: boolean
    feedback: boolean
    knowledgeBase: boolean
    analytics: boolean
    billing: boolean
  }
  modules: {
    support: boolean
    feedback: boolean
    knowledgeBase: boolean
    billing: boolean
    analytics: boolean
  }
  updatedAt: string
}

export interface AdminFilters {
  page?: number
  limit?: number
  search?: string
  status?: string
  plan?: string
  dateFrom?: string
  dateTo?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}