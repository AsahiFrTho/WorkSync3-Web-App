import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
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
    <Card className="group relative overflow-hidden border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:border-slate-300 hover:shadow-md rounded-xl">
      {/* Subtle top indicator bar */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 opacity-90" />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500 font-sans">
            {label}
          </p>
          <p className="mt-2 text-3xl font-black tracking-tight tabular-nums text-slate-950 sm:text-4xl font-sans">
            {value}
          </p>
        </div>
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50/80 text-blue-700 shadow-2xs transition-transform duration-200 group-hover:scale-105">
          <Icon className="size-5.5 stroke-[2.2]" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
        {sublabel ? (
          <p className="text-xs font-semibold text-slate-600 truncate">{sublabel}</p>
        ) : <span />}

        {trend ? (
          <div
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold shadow-2xs',
              trend.direction === 'up' && 'bg-emerald-50 text-emerald-950 border border-emerald-200',
              trend.direction === 'down' && 'bg-rose-50 text-rose-950 border border-rose-200',
              trend.direction === 'flat' && 'bg-slate-50 text-slate-800 border border-slate-200',
            )}
          >
            {trend.direction === 'up' ? (
              <TrendingUp className="size-3.5 text-emerald-700 stroke-[2.5]" aria-hidden="true" />
            ) : trend.direction === 'down' ? (
              <TrendingDown className="size-3.5 text-rose-700 stroke-[2.5]" aria-hidden="true" />
            ) : (
              <Minus className="size-3.5 text-slate-500" aria-hidden="true" />
            )}
            <span>{trend.value}</span>
          </div>
        ) : null}
      </div>
    </Card>
  )
}
