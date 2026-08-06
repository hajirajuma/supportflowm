export interface ApiResponse<T = any> {
  data: T
  message: string
  statusCode: number
  timestamp: string
}

export interface ApiError {
  statusCode: number
  message: string
  error: string
  timestamp: string
  path: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

export interface QueryParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
  search?: string
  [key: string]: any
}
