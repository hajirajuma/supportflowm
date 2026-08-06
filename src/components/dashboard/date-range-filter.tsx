'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DateRange } from '@/types/dashboard'

interface DateRangeFilterProps {
  value?: DateRange
  onChange: (range: DateRange) => void
}

const presets: { value: DateRange; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Last 7 days' },
  { value: 'month', label: 'Last 30 days' },
  { value: 'quarter', label: 'Last 90 days' },
  { value: 'year', label: 'Last 12 months' },
  { value: 'all', label: 'All time' },
]

export function DateRangeFilter({ value = 'month', onChange }: DateRangeFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <Select value={value} onValueChange={(range) => onChange(range as DateRange)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          {presets.map((preset) => (
            <SelectItem key={preset.value} value={preset.value}>
              {preset.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange(value === 'today' ? 'month' : 'today')}
      >
        {value === 'today' ? 'This month' : 'Today'}
      </Button>
    </div>
  )
}
