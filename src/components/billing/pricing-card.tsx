'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plan, BillingInterval } from '@/types/billing'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'

interface PricingCardProps {
  plan: Plan
  interval: BillingInterval
  isAuthenticated: boolean
}

export function PricingCard({ plan, interval, isAuthenticated }: PricingCardProps) {
  const router = useRouter()
  const price = interval === 'monthly' ? plan.priceMonthly : plan.priceYearly
  const isFree = price === 0

  const handleSubscribe = () => {
    if (isFree) {
      // Handle free plan signup
      router.push('/billing/subscribe?plan=free')
    } else if (isAuthenticated) {
      router.push(`/checkout/${plan.id}?interval=${interval}`)
    } else {
      router.push(`/auth/login?redirect=/checkout/${plan.id}?interval=${interval}`)
    }
  }

  return (
    <Card
      className={cn(
        'relative flex flex-col transition-all hover:shadow-lg',
        plan.isPopular && 'border-primary shadow-md'
      )}
    >
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground">
            <Sparkles className="mr-1 h-3 w-3" />
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-4xl font-bold">
            {isFree ? 'Free' : formatCurrency(price, plan.currency)}
          </span>
          {!isFree && (
            <span className="text-sm text-muted-foreground">
              /{interval}
            </span>
          )}
        </div>
        {plan.trialDays > 0 && !isFree && (
          <p className="text-sm text-muted-foreground">
            {plan.trialDays}-day free trial
          </p>
        )}
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-3">
          {plan.features.map((feature) => (
            <div key={feature} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2 border-t pt-4">
          <p className="text-sm font-medium">Limits</p>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Tickets</span>
              <span>{plan.limits.tickets}</span>
            </div>
            <div className="flex justify-between">
              <span>Agents</span>
              <span>{plan.limits.agents}</span>
            </div>
            <div className="flex justify-between">
              <span>Customers</span>
              <span>{plan.limits.customers}</span>
            </div>
            <div className="flex justify-between">
              <span>Storage</span>
              <span>{plan.limits.storage} GB</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleSubscribe}
          className="w-full"
          variant={plan.isPopular ? 'default' : 'outline'}
        >
          {isFree ? 'Get Started' : 'Subscribe Now'}
        </Button>
      </CardFooter>
    </Card>
  )
}