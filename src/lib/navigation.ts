import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  CreditCard,
  LayoutDashboard,
  ScrollText,
  Settings,
  ShieldCheck,
  Star,
  Ticket,
  UserCircle,
  UserRound,
  Users,
  UsersRound,
} from 'lucide-react'
import type { UserRole } from '@/types/auth'

/**
 * Central registry of application routes. Keep route strings in one place so
 * the sidebar (and future components) never scatter hardcoded paths.
 */
export const APP_ROUTES = {
  support: {
    dashboard: '/support/dashboard',
    tickets: '/support/tickets',
  },
  tenant: {
    dashboard: '/tenant/dashboard',
    tickets: '/tenant/tickets',
    customers: '/tenant/customers',
    feedback: '/tenant/feedback',
    analytics: '/tenant/analytics',
    team: '/tenant/organization/team',
    teamInvitations: '/tenant/organization/team/invitations',
    knowledgeBase: '/tenant/knowledge-base',
    organization: '/tenant/organization',
    organizationProfile: '/tenant/organization/profile',
    departments: '/tenant/organization/departments',
    billing: '/tenant/billing',
    billingHistory: '/tenant/billing/history',
  },
  admin: {
    dashboard: '/admin/dashboard',
    tenants: '/admin/tenants',
    plans: '/admin/plans',
    billing: '/admin/billing',
    settings: '/admin/settings',
    auditLogs: '/admin/audit-logs',
  },
  notifications: '/notifications',
} as const

export const ROLE_LABELS: Record<UserRole, string> = {
  platform_admin: 'Platform Admin',
  tenant_owner: 'Organization Admin',
  support_agent: 'Support Agent',
  customer: 'Customer',
  guest: 'Guest',
}

export interface SidebarNavItem {
  title: string
  href?: string
  /** Role-specific overrides for the resolved href (takes priority over `href`). */
  hrefByRole?: Partial<Record<UserRole, string>>
  icon?: LucideIcon
  /** If omitted/empty the item is visible to every authenticated role. */
  roles?: UserRole[]
  children?: SidebarNavItem[]
}

export interface SidebarNavSection {
  label: string
  items: SidebarNavItem[]
}

/** Priority order used to pick the user's "primary" role for href resolution. */
const PRIMARY_ROLE_ORDER: UserRole[] = [
  'platform_admin',
  'tenant_owner',
  'support_agent',
  'customer',
  'guest',
]

/**
 * Sidebar navigation configuration. Single source of truth for labels, icons,
 * routes and the roles that are allowed to see each item.
 */
