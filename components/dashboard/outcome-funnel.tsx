'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { outcomeFunnel, compact } from '@/lib/mock-data'
import { TrendingUp } from 'lucide-react'

const barColors = [
  'bg-blue-900',
  'bg-blue-800',
  'bg-indigo-700',
  'bg-emerald-700',
  'bg-teal-800',
]

export function OutcomeFunnel() {
  const max = outcomeFunnel[0].value
  const netYield = Math.round((outcomeFunnel[outcomeFunnel.length - 1].value / max) * 100)

  return (
    <Card className="border border-slate-200/90 bg-white shadow-xs rounded-xl overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/70 pb-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold text-slate-950 font-sans">
                Longitudinal Outcome Funnel
              </CardTitle>
              <Badge variant="default" className="bg-blue-100 text-blue-950 border-blue-200 font-bold text-[10px] px-2 py-0.2">
                5-Stage Audit
              </Badge>
            </div>
            <CardDescription className="text-xs font-normal text-slate-500 mt-0.5">
              Enrolled → Completed → Certified → Employed → Retained
            </CardDescription>
          </div>

          <div className="flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50/90 px-2 py-1 text-xs font-bold text-emerald-950">
            <TrendingUp className="size-3.5 text-emerald-700 stroke-[2.2]" />
            <span>Net Yield: {netYield}%</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pt-4">
        {outcomeFunnel.map((stage, i) => {
          const pct = Math.round((stage.value / max) * 100)
          const conversion =
            i === 0 ? 100 : Math.round((stage.value / outcomeFunnel[i - 1].value) * 100)
          const dropOff = i === 0 ? 0 : outcomeFunnel[i - 1].value - stage.value

          return (
            <div key={stage.stage} className="flex flex-col gap-1">
              <div className="flex flex-wrap items-baseline justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded bg-slate-100 border border-slate-300 text-[10px] font-bold text-slate-700">
                    {i + 1}
                  </span>
                  <span className="font-bold text-slate-900">{stage.stage}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  {i > 0 && dropOff > 0 && (
                    <span className="hidden sm:inline text-[11px] font-medium text-slate-400">
                      (-{dropOff.toLocaleString('en-IN')})
                    </span>
                  )}
                  <span className="tabular-nums font-bold text-slate-950">
                    {stage.value.toLocaleString('en-IN')}
                    <span className="ml-2 text-xs font-normal text-slate-500">
                      {i === 0 ? `${pct}% intake` : `${conversion}% retention`}
                    </span>
                  </span>
                </div>
              </div>

              <div className="h-6 w-full overflow-hidden rounded-md bg-slate-100 border border-slate-200/80 p-0.5">
                <div
                  className={`flex h-full items-center justify-end rounded px-2 text-[11px] font-bold text-white shadow-2xs transition-all duration-500 ${barColors[i]}`}
                  style={{ width: `${Math.max(pct, 14)}%` }}
                >
                  <span className="tabular-nums">{compact(stage.value)} ({pct}%)</span>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
