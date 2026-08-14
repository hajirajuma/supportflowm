'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PlatformPlan } from '@/types/admin'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { CheckCircle, Pencil, Star, Trash2 } from 'lucide-react'

interface PlanCardProps {
  plan: PlatformPlan
  onEdit?: (plan: PlatformPlan) => void
  onDelete?: (plan: PlatformPlan) => void
  isDeleting?: boolean
  className?: string
}

export function PlanCard({ plan, onEdit, onDelete, isDeleting, className }: PlanCardProps) {
  return (
    <Card
      className={cn(
        'relative flex flex-col transition-all hover:shadow-md',
        plan.isPopular && 'border-primary/50',
        className
      )}
    >
      {plan.isPopular && (
        <div className="absolute right-4 top-4">
          <Badge variant="warning">
            <Star className="mr-1 h-3 w-3" />
            Popular
          </Badge>
        </div>
      )}
      <CardContent className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="text-lg font-semibold">{plan.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
        </div>

        <div className="space-y-1">
          <p className="text-3xl font-bold">
            {formatCurrency(plan.priceMonthly, plan.currency)}
            <span className="text-sm font-normal text-muted-foreground">/month</span>
          </p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(plan.priceYearly, plan.currency)}/year
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={plan.isActive ? 'success' : 'outline'}
            className="capitalize"
          >
            {plan.isActive ? 'Active' : 'Inactive'}
          </Badge>
          {plan.trialDays > 0 && (
            <Badge variant="secondary">{plan.trialDays}-day trial</Badge>
          )}
        </div>

        <ul className="flex-1 space-y-2">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onEdit(plan)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(plan)}
              disabled={isDeleting}
              aria-label={`Delete ${plan.name} plan`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
