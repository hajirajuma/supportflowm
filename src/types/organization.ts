import { User } from './auth'

export type OrganizationRole = 'tenant_owner' | 'support_agent' | 'customer'

export type MemberStatus = 'active' | 'inactive' | 'pending' | 'suspended'

export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'rejected' | 'revoked'

export interface Organization {
  id: string
  name: string
  slug: string
  logo?: string
  favicon?: string
  description?: string
  contactEmail: string
  contactPhone?: string
  website?: string
  address?: string
  timezone: string
  language: string
  primaryColor: string
  secondaryColor: string
  brandName?: string
  plan: 'free' | 'pro' | 'enterprise'
  status: 'active' | 'suspended' | 'pending'
  storageUsed: number
  storageLimit: number
  createdAt: string
  updatedAt: string
}

export interface Member {
  id: string
  user: User
  role: OrganizationRole
  department?: Department
  status: MemberStatus
  joinedAt: string
  lastLoginAt?: string
  invitedBy?: User
}

export interface Department {
  id: string
  name: string
  description?: string
  head?: User
  members: Member[]
  ticketCount: number
  createdAt: string
  updatedAt: string
}

export interface Invitation {
  id: string
  email: string
  /** Random secret used in the /accept-invitation?token= link. */
  token?: string
  role: OrganizationRole
  departmentId?: string
  message?: string
  status: InvitationStatus
  expiresAt: string
  invitedBy: User
  acceptedAt?: string
  createdAt: string
}

export interface OrganizationSettings {
  id: string
  businessHours: {
    monday: { open: string; close: string; enabled: boolean }
    tuesday: { open: string; close: string; enabled: boolean }
    wednesday: { open: string; close: string; enabled: boolean }
    thursday: { open: string; close: string; enabled: boolean }
    friday: { open: string; close: string; enabled: boolean }
    saturday: { open: string; close: string; enabled: boolean }
    sunday: { open: string; close: string; enabled: boolean }
  }
  workingDays: string[]
  timezone: string
  language: string
  defaultTicketPriority: 'low' | 'medium' | 'high' | 'critical'
  defaultTicketStatus: 'open' | 'pending' | 'resolved' | 'closed'
  knowledgeBaseEnabled: boolean
  notificationSettings: {
    email: boolean
    browser: boolean
    ticketAssignments: boolean
    ticketUpdates: boolean
    invitationEvents: boolean
    feedbackEvents: boolean
  }
  updatedAt: string
}

export interface OrganizationStats {
  totalUsers: number
  activeUsers: number
  customers: number
  supportAgents: number
  departments: number
  totalTickets: number
  openTickets: number
  pendingTickets: number
  resolvedTickets: number
  storageUsed: number
  storagePercent: number
  recentActivity: Array<{
    id: string
    type: 'member_joined' | 'ticket_created' | 'ticket_resolved' | 'invitation_sent'
    description: string
    user: User
    timestamp: string
  }>
}

export interface BrandingConfig {
  logo?: string
  favicon?: string
  primaryColor: string
  secondaryColor: string
  brandName: string
}

export interface UpdateOrganizationRequest {
  name?: string
  description?: string
  contactEmail?: string
  contactPhone?: string
  website?: string
  address?: string
  timezone?: string
  language?: string
}

export interface UpdateBrandingRequest {
  primaryColor?: string
  secondaryColor?: string
  brandName?: string
}

export interface CreateDepartmentRequest {
  name: string
  description?: string
  headId?: string
}

export interface UpdateDepartmentRequest {
  name?: string
  description?: string
  headId?: string
}

export interface InviteMemberRequest {
  email: string
  role: OrganizationRole
  departmentId?: string
  message?: string
  expiresIn?: number // days
}

export interface UpdateMemberRequest {
  role?: OrganizationRole
  departmentId?: string
  status?: MemberStatus
}