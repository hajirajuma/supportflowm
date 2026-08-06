import { apiClient } from './api-client'
import {
  Ticket,
  TicketReply,
  Notification,
  Feedback,
  KnowledgeArticle,
  CustomerStats,
  CustomerProfile,
  CreateTicketRequest,
  CreateReplyRequest,
  UpdateTicketRequest,
} from '@/types/customer'

const CUSTOMER_BASE = '/customer'

export const customerService = {
  // Profile
  async getProfile(): Promise<CustomerProfile> {
    return apiClient.get<CustomerProfile>(`${CUSTOMER_BASE}/profile`)
  },

  async updateProfile(data: Partial<CustomerProfile>): Promise<CustomerProfile> {
    return apiClient.patch<CustomerProfile>(`${CUSTOMER_BASE}/profile`, data)
  },

  async uploadProfilePicture(file: File): Promise<{ url: string }> {
    return apiClient.upload<{ url: string }>(`${CUSTOMER_BASE}/avatar`, file)
  },

  async changePassword(data: {
    currentPassword: string
    newPassword: string
  }): Promise<{ message: string }> {
    return apiClient.patch(`${CUSTOMER_BASE}/change-password`, data)
  },

  // Stats
  async getStats(): Promise<CustomerStats> {
    return apiClient.get<CustomerStats>(`${CUSTOMER_BASE}/dashboard`)
  },

  // Tickets
  async getTickets(params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    priority?: string
    category?: string
    sort?: string
    order?: 'asc' | 'desc'
  }): Promise<{ data: Ticket[]; total: number; page: number; limit: number }> {
    const query: Record<string, string | number | undefined> = {
      page: params?.page,
      limit: params?.limit,
      search: params?.search,
      status: params?.status,
      priority: params?.priority,
      categoryId: params?.category,
      sort: params?.sort,
      order: params?.order,
    }
    const clean: Record<string, string | number> = {}
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== '') {
        clean[key] = value
      }
    }
    return apiClient.get('/tickets', { params: clean })
  },

  async getTicket(id: string): Promise<Ticket> {
    return apiClient.get<Ticket>(`/tickets/${id}`)
  },

  async createTicket(data: CreateTicketRequest): Promise<Ticket> {
    return apiClient.post<Ticket>('/tickets', {
      subject: data.title,
      description: data.description,
      categoryId: data.category,
      priority: data.priority,
    })
  },

  async updateTicket(id: string, data: UpdateTicketRequest): Promise<Ticket> {
    return apiClient.patch<Ticket>(`/tickets/${id}`, {
      subject: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      categoryId: data.category,
    })
  },

  // Replies
  async getReplies(ticketId: string): Promise<TicketReply[]> {
    return apiClient.get<TicketReply[]>(`/tickets/${ticketId}/replies`)
  },

  async createReply(ticketId: string, data: CreateReplyRequest): Promise<TicketReply> {
    return apiClient.post<TicketReply>(`/tickets/${ticketId}/replies`, {
      body: data.content,
      isInternal: data.isInternal ?? false,
    })
  },

  // Notifications
  async getNotifications(params?: {
    page?: number
    limit?: number
    unreadOnly?: boolean
  }): Promise<{ data: Notification[]; total: number; unread: number }> {
    return apiClient.get(`${CUSTOMER_BASE}/notifications`, { params })
  },

  async markNotificationRead(id: string): Promise<{ message: string }> {
    return apiClient.patch(`${CUSTOMER_BASE}/notifications/${id}/read`)
  },

  async markAllNotificationsRead(): Promise<{ message: string }> {
    return apiClient.patch(`${CUSTOMER_BASE}/notifications/read-all`)
  },

  // Feedback
  async getFeedback(params?: {
    page?: number
    limit?: number
  }): Promise<{ data: Feedback[]; total: number }> {
    return apiClient.get('/feedback/search', { params })
  },

  async submitFeedback(
    ticketId: string,
    data: { rating: number; comment?: string }
  ): Promise<Feedback> {
    const formData = new FormData()
    formData.append('ticketId', ticketId)
    formData.append(
      'answers',
      JSON.stringify([{ questionId: 'rating', value: data.rating }])
    )
    if (data.comment) {
      formData.append('publicComment', data.comment)
    }
    return apiClient.post<Feedback>('/feedback/submit', formData)
  },

  async getPendingFeedback(): Promise<{ tickets: Ticket[]; count: number }> {
    return apiClient.get('/feedback/pending')
  },

  // Knowledge Base
  async getArticles(params?: {
    category?: string
    search?: string
    featured?: boolean
    page?: number
    limit?: number
  }): Promise<{ data: KnowledgeArticle[]; total: number }> {
    return apiClient.get(`${CUSTOMER_BASE}/knowledge-base/articles`, { params })
  },

  async getArticle(id: string): Promise<KnowledgeArticle> {
    return apiClient.get<KnowledgeArticle>(`${CUSTOMER_BASE}/knowledge-base/articles/${id}`)
  },

  async getCategories(): Promise<string[]> {
    return apiClient.get<string[]>(`${CUSTOMER_BASE}/knowledge-base/categories`)
  },

  async getPopularArticles(limit?: number): Promise<KnowledgeArticle[]> {
    const res = await apiClient.get<{ data: KnowledgeArticle[] }>(
      `${CUSTOMER_BASE}/knowledge-base/articles`,
      { params: { limit } }
    )
    return res.data as KnowledgeArticle[]
  },

  async getFeaturedArticles(): Promise<KnowledgeArticle[]> {
    const res = await apiClient.get<{ data: KnowledgeArticle[] }>(
      `${CUSTOMER_BASE}/knowledge-base/articles`,
      { params: { featured: true } }
    )
    return res.data as KnowledgeArticle[]
  },
}
