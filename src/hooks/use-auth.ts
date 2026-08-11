'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import { toast } from 'sonner'
import { LoginCredentials, AcceptInvitationRequest, User } from '@/types/auth'

export const AUTH_QUERY_KEYS = {
  profile: ['auth', 'profile'],
  invitation: (token: string) => ['auth', 'invitation', token],
}

interface LoginMutationArgs {
  credentials: LoginCredentials
  redirect?: string | null
}

export const ROLE_HOME: Record<string, string> = {
  platform_admin: '/admin/dashboard',
  tenant_owner: '/tenant/dashboard',
  support_agent: '/support/dashboard',
  customer: '/customer/dashboard',
}

/**
 * Role-scoped home dashboard for a user, defaulting to the tenant dashboard.
 * Used after login/verification so the user lands on their own workspace
 * instead of being bounced back to the login page.
 */
export function roleHomeFor(roles: string[] | undefined | null): string {
  const role = (roles && roles[0]) || 'guest'
  return ROLE_HOME[role] || '/tenant/dashboard'
}

/**
 * Allow only internal redirect paths (starts with a single "/") to avoid
 * open-redirects while still honoring middleware-supplied `?redirect=`.
 */
export function isSafeRedirect(path: string | null | undefined): string | null {
  if (!path) return null
  if (!path.startsWith('/')) return null
  if (path.startsWith('//') || path.startsWith('/\\')) return null
  return path
}

function resolvePostLoginDestination(
  redirect: string | null | undefined,
  roles: string[]
): string {
  const safeRedirect = isSafeRedirect(redirect)
  if (safeRedirect) return safeRedirect
  return roleHomeFor(roles)
}

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const {
    user,
    accessToken,
    isAuthenticated,
    setAuth,
    logout: logoutStore,
    setAccessToken,
  } = useAuthStore()

  // Get user profile
  const {
    data: profile,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: AUTH_QUERY_KEYS.profile,
    queryFn: () => authService.getProfile(),
    enabled: isAuthenticated && !!accessToken,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (args: LoginMutationArgs) => authService.login(args.credentials),
    onSuccess: (response, args) => {
      setAuth(response.user, response.accessToken, response.refreshToken)
      toast.success('Welcome back!')

      // Prefer the requested (sanitized) redirect, otherwise land on the
      // role's home dashboard. Tenant owners end up on /tenant/dashboard even
      // when signing in straight from /verify-email.
      const destination = resolvePostLoginDestination(
        args.redirect,
        response.user.roles
      )
      router.push(destination)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Login failed. Please try again.')
    },
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logoutStore()
      queryClient.clear()
      toast.success('Logged out successfully')
      router.push('/login')
    },
    onError: () => {
      // Even if the server fails, clear local state
      logoutStore()
      queryClient.clear()
      router.push('/login')
    },
  })

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => authService.forgotPassword({ email }),
    onSuccess: (data) => {
      toast.success(data.message || 'Password reset email sent')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send reset email')
    },
  })

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (data: { token: string; password: string; confirmPassword: string }) =>
      authService.resetPassword(data),
    onSuccess: (data) => {
      toast.success(data.message || 'Password reset successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reset password')
    },
  })

  // Verify email mutation
  const verifyEmailMutation = useMutation({
    mutationFn: (token: string) => authService.verifyEmail({ token }),
    onSuccess: (response) => {
      toast.success('Email verified successfully')

      if (response.accessToken && response.user?.id) {
        // Auto-login: the backend issued tokens during verification. The
        // verify-email page owns the redirect to the tenant dashboard (with a
        // visible countdown) so the user is never sent back to the login page.
        setAuth(response.user, response.accessToken, response.refreshToken)
        refetchProfile()
      } else {
        // Idempotent re-verification of an already-verified account: no new
        // session is issued, just refresh the cached profile.
        refetchProfile()
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to verify email')
    },
  })

  // Resend verification mutation
  const resendVerificationMutation = useMutation({
    mutationFn: (email: string) => authService.resendVerification({ email }),
    onSuccess: (data) => {
      toast.success(data.message || 'Verification email sent')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send verification email')
    },
  })

  // Accept invitation mutation. The accept-invitation page owns the success
  // state ("Invitation Accepted") and redirects the user to the exact
  // organization's subdomain login page — we deliberately do NOT create a
  // session or navigate here, so the user signs in through that tenant.
  const acceptInvitationMutation = useMutation({
    mutationFn: (data: AcceptInvitationRequest) => authService.acceptInvitation(data),
  })

  // Get invitation details
  const useInvitation = (token: string) => {
    return useQuery({
      queryKey: AUTH_QUERY_KEYS.invitation(token),
      queryFn: () => authService.getInvitation(token),
      enabled: !!token,
      retry: false,
    })
  }

  // Reject invitation
  const rejectInvitationMutation = useMutation({
    mutationFn: (token: string) => authService.rejectInvitation(token),
    onSuccess: (data) => {
      toast.success(data.message || 'Invitation rejected')
      router.push('/')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reject invitation')
    },
  })

  // Update profile
  const updateProfile = async (data: Partial<User>) => {
    // This would be implemented when we build the profile page
    // For now, just a placeholder
    console.log('Update profile:', data)
  }

  return {
    // State
    user,
    profile,
    isAuthenticated,
    isProfileLoading,
    accessToken,

    // Mutations
    login: (credentials: LoginCredentials, redirect?: string | null) =>
      loginMutation.mutate({ credentials, redirect }),
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,

    forgotPassword: forgotPasswordMutation.mutate,
    isForgotPasswordLoading: forgotPasswordMutation.isPending,

    resetPassword: resetPasswordMutation.mutate,
    isResetPasswordLoading: resetPasswordMutation.isPending,

    verifyEmail: (token: string) => verifyEmailMutation.mutateAsync(token),
    isVerifyingEmail: verifyEmailMutation.isPending,

    resendVerification: (email: string) =>
      resendVerificationMutation.mutateAsync(email),
    isResendingVerification: resendVerificationMutation.isPending,

    acceptInvitation: acceptInvitationMutation.mutateAsync,
    isAcceptingInvitation: acceptInvitationMutation.isPending,

    rejectInvitation: rejectInvitationMutation.mutate,
    isRejectingInvitation: rejectInvitationMutation.isPending,

    useInvitation,
    updateProfile,
    refetchProfile,
  }
}