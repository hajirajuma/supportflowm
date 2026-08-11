'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useFeedback } from '@/hooks/use-feedback'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { RatingStars } from '@/components/feedback/rating-stars'
import { SentimentBadge } from '@/components/feedback/sentiment-badge'
import { FeedbackTimeline } from '@/components/feedback/feedback-timeline'
import { FeedbackReplyBox } from '@/components/feedback/feedback-reply-box'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import {
  ArrowLeft,
  MessageSquare,
  Ticket,
  CheckCircle,
  Clock,
  Send,
  Loader2,
} from 'lucide-react'

const replySchema = z.object({
  reply: z.string().min(1, 'Reply message is required'),
})

type ReplyFormValues = z.infer<typeof replySchema>

export default function FeedbackDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { useFeedbackDetail, useResponses, replyToFeedback, updateStatus, convertToTicket } =
    useFeedback()
  const [showConvertDialog, setShowConvertDialog] = useState(false)
  const [isConverting, setIsConverting] = useState(false)

  const { data: feedback, isLoading } = useFeedbackDetail(id)
  const { data: responses, isLoading: isLoadingResponses } = useResponses(id)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
  })

  const onSubmitReply = async (data: ReplyFormValues) => {
    await replyToFeedback({ id, reply: data.reply })
    reset()
  }

  const handleStatusChange = async (status: string) => {
    await updateStatus({ id, data: { status: status as any } })
  }

  const handleConvertToTicket = async () => {
    setIsConverting(true)
    await convertToTicket(id)
    setIsConverting(false)
    setShowConvertDialog(false)
  }

  if (isLoading) {
    return <FeedbackDetailSkeleton />
  }

  if (!feedback) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Feedback not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/tenant/feedback">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Feedback Details</h1>
          <p className="text-muted-foreground">
            Review and respond to customer feedback
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Feedback Information */}
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Feedback</CardTitle>
                  <CardDescription>
                    Submitted {formatDate(feedback.createdAt)}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className={cn('capitalize', {
                      'bg-warning/10 text-warning': feedback.status === 'pending',
                      'bg-blue-500/10 text-blue-500': feedback.status === 'reviewed',
                      'bg-success/10 text-success': feedback.status === 'replied',
                      'bg-primary/10 text-primary': feedback.status === 'converted',
                    })}
                  >
                    {feedback.status}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {feedback.category}
                  </Badge>
                  <SentimentBadge sentiment={feedback.sentiment} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={feedback.customer.avatar} />
                  <AvatarFallback>
                    {feedback.customer.firstName[0]}
                    {feedback.customer.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {feedback.customer.firstName} {feedback.customer.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {feedback.customer.email}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <RatingStars rating={feedback.rating} />
                    <span className="text-sm font-medium">{feedback.rating}/5</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold">{feedback.subject}</h4>
                <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
                  {feedback.message}
                </p>
              </div>

              {feedback.ticketNumber && (
                <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3">
                  <Ticket className="h-5 w-5 text-primary" />
                  <span className="text-sm">
                    Converted to Ticket{' '}
                    <Link
                      href={`/support/tickets/${feedback.ticketId}`}
                      className="font-medium text-primary hover:underline"
                    >
                      #{feedback.ticketNumber}
                    </Link>
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Responses */}
          <Card>
            <CardHeader>
              <CardTitle>Responses</CardTitle>
              <CardDescription>
                Communication with the customer
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingResponses ? (
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : responses && responses.length > 0 ? (
                <div className="space-y-4">
                  {responses.map((response) => (
                    <div
                      key={response.id}
                      className={cn(
                        'flex gap-4 p-4 rounded-lg',
                        response.type === 'admin_reply'
                          ? 'bg-primary/5'
                          : 'bg-muted'
                      )}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={response.author.avatar} />
                        <AvatarFallback>
                          {response.author.firstName[0]}
                          {response.author.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {response.author.firstName} {response.author.lastName}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(response.createdAt)}
                          </span>
                          {response.type === 'admin_reply' && (
                            <Badge variant="secondary" className="text-xs">
                              Admin Reply
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 whitespace-pre-wrap">{response.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  No responses yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Reply Form */}
          {feedback.status !== 'converted' && (
            <Card>
              <CardHeader>
                <CardTitle>Reply to Customer</CardTitle>
                <CardDescription>
                  Respond to the feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmitReply)} className="space-y-4">
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Type your reply..."
                      {...register('reply')}
                      rows={4}
                      className={cn(errors.reply && 'border-destructive')}
                    />
                    {errors.reply && (
                      <p className="text-sm text-destructive">{errors.reply.message}</p>
                    )}
                  </div>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Reply
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={feedback.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {!feedback.ticketId && (
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => setShowConvertDialog(true)}
                >
                  <Ticket className="mr-2 h-4 w-4" />
                  Convert to Ticket
                </Button>
              )}

              {feedback.ticketId && (
                <Link href={`/support/tickets/${feedback.ticketId}`}>
                  <Button className="w-full" variant="outline">
                    <Ticket className="mr-2 h-4 w-4" />
                    View Ticket
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{formatDate(feedback.createdAt)}</span>
              </div>
              {feedback.updatedAt !== feedback.createdAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span>{formatDate(feedback.updatedAt)}</span>
                </div>
              )}
              {feedback.repliedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Replied</span>
                  <span>{formatDate(feedback.repliedAt)}</span>
                </div>
              )}
              {feedback.reviewedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reviewed</span>
                  <span>{formatDate(feedback.reviewedAt)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Convert Dialog */}
      <AlertDialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Convert to Ticket</AlertDialogTitle>
            <AlertDialogDescription>
              This will create a support ticket from this feedback. The customer
              will be notified and can track the ticket in the support portal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConvertToTicket} disabled={isConverting}>
              {isConverting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Converting...
                </>
              ) : (
                'Convert to Ticket'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function FeedbackDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-24" />
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="mt-1 h-4 w-48" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="mt-1 h-4 w-48" />
                  <Skeleton className="mt-2 h-6 w-32" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}