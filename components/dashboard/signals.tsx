import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  followUpStatus,
  skillGaps,
  nonPlacementReasons,
} from '@/lib/mock-data'

const toneDot: Record<string, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  destructive: 'bg-destructive',
  neutral: 'bg-muted-foreground',
}

export function FollowUpStatus() {
  const total = followUpStatus.reduce((s, d) => s + d.value, 0)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Follow-up status</CardTitle>
        <CardDescription>Outcome verification across the cohort</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {followUpStatus.map((f) => (
          <div key={f.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className={`size-2.5 rounded-full ${toneDot[f.tone]}`} aria-hidden="true" />
                {f.label}
              </span>
              <span className="tabular-nums text-muted-foreground">
                {f.value.toLocaleString('en-IN')}
                <span className="ml-2 text-xs">{Math.round((f.value / total) * 100)}%</span>
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
    <Card>
      <CardHeader>
        <CardTitle>Skill-gap indicators</CardTitle>
        <CardDescription>High demand vs. low training coverage</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {top.map((s) => (
          <div
            key={s.skill}
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{s.skill}</p>
              <p className="text-xs text-muted-foreground">
                Demand {s.demand} · Coverage {s.coverage}
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
    <Card>
      <CardHeader>
        <CardTitle>Non-placement reasons</CardTitle>
        <CardDescription>Why certified trainees remain unplaced</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {nonPlacementReasons.map((r) => (
          <div key={r.reason} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-sm">
              <span>{r.reason}</span>
              <span className="tabular-nums text-muted-foreground">{r.value}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-chart-5"
                style={{ width: `${(r.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
