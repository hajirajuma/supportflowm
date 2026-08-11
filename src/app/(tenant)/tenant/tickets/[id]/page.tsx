'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useSupport } from '@/hooks/use-support'
import { useRole } from '@/hooks/use-role'
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
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { FileUpload } from '@/components/ui/file-upload'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  MessageSquare,
  Clock,
  User,
  Paperclip,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

const replySchema = z.object({
  content: z.string().min(1, 'Reply content is required'),
})

type ReplyFormValues = z.infer<typeof replySchema>

export default function TicketDetailPage() {
  const params = useParams()
  const ticketId = params.id as string
  const { isSupportAgent, isTenantOwner } = useRole()
  const {
    useTicket,
    useReplies,
    useNotes,
    useTimeline,
    createReply,
    updateTicket,
    isCreatingReply,
  } = useSupport()

  const [activeTab, setActiveTab] = useState('conversation')
  const [attachments, setAttachments] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  const { data: ticket, isLoading: isLoadingTicket } = useTicket(ticketId)
  const { data: replies, isLoading: isLoadingReplies } = useReplies(ticketId)
  const { data: notes, isLoading: isLoadingNotes } = useNotes(ticketId)
  const { data: timeline, isLoading: isLoadingTimeline } = useTimeline(ticketId)

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
          isInternal: false,
        },
      })
      reset()
      setAttachments([])
      setUploadProgress({})
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleStatusChange = async (status: string) => {
    await updateTicket({
      id: ticketId,
      data: { status: status as any },
    })
  }

  const handlePriorityChange = async (priority: string) => {
    await updateTicket({
      id: ticketId,
      data: { priority: priority as any },
    })
  }

  const handleAssignment = async (agentId: string) => {
    await updateTicket({
      id: ticketId,
      data: { assignedToId: agentId },
    })
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
      case 'new':
        return <AlertCircle className="h-4 w-4" />
      case 'open':
        return <Clock className="h-4 w-4" />
      case 'in_progress':
        return <Clock className="h-4 w-4" />
      case 'pending_customer':
        return <Clock className="h-4 w-4" />
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />
      case 'closed':
        return <XCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const canEdit = isSupportAgent || isTenantOwner

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/tenant/tickets">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Ticket #{ticket.ticketNumber}</h1>
          <p className="text-muted-foreground">{ticket.title}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
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
                    className={cn('capitalize', {
                      'bg-blue-500/10 text-blue-500': ticket.status === 'new',
                      'bg-primary/10 text-primary': ticket.status === 'open',
                      'bg-warning/10 text-warning': ticket.status === 'in_progress',
                      'bg-amber-500/10 text-amber-500': ticket.status === 'pending_customer',
                      'bg-success/10 text-success': ticket.status === 'resolved',
                      'bg-muted text-muted-foreground': ticket.status === 'closed',
                    })}
                  >
                    {getStatusIcon(ticket.status)}
                    <span className="ml-1">{ticket.status.replace('_', ' ')}</span>
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn('capitalize', {
                      'bg-success/10 text-success': ticket.priority === 'low',
                      'bg-primary/10 text-primary': ticket.priority === 'medium',
                      'bg-warning/10 text-warning': ticket.priority === 'high',
                      'bg-destructive/10 text-destructive': ticket.priority === 'critical' || ticket.priority === 'urgent',
                    })}
                  >
                    {ticket.priority}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {ticket.category.replace('_', ' ')}
                  </Badge>
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
                          href={attachment.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-md border p-2 hover:bg-accent"
                        >
                          <Paperclip className="h-4 w-4" />
                          <span className="text-sm">{attachment.fileName}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {ticket.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {ticket.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="conversation">
                <MessageSquare className="mr-2 h-4 w-4" />
                Conversation
              </TabsTrigger>
              <TabsTrigger value="notes">
                <FileText className="mr-2 h-4 w-4" />
                Internal Notes
              </TabsTrigger>
              <TabsTrigger value="timeline">
                <Clock className="mr-2 h-4 w-4" />
                Timeline
              </TabsTrigger>
            </TabsList>

            <TabsContent value="conversation">
              <Card>
                <CardHeader>
                  <CardTitle>Conversation</CardTitle>
                  <CardDescription>
                    {ticket.replies.length} replies
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
                      replies?.map((reply) => (
                        <div key={reply.id} className="flex gap-4 border-b pb-4 last:border-0">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={reply.author.avatar} />
                            <AvatarFallback>
                              {reply.author.firstName[0]}
                              {reply.author.lastName[0]}
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
                            <p className="mt-1 whitespace-pre-wrap">{reply.content}</p>
                            {reply.attachments.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {reply.attachments.map((attachment) => (
                                  <a
                                    key={attachment.id}
                                    href={attachment.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 rounded-md border p-1 px-2 text-sm hover:bg-accent"
                                  >
                                    <Paperclip className="h-3 w-3" />
                                    {attachment.fileName}
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
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle>Internal Notes</CardTitle>
                  <CardDescription>
                    Notes visible only to your team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isLoadingNotes ? (
                      <div className="space-y-4">
                        {Array.from({ length: 2 }).map((_, i) => (
                          <Skeleton key={i} className="h-20 w-full" />
                        ))}
                      </div>
                    ) : (
                      notes?.map((note) => (
                        <div key={note.id} className="flex gap-4 border-b pb-4 last:border-0">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={note.author.avatar} />
                            <AvatarFallback>
                              {note.author.firstName[0]}
                              {note.author.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {note.author.firstName} {note.author.lastName}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(note.createdAt)}
                              </span>
                            </div>
                            <p className="mt-1 whitespace-pre-wrap">{note.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle>Timeline</CardTitle>
                  <CardDescription>
                    Complete history of this ticket
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isLoadingTimeline ? (
                      <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Skeleton key={i} className="h-12 w-full" />
                        ))}
                      </div>
                    ) : (
                      timeline?.map((event) => (
                        <div key={event.id} className="flex gap-3 border-b pb-3 last:border-0">
                          <div className="rounded-full bg-primary/10 p-1.5">
                            {event.type === 'created' && <AlertCircle className="h-4 w-4 text-primary" />}
                            {event.type === 'assigned' && <User className="h-4 w-4 text-primary" />}
                            {event.type === 'status_changed' && <Clock className="h-4 w-4 text-primary" />}
                            {event.type === 'replied' && <MessageSquare className="h-4 w-4 text-primary" />}
                            {event.type === 'resolved' && <CheckCircle className="h-4 w-4 text-success" />}
                            {event.type === 'closed' && <XCircle className="h-4 w-4 text-muted-foreground" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">{event.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {event.user.firstName} {event.user.lastName} •{' '}
                              {formatDate(event.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={ticket.customer.avatar} />
                  <AvatarFallback>
                    {ticket.customer.firstName[0]}
                    {ticket.customer.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {ticket.customer.firstName} {ticket.customer.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {ticket.customer.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {canEdit && (
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={ticket.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="pending_customer">Pending Customer</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select
                    value={ticket.priority}
                    onValueChange={handlePriorityChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Assign Agent</label>
                  <Select
                    value={ticket.assignedToId || 'unassigned'}
                    onValueChange={handleAssignment}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {/* This would be populated with available agents */}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleStatusChange('resolved')}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Resolve Ticket
                </Button>
              </CardContent>
            </Card>
          )}

          {/* SLA */}
          {ticket.sla && (
            <Card>
              <CardHeader>
                <CardTitle>SLA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">First Response</span>
                  <span className={cn(
                    'text-sm font-medium',
                    ticket.sla.firstResponse.breached && 'text-destructive'
                  )}>
                    {ticket.sla.firstResponse.respondedAt ? '✅' : '⏳'}
                    {' '}
                    {formatDate(ticket.sla.firstResponse.dueAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Resolution</span>
                  <span className={cn(
                    'text-sm font-medium',
                    ticket.sla.resolution.breached && 'text-destructive'
                  )}>
                    {ticket.sla.resolution.resolvedAt ? '✅' : '⏳'}
                    {' '}
                    {formatDate(ticket.sla.resolution.dueAt)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Reply Form */}
      {canEdit && ticket.status !== 'closed' && (
        <Card>
          <CardHeader>
            <CardTitle>Reply</CardTitle>
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
                maxFiles={5}
                maxSize={10 * 1024 * 1024}
                uploadProgress={uploadProgress}
              />

              <Button type="submit" disabled={isCreatingReply}>
                {isCreatingReply ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
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
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="mt-1 h-3 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
