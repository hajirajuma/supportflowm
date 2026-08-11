'use client'

import { useEffect, useState } from 'react'
import { useCustomer } from '@/hooks/use-customer'
import { useAuth } from '@/hooks/use-auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Loader2, Save } from 'lucide-react'

export default function CustomerProfilePage() {
  const { profile, isLoadingProfile, updateProfile, isUpdatingProfile } =
    useCustomer()
  const { user } = useAuth()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName ?? '')
      setLastName(profile.lastName ?? '')
      setPhone(profile.phone ?? '')
    }
  }, [profile])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() || undefined,
    })
  }

  if (isLoadingProfile && !profile) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-48" />
        <Card>
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-5 w-2/3" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          View and update your account information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Your details as known to the support team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Email</dt>
              <dd className="font-medium">{profile?.email ?? user?.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Role</dt>
              <dd className="font-medium capitalize">
                <Badge variant="outline">
                  {(profile?.role ?? user?.roles?.[0] ?? 'customer').toLowerCase()}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Member since</dt>
              <dd className="font-medium">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString()
                  : '—'}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your name and phone number</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 0100"
              />
            </div>
            <Button type="submit" disabled={isUpdatingProfile}>
              {isUpdatingProfile ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
