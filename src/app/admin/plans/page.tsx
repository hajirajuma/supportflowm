'use client'

import { useState } from 'react'
import { useAdmin } from '@/hooks/use-admin'
import { PlanCard } from '@/components/admin/plan-card'
import { PlanEditor } from '@/components/admin/plan-editor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, TrendingUp } from 'lucide-react'

export default function PlansPage() {
  const { plans, isLoadingPlans } = useAdmin()
  const [editingPlan, setEditingPlan] = useState<any>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  if (isLoadingPlans) {
    return <PlansSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Plan Management</h1>
          <p className="text-muted-foreground">
            Manage subscription plans and pricing
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <PlanEditor
              onSuccess={() => setIsCreateOpen(false)}
              onCancel={() => setIsCreateOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans?.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onEdit={() => {
              setEditingPlan(plan)
              setIsEditOpen(true)
            }}
          />
        ))}
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-3xl">
          {editingPlan && (
            <PlanEditor
              plan={editingPlan}
              onSuccess={() => {
                setIsEditOpen(false)
                setEditingPlan(null)
              }}
              onCancel={() => {
                setIsEditOpen(false)
                setEditingPlan(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PlansSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-96 w-full" />
        ))}
      </div>
    </div>
  )
}