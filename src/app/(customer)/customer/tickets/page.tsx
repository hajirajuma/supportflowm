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
import { Ticket, TicketStatus, TicketPriority, TicketCategory } from '@/types/customer'
import { formatDate } from '@/lib/utils'
import { Search, Plus, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function MyTicketsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  const { useTickets } = useCustomer()
  const { data, isLoading } = useTickets({
    page,
    limit,
    search: search || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    priority: priorityFilter !== 'all' ? priorityFilter : undefined,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
  })

  const getStatusColor = (status: TicketStatus) => {
    const colors = {
      open: 'bg-blue-500/10 text-blue-500',
      pending: 'bg-warning/10 text-warning',
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
    }
    return colors[priority]
  }

  const columns: ColumnDef<Ticket>[] = [
    {
      accessorKey: 'ticketNumber',
      header: 'Ticket',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">#{row.original.ticketNumber}</p>
          <p className="text-sm text-muted-foreground">{row.original.title}</p>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant="outline" className={cn('capitalize', getStatusColor(row.original.status))}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => (
        <Badge variant="outline" className={cn('capitalize', getPriorityColor(row.original.priority))}>
          {row.original.priority}
        </Badge>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <span className="capitalize text-sm">{row.original.category.replace('_', ' ')}</span>
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Last Updated',
      cell: ({ row }) => formatDate(row.original.updatedAt),
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
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="feature_request">Feature Request</SelectItem>
                  <SelectItem value="bug_report">Bug Report</SelectItem>
                  <SelectItem value="general">General</SelectItem>
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