'use client'

import { useState } from 'react'
import { useOrganization } from '@/hooks/use-organization'
import { useRole } from '@/hooks/use-role'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { Building2, Plus, Pencil, Trash2, Users } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const departmentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
})

type DepartmentFormValues = z.infer<typeof departmentSchema>

export default function DepartmentsPage() {
  const { isTenantOwner } = useRole()
  const { departments, createDepartment, updateDepartment, deleteDepartment, isLoadingDepartments } =
    useOrganization()

  const [open, setOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<any>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string }>({
    open: false,
    id: '',
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const onSubmit = async (data: DepartmentFormValues) => {
    if (editingDepartment) {
      await updateDepartment({ id: editingDepartment.id, data })
    } else {
      await createDepartment(data)
    }
    setOpen(false)
    reset()
    setEditingDepartment(null)
  }

  const handleEdit = (department: any) => {
    setEditingDepartment(department)
    reset({
      name: department.name,
      description: department.description || '',
    })
    setOpen(true)
  }

  const handleDelete = async () => {
    await deleteDepartment(deleteDialog.id)
    setDeleteDialog({ open: false, id: '' })
  }

  if (!isTenantOwner) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            Only Tenant Owners can manage departments
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (isLoadingDepartments) {
    return <DepartmentsSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="text-muted-foreground">
            Manage your organization's departments
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDepartment ? 'Edit Department' : 'Create Department'}
              </DialogTitle>
              <DialogDescription>
                {editingDepartment
                  ? 'Update department details'
                  : 'Create a new department in your organization'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Department Name</Label>
                <Input
                  id="name"
                  placeholder="Engineering"
                  {...register('name')}
                  className={cn(errors.name && 'border-destructive')}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Department description"
                  {...register('description')}
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Saving...'
                  : editingDepartment
                  ? 'Update Department'
                  : 'Create Department'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Departments Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {departments?.map((department) => (
          <Card key={department.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{department.name}</CardTitle>
                    <CardDescription>
                      Created {formatDate(department.createdAt)}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(department)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() =>
                      setDeleteDialog({ open: true, id: department.id })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {department.description && (
                <p className="mb-4 text-sm text-muted-foreground">
                  {department.description}
                </p>
              )}
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {department.members?.length || 0} members
                </span>
              </div>
              {department.head && (
                <div className="mt-2 text-sm">
                  <span className="text-muted-foreground">Head:</span>{' '}
                  {department.head.firstName} {department.head.lastName}
                </div>
              )}
              <div className="mt-3 flex items-center gap-2">
                <Badge variant="outline">
                  {department.ticketCount || 0} tickets
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!departments || departments.length === 0) && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No departments</h3>
              <p className="text-sm text-muted-foreground">
                Create your first department to get started
              </p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => setOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Department
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Department</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              department and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function DepartmentsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="mt-1 h-3 w-24" />
                  </div>
                </div>
                <div className="flex gap-1">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-32" />
              <Skeleton className="mt-3 h-6 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}