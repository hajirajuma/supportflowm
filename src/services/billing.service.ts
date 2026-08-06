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
} from '@/types/billing'

const BILLING_BASE = '/billing'

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

  // Admin
  async getBillingStats(): Promise<BillingStats> {
    return apiClient.get<BillingStats>(`${BILLING_BASE}/admin/stats`)
  },

  async getAdminSubscriptions(params?: {
    page?: number
    limit?: number
    status?: SubscriptionStatus
  }): Promise<{ data: Subscription[]; total: number; page: number; limit: number }> {
    return apiClient.get(`${BILLING_BASE}/admin/subscriptions`, { params })
  },

  async suspendSubscription(id: string): Promise<{ message: string }> {
    return apiClient.post(`${BILLING_BASE}/admin/subscriptions/${id}/suspend`)
  },

  async unsuspendSubscription(id: string): Promise<{ message: string }> {
    return apiClient.post(`${BILLING_BASE}/admin/subscriptions/${id}/unsuspend`)
  },
}