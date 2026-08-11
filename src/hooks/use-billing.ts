'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { billingService } from '@/services/billing.service'
import { useBillingStore } from '@/store/billing-store'
import { CheckoutSession, PaymentIntent, BillingInterval } from '@/types/billing'

export const BILLING_QUERY_KEYS = {
  plans: ['billing', 'plans'],
  subscription: ['billing', 'subscription'],
  invoices: ['billing', 'invoices'],
  invoice: (id: string) => ['billing', 'invoices', id],
  transactions: ['billing', 'transactions'],
  transaction: (id: string) => ['billing', 'transactions', id],
  usage: ['billing', 'usage'],
  stats: ['billing', 'admin', 'stats'],
  adminSubscriptions: ['billing', 'admin', 'subscriptions'],
  checkout: (id: string) => ['billing', 'checkout', id],
}

export function useBilling() {
  const queryClient = useQueryClient()
  const { setSubscription, setPlans, setUsage, updateSubscription } = useBillingStore()

  // Get plans
  const {
    data: plans,
    isLoading: isLoadingPlans,
    refetch: refetchPlans,
  } = useQuery({
    queryKey: BILLING_QUERY_KEYS.plans,
    queryFn: () => billingService.getPlans().then((data) => {
      setPlans(data)
      return data
    }),
  })

  // Get subscription
  const {
    data: subscription,
    isLoading: isLoadingSubscription,
    refetch: refetchSubscription,
  } = useQuery({
    queryKey: BILLING_QUERY_KEYS.subscription,
    queryFn: () => billingService.getSubscription().then((data) => {
      setSubscription(data)
      return data
    }),
  })

  // Get usage
  const {
    data: usage,
    isLoading: isLoadingUsage,
    refetch: refetchUsage,
  } = useQuery({
    queryKey: BILLING_QUERY_KEYS.usage,
    queryFn: () => billingService.getUsage().then((data) => {
      setUsage(data)
      return data
    }),
    refetchInterval: 30000,
  })

  // Get invoices
  const useInvoices = (params?: any) => {
    return useQuery({
      queryKey: [...BILLING_QUERY_KEYS.invoices, params],
      queryFn: () => billingService.getInvoices(params),
    })
  }

  // Get invoice
  const useInvoice = (id: string) => {
    return useQuery({
      queryKey: BILLING_QUERY_KEYS.invoice(id),
      queryFn: () => billingService.getInvoice(id),
      enabled: !!id,
    })
  }

  // Get transactions
  const useTransactions = (params?: any) => {
    return useQuery({
      queryKey: [...BILLING_QUERY_KEYS.transactions, params],
      queryFn: () => billingService.getTransactions(params),
    })
  }

  // Create checkout session
  const createCheckoutMutation = useMutation({
    mutationFn: (data: { planId: string; interval: BillingInterval; successUrl: string; cancelUrl: string }) =>
      billingService.createCheckoutSession(data),
    onSuccess: (data) => {
      toast.success('Checkout session created')
      return data
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create checkout session')
    },
  })

  // Create payment intent
  const createPaymentIntentMutation = useMutation({
    mutationFn: (data: { planId: string; interval: BillingInterval }) =>
      billingService.createPaymentIntent(data),
    onSuccess: () => {
      toast.success('Payment intent created')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create payment intent')
    },
  })

  // Confirm payment
  const confirmPaymentMutation = useMutation({
    mutationFn: (paymentIntentId: string) => billingService.confirmPayment(paymentIntentId),
    onSuccess: (data) => {
      toast.success(`Payment ${data.status}`)
      queryClient.invalidateQueries({ queryKey: BILLING_QUERY_KEYS.subscription })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Payment confirmation failed')
    },
  })

  // Create subscription
  const createSubscriptionMutation = useMutation({
    mutationFn: (data: any) => billingService.createSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLING_QUERY_KEYS.subscription })
      queryClient.invalidateQueries({ queryKey: BILLING_QUERY_KEYS.usage })
      toast.success('Subscription created successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create subscription')
    },
  })

  // Update subscription
  const updateSubscriptionMutation = useMutation({
    mutationFn: (data: any) => billingService.updateSubscription(data),
    onSuccess: (data) => {
      updateSubscription(data)
      queryClient.invalidateQueries({ queryKey: BILLING_QUERY_KEYS.subscription })
      toast.success('Subscription updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update subscription')
    },
  })

  // Cancel subscription
  const cancelSubscriptionMutation = useMutation({
    mutationFn: (data?: { reason?: string; feedback?: string }) =>
      billingService.cancelSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLING_QUERY_KEYS.subscription })
      toast.success('Subscription cancelled successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cancel subscription')
    },
  })

  // Reactivate subscription
  const reactivateSubscriptionMutation = useMutation({
    mutationFn: () => billingService.reactivateSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLING_QUERY_KEYS.subscription })
      toast.success('Subscription reactivated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reactivate subscription')
    },
  })

  // Download invoice
  const downloadInvoiceMutation = useMutation({
    mutationFn: (id: string) => billingService.downloadInvoice(id),
    onSuccess: (blob, id) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${id}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Invoice downloaded successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to download invoice')
    },
  })

  // Admin: Get billing stats
  const useBillingStats = () => {
    return useQuery({
      queryKey: BILLING_QUERY_KEYS.stats,
      queryFn: () => billingService.getBillingStats(),
      enabled: false, // Only enable for admin users
    })
  }

  // Admin: Get subscriptions
  const useAdminSubscriptions = (params?: any) => {
    return useQuery({
      queryKey: [...BILLING_QUERY_KEYS.adminSubscriptions, params],
      queryFn: () => billingService.getAdminSubscriptions(params),
      enabled: false,
    })
  }

  return {
    // Plans
    plans,
    isLoadingPlans,
    refetchPlans,

    // Subscription
    subscription,
    isLoadingSubscription,
    refetchSubscription,

    // Usage
    usage,
    isLoadingUsage,
    refetchUsage,

    // Invoices
    useInvoices,
    useInvoice,

    // Transactions
    useTransactions,

    // Mutations
    createCheckout: createCheckoutMutation.mutate,
    isCreatingCheckout: createCheckoutMutation.isPending,
    createPaymentIntent: createPaymentIntentMutation.mutate,
    isCreatingPaymentIntent: createPaymentIntentMutation.isPending,
    confirmPayment: confirmPaymentMutation.mutate,
    isConfirmingPayment: confirmPaymentMutation.isPending,
    createSubscription: createSubscriptionMutation.mutate,
    isCreatingSubscription: createSubscriptionMutation.isPending,
    updateSubscription: updateSubscriptionMutation.mutate,
    isUpdatingSubscription: updateSubscriptionMutation.isPending,
    cancelSubscription: cancelSubscriptionMutation.mutate,
    isCancellingSubscription: cancelSubscriptionMutation.isPending,
    reactivateSubscription: reactivateSubscriptionMutation.mutate,
    isReactivatingSubscription: reactivateSubscriptionMutation.isPending,
    downloadInvoice: downloadInvoiceMutation.mutate,
    isDownloadingInvoice: downloadInvoiceMutation.isPending,

    // Admin
    useBillingStats,
    useAdminSubscriptions,
  }
}