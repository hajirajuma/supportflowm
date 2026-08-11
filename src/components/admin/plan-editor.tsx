'use client'

import { useState } from 'react'
import { useAdmin } from '@/hooks/use-admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PlatformPlan } from '@/types/admin'
import { cn } from '@/lib/utils'

interface PlanEditorProps {
  plan?: PlatformPlan
  onSuccess?: () => void
  onCancel?: () => void
  className?: string
}

interface PlanLimits {
  users: number
  tickets: number
  storage: number
  apiCalls: number
  departments: number
  feedbackResponses: number
  knowledgeArticles: number
}

interface PlanFormState {
  name: string
  slug: string
  description: string
  priceMonthly: number
  priceYearly: number
  currency: string
  features: string
  limits: PlanLimits
  isActive: boolean
  isPopular: boolean
  trialDays: number
}

const initialLimits: PlanLimits = {
  users: 0,
  tickets: 0,
  storage: 0,
  apiCalls: 0,
  departments: 0,
  feedbackResponses: 0,
  knowledgeArticles: 0,
}

function toFormState(plan?: PlatformPlan): PlanFormState {
  if (!plan) {
    return {
      name: '',
      slug: '',
      description: '',
      priceMonthly: 0,
      priceYearly: 0,
      currency: 'USD',
      features: '',
      limits: { ...initialLimits },
      isActive: true,
      isPopular: false,
      trialDays: 0,
    }
  }
  return {
    name: plan.name,
    slug: plan.slug,
    description: plan.description,
    priceMonthly: plan.priceMonthly,
    priceYearly: plan.priceYearly,
    currency: plan.currency,
    features: plan.features.join('\n'),
    limits: { ...plan.limits },
    isActive: plan.isActive,
    isPopular: plan.isPopular,
    trialDays: plan.trialDays,
  }
}

export function PlanEditor({ plan, onSuccess, onCancel, className }: PlanEditorProps) {
  const { createPlan, updatePlan, isCreatingPlan, isUpdatingPlan } = useAdmin()
  const [form, setForm] = useState<PlanFormState>(() => toFormState(plan))

  const isSubmitting = isCreatingPlan || isUpdatingPlan

  const updateField = <K extends keyof PlanFormState>(key: K, value: PlanFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const updateLimit = (key: keyof PlanLimits, value: number) => {
    setForm((prev) => ({
      ...prev,
      limits: { ...prev.limits, [key]: value },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || form.name.toLowerCase().replace(/\s+/g, '-'),
      description: form.description.trim(),
      priceMonthly: form.priceMonthly,
      priceYearly: form.priceYearly,
      currency: form.currency,
      features: form.features
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean),
      limits: form.limits,
      isActive: form.isActive,
      isPopular: form.isPopular,
      trialDays: form.trialDays,
    }

    if (plan) {
      updatePlan(
        { id: plan.id, data: payload },
        { onSuccess: () => onSuccess?.() }
      )
    } else {
      createPlan(payload, { onSuccess: () => onSuccess?.() })
    }
  }

  const limitFields: { key: keyof PlanLimits; label: string }[] = [
    { key: 'users', label: 'Users' },
    { key: 'tickets', label: 'Tickets' },
    { key: 'storage', label: 'Storage (GB)' },
    { key: 'apiCalls', label: 'API Calls' },
    { key: 'departments', label: 'Departments' },
    { key: 'feedbackResponses', label: 'Feedback Responses' },
    { key: 'knowledgeArticles', label: 'Knowledge Articles' },
  ]

  return (
    <form onSubmit={handleSubmit}>
      <Card className={cn('border-0 shadow-none', className)}>
        <CardHeader>
          <CardTitle>{plan ? 'Edit Plan' : 'Create Plan'}</CardTitle>
          <CardDescription>
            {plan
              ? 'Update the details of this subscription plan.'
              : 'Create a new subscription plan for the platform.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="plan-name">Name</Label>
              <Input
                id="plan-name"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Pro Plan"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-slug">Slug</Label>
              <Input
                id="plan-slug"
                value={form.slug}
                onChange={(e) => updateField('slug', e.target.value)}
                placeholder="pro"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan-description">Description</Label>
            <Textarea
              id="plan-description"
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Short description of the plan"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="plan-price-monthly">Monthly Price</Label>
              <Input
                id="plan-price-monthly"
                type="number"
                min={0}
                step={0.01}
                value={form.priceMonthly}
                onChange={(e) => updateField('priceMonthly', Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-price-yearly">Yearly Price</Label>
              <Input
                id="plan-price-yearly"
                type="number"
                min={0}
                step={0.01}
                value={form.priceYearly}
                onChange={(e) => updateField('priceYearly', Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-currency">Currency</Label>
              <Input
                id="plan-currency"
                value={form.currency}
                onChange={(e) => updateField('currency', e.target.value.toUpperCase())}
                placeholder="USD"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan-features">Features (one per line)</Label>
            <Textarea
              id="plan-features"
              value={form.features}
              onChange={(e) => updateField('features', e.target.value)}
              placeholder="Unlimited tickets&#10;Priority support"
              rows={4}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {limitFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={`plan-limit-${field.key}`}>{field.label}</Label>
                <Input
                  id={`plan-limit-${field.key}`}
                  type="number"
                  min={0}
                  value={form.limits[field.key]}
                  onChange={(e) => updateLimit(field.key, Number(e.target.value))}
                />
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-3">
              <Label htmlFor="plan-active">Active</Label>
              <Switch
                id="plan-active"
                checked={form.isActive}
                onCheckedChange={(checked) => updateField('isActive', checked)}
              />
            </div>
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-3">
              <Label htmlFor="plan-popular">Popular</Label>
              <Switch
                id="plan-popular"
                checked={form.isPopular}
                onCheckedChange={(checked) => updateField('isPopular', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-trial">Trial (days)</Label>
              <Input
                id="plan-trial"
                type="number"
                min={0}
                value={form.trialDays}
                onChange={(e) => updateField('trialDays', Number(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {plan ? 'Update Plan' : 'Create Plan'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
