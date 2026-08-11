'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useKnowledgeBase } from '@/hooks/use-knowledge-base'
import { ArticleEditor } from '@/components/knowledge-base/article-editor'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const articleSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  categoryId: z.string().min(1, 'Please select a category'),
  status: z.enum(['draft', 'published']),
  tags: z.array(z.string()).default([]),
})

type ArticleFormValues = z.infer<typeof articleSchema>
type ArticleInputValues = z.input<typeof articleSchema>

export default function CreateArticlePage() {
  const router = useRouter()
  const { adminCategories, createArticle, isCreatingArticle } = useKnowledgeBase()
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ArticleInputValues, any, ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      status: 'draft',
      tags: [],
    },
  })

  const onSubmit = async (data: ArticleFormValues) => {
    await createArticle({
      ...data,
      content,
      tags,
    })
    router.push('/tenant/knowledge-base')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/tenant/knowledge-base">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Article</h1>
          <p className="text-muted-foreground">
            Write a new knowledge base article
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Main Content */}
            <Card>
              <CardHeader>
                <CardTitle>Article Content</CardTitle>
                <CardDescription>
                  Write the main content of your article
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="How to use our platform"
                    {...register('title')}
                    className={cn(errors.title && 'border-destructive')}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Short Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief summary of the article..."
                    {...register('description')}
                    rows={3}
                    className={cn(errors.description && 'border-destructive')}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Content</Label>
                  <ArticleEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Write your article content here..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Configure article properties
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryId">Category</Label>
                  <Select
                    onValueChange={(value) => setValue('categoryId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {adminCategories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && (
                    <p className="text-sm text-destructive">{errors.categoryId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    onValueChange={(value) => setValue('status', value as any)}
                    defaultValue="draft"
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <Input
                    placeholder="Add tags separated by commas"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault()
                        const input = e.currentTarget
                        const value = input.value.trim()
                        if (value && !tags.includes(value)) {
                          setTags([...tags, value])
                          input.value = ''
                        }
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-sm text-primary"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => setTags(tags.filter((t) => t !== tag))}
                          className="hover:text-destructive"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={isCreatingArticle}>
                {isCreatingArticle ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Article'
                )}
              </Button>
              <Link href="/tenant/knowledge-base">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}