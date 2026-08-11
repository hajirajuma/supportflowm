'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Clock, Eye, ThumbsUp, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Article } from '@/types/knowledge-base'

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/help/articles/${article.slug}`} className="group block">
      <Card className="flex h-full flex-col transition-colors hover:border-primary/50 hover:bg-accent/50">
        <CardContent className="flex flex-1 flex-col p-6">
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="outline">{article.category.name}</Badge>
          </div>

          <div className="mb-2 flex items-start gap-2">
            <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <h3 className="font-semibold leading-snug group-hover:text-primary">
              {article.title}
            </h3>
          </div>

          {article.description && (
            <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
              {article.description}
            </p>
          )}

          <div className="mt-auto flex items-center gap-4 text-xs text-muted-foreground">
            {article.readingTime ? (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {article.readingTime} min
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {article.views}
            </span>
            <span className="inline-flex items-center gap-1">
              <ThumbsUp className="h-3.5 w-3.5" />
              {article.helpfulCount}
            </span>
            <span className="ml-auto inline-flex items-center gap-1 text-primary">
              Read
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Updated {formatDate(article.updatedAt)}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
