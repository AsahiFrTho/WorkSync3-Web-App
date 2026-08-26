'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { outcomeFunnel, compact } from '@/lib/mock-data'
import { ArrowRight, TrendingUp } from 'lucide-react'

const stageGradients = [
  'bg-gradient-to-r from-blue-900 to-blue-800',
  'bg-gradient-to-r from-blue-800 to-blue-700',
  'bg-gradient-to-r from-indigo-700 to-indigo-600',
  'bg-gradient-to-r from-emerald-700 to-emerald-600',
  'bg-gradient-to-r from-teal-700 to-teal-600',
]

const stageAccents = [
  'border-blue-900 text-blue-900',
  'border-blue-700 text-blue-700',
  'border-indigo-600 text-indigo-700',
  'border-emerald-600 text-emerald-700',
  'border-teal-600 text-teal-700',
]

export function OutcomeFunnel() {
  const max = outcomeFunnel[0].value
  const netYield = Math.round((outcomeFunnel[outcomeFunnel.length - 1].value / max) * 100)

  return (
    <Card className="border border-slate-200/90 bg-white shadow-xs rounded-xl overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-extrabold text-slate-950 font-sans">
                Longitudinal Outcome Funnel
              </CardTitle>
              <Badge variant="default" className="bg-blue-100 text-blue-950 border-blue-300 font-extrabold text-[10px]">
                5-Stage Audit
              </Badge>
            </div>
            <CardDescription className="text-xs font-semibold text-slate-600 mt-0.5">
              Enrolled → Completed → Certified → Employed → Retained
            </CardDescription>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-950 shadow-2xs">
            <TrendingUp className="size-3.5 text-emerald-700" />
            <span>Net Cohort Yield: {netYield}%</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3.5 pt-5">
        {outcomeFunnel.map((stage, i) => {
          const pct = Math.round((stage.value / max) * 100)
          const conversion =
            i === 0 ? 100 : Math.round((stage.value / outcomeFunnel[i - 1].value) * 100)
          const dropOff = i === 0 ? 0 : outcomeFunnel[i - 1].value - stage.value

          return (
            <div key={stage.stage} className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-baseline justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-slate-100 border border-slate-300 text-[10px] font-black text-slate-800">
                    {i + 1}
                  </span>
                  <span className="font-extrabold text-slate-950">{stage.stage}</span>
                </div>
                <div className="flex items-center gap-3">
                  {i > 0 && dropOff > 0 && (
                    <span className="hidden sm:inline text-[11px] font-semibold text-slate-400">
                      (-{dropOff.toLocaleString('en-IN')})
                    </span>
                  )}
                  <span className="tabular-nums font-black text-slate-950">
                    {stage.value.toLocaleString('en-IN')}
                    <span className="ml-2 text-xs font-semibold text-slate-500">
                      {i === 0 ? `${pct}% intake` : `${conversion}% retention`}
                    </span>
                  </span>
                </div>
              </div>

              <div className="h-7 w-full overflow-hidden rounded-lg bg-slate-100 border border-slate-200/80 p-0.5">
                <div
                  className={`flex h-full items-center justify-end rounded-md px-2.5 text-xs font-bold text-white shadow-xs transition-all duration-500 ${stageGradients[i]}`}
                  style={{ width: `${Math.max(pct, 14)}%` }}
                >
                  <span className="text-[11px] tracking-tight">{compact(stage.value)} ({pct}%)</span>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
