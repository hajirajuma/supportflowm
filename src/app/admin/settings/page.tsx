'use client'

import { useAdmin } from '@/hooks/use-admin'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Save, Loader2 } from 'lucide-react'

const settingsSchema = z.object({
  platform: z.object({
    name: z.string().min(1, 'Platform name is required'),
    supportEmail: z.string().email('Invalid email address'),
    timezone: z.string().min(1, 'Timezone is required'),
  }),
  security: z.object({
    passwordMinLength: z.number().min(6, 'Minimum length must be at least 6'),
    requireUppercase: z.boolean(),
    requireLowercase: z.boolean(),
    requireNumbers: z.boolean(),
    requireSpecialChars: z.boolean(),
    sessionTimeout: z.number().min(15, 'Session timeout must be at least 15 minutes'),
    maxLoginAttempts: z.number().min(3, 'Must be at least 3 attempts'),
    lockoutDuration: z.number().min(5, 'Lockout duration must be at least 5 minutes'),
  }),
  features: z.object({
    tickets: z.boolean(),
    feedback: z.boolean(),
    knowledgeBase: z.boolean(),
    analytics: z.boolean(),
    billing: z.boolean(),
  }),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

export default function SettingsPage() {
  const { settings, isLoadingSettings, updateSettings, isUpdatingSettings } = useAdmin()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    values: settings
      ? {
          platform: {
            name: settings.platform.name,
            supportEmail: settings.platform.supportEmail,
            timezone: settings.platform.timezone,
          },
          security: {
            passwordMinLength: settings.security.passwordMinLength,
            requireUppercase: settings.security.requireUppercase,
            requireLowercase: settings.security.requireLowercase,
            requireNumbers: settings.security.requireNumbers,
            requireSpecialChars: settings.security.requireSpecialChars,
            sessionTimeout: settings.security.sessionTimeout,
            maxLoginAttempts: settings.security.maxLoginAttempts,
            lockoutDuration: settings.security.lockoutDuration,
          },
          features: {
            tickets: settings.features.tickets,
            feedback: settings.features.feedback,
            knowledgeBase: settings.features.knowledgeBase,
            analytics: settings.features.analytics,
            billing: settings.features.billing,
          },
        }
      : undefined,
  })

  const onSubmit = async (data: SettingsFormValues) => {
    await updateSettings(data)
  }

  if (isLoadingSettings) {
    return <SettingsSkeleton />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Platform Settings</h1>
        <p className="text-muted-foreground">
          Configure your SaaS platform
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure platform-wide settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input
                    id="platformName"
                    {...register('platform.name')}
                    className={cn(errors.platform?.name && 'border-destructive')}
                  />
                  {errors.platform?.name && (
                    <p className="text-sm text-destructive">{errors.platform.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    {...register('platform.supportEmail')}
                    className={cn(errors.platform?.supportEmail && 'border-destructive')}
                  />
                  {errors.platform?.supportEmail && (
                    <p className="text-sm text-destructive">
                      {errors.platform.supportEmail.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    {...register('platform.timezone')}
                    className={cn(errors.platform?.timezone && 'border-destructive')}
                  />
                  {errors.platform?.timezone && (
                    <p className="text-sm text-destructive">
                      {errors.platform.timezone.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure security policies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    {...register('security.passwordMinLength', { valueAsNumber: true })}
                    className={cn(errors.security?.passwordMinLength && 'border-destructive')}
                  />
                  {errors.security?.passwordMinLength && (
                    <p className="text-sm text-destructive">
                      {errors.security.passwordMinLength.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireUppercase">Require Uppercase Letters</Label>
                    <Switch
                      id="requireUppercase"
                      checked={watch('security.requireUppercase')}
                      onCheckedChange={(checked) =>
                        setValue('security.requireUppercase', checked)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireLowercase">Require Lowercase Letters</Label>
                    <Switch
                      id="requireLowercase"
                      checked={watch('security.requireLowercase')}
                      onCheckedChange={(checked) =>
                        setValue('security.requireLowercase', checked)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireNumbers">Require Numbers</Label>
                    <Switch
                      id="requireNumbers"
                      checked={watch('security.requireNumbers')}
                      onCheckedChange={(checked) =>
                        setValue('security.requireNumbers', checked)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireSpecialChars">Require Special Characters</Label>
                    <Switch
                      id="requireSpecialChars"
                      checked={watch('security.requireSpecialChars')}
                      onCheckedChange={(checked) =>
                        setValue('security.requireSpecialChars', checked)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    {...register('security.sessionTimeout', { valueAsNumber: true })}
                    className={cn(errors.security?.sessionTimeout && 'border-destructive')}
                  />
                  {errors.security?.sessionTimeout && (
                    <p className="text-sm text-destructive">
                      {errors.security.sessionTimeout.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    {...register('security.maxLoginAttempts', { valueAsNumber: true })}
                    className={cn(errors.security?.maxLoginAttempts && 'border-destructive')}
                  />
                  {errors.security?.maxLoginAttempts && (
                    <p className="text-sm text-destructive">
                      {errors.security.maxLoginAttempts.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
                  <Input
                    id="lockoutDuration"
                    type="number"
                    {...register('security.lockoutDuration', { valueAsNumber: true })}
                    className={cn(errors.security?.lockoutDuration && 'border-destructive')}
                  />
                  {errors.security?.lockoutDuration && (
                    <p className="text-sm text-destructive">
                      {errors.security.lockoutDuration.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Feature Management</CardTitle>
                <CardDescription>
                  Enable or disable platform features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Tickets</Label>
                      <p className="text-sm text-muted-foreground">
                        Support ticket management
                      </p>
                    </div>
                    <Switch
                      checked={watch('features.tickets')}
                      onCheckedChange={(checked) =>
                        setValue('features.tickets', checked)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Feedback</Label>
                      <p className="text-sm text-muted-foreground">
                        Customer feedback collection
                      </p>
                    </div>
                    <Switch
                      checked={watch('features.feedback')}
                      onCheckedChange={(checked) =>
                        setValue('features.feedback', checked)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Knowledge Base</Label>
                      <p className="text-sm text-muted-foreground">
                        Documentation and help center
                      </p>
                    </div>
                    <Switch
                      checked={watch('features.knowledgeBase')}
                      onCheckedChange={(checked) =>
                        setValue('features.knowledgeBase', checked)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Analytics</Label>
                      <p className="text-sm text-muted-foreground">
                        Platform analytics and reporting
                      </p>
                    </div>
                    <Switch
                      checked={watch('features.analytics')}
                      onCheckedChange={(checked) =>
                        setValue('features.analytics', checked)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Billing</Label>
                      <p className="text-sm text-muted-foreground">
                        Subscription and payment management
                      </p>
                    </div>
                    <Switch
                      checked={watch('features.billing')}
                      onCheckedChange={(checked) =>
                        setValue('features.billing', checked)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex justify-end">
            <Button type="submit" disabled={isUpdatingSettings}>
              {isUpdatingSettings ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </Tabs>
      </form>
    </div>
  )
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>

      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}