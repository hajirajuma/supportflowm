export type FeedbackRating = 1 | 2 | 3 | 4 | 5
export type FeedbackCategory = 'product' | 'service' | 'support' | 'billing' | 'feature' | 'general'
export type FeedbackSentiment = 'positive' | 'neutral' | 'negative'
export type FeedbackStatus = 'pending' | 'reviewed' | 'replied' | 'converted'

export interface Feedback {
  id: string
  customerId: string
  customer: {
    id: string
    firstName: string
    lastName: string
    email: string
    avatar?: string
  }
  rating: FeedbackRating
  category: FeedbackCategory
  subject: string
  message: string
  sentiment: FeedbackSentiment
  status: FeedbackStatus
  ticketId?: string
  ticketNumber?: string
  reply?: string
  repliedAt?: string
  reviewedAt?: string
  convertedAt?: string
  createdAt: string
  updatedAt: string
}

export interface FeedbackResponse {
  id: string
  feedbackId: string
  message: string
  type: 'admin_reply' | 'customer_followup'
  author: {
    id: string
    firstName: string
    lastName: string
    role: string
  }
  createdAt: string
}

export interface FeedbackAnalytics {
  total: number
  averageRating: number
  satisfactionPercentage: number
  positiveCount: number
  negativeCount: number
  neutralCount: number
  ratingDistribution: {
    rating: FeedbackRating
    count: number
    percentage: number
  }[]
  sentimentBreakdown: {
    positive: number
    neutral: number
    negative: number
  }
  categoryBreakdown: {
    category: FeedbackCategory
    count: number
    percentage: number
  }[]
  trendData: {
    date: string
    count: number
    averageRating: number
  }[]
  volumeData: {
    date: string
    count: number
  }[]
  recentFeedback: Feedback[]
}

export interface CreateFeedbackRequest {
  rating: FeedbackRating
  category: FeedbackCategory
  subject: string
  message: string
  ticketId?: string
}

export interface UpdateFeedbackRequest {
  status?: FeedbackStatus
  reply?: string
  ticketId?: string
}

export interface FeedbackFilters {
  rating?: FeedbackRating[]
  category?: FeedbackCategory[]
  sentiment?: FeedbackSentiment[]
  status?: FeedbackStatus[]
  dateFrom?: string
  dateTo?: string
  search?: string
}

export interface FeedbackStats {
  total: number
  averageRating: number
  satisfactionPercentage: number
  byCategory: {
    category: FeedbackCategory
    count: number
    averageRating: number
  }[]
  bySentiment: {
    sentiment: FeedbackSentiment
    count: number
  }[]
}