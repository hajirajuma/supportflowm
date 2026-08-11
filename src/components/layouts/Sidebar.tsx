'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Ticket,
  CreditCard,
  Bell,
  ChevronsLeft,
  type LucideIcon,
} from 'lucide-react'
import { useRole } from '@/hooks/use-role'
import { cn } from '@/lib/utils'

interface SidebarProps {
  open: boolean
  onToggle: () => void
}

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export function Sidebar({ open, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { isPlatformAdmin, isSupportAgent } = useRole()

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: isPlatformAdmin ? '/admin/dashboard' : '/support/dashboard',
      icon: LayoutDashboard,
    },
    ...(isSupportAgent
      ? [{ label: 'Tickets', href: '/support/tickets', icon: Ticket }]
      : []),
    ...(isPlatformAdmin
      ? [{ label: 'Billing', href: '/admin/billing', icon: CreditCard }]
      : []),
    { label: 'Notifications', href: '/notifications', icon: Bell },
  ]

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-background transition-all duration-300',
        open ? 'w-64' : 'w-16'
      )}
    >
      <div className={cn('flex h-16 items-center border-b px-4', !open && 'justify-center px-2')}>
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            S
          </div>
          {open && <span className="text-lg font-bold">SupportFlow</span>}
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
              title={item.label}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                !open && 'justify-center px-2'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {open && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-3">
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
            !open && 'justify-center px-2'
          )}
          aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <ChevronsLeft className={cn('h-5 w-5 shrink-0', !open && 'rotate-180')} />
          {open && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
