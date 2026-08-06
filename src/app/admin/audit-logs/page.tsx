'use client'

import { useState } from 'react'
import { useAdmin } from '@/hooks/use-admin'
import { AuditLogTable } from '@/components/admin/audit-log-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Download, Filter } from 'lucide-react'

export default function AuditLogsPage() {
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('all')

  const { useAuditLogs } = useAdmin()
  const { data, isLoading } = useAuditLogs({
    page,
    limit,
    search: search || undefined,
    action: actionFilter !== 'all' ? actionFilter : undefined,
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground">
            Monitor all platform activity and security events
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Logs</CardTitle>
          <CardDescription>
            Complete audit trail of platform events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                  <SelectItem value="password_change">Password Change</SelectItem>
                  <SelectItem value="subscription_update">Subscription Update</SelectItem>
                  <SelectItem value="tenant_suspend">Tenant Suspend</SelectItem>
                  <SelectItem value="tenant_activate">Tenant Activate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <AuditLogTable
              data={data?.data || []}
              total={data?.total || 0}
              page={page}
              limit={limit}
              onPageChange={setPage}
              isLoading={isLoading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}