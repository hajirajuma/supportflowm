'use client'

import { useMemo, useState } from 'react'
import { useOrganization } from '@/hooks/use-organization'
import { useDashboard } from '@/hooks/use-dashboard'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Users, UserCheck, Star } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

/** Flat user shape returned by GET /organization/members?role=CUSTOMER */
interface Customer {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  status: string
  createdAt: string
}

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-success/10 text-success',
  INACTIVE: 'bg-muted text-muted-foreground',
  SUSPENDED: 'bg-destructive/10 text-destructive',
  PENDING_VERIFICATION: 'bg-warning/10 text-warning',
}

export default function CustomersPage() {
  const { useMembers } = useOrganization()
  const { analytics } = useDashboard()
  const [search, setSearch] = useState('')

  const { data, isLoading } = useMembers({ role: 'CUSTOMER' })

  // The backend returns the member list directly (unwrapped array) even though
  // the service types it as paginated — cast defensively.
  const members: Customer[] = useMemo(() => {
    const list: any = Array.isArray(data) ? data : (data as any)?.data ?? []
    return Array.isArray(list) ? (list as Customer[]) : []
  }, [data])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return members
    return members.filter(
      (c) =>
        c.firstName?.toLowerCase().includes(q) ||
        c.lastName?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
    )
  }, [members, search])

  const activeCount = members.filter(
    (c) => c.status === 'ACTIVE' || c.status === 'PENDING_VERIFICATION'
  ).length
  const totalCustomers =
    analytics?.customerAnalytics?.totalCustomers ?? members.length

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: 'customer',
      header: 'Customer',
      cell: ({ row }) => {
        const c = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {c.firstName?.[0] ?? ''}
                {c.lastName?.[0] ?? ''}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {c.firstName} {c.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{c.email}</p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={cn(
            'capitalize',
            statusColors[row.original.status] ?? 'bg-muted text-muted-foreground'
          )}
        >
          {row.original.status?.toLowerCase().replace('_', ' ') ?? '—'}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">
          View and manage the customers of your organization
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-3xl font-bold">{totalCustomers}</p>
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
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-bold">{activeCount}</p>
              </div>
              <div className="rounded-full bg-success/10 p-2">
                <UserCheck className="h-4 w-4 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-3xl font-bold">
                  {analytics?.customerAnalytics
                    ? (
                        analytics.customerAnalytics.ratingDistribution.reduce(
                          (acc, d, i) => acc + (i + 1) * d.value,
                          0
                        ) /
                        (analytics.customerAnalytics.ratingDistribution.reduce(
                          (acc, d) => acc + d.value,
                          0
                        ) || 1)
                      ).toFixed(1)
                    : '0.0'}
                </p>
              </div>
              <div className="rounded-full bg-warning/10 p-2">
                <Star className="h-4 w-4 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>All Customers</CardTitle>
            <CardDescription>Search your customer base</CardDescription>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filtered}
            isLoading={isLoading}
            pageCount={1}
            currentPage={1}
          />
        </CardContent>
      </Card>
    </div>
  )
}
