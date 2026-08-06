import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { FeedbackSentiment } from '@/types/feedback'
import { Smile, Meh, Frown } from 'lucide-react'

interface SentimentBadgeProps {
  sentiment: FeedbackSentiment
  className?: string
}

export function SentimentBadge({ sentiment, className }: SentimentBadgeProps) {
  const config = {
    positive: {
      label: 'Positive',
      className: 'bg-success/10 text-success border-success/20',
      icon: Smile,
    },
    neutral: {
      label: 'Neutral',
      className: 'bg-warning/10 text-warning border-warning/20',
      icon: Meh,
    },
    negative: {
      label: 'Negative',
      className: 'bg-destructive/10 text-destructive border-destructive/20',
      icon: Frown,
    },
  }

  const { label, className: badgeClassName, icon: Icon } = config[sentiment]

  return (
    <Badge variant="outline" className={cn('capitalize', badgeClassName, className)}>
      <Icon className="mr-1 h-3 w-3" />
      {label}
    </Badge>
  )
}