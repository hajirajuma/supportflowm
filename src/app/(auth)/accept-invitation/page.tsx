'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle, XCircle, User, Building2, Mail as MailIcon, Calendar } from 'lucide-react'
import { acceptInvitationSchema, AcceptInvitationFormValues } from '@/lib/validations/auth'
import { useAuth } from '@/hooks/use-auth'
import { authService } from '@/services/auth.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn, formatDate } from '@/lib/utils'
import { InvitationData } from '@/types/auth'

export default function AcceptInvitationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const { acceptInvitation, isAcceptingInvitation, rejectInvitation, isRejectingInvitation } = useAuth()
  const [invitation, setInvitation] = useState<InvitationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isAccepted, setIsAccepted] = useState(false)
  const [isRejected, setIsRejected] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError: setFormError,
  } = useForm<AcceptInvitationFormValues>({
    resolver: zodResolver(acceptInvitationSchema),
    defaultValues: {
      token: token || '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    },
  })

  const password = watch('password')

  useEffect(() => {
    if (!token) {
      setError('No invitation token provided')
      setLoading(false)
      return
    }

    const fetchInvitation = async () => {
      try {
        const data = await authService.getInvitation(token)
        setInvitation(data)
        setLoading(false)
      } catch (err: any) {
        setError(err.message || 'Failed to load invitation')
        setLoading(false)
      }
    }

    fetchInvitation()
  }, [token])

  useEffect(() => {
    // Calculate password strength
    if (!password) {
      setPasswordStrength(0)
      return
    }

    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 12.5
    if (/[^A-Za-z0-9]/.test(password)) strength += 12.5
    setPasswordStrength(Math.min(strength, 100))
  }, [password])

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return 'bg-destructive'
    if (passwordStrength < 60) return 'bg-warning'
    if (passwordStrength < 80) return 'bg-primary'
    return 'bg-success'
  }

  const onSubmit = async (data: AcceptInvitationFormValues) => {
    try {
      await acceptInvitation(data)
      setIsAccepted(true)
    } catch (err: any) {
      setFormError('root', { message: err.message || 'Failed to accept invitation' })
    }
  }

  const handleReject = async () => {
    if (!token) return
    try {
      await rejectInvitation(token)
      setIsRejected(true)
    } catch (err: any) {
      setError(err.message || 'Failed to reject invitation')
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Loading invitation...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-destructive">Invitation Error</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <p className="text-center text-muted-foreground">{error}</p>
          <Button
            className="w-full"
            onClick={() => router.push('/')}
          >
            Go home
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isAccepted) {
    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-success">Invitation Accepted!</CardTitle>
          <CardDescription className="text-center">
            Welcome to SupportFlow! You'll be redirected shortly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="rounded-full bg-success/10 p-3">
              <CheckCircle className="h-12 w-12 text-success" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isRejected) {
    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Invitation Rejected</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-muted p-3">
              <XCircle className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <p className="text-center text-muted-foreground">
            You have declined the invitation. You can close this page.
          </p>
          <Button
            className="w-full"
            onClick={() => router.push('/')}
          >
            Go home
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!invitation) {
    return null
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Accept Invitation</CardTitle>
        <CardDescription className="text-center">
          You've been invited to join {invitation.organizationName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Invitation Details */}
        <div className="space-y-3 rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <strong>Organization:</strong> {invitation.organizationName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <strong>Role:</strong>{' '}
              <Badge variant="secondary" className="capitalize">
                {invitation.role.replace('_', ' ')}
              </Badge>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MailIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <strong>Email:</strong> {invitation.email}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <strong>Expires:</strong> {formatDate(invitation.expiresAt)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              <strong>Invited by:</strong> {invitation.invitedBy.firstName}{' '}
              {invitation.invitedBy.lastName}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('token')} />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                {...register('firstName')}
                className={cn(errors.firstName && 'border-destructive')}
                aria-invalid={!!errors.firstName}
                disabled={isAcceptingInvitation}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                {...register('lastName')}
                className={cn(errors.lastName && 'border-destructive')}
                aria-invalid={!!errors.lastName}
                disabled={isAcceptingInvitation}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Create password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                {...register('password')}
                className={cn(errors.password && 'border-destructive')}
                aria-invalid={!!errors.password}
                disabled={isAcceptingInvitation}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {password && (
              <div className="space-y-1">
                <Progress
                  value={passwordStrength}
                  className="h-1"
                  indicatorClassName={getPasswordStrengthColor()}
                />
                <p className="text-xs text-muted-foreground">
                  {passwordStrength < 30 && 'Weak'}
                  {passwordStrength >= 30 && passwordStrength < 60 && 'Fair'}
                  {passwordStrength >= 60 && passwordStrength < 80 && 'Good'}
                  {passwordStrength >= 80 && 'Strong'}
                </p>
              </div>
            )}
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                {...register('confirmPassword')}
                className={cn(errors.confirmPassword && 'border-destructive')}
                aria-invalid={!!errors.confirmPassword}
                disabled={isAcceptingInvitation}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          {errors.root && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p>{errors.root.message}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1"
              disabled={isAcceptingInvitation}
            >
              {isAcceptingInvitation ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Accepting...
                </>
              ) : (
                'Accept invitation'
              )}
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="flex-1"
              onClick={handleReject}
              disabled={isRejectingInvitation}
            >
              {isRejectingInvitation ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                'Decline'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}