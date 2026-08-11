'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, ArrowRight, HelpCircle, Shield, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small teams and startups',
    priceMonthly: 29,
    priceYearly: 23,
    users: 5,
    storage: '10GB',
    tickets: '100/month',
    features: [
      'Basic ticket management',
      'Customer portal',
      'Email notifications',
      'Basic analytics',
      'Email support',
      'Knowledge base (50 articles)',
      '1 organization',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For growing businesses',
    priceMonthly: 79,
    priceYearly: 63,
    users: 20,
    storage: '50GB',
    tickets: 'Unlimited',
    features: [
      'Advanced ticket management',
      'Custom fields and workflows',
      'Multi-channel support',
      'Advanced analytics',
      'Priority support',
      'Knowledge base (500 articles)',
      'Team collaboration tools',
      'API access',
      '1 organization',
    ],
    isPopular: true,
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For large organizations',
    priceMonthly: 199,
    priceYearly: 159,
    users: 'Unlimited',
    storage: '100GB',
    tickets: 'Unlimited',
    features: [
      'Everything in Professional',
      'Custom reports',
      'SLA management',
      'Advanced security',
      '24/7 premium support',
      'Unlimited knowledge base',
      'Multiple organizations',
      'White-label branding',
      'Custom integrations',
      'Dedicated account manager',
    ],
  },
]

const enterpriseFeatures = [
  'Custom contract and pricing',
  'Dedicated support team',
  'Custom integrations and development',
  'Advanced security and compliance',
  'Multi-region deployment',
  '99.99% SLA guarantee',
  'Enterprise-grade SSO',
  'Advanced audit logs',
  'Custom reporting',
  'Training and onboarding',
]

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary">Pricing</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl font-poppins">
            Simple, Transparent{' '}
            <span className="text-primary">Pricing</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect plan for your business needs. All plans include 
            a 14-day free trial, no credit card required.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <Label
              htmlFor="billing-toggle"
              className={cn(
                'text-sm font-medium',
                !isAnnual ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <Label
              htmlFor="billing-toggle"
              className={cn(
                'text-sm font-medium',
                isAnnual ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              Annual
              <span className="ml-2 rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">
                Save 20%
              </span>
            </Label>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
<div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto md:items-stretch">
            {plans.map((plan, index) => {
              const price = isAnnual ? plan.priceYearly : plan.priceMonthly
              const savings = isAnnual ? Math.round((1 - plan.priceYearly / plan.priceMonthly) * 100) : 0

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={cn(
                    'relative flex flex-col rounded-2xl border bg-card p-8',
                    plan.isPopular
                      ? 'border-primary shadow-xl'
                      : 'border-border'
                  )}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-white shadow-sm">Most Popular</Badge>
                    </div>
                  )}

                  <div>
                    <h3 className="text-2xl font-bold font-poppins text-center">
                      {plan.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground text-center">
                      {plan.description}
                    </p>

                    <div className="mt-6 flex items-baseline justify-center">
                      <span className="text-5xl font-bold font-poppins">
                        <span className="align-top text-2xl text-muted-foreground">$</span>
                        {price}
                      </span>
                      <span className="ml-1 text-sm text-muted-foreground">/month</span>
                    </div>
                    {isAnnual && savings > 0 && (
                      <p className="mt-2 text-center text-sm font-medium text-success">
                        Save {savings}% with annual billing
                      </p>
                    )}
                  </div>

                  <div className="mt-8 rounded-xl border bg-muted/40 p-4">
                    <div className="flex justify-between py-1.5">
                      <span className="text-muted-foreground">Users</span>
                      <span className="font-medium">{plan.users}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-muted-foreground">Storage</span>
                      <span className="font-medium">{plan.storage}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-muted-foreground">Tickets</span>
                      <span className="font-medium">{plan.tickets}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex-1">
                    <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      What&apos;s included
                    </h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <Check className="mt-0.5 h-4 w-4 text-success flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href="/signup" className="mt-8">
                    <Button
                      className={cn(
                        'w-full',
                        plan.isPopular
                          ? 'bg-primary hover:bg-primary/90'
                          : 'bg-secondary hover:bg-secondary/90'
                      )}
                    >
                      Start Free Trial
                    </Button>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary">Enterprise</Badge>
              <h2 className="text-3xl font-bold tracking-tight font-poppins">
                Enterprise-Grade Support Solutions
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Custom solutions for large organizations with complex needs
              </p>
            </div>

            <Card className="border-primary/20">
              <CardContent className="p-8">
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">What's Included</h3>
                    <ul className="space-y-3">
                      {enterpriseFeatures.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <Check className="mt-0.5 h-4 w-4 text-primary flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col justify-center items-center p-6 bg-primary/5 rounded-xl">
                    <Shield className="h-12 w-12 text-primary mb-4" />
                    <h4 className="text-lg font-semibold mb-2">Need a Custom Quote?</h4>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Contact our sales team for a personalized enterprise solution
                    </p>
                    <Link href="/contact">
                      <Button className="bg-primary hover:bg-primary/90">
                        Contact Sales
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            <span>Secure payments powered by</span>
            <span className="font-semibold text-foreground">PayChangu</span>
            <span>•</span>
            <span>Accept all major cards</span>
            <span>•</span>
            <span>14-day money-back guarantee</span>
          </div>
        </div>
      </section>
    </div>
  )
}