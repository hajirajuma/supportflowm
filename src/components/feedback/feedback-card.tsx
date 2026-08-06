'use client'

import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { RatingStars } from './rating-stars'
import { SentimentBadge } from './sentiment-badge'
import { Feedback } from '@/types/feedback'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { ChevronRight, MessageSquare, Ticket } from 'lucide-react'

interface FeedbackCardProps {
  feedback: Feedback
  variant?: 'compact' | 'full'
  className?: string
  showActions?: boolean
}

export function FeedbackCard({
  feedback,
  variant = 'compact',
  className,
  showActions = true,
}: FeedbackCardProps) {
  const statusColors = {
    pending: 'bg-warning/10 text-warning',
    reviewed: 'bg-blue-500/10 text-blue-500',
    replied: 'bg-success/10 text-success',
    converted: 'bg-primary/10 text-primary',
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  if (variant === 'compact') {
    return (
      <Card className={cn('hover:shadow-md transition-shadow', className)}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={feedback.customer.avatar} />
                <AvatarFallback>
                  {getInitials(feedback.customer.firstName, feedback.customer.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {feedback.customer.firstName} {feedback.customer.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(feedback.createdAt)}
                </p>
              </div>
            </div>
            <Badge variant="outline" className={cn('capitalize', statusColors[feedback.status])}>
              {feedback.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <RatingStars rating={feedback.rating} size="sm" />
              <span className="text-sm text-muted-foreground">
                {feedback.rating}/5
              </span>
            </div>
            <p className="font-medium line-clamp-1">{feedback.subject}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {feedback.message}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="capitalize">
                {feedback.category}
              </Badge>
              <SentimentBadge sentiment={feedback.sentiment} />
              {feedback.ticketNumber && (
                <Badge variant="outline" className="gap-1">
                  <Ticket className="h-3 w-3" />
                  #{feedback.ticketNumber}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
        {showActions && (
          <CardFooter className="pt-0">
            <Link href={`/tenant/feedback/${feedback.id}`} className="w-full">
              <Button variant="ghost" className="w-full justify-between">
                View Details
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        )}
      </Card>
    )
  }

  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={feedback.customer.avatar} />
                <AvatarFallback>
                  {getInitials(feedback.customer.firstName, feedback.customer.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">
                  {feedback.customer.firstName} {feedback.customer.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {feedback.customer.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <RatingStars rating={feedback.rating} />
              <span className="text-sm font-medium">{feedback.rating}/5</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className={cn('capitalize', statusColors[feedback.status])}>
              {feedback.status}
            </Badge>
            <div className="flex gap-2">
              <Badge variant="outline" className="capitalize">
                {feedback.category}
              </Badge>
              <SentimentBadge sentiment={feedback.sentiment} />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold">{feedback.subject}</h4>
          <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
            {feedback.message}
          </p>
        </div>

        {feedback.reply && (
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">Admin Reply</span>
              {feedback.repliedAt && (
                <span className="text-xs text-muted-foreground">
                  {formatDate(feedback.repliedAt)}
                </span>
              )}
            </div>
            <p className="text-sm">{feedback.reply}</p>
          </div>
        )}

        {feedback.ticketNumber && (
          <div className="flex items-center gap-2 text-sm">
            <Ticket className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Related Ticket:</span>
            <Link href={`/support/tickets/${feedback.ticketId}`}>
              <span className="font-medium text-primary hover:underline">
                #{feedback.ticketNumber}
              </span>
            </Link>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="text-sm text-muted-foreground">
          Submitted {formatDate(feedback.createdAt)}
        </span>
        {showActions && (
          <Link href={`/tenant/feedback/${feedback.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}