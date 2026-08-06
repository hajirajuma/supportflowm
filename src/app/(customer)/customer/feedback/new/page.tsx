'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useFeedback } from '@/hooks/use-feedback'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RatingStars } from '@/components/feedback/rating-stars'
import { cn } from '@/lib/utils'
import { ArrowLeft, Loader2 } from 'lucide-react'

const feedbackSchema = z.object({
  rating: z.number().min(1, 'Please select a rating'),
  category: z.enum(['product', 'service', 'support', 'billing', 'feature', 'general']),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  ticketId: z.string().optional(),
})

type FeedbackFormValues = z.infer<typeof feedbackSchema>

export default function SubmitFeedbackPage() {
  const router = useRouter()
  const { submitFeedback, isSubmitting } = useFeedback()
  const [rating, setRating] = useState<number>(0)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      category: 'general',
    },
  })

  const onSubmit = async (data: FeedbackFormValues) => {
    try {
      await submitFeedback(data)
      router.push('/customer/feedback')
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleRatingChange = (value: number) => {
    setRating(value)
    setValue('rating', value)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/customer/feedback">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Submit Feedback</h1>
          <p className="text-muted-foreground">
            Share your experience with us
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feedback Form</CardTitle>
          <CardDescription>
            Help us improve by providing your feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex items-center gap-4">
                <RatingStars
                  rating={rating}
                  size="lg"
                  interactive
                  onChange={handleRatingChange}
                />
                {rating > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {rating}/5
                  </span>
                )}
              </div>
              {errors.rating && (
                <p className="text-sm text-destructive">{errors.rating.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={(value) => setValue('category', value as any)}
                defaultValue="general"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief summary of your feedback"
                {...register('subject')}
                className={cn(errors.subject && 'border-destructive')}
              />
              {errors.subject && (
                <p className="text-sm text-destructive">{errors.subject.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Provide detailed feedback..."
                {...register('message')}
                rows={6}
                className={cn(errors.message && 'border-destructive')}
              />
              {errors.message && (
                <p className="text-sm text-destructive">{errors.message.message}</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Feedback'
                )}
              </Button>
              <Link href="/customer/feedback">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}