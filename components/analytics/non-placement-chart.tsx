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
    <Card className="border border-slate-200 bg-white shadow-xs">
      <CardHeader>
        <CardTitle className="text-base font-bold text-slate-950">Reasons for Non-Placement</CardTitle>
        <CardDescription className="text-xs text-slate-600">Share of certified-but-unplaced trainees across cohort</CardDescription>
      </CardHeader>
      <CardContent>
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
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {nonPlacementReasons.map((entry, i) => (
                    <Cell key={entry.reason} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#0f172a',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                  formatter={(v, n) => [typeof v === 'number' ? `${v}%` : String(v ?? ''), n ?? '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="flex flex-1 flex-col gap-2.5">
            {nonPlacementReasons.map((r, i) => (
              <li key={r.reason} className="flex items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-2 font-medium text-slate-800">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ background: COLORS[i % COLORS.length] }}
                    aria-hidden="true"
                  />
                  {r.reason}
                </span>
                <span className="tabular-nums font-bold text-slate-950">{r.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
