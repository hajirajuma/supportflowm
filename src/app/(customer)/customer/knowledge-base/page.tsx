'use client'

import { useState } from 'react'
import { useCustomer } from '@/hooks/use-customer'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { BookOpen, Search, Eye, CalendarDays } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function CustomerKnowledgeBasePage() {
  const { useArticles } = useCustomer()
  const [search, setSearch] = useState('')
  const [limit] = useState(12)

  const { data, isLoading } = useArticles({
    search: search || undefined,
    limit,
  })

  const articles = data?.data || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Knowledge Base</h1>
        <p className="text-muted-foreground">
          Find helpful articles about your account and our services
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="space-y-3 p-6">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <BookOpen className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              {search ? 'No articles match your search' : 'No articles yet'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Card key={article.id} className="flex flex-col">
              <CardHeader>
                {article.category && (
                  <Badge variant="outline" className="mb-2 w-fit">
                    {article.category.name}
                  </Badge>
                )}
                <CardTitle className="text-base leading-snug">
                  {article.title}
                </CardTitle>
                {article.excerpt && (
                  <CardDescription className="line-clamp-3">
                    {article.excerpt}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="mt-auto flex items-center gap-4 pt-0 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {article.views ?? 0} views
                </span>
                {article.publishedAt && (
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(article.publishedAt)}
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
