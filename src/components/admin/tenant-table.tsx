'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { Tenant, TenantStatus } from '@/types/admin'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface TenantTableProps {
  columns?: ColumnDef<Tenant, unknown>[]
  data: Tenant[]
  total?: number
  page?: number
  limit?: number
  onPageChange?: (page: number) => void
  isLoading?: boolean
  onRowClick?: (tenant: Tenant) => void
  className?: string
}

const statusStyles: Record<TenantStatus, string> = {
  active: 'bg-success/10 text-success',
  suspended: 'bg-destructive/10 text-destructive',
  pending: 'bg-warning/10 text-warning',
  inactive: 'bg-muted text-muted-foreground',
}

const defaultColumns: ColumnDef<Tenant, unknown>[] = [
  {
    accessorKey: 'name',
    header: 'Organization',
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.name}</p>
        <p className="text-sm text-muted-foreground">
          {row.original.subdomain}.supportflow.com
        </p>
      </div>
    ),
  },
  {
    accessorKey: 'owner',
    header: 'Owner',
    cell: ({ row }) => (
      <div>
        <p className="text-sm">
          {row.original.owner.firstName} {row.original.owner.lastName}
        </p>
        <p className="text-sm text-muted-foreground">{row.original.owner.email}</p>
      </div>
    ),
  },
  {
    accessorKey: 'plan',
    header: 'Plan',
    cell: ({ row }) => (
      <Badge variant="secondary" className="capitalize">
        {row.original.plan}
      </Badge>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn('capitalize', statusStyles[row.original.status])}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: 'users',
    header: 'Users',
    cell: ({ row }) => <span className="text-sm">{row.original.users}</span>,
  },
  {
    accessorKey: 'tickets',
    header: 'Tickets',
    cell: ({ row }) => <span className="text-sm">{row.original.tickets}</span>,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
]

export function TenantTable({
  columns: columnsProp,
  data,
  total,
  page,
  limit,
  onPageChange,
  isLoading = false,
  onRowClick,
  className,
}: TenantTableProps) {
  const columns = columnsProp ?? defaultColumns

  return (
    <div className={className}>
      <DataTable
        columns={columns}
        data={data}
        total={total}
        page={page}
        limit={limit}
        onPageChange={onPageChange}
        isLoading={isLoading}
        onRowClick={onRowClick}
      />
    </div>
  )
}
