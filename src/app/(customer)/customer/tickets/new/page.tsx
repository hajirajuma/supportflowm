'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useCustomer } from '@/hooks/use-customer'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileUpload } from '@/components/ui/file-upload'
import { cn } from '@/lib/utils'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { TicketPriority } from '@/types/customer'

// Priority values match the backend contract exactly (Prisma enum:
// LOW/MEDIUM/HIGH/URGENT). The UI shows friendly labels.
const ticketSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
})

type TicketFormValues = z.infer<typeof ticketSchema>

export default function CreateTicketPage() {
  const router = useRouter()
  const { createTicket, isCreatingTicket } = useCustomer()
  const [attachments, setAttachments] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      priority: 'MEDIUM',
    },
  })

  const onSubmit = async (data: TicketFormValues) => {
    try {
      // mutateAsync resolves only after the backend created the ticket; the
      // mutation already shows the success toast and invalidates the ticket
      // list/stats queries so the new ticket appears with its status.
      await createTicket({
        ...data,
        attachments,
      })
      router.push('/customer/tickets')
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleFilesAdded = (files: File[]) => {
    setAttachments((prev) => [...prev, ...files])
    // Simulate upload progress
    files.forEach((file) => {
      const progress = 0
      setUploadProgress((prev) => ({ ...prev, [file.name]: progress }))
      
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const current = prev[file.name] || 0
          if (current >= 100) {
            clearInterval(interval)
            return prev
          }
          return { ...prev, [file.name]: Math.min(current + 10, 100) }
        })
      }, 200)
    })
  }

  const handleFileRemoved = (file: File) => {
    setAttachments((prev) => prev.filter((f) => f !== file))
    setUploadProgress((prev) => {
      const newProgress = { ...prev }
      delete newProgress[file.name]
      return newProgress
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/customer/tickets">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Ticket</h1>
          <p className="text-muted-foreground">
            Describe your issue and we&apos;ll help you solve it
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ticket Details</CardTitle>
          <CardDescription>
            Provide detailed information about your issue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Brief summary of your issue"
                {...register('title')}
                className={cn(errors.title && 'border-destructive')}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                onValueChange={(value) => setValue('priority', value as TicketPriority)}
                defaultValue="MEDIUM"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-sm text-destructive">{errors.priority.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your issue in detail..."
                {...register('description')}
                rows={6}
                className={cn(errors.description && 'border-destructive')}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Attachments (Optional)</Label>
              <FileUpload
                onFilesAdded={handleFilesAdded}
                onFileRemoved={handleFileRemoved}
                accept={{
                  'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
                  'application/pdf': ['.pdf'],
                  'application/msword': ['.doc'],
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                  'application/zip': ['.zip'],
                }}
                maxFiles={5}
                maxSize={10 * 1024 * 1024} // 10MB
                uploadProgress={uploadProgress}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isCreatingTicket}>
                {isCreatingTicket ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Ticket'
                )}
              </Button>
              <Link href="/customer/tickets">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}