'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useKnowledgeBase } from '@/hooks/use-knowledge-base'
import { KnowledgeStatsCard } from '@/components/knowledge-base/knowledge-stats-card'
import { ArticleTable } from '@/components/knowledge-base/article-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, FileText, BookOpen, Clock, Eye } from 'lucide-react'

export default function KnowledgeBasePage() {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const { useAdminArticles, analytics, isLoadingAnalytics, adminCategories } = useKnowledgeBase()
  const { data, isLoading } = useAdminArticles({
    page,
    limit,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
  })

  if (isLoadingAnalytics) {
    return <KnowledgeBaseSkeleton />
  }

  const stats = [
    {
      title: 'Total Articles',
      value: analytics?.totalArticles || 0,
      icon: FileText,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Published',
      value: analytics?.publishedArticles || 0,
      icon: BookOpen,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      title: 'Drafts',
      value: analytics?.draftArticles || 0,
      icon: Clock,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      title: 'Total Views',
      value: analytics?.totalViews || 0,
      icon: Eye,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Knowledge Base</h1>
          <p className="text-muted-foreground">
            Manage your help center articles
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/tenant/knowledge-base/categories">
            <Button variant="outline">Manage Categories</Button>
          </Link>
          <Link href="/tenant/knowledge-base/articles/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Article
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <KnowledgeStatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Article Management */}
      <Card>
        <CardHeader>
          <CardTitle>Articles</CardTitle>
          <CardDescription>
            Manage all knowledge base articles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mt-4">
            <ArticleTable
              data={data?.data || []}
              total={data?.total || 0}
              page={page}
              limit={limit}
              onPageChange={setPage}
              isLoading={isLoading}
              categories={adminCategories || []}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function KnowledgeBaseSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>

      <Skeleton className="h-96 w-full" />
    </div>
  )
}