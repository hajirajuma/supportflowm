import { apiClient } from './api-client'
import {
  Plan,
  Subscription,
  Invoice,
  Transaction,
  UsageLimit,
  BillingStats,
  CheckoutSession,
  PaymentIntent,
  BillingAddress,
  PaymentMethodInput,
  BillingInterval,
  InvoiceStatus,
  PaymentStatus,
  SubscriptionStatus,
  BillingPlan,
  PaymentMethod,
} from '@/types/billing'

const BILLING_BASE = '/billing'
// The platform-admin surface owns billing administration; there is no
// /billing/admin controller on the backend.
const ADMIN_BILLING_BASE = '/platform-admin'

const GB_IN_BYTES = 1024 * 1024 * 1024

function mapBillingPlan(p: any): Plan {
  return {
    id: p.id,
    name: p.name,
    slug: (p.code ?? p.name ?? '').toLowerCase() as BillingPlan,
    description: p.description ?? '',
    features: Array.isArray(p.features)
      ? Object.entries(p.features)
          .filter(([, v]) => v === true)
          .map(([k]) => k)
      : [],
    priceMonthly: Number(p.priceMonthly ?? 0),
    priceYearly: Number(p.priceYearly ?? 0),
    currency: p.currency ?? 'USD',
    trialDays: p.trialDays ?? 0,
    isPopular: false,
    isActive: p.isActive ?? true,
    limits: {
      tickets: p.maxTicketsPerMonth ?? 0,
      agents: p.maxAgents ?? 0,
      customers: p.maxCustomers ?? 0,
      departments: 0,
      storage: Number(p.storageLimitBytes ?? 0) / GB_IN_BYTES,
      apiCalls: p.apiMonthlyQuota ?? 0,
      feedbackResponses: p.maxFeedbackForms ?? 0,
      knowledgeArticles: p.maxKnowledgeArticles ?? 0,
    },
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }
}

function mapBillingSubscription(s: any): Subscription {
  const plan = mapBillingPlan(s.plan ?? {})
  const interval = (s.billingInterval ?? 'monthly').toLowerCase() as BillingInterval
  const amount =
    interval === 'yearly' ? plan.priceYearly : plan.priceMonthly
  return {
    id: s.id,
    organizationId: s.organizationId ?? '',
    organizationName: s.organization?.name,
    planId: s.planId ?? '',
    plan,
    status: (s.status ?? '').toLowerCase() as SubscriptionStatus,
    interval,
    amount,
    currency: plan.currency,
    currentPeriodStart: s.currentPeriodStart ?? '',
    currentPeriodEnd: s.currentPeriodEnd ?? '',
    trialStart: s.trialStartedAt ?? undefined,
    trialEnd: s.trialEndsAt ?? undefined,
    cancelAtPeriodEnd: s.cancelAtPeriodEnd ?? false,
    canceledAt: s.canceledAt ?? undefined,
    seats: s.seats ?? 0,
    features: (s.plan?.features ?? {}) as Record<string, boolean>,
    paymentMethod: 'card' as PaymentMethod,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  }
}

