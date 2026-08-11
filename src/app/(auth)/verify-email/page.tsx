'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, CheckCircle, AlertCircle, Mail, ArrowRight } from 'lucide-react'
import { verifyEmailSchema, VerifyEmailFormValues } from '@/lib/validations/auth'
import { useAuth, roleHomeFor } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailPageContent />
    </Suspense>
  )
}

function VerifyEmailPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const { user, isAuthenticated, verifyEmail, isVerifyingEmail, resendVerification, isResendingVerification } = useAuth()
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>(
    token ? 'verifying' : 'idle'
  )
  const [error, setError] = useState<string | null>(null)

  // A verified tenant always belongs on their own dashboard — never back on
  // the login page (registration always creates a TENANT_OWNER).
  const dashboardUrl = roleHomeFor(user?.roles)

  // Brief countdown so the success state is visible, then auto-redirect.
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    // Only auto-redirect when a session was actually issued (fresh-token
    // verification). Already-verified re-clicks have no session, so they get
    // the success card with a manual dashboard button instead.
    if (status !== 'success' || !isAuthenticated) return
    if (countdown <= 0) {
      router.push(dashboardUrl)
      return
    }
    const timer = window.setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [status, countdown, dashboardUrl, router, isAuthenticated])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      token: token || '',
    },
  })

  const handleVerify = async (values: VerifyEmailFormValues) => {
    setStatus('verifying')
    try {
      await verifyEmail(values.token)
      setStatus('success')
    } catch (err: any) {
      setStatus('error')
      setError(err.message || 'Failed to verify email. Please try again.')
    }
  }

  // Auto-verify when the user arrives via the emailed link (?token=...).
  // This is the crucial step: verification actually reaches the backend and
  // only transitions to success when the server confirms the account is
  // verified. A failed/expired token surfaces an error instead of faking a
  // successful verification.
  useEffect(() => {
    if (!token || status !== 'verifying') return
    verifyEmail(token)
      .then(() => setStatus('success'))
      .catch((err: any) => {
        setStatus('error')
        setError(err.message || 'Failed to verify email. Please try again.')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const handleResend = async (email: string) => {
    try {
      await resendVerification(email)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email')
    }
  }

  if (status === 'success') {
    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Email verified</CardTitle>
          <CardDescription className="text-center">
            {isAuthenticated
              ? countdown > 0
                ? `Your account is ready. Redirecting to your dashboard in ${countdown}s…`
                : 'Your account is ready. Head to your dashboard to get started.'
              : 'Your email is already verified. Head to your dashboard to get started.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-success/10 p-3">
              <CheckCircle className="h-12 w-12 text-success" />
            </div>
          </div>
          <Link href={dashboardUrl}>
            <Button className="w-full">
              Go to your dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Verify your email</CardTitle>
        <CardDescription className="text-center">
          Enter your verification token to activate your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'error' && error && (
          <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(handleVerify)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token">Verification token</Label>
            <Input
              id="token"
              placeholder="Paste your verification token"
              {...register('token')}
              className={cn(errors.token && 'border-destructive')}
              aria-invalid={!!errors.token}
              disabled={isVerifyingEmail}
            />
            {errors.token && (
              <p className="text-sm text-destructive">{errors.token.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isVerifyingEmail}>
            {isVerifyingEmail ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify email'
            )}
          </Button>
        </form>

        <div className="space-y-2 rounded-md bg-muted p-3">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Mail className="h-4 w-4" />
            Did not receive the email?
          </p>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              const email = new FormData(e.currentTarget).get('email') as string
              if (email) {
                handleResend(email)
              }
            }}
          >
            <Input
              type="email"
              name="email"
              placeholder="name@company.com"
              disabled={isResendingVerification}
            />
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="shrink-0"
              disabled={isResendingVerification}
            >
              {isResendingVerification ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Resend'
              )}
            </Button>
          </form>
        </div>

        <Link href="/login">
          <Button variant="ghost" className="w-full">
            Back to login
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
