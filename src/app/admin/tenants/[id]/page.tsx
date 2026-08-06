'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useAdmin } from '@/hooks/use-admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Building2,
  Mail,
  Calendar,
  Users,
  Ticket,
  Database,
  CreditCard,
  ArrowLeft,
  Edit,
  MoreVertical,
  Activity,
} from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function TenantDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { useTenant } = useAdmin()
  const { data: tenant, isLoading } = useTenant(id)

  if (isLoading) {
    return <TenantDetailSkeleton />
  }

  if (!tenant) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Tenant not found</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-success/10 text-success',
      suspended: 'bg-destructive/10 text-destructive',
      pending: 'bg-warning/10 text-warning',
      inactive: 'bg-muted text-muted-foreground',
    }
    return colors[status as keyof typeof colors] || 'bg-muted text-muted-foreground'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/tenants">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{tenant.name}</h1>
          <p className="text-muted-foreground">
            {tenant.subdomain}.supportflow.com
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge className={cn('capitalize', getStatusColor(tenant.status))}>
            {tenant.status}
          </Badge>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Organization Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Organization Information</CardTitle>
            <CardDescription>
              Details about the organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Organization</p>
                <p className="font-semibold">{tenant.name}</p>
                <p className="text-sm text-muted-foreground">
                  {tenant.subdomain}.supportflow.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-full bg-secondary/10 p-3">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Owner</p>
                <p className="font-semibold">
                  {tenant.owner.firstName} {tenant.owner.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {tenant.owner.email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Registered</p>
                <p className="font-semibold">{formatDate(tenant.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Info */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>
              Current plan and billing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Plan</p>
              <p className="text-xl font-bold">{tenant.plan}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge
                variant="outline"
                className={cn('capitalize', {
                  'bg-success/10 text-success': tenant.subscription.status === 'active',
                  'bg-warning/10 text-warning': tenant.subscription.status === 'trialing',
                  'bg-destructive/10 text-destructive': tenant.subscription.status === 'past_due',
                  'bg-muted text-muted-foreground': tenant.subscription.status === 'canceled',
                })}
              >
                {tenant.subscription.status}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="text-xl font-bold">
                {formatCurrency(tenant.subscription.amount, tenant.subscription.currency)}
                <span className="text-sm font-normal text-muted-foreground">
                  /{tenant.subscription.interval}
                </span>
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Renewal Date</p>
              <p className="font-medium">
                {formatDate(tenant.subscription.currentPeriodEnd)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Users</p>
                <p className="text-2xl font-bold">{tenant.users}</p>
              </div>
              <div className="rounded-full bg-primary/10 p-2">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tickets</p>
                <p className="text-2xl font-bold">{tenant.tickets}</p>
              </div>
              <div className="rounded-full bg-primary/10 p-2">
                <Ticket className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Storage</p>
                <p className="text-2xl font-bold">
                  {(tenant.storageUsed / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
              <div className="rounded-full bg-primary/10 p-2">
                <Database className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Storage Limit</p>
                <p className="text-2xl font-bold">
                  {(tenant.storageLimit / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
              <div className="rounded-full bg-success/10 p-2">
                <Activity className="h-4 w-4 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function TenantDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-24" />
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Skeleton className="h-64 w-full md:col-span-2" />
        <Skeleton className="h-64 w-full" />
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  )
}