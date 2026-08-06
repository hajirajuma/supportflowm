import { create } from 'zustand'
import { Organization, OrganizationSettings } from '@/types/organization'

interface OrganizationState {
  currentOrganization: Organization | null
  settings: OrganizationSettings | null
  isLoading: boolean
  setOrganization: (org: Organization) => void
  setSettings: (settings: OrganizationSettings) => void
  updateOrganization: (data: Partial<Organization>) => void
  clearOrganization: () => void
}

export const useOrganizationStore = create<OrganizationState>((set) => ({
  currentOrganization: null,
  settings: null,
  isLoading: false,

  setOrganization: (org) => {
    set({ currentOrganization: org })
  },

  setSettings: (settings) => {
    set({ settings })
  },

  updateOrganization: (data) => {
    set((state) => ({
      currentOrganization: state.currentOrganization
        ? { ...state.currentOrganization, ...data }
        : null,
    }))
  },

  clearOrganization: () => {
    set({ currentOrganization: null, settings: null })
  },
}))