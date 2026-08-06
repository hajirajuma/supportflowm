import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface SatisfactionCardProps {
  title: string
  value: number
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

export function SatisfactionCard({
  title,
  value,
  change,
  trend,
  className,
}: SatisfactionCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const trendColor = trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground'

  return (
    <Card className={cn('transition-all hover:shadow-md', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold">{value}%</div>
            {change !== undefined && (
              <div className="flex items-center gap-1 text-sm">
                <TrendIcon className={cn('h-4 w-4', trendColor)} />
                <span className={trendColor}>
                  {change > 0 ? '+' : ''}{change}%
                </span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
        </div>
        <Progress value={value} className="mt-3" indicatorClassName="bg-primary" />
      </CardContent>
    </Card>
  )
}