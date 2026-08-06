'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Conversation, Message } from '@/types/notification'

export const MESSAGE_QUERY_KEYS = {
  conversations: ['messages', 'conversations'],
  messages: (id: string) => ['messages', 'conversation', id],
}

// Messaging is not supported by the backend yet. These hooks return empty
// data and no-op mutations so the UI remains functional.
export function useMessages() {
  const useConversations = (params?: any) => {
    return useQuery({
      queryKey: [...MESSAGE_QUERY_KEYS.conversations, params],
      queryFn: async () => ({ data: [] as Conversation[], total: 0 }),
      enabled: false,
    })
  }

  const useMessages = (conversationId: string, params?: any) => {
    return useQuery({
      queryKey: [...MESSAGE_QUERY_KEYS.messages(conversationId), params],
      queryFn: async () => ({ data: [] as Message[] }),
      enabled: false,
    })
  }

  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: string; content: string }) => {
      toast.info('Messaging is not available yet')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send message')
    },
  })

  const markAllAsRead = (conversationId: string) => {
    // No-op: messaging backend not available
  }

  return {
    useConversations,
    useMessages,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
    markAllAsRead,
  }
}
