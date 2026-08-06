'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BarChart3,
  Star,
  BookOpen,
  MessageSquare,
  CreditCard,
  Building2,
  Bell,
  type LucideIcon,
} from 'lucide-react'
import { useRole } from '@/hooks/use-role'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/tenant/dashboard', icon: LayoutDashboard },
  { label: 'Analytics', href: '/tenant/analytics', icon: BarChart3 },
  { label: 'Feedback', href: '/tenant/feedback', icon: Star },
  { label: 'Knowledge Base', href: '/tenant/knowledge-base', icon: BookOpen },
  { label: 'Messages', href: '/tenant/messages', icon: MessageSquare },
  { label: 'Billing', href: '/tenant/billing', icon: CreditCard },
  { label: 'Organization', href: '/tenant/organization', icon: Building2 },
  { label: 'Notifications', href: '/notifications', icon: Bell },
]

export function TenantSidebar() {
  const pathname = usePathname()
  const { user } = useRole()

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/tenant/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            S
          </div>
          <span className="text-lg font-bold">SupportFlow</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <p className="truncate text-sm font-medium">
          {user?.fullName || user?.email || 'User'}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {user?.email || ''}
        </p>
      </div>
    </aside>
  )
}
