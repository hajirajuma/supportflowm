'use client'

import Link from 'next/link'
import { ShieldX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ForbiddenPage() {
  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-3">
            <ShieldX className="h-12 w-12 text-destructive" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Access Denied</CardTitle>
        <CardDescription className="text-center">
          You don&apos;t have permission to access this page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-sm text-muted-foreground">
          Please contact your administrator if you believe this is a mistake.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/dashboard">
            <Button className="w-full">Go to dashboard</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">Go home</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}