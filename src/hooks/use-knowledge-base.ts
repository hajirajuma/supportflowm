'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { knowledgeBaseService } from '@/services/knowledge-base.service'
import {
  CreateArticleRequest,
  UpdateArticleRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/types/knowledge-base'

export const KB_QUERY_KEYS = {
  categories: ['knowledge-base', 'categories'],
  articles: ['knowledge-base', 'articles'],
  article: (slug: string) => ['knowledge-base', 'articles', slug],
  search: ['knowledge-base', 'search'],
  adminArticles: ['knowledge-base', 'admin', 'articles'],
  adminArticle: (id: string) => ['knowledge-base', 'admin', 'articles', id],
  adminCategories: ['knowledge-base', 'admin', 'categories'],
  analytics: ['knowledge-base', 'admin', 'analytics'],
  tags: ['knowledge-base', 'tags'],
}

export function useKnowledgeBase() {
  const queryClient = useQueryClient()

  // Public: Get categories
  const {
    data: categories,
    isLoading: isLoadingCategories,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: KB_QUERY_KEYS.categories,
    queryFn: () => knowledgeBaseService.getCategories(),
  })

  // Public: Get articles
  const useArticles = (params?: { category?: string; limit?: number; featured?: boolean }) => {
    return useQuery({
      queryKey: [...KB_QUERY_KEYS.articles, params],
      queryFn: () => knowledgeBaseService.getArticles(params),
    })
  }

  // Public: Get article by slug
  const useArticle = (slug: string) => {
    return useQuery({
      queryKey: KB_QUERY_KEYS.article(slug),
      queryFn: () => knowledgeBaseService.getArticleBySlug(slug),
      enabled: !!slug,
    })
  }

  // Public: Search articles
  const useSearch = (query: string, params?: { category?: string; limit?: number; page?: number }) => {
    return useQuery({
      queryKey: [...KB_QUERY_KEYS.search, query, params],
      queryFn: () => knowledgeBaseService.searchArticles(query, params),
      enabled: !!query && query.length >= 2,
    })
  }

  // Admin: Get articles
  const useAdminArticles = (filters?: any) => {
    return useQuery({
      queryKey: [...KB_QUERY_KEYS.adminArticles, filters],
      queryFn: () => knowledgeBaseService.getAdminArticles(filters),
    })
  }

  // Admin: Get article by ID
  const useAdminArticle = (id: string) => {
    return useQuery({
      queryKey: KB_QUERY_KEYS.adminArticle(id),
      queryFn: () => knowledgeBaseService.getArticleById(id),
      enabled: !!id,
    })
  }

  // Admin: Get categories
  const {
    data: adminCategories,
    isLoading: isLoadingAdminCategories,
    refetch: refetchAdminCategories,
  } = useQuery({
    queryKey: KB_QUERY_KEYS.adminCategories,
    queryFn: () => knowledgeBaseService.getCategoriesAdmin(),
  })

  // Admin: Get analytics
  const {
    data: analytics,
    isLoading: isLoadingAnalytics,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: KB_QUERY_KEYS.analytics,
    queryFn: () => knowledgeBaseService.getAnalytics(),
    refetchInterval: 60000,
  })

  // Admin: Get tags
  const {
    data: tags,
    isLoading: isLoadingTags,
    refetch: refetchTags,
  } = useQuery({
    queryKey: KB_QUERY_KEYS.tags,
    queryFn: () => knowledgeBaseService.getTags(),
  })

  // Mutations
  const createArticleMutation = useMutation({
    mutationFn: (data: CreateArticleRequest) => knowledgeBaseService.createArticle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KB_QUERY_KEYS.adminArticles })
      queryClient.invalidateQueries({ queryKey: KB_QUERY_KEYS.analytics })
      toast.success('Article created successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create article')
    },
  })

  const updateArticleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateArticleRequest }) =>
      knowledgeBaseService.updateArticle(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: KB_QUERY_KEYS.adminArticles })
      queryClient.invalidateQueries({ queryKey: KB_QUERY_KEYS.adminArticle(id) })
      queryClient.invalidateQueries({ queryKey: KB_QUERY_KEYS.analytics })
      toast.success('Article updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update article')
    },
  })

  const deleteArticleMutation = useMutation({
    mutationFn: (id: string) => knowledgeBaseService.deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KB_QUERY_KEYS.adminArticles })
      queryClient.invalidateQueries({ queryKey: KB_QUERY_KEYS.analytics })
      toast.success('Article deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete article')
    },
  })

  const publishArticleMutation = useMutation({
    mutationFn: (id: string) => knowledgeBaseService.publishArticle(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: KB_QUERY_KEYS.adminArticles })
      queryClient.invalidateQueries({ queryKey: KB_QUERY_KEYS.adminArticle(id) })
      toast.success('Article published successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to publish article')
    },
  })

  const unpublishArticleMutation = useMutation({
    mutationFn: (id: string) => knowledgeBaseService.unpublishArticle(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: KB_QUERY_KEYS.adminArticles })
      queryClient.invalidateQueries({ queryKey: KB_QUERY_KEYS.adminArticle(id) })
      toast.success('Article unpublished successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to unpublish article')
    },
  })

  const createCategoryMutation = useMutation({
    mutationFn: (data: CreateCategoryRequest) => knowledgeBaseService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KB_QUERY_KEYS.adminCategories })
      toast.success('Category created successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create category')
    },
  })

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryRequest }) =>
      knowledgeBaseService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KB_QUERY_KEYS.adminCategories })
      toast.success('Category updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update category')
    },
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => knowledgeBaseService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KB_QUERY_KEYS.adminCategories })
      toast.success('Category deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete category')
    },
  })

  const submitFeedbackMutation = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: any }) =>
      knowledgeBaseService.submitArticleFeedback(slug, data),
    onSuccess: () => {
      toast.success('Thank you for your feedback!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit feedback')
    },
  })

  return {
    // Public
    categories,
    isLoadingCategories,
    refetchCategories,
    useArticles,
    useArticle,
    useSearch,
    submitFeedback: submitFeedbackMutation.mutate,
    isSubmittingFeedback: submitFeedbackMutation.isPending,

    // Admin
    useAdminArticles,
    useAdminArticle,
    adminCategories,
    isLoadingAdminCategories,
    refetchAdminCategories,
    analytics,
    isLoadingAnalytics,
    refetchAnalytics,
    tags,
    isLoadingTags,
    refetchTags,

    // Mutations
    createArticle: createArticleMutation.mutate,
    isCreatingArticle: createArticleMutation.isPending,
    updateArticle: updateArticleMutation.mutate,
    isUpdatingArticle: updateArticleMutation.isPending,
    deleteArticle: deleteArticleMutation.mutate,
    isDeletingArticle: deleteArticleMutation.isPending,
    publishArticle: publishArticleMutation.mutate,
    isPublishingArticle: publishArticleMutation.isPending,
    unpublishArticle: unpublishArticleMutation.mutate,
    isUnpublishingArticle: unpublishArticleMutation.isPending,

    createCategory: createCategoryMutation.mutate,
    isCreatingCategory: createCategoryMutation.isPending,
    updateCategory: updateCategoryMutation.mutate,
    isUpdatingCategory: updateCategoryMutation.isPending,
    deleteCategory: deleteCategoryMutation.mutate,
    isDeletingCategory: deleteCategoryMutation.isPending,
  }
}