'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Sparkles } from 'lucide-react'

interface HelpCenterHeroProps {
  title: string
  subtitle: string
  searchValue: string
  onSearchChange: (value: string) => void
  onSearchSubmit: (query: string) => void
}

export function HelpCenterHero({
  title,
  subtitle,
  searchValue,
  onSearchChange,
  onSearchSubmit,
}: HelpCenterHeroProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearchSubmit(searchValue)
  }

  return (
    <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
      <div className="container max-w-4xl text-center">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-lg text-muted-foreground mb-8">{subtitle}</p>

        <form onSubmit={handleSubmit} className="relative mx-auto max-w-2xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search for answers..."
            className="h-12 rounded-full pl-12 pr-32"
          />
          <Button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-6"
          >
            Search
          </Button>
        </form>
      </div>
    </section>
  )
}
