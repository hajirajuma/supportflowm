'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DistributionItem {
  rating: number
  count: number
  percentage: number
}

interface RatingDistributionChartProps {
  data: DistributionItem[]
  total: number
  className?: string
}

export function RatingDistributionChart({ data, total, className }: RatingDistributionChartProps) {
  const getRatingColor = (rating: number) => {
    const colors = {
      5: 'text-success',
      4: 'text-primary',
      3: 'text-warning',
      2: 'text-warning/70',
      1: 'text-destructive',
    }
    return colors[rating as keyof typeof colors] || 'text-muted-foreground'
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Rating Distribution</CardTitle>
        <CardDescription>Breakdown of feedback ratings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.sort((a, b) => b.rating - a.rating).map((item) => (
            <div key={item.rating} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-4 w-4',
                          i < item.rating
                            ? 'fill-primary text-primary'
                            : 'fill-muted text-muted-foreground'
                        )}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{item.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{item.count}</span>
                  <span className="text-sm font-medium">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              <Progress
                value={item.percentage}
                className="h-2"
                indicatorClassName={cn(
                  'transition-all',
                  item.rating >= 4 && 'bg-success',
                  item.rating === 3 && 'bg-warning',
                  item.rating <= 2 && 'bg-destructive'
                )}
              />
            </div>
          ))}
          <div className="pt-2 text-sm text-muted-foreground">
            Total: {total} feedback submissions
          </div>
        </div>
      </CardContent>
    </Card>
  )
}