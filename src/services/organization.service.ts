import { apiClient } from './api-client'
import {
  Organization,
  OrganizationSettings,
  OrganizationStats,
  Member,
  Department,
  Invitation,
  UpdateOrganizationRequest,
  UpdateBrandingRequest,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  InviteMemberRequest,
  UpdateMemberRequest,
  BrandingConfig,
} from '@/types/organization'

const ORG_BASE = '/organization'

export const organizationService = {
  // Get current organization
  async getOrganization(): Promise<Organization> {
    return apiClient.get<Organization>(ORG_BASE)
  },

  // Update organization
  async updateOrganization(data: UpdateOrganizationRequest): Promise<Organization> {
    return apiClient.patch<Organization>(ORG_BASE, data)
  },

  // Get organization stats
  async getStats(): Promise<OrganizationStats> {
    return apiClient.get<OrganizationStats>(`${ORG_BASE}/settings`)
  },

  // Get organization settings
  async getSettings(): Promise<OrganizationSettings> {
    return apiClient.get<OrganizationSettings>(`${ORG_BASE}/settings`)
  },

  // Update settings
  async updateSettings(data: Partial<OrganizationSettings>): Promise<OrganizationSettings> {
    return apiClient.patch<OrganizationSettings>(`${ORG_BASE}/settings`, data)
  },

  // Update branding
  async updateBranding(data: UpdateBrandingRequest): Promise<BrandingConfig> {
    return apiClient.patch<BrandingConfig>(ORG_BASE, data)
  },

  // Upload logo
  async uploadLogo(file: File): Promise<{ url: string }> {
    return apiClient.upload<{ url: string }>(`${ORG_BASE}/logo`, file)
  },

  // Upload favicon
  async uploadFavicon(file: File): Promise<{ url: string }> {
    return apiClient.upload<{ url: string }>(`${ORG_BASE}/favicon`, file)
  },

  // Get members
  async getMembers(params?: {
    page?: number
    limit?: number
    search?: string
    role?: string
    department?: string
    status?: string
  }): Promise<{ data: Member[]; total: number; page: number; limit: number }> {
    return apiClient.get(`${ORG_BASE}/members`, { params })
  },

  // Get member details
  async getMember(id: string): Promise<Member> {
    return apiClient.get<Member>(`${ORG_BASE}/members/${id}`)
  },

  // Update member
  async updateMember(id: string, data: UpdateMemberRequest): Promise<Member> {
    return apiClient.patch<Member>(`${ORG_BASE}/members/${id}`, data)
  },

  // Remove member
  async removeMember(id: string): Promise<{ message: string }> {
    return apiClient.delete(`${ORG_BASE}/members/${id}`)
  },

  // Deactivate member
  async deactivateMember(id: string): Promise<{ message: string }> {
    return apiClient.post(`${ORG_BASE}/members/${id}/deactivate`)
  },

  // Reactivate member
  async reactivateMember(id: string): Promise<{ message: string }> {
    return apiClient.post(`${ORG_BASE}/members/${id}/reactivate`)
  },

  // Get departments
  async getDepartments(): Promise<Department[]> {
    return apiClient.get<Department[]>(`${ORG_BASE}/departments`)
  },

  // Create department
  async createDepartment(data: CreateDepartmentRequest): Promise<Department> {
    return apiClient.post<Department>(`${ORG_BASE}/departments`, data)
  },

  // Update department
  async updateDepartment(id: string, data: UpdateDepartmentRequest): Promise<Department> {
    return apiClient.patch<Department>(`${ORG_BASE}/departments/${id}`, data)
  },

  // Delete department
  async deleteDepartment(id: string): Promise<{ message: string }> {
    return apiClient.delete(`${ORG_BASE}/departments/${id}`)
  },

  // Get invitations
  async getInvitations(params?: {
    page?: number
    limit?: number
    status?: string
    role?: string
  }): Promise<{ data: Invitation[]; total: number; page: number; limit: number }> {
    const res = await apiClient.get<any>(`${ORG_BASE}/invitations`, { params })
    const list = Array.isArray(res) ? res : res?.data ?? []
    return {
      data: list,
      total: list.length,
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
    }
  },

  // Send invitation
  async sendInvitation(data: InviteMemberRequest): Promise<Invitation> {
    // Backend InviteUserDto expects the UPPERCASE role enum and only accepts
    // email/role/message (forbidNonWhitelisted rejects unknown fields).
    return apiClient.post<Invitation>(`${ORG_BASE}/invitations`, {
      email: data.email,
      role: data.role.toUpperCase(),
      message: data.message,
      expiresIn: data.expiresIn,
    })
  },

  // Cancel invitation
  async cancelInvitation(id: string): Promise<{ message: string }> {
    return apiClient.delete(`${ORG_BASE}/invitations/${id}`)
  },

  // Resend invitation
  async resendInvitation(id: string): Promise<{ message: string }> {
    return apiClient.post(`${ORG_BASE}/invitations/${id}/resend`)
  },

  // Get invitation link
  async getInvitationLink(id: string): Promise<{ link: string }> {
    return apiClient.get(`${ORG_BASE}/invitations/${id}/link`)
  },
}
