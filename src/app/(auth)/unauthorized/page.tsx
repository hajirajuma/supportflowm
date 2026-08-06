'use client'

import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function UnauthorizedPage() {
  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <div className="flex justify-center">
          <div className="rounded-full bg-warning/10 p-3">
            <ShieldAlert className="h-12 w-12 text-warning" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Authentication Required</CardTitle>
        <CardDescription className="text-center">
          You need to be logged in to access this page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-sm text-muted-foreground">
          Please log in or create an account to continue.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/login">
            <Button className="w-full">Log in</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" className="w-full">Create account</Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="w-full">Go home</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}