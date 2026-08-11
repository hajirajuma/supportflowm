'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  BookOpen,
  Bell,
  Star,
  User,
  LogOut,
  Menu,
  X,
  Loader2,
  type LucideIcon,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

// Customer-facing routes only. No tenant-owner or platform-admin items.
const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/customer/dashboard', icon: LayoutDashboard },
  { label: 'My Tickets', href: '/customer/tickets', icon: Ticket },
  { label: 'Create Ticket', href: '/customer/tickets/new', icon: PlusCircle },
  { label: 'Knowledge Base', href: '/customer/knowledge-base', icon: BookOpen },
  { label: 'Notifications', href: '/notifications', icon: Bell },
  { label: 'Feedback', href: '/customer/feedback', icon: Star },
  { label: 'Profile', href: '/customer/profile', icon: User },
]

function isActive(pathname: string, href: string): boolean {
  if (href === '/customer/tickets') {
    // "My Tickets" is active for the list and detail pages, but not the
    // "Create Ticket" form (which has its own item).
    return (
      pathname === href ||
      (pathname.startsWith(`${href}/`) && !pathname.startsWith('/customer/tickets/new'))
    )
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function CustomerSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout, isLoggingOut } = useAuth()

  const userName = user?.fullName || user?.email || 'Customer'
  const userEmail = user?.email || ''

  const handleLogout = () => {
    setMobileOpen(false)
    logout()
  }

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center border-b px-4">
        <Link
          href="/customer/dashboard"
          className="flex items-center gap-2"
          onClick={() => setMobileOpen(false)}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            S
          </div>
          <span className="text-lg font-bold">SupportFlow</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(pathname, item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
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

      <div className="space-y-3 border-t p-4">
        <div>
          <p className="truncate text-sm font-medium">{userName}</p>
          <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          {isLoggingOut ? (
            <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
          ) : (
            <LogOut className="h-5 w-5 shrink-0" />
          )}
          <span>Logout</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 lg:hidden">
        <Link href="/customer/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            S
          </div>
          <span className="text-lg font-bold text-primary">SupportFlow</span>
        </Link>
        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMobileOpen((open) => !open)}
          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/50"
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r bg-background">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r bg-background lg:flex">
        {sidebarContent}
      </aside>
    </>
  )
}
