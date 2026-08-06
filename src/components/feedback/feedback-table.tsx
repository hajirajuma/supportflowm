'use client'

import Link from 'next/link'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RatingStars } from './rating-stars'
import { SentimentBadge } from './sentiment-badge'
import { Feedback } from '@/types/feedback'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Eye } from 'lucide-react'

interface FeedbackTableProps {
  data: Feedback[]
  total: number
  page: number
  limit: number
  onPageChange: (page: number) => void
  isLoading?: boolean
}

export function FeedbackTable({
  data,
  total,
  page,
  limit,
  onPageChange,
  isLoading = false,
}: FeedbackTableProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-warning/10 text-warning',
      reviewed: 'bg-blue-500/10 text-blue-500',
      replied: 'bg-success/10 text-success',
      converted: 'bg-primary/10 text-primary',
    }
    return colors[status as keyof typeof colors] || ''
  }

  const columns: ColumnDef<Feedback>[] = [
    {
      accessorKey: 'customer',
      header: 'Customer',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">
            {row.original.customer.firstName} {row.original.customer.lastName}
          </p>
          <p className="text-sm text-muted-foreground">
            {row.original.customer.email}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <RatingStars rating={row.original.rating} size="sm" />
          <span className="text-xs text-muted-foreground">
            {row.original.rating}/5
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'subject',
      header: 'Feedback',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.subject}</p>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {row.original.message}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.category.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'sentiment',
      header: 'Sentiment',
      cell: ({ row }) => <SentimentBadge sentiment={row.original.sentiment} />,
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
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => (
        <span className="text-sm">{formatDate(row.original.createdAt)}</span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Link href={`/tenant/feedback/${row.original.id}`}>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      ),
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