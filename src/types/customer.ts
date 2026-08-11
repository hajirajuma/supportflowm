import { User } from './auth'

// Backend canonical values (Prisma enums) — the wire contract.
export type TicketStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_CUSTOMER'
  | 'ON_HOLD'
  | 'ESCALATED'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REOPENED'

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export interface TicketCategoryRef {
  id: string
  name: string
  color?: string | null
  description?: string | null
}

export interface TicketUserRef {
  id: string
  firstName: string
  lastName: string
  email?: string | null
  avatarUrl?: string | null
}

export interface Ticket {
  id: string
  ticketNumber: string
  subject: string
  description?: string | null
  status: TicketStatus
  priority: TicketPriority
  source?: string
  categoryId?: string | null
  category?: TicketCategoryRef | null
  departmentId?: string | null
  department?: { id: string; name: string; description?: string | null } | null
  createdById: string
  createdBy?: TicketUserRef | null
  assignedToId?: string | null
  assignedTo?: TicketUserRef | null
  dueAt?: string | null
  firstRespondedAt?: string | null
  resolvedAt?: string | null
  closedAt?: string | null
  lastActivityAt?: string | null
  attachments: TicketAttachment[]
  replies: TicketReply[]
  createdAt: string
  updatedAt: string
}

export interface TicketAttachment {
  id: string
  originalName: string
  mimeType?: string
  fileSize?: number | bigint
  publicUrl?: string | null
  isEvidence?: boolean
  uploadedBy?: TicketUserRef
  createdAt: string
}

export interface TicketReply {
  id: string
  body: string
  isInternal: boolean
  replyType?: string
  author: TicketUserRef
  attachments: TicketAttachment[]
  ticketId: string
  createdAt: string
  updatedAt: string
}

export interface CreateTicketRequest {
  title: string
  description: string
  priority: TicketPriority
  attachments?: File[]
}

export interface UpdateTicketRequest {
  subject?: string
  description?: string
  status?: TicketStatus
  priority?: TicketPriority
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
  slug: string
  content: string
  excerpt?: string | null
  category?: {
    id: string
    name: string
    description?: string | null
    isActive?: boolean
    order?: number
    parentId?: string | null
  } | null
  categoryId?: string | null
  status?: string
  visibility?: string
  views: number
  likes?: number
  helpfulCount?: number
  tags: Array<{ id: string; name: string }>
  publishedAt?: string | null
  updatedAt: string
  createdAt: string
}

export interface CustomerStats {
  profile: {
    id: string
    email: string
    firstName: string
    lastName: string
    avatarUrl?: string | null
    role: string
    timezone?: string | null
    locale?: string | null
    darkMode?: boolean
  }
  organization: {
    id: string
    name: string
    slug?: string
    logo?: string | null
    website?: string | null
    timezone?: string | null
    locale?: string | null
    status?: string
  }
  recentTickets: Array<{
    id: string
    ticketNumber: string
    subject: string
    description?: string | null
    status: string
    priority: string
    createdAt: string
    updatedAt: string
  }>
  ticketStats: {
    total: number
    open: number
    resolved: number
    closed: number
    byStatus: Record<string, number>
  }
  recentNotifications: Array<{
    id: string
    type: string
    channel?: string
    title: string
    body?: string
    isRead: boolean
    createdAt: string
  }>
  unreadNotificationCount: number
  pendingFeedbackRequests: Array<{
    id: string
    title: string
    description?: string | null
  }>
  knowledgeBase: {
    categories: Array<{
      id: string
      name: string
      description?: string | null
      order?: number
      slug: string
      _count?: { articles: number }
    }>
    quickLinks: Array<{
      id: string
      title: string
      slug: string
      excerpt?: string | null
      views?: number
    }>
  }
  supportContact: unknown
}

export interface CustomerProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string | null
  avatarUrl?: string | null
  role: string
  status: string
  timezone?: string | null
  locale?: string | null
  darkMode?: boolean
  emailVerified?: boolean
  organizationId: string
  createdAt: string
}