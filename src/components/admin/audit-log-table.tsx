'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { AuditLog, AuditAction } from '@/types/admin'
import { formatDateTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface AuditLogTableProps {
  data: AuditLog[]
  total?: number
  page?: number
  limit?: number
  onPageChange?: (page: number) => void
  isLoading?: boolean
  onRowClick?: (log: AuditLog) => void
  className?: string
}

const actionStyles: Record<AuditAction, string> = {
  login: 'bg-primary/10 text-primary',
  logout: 'bg-muted text-muted-foreground',
  password_change: 'bg-warning/10 text-warning',
  subscription_update: 'bg-success/10 text-success',
  tenant_suspend: 'bg-destructive/10 text-destructive',
  tenant_activate: 'bg-success/10 text-success',
  user_invite: 'bg-secondary/10 text-secondary',
  user_remove: 'bg-destructive/10 text-destructive',
  permission_change: 'bg-primary/10 text-primary',
  plan_create: 'bg-success/10 text-success',
  plan_update: 'bg-warning/10 text-warning',
  plan_delete: 'bg-destructive/10 text-destructive',
}

const columns: ColumnDef<AuditLog, unknown>[] = [
  {
    accessorKey: 'user',
    header: 'User',
    cell: ({ row }) => (
      <div>
        <p className="font-medium">
          {row.original.user.firstName} {row.original.user.lastName}
        </p>
        <p className="text-sm text-muted-foreground">{row.original.user.email}</p>
      </div>
    ),
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn('capitalize', actionStyles[row.original.action])}
      >
        {row.original.action.replace(/_/g, ' ')}
      </Badge>
    ),
  },
  {
    accessorKey: 'module',
    header: 'Module',
    cell: ({ row }) => (
      <span className="capitalize">{row.original.module.replace(/_/g, ' ')}</span>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <span className="line-clamp-1 text-sm">{row.original.description}</span>
    ),
  },
  {
    accessorKey: 'ipAddress',
    header: 'IP Address',
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.original.ipAddress}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDateTime(row.original.createdAt)}
      </span>
    ),
  },
]

export function AuditLogTable({
  data,
  total,
  page,
  limit,
  onPageChange,
  isLoading = false,
  onRowClick,
  className,
}: AuditLogTableProps) {
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
