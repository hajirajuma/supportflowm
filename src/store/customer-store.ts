import { create } from 'zustand'
import { CustomerProfile } from '@/types/customer'

interface CustomerState {
  profile: CustomerProfile | null
  isLoading: boolean
  setProfile: (profile: CustomerProfile) => void
  updateProfile: (data: Partial<CustomerProfile>) => void
  clearProfile: () => void
}

export const useCustomerStore = create<CustomerState>((set) => ({
  profile: null,
  isLoading: false,

  setProfile: (profile) => {
    set({ profile, isLoading: false })
  },

  updateProfile: (data) => {
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...data } : null,
    }))
  },

  clearProfile: () => {
    set({ profile: null, isLoading: false })
  },
}))