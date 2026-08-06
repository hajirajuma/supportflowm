import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { apiClient } from './api-client'
import { ApiError } from '@/types/api'

// Query hook
export function useApiQuery<TData = any, TError = ApiError>(
  key: string[],
  url: string,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, TError>({
    queryKey: key,
    queryFn: () => apiClient.get<TData>(url),
    ...options,
  })
}

// Mutation hook
export function useApiMutation<TData = any, TVariables = any, TError = ApiError>(
  method: 'post' | 'put' | 'patch' | 'delete',
  url: string,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>
) {
  return useMutation<TData, TError, TVariables>({
    mutationFn: (variables: TVariables) => {
      switch (method) {
        case 'post':
          return apiClient.post<TData>(url, variables)
        case 'put':
          return apiClient.put<TData>(url, variables)
        case 'patch':
          return apiClient.patch<TData>(url, variables)
        case 'delete':
          return apiClient.delete<TData>(url)
        default:
          throw new Error(`Unsupported method: ${method}`)
      }
    },
    ...options,
  })
}

// Upload mutation
export function useUploadMutation<TData = any, TError = ApiError>(
  url: string,
  options?: Omit<UseMutationOptions<TData, TError, File>, 'mutationFn'>
) {
  return useMutation<TData, TError, File>({
    mutationFn: (file: File) => apiClient.upload<TData>(url, file),
    ...options,
  })
}