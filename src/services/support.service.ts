import { apiClient } from './api-client'
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
} from '@/types/support'

const SUPPORT_BASE = '/tickets'

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
    return apiClient.get(SUPPORT_BASE, { params: buildTicketParams(params) })
  },

  async getTicket(id: string): Promise<SupportTicket> {
    return apiClient.get<SupportTicket>(`${SUPPORT_BASE}/${id}`)
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
    return apiClient.get<TicketReply[]>(`${SUPPORT_BASE}/${ticketId}/replies`)
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
    return apiClient.get<InternalNote[]>(`${SUPPORT_BASE}/${ticketId}/notes`)
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
    return apiClient.get<TimelineEvent[]>(`${SUPPORT_BASE}/${ticketId}/timeline`)
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
