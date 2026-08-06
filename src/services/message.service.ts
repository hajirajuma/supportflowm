import { apiClient } from './api-client'
import { Conversation, Message, MessageAttachment } from '@/types/notification'

const MESSAGE_BASE = '/messages'

export const messageService = {
  // Get conversations
  async getConversations(params?: {
    page?: number
    limit?: number
  }): Promise<{ data: Conversation[]; total: number; page: number; limit: number }> {
    return apiClient.get(`${MESSAGE_BASE}/conversations`, { params })
  },

  // Get conversation messages
  async getMessages(
    conversationId: string,
    params?: { page?: number; limit?: number }
  ): Promise<{ data: Message[]; total: number; page: number; limit: number }> {
    return apiClient.get(`${MESSAGE_BASE}/conversations/${conversationId}/messages`, {
      params,
    })
  },

  // Send message
  async sendMessage(
    conversationId: string,
    data: { content: string; attachments?: File[] }
  ): Promise<Message> {
    const formData = new FormData()
    formData.append('content', data.content)
    if (data.attachments) {
      data.attachments.forEach((file) => formData.append('attachments', file))
    }
    return apiClient.post(`${MESSAGE_BASE}/conversations/${conversationId}/messages`, formData)
  },

  // Upload attachment
  async uploadAttachment(
    conversationId: string,
    file: File
  ): Promise<{ attachment: MessageAttachment }> {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post(`${MESSAGE_BASE}/conversations/${conversationId}/attachments`, formData)
  },

  // Mark message as read
  async markAsRead(conversationId: string, messageId: string): Promise<{ message: string }> {
    return apiClient.post(`${MESSAGE_BASE}/conversations/${conversationId}/messages/${messageId}/read`)
  },

  // Mark all messages as read in conversation
  async markAllAsRead(conversationId: string): Promise<{ message: string }> {
    return apiClient.post(`${MESSAGE_BASE}/conversations/${conversationId}/read-all`)
  },

  // Get unread count
  async getUnreadCount(): Promise<{ count: number }> {
    return apiClient.get(`${MESSAGE_BASE}/unre