export const SIDEBAR_NAV: SidebarNavSection[] = [
  {
    label: 'Main',
    items: [
      {
        title: 'Dashboard',
        icon: LayoutDashboard,
        hrefByRole: {
          platform_admin: APP_ROUTES.admin.dashboard,
          tenant_owner: APP_ROUTES.tenant.dashboard,
          support_agent: APP_ROUTES.support.dashboard,
        },
        roles: ['platform_admin', 'tenant_owner', 'support_agent'],
      },
      {
        title: 'Tickets',
        icon: Ticket,
        href: APP_ROUTES.tenant.tickets,
        hrefByRole: {
          tenant_owner: APP_ROUTES.tenant.tickets,
          support_agent: APP_ROUTES.support.tickets,
        },
        roles: ['tenant_owner', 'support_agent'],
      },
      {
        title: 'Customers',
        icon: Users,
        href: APP_ROUTES.tenant.customers,
        roles: ['tenant_owner'],
      },
      {
        title: 'Feedback',
        icon: Star,
        href: APP_ROUTES.tenant.feedback,
        roles: ['tenant_owner'],
      },
      {
        title: 'Analytics',
        icon: BarChart3,
        href: APP_ROUTES.tenant.analytics,
        roles: ['tenant_owner'],
      },
    ],
  },
  {
    label: 'Management',
    items: [
      {
        title: 'Team Members',
        icon: UsersRound,
        href: APP_ROUTES.tenant.team,
        roles: ['tenant_owner'],
        children: [
          {
            title: 'Invitations',
            icon: UserRound,
            href: APP_ROUTES.tenant.teamInvitations,
            roles: ['tenant_owner'],
          },
        ],
      },
      {
        title: 'Knowledge Base',
        icon: BookOpen,
        href: APP_ROUTES.tenant.knowledgeBase,
        roles: ['tenant_owner'],
      },
      {
        title: 'Notifications',
        icon: Bell,
        href: APP_ROUTES.notifications,
        roles: ['platform_admin', 'tenant_owner', 'support_agent'],
      },
    ],
  },
  {
    label: 'Organization',
    items: [
      {
        title: 'Organization Settings',
        icon: Building2,
        href: APP_ROUTES.tenant.organization,
        roles: ['tenant_owner'],
        children: [
          {
            title: 'Profile',
            icon: UserCircle,
            href: APP_ROUTES.tenant.organizationProfile,
            roles: ['tenant_owner'],
          },
          {
            title: 'Departments',
            icon: Building2,
            href: APP_ROUTES.tenant.departments,
            roles: ['tenant_owner'],
          },
        ],
      },
      {
        title: 'Subscription & Billing',
        icon: CreditCard,
        href: APP_ROUTES.tenant.billing,
        roles: ['tenant_owner'],
        children: [
          {
            title: 'Billing History',
            icon: CreditCard,
            href: APP_ROUTES.tenant.billingHistory,
            roles: ['tenant_owner'],
          },
        ],
      },
    ],
  },
  {
    label: 'Administration',
    items: [
      {
        title: 'Audit Logs',
        icon: ScrollText,
        href: APP_ROUTES.admin.auditLogs,
        roles: ['platform_admin'],
      },
      {
        title: 'Platform Administration',
        icon: ShieldCheck,
        href: APP_ROUTES.admin.dashboard,
        roles: ['platform_admin'],
        children: [
          {
            title: 'Tenants',
            icon: Building2,
            href: APP_ROUTES.admin.tenants,
            roles: ['platform_admin'],
          },
          {
            title: 'Plans',
            icon: CreditCard,
            href: APP_ROUTES.admin.plans,
            roles: ['platform_admin'],
          },
          {
            title: 'Billing',
            icon: CreditCard,
            href: APP_ROUTES.admin.billing,
            roles: ['platform_admin'],
          },
          {
            title: 'Settings',
            icon: Settings,
            href: APP_ROUTES.admin.settings,
            roles: ['platform_admin'],
          },
        ],
      },
    ],
  },
]

function getPrimaryRole(roles: UserRole[]): UserRole | undefined {
  return PRIMARY_ROLE_ORDER.find((role) => roles.includes(role))
}

function isVisible(item: SidebarNavItem, roles: UserRole[]): boolean {
  return !item.roles || item.roles.length === 0 || item.roles.some((role) => roles.includes(role))
}

function resolveHref(item: SidebarNavItem, roles: UserRole[]): string | undefined {
  if (item.hrefByRole) {
    const primary = getPrimaryRole(roles)
    return primary ? item.hrefByRole[primary] ?? item.href : item.href
  }
  return item.href
}

/**
 * Returns the navigation sections the given set of roles is allowed to see,
 * with role-specific hrefs resolved. The raw config is never mutated.
 */
export function filterSidebarNav(roles: UserRole[]): SidebarNavSection[] {
  return SIDEBAR_NAV.map((section) => ({
    label: section.label,
    items: section.items
      .filter((item) => isVisible(item, roles))
      .map((item) => ({
        ...item,
        href: resolveHref(item, roles),
        children: item.children ? item.children.filter((child) => isVisible(child, roles)) : undefined,
      })),
  })).filter((section) => section.items.length > 0)
}

/** Resolve the dashboard route for the current user's primary role. */
export function getDashboardHref(roles: UserRole[]): string {
  const primary = getPrimaryRole(roles)
  switch (primary) {
    case 'platform_admin':
      return APP_ROUTES.admin.dashboard
    case 'support_agent':
      return APP_ROUTES.support.dashboard
    default:
      return APP_ROUTES.tenant.dashboard
  }
}

export function getProfileHref(roles: UserRole[]): string {
  return roles.includes('platform_admin')
    ? APP_ROUTES.admin.settings
    : APP_ROUTES.tenant.organizationProfile
}

export function getAccountSettingsHref(roles: UserRole[]): string {
  return roles.includes('platform_admin')
    ? APP_ROUTES.admin.settings
    : APP_ROUTES.tenant.organization
}
