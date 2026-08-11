'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCustomer } from '@/hooks/use-customer'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { FileUpload } from '@/components/ui/file-upload'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import {
  ticketStatusLabel,
  ticketPriorityLabel,
  ticketStatusBadge,
  ticketPriorityBadge,
} from '@/lib/ticket-labels'
import {
  ArrowLeft,
  Paperclip,
  MessageSquare,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react'

const replySchema = z.object({
  content: z.string().min(1, 'Reply content is required'),
})

type ReplyFormValues = z.infer<typeof replySchema>

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ticketId = params.id as string
  const { useTicket, useReplies, createReply, isCreatingReply } = useCustomer()
  const [attachments, setAttachments] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  const { data: ticket, isLoading: isLoadingTicket } = useTicket(ticketId)
  const { data: replies, isLoading: isLoadingReplies } = useReplies(ticketId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
  })

  const onSubmit = async (data: ReplyFormValues) => {
    try {
      await createReply({
        ticketId,
        data: {
          ...data,
          attachments,
        },
      })
      reset()
      setAttachments([])
      setUploadProgress({})
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleFilesAdded = (files: File[]) => {
    setAttachments((prev) => [...prev, ...files])
    files.forEach((file) => {
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

  if (isLoadingTicket) {
    return <TicketDetailSkeleton />
  }

  if (!ticket) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Ticket not found</p>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
      case 'IN_PROGRESS':
      case 'WAITING_FOR_CUSTOMER':
      case 'ON_HOLD':
      case 'REOPENED':
        return <Clock className="h-4 w-4" />
      case 'RESOLVED':
        return <CheckCircle className="h-4 w-4" />
      case 'CLOSED':
        return <XCircle className="h-4 w-4" />
      default:
        return null
    }
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
          <h1 className="text-3xl font-bold">Ticket #{ticket.ticketNumber}</h1>
          <p className="text-muted-foreground">{ticket.subject}</p>
        </div>
      </div>

      {/* Ticket Details */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Ticket Details</CardTitle>
              <CardDescription>
                Created {formatDate(ticket.createdAt)}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className={cn(ticketStatusBadge(ticket.status))}
              >
                {getStatusIcon(ticket.status)}
                <span className="ml-1">{ticketStatusLabel(ticket.status)}</span>
              </Badge>
              <Badge
                variant="outline"
                className={cn(ticketPriorityBadge(ticket.priority))}
              >
                {ticketPriorityLabel(ticket.priority)}
              </Badge>
              {ticket.category?.name && (
                <Badge variant="outline" className="capitalize">
                  {ticket.category.name}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p className="mt-1 whitespace-pre-wrap">{ticket.description}</p>
            </div>

            {ticket.attachments.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Attachments</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ticket.attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.publicUrl ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-md border p-2 hover:bg-accent"
                    >
                      <Paperclip className="h-4 w-4" />
                      <span className="text-sm">{attachment.originalName}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {ticket.assignedTo && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Assigned to: {ticket.assignedTo.firstName} {ticket.assignedTo.lastName}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Replies */}
      <Card>
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
          <CardDescription>
            {replies?.total ?? 0} replies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {isLoadingReplies ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : (
              replies?.data?.map((reply) => (
                <div key={reply.id} className="flex gap-4 border-b pb-4 last:border-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={reply.author.avatarUrl ?? undefined} />
                    <AvatarFallback>
                      {reply.author.firstName?.[0]}
                      {reply.author.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {reply.author.firstName} {reply.author.lastName}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(reply.createdAt)}
                      </span>
                      {reply.isInternal && (
                        <Badge variant="secondary" className="text-xs">
                          Internal
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 whitespace-pre-wrap">{reply.body}</p>
                    {reply.attachments.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {reply.attachments.map((attachment) => (
                          <a
                            key={attachment.id}
                            href={attachment.publicUrl ?? '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-md border p-1 px-2 text-sm hover:bg-accent"
                          >
                            <Paperclip className="h-3 w-3" />
                            {attachment.originalName}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reply Form */}
      {ticket.status !== 'CLOSED' && ticket.status !== 'RESOLVED' && (
        <Card>
          <CardHeader>
            <CardTitle>Add Reply</CardTitle>
            <CardDescription>
              Respond to this ticket
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  placeholder="Type your reply..."
                  {...register('content')}
                  rows={4}
                  className={cn(errors.content && 'border-destructive')}
                />
                {errors.content && (
                  <p className="text-sm text-destructive">{errors.content.message}</p>
                )}
              </div>

              <FileUpload
                onFilesAdded={handleFilesAdded}
                onFileRemoved={handleFileRemoved}
                accept={{
                  'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
                  'application/pdf': ['.pdf'],
                }}
                maxFiles={3}
                maxSize={5 * 1024 * 1024}
                uploadProgress={uploadProgress}
              />

              <Button type="submit" disabled={isCreatingReply}>
                {isCreatingReply ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send Reply
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function TicketDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-24" />
        <div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="mt-1 h-4 w-48" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}