'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { feedbackService } from '@/services/feedback.service'
import { CreateFeedbackRequest, UpdateFeedbackRequest } from '@/types/feedback'

export const FEEDBACK_QUERY_KEYS = {
  all: ['feedback'],
  list: ['feedback', 'list'],
  detail: (id: string) => ['feedback', 'detail', id],
  analytics: ['feedback', 'analytics'],
  stats: ['feedback', 'stats'],
  my: ['feedback', 'my'],
  responses: (id: string) => ['feedback', 'responses', id],
}

export function useFeedback() {
  const queryClient = useQueryClient()

  // Get feedback list (admin)
  const useFeedbackList = (params?: any) => {
    return useQuery({
      queryKey: [...FEEDBACK_QUERY_KEYS.list, params],
      queryFn: () => feedbackService.getFeedback(params),
    })
  }

  // Get feedback by ID
  const useFeedbackDetail = (id: string) => {
    return useQuery({
      queryKey: FEEDBACK_QUERY_KEYS.detail(id),
      queryFn: () => feedbackService.getFeedbackById(id),
      enabled: !!id,
    })
  }

  // Get analytics (admin)
  const {
    data: analytics,
    isLoading: isLoadingAnalytics,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: FEEDBACK_QUERY_KEYS.analytics,
    queryFn: () => feedbackService.getAnalytics(),
    refetchInterval: 60000, // Refresh every minute
  })

  // Get stats (admin)
  const {
    data: stats,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useQuery({
    queryKey: FEEDBACK_QUERY_KEYS.stats,
    queryFn: () => feedbackService.getStats(),
    refetchInterval: 60000,
  })

  // Get customer's own feedback (portal)
  const useMyFeedback = (params?: any) => {
    return useQuery({
      queryKey: [...FEEDBACK_QUERY_KEYS.my, params],
      queryFn: () => feedbackService.getMyFeedback(params),
    })
  }

  // Get active public feedback form for the customer's organization
  const useActiveForms = () => {
    return useQuery({
      queryKey: ['feedback', 'active-forms'],
      queryFn: () => feedbackService.getActiveForms(),
    })
  }

  // Submit feedback (customer) — formId + ticketId + real question answers
  const submitFeedbackMutation = useMutation({
    mutationFn: (data: {
      formId: string
      ticketId: string
      answers: { questionId: string; value: string | number | string[] | null }[]
      publicComment?: string
    }) => feedbackService.submitFeedbackForm(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FEEDBACK_QUERY_KEYS.my })
      queryClient.invalidateQueries({ queryKey: FEEDBACK_QUERY_KEYS.analytics })
      queryClient.invalidateQueries({ queryKey: FEEDBACK_QUERY_KEYS.stats })
      toast.success('Feedback submitted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit feedback')
    },
  })

  // Reply to feedback (admin)
  const replyToFeedbackMutation = useMutation({
    mutationFn: ({ id, reply }: { id: string; reply: string }) =>
      feedbackService.replyToFeedback(id, reply),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: FEEDBACK_QUERY_KEYS.detail(id) })
      queryClient.invalidateQueries({ queryKey: FEEDBACK_QUERY_KEYS.list })
      toast.success('Reply sent successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send reply')
    },
  })

  // Update feedback status (admin)
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFeedbackRequest }) =>
      feedbackService.updateFeedbackStatus(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: FEEDBACK_QUERY_KEYS.detail(id) })
      queryClient.invalidateQueries({ queryKey: FEEDBACK_QUERY_KEYS.list })
      queryClient.invalidateQueries({ queryKey: FEEDBACK_QUERY_KEYS.analytics })
      toast.success('Status updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update status')
    },
  })

  // Convert to ticket (admin)
  const convertToTicketMutation = useMutation({
    mutationFn: (id: string) => feedbackService.convertToTicket(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: FEEDBACK_QUERY_KEYS.detail(id) })
      toast.success(`Ticket #${data.ticketNumber} created successfully`)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to convert to ticket')
    },
  })

  // Get responses
  const useResponses = (id: string) => {
    return useQuery({
      queryKey: FEEDBACK_QUERY_KEYS.responses(id),
      queryFn: () => feedbackService.getResponses(id),
      enabled: !!id,
    })
  }

  return {
    useFeedbackList,
    useFeedbackDetail,
    analytics,
    isLoadingAnalytics,
    refetchAnalytics,
    stats,
    isLoadingStats,
    refetchStats,
    useMyFeedback,
    useActiveForms,
    submitFeedback: submitFeedbackMutation.mutate,
    isSubmitting: submitFeedbackMutation.isPending,
    replyToFeedback: replyToFeedbackMutation.mutate,
    isReplying: replyToFeedbackMutation.isPending,
    updateStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,
    convertToTicket: convertToTicketMutation.mutate,
    isConverting: convertToTicketMutation.isPending,
    useResponses,
  }
}