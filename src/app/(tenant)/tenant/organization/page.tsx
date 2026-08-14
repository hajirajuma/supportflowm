'use client'

import { useOrganization } from '@/hooks/use-organization'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  Users,
  Headphones,
  UserCircle,
  Layers,
  HardDrive,
  Clock,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

export default function OrganizationOverviewPage() {
  const { organization, stats, isLoadingOrg, isLoadingStats } = useOrganization()

  if (isLoadingOrg || isLoadingStats) {
    return <OrganizationOverviewSkeleton />
  }

  if (!organization || !stats) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">No organization data available</p>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: UserCircle,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      title: 'Customers',
      value: stats.customers,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Support Agents',
      value: stats.supportAgents,
      icon: Headphones,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
    {
      title: 'Departments',
      value: stats.departments,
      icon: Layers,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      title: 'Storage Used',
      value: `${(stats.storageUsed / 1024 / 1024).toFixed(1)} MB`,
      icon: HardDrive,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
  ]

  const ticketStats = [
    {
      label: 'Open',
      value: stats.openTickets,
      color: 'text-blue-500',
    },
    {
      label: 'Pending',
      value: stats.pendingTickets,
      color: 'text-warning',
    },
    {
      label: 'Resolved',
      value: stats.resolvedTickets,
      color: 'text-success',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organization Overview</h1>
          <p className="text-muted-foreground">
            Manage and monitor your organization
          </p>
        </div>
        <Badge
          variant={organization.status === 'active' ? 'success' : 'destructive'}
          className="w-fit"
        >
          {organization.status === 'active' ? (
            <CheckCircle className="mr-1 h-3 w-3" />
          ) : (
            <XCircle className="mr-1 h-3 w-3" />
          )}
          {organization.status}
        </Badge>
      </div>

      {/* Organization Info */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Information</CardTitle>
          <CardDescription>
            Details about your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-semibold">{organization.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Slug</p>
                <p className="font-semibold">{organization.slug}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="font-semibold capitalize">{organization.plan}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={cn('rounded-full p-2', stat.bg)}>
                  <stat.icon className={cn('h-4 w-4', stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ticket Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ticket Overview</CardTitle>
            <CardDescription>
              Current ticket distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {ticketStats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className={cn('text-2xl font-bold', stat.color)}>
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Total Tickets</span>
                  <span className="font-semibold">{stats.totalTickets}</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${(stats.totalTickets / (stats.totalTickets + 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions in your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  No recent activity
                </p>
              ) : (
                stats.recentActivity.slice(0, 5).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 border-b pb-3 last:border-0"
                  >
                    <div className="rounded-full bg-primary/10 p-2">
                      {activity.type === 'member_joined' && (
                        <Users className="h-4 w-4 text-primary" />
                      )}
                      {activity.type === 'ticket_created' && (
                        <AlertCircle className="h-4 w-4 text-primary" />
                      )}
                      {activity.type === 'ticket_resolved' && (
                        <CheckCircle className="h-4 w-4 text-success" />
                      )}
                      {activity.type === 'invitation_sent' && (
                        <UserCircle className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.timestamp), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function OrganizationOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
        <Skeleton className="h-6 w-24" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="mt-1 h-5 w-32" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="mt-1 h-8 w-12" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="text-center">
                    <Skeleton className="mx-auto h-8 w-12" />
                    <Skeleton className="mt-1 mx-auto h-4 w-16" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="mt-1 h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}