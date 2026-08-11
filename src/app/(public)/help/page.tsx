'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useKnowledgeBase } from '@/hooks/use-knowledge-base'
import { HelpCenterHero } from '@/components/knowledge-base/help-center-hero'
import { CategoryCard } from '@/components/knowledge-base/category-card'
import { ArticleCard } from '@/components/knowledge-base/article-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, TrendingUp, Clock } from 'lucide-react'

export default function HelpCenterPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const { categories, isLoadingCategories, useArticles } = useKnowledgeBase()
  const { data: popularArticles, isLoading: isLoadingPopular } = useArticles({
    limit: 6,
    featured: true,
  })
  const { data: recentArticles, isLoading: isLoadingRecent } = useArticles({
    limit: 6,
  })

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/help/search?q=${encodeURIComponent(query)}`)
    }
  }

  if (isLoadingCategories || isLoadingPopular || isLoadingRecent) {
    return <HelpCenterSkeleton />
  }

  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32">
      <HelpCenterHero
        title="How can we help you?"
        subtitle="Search our knowledge base for answers to common questions"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearch}
      />

      <div className="container max-w-6xl py-12">
        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories?.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        {popularArticles?.data && popularArticles.data.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Popular Articles</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {popularArticles.data.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        )}

        {/* Recent Articles */}
        {recentArticles?.data && recentArticles.data.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Recently Updated</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentArticles.data.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function HelpCenterSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
        <div className="container max-w-4xl text-center">
          <Skeleton className="mx-auto h-10 w-64" />
          <Skeleton className="mx-auto mt-4 h-5 w-96" />
          <Skeleton className="mx-auto mt-8 h-12 w-full max-w-2xl" />
        </div>
      </div>

      <div className="container max-w-6xl py-12">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>

        <Skeleton className="h-8 w-48 mt-12 mb-6" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}