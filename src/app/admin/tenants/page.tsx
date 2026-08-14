'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/hooks/use-admin'
import { TenantTable } from '@/components/admin/tenant-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Download, Search } from 'lucide-react'
import { TenantStatus } from '@/types/admin'

export default function TenantsPage() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  // Fetch up to the backend's max page size so every registered organization
  // appears in one view instead of hiding behind pagination.
  const [limit] = useState(100)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [planFilter, setPlanFilter] = useState<string>('all')

  const { useTenants, plans, updateTenantStatus, deleteTenant } = useAdmin()
  const { data, isLoading } = useTenants({
    page,
    limit,
    search: search || undefined,
    status: statusFilter !== 'all' ? statusFilter as TenantStatus : undefined,
    plan: planFilter !== 'all' ? planFilter : undefined,
  })

  const handleExport = () => {
    const rows = data?.data ?? []
    if (!rows.length) return

    const escape = (value: unknown) =>
      `"${String(value ?? '').replace(/"/g, '""')}"`
    const headers = [
      'Organization',
      'Slug',
      'Owner',
      'Owner Email',
      'Plan',
      'Status',
      'Users',
      'Tickets',
      'Created',
    ]
    const lines = rows.map((tenant) =>
      [
        tenant.name,
        tenant.slug,
        `${tenant.owner.firstName} ${tenant.owner.lastName}`.trim(),
        tenant.owner.email,
        tenant.plan,
        tenant.status,
        tenant.users,
        tenant.tickets,
        tenant.createdAt,
      ]
        .map(escape)
        .join(',')
    )
    const csv = [headers.map(escape).join(','), ...lines].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'tenants.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tenant Management</h1>
          <p className="text-muted-foreground">
            Manage all organizations on the platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={!data?.data?.length}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organizations</CardTitle>
          <CardDescription>
            View and manage all tenant organizations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search organizations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  {plans?.map((plan) => (
                    <SelectItem key={plan.id} value={plan.slug}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            {!isLoading && data && (
              <p className="text-sm text-muted-foreground">
                Showing {data.data.length} of {data.total} organizations
              </p>
            )}
            <TenantTable
              data={data?.data || []}
              total={data?.total || 0}
              page={page}
              limit={limit}
              onPageChange={setPage}
              isLoading={isLoading}
              onRowClick={(tenant) => router.push(`/admin/tenants/${tenant.id}`)}
              onStatusChange={(tenant, status) =>
                updateTenantStatus({ id: tenant.id, status })
              }
              onDelete={(tenant) => {
                if (
                  window.confirm(
                    `Archive "${tenant.name}"? The organization and its data will be deactivated.`
                  )
                ) {
                  deleteTenant(tenant.id)
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}