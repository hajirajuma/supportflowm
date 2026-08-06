'use client'

import { ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface AnalyticsCardProps {
  title: string
  description?: string
  className?: string
  children: ReactNode
}

export function AnalyticsCard({
  title,
  description,
  className,
  children,
}: AnalyticsCardProps) {
  return (
    <Card className={cn('transition-all hover:shadow-md', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
