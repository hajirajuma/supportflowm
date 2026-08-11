import { apiClient } from './api-client'
import { User } from '@/types/auth'
import {
  SupportTicket,
  SupportStats,
  TicketFilters,
  CreateSupportTicketRequest,
  UpdateSupportTicketRequest,
  CreateReplyRequest,
  CreateNoteRequest,
  BulkActionRequest,
  SavedFilter,
  TicketComment,
  Department,
  TicketReply,
  InternalNote,
  TimelineEvent,
  TicketStatus,
  TicketPriority,
  TicketCategory,
  TicketAttachment,
  SLAInfo,
} from '@/types/support'

const SUPPORT_BASE = '/tickets'

/**
 * The backend exposes tickets with raw Prisma fields (subject, UPPERCASE
 * status/priority, createdBy, category object, ticketTags, originalName/
 * publicUrl attachments). The frontend components expect the SupportTicket
 * shape (title, lowercase status/priority, customer, string category, tags,
 * fileName/fileUrl). These helpers bridge the two so the ticket pages don't
 * crash on `ticket.customer.firstName` or render empty cells.
 */
function toUser(raw: any): User {
  return {
    id: raw?.id ?? '',
    email: raw?.email ?? '',
    firstName: raw?.firstName ?? '',
    lastName: raw?.lastName ?? '',
    fullName: `${raw?.firstName ?? ''} ${raw?.lastName ?? ''}`.trim(),
    avatar: raw?.avatar ?? raw?.avatarUrl,
    roles: [],
    permissions: [],
    emailVerified: false,
    isActive: true,
    createdAt: raw?.createdAt ?? new Date().toISOString(),
    updatedAt: raw?.updatedAt ?? new Date().toISOString(),
  }
}

function normalizeStatus(status?: string): TicketStatus {
  switch ((status ?? '').toUpperCase()) {
    case 'NEW':
      return 'new'
    case 'OPEN':
      return 'open'
    case 'IN_PROGRESS':
      return 'in_progress'
    case 'WAITING_FOR_CUSTOMER':
    case 'ON_HOLD':
    case 'PENDING_CUSTOMER':
      return 'pending_customer'
    case 'RESOLVED':
      return 'resolved'
    case 'CLOSED':
      return 'closed'
    default:
      return 'open'
  }
}

function normalizePriority(priority?: string): TicketPriority {
  const value = (priority ?? '').toLowerCase()
  return ['low', 'medium', 'high', 'critical', 'urgent'].includes(value)
    ? (value as TicketPriority)
    : 'medium'
}

function toAttachment(raw: any, ticketId: string): TicketAttachment {
  return {
    id: raw?.id,
    fileName: raw?.fileName ?? raw?.originalName ?? '',
    fileSize: raw?.fileSize ?? 0,
    fileType: raw?.fileType ?? raw?.mimeType ?? '',
    fileUrl: raw?.fileUrl ?? raw?.publicUrl ?? '',
    uploadedBy: toUser(raw?.uploadedBy),
    ticketId: raw?.ticketId ?? ticketId,
    createdAt: raw?.createdAt ?? new Date().toISOString(),
  }
}

function toReply(raw: any): TicketReply {
  return {
    id: raw?.id,
    content: raw?.content ?? raw?.body ?? '',
    isInternal: raw?.isInternal ?? false,
    author: toUser(raw?.author ?? raw?.createdBy),
    attachments: (raw?.attachments ?? []).map((a: any) =>
      toAttachment(a, raw?.ticketId ?? '')
    ),
    isDraft: raw?.isDraft ?? false,
    ticketId: raw?.ticketId ?? '',
    createdAt: raw?.createdAt ?? new Date().toISOString(),
    updatedAt: raw?.updatedAt ?? raw?.createdAt ?? new Date().toISOString(),
  }
}

