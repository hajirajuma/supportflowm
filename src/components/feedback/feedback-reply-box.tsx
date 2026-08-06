'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Send } from 'lucide-react'

interface FeedbackReplyBoxProps {
  onSend: (reply: string) => void | Promise<void>
  isSending?: boolean
  placeholder?: string
  disabled?: boolean
}

export function FeedbackReplyBox({
  onSend,
  isSending = false,
  placeholder = 'Type your reply...',
  disabled = false,
}: FeedbackReplyBoxProps) {
  const [reply, setReply] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!reply.trim() || isSending) return
    await onSend(reply.trim())
    setReply('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder={placeholder}
        rows={4}
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        disabled={disabled || isSending}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={!reply.trim() || isSending || disabled}>
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Reply
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
