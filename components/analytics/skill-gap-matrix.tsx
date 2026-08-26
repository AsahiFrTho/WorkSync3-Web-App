import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { skillGaps, type Level } from '@/lib/mock-data'

function LevelBadge({ level, kind }: { level: Level; kind: 'demand' | 'coverage' }) {
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
    <Card className="border border-slate-200 bg-white shadow-xs">
      <CardHeader>
        <CardTitle className="text-base font-bold text-slate-950">Top Skill Gaps</CardTitle>
        <CardDescription className="text-xs text-slate-600">
          Ranked by the gap between employer demand and training coverage
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {sorted.map((s) => {
          const positive = s.gap > 0
          return (
            <div key={s.skill} className="flex flex-col gap-2 rounded-lg border border-slate-100 bg-slate-50/60 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-bold text-slate-950">{s.skill}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-600">Demand</span>
                  <LevelBadge level={s.demand} kind="demand" />
                  <span className="ml-1 text-xs font-semibold text-slate-600">Coverage</span>
                  <LevelBadge level={s.coverage} kind="coverage" />
                </div>
              </div>
              {/* Dual bar: demand vs coverage */}
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex items-center gap-2">
                  <span className="w-16 shrink-0 text-xs font-bold text-slate-600">Demand</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-blue-700"
                      style={{ width: `${s.demandScore}%` }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right text-xs font-bold tabular-nums text-slate-800">
                    {s.demandScore}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-16 shrink-0 text-xs font-bold text-slate-600">Coverage</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-indigo-600"
                      style={{ width: `${s.coverageScore}%` }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right text-xs font-bold tabular-nums text-slate-800">
                    {s.coverageScore}
                  </span>
                </div>
              </div>
              <p className="text-xs pt-0.5">
                {positive ? (
                  <span className="font-semibold text-rose-700">
                    Under-served — demand exceeds coverage by {s.gap} pts
                  </span>
                ) : (
                  <span className="font-semibold text-emerald-700">
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
