import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import { useAuthStore } from '@/store/auth-store'
import { ApiError } from '@/types/api'

interface ApiEnvelope<T> {
  success: boolean
  data: T
}

type RetryableConfig = AxiosRequestConfig & { _retry?: boolean }

const DEFAULT_BASE_URL = 'http://localhost:3001/api/v1'

function normalizeBaseUrl(url: string | undefined): string {
  const base = (url || DEFAULT_BASE_URL).replace(/\/+$/, '')
  if (base.endsWith('/api') || base.endsWith('/api/')) {
    return `${base}/v1`
  }
  return base
}

const API_BASE_URL = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL)

interface NormalizedEnvelope<T> {
  data: T
  total?: number
  [key: string]: any
}

function normalizeResponse<T>(body: unknown): T {
  let payload: any = body

  // The backend wraps every handler result in { success, data } and some
  // handlers (auth, organizations) additionally return { success, message,
  // data }, producing a nested envelope. Unwrap each level, but stop at a
  // null data so message-bearing responses (e.g. changePassword) survive.
  while (
    payload &&
    typeof payload === 'object' &&
    'success' in payload &&
    'data' in payload &&
    payload.data !== null
  ) {
    payload = payload.data
  }

  if (
    payload &&
    typeof payload === 'object' &&
    Array.isArray(payload.items) &&
    typeof payload.total === 'number'
  ) {
    const { items, total, ...rest } = payload
    const normalized: NormalizedEnvelope<T> = { data: items, total, ...rest }
    return normalized as T
  }

  return payload as T
}

function toApiError(error: AxiosError): ApiError & { message: string } {
  const responseData = error.response?.data as
    | (ApiError & { message?: string | string[] })
    | undefined

  const rawMessage = responseData?.message ?? error.message ?? 'Request failed'
  const message = Array.isArray(rawMessage) ? rawMessage.join(', ') : rawMessage

  return {
    statusCode: responseData?.statusCode ?? error.response?.status ?? 0,
    message: message || 'Request failed',
    error: responseData?.error ?? error.response?.statusText ?? error.message,
    timestamp: responseData?.timestamp ?? new Date().toISOString(),
    path: responseData?.path ?? '',
  }
}

class ApiClient {
  private instance: AxiosInstance
  private isRefreshing = false
  private refreshSubscribers: ((token: string) => void)[] = []

  constructor(baseURL: string = API_BASE_URL) {
    this.instance = axios.create({
      baseURL,
      timeout: 30000,
    })
    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().accessToken
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => this.handleResponseError(error)
    )
  }

  private async handleResponseError(error: AxiosError): Promise<any> {
    const originalRequest = error.config as RetryableConfig | undefined
    const status = error.response?.status

    if (status === 401 && originalRequest && !originalRequest._retry) {
      return this.handleUnauthorized(originalRequest)
    }

    return Promise.reject(toApiError(error))
  }

  private async refreshTokens(): Promise<{ accessToken: string; refreshToken?: string }> {
    const refreshToken = useAuthStore.getState().refreshToken
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    const response = await this.instance.post<ApiEnvelope<{ accessToken: string; refreshToken?: string }>>(
      '/auth/refresh',
      { refreshToken },
      { _retry: true } as RetryableConfig
    )
    return normalizeResponse<{ accessToken: string; refreshToken?: string }>(response.data)
  }

  private async handleUnauthorized(originalRequest: RetryableConfig): Promise<any> {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.refreshSubscribers.push((token: string) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }
          this.instance(originalRequest).then(resolve, reject)
        })
      })
    }

    originalRequest._retry = true
    this.isRefreshing = true

    try {
      const tokens = await this.refreshTokens()

      if (tokens.accessToken) {
        useAuthStore.getState().setTokens(
          tokens.accessToken,
          tokens.refreshToken ?? useAuthStore.getState().refreshToken ?? ''
        )
      }

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`
      }

      this.refreshSubscribers.forEach((callback) => callback(tokens.accessToken))
      this.refreshSubscribers = []

      return this.instance(originalRequest)
    } catch (refreshError) {
      this.refreshSubscribers = []
      useAuthStore.getState().logout()
      if (typeof window !== 'undefined') {
        window.location.assign('/login')
      }
      if (axios.isAxiosError(refreshError)) {
        return Promise.reject(toApiError(refreshError))
      }
      return Promise.reject(
        new Error(
          refreshError instanceof Error ? refreshError.message : 'Authentication failed'
        )
      )
    } finally {
      this.isRefreshing = false
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url })
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data })
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data })
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data })
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url })
  }

  async upload<T>(url: string, file: File, config?: AxiosRequestConfig): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)
    return this.request<T>({
      ...config,
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(config?.headers || {}),
      },
    })
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.request<ApiEnvelope<T>>(config)
    return this.unwrap<T>(response)
  }

  private unwrap<T>(response: AxiosResponse<ApiEnvelope<T>>): T {
    if (response.config.responseType === 'blob') {
      return response.data as unknown as T
    }
    return normalizeResponse<T>(response.data)
  }
}

export const apiClient = new ApiClient()
