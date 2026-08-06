'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { organizationService } from '@/services/organization.service'
import { useOrganizationStore } from '@/store/organization-store'
import {
  UpdateOrganizationRequest,
  UpdateBrandingRequest,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  InviteMemberRequest,
  UpdateMemberRequest,
} from '@/types/organization'

export const ORG_QUERY_KEYS = {
  organization: ['organization'],
  stats: ['organization', 'stats'],
  settings: ['organization', 'settings'],
  members: ['organization', 'members'],
  member: (id: string) => ['organization', 'members', id],
  departments: ['organization', 'departments'],
  invitations: ['organization', 'invitations'],
}

export function useOrganization() {
  const queryClient = useQueryClient()
  const { setOrganization, setSettings, updateOrganization } = useOrganizationStore()

  // Get organization
  const {
    data: organization,
    isLoading: isLoadingOrg,
    refetch: refetchOrg,
  } = useQuery({
    queryKey: ORG_QUERY_KEYS.organization,
    queryFn: () => organizationService.getOrganization(),
    onSuccess: (data) => {
      setOrganization(data)
    },
  })

  // Get stats
  const {
    data: stats,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ORG_QUERY_KEYS.stats,
    queryFn: () => organizationService.getStats(),
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  // Get settings
  const {
    data: settings,
    isLoading: isLoadingSettings,
    refetch: refetchSettings,
  } = useQuery({
    queryKey: ORG_QUERY_KEYS.settings,
    queryFn: () => organizationService.getSettings(),
    onSuccess: (data) => {
      setSettings(data)
    },
  })

  // Update organization
  const updateOrgMutation = useMutation({
    mutationFn: (data: UpdateOrganizationRequest) =>
      organizationService.updateOrganization(data),
    onSuccess: (data) => {
      updateOrganization(data)
      queryClient.invalidateQueries({ queryKey: ORG_QUERY_KEYS.organization })
      toast.success('Organization updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update organization')
    },
  })

  // Update branding
  const updateBrandingMutation = useMutation({
    mutationFn: (data: UpdateBrandingRequest) =>
      organizationService.updateBranding(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ORG_QUERY_KEYS.organization })
      toast.success('Branding updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update branding')
    },
  })

  // Upload logo
  const uploadLogoMutation = useMutation({
    mutationFn: (file: File) => organizationService.uploadLogo(file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ORG_QUERY_KEYS.organization })
      toast.success('Logo uploaded successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload logo')
    },
  })

  // Upload favicon
  const uploadFaviconMutation = useMutation({
    mutationFn: (file: File) => organizationService.uploadFavicon(file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ORG_QUERY_KEYS.organization })
      toast.success('Favicon uploaded successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload favicon')
    },
  })

  // Get members
  const useMembers = (params?: any) => {
    return useQuery({
      queryKey: [...ORG_QUERY_KEYS.members, params],
      queryFn: () => organizationService.getMembers(params),
    })
  }

  // Get member
  const useMember = (id: string) => {
    return useQuery({
      queryKey: ORG_QUERY_KEYS.member(id),
      queryFn: () => organizationService.getMember(id),
      enabled: !!id,
    })
  }

  // Update member
  const updateMemberMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMemberRequest }) =>
      organizationService.updateMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORG_QUERY_KEYS.members })
      toast.success('Member updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update member')
    },
  })

  // Remove member
  const removeMemberMutation = useMutation({
    mutationFn: (id: string) => organizationService.removeMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORG_QUERY_KEYS.members })
      toast.success('Member removed successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove member')
    },
  })

  // Deactivate member
  const deactivateMemberMutation = useMutation({
    mutationFn: (id: string) => organizationService.deactivateMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORG_QUERY_KEYS.members })
      toast.success('Member deactivated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to deactivate member')
    },
  })

  // Reactivate member
  const reactivateMemberMutation = useMutation({
    mutationFn: (id: string) => organizationService.reactivateMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORG_QUERY_KEYS.members })
      toast.success('Member reactivated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reactivate member')
    },
  })

  // Get departments
  const {
    data: departments,
    isLoading: isLoadingDepartments,
    refetch: refetchDepartments,
  } = useQuery({
    queryKey: ORG_QUERY_KEYS.departments,
    queryFn: () => organizationService.getDepartments(),
  })

  // Create department
  const createDepartmentMutation = useMutation({
    mutationFn: (data: CreateDepartmentRequest) =>
      organizationService.createDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORG_QUERY_KEYS.departments })
      toast.success('Department created successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create department')
    },
  })

  // Update department
  const updateDepartmentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDepartmentRequest }) =>
      organizationService.updateDepartment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORG_QUERY_KEYS.departments })
      toast.success('Department updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update department')
    },
  })

  // Delete department
  const deleteDepartmentMutation = useMutation({
    mutationFn: (id: string) => organizationService.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORG_QUERY_KEYS.departments })
      toast.success('Department deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete department')
    },
  })

  // Get invitations
  const useInvitations = (params?: any) => {
    return useQuery({
      queryKey: [...ORG_QUERY_KEYS.invitations, params],
      queryFn: () => organizationService.getInvitations(params),
    })
  }

  // Send invitation
  const sendInvitationMutation = useMutation({
    mutationFn: (data: InviteMemberRequest) =>
      organizationService.sendInvitation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORG_QUERY_KEYS.invitations })
      toast.success('Invitation sent successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send invitation')
    },
  })

  // Cancel invitation
  const cancelInvitationMutation = useMutation({
    mutationFn: (id: string) => organizationService.cancelInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORG_QUERY_KEYS.invitations })
      toast.success('Invitation cancelled successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cancel invitation')
    },
  })

  // Resend invitation
  const resendInvitationMutation = useMutation({
    mutationFn: (id: string) => organizationService.resendInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORG_QUERY_KEYS.invitations })
      toast.success('Invitation resent successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to resend invitation')
    },
  })

  return {
    // Organization
    organization,
    isLoadingOrg,
    refetchOrg,
    updateOrganization: updateOrgMutation.mutate,
    isUpdating: updateOrgMutation.isPending,

    // Stats
    stats,
    isLoadingStats,
    refetchStats,

    // Settings
    settings,
    isLoadingSettings,
    refetchSettings,

    // Branding
    updateBranding: updateBrandingMutation.mutate,
    isUpdatingBranding: updateBrandingMutation.isPending,
    uploadLogo: uploadLogoMutation.mutate,
    isUploadingLogo: uploadLogoMutation.isPending,
    uploadFavicon: uploadFaviconMutation.mutate,
    isUploadingFavicon: uploadFaviconMutation.isPending,

    // Members
    useMembers,
    useMember,
    updateMember: updateMemberMutation.mutate,
    isUpdatingMember: updateMemberMutation.isPending,
    removeMember: removeMemberMutation.mutate,
    isRemovingMember: removeMemberMutation.isPending,
    deactivateMember: deactivateMemberMutation.mutate,
    isDeactivatingMember: deactivateMemberMutation.isPending,
    reactivateMember: reactivateMemberMutation.mutate,
    isReactivatingMember: reactivateMemberMutation.isPending,

    // Departments
    departments,
    isLoadingDepartments,
    refetchDepartments,
    createDepartment: createDepartmentMutation.mutate,
    isCreatingDepartment: createDepartmentMutation.isPending,
    updateDepartment: updateDepartmentMutation.mutate,
    isUpdatingDepartment: updateDepartmentMutation.isPending,
    deleteDepartment: deleteDepartmentMutation.mutate,
    isDeletingDepartment: deleteDepartmentMutation.isPending,

    // Invitations
    useInvitations,
    sendInvitation: sendInvitationMutation.mutate,
    isSendingInvitation: sendInvitationMutation.isPending,
    cancelInvitation: cancelInvitationMutation.mutate,
    isCancellingInvitation: cancelInvitationMutation.isPending,
    resendInvitation: resendInvitationMutation.mutate,
    isResendingInvitation: resendInvitationMutation.isPending,
  }
}