export const billingService = {
  // Plans
  async getPlans(): Promise<Plan[]> {
    return apiClient.get<Plan[]>(`${BILLING_BASE}/plans`)
  },

  async getPlan(id: string): Promise<Plan> {
    return apiClient.get<Plan>(`${BILLING_BASE}/plans/${id}`)
  },

  // Subscription
  async getSubscription(): Promise<Subscription> {
    return apiClient.get<Subscription>(`${BILLING_BASE}/subscription`)
  },

  async createSubscription(data: {
    planId: string
    interval: BillingInterval
    paymentMethod: PaymentMethodInput
    billingAddress: BillingAddress
  }): Promise<Subscription> {
    return apiClient.post(`${BILLING_BASE}/subscription`, data)
  },

  async updateSubscription(data: {
    planId?: string
    interval?: BillingInterval
    seats?: number
  }): Promise<Subscription> {
    return apiClient.patch(`${BILLING_BASE}/subscription`, data)
  },

  async cancelSubscription(data?: { reason?: string; feedback?: string }): Promise<Subscription> {
    return apiClient.post(`${BILLING_BASE}/subscription/cancel`, data)
  },

  async reactivateSubscription(): Promise<Subscription> {
    return apiClient.post(`${BILLING_BASE}/subscription/reactivate`)
  },

  // Invoices
  async getInvoices(params?: {
    page?: number
    limit?: number
    status?: InvoiceStatus
  }): Promise<{ data: Invoice[]; total: number; page: number; limit: number }> {
    return apiClient.get(`${BILLING_BASE}/invoices`, { params })
  },

  async getInvoice(id: string): Promise<Invoice> {
    return apiClient.get<Invoice>(`${BILLING_BASE}/invoices/${id}`)
  },

  async downloadInvoice(id: string): Promise<Blob> {
    return apiClient.get(`${BILLING_BASE}/invoices/${id}/download`, {
      responseType: 'blob',
    })
  },

  // Transactions
  async getTransactions(params?: {
    page?: number
    limit?: number
    status?: PaymentStatus
  }): Promise<{ data: Transaction[]; total: number; page: number; limit: number }> {
    return apiClient.get(`${BILLING_BASE}/transactions`, { params })
  },

  async getTransaction(id: string): Promise<Transaction> {
    return apiClient.get<Transaction>(`${BILLING_BASE}/transactions/${id}`)
  },

  // Usage
  async getUsage(): Promise<UsageLimit> {
    return apiClient.get<UsageLimit>(`${BILLING_BASE}/usage`)
  },

  // Checkout
  async createCheckoutSession(data: {
    planId: string
    interval: BillingInterval
    successUrl: string
    cancelUrl: string
  }): Promise<CheckoutSession> {
    return apiClient.post(`${BILLING_BASE}/checkout`, data)
  },

  async getCheckoutSession(id: string): Promise<CheckoutSession> {
    return apiClient.get<CheckoutSession>(`${BILLING_BASE}/checkout/${id}`)
  },

  // Payments
  async createPaymentIntent(data: {
    planId: string
    interval: BillingInterval
  }): Promise<PaymentIntent> {
    return apiClient.post(`${BILLING_BASE}/payment-intent`, data)
  },

  async confirmPayment(paymentIntentId: string): Promise<{ status: PaymentStatus }> {
    return apiClient.post(`${BILLING_BASE}/payment-intent/${paymentIntentId}/confirm`)
  },

  // Admin (backed by the /platform-admin surface)
  async getBillingStats(): Promise<BillingStats> {
    const [paymentStats, subsRes, paymentsRes] = await Promise.all([
      apiClient.get<any>(`${ADMIN_BILLING_BASE}/payments/stats`),
      apiClient.get<any>(`${ADMIN_BILLING_BASE}/subscriptions`, {
        params: { page: 1, limit: 100 },
      }),
      apiClient.get<any>(`${ADMIN_BILLING_BASE}/payments`, {
        params: { page: 1, limit: 100 },
      }),
    ])

    const subscriptions: Subscription[] = (
      subsRes?.data ?? subsRes?.items ?? []
    ).map(mapBillingSubscription)
    const payments: any[] = paymentsRes?.data ?? paymentsRes?.items ?? []

    const active = subscriptions.filter((s) => s.status === 'active')
    const activeCount = active.length
    const mrr = active.reduce(
      (sum, s) => sum + (Number(s.amount) || 0),
      0
    )
    const totalRevenue = Number(paymentStats?.revenue ?? 0)

    // Successful payments grouped by plan -> Revenue by Plan section.
    const byPlan = new Map<
      string,
      { plan: BillingPlan; revenue: number; count: number }
    >()
    for (const payment of payments) {
      if ((payment.status ?? '').toUpperCase() !== 'SUCCESSFUL') continue
      const name = payment.plan?.name ?? payment.plan?.code ?? 'Unknown'
      const key = name.toLowerCase()
      const entry = byPlan.get(key) ?? {
        plan: key as BillingPlan,
        revenue: 0,
        count: 0,
      }
      entry.revenue += Number(payment.amount ?? 0)
      entry.count += 1
      byPlan.set(key, entry)
    }
    const revenueByPlan = Array.from(byPlan.values())

    const canceledCount = subscriptions.filter(
      (s) => s.status === 'canceled'
    ).length
    const churnRate =
      activeCount + canceledCount > 0
        ? (canceledCount / (activeCount + canceledCount)) * 100
        : 0

    return {
      totalRevenue,
      activeSubscriptions: activeCount,
      failedPayments: Number(paymentStats?.failed ?? 0),
      mrr,
      arr: mrr * 12,
      churnRate,
      averageRevenuePerUser: activeCount > 0 ? totalRevenue / activeCount : 0,
      revenueByPlan,
    }
  },

  async getAdminSubscriptions(params?: {
    page?: number
    limit?: number
    status?: SubscriptionStatus
  }): Promise<{ data: Subscription[]; total: number; page: number; limit: number }> {
    const raw = await apiClient.get<any>(`${ADMIN_BILLING_BASE}/subscriptions`, {
      params,
    })
    const items = raw?.data ?? raw?.items ?? []
    return {
      data: items.map(mapBillingSubscription),
      total: raw?.total ?? items.length ?? 0,
      page: raw?.page ?? params?.page ?? 1,
      limit: raw?.limit ?? params?.limit ?? 10,
    }
  },

  async suspendSubscription(id: string): Promise<{ message: string }> {
    return apiClient.post(`${ADMIN_BILLING_BASE}/subscriptions/${id}/suspend`)
  },

  async unsuspendSubscription(id: string): Promise<{ message: string }> {
    return apiClient.post(`${ADMIN_BILLING_BASE}/subscriptions/${id}/renew`)
  },
}