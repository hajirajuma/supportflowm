'use client'

import { useState, useEffect, useRef } from 'react'
import { useMessages as useMessagesHook } from '@/hooks/use-messages'
import { useAuth } from '@/hooks/use-auth'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import {
  Send,
  Paperclip,
  MoreVertical,
  Search,
  MessageSquare,
  Users,
} from 'lucide-react'

export default function MessagesPage() {
  const { user } = useAuth()
  const { useConversations, useMessages, sendMessage, markAllAsRead } = useMessagesHook()
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [page] = useState(1)
  const [limit] = useState(50)

  const { data: conversations, isLoading: isLoadingConversations } = useConversations({
    page,
    limit,
  })

  const { data: messagesData, isLoading: isLoadingMessages } = useMessages(
    selectedConversation || '',
    { page: 1, limit: 50 }
  )

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return
    await sendMessage({
      conversationId: selectedConversation,
      content: messageInput,
    })
    setMessageInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messagesData])

  const selectedConversationData = conversations?.data.find(
    (c) => c.id === selectedConversation
  )

  return (
    <div className="h-[calc(100vh-12rem)]">
      <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <Badge variant="secondary">
                {conversations?.total || 0}
              </Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-20rem)]">
              {isLoadingConversations ? (
                <div className="space-y-4 p-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y">
                  {conversations?.data.map((conversation) => {
                    const participant = conversation.participants.find(
                      (p) => p.id !== user?.id
                    )
                    return (
                      <button
                        key={conversation.id}
                        onClick={() => {
                          setSelectedConversation(conversation.id)
                          markAllAsRead(conversation.id)
                        }}
                        className={cn(
                          'w-full px-4 py-3 text-left transition-colors hover:bg-muted/50',
                          selectedConversation === conversation.id && 'bg-muted'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={participant?.avatar} />
                            <AvatarFallback>
                              {participant?.firstName[0]}
                              {participant?.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">
                                {participant?.firstName} {participant?.lastName}
                              </p>
                              {conversation.lastMessage && (
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(
                                    new Date(conversation.lastMessage.createdAt),
                                    { addSuffix: true }
                                  )}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="truncate text-sm text-muted-foreground">
                                {conversation.lastMessage?.content || 'No messages'}
                              </p>
                              {conversation.unreadCount > 0 && (
                                <Badge variant="destructive" className="ml-2">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Messages Area */}
        <Card className="lg:col-span-2">
          {selectedConversation ? (
            <>
              <CardHeader className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedConversationData && (
                      <>
                        <Avatar>
                          <AvatarImage
                            src={selectedConversationData.participants.find(
                              (p) => p.id !== user?.id
                            )?.avatar}
                          />
                          <AvatarFallback>
                            {selectedConversationData.participants
                              .find((p) => p.id !== user?.id)
                              ?.firstName[0]}
                            {selectedConversationData.participants
                              .find((p) => p.id !== user?.id)
                              ?.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {selectedConversationData.participants
                              .find((p) => p.id !== user?.id)
                              ?.firstName}{' '}
                            {selectedConversationData.participants
                              .find((p) => p.id !== user?.id)
                              ?.lastName}
                          </p>
                          {selectedConversationData.participants.find(
                            (p) => p.id !== user?.id
                          )?.online && (
                            <p className="text-xs text-success">Online</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-24rem)] p-4">
                  {isLoadingMessages ? (
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            'flex',
                            i % 2 === 0 ? 'justify-start' : 'justify-end'
                          )}
                        >
                          <Skeleton className="h-16 w-3/4" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messagesData?.data.map((message, index) => {
                        const isOwn = message.senderId === user?.id
                        const showAvatar =
                          index === 0 ||
                          messagesData.data[index - 1]?.senderId !== message.senderId

                        return (
                          <div
                            key={message.id}
                            className={cn(
                              'flex gap-3',
                              isOwn ? 'flex-row-reverse' : 'flex-row'
                            )}
                          >
                            {!isOwn && showAvatar && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={message.sender.avatar} />
                                <AvatarFallback>
                                  {message.sender.firstName[0]}
                                  {message.sender.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={cn(
                                'max-w-[80%] rounded-lg p-3',
                                isOwn
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              )}
                            >
                              {!isOwn && showAvatar && (
                                <p className="mb-1 text-xs font-medium">
                                  {message.sender.firstName} {message.sender.lastName}
                                </p>
                              )}
                              <p className="text-sm">{message.content}</p>
                              <p
                                className={cn(
                                  'mt-1 text-xs',
                                  isOwn
                                    ? 'text-primary-foreground/70'
                                    : 'text-muted-foreground'
                                )}
                              >
                                {formatDistanceToNow(new Date(message.createdAt), {
                                  addSuffix: true,
                                })}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <MessageSquare className="h-16 w-16" />
              <p className="mt-4 text-lg font-medium">No conversation selected</p>
              <p className="text-sm">Choose a conversation to start messaging</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}