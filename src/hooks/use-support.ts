'use client'

import { useQuery, useMutation, useQueryClient, useInfiniteQuery, keepPreviousData } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supportService } from '@/services/support.service'
import { useSupportStore } from '@/store/support-store'
import {
  CreateSupportTicketRequest,
  UpdateSupportTicketRequest,
  CreateReplyRequest,
  CreateNoteRequest,
  BulkActionRequest,
  TicketFilters,
  SavedFilter,
} from '@/types/support'

export const SUPPORT_QUERY_KEYS = {
  stats: ['support', 'stats'],
  tickets: ['support', 'tickets'],
  ticket: (id: string) => ['support', 'tickets', id],
  replies: (ticketId: string) => ['support', 'tickets', ticketId, 'replies'],
  notes: (ticketId: string) => ['support', 'tickets', ticketId, 'notes'],
  timeline: (ticketId: string) => ['support', 'tickets', ticketId, 'timeline'],
  departments: ['support', 'departments'],
  filters: ['support', 'filters'],
  comments: (ticketId: string) => ['support', 'tickets', ticketId, 'comments'],
}

export function useSupport() {
  const queryClient = useQueryClient()
  const { filters, setFilters } = useSupportStore()

  // Stats
  const {
    data: stats,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useQuery({
    queryKey: SUPPORT_QUERY_KEYS.stats,
    queryFn: () => supportService.getStats(),
    refetchInterval: 30000,
  })

  // Tickets with infinite scroll
  const useTickets = (page: number, limit: number = 20) => {
    return useQuery({
      queryKey: [...SUPPORT_QUERY_KEYS.tickets, { page, limit, filters }],
      queryFn: () => supportService.getTickets({ page, limit, filters }),
      placeholderData: keepPreviousData,
    })
  }

  // Infinite scroll tickets
  const useInfiniteTickets = (limit: number = 20) => {
    return useInfiniteQuery({
      queryKey: [...SUPPORT_QUERY_KEYS.tickets, { filters }],
      queryFn: ({ pageParam = 1 }) =>
        supportService.getTickets({ page: pageParam, limit, filters }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage.page < Math.ceil(lastPage.total / lastPage.limit)) {
          return lastPage.page + 1
        }
        return undefined
      },
      staleTime: 30000,
    })
  }

  // Single ticket
  const useTicket = (id: string) => {
    return useQuery({
      queryKey: SUPPORT_QUERY_KEYS.ticket(id),
      queryFn: () => supportService.getTicket(id),
      enabled: !!id,
    })
  }

  // Create ticket
  const createTicketMutation = useMutation({
    mutationFn: (data: CreateSupportTicketRequest) => supportService.createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEYS.tickets })
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEYS.stats })
      toast.success('Ticket created successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create ticket')
    },
  })

  // Update ticket
  const updateTicketMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSupportTicketRequest }) =>
      supportService.updateTicket(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEYS.tickets })
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEYS.ticket(id) })
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEYS.stats })
      toast.success('Ticket updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update ticket')
    },
  })

  // Delete ticket
  const deleteTicketMutation = useMutation({
    mutationFn: (id: string) => supportService.deleteTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEYS.tickets })
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEYS.stats })
      toast.success('Ticket deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete ticket')
    },
  })

  // Bulk actions
  const bulkActionMutation = useMutation({
    mutationFn: (data: BulkActionRequest) => supportService.bulkAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEYS.tickets })
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEYS.stats })
      toast.success('Bulk action completed successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to perform bulk action')
    },
  })

  // Replies
  const useReplies = (ticketId: string) => {
    return useQuery({
      queryKey: SUPPORT_QUERY_KEYS.replies(ticketId),
      queryFn: () => supportService.getReplies(ticketId),
      enabled: !!ticketId,
    })
  }

  const createReplyMutation = useMutation({
    mutationFn: ({ ticketId, data }: { ticketId: string; data: CreateReplyRequest }) =>
      supportService.createReply(ticketId, data),
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEYS.replies(ticketId) })
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEYS.ticket(ticketId) })
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEYS.timeline(ticketId) })
      toast.success('Reply sent successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send reply')
    },
  })

  // Notes
  const useNotes = (ticketId: string) => {
    return useQuery({
      queryKey: SUPPORT_QUERY_KEYS.notes(ticketId),
      queryFn: () => supportService.getNotes(ticketId),
      enabled: !!ticketId,
    })
  }

  const createNoteMutation = useMutation({
    mutationFn: ({ ticketId, data }: { ticketId: string; data: CreateNoteRequest }) =>
      supportService.createNote(ticketId, data),
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEYS.notes(ticketId) })
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEYS.timeline(ticketId) })
      toast.success('Note added successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add note')
    },
  })

  // Timeline
  const useTimeline = (ticketId: string) => {
    return useQuery({
      queryKey: SUPPORT_QUERY_KEYS.timeline(ticketId),
      queryFn: () => supportService.getTimeline(ticketId),
      enabled: !!ticketId,
    })
  }

  // Departments
  const {
    data: departments,
    isLoading: isLoadingDepartments,
    refetch: refetchDepartments,
  } = useQuery({
    queryKey: SUPPORT_QUERY_KEYS.departments,
    queryFn: () => supportService.getDepartments(),
  })

  // Saved filters
  const {
    data: savedFilters,
    isLoading: isLoadingFilters,
    refetch: refetchFilters,
  } = useQuery({
    queryKey: SUPPORT_QUERY_KEYS.filters,
    queryFn: () => supportService.getSavedFilters(),
  })

  const saveFilterMutation = useMutation({
    mutationFn: (data: Omit<SavedFilter, 'id' | 'createdBy' | 'createdAt'>) =>
      supportService.saveFilter(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPORT_QUERY_KEYS.filters })
      toast.success('Filter saved successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save filter')
    },
  })

  // Export
  const exportTicketsMutation = useMutation({
    mutationFn: ({ format, filters }: { format: 'csv' | 'excel' | 'pdf'; filters?: TicketFilters }) =>
      supportService.exportTickets(format, filters),
    onSuccess: (data, { format }) => {
      const url = window.URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = `tickets.${format}`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Export completed successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to export tickets')
    },
  })

  return {
    // State
    stats,
    isLoadingStats,
    refetchStats,
    filters,
    setFilters,

    // Tickets
    useTickets,
    useInfiniteTickets,
    useTicket,
    createTicket: createTicketMutation.mutate,
    isCreatingTicket: createTicketMutation.isPending,
    updateTicket: updateTicketMutation.mutate,
    isUpdatingTicket: updateTicketMutation.isPending,
    deleteTicket: deleteTicketMutation.mutate,
    isDeletingTicket: deleteTicketMutation.isPending,
    bulkAction: bulkActionMutation.mutate,
    isBulkAction: bulkActionMutation.isPending,

    // Replies
    useReplies,
    createReply: createReplyMutation.mutate,
    isCreatingReply: createReplyMutation.isPending,

    // Notes
    useNotes,
    createNote: createNoteMutation.mutate,
    isCreatingNote: createNoteMutation.isPending,

    // Timeline
    useTimeline,

    // Departments
    departments,
    isLoadingDepartments,
    refetchDepartments,

    // Filters
    savedFilters,
    isLoadingFilters,
    refetchFilters,
    saveFilter: saveFilterMutation.mutate,
    isSavingFilter: saveFilterMutation.isPending,

    // Export
    exportTickets: exportTicketsMutation.mutate,
    isExporting: exportTicketsMutation.isPending,
  }
}