import { UseFormRegister, FieldError } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  name: string
  register: UseFormRegister<any>
  error?: FieldError
}

export function FormInput({
  label,
  name,
  register,
  error,
  className,
  required,
  ...props
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={name}
        {...register(name)}
        className={cn(
          'w-full',
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${name}-error`} className="text-sm text-destructive">
          {error.message}
        </p>
      )}
    </div>
  )
}