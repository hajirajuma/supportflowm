// Display helpers for the backend's canonical ticket enums. The API uses the
// uppercase Prisma values (OPEN, IN_PROGRESS, WAITING_FOR_CUSTOMER, ... and
// LOW, MEDIUM, HIGH, URGENT); these maps convert them to friendly UI labels
// and badge styles without ever changing the wire values.

export const TICKET_STATUS_LABELS: Record<string, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  WAITING_FOR_CUSTOMER: 'Waiting for Customer',
  ON_HOLD: 'On Hold',
  ESCALATED: 'Escalated',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
  REOPENED: 'Reopened',
}

export const TICKET_PRIORITY_LABELS: Record<string, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
}

export function ticketStatusLabel(status: string | undefined | null): string {
  return TICKET_STATUS_LABELS[status ?? ''] ?? status ?? '—'
}

export function ticketPriorityLabel(priority: string | undefined | null): string {
  return TICKET_PRIORITY_LABELS[priority ?? ''] ?? priority ?? '—'
}

/** Tailwind badge classes per status (background/text). */
export const TICKET_STATUS_BADGE: Record<string, string> = {
  OPEN: 'bg-blue-500/10 text-blue-500',
  IN_PROGRESS: 'bg-primary/10 text-primary',
  WAITING_FOR_CUSTOMER: 'bg-warning/10 text-warning',
  ON_HOLD: 'bg-muted text-muted-foreground',
  ESCALATED: 'bg-destructive/10 text-destructive',
  RESOLVED: 'bg-success/10 text-success',
  CLOSED: 'bg-muted text-muted-foreground',
  REOPENED: 'bg-warning/10 text-warning',
}

/** Tailwind badge classes per priority (background/text). */
export const TICKET_PRIORITY_BADGE: Record<string, string> = {
  LOW: 'bg-success/10 text-success',
  MEDIUM: 'bg-primary/10 text-primary',
  HIGH: 'bg-warning/10 text-warning',
  URGENT: 'bg-destructive/10 text-destructive',
}

export function ticketStatusBadge(status: string | undefined | null): string {
  return TICKET_STATUS_BADGE[status ?? ''] ?? 'bg-muted text-muted-foreground'
}

export function ticketPriorityBadge(priority: string | undefined | null): string {
  return TICKET_PRIORITY_BADGE[priority ?? ''] ?? 'bg-muted text-muted-foreground'
}
