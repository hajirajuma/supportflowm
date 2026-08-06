'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import { toast } from 'sonner'
import { LoginCredentials, AcceptInvitationRequest } from '@/types/auth'

export const AUTH_QUERY_KEYS = {
  profile: ['auth', 'profile'],
  invitation: (token: string) => ['auth', 'invitation', token],
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
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (response) => {
      setAuth(response.user, response.accessToken, response.refreshToken)
      toast.success('Welcome back!')
      
      // Redirect based on role
      const role = response.user.roles[0]
      switch (role) {
        case 'platform_admin':
          router.push('/platform-admin/dashboard')
          break
        case 'tenant_owner':
          router.push('/tenant/dashboard')
          break
        case 'support_agent':
          router.push('/platform/tickets')
          break
        case 'customer':
          router.push('/customer/tickets')
          break
        default:
          router.push('/dashboard')
      }
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
    onSuccess: (data) => {
      toast.success(data.message || 'Email verified successfully')
      refetchProfile()
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

  // Accept invitation mutation
  const acceptInvitationMutation = useMutation({
    mutationFn: (data: AcceptInvitationRequest) => authService.acceptInvitation(data),
    onSuccess: (response) => {
      setAuth(response.user, response.accessToken, response.refreshToken)
      toast.success('Invitation accepted! Welcome to SupportFlow')
      router.push('/dashboard')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to accept invitation')
    },
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
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,

    forgotPassword: forgotPasswordMutation.mutate,
    isForgotPasswordLoading: forgotPasswordMutation.isPending,

    resetPassword: resetPasswordMutation.mutate,
    isResetPasswordLoading: resetPasswordMutation.isPending,

    verifyEmail: verifyEmailMutation.mutate,
    isVerifyingEmail: verifyEmailMutation.isPending,

    resendVerification: resendVerificationMutation.mutate,
    isResendingVerification: resendVerificationMutation.isPending,

    acceptInvitation: acceptInvitationMutation.mutate,
    isAcceptingInvitation: acceptInvitationMutation.isPending,

    rejectInvitation: rejectInvitationMutation.mutate,
    isRejectingInvitation: rejectInvitationMutation.isPending,

    useInvitation,
    updateProfile,
    refetchProfile,
  }
}