import { create } from 'zustand'
import { TicketFilters, SavedFilter } from '@/types/support'

interface SupportState {
  filters: TicketFilters
  savedFilters: SavedFilter[]
  selectedTickets: string[]
  viewMode: 'list' | 'kanban'
  activeFilterId?: string
  setFilters: (filters: TicketFilters) => void
  setViewMode: (mode: 'list' | 'kanban') => void
  toggleTicketSelection: (ticketId: string) => void
  clearSelection: () => void
  selectAll: (ticketIds: string[]) => void
  addSavedFilter: (filter: SavedFilter) => void
  removeSavedFilter: (id: string) => void
  setActiveFilter: (id?: string) => void
}

export const useSupportStore = create<SupportState>((set) => ({
  filters: {},
  savedFilters: [],
  selectedTickets: [],
  viewMode: 'list',
  activeFilterId: undefined,

  setFilters: (filters) => set({ filters, activeFilterId: undefined }),
  
  setViewMode: (mode) => set({ viewMode: mode }),
  
  toggleTicketSelection: (ticketId) =>
    set((state) => ({
      selectedTickets: state.selectedTickets.includes(ticketId)
        ? state.selectedTickets.filter((id) => id !== ticketId)
        : [...state.selectedTickets, ticketId],
    })),
  
  clearSelection: () => set({ selectedTickets: [] }),
  
  selectAll: (ticketIds) => set({ selectedTickets: ticketIds }),
  
  addSavedFilter: (filter) =>
    set((state) => ({
      savedFilters: [...state.savedFilters, filter],
    })),
  
  removeSavedFilter: (id) =>
    set((state) => ({
      savedFilters: state.savedFilters.filter((f) => f.id !== id),
    })),
  
  setActiveFilter: (id) => set({ activeFilterId: id }),
}))