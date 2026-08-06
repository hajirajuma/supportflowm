export type BillingPlan = 'free' | 'starter' | 'professional' | 'enterprise'
export type BillingInterval = 'monthly' | 'yearly'
export type SubscriptionStatus = 
  | 'active' 
  | 'trialing' 
  | 'past_due' 
  | 'canceled' 
  | 'incomplete' 
  | 'incomplete_expired'
export type PaymentMethod = 'card' | 'paypal' | 'mobile_money'
export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'uncollectible' | 'void'
export type PaymentStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded'

export interface Plan {
  id: string
  name: string
  slug: BillingPlan
  description: string
  features: string[]
  priceMonthly: number
  priceYearly: number
  currency: string
  trialDays: number
  isPopular: boolean
  isActive: boolean
  limits: {
    tickets: number
    agents: number
    customers: number
    departments: number
    storage: number // in GB
    apiCalls: number
    feedbackResponses: number
    knowledgeArticles: number
  }
  createdAt: string
  updatedAt: string
}

export interface Subscription {
  id: string
  organizationId: string
  planId: string
  plan: Plan
  status: SubscriptionStatus
  interval: BillingInterval
  amount: number
  currency: string
  currentPeriodStart: string
  currentPeriodEnd: string
  trialStart?: string
  trialEnd?: string
  cancelAtPeriodEnd: boolean
  canceledAt?: string
  seats: number
  features: Record<string, boolean>
  paymentMethod: PaymentMethod
  paymentMethodDetails?: {
    last4?: string
    brand?: string
    expMonth?: number
    expYear?: number
  }
  createdAt: string
  updatedAt: string
}

export interface Invoice {
  id: string
  subscriptionId: string
  invoiceNumber: string
  status: InvoiceStatus
  amount: number
  currency: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  dueDate: string
  paidAt?: string
  createdAt: string
  updatedAt: string
}

export interface InvoiceItem {
  id: string
  description: string
  amount: number
  quantity: number
  total: number
}

export interface Transaction {
  id: string
  organizationId: string
  subscriptionId: string
  invoiceId?: string
  amount: number
  currency: string
  status: PaymentStatus
  paymentMethod: PaymentMethod
  paymentMethodDetails?: {
    last4?: string
    brand?: string
  }
  reference: string
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface UsageLimit {
  current: {
    tickets: number
    agents: number
    customers: number
    departments: number
    storage: number // in GB
    apiCalls: number
    feedbackResponses: number
  }
  limit: {
    tickets: number
    agents: number
    customers: number
    departments: number
    storage: number // in GB
    apiCalls: number
    feedbackResponses: number
  }
  percentage: {
    tickets: number
    agents: number
    customers: number
    departments: number
    storage: number
    apiCalls: number
    feedbackResponses: number
  }
}

export interface PaymentIntent {
  id: string
  clientSecret: string
  amount: number
  currency: string
  status: PaymentStatus
  subscriptionId?: string
  organizationId: string
  metadata?: Record<string, any>
  createdAt: string
}

export interface BillingStats {
  totalRevenue: number
  activeSubscriptions: number
  failedPayments: number
  mrr: number // Monthly Recurring Revenue
  arr: number // Annual Recurring Revenue
  churnRate: number
  averageRevenuePerUser: number
  revenueByPlan: {
    plan: BillingPlan
    revenue: number
    count: number
  }[]
}

export interface CheckoutSession {
  id: string
  planId: string
  interval: BillingInterval
  organizationId: string
  successUrl: string
  cancelUrl: string
  status: 'open' | 'complete' | 'expired'
  paymentIntent?: PaymentIntent
  createdAt: string
}

export interface BillingAddress {
  line1: string
  line2?: string
  city: string
  state: string
  country: string
  postalCode: string
}

export interface PaymentMethodInput {
  type: PaymentMethod
  cardNumber?: string
  cardExpMonth?: number
  cardExpYear?: number
  cardCvc?: string
  email?: string
  phone?: string
}