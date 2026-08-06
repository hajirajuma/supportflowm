import { apiClient } from '@/services/api-client'

interface UploadOptions {
  onProgress?: (progress: number) => void
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

export class FileUploader {
  private static instance: FileUploader

  private constructor() {}

  public static getInstance(): FileUploader {
    if (!FileUploader.instance) {
      FileUploader.instance = new FileUploader()
    }
    return FileUploader.instance
  }

  async uploadFile(file: File, options?: UploadOptions): Promise<any> {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await apiClient.upload('/upload', file, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && options?.onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )
            options.onProgress(percentCompleted)
          }
        },
      })

      options?.onSuccess?.(response)
      return response
    } catch (error) {
      options?.onError?.(error as Error)
      throw error
    }
  }

  async uploadMultipleFiles(files: File[], options?: UploadOptions): Promise<any[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, options))
    return Promise.all(uploadPromises)
  }

  validateFile(
    file: File,
    maxSizeMB: number = 10,
    allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
  ): { valid: boolean; error?: string } {
    if (file.size > maxSizeMB * 1024 * 1024) {
      return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit` }
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      }
    }

    return { valid: true }
  }

  getFileIcon(file: File): string {
    const type = file.type
    if (type.startsWith('image/')) return 'image'
    if (type === 'application/pdf') return 'pdf'
    if (type.startsWith('text/')) return 'document'
    return 'file'
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
  }

  getFilePreviewUrl(file: File): string {
    return URL.createObjectURL(file)
  }

  revokeFilePreviewUrl(url: string): void {
    URL.revokeObjectURL(url)
  }
}

export const fileUploader = FileUploader.getInstance()