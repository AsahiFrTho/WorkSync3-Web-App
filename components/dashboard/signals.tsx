import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  followUpStatus,
  skillGaps,
  nonPlacementReasons,
} from '@/lib/mock-data'

const toneDot: Record<string, string> = {
  success: 'bg-emerald-600',
  warning: 'bg-amber-600',
  destructive: 'bg-rose-600',
  neutral: 'bg-slate-400',
}

export function FollowUpStatus() {
  const total = followUpStatus.reduce((s, d) => s + d.value, 0)
  return (
    <Card className="border border-slate-200 bg-white shadow-xs">
      <CardHeader>
        <CardTitle className="text-base font-bold text-slate-950">Follow-up Status</CardTitle>
        <CardDescription className="text-xs text-slate-600">Outcome verification across the active cohort</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {followUpStatus.map((f) => (
          <div key={f.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium text-slate-900">
                <span className={`size-2.5 rounded-full ${toneDot[f.tone]}`} aria-hidden="true" />
                {f.label}
              </span>
              <span className="tabular-nums font-bold text-slate-950">
                {f.value.toLocaleString('en-IN')}
                <span className="ml-2 text-xs font-semibold text-slate-500">{Math.round((f.value / total) * 100)}%</span>
              </span>
            </div>
            <Progress
              value={(f.value / total) * 100}
              indicatorClassName={toneDot[f.tone]}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function SkillGapIndicators() {
  const top = skillGaps.filter((s) => s.gap > 0).slice(0, 4)
  return (
    <Card className="border border-slate-200 bg-white shadow-xs">
      <CardHeader>
        <CardTitle className="text-base font-bold text-slate-950">Skill-Gap Indicators</CardTitle>
        <CardDescription className="text-xs text-slate-600">High employer demand vs. low training coverage</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {top.map((s) => (
          <div
            key={s.skill}
            className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/80 px-3.5 py-2.5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-950">{s.skill}</p>
              <p className="text-xs font-medium text-slate-600">
                Demand {s.demand} • Coverage {s.coverage}
              </p>
            </div>
            <Badge variant={s.demand === 'High' ? 'destructive' : 'warning'}>
              Gap {s.gap}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function NonPlacementReasonsCard() {
  const max = Math.max(...nonPlacementReasons.map((r) => r.value))
  return (
    <Card className="border border-slate-200 bg-white shadow-xs">
      <CardHeader>
        <CardTitle className="text-base font-bold text-slate-950">Non-Placement Reasons</CardTitle>
        <CardDescription className="text-xs text-slate-600">Why certified trainees remain unplaced</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {nonPlacementReasons.map((r) => (
          <div key={r.reason} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-800">{r.reason}</span>
              <span className="tabular-nums font-bold text-slate-950">{r.value}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200/60">
              <div
                className="h-full rounded-full bg-rose-600"
                style={{ width: `${(r.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
