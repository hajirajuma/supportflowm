'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Article, ArticleCategory, ArticleStatus } from '@/types/knowledge-base'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { MoreHorizontal, Eye, Edit, Trash2, Check, X } from 'lucide-react'
import { useKnowledgeBase } from '@/hooks/use-knowledge-base'

interface ArticleTableProps {
  data: Article[]
  total: number
  page: number
  limit: number
  onPageChange: (page: number) => void
  isLoading?: boolean
  categories: ArticleCategory[]
}

export function ArticleTable({
  data,
  total,
  page,
  limit,
  onPageChange,
  isLoading,
  categories,
}: ArticleTableProps) {
  const { deleteArticle, publishArticle, unpublishArticle } = useKnowledgeBase()
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const getStatusColor = (status: ArticleStatus) => {
    const colors = {
      draft: 'bg-warning/10 text-warning',
      published: 'bg-success/10 text-success',
      archived: 'bg-muted text-muted-foreground',
    }
    return colors[status] || 'bg-muted text-muted-foreground'
  }

  const columns: ColumnDef<Article>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.title}</p>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {row.original.description}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.category.name}</Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={cn('capitalize', getStatusColor(row.original.status))}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: 'views',
      header: 'Views',
      cell: ({ row }) => row.original.views.toLocaleString(),
    },
    {
      accessorKey: 'author',
      header: 'Author',
      cell: ({ row }) => (
        <span>
          {row.original.author.firstName} {row.original.author.lastName}
        </span>
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Last Updated',
      cell: ({ row }) => formatDate(row.original.updatedAt),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const article = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/help/articles/${article.slug}`}>
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
              </Link>
              <Link href={`/tenant/knowledge-base/articles/${article.id}/edit`}>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              </Link>
              {article.status === 'draft' ? (
                <DropdownMenuItem onClick={() => publishArticle(article.id)}>
                  <Check className="mr-2 h-4 w-4" />
                  Publish
                </DropdownMenuItem>
              ) : article.status === 'published' ? (
                <DropdownMenuItem onClick={() => unpublishArticle(article.id)}>
                  <X className="mr-2 h-4 w-4" />
                  Unpublish
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => deleteArticle(article.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      total={total}
      page={page}
      limit={limit}
      onPageChange={onPageChange}
      isLoading={isLoading}
    />
  )
}