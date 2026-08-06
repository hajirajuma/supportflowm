'use client'

import { useState } from 'react'
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
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Invitation } from '@/types/organization'
import { formatDate } from '@/lib/utils'
import {
  MoreHorizontal,
  Mail,
  XCircle,
  RefreshCw,
  Copy,
  Send,
  Users,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'

const inviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['support_agent', 'customer']),
  departmentId: z.string().optional(),
  message: z.string().optional(),
  expiresIn: z.number().min(1).max(30).default(7),
})

type InviteFormValues = z.infer<typeof inviteSchema>

export default function InvitationsPage() {
  const { isTenantOwner } = useRole()
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const {
    useInvitations,
    sendInvitation,
    cancelInvitation,
    resendInvitation,
    departments,
  } = useOrganization()

  const { data, isLoading } = useInvitations({
    page,
    limit,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      role: 'support_agent',
      expiresIn: 7,
    },
  })

  const onSubmit = async (data: InviteFormValues) => {
    await sendInvitation(data)
    setOpen(false)
    reset()
  }

  const columns: ColumnDef<Invitation>[] = [
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.role.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status
        const statusColors = {
          pending: 'bg-warning/10 text-warning',
          accepted: 'bg-success/10 text-success',
          expired: 'bg-destructive/10 text-destructive',
          rejected: 'bg-muted text-muted-foreground',
        }
        return (
          <Badge variant="outline" className={cn('capitalize', statusColors[status])}>
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'expiresAt',
      header: 'Expires',
      cell: ({ row }) => formatDate(row.original.expiresAt),
    },
    {
      accessorKey: 'invitedBy',
      header: 'Invited By',
      cell: ({ row }) =>
        `${row.original.invitedBy.firstName} ${row.original.invitedBy.lastName}`,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const invitation = row.original
        const isPending = invitation.status === 'pending'

        return (
          <div className="flex items-center gap-2">
            {isPending && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => resendInvitation(invitation.id)}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => cancelInvitation(invitation.id)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Copy invitation link
                    const link = `${window.location.origin}/accept-invitation?token=${invitation.id}`
                    navigator.clipboard.writeText(link)
                    toast.success('Invitation link copied to clipboard')
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
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
            Only Tenant Owners can manage invitations
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invitations</h1>
          <p className="text-muted-foreground">
            Manage team invitations
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Send Invitation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your organization
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@company.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  onValueChange={(value) =>
                    register('role').onChange({
                      target: { value, name: 'role' },
                    })
                  }
                  defaultValue="support_agent"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="support_agent">Support Agent</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {departments && departments.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="department">Department (Optional)</Label>
                  <Select
                    onValueChange={(value) =>
                      register('departmentId').onChange({
                        target: { value, name: 'departmentId' },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="message">Personal Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Welcome to the team! We're excited to have you."
                  {...register('message')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresIn">Expires in (days)</Label>
                <Input
                  id="expiresIn"
                  type="number"
                  min={1}
                  max={30}
                  {...register('expiresIn', { valueAsNumber: true })}
                />
                {errors.expiresIn && (
                  <p className="text-sm text-destructive">{errors.expiresIn.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Invitation
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Invitations</CardTitle>
          <CardDescription>
            Track and manage all sent invitations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
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