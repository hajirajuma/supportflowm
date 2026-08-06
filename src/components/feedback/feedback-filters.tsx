'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X } from 'lucide-react'
import {
  FeedbackFilters as FeedbackFiltersType,
  FeedbackRating,
  FeedbackCategory,
  FeedbackSentiment,
  FeedbackStatus,
} from '@/types/feedback'

interface FeedbackFiltersProps {
  onFilterChange: (filters: FeedbackFiltersType) => void
}

const ratings: FeedbackRating[] = [5, 4, 3, 2, 1]
const categories: FeedbackCategory[] = [
  'product',
  'service',
  'support',
  'billing',
  'feature',
  'general',
]
const sentiments: FeedbackSentiment[] = ['positive', 'neutral', 'negative']
const statuses: FeedbackStatus[] = ['pending', 'reviewed', 'replied', 'converted']

export function FeedbackFilters({ onFilterChange }: FeedbackFiltersProps) {
  const [filters, setFilters] = useState<FeedbackFiltersType>({})

  const updateFilters = (next: Partial<FeedbackFiltersType>) => {
    const updated = { ...filters, ...next }
    setFilters(updated)
    onFilterChange(updated)
  }

  const clearFilters = () => {
    setFilters({})
    onFilterChange({})
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search feedback..."
          className="w-48 pl-8"
          value={filters.search || ''}
          onChange={(e) => updateFilters({ search: e.target.value })}
        />
      </div>

      <Select
        value={filters.rating?.[0]?.toString() || 'all'}
        onValueChange={(value) =>
          updateFilters({
            rating: value === 'all' ? undefined : [Number(value) as FeedbackRating],
          })
        }
      >
        <SelectTrigger className="w-28">
          <SelectValue placeholder="Rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Ratings</SelectItem>
          {ratings.map((rating) => (
            <SelectItem key={rating} value={rating.toString()}>
              {rating} star{rating > 1 ? 's' : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.category?.[0] || 'all'}
        onValueChange={(value) =>
          updateFilters({
            category: value === 'all' ? undefined : [value as FeedbackCategory],
          })
        }
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.sentiment?.[0] || 'all'}
        onValueChange={(value) =>
          updateFilters({
            sentiment: value === 'all' ? undefined : [value as FeedbackSentiment],
          })
        }
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Sentiment" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sentiment</SelectItem>
          {sentiments.map((sentiment) => (
            <SelectItem key={sentiment} value={sentiment}>
              {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status?.[0] || 'all'}
        onValueChange={(value) =>
          updateFilters({
            status: value === 'all' ? undefined : [value as FeedbackStatus],
          })
        }
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {statuses.map((status) => (
            <SelectItem key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {(filters.search ||
        filters.rating ||
        filters.category ||
        filters.sentiment ||
        filters.status) && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="mr-1 h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  )
}
