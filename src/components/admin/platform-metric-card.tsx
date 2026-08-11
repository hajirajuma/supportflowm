'use client'

import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface PlatformMetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color?: string
  bg?: string
  trend?: string
  subtitle?: string
  className?: string
}

export function PlatformMetricCard({
  title,
  value,
  icon: Icon,
  color = 'text-primary',
  bg = 'bg-primary/10',
  trend,
  subtitle,
  className,
}: PlatformMetricCardProps) {
  return (
    <Card className={cn('transition-all hover:shadow-md', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && <p className="text-xs text-muted-foreground">{trend}</p>}
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className={cn('rounded-full p-2.5', bg)}>
            <Icon className={cn('h-5 w-5', color)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
