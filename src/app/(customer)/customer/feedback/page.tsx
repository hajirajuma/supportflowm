'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useFeedback } from '@/hooks/use-feedback'
import { FeedbackCard } from '@/components/feedback/feedback-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, MessageSquare } from 'lucide-react'

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

      {!data || data.data.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No feedback yet</h3>
            <p className="text-sm text-muted-foreground">
              Share your experience with us
            </p>
            <Link href="/customer/feedback/new">
              <Button className="mt-4">
                Submit Feedback
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.data.map((feedback) => (
            <FeedbackCard
              key={feedback.id}
              feedback={feedback}
              variant="full"
              showActions={false}
            />
          ))}
        </div>
      )}
    </div>
  )
}