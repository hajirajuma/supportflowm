'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, CheckCircle, XCircle, Building2, Mail, User, Phone, AlertCircle } from 'lucide-react'
import { registerSchema, RegisterFormValues } from '@/lib/validations/auth'
import { authService } from '@/services/auth.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isSubdomainAvailable, setIsSubdomainAvailable] = useState<boolean | null>(null)
  const [isCheckingSubdomain, setIsCheckingSubdomain] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [registrationData, setRegistrationData] = useState<any>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      organizationName: '',
      subdomain: '',
      phoneNumber: '',
      acceptTerms: false,
      acceptPrivacy: false,
    },
  })

  const password = watch('password')
  const subdomain = watch('subdomain')
  const organizationName = watch('organizationName')

  // Auto-generate subdomain from organization name
  useEffect(() => {
    if (organizationName && !subdomain) {
      const generated = organizationName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 30)
      if (generated && !subdomain) {
        setValue('subdomain', generated)
      }
    }
  }, [organizationName, subdomain, setValue])

  // Password strength calculator
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0)
      return
    }

    let strength = 0
    if (password.length >= 8) strength += 20
    if (/[A-Z]/.test(password)) strength += 20
    if (/[a-z]/.test(password)) strength += 20
    if (/[0-9]/.test(password)) strength += 20
    if (/[^A-Za-z0-9]/.test(password)) strength += 20
    setPasswordStrength(Math.min(strength, 100))
  }, [password])

  // Check subdomain availability with debounce
  useEffect(() => {
    const checkSubdomain = async () => {
      if (!subdomain || subdomain.length < 3) {
        setIsSubdomainAvailable(null)
        return
      }

      // Validate subdomain format
      const isValid = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(subdomain)
      if (!isValid) {
        setIsSubdomainAvailable(null)
        return
      }

      setIsCheckingSubdomain(true)
      try {
        const response = await authService.checkSubdomainAvailability(subdomain)
        setIsSubdomainAvailable(response.available)
        if (!response.available) {
          setError('subdomain', {
            type: 'manual',
            message: response.message || 'This subdomain is already taken',
          })
        } else {
          clearErrors('subdomain')
        }
      } catch (error) {
        setIsSubdomainAvailable(null)
        toast.error('Failed to check subdomain availability')
      } finally {
        setIsCheckingSubdomain(false)
      }
    }

    const timer = setTimeout(checkSubdomain, 500)
    return () => clearTimeout(timer)
  }, [subdomain, setError, clearErrors])

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return 'bg-destructive'
    if (passwordStrength < 60) return 'bg-warning'
    if (passwordStrength < 80) return 'bg-primary'
    return 'bg-success'
  }

  const getPasswordStrengthLabel = () => {
    if (passwordStrength < 30) return 'Weak'
    if (passwordStrength < 60) return 'Fair'
    if (passwordStrength < 80) return 'Good'
    return 'Strong'
  }

  const onSubmit = async (data: RegisterFormValues) => {
    // Don't submit if subdomain is not available
    if (isSubdomainAvailable === false) {
      toast.error('Please choose a different subdomain')
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare registration data matching backend DTO. The terms/privacy
      // checkboxes are validated client-side; the backend DTO whitelist
      // rejects extra fields, so they are intentionally not sent.
      const registerData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        organizationName: data.organizationName,
        subdomain: data.subdomain,
        
}

      const response = await authService.register(registerData)

      setRegistrationSuccess(true)
      setRegistrationData(response)

      toast.success(response.message || 'Organization created successfully!')

      // If email verification is required
      if (response.requiresEmailVerification) {
        // Stay on page with success message
      } else if (response.accessToken) {
        // If backend auto-authenticates, redirect to dashboard
        // This would use the auth store setAuth method
        // For now, redirect to login
        setTimeout(() => {
          router.push('/login?registered=true')
        }, 3000)
      } else {
        // Redirect to verify email or login
        setTimeout(() => {
          router.push('/verify-email')
        }, 3000)
      }
    } catch (error: any) {
      // Handle specific errors from backend
      const errorMessage = error.message || 'Registration failed. Please try again.'

      if (errorMessage.includes('email')) {
        setError('email', { type: 'manual', message: errorMessage })
      } else if (errorMessage.includes('subdomain')) {
        setError('subdomain', { type: 'manual', message: errorMessage })
      } else if (errorMessage.includes('password')) {
        setError('password', { type: 'manual', message: errorMessage })
      } else {
        toast.error(errorMessage)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success state
  if (registrationSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 md:p-8">
        <Card className="my-auto w-full max-w-lg shrink-0 shadow-lg">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-success/10 p-3">
                <CheckCircle className="h-12 w-12 text-success" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Organization Created!</CardTitle>
            <CardDescription className="text-center">
              {registrationData?.message || 'Your organization has been set up successfully.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground text-center">
                {registrationData?.requiresEmailVerification ? (
                  <>
                    <strong>Next Step:</strong> Check your email to verify your account.
                    <br />
                    <span className="text-xs">
                      We've sent a verification link to your email address.
                    </span>
                  </>
                ) : (
                  <>
                    <strong>Success!</strong> Your account is ready.
                    <br />
                    <span className="text-xs">You'll be redirected to login shortly.</span>
                  </>
                )}
              </p>
            </div>
            <Link href="/login">
              <Button className="w-full">
                Go to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid w-full min-h-screen lg:grid-cols-2">
      {/* Left Column - Branding & Benefits */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 px-12 py-12">
        <div className="my-auto w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">SF</span>
            </div>
            <span className="text-2xl font-bold text-secondary">SupportFlow</span>
          </div>

          <h1 className="text-3xl font-bold font-poppins mb-4">
            Start Your Free Trial
          </h1>
          <p className="text-muted-foreground mb-8">
            Create your organization and start delivering exceptional customer experiences today.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Create Your Organization</p>
                <p className="text-sm text-muted-foreground">
                  Get your own workspace with a custom subdomain
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Become the Tenant Owner</p>
                <p className="text-sm text-muted-foreground">
                  Full control over your organization's support operations
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Invite Your Team</p>
                <p className="text-sm text-muted-foreground">
                  Add support agents and customers through invitations
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">14-day free trial</span>
              {' • '}
              No credit card required
              {' • '}
              Cancel anytime
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Registration Form */}
      <div className="flex items-start justify-center px-4 py-8 md:px-8 md:py-12">
        <Card className="my-auto w-full max-w-lg shrink-0 shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center lg:hidden mb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SF</span>
                </div>
                <span className="text-xl font-bold text-secondary">SupportFlow</span>
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Create Your Account</CardTitle>
            <CardDescription className="text-center">
              Start your 14-day free trial today
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name Fields */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    {...register('firstName')}
                    className={cn(errors.firstName && 'border-destructive')}
                    disabled={isSubmitting}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    {...register('lastName')}
                    className={cn(errors.lastName && 'border-destructive')}
                    disabled={isSubmitting}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  {...register('email')}
                  className={cn(errors.email && 'border-destructive')}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    {...register('password')}
                    className={cn(errors.password && 'border-destructive')}
                    disabled={isSubmitting}
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

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-1">
                    <Progress
                      value={passwordStrength}
                      className="h-1"
                      indicatorClassName={getPasswordStrengthColor()}
                    />
                    <p className="text-xs text-muted-foreground">
                      Password strength: {getPasswordStrengthLabel()}
                    </p>
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <p className={cn(password.length >= 8 ? 'text-success' : 'text-muted-foreground')}>
                        • At least 8 characters
                      </p>
                      <p className={cn(/[A-Z]/.test(password) ? 'text-success' : 'text-muted-foreground')}>
                        • At least one uppercase letter
                      </p>
                      <p className={cn(/[a-z]/.test(password) ? 'text-success' : 'text-muted-foreground')}>
                        • At least one lowercase letter
                      </p>
                      <p className={cn(/[0-9]/.test(password) ? 'text-success' : 'text-muted-foreground')}>
                        • At least one number
                      </p>
                      <p className={cn(/[^A-Za-z0-9]/.test(password) ? 'text-success' : 'text-muted-foreground')}>
                        • At least one special character
                      </p>
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    {...register('confirmPassword')}
                    className={cn(errors.confirmPassword && 'border-destructive')}
                    disabled={isSubmitting}
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

              {/* Organization Name */}
              <div className="space-y-2">
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  id="organizationName"
                  placeholder="Acme Inc."
                  {...register('organizationName')}
                  className={cn(errors.organizationName && 'border-destructive')}
                  disabled={isSubmitting}
                />
                {errors.organizationName && (
                  <p className="text-sm text-destructive">{errors.organizationName.message}</p>
                )}
              </div>

              {/* Subdomain */}
              <div className="space-y-2">
                <Label htmlFor="subdomain">Subdomain</Label>
                <div className="relative">
                  <Input
                    id="subdomain"
                    placeholder="acme"
                    {...register('subdomain')}
                    className={cn(
                      'pr-20',
                      errors.subdomain && 'border-destructive'
                    )}
                    disabled={isSubmitting}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    .supportflow.com
                  </span>
                </div>

                {/* Subdomain Availability Indicator */}
                {subdomain && subdomain.length >= 3 && (
                  <div className="flex items-center gap-2">
                    {isCheckingSubdomain ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Checking availability...</span>
                      </>
                    ) : isSubdomainAvailable === true ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm text-success">
                          {subdomain}.supportflow.com is available
                        </span>
                      </>
                    ) : isSubdomainAvailable === false ? (
                      <>
                        <XCircle className="h-4 w-4 text-destructive" />
                        <span className="text-sm text-destructive">
                          {subdomain}.supportflow.com is already taken
                        </span>
                      </>
                    ) : null}
                  </div>
                )}

                {errors.subdomain && (
                  <p className="text-sm text-destructive">{errors.subdomain.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Your workspace URL: https://{subdomain || 'your-org'}.supportflow.com
                </p>
              </div>

              {/* Phone Number */}
            {/* Terms & Privacy */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="acceptTerms"
                    {...register('acceptTerms')}
                    disabled={isSubmitting}
                    className="mt-1"
                  />
                  <Label htmlFor="acceptTerms" className="text-sm font-normal cursor-pointer">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary hover:underline" target="_blank">
                      Terms of Service
                    </Link>
                  </Label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>
                )}

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="acceptPrivacy"
                    {...register('acceptPrivacy')}
                    disabled={isSubmitting}
                    className="mt-1"
                  />
                  <Label htmlFor="acceptPrivacy" className="text-sm font-normal cursor-pointer">
                    I agree to the{' '}
                    <Link href="/privacy" className="text-primary hover:underline" target="_blank">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {errors.acceptPrivacy && (
                  <p className="text-sm text-destructive">{errors.acceptPrivacy.message}</p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isSubmitting || (isSubdomainAvailable === false)}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Organization...
                  </>
                ) : (
                  'Create Organization'
                )}
              </Button>

              {/* Login Link */}
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}