import { apiClient } from './api-client'
import {
  Feedback,
  FeedbackResponse,
  FeedbackAnalytics,
  FeedbackFilters,
  CreateFeedbackRequest,
  UpdateFeedbackRequest,
  FeedbackStats,
} from '@/types/feedback'

const FEEDBACK_BASE = '/feedback'

function buildFeedbackQuery(params?: {
  page?: number
  limit?: number
  filters?: FeedbackFilters
  sort?: string
  order?: 'asc' | 'desc'
}): Record<string, string | number> {
  const p = params ?? {}
  const query: Record<string, string | number | undefined> = {
    page: p.page,
    limit: p.limit,
    sort: p.sort,
    order: p.order,
    search: p.filters?.search,
    rating: p.filters?.rating?.[0],
    category: p.filters?.category?.[0],
    sentiment: p.filters?.sentiment?.[0],
    status: p.filters?.status?.[0],
    dateFrom: p.filters?.dateFrom,
    dateTo: p.filters?.dateTo,
  }
  const result: Record<string, string | number> = {}
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') {
      result[key] = value
    }
  }
  return result
}

export const feedbackService = {
  // Get feedback with filters
  async getFeedback(params?: {
    page?: number
    limit?: number
    filters?: FeedbackFilters
    sort?: string
    order?: 'asc' | 'desc'
  }): Promise<{ data: Feedback[]; total: number; page: number; limit: number }> {
    return apiClient.get(`${FEEDBACK_BASE}/search`, {
      params: buildFeedbackQuery(params),
    })
  },

  // Get feedback by ID
  async getFeedbackById(id: string): Promise<Feedback> {
    return apiClient.get(`${FEEDBACK_BASE}/${id}`)
  },

  // Get feedback analytics
  async getAnalytics(): Promise<FeedbackAnalytics> {
    return apiClient.get(`${FEEDBACK_BASE}/analytics`)
  },

  // Get feedback stats
  async getStats(): Promise<FeedbackStats> {
    return apiClient.get(`${FEEDBACK_BASE}/dashboard`)
  },

  // Submit feedback (customer)
  async submitFeedback(data: CreateFeedbackRequest): Promise<Feedback> {
    const formData = new FormData()
    formData.append(
      'answers',
      JSON.stringify([
        { questionId: 'rating', value: data.rating },
        { questionId: 'category', value: data.category },
      ])
    )
    formData.append('publicComment', data.message)
    if (data.ticketId) {
      formData.append('ticketId', data.ticketId)
    }
    return apiClient.post(`${FEEDBACK_BASE}/submit`, formData)
  },

  // Reply to feedback (admin)
  async replyToFeedback(id: string, reply: string): Promise<{ message: string }> {
    return apiClient.patch(`${FEEDBACK_BASE}/${id}`, { reply })
  },

  // Update feedback status (admin)
  async updateFeedbackStatus(id: string, data: UpdateFeedbackRequest): Promise<Feedback> {
    return apiClient.patch(`${FEEDBACK_BASE}/${id}`, data)
  },

  // Convert feedback to ticket (admin)
  async convertToTicket(id: string): Promise<{ ticketId: string; ticketNumber: string }> {
    return apiClient.post(`${FEEDBACK_BASE}/${id}/convert`)
  },

  // Get feedback responses
  async getResponses(id: string): Promise<FeedbackResponse[]> {
    return apiClient.get(`${FEEDBACK_BASE}/${id}/responses`)
  },

  // Get customer's own feedback (portal)
  async getMyFeedback(params?: {
    page?: number
    limit?: number
  }): Promise<{ data: Feedback[]; total: number; page: number; limit: number }> {
    return apiClient.get(`${FEEDBACK_BASE}/history`, { params })
  },
}
