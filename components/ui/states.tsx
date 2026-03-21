import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { labels } from '@/lib/labels'

export function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <Spinner className="h-8 w-8" />
    </div>
  )
}

interface EmptyStateProps {
  message?: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-muted-foreground text-sm">{message ?? labels.common.noResults}</p>
    </div>
  )
}

interface ErrorStateProps {
  error?: Error | null
  onRetry?: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <p className="text-destructive text-sm">{error?.message ?? labels.common.error}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  )
}

export function NotFoundState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-muted-foreground text-sm">Recurso no encontrado</p>
    </div>
  )
}
