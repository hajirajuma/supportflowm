'use client'

import { useState } from 'react'
import { useBilling } from '@/hooks/use-billing'
import { useAuth } from '@/hooks/use-auth'
import { PricingCard } from '@/components/billing/pricing-card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Check, Building2 } from 'lucide-react'

export default function PricingPage() {
  const { isAuthenticated } = useAuth()
  const { plans, isLoadingPlans } = useBilling()
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly')

  if (isLoadingPlans) {
    return <PricingSkeleton />
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No plans available</h3>
          <p className="text-muted-foreground">
            Please check back later for available plans.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose the plan that's right for your organization
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <Label
          htmlFor="billing-toggle"
          className={cn(
            'text-sm font-medium',
            billingInterval === 'monthly' ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          Monthly
        </Label>
        <Switch
          id="billing-toggle"
          checked={billingInterval === 'yearly'}
          onCheckedChange={(checked) =>
            setBillingInterval(checked ? 'yearly' : 'monthly')
          }
        />
        <Label
          htmlFor="billing-toggle"
          className={cn(
            'text-sm font-medium',
            billingInterval === 'yearly' ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          Yearly
          <span className="ml-1.5 rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">
            Save 20%
          </span>
        </Label>
      </div>

      {/* Pricing Cards */}
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            interval={billingInterval}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
        <div className="mt-8 grid gap-6 text-left md:grid-cols-2">
          <div>
            <h3 className="font-medium">What payment methods do you accept?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We accept all major credit cards, PayPal, and mobile money via infi-pay and PayChangu.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Can I change my plan later?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Is there a free trial?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Yes, all paid plans come with a 14-day free trial. No credit card required.
            </p>
          </div>
          <div>
            <h3 className="font-medium">What happens when I exceed my limits?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You'll receive notifications when you're approaching your limits. You can upgrade your plan at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function PricingSkeleton() {
  return (
    <div className="container max-w-6xl py-16">
      <div className="text-center">
        <Skeleton className="mx-auto h-12 w-64" />
        <Skeleton className="mx-auto mt-4 h-6 w-96" />
      </div>
      <div className="mt-8 flex justify-center">
        <Skeleton className="h-10 w-48" />
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4 rounded-lg border p-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-4 w-48" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}