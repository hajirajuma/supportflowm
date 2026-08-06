'use client'

import { cn } from '@/lib/utils'

interface ArticleViewerProps {
  content: string
  className?: string
}

export function ArticleViewer({ content, className }: ArticleViewerProps) {
  return (
    <div
      className={cn(
        'prose prose-primary max-w-none dark:prose-invert',
        'prose-headings:font-bold prose-headings:text-foreground',
        'prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl',
        'prose-p:text-muted-foreground prose-p:leading-7',
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        'prose-ul:list-disc prose-ol:list-decimal',
        'prose-li:text-muted-foreground',
        'prose-blockquote:border-primary prose-blockquote:bg-muted/50 prose-blockquote:p-4',
        'prose-code:bg-muted prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:text-sm',
        'prose-pre:bg-muted prose-pre:rounded-lg prose-pre:p-4',
        'prose-img:rounded-lg prose-img:shadow-md',
        'prose-table:border prose-table:rounded-lg',
        'prose-th:bg-muted prose-th:p-2',
        'prose-td:border prose-td:p-2',
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}