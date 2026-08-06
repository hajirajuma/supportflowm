'use client'

import { ChartContainer } from '@/components/dashboard/chart-container'

interface TicketChartProps {
  data: Array<{ label: string; value: number }>
  height?: number
}

export function TicketChart({ data, height = 300 }: TicketChartProps) {
  return (
    <ChartContainer
      type="area"
      data={data}
      xKey="label"
      yKey="value"
      height={height}
    />
  )
}
