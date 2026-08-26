'use client'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { nonPlacementReasons } from '@/lib/mock-data'

const COLORS = [
  '#e11d48',
  '#f59e0b',
  '#2563eb',
  '#4f46e5',
  '#64748b',
]

export function NonPlacementChart() {
  return (
    <Card className="border border-slate-200/90 bg-white shadow-xs rounded-xl overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
        <CardTitle className="text-base font-extrabold text-slate-950 font-sans">
          Root Causes for Non-Placement
        </CardTitle>
        <CardDescription className="text-xs font-semibold text-slate-600 mt-0.5">
          Share of certified-but-unplaced candidates across cohort
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="h-48 w-48 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={nonPlacementReasons}
                  dataKey="value"
                  nameKey="reason"
                  innerRadius={50}
                  outerRadius={84}
                  paddingAngle={3}
                  strokeWidth={2}
                  stroke="#ffffff"
                >
                  {nonPlacementReasons.map((entry, i) => (
                    <Cell key={entry.reason} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: '1px solid #cbd5e1',
                    background: '#0f172a',
                    color: '#ffffff',
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '8px 12px',
                  }}
                  formatter={(v, n) => [typeof v === 'number' ? `${v}%` : String(v ?? ''), n ?? '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="flex flex-1 flex-col gap-2.5 w-full">
            {nonPlacementReasons.map((r, i) => (
              <li key={r.reason} className="flex items-center justify-between gap-2 text-xs sm:text-sm border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                <span className="flex items-center gap-2 font-bold text-slate-900">
                  <span
                    className="size-2.5 rounded-full shrink-0 shadow-xs"
                    style={{ background: COLORS[i % COLORS.length] }}
                    aria-hidden="true"
                  />
                  <span>{r.reason}</span>
                </span>
                <span className="tabular-nums font-black text-slate-950 text-xs sm:text-sm">{r.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
