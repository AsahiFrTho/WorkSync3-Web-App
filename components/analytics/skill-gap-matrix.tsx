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
  return <Badge variant={variant} className="font-extrabold text-[10px] px-2 py-0.5">{level}</Badge>
}

export function SkillGapMatrix() {
  const sorted = [...skillGaps].sort((a, b) => b.gap - a.gap)
  return (
    <Card className="border border-slate-200/90 bg-white shadow-xs rounded-xl overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-extrabold text-slate-950 font-sans">
              Top Priority Skill Gaps
            </CardTitle>
            <CardDescription className="text-xs font-semibold text-slate-600 mt-0.5">
              Ranked by net divergence between industry openings and trainee supply
            </CardDescription>
          </div>
          <Badge variant="default" className="bg-blue-100 text-blue-950 border-blue-300 font-extrabold text-[10px]">
            Index Ranking
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3.5 pt-5">
        {sorted.map((s) => {
          const positive = s.gap > 0
          return (
            <div key={s.skill} className="flex flex-col gap-2 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 shadow-2xs hover:border-slate-300 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-extrabold text-slate-950">{s.skill}</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-bold text-slate-500">Demand:</span>
                    <LevelBadge level={s.demand} kind="demand" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-bold text-slate-500">Coverage:</span>
                    <LevelBadge level={s.coverage} kind="coverage" />
                  </div>
                </div>
              </div>

              {/* Dual bar: demand vs coverage */}
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center gap-2.5">
                  <span className="w-16 shrink-0 text-xs font-bold text-slate-700">Demand</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-blue-700"
                      style={{ width: `${s.demandScore}%` }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right text-xs font-black tabular-nums text-slate-950">
                    {s.demandScore}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-16 shrink-0 text-xs font-bold text-slate-700">Coverage</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-indigo-600"
                      style={{ width: `${s.coverageScore}%` }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right text-xs font-black tabular-nums text-slate-950">
                    {s.coverageScore}
                  </span>
                </div>
              </div>

              <div className="pt-1 border-t border-slate-200/60 mt-0.5">
                {positive ? (
                  <span className="text-xs font-extrabold text-rose-950 flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-rose-600 inline-block" />
                    Under-served — demand outpaces training capacity by {s.gap} pts
                  </span>
                ) : (
                  <span className="text-xs font-extrabold text-emerald-950 flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-emerald-600 inline-block" />
                    Well covered — capacity exceeds demand by {Math.abs(s.gap)} pts
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