function toNote(raw: any): InternalNote {
  return {
    id: raw?.id,
    content: raw?.content ?? raw?.body ?? '',
    author: toUser(raw?.author ?? raw?.createdBy),
    ticketId: raw?.ticketId ?? '',
    createdAt: raw?.createdAt ?? new Date().toISOString(),
    updatedAt: raw?.updatedAt ?? raw?.createdAt ?? new Date().toISOString(),
  }
}

function mapActivityType(type?: string): TimelineEvent['type'] {
  switch ((type ?? '').toUpperCase()) {
    case 'CREATED':
      return 'created'
    case 'ASSIGNED':
      return 'assigned'
    case 'STATUS_CHANGED':
      return 'status_changed'
    case 'PRIORITY_CHANGED':
      return 'priority_changed'
    case 'CATEGORY_CHANGED':
      return 'category_changed'
    case 'REPLY_ADDED':
    case 'CUSTOMER_REPLY':
      return 'replied'
    case 'NOTE_ADDED':
      return 'note_added'
    case 'ATTACHMENT_ADDED':
      return 'attachment_added'
    case 'RESOLVED':
      return 'resolved'
    case 'CLOSED':
      return 'closed'
    case 'REOPENED':
      return 'reopened'
    case 'MERGED':
      return 'merged'
    default:
      return 'status_changed'
  }
}

function toTimelineEvent(raw: any): TimelineEvent {
  return {
    id: raw?.id,
    type: mapActivityType(raw?.activityType ?? raw?.type),
    description: raw?.description ?? raw?.title ?? 'Activity',
    user: toUser(raw?.actor ?? raw?.user),
    metadata: raw?.metadata,
    createdAt: raw?.createdAt ?? new Date().toISOString(),
  }
}

function mapTicket(raw: any): SupportTicket {
  const categoryRaw = raw?.category
  const category = (
    typeof categoryRaw === 'string' ? categoryRaw : categoryRaw?.name ?? 'general'
  ) as TicketCategory

  const tags = Array.isArray(raw?.tags)
    ? raw.tags
    : (raw?.ticketTags ?? [])
        .map((t: any) => t?.tag?.name ?? t?.name ?? '')
        .filter(Boolean)

  return {
    id: raw.id,
    ticketNumber: raw.ticketNumber,
    title: raw.title ?? raw.subject ?? '',
    description: raw.description ?? '',
    status: normalizeStatus(raw?.status),
    priority: normalizePriority(raw?.priority),
    category,
    customerId: (raw?.customer ?? raw?.createdBy)?.id ?? '',
    customer: toUser(raw?.customer ?? raw?.createdBy),
    assignedToId: raw?.assignedToId,
    assignedTo: raw?.assignedTo ? toUser(raw.assignedTo) : undefined,
    departmentId: raw?.departmentId,
    department: raw?.department,
    organizationId: raw?.organizationId,
    attachments: (raw?.attachments ?? []).map((a: any) => toAttachment(a, raw.id)),
    replies: raw?.replies ?? [],
    notes: raw?.notes ?? [],
    timeline: raw?.timeline ?? [],
    tags,
    dueDate: raw?.dueAt,
    sla: raw?.sla ?? ({} as SLAInfo),
    firstResponseAt: raw?.firstRespondedAt,
    resolvedAt: raw?.resolvedAt,
    closedAt: raw?.closedAt,
    createdAt: raw?.createdAt,
    updatedAt: raw?.updatedAt ?? raw?.lastActivityAt ?? raw?.createdAt,
  }
}

function buildTicketParams(params?: {
  page?: number
  limit?: number
  filters?: TicketFilters
  sort?: string
  order?: 'asc' | 'desc'
}): Record<string, string | number> {
  const p = params ?? {}
  const query: Record<string, string | number | undefined> = {
    page: p.page,
    limit: p.limit,
    sort: p.sort,
    order: p.order,
    search: p.filters?.search,
    status: p.filters?.status?.[0],
    priority: p.filters?.priority?.[0],
    categoryId: p.filters?.category?.[0],
    departmentId: p.filters?.department?.[0],
    assignedToId: p.filters?.assignedTo?.[0],
    customerId: p.filters?.customer?.[0],
    dateFrom: p.filters?.dateFrom,
    dateTo: p.filters?.dateTo,
  }
  const result: Record<string, string | number> = {}
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') {
      result[key] = value
    }
  }
  return result
}

