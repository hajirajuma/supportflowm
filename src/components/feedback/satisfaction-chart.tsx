'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { cn } from '@/lib/utils'

interface DataPoint {
  date: string
  count: number
  averageRating?: number
}

interface SatisfactionChartProps {
  data: DataPoint[]
  type?: 'trend' | 'volume'
  className?: string
}

export function SatisfactionChart({ data, type = 'trend', className }: SatisfactionChartProps) {
  const formatDate = (date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-3 shadow-md">
          <p className="font-medium">{formatDate(label)}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} className="text-sm text-muted-foreground">
              {item.name}: {typeof item.value === 'number' ? item.value.toFixed(1) : item.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (type === 'trend') {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Satisfaction Trend</CardTitle>
          <CardDescription>Average rating over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF7A00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  className="text-xs"
                />
                <YAxis
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                  className="text-xs"
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="averageRating"
                  stroke="#FF7A00"
                  fill="url(#ratingGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Feedback Volume</CardTitle>
        <CardDescription>Number of feedback submissions over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                className="text-xs"
              />
              <YAxis className="text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#FF7A00" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}