'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Eye,
  MoreHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SupportTicket, TicketStatus, TicketPriority } from '@/types/support'

interface TicketTableProps {
  data: SupportTicket[]
  total: number
  page: number
  limit: number
  onPageChange: (page: number) => void
  onRowClick?: (ticket: SupportTicket) => void
  isLoading?: boolean
  onSelectionChange?: (selectedIds: string[]) => void
}

export function TicketTable({
  data,
  total,
  page,
  limit,
  onPageChange,
  onRowClick,
  isLoading = false,
  onSelectionChange,
}: TicketTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const getStatusColor = (status: TicketStatus) => {
    const colors = {
      new: 'bg-blue-500/10 text-blue-500',
      open: 'bg-primary/10 text-primary',
      in_progress: 'bg-warning/10 text-warning',
      pending_customer: 'bg-warning/10 text-warning',
      resolved: 'bg-success/10 text-success',
      closed: 'bg-muted text-muted-foreground',
    }
    return colors[status]
  }

  const getPriorityColor = (priority: TicketPriority) => {
    const colors = {
      low: 'bg-success/10 text-success',
      medium: 'bg-primary/10 text-primary',
      high: 'bg-warning/10 text-warning',
      critical: 'bg-destructive/10 text-destructive',
      urgent: 'bg-destructive/10 text-destructive',
    }
    return colors[priority]
  }

  const columns: ColumnDef<SupportTicket>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value)
            if (onSelectionChange) {
              const selectedIds = table
                .getSelectedRowModel()
                .rows.map((row) => row.original.id)
              onSelectionChange(selectedIds)
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row, table }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value)
            if (onSelectionChange) {
              const selectedIds = table
                .getSelectedRowModel()
                .rows.map((r) => r.original.id)
              onSelectionChange(selectedIds)
            }
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'ticketNumber',
      header: 'Ticket',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">#{row.original.ticketNumber}</span>
          <span className="text-sm text-muted-foreground">{row.original.title}</span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={cn('capitalize', getStatusColor(row.original.status))}
        >
          {row.original.status.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={cn('capitalize', getPriorityColor(row.original.priority))}
        >
          {row.original.priority}
        </Badge>
      ),
    },
    {
      accessorKey: 'customer',
      header: 'Customer',
      cell: ({ row }) => (
        <div>
          <p className="text-sm">
            {row.original.customer.firstName} {row.original.customer.lastName}
          </p>
          <p className="text-xs text-muted-foreground">
            {row.original.customer.email}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'assignedTo',
      header: 'Assigned To',
      cell: ({ row }) =>
        row.original.assignedTo ? (
          <span className="text-sm">
            {row.original.assignedTo.firstName} {row.original.assignedTo.lastName}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">Unassigned</span>
        ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated',
      cell: ({ row }) => new Date(row.original.updatedAt).toLocaleDateString(),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/support/tickets/${row.original.id}`}>
              <Button variant="ghost" className="w-full justify-start">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search tickets..."
            value={(table.getColumn('ticketNumber')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('ticketNumber')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          'flex items-center gap-1',
                          header.column.getCanSort() && 'cursor-pointer select-none'
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <ChevronUp className="h-4 w-4" />,
                          desc: <ChevronDown className="h-4 w-4" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No tickets found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Showing {data.length} of {total} tickets
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {page} of {Math.ceil(total / limit)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= Math.ceil(total / limit)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}