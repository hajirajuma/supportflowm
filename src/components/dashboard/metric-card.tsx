'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color: string
  bg: string
  suffix?: string
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  className?: string
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  color,
  bg,
  suffix,
  trend,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn('transition-all hover:shadow-md', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">
              {value}
              {suffix && <span className="text-sm font-normal text-muted-foreground">{suffix}</span>}
            </p>
            {trend && (
              <p className={cn(
                'text-xs font-medium',
                trend.direction === 'up' ? 'text-success' : 'text-destructive'
              )}>
                {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
              </p>
            )}
          </div>
          <div className={cn('rounded-full p-2', bg)}>
            <Icon className={cn('h-4 w-4', color)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}