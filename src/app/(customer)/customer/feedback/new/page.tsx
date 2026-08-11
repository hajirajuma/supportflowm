'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useFeedback } from '@/hooks/use-feedback'
import { useCustomer } from '@/hooks/use-customer'
import { FeedbackQuestion, FeedbackQuestionType } from '@/types/feedback'
import { Ticket } from '@/types/customer'
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
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { ArrowLeft, Loader2, MessageSquare } from 'lucide-react'

// Answers are keyed by the form's real question ids. Only required questions
// are enforced client-side; the backend re-validates everything.
type Answers = Record<string, string | number | string[] | undefined>

export default function SubmitFeedbackPage() {
  const router = useRouter()
  const { useActiveForms, submitFeedback, isSubmitting } = useFeedback()
  const { useTickets } = useCustomer()

  const { data: formsData, isLoading: isLoadingForms } = useActiveForms()
  const { data: ticketsData, isLoading: isLoadingTickets } = useTickets({ limit: 50 })

  const form = useMemo(() => formsData?.items?.[0] ?? null, [formsData])
  const tickets = ticketsData?.data ?? []

  const [selectedTicketId, setSelectedTicketId] = useState<string>('')
  const [answers, setAnswers] = useState<Answers>({})
  const [comment, setComment] = useState('')
  const [error, setError] = useState<string | null>(null)

  const setAnswer = (questionId: string, value: string | number | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const isLoading = isLoadingForms || isLoadingTickets

  const missingRequired = (form?.questions ?? []).filter((q) => {
    if (!q.required) return false
    const v = answers[q.id]
    return v === undefined || v === '' || (Array.isArray(v) && v.length === 0)
  })

  const handleSubmit = async () => {
    setError(null)

    if (!form) {
      setError('No active feedback form is available for your organization.')
      return
    }
    if (!selectedTicketId) {
      setError('Please select the ticket you are providing feedback for.')
      return
    }
    if (missingRequired.length > 0) {
      setError(
        `Please answer the required question(s): ${missingRequired
          .map((q) => `"${q.label}"`)
          .join(', ')}`
      )
      return
    }
    if (form.requireComment && !comment.trim()) {
      setError('A comment is required for this survey.')
      return
    }

    const payloadAnswers = (form.questions ?? [])
      .map((q) => ({
        questionId: q.id,
        value: answers[q.id] ?? null,
      }))
      .filter(
        (a) =>
          a.value !== null &&
          a.value !== '' &&
          !(Array.isArray(a.value) && a.value.length === 0)
      )

    try {
      await submitFeedback({
        formId: form.id,
        ticketId: selectedTicketId,
        answers: payloadAnswers,
        publicComment: comment.trim() || undefined,
      })
      router.push('/customer/feedback')
    } catch {
      // Error toast is shown by the mutation
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/customer/feedback">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <Skeleton className="h-9 w-52" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!form) {
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
            <p className="text-muted-foreground">Share your experience with us</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No active feedback form</h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Your organization has not published a feedback form yet. Once a
              feedback survey is available (for example, after your ticket is
              resolved), it will appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    )
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
          <p className="text-muted-foreground">Share your experience with us</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{form.title || 'Feedback Form'}</CardTitle>
          {form.description && <CardDescription>{form.description}</CardDescription>}
          {form.welcomeMessage && (
            <p className="text-sm text-muted-foreground">{form.welcomeMessage}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ticket picker — feedback is tied to a ticket the customer created */}
          <div className="space-y-2">
            <Label htmlFor="ticket">Ticket</Label>
            <Select value={selectedTicketId} onValueChange={setSelectedTicketId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a ticket" />
              </SelectTrigger>
              <SelectContent>
                {tickets.map((ticket: Ticket) => (
                  <SelectItem key={ticket.id} value={ticket.id}>
                    {ticket.ticketNumber} — {ticket.subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {tickets.length === 0 && (
              <p className="text-sm text-muted-foreground">
                You have no tickets yet. Create a ticket first, then come back
                to share feedback.
              </p>
            )}
          </div>

          {/* Dynamic questions from the form */}
          {(form.questions ?? []).map((question) => (
            <QuestionField
              key={question.id}
              question={question}
              value={answers[question.id]}
              onChange={(value) => setAnswer(question.id, value)}
            />
          ))}

          {/* Public comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">
              Comment{form.requireComment ? '' : ' (optional)'}
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us more about your experience..."
              rows={4}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-4">
            <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
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
        </CardContent>
      </Card>
    </div>
  )
}

function QuestionField({
  question,
  value,
  onChange,
}: {
  question: FeedbackQuestion
  value: string | number | string[] | undefined
  onChange: (value: string | number | string[]) => void
}) {
  const requiredMark = question.required ? (
    <span className="text-destructive"> *</span>
  ) : null

  const description = question.description ? (
    <p className="text-xs text-muted-foreground">{question.description}</p>
  ) : null

  switch (question.questionType) {
    case FeedbackQuestionType.RATING: {
      const current =
        typeof value === 'number'
          ? value
          : typeof value === 'string'
            ? Number(value) || 0
            : 0
      return (
        <div className="space-y-2">
          <Label>
            {question.label}
            {requiredMark}
          </Label>
          {description}
          <RatingStars
            rating={current}
            size="lg"
            interactive
            onChange={(rating) => onChange(rating)}
          />
          {current > 0 && (
            <span className="text-sm text-muted-foreground">{current}/5</span>
          )}
        </div>
      )
    }

    case FeedbackQuestionType.SHORT_TEXT:
    case FeedbackQuestionType.EMAIL:
    case FeedbackQuestionType.PHONE:
    case FeedbackQuestionType.NUMBER:
      return (
        <div className="space-y-2">
          <Label htmlFor={`q-${question.id}`}>
            {question.label}
            {requiredMark}
          </Label>
          {description}
          <Input
            id={`q-${question.id}`}
            type={
              question.questionType === FeedbackQuestionType.EMAIL
                ? 'email'
                : question.questionType === FeedbackQuestionType.NUMBER
                  ? 'number'
                  : 'text'
            }
            placeholder={question.placeholder ?? ''}
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )

    case FeedbackQuestionType.LONG_TEXT:
      return (
        <div className="space-y-2">
          <Label htmlFor={`q-${question.id}`}>
            {question.label}
            {requiredMark}
          </Label>
          {description}
          <Textarea
            id={`q-${question.id}`}
            placeholder={question.placeholder ?? ''}
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
          />
        </div>
      )

    case FeedbackQuestionType.DROPDOWN:
    case FeedbackQuestionType.MULTIPLE_CHOICE:
      return (
        <div className="space-y-2">
          <Label htmlFor={`q-${question.id}`}>
            {question.label}
            {requiredMark}
          </Label>
          {description}
          <Select value={(value as string) ?? ''} onValueChange={(v) => onChange(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )

    case FeedbackQuestionType.YES_NO:
      return (
        <div className="space-y-2">
          <Label>
            {question.label}
            {requiredMark}
          </Label>
          {description}
          <Select value={(value as string) ?? ''} onValueChange={(v) => onChange(v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )

    case FeedbackQuestionType.CHECKBOX:
      return (
        <div className="space-y-2">
          <Label>
            {question.label}
            {requiredMark}
          </Label>
          {description}
          <div className="flex flex-wrap gap-3">
            {question.options.map((option) => {
              const selected = Array.isArray(value) && value.includes(option)
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    const current = Array.isArray(value) ? value : []
                    onChange(
                      selected
                        ? current.filter((o) => o !== option)
                        : [...current, option]
                    )
                  }}
                  className={cn(
                    'rounded-md border px-3 py-1.5 text-sm transition-colors',
                    selected
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:bg-muted'
                  )}
                >
                  {option}
                </button>
              )
            })}
          </div>
        </div>
      )

    default:
      // DATE, FILE_UPLOAD, and anything else fall back to a text input.
      return (
        <div className="space-y-2">
          <Label htmlFor={`q-${question.id}`}>
            {question.label}
            {requiredMark}
          </Label>
          {description}
          <Input
            id={`q-${question.id}`}
            type={question.questionType === FeedbackQuestionType.DATE ? 'date' : 'text'}
            placeholder={question.placeholder ?? ''}
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )
  }
}
