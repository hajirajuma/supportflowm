'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Layers } from 'lucide-react'
import type { ArticleCategory } from '@/types/knowledge-base'

interface CategoryCardProps {
  category: ArticleCategory
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/help/search?q=${encodeURIComponent(category.name)}`} className="group block">
      <Card className="h-full transition-colors hover:border-primary/50 hover:bg-accent/50">
        <CardContent className="p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Layers className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-1 text-lg font-semibold group-hover:text-primary">
            {category.name}
          </h3>
          {category.description && (
            <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{category.description}</p>
          )}
          <Badge variant="outline">
            {category.articleCount} {category.articleCount === 1 ? 'article' : 'articles'}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  )
}
