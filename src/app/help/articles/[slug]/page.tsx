'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useKnowledgeBase } from '@/hooks/use-knowledge-base'
import { ArticleViewer } from '@/components/knowledge-base/article-viewer'
import { ArticleFeedback } from '@/components/knowledge-base/article-feedback'
import { ArticleSidebar } from '@/components/knowledge-base/article-sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft } from 'lucide-react'

export default function ArticlePage() {
  const params = useParams()
  const slug = params.slug as string
  const { useArticle } = useKnowledgeBase()
  const { data: article, isLoading } = useArticle(slug)

  if (isLoading) {
    return <ArticleSkeleton />
  }

  if (!article) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Article not found</h1>
          <p className="text-muted-foreground">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/help" className="text-primary hover:underline mt-4 inline-block">
            Return to Help Center
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container max-w-6xl py-4">
          <Link href="/help" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Help Center
          </Link>
        </div>
      </div>

      <div className="container max-w-6xl py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3">
            {/* Article Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline">{article.category.name}</Badge>
                <span className="text-sm text-muted-foreground">
                  {article.readingTime} min read
                </span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">
                  Updated {new Date(article.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
              <p className="text-lg text-muted-foreground">{article.description}</p>
            </div>

            {/* Article Content */}
            <ArticleViewer content={article.content} />

            {/* Article Feedback */}
            <div className="mt-12 border-t pt-8">
              <ArticleFeedback
                articleId={article.id}
                slug={article.slug}
                helpfulCount={article.helpfulCount}
                notHelpfulCount={article.notHelpfulCount}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <ArticleSidebar article={article} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ArticleSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container max-w-6xl py-4">
          <Skeleton className="h-5 w-32" />
        </div>
      </div>

      <div className="container max-w-6xl py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2" />
            </div>

            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
              <Skeleton className="h-20 w-full" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}