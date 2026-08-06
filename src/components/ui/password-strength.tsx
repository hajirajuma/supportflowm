import { Progress } from './progress'
import { cn } from '@/lib/utils'

interface PasswordStrengthProps {
  password: string
  className?: string
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const calculateStrength = (password: string): number => {
    if (!password) return 0

    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 12.5
    if (/[^A-Za-z0-9]/.test(password)) strength += 12.5
    return Math.min(strength, 100)
  }

  const getStrengthColor = (strength: number) => {
    if (strength < 30) return 'bg-destructive'
    if (strength < 60) return 'bg-warning'
    if (strength < 80) return 'bg-primary'
    return 'bg-success'
  }

  const getStrengthLabel = (strength: number) => {
    if (strength < 30) return 'Weak'
    if (strength < 60) return 'Fair'
    if (strength < 80) return 'Good'
    return 'Strong'
  }

  const strength = calculateStrength(password)

  if (!password) return null

  return (
    <div className={cn('space-y-1', className)}>
      <Progress
        value={strength}
        className="h-1"
        indicatorClassName={getStrengthColor(strength)}
      />
      <p className="text-xs text-muted-foreground">
        Password strength: {getStrengthLabel(strength)}
      </p>
    </div>
  )
}