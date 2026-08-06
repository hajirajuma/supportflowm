import { UseFormRegister, FieldError } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface Option {
  value: string
  label: string
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  name: string
  register: UseFormRegister<any>
  error?: FieldError
  options: Option[]
}

export function FormSelect({
  label,
  name,
  register,
  error,
  options,
  className,
  required,
  ...props
}: FormSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <select
        id={name}
        {...register(name)}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${name}-error`} className="text-sm text-destructive">
          {error.message}
        </p>
      )}
    </div>
  )
}