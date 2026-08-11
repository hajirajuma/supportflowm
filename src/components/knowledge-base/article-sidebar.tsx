'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tag, Eye, ThumbsUp, ThumbsDown, Calendar, Clock, User } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Article } from '@/types/knowledge-base'

interface ArticleSidebarProps {
  article: Article
}

export function ArticleSidebar({ article }: ArticleSidebarProps) {
  const helpfulPercentage =
    article.helpfulCount + article.notHelpfulCount > 0
      ? Math.round(
          (article.helpfulCount / (article.helpfulCount + article.notHelpfulCount)) * 100
        )
      : 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">About this article</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">Category</p>
            <Badge variant="outline">{article.category.name}</Badge>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Tags</p>
            {article.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary">
                    <Tag className="mr-1 h-3 w-3" />
                    {tag.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No tags</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Article stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <Eye className="h-4 w-4" />
              Views
            </span>
            <span className="font-medium">{article.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <ThumbsUp className="h-4 w-4" />
              Helpful
            </span>
            <span className="font-medium">{article.helpfulCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <ThumbsDown className="h-4 w-4" />
              Not helpful
            </span>
            <span className="font-medium">{article.notHelpfulCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <ThumbsUp className="h-4 w-4" />
              Helpfulness
            </span>
            <span className="font-medium">{helpfulPercentage}%</span>
          </div>
          {article.readingTime ? (
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                Reading time
              </span>
              <span className="font-medium">{article.readingTime} min</span>
            </div>
          ) : null}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Updated
            </span>
            <span className="font-medium">{formatDate(article.updatedAt)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Published
            </span>
            <span className="font-medium">
              {article.publishedAt ? formatDate(article.publishedAt) : '—'}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Author</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">
                {article.author.firstName} {article.author.lastName}
              </p>
              <p className="text-sm text-muted-foreground">
                {article.author.email || 'Knowledge Base'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
