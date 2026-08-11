'use client'

import { useState } from 'react'
import { useNotifications } from '@/hooks/use-notifications'
import { useNotificationStore } from '@/store/notification-store'
import { NotificationList } from '@/components/notifications/notification-list'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCheck, Filter, Trash2 } from 'lucide-react'
import { NotificationFilters } from '@/types/notification'

export default function NotificationCenterPage() {
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [readFilter, setReadFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  const { useNotificationList, markAllAsRead, deleteNotification } = useNotifications()
  const { markAllAsRead: markAllAsReadStore } = useNotificationStore()

  const filters: NotificationFilters = {
    ...(typeFilter !== 'all' && { type: [typeFilter as any] }),
    ...(readFilter !== 'all' && { read: readFilter === 'unread' }),
    ...(priorityFilter !== 'all' && { priority: [priorityFilter as any] }),
  }

  const { data, isLoading } = useNotificationList({ page, limit, filters })

  const handleMarkAllAsRead = () => {
    markAllAsRead()
    markAllAsReadStore()
  }

  return (
    <div className="container max-w-5xl py-8 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with important events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={!data?.unread}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Center</CardTitle>
          <CardDescription>
            All your notifications in one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="ticket_created">Tickets</SelectItem>
                  <SelectItem value="feedback_received">Feedback</SelectItem>
                  <SelectItem value="message_received">Messages</SelectItem>
                  <SelectItem value="system_announcement">System</SelectItem>
                </SelectContent>
              </Select>

              <Select value={readFilter} onValueChange={setReadFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex-1" />

              <span className="text-sm text-muted-foreground self-center">
                {data?.total || 0} notifications
                {data && data.unread > 0 && ` (${data.unread} unread)`}
              </span>
            </div>

            {/* Notification List */}
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-4 p-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <NotificationList
                notifications={data?.data || []}
                onNotificationClick={() => {}}
              />
            )}

            {/* Pagination */}
            {data && data.total > data.limit && (
              <div className="flex items-center justify-between border-t pt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {(data.page - 1) * data.limit + 1} to{' '}
                  {Math.min(data.page * data.limit, data.total)} of {data.total}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= Math.ceil(data.total / data.limit)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}