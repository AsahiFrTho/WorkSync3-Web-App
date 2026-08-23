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
  // For "Training coverage", Low is the concerning case -> destructive
  const coverageVariant =
    label === 'Training coverage'
      ? level === 'Low'
        ? 'destructive'
        : level === 'Medium'
          ? 'warning'
          : 'success'
      : variant
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <Badge variant={coverageVariant}>{level}</Badge>
    </div>
  )
}

export function InsightCard({ insight }: { insight: AiInsight }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-primary/5 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary/12 text-primary">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <span className="text-xs font-medium text-primary">Detected signal</span>
        </div>
        <Badge
          variant={
            insight.priority === 'High'
              ? 'destructive'
              : insight.priority === 'Medium'
                ? 'warning'
                : 'neutral'
          }
        >
          {insight.priority} priority
        </Badge>
      </div>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5" aria-hidden="true" />
            {insight.district}
          </div>
          <h3 className="text-base font-semibold leading-snug text-balance">{insight.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            {insight.narrative}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-lg border border-border bg-muted/40 p-3">
          <div className="col-span-3 flex flex-col gap-1 sm:col-span-1">
            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Detected skill gap
            </span>
            <span className="text-sm font-medium">{insight.skillGap}</span>
          </div>
          <LevelPill label="Employer demand" level={insight.employerDemand} />
          <LevelPill label="Training coverage" level={insight.trainingCoverage} />
        </div>

        <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-primary">Suggested programme action</span>
            <p className="text-sm leading-relaxed text-pretty">{insight.action}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Model confidence (illustrative)</span>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${insight.confidence}%` }}
              />
            </div>
            <span className="tabular-nums font-medium text-foreground">{insight.confidence}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