export const supportService = {
  // Stats
  async getStats(): Promise<SupportStats> {
    const list = await apiClient.get<{ data: SupportTicket[]; total: number }>(
      SUPPORT_BASE,
      { params: { page: 1, limit: 1 } }
    )
    return {
      total: list.total ?? 0,
      new: 0,
      open: 0,
      inProgress: 0,
      pendingCustomer: 0,
      resolved: 0,
      closed: 0,
      overdue: 0,
      assigned: 0,
      unassigned: 0,
      highPriority: 0,
      slaViolations: 0,
      averageFirstResponse: 0,
      averageResolution: 0,
      recentActivity: [],
    }
  },

  // Tickets
  async getTickets(params?: {
    page?: number
    limit?: number
    filters?: TicketFilters
    sort?: string
    order?: 'asc' | 'desc'
  }): Promise<{ data: SupportTicket[]; total: number; page: number; limit: number }> {
    const res = await apiClient.get<any>(SUPPORT_BASE, {
      params: buildTicketParams(params),
    })
    return {
      data: (res?.data ?? []).map(mapTicket),
      total: res?.total ?? 0,
      page: res?.page ?? 1,
      limit: res?.limit ?? 0,
    }
  },

  async getTicket(id: string): Promise<SupportTicket> {
    const res = await apiClient.get<any>(`${SUPPORT_BASE}/${id}`)
    return mapTicket(res)
  },

  async createTicket(data: CreateSupportTicketRequest): Promise<SupportTicket> {
    return apiClient.post<SupportTicket>(SUPPORT_BASE, {
      subject: data.title,
      description: data.description,
      categoryId: data.category,
      departmentId: data.departmentId,
      priority: data.priority,
      dueAt: data.dueDate,
      customerId: data.customerId,
      tagIds: data.tags,
    })
  },

  async updateTicket(id: string, data: UpdateSupportTicketRequest): Promise<SupportTicket> {
    return apiClient.patch<SupportTicket>(`${SUPPORT_BASE}/${id}`, {
      subject: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      categoryId: data.category,
      assignedToId: data.assignedToId,
      departmentId: data.departmentId,
      dueAt: data.dueDate,
      tagIds: data.tags,
    })
  },

  async deleteTicket(id: string): Promise<{ message: string }> {
    return apiClient.delete(`${SUPPORT_BASE}/${id}`)
  },

  // Status / priority / assignment actions
  async updateStatus(id: string, status: SupportTicket['status']): Promise<SupportTicket> {
    return apiClient.patch<SupportTicket>(`${SUPPORT_BASE}/${id}/status`, { status })
  },

  async updatePriority(id: string, priority: SupportTicket['priority']): Promise<SupportTicket> {
    return apiClient.patch<SupportTicket>(`${SUPPORT_BASE}/${id}/priority`, { priority })
  },

  async assignTicket(id: string, assigneeId: string): Promise<SupportTicket> {
    return apiClient.patch<SupportTicket>(`${SUPPORT_BASE}/${id}/assign`, { assigneeId })
  },

  async reassignTicket(id: string, assigneeId: string): Promise<SupportTicket> {
    return apiClient.patch<SupportTicket>(`${SUPPORT_BASE}/${id}/reassign`, { assigneeId })
  },

  async closeTicket(id: string, reason?: string): Promise<SupportTicket> {
    return apiClient.patch<SupportTicket>(`${SUPPORT_BASE}/${id}/close`, { reason })
  },

  async reopenTicket(id: string): Promise<SupportTicket> {
    return apiClient.patch<SupportTicket>(`${SUPPORT_BASE}/${id}/reopen`)
  },

  // Bulk Actions
  async bulkAction(data: BulkActionRequest): Promise<{ message: string; count: number }> {
    return apiClient.post(`${SUPPORT_BASE}/bulk`, data)
  },

  // Replies
  async getReplies(ticketId: string): Promise<TicketReply[]> {
    const res = await apiClient.get<any>(`${SUPPORT_BASE}/${ticketId}/replies`)
    return (Array.isArray(res) ? res : res?.data ?? []).map(toReply)
  },

  async createReply(ticketId: string, data: CreateReplyRequest): Promise<TicketReply> {
    return apiClient.post<TicketReply>(`${SUPPORT_BASE}/${ticketId}/replies`, {
      body: data.content,
      isInternal: data.isInternal ?? false,
    })
  },

  async updateReply(
    ticketId: string,
    replyId: string,
    data: { content: string }
  ): Promise<TicketReply> {
    return apiClient.patch<TicketReply>(`${SUPPORT_BASE}/replies/${replyId}`, {
      body: data.content,
    })
  },

  async deleteReply(ticketId: string, replyId: string): Promise<{ message: string }> {
    return apiClient.delete(`${SUPPORT_BASE}/replies/${replyId}`)
  },

  // Internal Notes
  async getNotes(ticketId: string): Promise<InternalNote[]> {
    const res = await apiClient.get<any>(`${SUPPORT_BASE}/${ticketId}/notes`)
    return (Array.isArray(res) ? res : res?.data ?? []).map(toNote)
  },

  async createNote(ticketId: string, data: CreateNoteRequest): Promise<InternalNote> {
    return apiClient.post<InternalNote>(`${SUPPORT_BASE}/${ticketId}/notes`, data)
  },

  async updateNote(
    ticketId: string,
    noteId: string,
    data: { content: string }
  ): Promise<InternalNote> {
    return apiClient.patch(`${SUPPORT_BASE}/${ticketId}/notes/${noteId}`, data)
  },

  async deleteNote(ticketId: string, noteId: string): Promise<{ message: string }> {
    return apiClient.delete(`${SUPPORT_BASE}/${ticketId}/notes/${noteId}`)
  },

  // Timeline
  async getTimeline(ticketId: string): Promise<TimelineEvent[]> {
    const res = await apiClient.get<any>(`${SUPPORT_BASE}/${ticketId}/timeline`)
    return (Array.isArray(res) ? res : res?.data ?? []).map(toTimelineEvent)
  },

  // Watchers
  async addWatcher(ticketId: string, userId: string): Promise<{ message: string }> {
    return apiClient.post(`${SUPPORT_BASE}/${ticketId}/watchers`, { userId })
  },

  async removeWatcher(ticketId: string, watcherId: string): Promise<{ message: string }> {
    return apiClient.delete(`${SUPPORT_BASE}/${ticketId}/watchers/${watcherId}`)
  },

  // Departments
  async getDepartments(): Promise<Department[]> {
    return apiClient.get<Department[]>(`/departments`)
  },

  // Saved Filters
  async getSavedFilters(): Promise<SavedFilter[]> {
    return apiClient.get<SavedFilter[]>(`${SUPPORT_BASE}/filters`)
  },

  async saveFilter(
    data: Omit<SavedFilter, 'id' | 'createdBy' | 'createdAt'>
  ): Promise<SavedFilter> {
    return apiClient.post<SavedFilter>(`${SUPPORT_BASE}/filters`, data)
  },

  async deleteSavedFilter(id: string): Promise<{ message: string }> {
    return apiClient.delete(`${SUPPORT_BASE}/filters/${id}`)
  },

  // Export
  async exportTickets(format: 'csv' | 'excel' | 'pdf', filters?: TicketFilters): Promise<Blob> {
    return apiClient.get(`${SUPPORT_BASE}/export`, {
      params: { format, ...buildTicketParams({ filters }) },
      responseType: 'blob',
    })
  },

  // Comments (for customer replies)
  async getComments(ticketId: string): Promise<TicketComment[]> {
    return apiClient.get<TicketComment[]>(`${SUPPORT_BASE}/${ticketId}/comments`)
  },
}
