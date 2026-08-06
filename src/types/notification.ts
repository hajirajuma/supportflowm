export type NotificationType = 
  | 'ticket_created'
  | 'ticket_updated'
  | 'ticket_assigned'
  | 'ticket_resolved'
  | 'ticket_closed'
  | 'ticket_replied'
  | 'feedback_received'
  | 'feedback_replied'
  | 'message_received'
  | 'system_announcement'
  | 'invitation_accepted'
  | 'member_joined'
  | 'sla_warning'

export type NotificationPriority = 'low' | 'medium' | 'high'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  description: string
  priority: NotificationPriority
  read: boolean
  data?: Record<string, any>
  link?: string
  createdAt: string
  updatedAt: string
}

export interface NotificationPreferences {
  email: {
    ticketCreated: boolean
    ticketUpdated: boolean
    ticketResolved: boolean
    newReply: boolean
    feedbackReceived: boolean
    messageReceived: boolean
  }
  inApp: {
    ticketUpdates: boolean
    replies: boolean
    feedback: boolean
    systemAlerts: boolean
  }
  communication: {
    productUpdates: boolean
    announcements: boolean
  }
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  sender: {
    id: string
    firstName: string
    lastName: string
    avatar?: string
  }
  content: string
  attachments: MessageAttachment[]
  read: boolean
  readAt?: string
  createdAt: string
  updatedAt: string
}

export interface MessageAttachment {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  fileUrl: string
  messageId: string
  createdAt: string
}

export interface Conversation {
  id: string
  participants: Array<{
    id: string
    firstName: string
    lastName: string
    avatar?: string
    online?: boolean
    lastSeen?: string
  }>
  lastMessage?: Message
  unreadCount: number
  ticketId?: string
  ticketNumber?: string
  createdAt: string
  updatedAt: string
}

export interface RealtimeEvent {
  type: 'notification' | 'message' | 'ticket_update' | 'typing' | 'online_status'
  data: any
  timestamp: string
}

export interface TypingIndicator {
  conversationId: string
  userId: string
  isTyping: boolean
}

export interface NotificationFilters {
  type?: NotificationType[]
  read?: boolean
  priority?: NotificationPriority[]
  dateFrom?: string
  dateTo?: string
}