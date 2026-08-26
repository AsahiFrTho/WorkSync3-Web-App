import { Sparkles, ArrowRight, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { AiInsight, Level } from '@/lib/mock-data'

function LevelPill({ label, level }: { label: string; level: Level }) {
  const variant =
    level === 'High'
      ? label === 'Employer demand'
        ? 'success'
        : 'destructive'
      : level === 'Medium'
        ? 'warning'
        : 'neutral'
  const coverageVariant =
    label === 'Training coverage'
      ? level === 'Low'
        ? 'destructive'
        : level === 'Medium'
          ? 'warning'
          : 'success'
      : variant
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 truncate">{label}</span>
      <Badge variant={coverageVariant} className="font-semibold w-fit">{level}</Badge>
    </div>
  )
}

export function InsightCard({ insight }: { insight: AiInsight }) {
  return (
    <Card className="overflow-hidden border border-slate-200 bg-white shadow-xs">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/90 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-800">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <span className="text-xs font-bold text-blue-900 truncate">Detected signal</span>
        </div>
        <Badge
          variant={
            insight.priority === 'High'
              ? 'destructive'
              : insight.priority === 'Medium'
                ? 'warning'
                : 'neutral'
          }
          className="font-bold shrink-0"
        >
          {insight.priority} priority
        </Badge>
      </div>
      <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <MapPin className="size-3.5 text-blue-700 shrink-0" aria-hidden="true" />
            <span>{insight.district}</span>
          </div>
          <h3 className="text-base font-bold leading-snug text-slate-950 text-balance">{insight.title}</h3>
          <p className="text-sm leading-relaxed font-normal text-slate-700 text-pretty">
            {insight.narrative}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50/90 p-3 sm:grid-cols-3">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 truncate">
              Detected skill gap
            </span>
            <span className="text-sm font-bold text-slate-950 truncate">{insight.skillGap}</span>
          </div>
          <LevelPill label="Employer demand" level={insight.employerDemand} />
          <LevelPill label="Training coverage" level={insight.trainingCoverage} />
        </div>

        <div className="flex items-start gap-2.5 rounded-lg border border-blue-200 bg-blue-50/70 p-3 text-slate-800">
          <ArrowRight className="mt-0.5 size-4 shrink-0 text-blue-700" aria-hidden="true" />
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-xs font-bold text-blue-950">Suggested programme action</span>
            <p className="text-sm leading-relaxed font-medium text-slate-800 text-pretty">{insight.action}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-medium text-slate-600 pt-1">
          <span>Model confidence (illustrative)</span>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-20 sm:w-24 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-blue-700"
                style={{ width: `${insight.confidence}%` }}
              />
            </div>
            <span className="tabular-nums font-bold text-slate-950">{insight.confidence}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
