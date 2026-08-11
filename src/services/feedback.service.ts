import { apiClient } from './api-client'
import {
  Feedback,
  FeedbackResponse,
  FeedbackAnalytics,
  FeedbackFilters,
  FeedbackRating,
  CreateFeedbackRequest,
  UpdateFeedbackRequest,
  FeedbackStats,
  FeedbackForm,
  FeedbackAnswerValue,
} from '@/types/feedback'

const FEEDBACK_BASE = '/feedback'

/**
 * Maps the backend's feedback-analytics payload onto the FeedbackAnalytics
 * shape the feedback dashboard page consumes. The backend returns
 * ratingDistribution as an object ({ 1: 2, 2: 3, ... }) while the page expects
 * an array of { rating, count, percentage } — this conversion fixes the
 * "data.sort is not a function" crash.
 */
function mapFeedbackAnalytics(raw: any): FeedbackAnalytics {
  const summary = raw?.summary ?? {}
  const distribution: Record<string, number> = raw?.ratingDistribution ?? {}

  const entries = [1, 2, 3, 4, 5].map((rating) => ({
    rating: rating as FeedbackRating,
    count: distribution[rating] ?? 0,
  }))
  const total =
    summary.totalResponses ?? entries.reduce((sum, e) => sum + e.count, 0)
  const positiveCount = (distribution[4] ?? 0) + (distribution[5] ?? 0)
  const neutralCount = distribution[3] ?? 0
  const negativeCount = (distribution[1] ?? 0) + (distribution[2] ?? 0)
  const percentage = (count: number) =>
    total > 0 ? Math.round((count / total) * 1000) / 10 : 0

  const trends = raw?.trends ?? []

  return {
    total,
    averageRating: summary.averageRating ?? 0,
    satisfactionPercentage: summary.cSat ?? summary.csat ?? 0,
    positiveCount,
    negativeCount,
    neutralCount,
    ratingDistribution: entries.map((e) => ({
      rating: e.rating,
      count: e.count,
      percentage: percentage(e.count),
    })),
    sentimentBreakdown: {
      positive: positiveCount,
      neutral: neutralCount,
      negative: negativeCount,
    },
    categoryBreakdown: [],
    trendData: trends.map((t: any) => ({
      date: t.period,
      count: t.count ?? 0,
      averageRating: t.average ?? 0,
    })),
    volumeData: trends.map((t: any) => ({
      date: t.period,
      count: t.count ?? 0,
    })),
    recentFeedback: [],
  }
}

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
    const raw = await apiClient.get<any>(`${FEEDBACK_BASE}/analytics`)
    return mapFeedbackAnalytics(raw)
  },

  // Get feedback stats
  async getStats(): Promise<FeedbackStats> {
    return apiClient.get(`${FEEDBACK_BASE}/dashboard`)
  },

  // Get active public feedback form for the current organization
  async getActiveForms(): Promise<{ items: FeedbackForm[]; total: number }> {
    return apiClient.get(`${FEEDBACK_BASE}/forms`, { params: { limit: 20 } })
  },

  // Get a single feedback form with its questions
  async getForm(id: string): Promise<FeedbackForm> {
    return apiClient.get(`${FEEDBACK_BASE}/forms/${id}`)
  },

  // Submit feedback (customer) — answers keyed to the form's real question
  // ids, plus formId + ticketId as required by the backend submit contract.
  async submitFeedbackForm(data: {
    formId: string
    ticketId: string
    answers: FeedbackAnswerValue[]
    publicComment?: string
  }): Promise<Feedback> {
    const formData = new FormData()
    formData.append('formId', data.formId)
    formData.append('ticketId', data.ticketId)
    formData.append('answers', JSON.stringify(data.answers))
    if (data.publicComment) {
      formData.append('publicComment', data.publicComment)
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
