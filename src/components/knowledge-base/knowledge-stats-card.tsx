'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface KnowledgeStatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color: string
  bg: string
  suffix?: string
}

export function KnowledgeStatsCard({
  title,
  value,
  icon: Icon,
  color,
  bg,
  suffix,
}: KnowledgeStatsCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-lg', bg)}>
          <Icon className={cn('h-6 w-6', color)} />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">
            {value}
            {suffix && (
              <span className="ml-1 text-sm font-normal text-muted-foreground">{suffix}</span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
