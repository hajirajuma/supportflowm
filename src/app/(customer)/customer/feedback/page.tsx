'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useFeedback } from '@/hooks/use-feedback'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { RatingStars } from '@/components/feedback/rating-stars'
import { formatDate } from '@/lib/utils'
import { Plus, MessageSquare, Ticket } from 'lucide-react'

// Backend history payload: { items: [...], total, page, limit } where each
// item is a feedback response with overallScore / publicComment / form /
// ticket / submittedAt.
interface HistoryItem {
  id: string
  status: string
  overallScore: number | null
  publicComment?: string | null
  submittedAt: string
  form?: { id: string; title: string; thankYouMessage?: string | null } | null
  ticket?: {
    id: string
    ticketNumber: string
    subject: string
  } | null
}

export default function MyFeedbackPage() {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const { useMyFeedback } = useFeedback()
  const { data, isLoading } = useMyFeedback({ page, limit })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    )
  }

  const items: HistoryItem[] = (data?.data as unknown as HistoryItem[] | undefined) ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Feedback</h1>
          <p className="text-muted-foreground">
            View your submitted feedback and responses
          </p>
        </div>
        <Link href="/customer/feedback/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Submit Feedback
          </Button>
        </Link>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No feedback yet</h3>
            <p className="text-sm text-muted-foreground">
              Share your experience with us
            </p>
            <Link href="/customer/feedback/new">
              <Button className="mt-4">Submit Feedback</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    {item.ticket && (
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        <Ticket className="h-3.5 w-3.5" />
                        {item.ticket.ticketNumber}
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {formatDate(item.submittedAt)}
                    </span>
                  </div>
                  {typeof item.overallScore === 'number' && (
                    <div className="flex items-center gap-2">
                      <RatingStars rating={item.overallScore} size="sm" />
                      <span className="text-sm font-medium">
                        {item.overallScore}/5
                      </span>
                    </div>
                  )}
                </div>
                {item.form && (
                  <p className="text-sm font-medium">{item.form.title}</p>
                )}
                {item.ticket?.subject && (
                  <p className="text-sm text-muted-foreground">
                    {item.ticket.subject}
                  </p>
                )}
              </CardHeader>
              {item.publicComment && (
                <CardContent className="pt-0">
                  <p className="text-sm">{item.publicComment}</p>
                </CardContent>
              )}
            </Card>
          ))}
          {typeof data?.total === 'number' && data.total > page * limit && (
            <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
                Load more
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
