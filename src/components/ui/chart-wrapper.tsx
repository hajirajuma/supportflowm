'use client'

import { ReactNode } from 'react'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ChartWrapperProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function ChartWrapper({ title, description, children, className }: ChartWrapperProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

interface AreaChartProps {
  data: any[]
  xKey: string
  yKey: string
  fill?: string
  stroke?: string
}

export function CustomAreaChart({ data, xKey, yKey, fill = '#FF7A00', stroke = '#FF7A00' }: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey={yKey} fill={fill} stroke={stroke} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function CustomBarChart({ data, xKey, yKey, fill = '#FF7A00' }: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Bar dataKey={yKey} fill={fill} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function CustomLineChart({ data, xKey, yKey, stroke = '#FF7A00' }: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={yKey} stroke={stroke} />
      </LineChart>
    </ResponsiveContainer>
  )
}

interface PieChartProps {
  data: Array<{ name: string; value: number }>
  colors?: string[]
}

export function CustomPieChart({ data, colors = ['#FF7A00', '#003366', '#16A34A', '#FACC15', '#DC2626'] }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}