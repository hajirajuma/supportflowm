'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Progress } from './progress'
import { X, Upload, File, Image, FileText, Film } from 'lucide-react'

interface FileUploadProps {
  onFilesAdded: (files: File[]) => void
  onFileRemoved: (file: File) => void
  accept?: Record<string, string[]>
  maxFiles?: number
  maxSize?: number
  uploadProgress?: Record<string, number>
  className?: string
}

export function FileUpload({
  onFilesAdded,
  onFileRemoved,
  accept,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024,
  uploadProgress = {},
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.slice(0, maxFiles - files.length)
      setFiles((prev) => [...prev, ...newFiles])
      onFilesAdded(newFiles)
    },
    [files.length, maxFiles, onFilesAdded]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
  })

  const handleRemove = (file: File) => {
    setFiles((prev) => prev.filter((f) => f !== file))
    onFileRemoved(file)
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image
    if (file.type === 'application/pdf') return FileText
    if (file.type.startsWith('video/')) return Film
    return File
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors hover:bg-accent',
          isDragActive && 'border-primary bg-primary/5',
          files.length >= maxFiles && 'cursor-not-allowed opacity-50'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          {isDragActive
            ? 'Drop files here'
            : `Drag & drop files here, or click to select`}
        </p>
        <p className="text-xs text-muted-foreground">
          Maximum {maxFiles} files, up to {formatSize(maxSize)} each
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => {
            const Icon = getFileIcon(file)
            const progress = uploadProgress[file.name] || 0
            const isUploading = progress > 0 && progress < 100

            return (
              <div
                key={file.name}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <Icon className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatSize(file.size)}
                  </p>
                  {isUploading && (
                    <Progress value={progress} className="mt-1 h-1" />
                  )}
                </div>
                {!isUploading && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(file)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}