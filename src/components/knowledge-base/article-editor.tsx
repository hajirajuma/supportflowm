'use client'

import { Textarea } from '@/components/ui/textarea'
import { PenLine } from 'lucide-react'

interface ArticleEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export function ArticleEditor({
  value,
  onChange,
  placeholder = 'Write your article content here...',
  minHeight = '320px',
}: ArticleEditorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <PenLine className="h-4 w-4" />
        <span>Supports basic text formatting</span>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full resize-y"
        style={{ minHeight }}
      />
    </div>
  )
}
