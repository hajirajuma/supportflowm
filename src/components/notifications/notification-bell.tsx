'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import { useNotifications } from '@/hooks/use-notifications'
import { useNotificationStore } from '@/store/notification-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NotificationList } from './notification-list'
import { motion, AnimatePresence } from 'framer-motion'

interface NotificationBellProps {
  className?: string
}

export function NotificationBell({ className }: NotificationBellProps) {
  const { unreadCount } = useNotificationStore()
  const { useNotificationList } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data, isLoading } = useNotificationList({
    limit: 5,
    filters: { read: false },
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-1 -top-1"
                >
                  <Badge
                    variant="destructive"
                    className="h-5 min-w-[1.25rem] rounded-full px-1 text-xs font-medium"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[380px] p-0"
          sideOffset={8}
        >
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <span className="text-sm text-muted-foreground">
                  {unreadCount} unread
                </span>
              )}
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            <NotificationList
              notifications={data?.data || []}
              isLoading={isLoading}
              onNotificationClick={() => setIsOpen(false)}
            />
          </div>

          <div className="border-t p-2">
            <Link href="/notifications">
              <Button variant="ghost" className="w-full text-sm">
                View all notifications
              </Button>
            </Link>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}