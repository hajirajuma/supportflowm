'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { resetPasswordSchema, ResetPasswordFormValues } from '@/lib/validations/auth'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPageContent />
    </Suspense>
  )
}

function ResetPasswordPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const { resetPassword, isResetPasswordLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || '',
      password: '',
      confirmPassword: '',
    },
  })

  const password = watch('password')

  useEffect(() => {
    if (!token) {
      router.push('/forgot-password')
    }
  }, [token, router])

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

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      await resetPassword(data)
      setIsSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error: any) {
      if (error.message) {
        setError('root', { message: error.message })
      }
    }
  }

  if (!token) {
    return null
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Password reset successful!</CardTitle>
          <CardDescription className="text-center">
            Your password has been reset. You&apos;ll be redirected to login.
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

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Reset password</CardTitle>
        <CardDescription className="text-center">
          Create a new password for your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('token')} />

          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                {...register('password')}
                className={cn(errors.password && 'border-destructive')}
                aria-invalid={!!errors.password}
                disabled={isResetPasswordLoading}
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
                placeholder="Confirm new password"
                {...register('confirmPassword')}
                className={cn(errors.confirmPassword && 'border-destructive')}
                aria-invalid={!!errors.confirmPassword}
                disabled={isResetPasswordLoading}
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

          <Button
            type="submit"
            className="w-full"
            disabled={isResetPasswordLoading}
          >
            {isResetPasswordLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting password...
              </>
            ) : (
              'Reset password'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}