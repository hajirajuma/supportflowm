'use client'

import { ChartContainer } from '@/components/dashboard/chart-container'

interface CustomerSatisfactionChartProps {
  data: Array<{ label: string; value: number }>
  height?: number
}

export function CustomerSatisfactionChart({
  data,
  height = 300,
}: CustomerSatisfactionChartProps) {
  return (
    <ChartContainer
      type="line"
      data={data}
      xKey="label"
      yKey="value"
      height={height}
    />
  )
}
