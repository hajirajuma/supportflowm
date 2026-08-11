'use client'

import { useNotifications } from '@/hooks/use-notifications'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { useState } from 'react'
import { NotificationPreferences } from '@/types/notification'

export default function NotificationPreferencesPage() {
  const { preferences, isLoadingPreferences, updatePreferences, isUpdatingPreferences } =
    useNotifications()

  const [localPreferences, setLocalPreferences] = useState<NotificationPreferences | undefined>(
    preferences
  )

  const handleToggle = (category: 'email' | 'inApp' | 'communication', key: string) => {
    setLocalPreferences((prev) => {
      const current: NotificationPreferences = prev ?? {
        email: {
          ticketCreated: false,
          ticketUpdated: false,
          ticketResolved: false,
          newReply: false,
          feedbackReceived: false,
          messageReceived: false,
        },
        inApp: {
          ticketUpdates: false,
          replies: false,
          feedback: false,
          systemAlerts: false,
        },
        communication: {
          productUpdates: false,
          announcements: false,
        },
      }
      const group = current[category] as Record<string, boolean>
      return {
        ...current,
        [category]: {
          ...group,
          [key]: !group[key],
        },
      } as NotificationPreferences
    })
  }

  const handleSave = async () => {
    await updatePreferences(localPreferences)
  }

  if (isLoadingPreferences) {
    return (
      <div className="container max-w-4xl py-8 space-y-6">
        <div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-6 w-12" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!preferences) {
    return null
  }

  const emailPreferences = [
    { key: 'ticketCreated', label: 'Ticket Created' },
    { key: 'ticketUpdated', label: 'Ticket Updated' },
    { key: 'ticketResolved', label: 'Ticket Resolved' },
    { key: 'newReply', label: 'New Reply' },
    { key: 'feedbackReceived', label: 'Feedback Received' },
    { key: 'messageReceived', label: 'Message Received' },
  ]

  const inAppPreferences = [
    { key: 'ticketUpdates', label: 'Ticket Updates' },
    { key: 'replies', label: 'Replies' },
    { key: 'feedback', label: 'Feedback' },
    { key: 'systemAlerts', label: 'System Alerts' },
  ]

  const communicationPreferences = [
    { key: 'productUpdates', label: 'Product Updates' },
    { key: 'announcements', label: 'Organization Announcements' },
  ]

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notification Preferences</h1>
        <p className="text-muted-foreground">
          Control how you receive notifications
        </p>
      </div>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Receive notifications via email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {emailPreferences.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <Label htmlFor={`email-${key}`} className="cursor-pointer">
                {label}
              </Label>
              <Switch
                id={`email-${key}`}
                checked={localPreferences?.email?.[key as keyof typeof localPreferences.email] || false}
                onCheckedChange={() => handleToggle('email', key)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* In-App Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>In-App Notifications</CardTitle>
          <CardDescription>
            Receive notifications within the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {inAppPreferences.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <Label htmlFor={`inapp-${key}`} className="cursor-pointer">
                {label}
              </Label>
              <Switch
                id={`inapp-${key}`}
                checked={localPreferences?.inApp?.[key as keyof typeof localPreferences.inApp] || false}
                onCheckedChange={() => handleToggle('inApp', key)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Communication Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Communication Preferences</CardTitle>
          <CardDescription>
            Update your communication preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {communicationPreferences.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <Label htmlFor={`comm-${key}`} className="cursor-pointer">
                {label}
              </Label>
              <Switch
                id={`comm-${key}`}
                checked={
                  localPreferences?.communication?.[key as keyof typeof localPreferences.communication] ||
                  false
                }
                onCheckedChange={() => handleToggle('communication', key)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Button
        onClick={handleSave}
        disabled={isUpdatingPreferences}
        className="w-full sm:w-auto"
      >
        {isUpdatingPreferences ? 'Saving...' : 'Save Preferences'}
      </Button>
    </div>
  )
}