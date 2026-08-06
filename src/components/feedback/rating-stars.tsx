'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
  rating: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
  className?: string
}

export function RatingStars({
  rating,
  max = 5,
  size = 'md',
  interactive = false,
  onChange,
  className,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value)
    }
  }

  return (
    <div className={cn('flex gap-0.5', className)}>
      {Array.from({ length: max }, (_, i) => {
        const value = i + 1
        const filled = value <= rating
        return (
          <button
            key={i}
            type="button"
            onClick={() => handleClick(value)}
            className={cn(
              interactive && 'cursor-pointer hover:scale-110 transition-transform',
              !interactive && 'cursor-default'
            )}
            disabled={!interactive}
            aria-label={`Rate ${value} stars`}
          >
            <Star
              className={cn(
                sizeClasses[size],
                filled
                  ? 'fill-primary text-primary'
                  : 'fill-muted text-muted-foreground',
                'transition-colors'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}