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
    <Card className="border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
            {label}
          </p>
          <p className="mt-1.5 text-2xl font-extrabold tracking-tight tabular-nums text-slate-950 sm:text-3xl">
            {value}
          </p>
          {sublabel ? (
            <p className="mt-1 text-xs font-medium text-slate-600">{sublabel}</p>
          ) : null}
        </div>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700">
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </div>
      {trend ? (
        <div
          className={cn(
            'mt-3 inline-flex items-center gap-1 text-xs font-bold',
            trend.direction === 'up' && 'text-emerald-700',
            trend.direction === 'down' && 'text-rose-700',
            trend.direction === 'flat' && 'text-slate-600',
          )}
        >
          {trend.direction === 'up' ? (
            <TrendingUp className="size-3.5" aria-hidden="true" />
          ) : trend.direction === 'down' ? (
            <TrendingDown className="size-3.5" aria-hidden="true" />
          ) : null}
          <span>{trend.value}</span>
        </div>
      ) : null}
    </Card>
  )
}
