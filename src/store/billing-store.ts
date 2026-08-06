import { create } from 'zustand'
import { Subscription, Plan, UsageLimit } from '@/types/billing'

interface BillingState {
  subscription: Subscription | null
  plans: Plan[]
  usage: UsageLimit | null
  isLoading: boolean
  setSubscription: (subscription: Subscription) => void
  setPlans: (plans: Plan[]) => void
  setUsage: (usage: UsageLimit) => void
  updateSubscription: (data: Partial<Subscription>) => void
  clearBilling: () => void
}

export const useBillingStore = create<BillingState>((set) => ({
  subscription: null,
  plans: [],
  usage: null,
  isLoading: false,

  setSubscription: (subscription) => {
    set({ subscription })
  },

  setPlans: (plans) => {
    set({ plans })
  },

  setUsage: (usage) => {
    set({ usage })
  },

  updateSubscription: (data) => {
    set((state) => ({
      subscription: state.subscription ? { ...state.subscription, ...data } : null,
    }))
  },

  clearBilling: () => {
    set({ subscription: null, plans: [], usage: null })
  },
}))