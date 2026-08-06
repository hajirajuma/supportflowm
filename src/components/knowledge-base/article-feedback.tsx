'use client'

import { useState } from 'react'
import { useKnowledgeBase } from '@/hooks/use-knowledge-base'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ArticleFeedbackProps {
  articleId: string
  slug: string
  helpfulCount: number
  notHelpfulCount: number
}

export function ArticleFeedback({
  articleId,
  slug,
  helpfulCount,
  notHelpfulCount,
}: ArticleFeedbackProps) {
  const { submitFeedback, isSubmittingFeedback } = useKnowledgeBase()
  const [selectedFeedback, setSelectedFeedback] = useState<'helpful' | 'not_helpful' | null>(null)
  const [comment, setComment] = useState('')
  const [showComment, setShowComment] = useState(false)

  const handleFeedback = async (type: 'helpful' | 'not_helpful') => {
    setSelectedFeedback(type)
    setShowComment(true)
  }

  const handleSubmit = async () => {
    if (!selectedFeedback) return

    await submitFeedback({
      slug,
      data: {
        feedback: selectedFeedback,
        comment: comment.trim() || undefined,
      },
    })

    setSelectedFeedback(null)
    setShowComment(false)
    setComment('')
  }

  return (
    <div className="space-y-4">
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold">Was this article helpful?</h3>
        <p className="text-sm text-muted-foreground">
          Your feedback helps us improve our documentation
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant={selectedFeedback === 'helpful' ? 'default' : 'outline'}
          onClick={() => handleFeedback('helpful')}
          disabled={!!selectedFeedback && selectedFeedback !== 'helpful'}
        >
          <ThumbsUp className="mr-2 h-4 w-4" />
          Yes ({helpfulCount})
        </Button>
        <Button
          variant={selectedFeedback === 'not_helpful' ? 'default' : 'outline'}
          onClick={() => handleFeedback('not_helpful')}
          disabled={!!selectedFeedback && selectedFeedback !== 'not_helpful'}
        >
          <ThumbsDown className="mr-2 h-4 w-4" />
          No ({notHelpfulCount})
        </Button>
      </div>

      {showComment && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Additional Feedback</span>
          </div>
          <Textarea
            placeholder="Tell us how we can improve this article..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={isSubmittingFeedback}
            >
              {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowComment(false)
                setSelectedFeedback(null)
                setComment('')
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {selectedFeedback && !showComment && (
        <p className="text-sm text-muted-foreground">
          Thank you for your feedback!
        </p>
      )}
    </div>
  )
}