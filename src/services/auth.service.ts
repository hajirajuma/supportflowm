import { apiClient } from './api-client'
import {
  LoginCredentials,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
  AcceptInvitationRequest,
  RefreshTokenResponse,
  User,
  InvitationData,
  RegisterRequest,
  RegisterResponse,
} from '@/types/auth'



const AUTH_BASE = '/auth'

function toUserRole(role: string | undefined): User['roles'] {
  const normalized = (role ?? 'guest').toLowerCase()
  const valid: User['roles'][number][] = [
    'platform_admin',
    'tenant_owner',
    'support_agent',
    'customer',
    'guest',
  ]
  return valid.includes(normalized as any) ? [normalized as any] : ['guest']
}

function mapUser(backendUser: any): User {
  const role = backendUser?.role ?? backendUser?.roles?.[0]
  const firstName = backendUser?.firstName ?? ''
  const lastName = backendUser?.lastName ?? ''
  return {
    id: backendUser?.id ?? '',
    email: backendUser?.email ?? '',
    firstName,
    lastName,
   fullName: (`${firstName} ${lastName}`.trim() || backendUser?.email) ?? '',
    avatar: backendUser?.avatarUrl || backendUser?.avatar || undefined,
    roles: toUserRole(role),
    permissions: backendUser?.permissions ?? [],
    organization:
      backendUser?.organization ??
      (backendUser?.organizationId
        ? { id: backendUser.organizationId, name: '', slug: '' }
        : undefined),
    tenantId: backendUser?.organizationId ?? backendUser?.tenantId,
    emailVerified: !!backendUser?.emailVerifiedAt || !!backendUser?.emailVerified,
    isActive:
      backendUser?.status === 'ACTIVE' ||
      backendUser?.isActive === true ||
      !backendUser?.status,
    createdAt: backendUser?.createdAt ?? new Date().toISOString(),
    updatedAt: backendUser?.updatedAt ?? new Date().toISOString(),
  }
}

function mapAuthResponse(raw: any): AuthResponse {
  return {
    accessToken: raw?.accessToken ?? '',
    refreshToken: raw?.refreshToken ?? '',
    expiresIn: raw?.expiresIn ?? 15 * 60,
    user: mapUser(raw?.user),
  }
}

export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<any>(`${AUTH_BASE}/login`, credentials)
    return mapAuthResponse(response)
  },

  // Logout
  async logout(): Promise<void> {
    await apiClient.post(`${AUTH_BASE}/logout`)
  },

  // Refresh Token
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>(`${AUTH_BASE}/refresh`, {
      refreshToken,
    })
    return response
  },

  // Forgot Password
  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      `${AUTH_BASE}/forgot-password`,
      data
    )
    return response
  },

  // Reset Password
  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      `${AUTH_BASE}/reset-password`,
      data
    )
    return response
  },

  // Verify Email
  async verifyEmail(data: VerifyEmailRequest): Promise<AuthResponse> {
    const response = await apiClient.post<any>(`${AUTH_BASE}/verify-email`, data)
    return mapAuthResponse(response)
  },

  // Resend Verification Email
  async resendVerification(data: ResendVerificationRequest): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      `${AUTH_BASE}/resend-verification`,
      data
    )
    return response
  },

  // Get Current User Profile
  async getProfile(): Promise<User> {
    const response = await apiClient.get<any>(`${AUTH_BASE}/me`)
    return mapUser(response)
  },

  // Change Password
  async changePassword(data: {
    currentPassword: string
    newPassword: string
  }): Promise<{ message: string }> {
    return apiClient.patch(`${AUTH_BASE}/change-password`, data)
  },

  // Accept Invitation
  async acceptInvitation(data: AcceptInvitationRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `/organization/invitations/accept`,
      data
    )
    return response
  },

  // Get Invitation Details
  async getInvitation(token: string): Promise<InvitationData> {
    const response = await apiClient.get<InvitationData>(
      `/organization/invitations/accept`,
      { params: { token } }
    )
    return response
  },

  // Reject Invitation
  async rejectInvitation(token: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      `${AUTH_BASE}/reject-invitation`,
      { token }
    )
    return response
  },

  // Register new organization
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<any>(`${AUTH_BASE}/register`, data)
    return {
      user: mapUser(response?.user),
      organization: response?.organization ?? {
        id: '',
        name: data.organizationName,
      },
      requiresEmailVerification: true,
      message:
        response?.message ??
        'Organization registered successfully. Please verify your email address.',
    }
  },
}
