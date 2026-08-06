import { User } from './auth'

export type TicketStatus = 'new' | 'open' | 'in_progress' | 'pending_customer' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical' | 'urgent'
export type TicketCategory = 'technical' | 'billing' | 'feature_request' | 'bug_report' | 'general' | 'security' | 'performance'

export interface SupportTicket {
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
  department?: Department
  organizationId: string
  attachments: TicketAttachment[]
  replies: TicketReply[]
  notes: InternalNote[]
  timeline: TimelineEvent[]
  tags: string[]
  dueDate?: string
  sla: SLAInfo
  firstResponseAt?: string
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
  isDraft: boolean
  ticketId: string
  createdAt: string
  updatedAt: string
}

export interface InternalNote {
  id: string
  content: string
  author: User
  ticketId: string
  createdAt: string
  updatedAt: string
}

export interface TimelineEvent {
  id: string
  type: 'created' | 'assigned' | 'status_changed' | 'priority_changed' | 
        'category_changed' | 'replied' | 'note_added' | 'attachment_added' |
        'resolved' | 'closed' | 'reopened' | 'merged'
  description: string
  user: User
  metadata?: Record<string, any>
  createdAt: string
}

export interface SLAInfo {
  firstResponse: {
    dueAt: string
    breached: boolean
    respondedAt?: string
  }
  resolution: {
    dueAt: string
    breached: boolean
    resolvedAt?: string
  }
  priority: TicketPriority
}

export interface Department {
  id: string
  name: string
  description?: string
  head?: User
  members: User[]
  ticketCount: number
  createdAt: string
  updatedAt: string
}

export interface SupportStats {
  total: number
  new: number
  open: number
  inProgress: number
  pendingCustomer: number
  resolved: number
  closed: number
  overdue: number
  assigned: number
  unassigned: number
  highPriority: number
  slaViolations: number
  averageFirstResponse: number
  averageResolution: number
  recentActivity: Array<{
    id: string
    type: string
    description: string
    ticketNumber: string
    timestamp: string
  }>
}

export interface TicketFilters {
  status?: TicketStatus[]
  priority?: TicketPriority[]
  category?: TicketCategory[]
  department?: string[]
  assignedTo?: string[]
  customer?: string[]
  search?: string
  dateFrom?: string
  dateTo?: string
  dueDate?: string
  sla?: 'breached' | 'at_risk' | 'on_track'
  hasAttachments?: boolean
  tags?: string[]
}

export interface CreateSupportTicketRequest {
  title: string
  description: string
  category: TicketCategory
  priority: TicketPriority
  customerId: string
  departmentId?: string
  assignedToId?: string
  tags?: string[]
  dueDate?: string
  attachments?: File[]
}

export interface UpdateSupportTicketRequest {
  title?: string
  description?: string
  status?: TicketStatus
  priority?: TicketPriority
  category?: TicketCategory
  assignedToId?: string
  departmentId?: string
  dueDate?: string
  tags?: string[]
}

export interface CreateReplyRequest {
  content: string
  isInternal?: boolean
  attachments?: File[]
  isDraft?: boolean
}

export interface CreateNoteRequest {
  content: string
}

export interface BulkActionRequest {
  ticketIds: string[]
  action: 'assign' | 'close' | 'delete' | 'change_priority' | 'change_category'
  data?: any
}

export interface SavedFilter {
  id: string
  name: string
  filters: TicketFilters
  createdBy: User
  shared: boolean
  createdAt: string
}

export interface TicketComment {
  id: string
  content: string
  author: User
  isInternal: boolean
  attachments: TicketAttachment[]
  createdAt: string
  updatedAt: string
}