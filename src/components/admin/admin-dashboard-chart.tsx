'use client'

import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { PlatformStats } from '@/types/admin'
import { cn } from '@/lib/utils'

type GrowthDatum = PlatformStats['growthData'][number]

interface AdminDashboardChartProps {
  data: GrowthDatum[]
  type?: 'area' | 'line' | 'bar'
  height?: number
  className?: string
}

const series = [
  { key: 'organizations', name: 'Organizations', color: '#FF7A00' },
  { key: 'users', name: 'Users', color: '#003366' },
  { key: 'revenue', name: 'Revenue', color: '#16A34A' },
]

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-3 shadow-md">
        <p className="font-medium">{label}</p>
        {payload.map((item: any, index: number) => (
          <p key={index} className="text-sm text-muted-foreground">
            {item.name}: {item.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function AdminDashboardChart({
  data,
  type = 'area',
  height = 300,
  className,
}: AdminDashboardChartProps) {
  const commonProps = {
    data,
    margin: { top: 10, right: 10, left: 0, bottom: 0 },
  }

  const renderChart = () => {
    if (type === 'bar') {
      return (
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip content={<CustomTooltip />} />
          {series.map((s) => (
            <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      )
    }

    if (type === 'line') {
      return (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip content={<CustomTooltip />} />
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={2}
              dot={{ fill: s.color, r: 3 }}
            />
          ))}
        </LineChart>
      )
    }

    return (
      <AreaChart {...commonProps}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`gradient-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={s.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="date" className="text-xs" />
        <YAxis className="text-xs" />
        <Tooltip content={<CustomTooltip />} />
        {series.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={s.color}
            fill={`url(#gradient-${s.key})`}
            strokeWidth={2}
          />
        ))}
      </AreaChart>
    )
  }

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  )
}
