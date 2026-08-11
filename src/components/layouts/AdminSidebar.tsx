'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChevronDown,
  ChevronRight,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  UserCircle,
  X,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useAuthStore } from '@/store/auth-store'
import { useRole } from '@/hooks/use-role'
import {
  filterSidebarNav,
  getAccountSettingsHref,
  getDashboardHref,
  getProfileHref,
  ROLE_LABELS,
  type SidebarNavItem,
  type SidebarNavSection,
} from '@/lib/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface AdminSidebarProps {
  collapsed: boolean
  onToggleCollapsed: () => void
  mobileOpen: boolean
  onMobileOpenChange: (open: boolean) => void
}

interface SidebarBodyProps {
  collapsed: boolean
  isMobile: boolean
  onNavigate?: () => void
  onToggleCollapsed?: () => void
}

const COLLAPSED_WIDTH = 'w-[72px]'

export function AdminSidebar({
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onMobileOpenChange,
}: AdminSidebarProps) {
  // Close the mobile drawer on Escape and lock body scroll while it is open.
  useEffect(() => {
    if (!mobileOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onMobileOpenChange(false)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [mobileOpen, onMobileOpenChange])

  return (
    <>
      {/* Desktop sidebar (collapsible) */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden border-r bg-background transition-[width] duration-300 lg:flex lg:flex-col',
          collapsed ? COLLAPSED_WIDTH : 'w-64'
        )}
      >
        <SidebarBody
          collapsed={collapsed}
          isMobile={false}
          onToggleCollapsed={onToggleCollapsed}
        />
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          !mobileOpen && 'pointer-events-none'
        )}
      >
        <div
          aria-hidden="true"
          onClick={() => onMobileOpenChange(false)}
          className={cn(
            'absolute inset-0 bg-foreground/40 backdrop-blur-[2px] transition-opacity duration-300',
            mobileOpen ? 'opacity-100' : 'opacity-0'
          )}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className={cn(
            'absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col border-r bg-background shadow-xl transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <SidebarBody
            collapsed={false}
            isMobile
            onNavigate={() => onMobileOpenChange(false)}
          />
        </aside>
      </div>
    </>
  )
}

/**
 * Collapsed-mode tooltip. Rendered with fixed positioning so it is never
 * clipped by the sidebar's scroll container, and shown on hover + focus so it
 * is keyboard accessible.
 */
function CollapsedTooltip({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const anchorRef = useRef<HTMLSpanElement>(null)

  const show = () => {
    const anchor = anchorRef.current
    if (!anchor) return
    const rect = anchor.getBoundingClientRect()
    setPosition({ top: rect.top + rect.height / 2, left: rect.right + 10 })
    setOpen(true)
  }

  const hide = () => {
    setOpen(false)
    setPosition(null)
  }

  return (
    <span
      ref={anchorRef}
      className="group flex w-full items-center justify-center"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {open && position && (
        <span
          role="tooltip"
          className="pointer-events-none fixed z-[60] -translate-y-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background shadow-lg"
          style={{ top: position.top, left: position.left }}
        >
          {label}
        </span>
      )}
    </span>
  )
}

function SidebarBody({
  collapsed,
  isMobile,
  onNavigate,
  onToggleCollapsed,
}: SidebarBodyProps) {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const { logout } = useAuth()
  const { currentRoles } = useRole()

  const roles = currentRoles.length > 0 ? currentRoles : (user?.roles ?? [])
  const sections = filterSidebarNav(roles)
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])

  const isActive = (href?: string) =>
    !!href && (pathname === href || pathname.startsWith(`${href}/`))

  const isAnyChildActive = (children?: SidebarNavItem[]): boolean =>
    !!children?.some((child) => isActive(child.href) || isAnyChildActive(child.children))

  // Auto-expand parent groups when a nested route is active.
  useEffect(() => {
    const collectExpanded = (items: SidebarNavItem[]) => {
      items.forEach((item) => {
        if (item.children?.length && isAnyChildActive(item.children)) {
          setExpandedGroups((prev) =>
            prev.includes(item.title) ? prev : [...prev, item.title]
          )
          collectExpanded(item.children)
        }
      })
    }
    sections.forEach((section) => collectExpanded(section.items))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    )
  }

  const fullName = user?.fullName || user?.email || 'User'
  const initials =
    `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || 'U'
  const primaryRole = roles.find((role) => role in ROLE_LABELS)
  const roleLabel = primaryRole ? ROLE_LABELS[primaryRole] : 'Member'

  const dashboardHref = getDashboardHref(roles)

  const itemClasses = cn(
    'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ring-offset-background'
  )

  const activeClasses = 'bg-primary/10 text-primary'
  const inactiveClasses = 'text-muted-foreground hover:bg-muted hover:text-foreground'

  const renderItem = (item: SidebarNavItem) => {
    const Icon = item.icon
    const active = isActive(item.href) || isAnyChildActive(item.children)
    const hasChildren = !!item.children?.length
    const isExpanded = expandedGroups.includes(item.title)

    // Collapsed desktop: icon-only link with a tooltip.
    if (collapsed && !isMobile) {
      if (!item.href || !Icon) return null
      return (
        <div key={item.title} className="py-0.5">
          <CollapsedTooltip label={item.title}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className={cn(
                itemClasses,
                active ? activeClasses : inactiveClasses,
                'justify-center px-2'
              )}
              aria-label={item.title}
            >
              <Icon className="h-5 w-5 shrink-0" />
            </Link>
          </CollapsedTooltip>
        </div>
      )
    }

    // Parent item with children: expandable button.
    if (hasChildren) {
      const groupId = `submenu-${item.title.replace(/\s+/g, '-')}`
      return (
        <div key={item.title}>
          <button
            type="button"
            onClick={() => toggleGroup(item.title)}
            aria-expanded={isExpanded}
            aria-controls={groupId}
            className={cn(
              itemClasses,
              active ? activeClasses : inactiveClasses
            )}
          >
            {Icon && <Icon className="h-5 w-5 shrink-0" />}
            <span className="min-w-0 flex-1 truncate text-left">{item.title}</span>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0 opacity-60" />
            )}
          </button>
          {isExpanded && (
            <div id={groupId} className="mt-1 space-y-1 border-l pl-3 ml-[21px]">
              {item.children?.map((child) => renderItem(child))}
            </div>
          )}
        </div>
      )
    }

    // Leaf item.
    if (!item.href || !Icon) return null
    return (
      <Link
        key={item.title}
        href={item.href}
        onClick={onNavigate}
        className={cn(
          itemClasses,
          isActive(item.href) ? activeClasses : inactiveClasses
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <span className="min-w-0 truncate">{item.title}</span>
      </Link>
    )
  }

  const renderSection = (section: SidebarNavSection) => (
    <div key={section.label}>
      {collapsed && !isMobile ? (
        <div aria-hidden="true" className="mx-2 mb-2 h-px bg-border" />
      ) : (
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
          {section.label}
        </p>
      )}
      <div className="space-y-1">{section.items.map(renderItem)}</div>
    </div>
  )

  return (
    <>
      {/* Branding */}
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b px-4',
          collapsed && !isMobile && 'justify-center px-2'
        )}
      >
        <Link
          href={dashboardHref}
          onClick={onNavigate}
          className={cn('flex items-center gap-2', collapsed && !isMobile && 'w-full justify-center')}
          aria-label="SupportFlow home"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white shadow-sm">
            S
          </div>
          {(!collapsed || isMobile) && (
            <span className="flex flex-col leading-none">
              <span className="font-poppins text-base font-bold text-foreground">
                SupportFlow
              </span>
              <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Infi-Tech
              </span>
            </span>
          )}
        </Link>
        {isMobile && (
          <button
            type="button"
            onClick={onNavigate}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav
        aria-label="Main navigation"
        className="flex-1 space-y-6 overflow-y-auto px-3 py-4"
      >
        {sections.map(renderSection)}
      </nav>

      {/* Collapse toggle (desktop only) */}
      {!isMobile && (
        <div className="shrink-0 border-t p-3">
          <button
            type="button"
            onClick={onToggleCollapsed}
            className={cn(
              itemClasses,
              inactiveClasses,
              collapsed && 'justify-center px-2'
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-5 w-5 shrink-0" />
            ) : (
              <PanelLeftClose className="h-5 w-5 shrink-0" />
            )}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      )}

      {/* User section */}
      <div className="shrink-0 border-t p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                'flex w-full items-center gap-3 rounded-md p-2 transition-colors',
                'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                collapsed && !isMobile && 'justify-center px-2'
              )}
              aria-label="Open user menu"
            >
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarImage src={user?.avatar} alt={fullName} />
                <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {(!collapsed || isMobile) && (
                <span className="flex min-w-0 flex-1 flex-col text-left">
                  <span className="truncate text-sm font-medium leading-tight text-foreground">
                    {fullName}
                  </span>
                  <span className="truncate text-xs leading-tight text-muted-foreground">
                    {user?.email || '—'}
                  </span>
                  <span className="mt-1 inline-flex w-fit max-w-full items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    <span className="truncate">{roleLabel}</span>
                  </span>
                </span>
              )}
              {(!collapsed || isMobile) && (
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-60">
            <DropdownMenuLabel>
              <span className="flex flex-col space-y-1">
                <span className="text-sm font-medium leading-none">{fullName}</span>
                <span className="text-xs leading-none text-muted-foreground">
                  {user?.email || ''}
                </span>
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={getProfileHref(roles)} onClick={onNavigate}>
                <UserCircle className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={getAccountSettingsHref(roles)} onClick={onNavigate}>
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                onNavigate?.()
                logout()
              }}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
