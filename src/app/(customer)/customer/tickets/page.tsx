'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCustomer } from '@/hooks/use-customer'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Ticket } from '@/types/customer'
import { formatDate } from '@/lib/utils'
import {
  ticketStatusLabel,
  ticketPriorityLabel,
  ticketStatusBadge,
  ticketPriorityBadge,
} from '@/lib/ticket-labels'
import { Search, Plus, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function MyTicketsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  const { useTickets } = useCustomer()
  const { data, isLoading } = useTickets({
    page,
    limit,
    search: search || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    priority: priorityFilter !== 'all' ? priorityFilter : undefined,
  })

  const columns: ColumnDef<Ticket>[] = [
    {
      accessorKey: 'ticketNumber',
      header: 'Ticket',
      cell: ({ row }) => (
        <div className="max-w-[280px]">
          <p className="font-medium text-primary">#{row.original.ticketNumber}</p>
          <p className="truncate text-sm font-medium">{row.original.subject}</p>
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {row.original.description}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant="outline" className={cn(ticketStatusBadge(row.original.status))}>
          {ticketStatusLabel(row.original.status)}
        </Badge>
      ),
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => (
        <Badge variant="outline" className={cn(ticketPriorityBadge(row.original.priority))}>
          {ticketPriorityLabel(row.original.priority)}
        </Badge>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <span className="text-sm capitalize">
          {row.original.category?.name ?? '—'}
        </span>
      ),
    },
    {
      accessorKey: 'assignedTo',
      header: 'Assigned To',
      cell: ({ row }) => {
        const agent = row.original.assignedTo
        return (
          <span className="text-sm text-muted-foreground">
            {agent ? `${agent.firstName} ${agent.lastName}` : 'Unassigned'}
          </span>
        )
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Last Updated',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.original.updatedAt)}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Link href={`/customer/tickets/${row.original.id}`}>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Tickets</h1>
          <p className="text-muted-foreground">
            View and manage all your support tickets
          </p>
        </div>
        <Link href="/customer/tickets/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tickets</CardTitle>
          <CardDescription>
            Track the status of your support requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  className="pl-9"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value)
                  setPage(1)
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="WAITING_FOR_CUSTOMER">
                    Waiting for Customer
                  </SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={priorityFilter}
                onValueChange={(value) => {
                  setPriorityFilter(value)
                  setPage(1)
                }}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DataTable
              columns={columns}
              data={data?.data || []}
              isLoading={isLoading}
              pageCount={data ? Math.ceil(data.total / limit) : 0}
              currentPage={page}
              onPageChange={setPage}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}