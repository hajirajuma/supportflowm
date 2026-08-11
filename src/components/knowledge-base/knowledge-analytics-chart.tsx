'use client'

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type ChartDatum = Record<string, string | number>

interface KnowledgeAnalyticsChartProps {
  title: string
  description?: string
  data: ChartDatum[]
  type?: 'area' | 'bar' | 'line'
  className?: string
}

export function KnowledgeAnalyticsChart({
  title,
  description,
  data,
  type = 'area',
  className,
}: KnowledgeAnalyticsChartProps) {
  const first = data[0]
  const xKey = first && 'date' in first ? 'date' : first && 'label' in first ? 'label' : 'name'
  const yKey = first && 'views' in first ? 'views' : 'value'

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey={xKey} className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
            <Bar dataKey={yKey} fill="#FF7A00" radius={[4, 4, 0, 0]} />
          </BarChart>
        )

      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey={xKey} className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
            <Line type="monotone" dataKey={yKey} stroke="#FF7A00" strokeWidth={2} dot={false} />
          </LineChart>
        )

      case 'area':
      default:
        return (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="knowledgeAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF7A00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey={xKey} className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey={yKey}
              stroke="#FF7A00"
              fill="url(#knowledgeAreaGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        )
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
