export type UserRole = 'platform_admin' | 'tenant_owner' | 'support_agent' | 'customer' | 'guest'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  avatar?: string
  roles: UserRole[]
  permissions: string[]
  organization?: {
    id: string
    name: string
    slug: string
  }
  tenantId?: string
  emailVerified: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  roles: UserRole[]
  permissions: string[]
  organization: User['organization'] | null
  tenantId: string | null
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

export interface VerifyEmailRequest {
  token: string
}

export interface ResendVerificationRequest {
  email: string
}

export interface InvitationData {
  token: string
  email: string
  firstName?: string
  lastName?: string
  role: UserRole
  organizationName: string
  expiresAt: string
  invitedBy: {
    firstName: string
    lastName: string
    email: string
  }
}

export interface AcceptInvitationRequest {
  token: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken?: string
  expiresIn: number
}