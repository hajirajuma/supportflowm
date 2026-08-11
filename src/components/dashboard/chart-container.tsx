'use client'

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { cn } from '@/lib/utils'
import { ChartType } from '@/types/dashboard'

interface ChartContainerProps {
  type: ChartType
  data: Array<{ label: string; value: number; [key: string]: any }>
  xKey: string
  yKey: string
  height?: number
  className?: string
  colors?: string[]
}

export function ChartContainer({
  type,
  data,
  xKey,
  yKey,
  height = 300,
  className,
  colors = ['#FF7A00', '#003366', '#16A34A', '#FACC15', '#DC2626', '#8B5CF6'],
}: ChartContainerProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
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

  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF7A00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey={xKey} className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={yKey}
              stroke="#FF7A00"
              fill="url(#areaGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        )

      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey={xKey} className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={yKey} fill="#FF7A00" radius={[4, 4, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        )

      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey={xKey} className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey={yKey}
              stroke="#FF7A00"
              strokeWidth={2}
              dot={{ fill: '#FF7A00' }}
            />
          </LineChart>
        )

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey={yKey}
              nameKey={xKey}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        )

      case 'doughnut':
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey={yKey}
              nameKey={xKey}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        )

      default:
        return null
    }
  }

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  )
}