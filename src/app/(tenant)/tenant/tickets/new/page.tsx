'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Loader2, Plus } from 'lucide-react'
import { useSupport } from '@/hooks/use-support'
import { useOrganization } from '@/hooks/use-organization'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const createTicketSchema = z.object({
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(['low', 'medium', 'high', 'critical', 'urgent']),
  category: z.string().min(1, 'Category is required'),
})

type CreateTicketFormValues = z.infer<typeof createTicketSchema>

const priorityOptions = ['low', 'medium', 'high', 'critical', 'urgent']
const categoryOptions = [
  'technical',
  'billing',
  'feature_request',
  'bug_report',
  'general',
  'security',
  'performance',
]

interface CustomerOption {
  id: string
  firstName?: string
  lastName?: string
  email?: string
}

export default function NewTicketPage() {
  const router = useRouter()
  const { createTicket, isCreatingTicket } = useSupport()
  const { useMembers } = useOrganization()
  const [customerId, setCustomerId] = useState('')

  const { data: membersData } = useMembers({ role: 'CUSTOMER' })
  const customers: CustomerOption[] = useMemo(() => {
    const list: any = Array.isArray(membersData)
      ? membersData
      : (membersData as any)?.data ?? []
    return Array.isArray(list) ? list : []
  }, [membersData])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateTicketFormValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      priority: 'medium',
      category: 'technical',
    },
  })

  const onSubmit = async (values: CreateTicketFormValues) => {
    await createTicket({
      title: values.subject,
      description: values.description,
      priority: values.priority as any,
      category: values.category as any,
      customerId,
    })
    router.push('/tenant/tickets')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/tenant/tickets">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">New Ticket</h1>
          <p className="text-muted-foreground">Create a new support ticket</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ticket Details</CardTitle>
          <CardDescription>Provide the details of the issue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief summary of the issue"
                {...register('subject')}
                className={cn(errors.subject && 'border-destructive')}
                aria-invalid={!!errors.subject}
              />
              {errors.subject && (
                <p className="text-sm text-destructive">{errors.subject.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the issue"
                rows={6}
                {...register('description')}
                className={cn(errors.description && 'border-destructive')}
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Customer</Label>
              <Select value={customerId || 'self'} onValueChange={setCustomerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">Myself (organization owner)</SelectItem>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.firstName} {customer.lastName}{' '}
                      <span className="text-muted-foreground">
                        ({customer.email})
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                The customer this ticket belongs to
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  onValueChange={(value) => setValue('category', value)}
                  defaultValue="technical"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  onValueChange={(value) => setValue('priority', value as any)}
                  defaultValue="medium"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isCreatingTicket}>
              {isCreatingTicket ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Ticket
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
