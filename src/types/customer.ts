import { User } from './auth'

export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical'
export type TicketCategory = 'technical' | 'billing' | 'feature_request' | 'bug_report' | 'general'

export interface Ticket {
  id: string
  ticketNumber: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category: TicketCategory
  customerId: string
  customer: User
  assignedToId?: string
  assignedTo?: User
  departmentId?: string
  attachments: TicketAttachment[]
  replies: TicketReply[]
  timeline: TicketTimelineEvent[]
  resolvedAt?: string
  closedAt?: string
  createdAt: string
  updatedAt: string
}

export interface TicketAttachment {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  fileUrl: string
  uploadedBy: User
  ticketId: string
  createdAt: string
}

export interface TicketReply {
  id: string
  content: string
  isInternal: boolean
  author: User
  attachments: TicketAttachment[]
  ticketId: string
  createdAt: string
  updatedAt: string
}

export interface TicketTimelineEvent {
  id: string
  type: 'created' | 'assigned' | 'status_changed' | 'replied' | 'attachment_added' | 'resolved' | 'closed'
  description: string
  user: User
  metadata?: Record<string, any>
  createdAt: string
}

export interface CreateTicketRequest {
  title: string
  description: string
  category: TicketCategory
  priority: TicketPriority
  attachments?: File[]
}

export interface UpdateTicketRequest {
  title?: string
  description?: string
  status?: TicketStatus
  priority?: TicketPriority
  category?: TicketCategory
}

export interface CreateReplyRequest {
  content: string
  attachments?: File[]
  isInternal?: boolean
}

export interface Notification {
  id: string
  type: 'ticket_update' | 'reply' | 'feedback_request' | 'announcement'
  title: string
  message: string
  read: boolean
  data?: Record<string, any>
  createdAt: string
}

export interface Feedback {
  id: string
  ticketId: string
  rating: number
  comment?: string
  submittedAt: string
}

export interface KnowledgeArticle {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  featured: boolean
  views: number
  publishedAt: string
  updatedAt: string
}

export interface CustomerStats {
  totalTickets: number
  openTickets: number
  pendingTickets: number
  resolvedTickets: number
  pendingFeedback: number
  recentActivities: Array<{
    id: string
    type: string
    description: string
    timestamp: string
  }>
}

export interface CustomerProfile {
  id: string
  user: User
  phoneNumber?: string
  profilePicture?: string
  organization: {
    id: string
    name: string
    logo?: string
    primaryColor: string
    secondaryColor: string
  }
  createdAt: string
  updatedAt: string
}