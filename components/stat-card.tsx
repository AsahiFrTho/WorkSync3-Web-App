import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  trend,
}: {
  label: string
  value: string
  sublabel?: string
  icon: LucideIcon
  trend?: { value: string; direction: 'up' | 'down' | 'flat' }
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">
            {value}
          </p>
          {sublabel ? (
            <p className="mt-1 text-xs text-muted-foreground">{sublabel}</p>
          ) : null}
        </div>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" aria-hidden="true" />
        </div>
      </div>
      {trend ? (
        <div
          className={cn(
            'mt-3 inline-flex items-center gap-1 text-xs font-medium',
            trend.direction === 'up' && 'text-success',
            trend.direction === 'down' && 'text-destructive',
            trend.direction === 'flat' && 'text-muted-foreground',
          )}
        >
          {trend.direction === 'up' ? (
            <TrendingUp className="size-3.5" aria-hidden="true" />
          ) : trend.direction === 'down' ? (
            <TrendingDown className="size-3.5" aria-hidden="true" />
          ) : null}
          {trend.value}
        </div>
      ) : null}
    </Card>
  )
}
