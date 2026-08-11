'use client'

import { useOrganization } from '@/hooks/use-organization'
import { useRole } from '@/hooks/use-role'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Building2, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  contactEmail: z.string().email('Invalid email address'),
  contactPhone: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  address: z.string().optional(),
  timezone: z.string(),
  language: z.string(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function OrganizationProfilePage() {
  const { isTenantOwner } = useRole()
  const { organization, updateOrganization, uploadLogo, isLoadingOrg } =
    useOrganization()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: organization
      ? {
          name: organization.name,
          description: organization.description || '',
          contactEmail: organization.contactEmail,
          contactPhone: organization.contactPhone || '',
          website: organization.website || '',
          address: organization.address || '',
          timezone: organization.timezone,
          language: organization.language,
        }
      : undefined,
  })

  const onSubmit = async (data: ProfileFormValues) => {
    await updateOrganization(data)
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Logo must be less than 2MB')
        return
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error('Logo must be JPEG, PNG, or WebP')
        return
      }
      await uploadLogo(file)
    }
  }

  if (!isTenantOwner) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            Only Tenant Owners can manage organization profile
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (isLoadingOrg) {
    return <ProfileSkeleton />
  }

  if (!organization) {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Organization Profile</h1>
        <p className="text-muted-foreground">
          Manage your organization&apos;s information
        </p>
      </div>

      <div className="grid gap-6">
        {/* Logo Section */}
        <Card>
          <CardHeader>
            <CardTitle>Organization Logo</CardTitle>
            <CardDescription>
              Upload your organization&apos;s logo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={organization.logo} />
                <AvatarFallback>
                  <Building2 className="h-12 w-12 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="logo-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 hover:bg-accent">
                    <Upload className="h-4 w-4" />
                    Upload Logo
                  </div>
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </Label>
                <p className="mt-2 text-sm text-muted-foreground">
                  SVG, PNG, JPG, or WEBP (max 2MB)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update your organization&apos;s basic details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name</Label>
                  <Input
                    id="name"
                    placeholder="Acme Inc."
                    {...register('name')}
                    className={cn(errors.name && 'border-destructive')}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="contact@acme.com"
                    {...register('contactEmail')}
                    className={cn(errors.contactEmail && 'border-destructive')}
                  />
                  {errors.contactEmail && (
                    <p className="text-sm text-destructive">
                      {errors.contactEmail.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    placeholder="+1 (555) 000-0000"
                    {...register('contactPhone')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://acme.com"
                    {...register('website')}
                    className={cn(errors.website && 'border-destructive')}
                  />
                  {errors.website && (
                    <p className="text-sm text-destructive">{errors.website.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us about your organization"
                  {...register('description')}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="123 Business St, City, Country"
                  {...register('address')}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Time Zone</Label>
                  <Input
                    id="timezone"
                    placeholder="America/New_York"
                    {...register('timezone')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    placeholder="English"
                    {...register('language')}
                  />
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div>
              <Skeleton className="h-10 w-32" />
              <Skeleton className="mt-2 h-4 w-48" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    </div>
  )
}