'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { outcomeFunnel, compact } from '@/lib/mock-data'

const barColors = [
  'bg-blue-700',
  'bg-blue-600',
  'bg-indigo-600',
  'bg-emerald-600',
  'bg-emerald-700',
]

export function OutcomeFunnel() {
  const max = outcomeFunnel[0].value
  return (
    <Card className="border border-slate-200 bg-white shadow-xs">
      <CardHeader>
        <CardTitle className="text-base font-bold text-slate-950">Outcome Funnel</CardTitle>
        <CardDescription className="text-xs text-slate-600">
          Enrolled → Completed → Certified → Employed → Retained
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {outcomeFunnel.map((stage, i) => {
          const pct = Math.round((stage.value / max) * 100)
          const conversion =
            i === 0 ? 100 : Math.round((stage.value / outcomeFunnel[i - 1].value) * 100)
          return (
            <div key={stage.stage} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-bold text-slate-950">{stage.stage}</span>
                <span className="tabular-nums font-semibold text-slate-700">
                  {stage.value.toLocaleString('en-IN')}
                  <span className="ml-2 text-xs font-normal text-slate-500">
                    {i === 0 ? `${pct}% of intake` : `${conversion}% carried forward`}
                  </span>
                </span>
              </div>
              <div className="h-8 w-full overflow-hidden rounded-lg bg-slate-100 border border-slate-200/60">
                <div
                  className={`flex h-full items-center justify-end rounded-lg px-2.5 text-xs font-bold text-white shadow-2xs ${barColors[i]}`}
                  style={{ width: `${Math.max(pct, 12)}%` }}
                >
                  {compact(stage.value)}
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
