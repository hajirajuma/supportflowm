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
} from '@/types/auth'

const AUTH_BASE = '/auth'

export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(`${AUTH_BASE}/login`, credentials)
    return response
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
  async verifyEmail(data: VerifyEmailRequest): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      `${AUTH_BASE}/verify-email`,
      data
    )
    return response
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
    const response = await apiClient.get<User>(`${AUTH_BASE}/me`)
    return response
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
}
