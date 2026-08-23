import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { skillGaps, type Level } from '@/lib/mock-data'

function LevelBadge({ level, kind }: { level: Level; kind: 'demand' | 'coverage' }) {
  // High demand = urgent (red-ish); High coverage = good (green)
  let variant: 'success' | 'warning' | 'destructive' | 'neutral' = 'neutral'
  if (kind === 'demand') {
    variant = level === 'High' ? 'destructive' : level === 'Medium' ? 'warning' : 'neutral'
  } else {
    variant = level === 'High' ? 'success' : level === 'Medium' ? 'warning' : 'destructive'
  }
  return <Badge variant={variant}>{level}</Badge>
}

export function SkillGapMatrix() {
  const sorted = [...skillGaps].sort((a, b) => b.gap - a.gap)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top skill gaps</CardTitle>
        <CardDescription>
          Ranked by the gap between employer demand and training coverage
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {sorted.map((s) => {
          const positive = s.gap > 0
          return (
            <div key={s.skill} className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-medium">{s.skill}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">Demand</span>
                  <LevelBadge level={s.demand} kind="demand" />
                  <span className="ml-1 text-xs text-muted-foreground">Coverage</span>
                  <LevelBadge level={s.coverage} kind="coverage" />
                </div>
              </div>
              {/* Dual bar: demand vs coverage */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="w-16 shrink-0 text-[11px] text-muted-foreground">Demand</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-chart-1"
                      style={{ width: `${s.demandScore}%` }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right text-[11px] tabular-nums text-muted-foreground">
                    {s.demandScore}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-16 shrink-0 text-[11px] text-muted-foreground">Coverage</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-chart-2"
                      style={{ width: `${s.coverageScore}%` }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right text-[11px] tabular-nums text-muted-foreground">
                    {s.coverageScore}
                  </span>
                </div>
              </div>
              <p className="text-xs">
                {positive ? (
                  <span className="text-destructive">
                    Under-served — demand exceeds coverage by {s.gap} pts
                  </span>
                ) : (
                  <span className="text-success">
                    Well covered — coverage exceeds demand by {Math.abs(s.gap)} pts
                  </span>
                )}
              </p>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
