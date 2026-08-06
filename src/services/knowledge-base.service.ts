import { apiClient } from './api-client'
import {
  Article,
  ArticleCategory,
  ArticleTag,
  ArticleAnalytics,
  ArticleFeedback,
  SearchResult,
  CreateArticleRequest,
  UpdateArticleRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ArticleFilters,
} from '@/types/knowledge-base'

const KB_BASE = '/knowledge'

export const knowledgeBaseService = {
  // Public endpoints
  async getCategories(): Promise<ArticleCategory[]> {
    return apiClient.get<ArticleCategory[]>(`${KB_BASE}/categories`)
  },

  async getArticles(params?: {
    category?: string
    limit?: number
    featured?: boolean
    page?: number
  }): Promise<{ data: Article[]; total: number }> {
    return apiClient.get(`${KB_BASE}/articles`, { params })
  },

  async getArticleBySlug(slug: string): Promise<Article> {
    return apiClient.get<Article>(`${KB_BASE}/articles/${slug}`)
  },

  async searchArticles(
    query: string,
    params?: { category?: string; limit?: number; page?: number }
  ): Promise<SearchResult> {
    return apiClient.get(`${KB_BASE}/search`, { params: { q: query, ...params } })
  },

  async submitArticleFeedback(
    slug: string,
    data: { feedback: ArticleFeedback; comment?: string }
  ): Promise<{ message: string }> {
    return apiClient.post(`${KB_BASE}/articles/${slug}/vote`, data)
  },

  // Admin endpoints
  async getAdminArticles(filters?: ArticleFilters): Promise<{ data: Article[]; total: number }> {
    return apiClient.get(`${KB_BASE}/articles`, { params: filters })
  },

  async getArticleById(id: string): Promise<Article> {
    return apiClient.get<Article>(`${KB_BASE}/articles/${id}`)
  },

  async createArticle(data: CreateArticleRequest): Promise<Article> {
    return apiClient.post(`${KB_BASE}/articles`, data)
  },

  async updateArticle(id: string, data: UpdateArticleRequest): Promise<Article> {
    return apiClient.patch(`${KB_BASE}/articles/${id}`, data)
  },

  async deleteArticle(id: string): Promise<{ message: string }> {
    return apiClient.delete(`${KB_BASE}/articles/${id}`)
  },

  async publishArticle(id: string): Promise<Article> {
    return apiClient.post(`${KB_BASE}/articles/${id}/publish`)
  },

  async unpublishArticle(id: string): Promise<Article> {
    return apiClient.post(`${KB_BASE}/articles/${id}/archive`)
  },

  async archiveArticle(id: string): Promise<Article> {
    return apiClient.post(`${KB_BASE}/articles/${id}/archive`)
  },

  async restoreArticle(id: string): Promise<Article> {
    return apiClient.post(`${KB_BASE}/articles/${id}/restore`)
  },

  async duplicateArticle(id: string): Promise<Article> {
    return apiClient.post(`${KB_BASE}/articles/${id}/duplicate`)
  },

  // Category management
  async createCategory(data: CreateCategoryRequest): Promise<ArticleCategory> {
    return apiClient.post(`${KB_BASE}/categories`, data)
  },

  async updateCategory(id: string, data: UpdateCategoryRequest): Promise<ArticleCategory> {
    return apiClient.patch(`${KB_BASE}/categories/${id}`, data)
  },

  async deleteCategory(id: string): Promise<{ message: string }> {
    return apiClient.delete(`${KB_BASE}/categories/${id}`)
  },

  async getCategoriesAdmin(): Promise<ArticleCategory[]> {
    return apiClient.get(`${KB_BASE}/categories`)
  },

  // Analytics
  async getAnalytics(): Promise<ArticleAnalytics> {
    return apiClient.get(`${KB_BASE}/analytics`)
  },

  // Tags
  async getTags(): Promise<ArticleTag[]> {
    return apiClient.get(`${KB_BASE}/tags`)
  },

  async createTag(name: string): Promise<ArticleTag> {
    return apiClient.post(`${KB_BASE}/tags`, { name })
  },
}
