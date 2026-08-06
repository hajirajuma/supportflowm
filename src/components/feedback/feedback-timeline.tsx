'use client'

import { cn } from '@/lib/utils'
import { formatDateTime } from '@/lib/utils'
import { Clock } from 'lucide-react'

export interface FeedbackTimelineEvent {
  id: string
  type: 'created' | 'reviewed' | 'replied' | 'converted' | 'status_changed'
  description: string
  userName?: string
  createdAt: string
}

interface FeedbackTimelineProps {
  events: FeedbackTimelineEvent[]
  className?: string
}

export function FeedbackTimeline({ events, className }: FeedbackTimelineProps) {
  if (events.length === 0) {
    return (
      <div className={cn('flex items-center justify-center py-8', className)}>
        <p className="text-sm text-muted-foreground">No timeline events</p>
      </div>
    )
  }

  return (
    <ol className={cn('space-y-4', className)}>
      {events.map((event) => (
        <li key={event.id} className="relative flex gap-3 pl-6">
          <span
            className={cn(
              'absolute left-0 top-1 h-2.5 w-2.5 rounded-full',
              event.type === 'converted' ? 'bg-primary' : 'bg-muted-foreground/50'
            )}
          />
          <div className="flex-1">
            <p className="text-sm font-medium">{event.description}</p>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
              {event.userName && <span>{event.userName}</span>}
              <Clock className="h-3 w-3" />
              <span>{formatDateTime(event.createdAt)}</span>
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}
