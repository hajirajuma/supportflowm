'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSupport } from '@/hooks/use-support'
import { useDashboard } from '@/hooks/use-dashboard'
import { TicketTable } from '@/components/support/ticket-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Search } from 'lucide-react'
import { SupportTicket } from '@/types/support'

export default function TenantTicketsPage() {
  const router = useRouter()
  const { useTickets } = useSupport()
  const { tenantStats } = useDashboard()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const limit = 20

  const { data, isLoading } = useTickets(page, limit)

  const filteredData = (data?.data ?? []).filter((ticket) =>
    search ? ticket.title?.toLowerCase().includes(search.toLowerCase()) : true
  )

  const stats = tenantStats?.tickets

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tickets</h1>
          <p className="text-muted-foreground">
            Manage and track support tickets
          </p>
        </div>
        <Link href="/tenant/tickets/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total" value={data?.total ?? stats?.total} />
        <StatCard label="Open" value={stats?.open} />
        <StatCard label="Resolved" value={stats?.resolved} />
        <StatCard label="Overdue" value={stats?.overdue} />
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>All Tickets</CardTitle>
            <CardDescription>Search and filter your tickets</CardDescription>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search tickets..."
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <TicketTable
              data={filteredData}
              total={data?.total ?? 0}
              page={page}
              limit={limit}
              onPageChange={setPage}
              onRowClick={(ticket: SupportTicket) =>
                router.push(`/tenant/tickets/${ticket.id}`)
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value?: number }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold">{value ?? '—'}</p>
      </CardContent>
    </Card>
  )
}
