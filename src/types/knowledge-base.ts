export type ArticleStatus = 'draft' | 'published' | 'archived'

export interface Article {
  id: string
  slug: string
  title: string
  description?: string
  content: string
  readingTime?: number
  excerpt?: string
  categoryId: string
  category: ArticleCategory
  tags: ArticleTag[]
  authorId: string
  author: {
    id: string
    firstName: string
    lastName: string
    email?: string
  }
  status: ArticleStatus
  featured: boolean
  views: number
  helpfulCount: number
  notHelpfulCount: number
  coverImage?: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface ArticleCategory {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  articleCount: number
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface ArticleTag {
  id: string
  name: string
  slug: string
  createdAt: string
}

export type ArticleFeedback = 'helpful' | 'not_helpful'

export interface SearchResult {
  data: Article[]
  total: number
  query?: string
  categories?: ArticleCategory[]
  suggestions?: string[]
}

export interface ArticleAnalytics {
  totalArticles: number
  publishedArticles: number
  draftArticles: number
  totalViews: number
  totalFeedback: number
  helpfulPercentage: number
  averageRating: number
  topArticles: Array<{
    id: string
    title: string
    slug: string
    views: number
    helpfulCount: number
  }>
  popularArticles: Array<{
    id: string
    title: string
    slug: string
    views: number
    helpfulPercentage: number
  }>
  viewsOverTime: Array<{ date: string; views: number }>
  viewsByDay: Array<{ date: string; views: number }>
  categoryBreakdown: Array<{
    category: ArticleCategory
    articleCount: number
    views: number
  }>
}

export interface ArticleFilters {
  categoryId?: string
  status?: ArticleStatus
  search?: string
  tag?: string
  featured?: boolean
  page?: number
  limit?: number
}

export interface CreateArticleRequest {
  title: string
  content: string
  categoryId: string
  excerpt?: string
  tags?: string[]
  featured?: boolean
  status?: ArticleStatus
}

export interface UpdateArticleRequest {
  title?: string
  content?: string
  categoryId?: string
  excerpt?: string
  tags?: string[]
  featured?: boolean
  status?: ArticleStatus
}

export interface CreateCategoryRequest {
  name: string
  description?: string
  icon?: string
  sortOrder?: number
}

export interface UpdateCategoryRequest {
  name?: string
  description?: string
  icon?: string
  sortOrder?: number
}
