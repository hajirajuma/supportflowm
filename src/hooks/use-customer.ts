'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { customerService } from '@/services/customer.service'
import { useCustomerStore } from '@/store/customer-store'
import { CreateTicketRequest, CreateReplyRequest, UpdateTicketRequest, CustomerProfile } from '@/types/customer'

export const CUSTOMER_QUERY_KEYS = {
  profile: ['customer', 'profile'],
  stats: ['customer', 'stats'],
  tickets: ['customer', 'tickets'],
  ticket: (id: string) => ['customer', 'tickets', id],
  replies: (ticketId: string) => ['customer', 'tickets', ticketId, 'replies'],
  notifications: ['customer', 'notifications'],
  feedback: ['customer', 'feedback'],
  feedbackPending: ['customer', 'feedback', 'pending'],
  articles: ['customer', 'knowledge-base'],
  article: (id: string) => ['customer', 'knowledge-base', id],
  categories: ['customer', 'knowledge-base', 'categories'],
  popular: ['customer', 'knowledge-base', 'popular'],
  featured: ['customer', 'knowledge-base', 'featured'],
}

export function useCustomer() {
  const queryClient = useQueryClient()
  const { setProfile, updateProfile } = useCustomerStore()

  // Profile
  const {
    data: profile,
    isLoading: isLoadingProfile,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: CUSTOMER_QUERY_KEYS.profile,
    queryFn: () => customerService.getProfile().then((data) => {
      setProfile(data)
      return data
    }),
  })

  // Stats
  const {
    data: stats,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useQuery({
    queryKey: CUSTOMER_QUERY_KEYS.stats,
    queryFn: () => customerService.getStats(),
    refetchInterval: 30000,
  })

  // Update profile
  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<CustomerProfile>) => customerService.updateProfile(data),
    onSuccess: (data) => {
      updateProfile(data)
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.profile })
      toast.success('Profile updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile')
    },
  })

  // Upload profile picture
  const uploadProfilePictureMutation = useMutation({
    mutationFn: (file: File) => customerService.uploadProfilePicture(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.profile })
      toast.success('Profile picture updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload profile picture')
    },
  })

  // Change password
  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      customerService.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to change password')
    },
  })

  // Tickets
  const useTickets = (params?: any) => {
    return useQuery({
      queryKey: [...CUSTOMER_QUERY_KEYS.tickets, params],
      queryFn: () => customerService.getTickets(params),
    })
  }

  const useTicket = (id: string) => {
    return useQuery({
      queryKey: CUSTOMER_QUERY_KEYS.ticket(id),
      queryFn: () => customerService.getTicket(id),
      enabled: !!id,
    })
  }

  const createTicketMutation = useMutation({
    mutationFn: (data: CreateTicketRequest) => customerService.createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.tickets })
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.stats })
      toast.success('Ticket created successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create ticket')
    },
  })

  const updateTicketMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTicketRequest }) =>
      customerService.updateTicket(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.tickets })
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.ticket(id) })
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.stats })
      toast.success('Ticket updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update ticket')
    },
  })

  // Replies
  const useReplies = (ticketId: string) => {
    return useQuery({
      queryKey: CUSTOMER_QUERY_KEYS.replies(ticketId),
      queryFn: () => customerService.getReplies(ticketId),
      enabled: !!ticketId,
    })
  }

  const createReplyMutation = useMutation({
    mutationFn: ({ ticketId, data }: { ticketId: string; data: CreateReplyRequest }) =>
      customerService.createReply(ticketId, data),
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.replies(ticketId) })
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.ticket(ticketId) })
      toast.success('Reply sent successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send reply')
    },
  })

  // Notifications
  const useNotifications = (params?: any) => {
    return useQuery({
      queryKey: [...CUSTOMER_QUERY_KEYS.notifications, params],
      queryFn: () => customerService.getNotifications(params),
      refetchInterval: 30000,
    })
  }

  const markNotificationReadMutation = useMutation({
    mutationFn: (id: string) => customerService.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.notifications })
    },
  })

  const markAllNotificationsReadMutation = useMutation({
    mutationFn: () => customerService.markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.notifications })
      toast.success('All notifications marked as read')
    },
  })

  // Feedback
  const useFeedback = (params?: any) => {
    return useQuery({
      queryKey: [...CUSTOMER_QUERY_KEYS.feedback, params],
      queryFn: () => customerService.getFeedback(params),
    })
  }

  const usePendingFeedback = () => {
    return useQuery({
      queryKey: CUSTOMER_QUERY_KEYS.feedbackPending,
      queryFn: () => customerService.getPendingFeedback(),
    })
  }

  const submitFeedbackMutation = useMutation({
    mutationFn: ({ ticketId, data }: { ticketId: string; data: { rating: number; comment?: string } }) =>
      customerService.submitFeedback(ticketId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.feedback })
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.feedbackPending })
      queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.tickets })
      toast.success('Feedback submitted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit feedback')
    },
  })

  // Knowledge Base
  const useArticles = (params?: any) => {
    return useQuery({
      queryKey: [...CUSTOMER_QUERY_KEYS.articles, params],
      queryFn: () => customerService.getArticles(params),
    })
  }

  const useArticle = (id: string) => {
    return useQuery({
      queryKey: CUSTOMER_QUERY_KEYS.article(id),
      queryFn: () => customerService.getArticle(id),
      enabled: !!id,
    })
  }

  const useCategories = () => {
    return useQuery({
      queryKey: CUSTOMER_QUERY_KEYS.categories,
      queryFn: () => customerService.getCategories(),
    })
  }

  const usePopularArticles = (limit?: number) => {
    return useQuery({
      queryKey: [...CUSTOMER_QUERY_KEYS.popular, limit],
      queryFn: () => customerService.getPopularArticles(limit),
    })
  }

  const useFeaturedArticles = () => {
    return useQuery({
      queryKey: CUSTOMER_QUERY_KEYS.featured,
      queryFn: () => customerService.getFeaturedArticles(),
    })
  }

  return {
    // Profile
    profile,
    isLoadingProfile,
    refetchProfile,
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    uploadProfilePicture: uploadProfilePictureMutation.mutate,
    isUploadingProfilePicture: uploadProfilePictureMutation.isPending,
    changePassword: changePasswordMutation.mutate,
    isChangingPassword: changePasswordMutation.isPending,

    // Stats
    stats,
    isLoadingStats,
    refetchStats,

    // Tickets
    useTickets,
    useTicket,
    createTicket: createTicketMutation.mutateAsync,
    isCreatingTicket: createTicketMutation.isPending,
    updateTicket: updateTicketMutation.mutate,
    isUpdatingTicket: updateTicketMutation.isPending,

    // Replies
    useReplies,
    createReply: createReplyMutation.mutate,
    isCreatingReply: createReplyMutation.isPending,

    // Notifications
    useNotifications,
    markNotificationRead: markNotificationReadMutation.mutate,
    markAllNotificationsRead: markAllNotificationsReadMutation.mutate,

    // Feedback
    useFeedback,
    usePendingFeedback,
    submitFeedback: submitFeedbackMutation.mutate,
    isSubmittingFeedback: submitFeedbackMutation.isPending,

    // Knowledge Base
    useArticles,
    useArticle,
    useCategories,
    usePopularArticles,
    useFeaturedArticles,
  }
}