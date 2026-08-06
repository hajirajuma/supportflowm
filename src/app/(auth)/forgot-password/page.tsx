'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import { forgotPasswordSchema, ForgotPasswordFormValues } from '@/lib/validations/auth'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function ForgotPasswordPage() {
  const { forgotPassword, isForgotPasswordLoading } = useAuth()
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await forgotPassword(data.email)
      setIsSuccess(true)
    } catch (error: any) {
      if (error.message) {
        setError('root', { message: error.message })
      }
    }
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Check your email</CardTitle>
          <CardDescription className="text-center">
            We've sent you a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-success/10 p-3">
              <CheckCircle className="h-12 w-12 text-success" />
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            If an account exists with that email, you will receive a password reset link shortly.
          </p>
          <Link href="/login">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Forgot password?</CardTitle>
        <CardDescription className="text-center">
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              {...register('email')}
              className={cn(errors.email && 'border-destructive')}
              aria-invalid={!!errors.email}
              disabled={isForgotPasswordLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {errors.root && (
            <p className="text-sm text-destructive text-center">
              {errors.root.message}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isForgotPasswordLoading}
          >
            {isForgotPasswordLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send reset link'
            )}
          </Button>

          <Link href="/login">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Button>
          </Link>
        </form>
      </CardContent>
    </Card>
  )
}