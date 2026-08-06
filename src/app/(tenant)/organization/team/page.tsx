'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useOrganization } from '@/hooks/use-organization'
import { useRole } from '@/hooks/use-role'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Member, MemberStatus, OrganizationRole } from '@/types/organization'
import { formatDate } from '@/lib/utils'
import {
  MoreHorizontal,
  Search,
  UserPlus,
  Mail,
  UserX,
  UserCheck,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function TeamManagementPage() {
  const { isTenantOwner } = useRole()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  const { useMembers, updateMember, removeMember, deactivateMember, reactivateMember } =
    useOrganization()

  const { data, isLoading } = useMembers({
    page,
    limit,
    search: search || undefined,
    role: roleFilter !== 'all' ? roleFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  })

  const columns: ColumnDef<Member>[] = [
    {
      accessorKey: 'user',
      header: 'Member',
      cell: ({ row }) => {
        const member = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={member.user.avatar} />
              <AvatarFallback>
                {member.user.firstName[0]}
                {member.user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {member.user.firstName} {member.user.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{member.user.email}</p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.original.role
        const roleColors = {
          tenant_owner: 'bg-primary/10 text-primary',
          support_agent: 'bg-secondary/10 text-secondary',
          customer: 'bg-blue-500/10 text-blue-500',
        }
        return (
          <Badge variant="outline" className={cn('capitalize', roleColors[role])}>
            {role.replace('_', ' ')}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: ({ row }) => {
        const department = row.original.department
        return department ? (
          <span className="text-sm">{department.name}</span>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status
        const statusColors = {
          active: 'bg-success/10 text-success',
          inactive: 'bg-muted text-muted-foreground',
          pending: 'bg-warning/10 text-warning',
          suspended: 'bg-destructive/10 text-destructive',
        }
        return (
          <Badge variant="outline" className={cn('capitalize', statusColors[status])}>
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'joinedAt',
      header: 'Joined',
      cell: ({ row }) => formatDate(row.original.joinedAt),
    },
    {
      accessorKey: 'lastLoginAt',
      header: 'Last Login',
      cell: ({ row }) =>
        row.original.lastLoginAt ? formatDate(row.original.lastLoginAt) : 'Never',
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const member = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  // View member details
                }}
              >
                <UserCheck className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              {member.role !== 'tenant_owner' && (
                <>
                  <DropdownMenuSeparator />
                  {member.status === 'active' ? (
                    <DropdownMenuItem
                      className="text-warning"
                      onClick={() => deactivateMember(member.id)}
                    >
                      <UserX className="mr-2 h-4 w-4" />
                      Deactivate
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      className="text-success"
                      onClick={() => reactivateMember(member.id)}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reactivate
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => removeMember(member.id)}
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    Remove
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  if (!isTenantOwner) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            Only Tenant Owners can manage team members
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">
            Manage your organization's members
          </p>
        </div>
        <Link href="/organization/team/invitations">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage and monitor your team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="tenant_owner">Tenant Owner</SelectItem>
                  <SelectItem value="support_agent">Support Agent</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
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