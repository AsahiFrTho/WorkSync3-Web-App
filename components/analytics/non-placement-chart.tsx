'use client'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { nonPlacementReasons } from '@/lib/mock-data'

const COLORS = [
  'var(--chart-5)',
  'var(--chart-3)',
  'var(--chart-2)',
  'var(--chart-1)',
  'var(--muted-foreground)',
]

export function NonPlacementChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reasons for non-placement</CardTitle>
        <CardDescription>Share of certified-but-unplaced trainees (mock)</CardDescription>
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
                    border: '1px solid var(--border)',
                    background: 'var(--popover)',
                    color: 'var(--popover-foreground)',
                    fontSize: 12,
                  }}
                  formatter={(v: number, n) => [`${v}%`, n as string]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="flex flex-1 flex-col gap-2.5">
            {nonPlacementReasons.map((r, i) => (
              <li key={r.reason} className="flex items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ background: COLORS[i % COLORS.length] }}
                    aria-hidden="true"
                  />
                  {r.reason}
                </span>
                <span className="tabular-nums font-medium">{r.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
