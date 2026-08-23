'use client'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { employmentTypeSplit } from '@/lib/mock-data'

const COLORS = ['var(--chart-1)', 'var(--chart-4)', 'var(--chart-3)']

export function EmploymentTypeChart() {
  const total = employmentTypeSplit.reduce((s, d) => s + d.value, 0)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employment type</CardTitle>
        <CardDescription>How placed trainees are engaged</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="h-40 w-40 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={employmentTypeSplit}
                  dataKey="value"
                  nameKey="type"
                  innerRadius={44}
                  outerRadius={72}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {employmentTypeSplit.map((entry, i) => (
                    <Cell key={entry.type} fill={COLORS[i % COLORS.length]} />
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
                  formatter={(v: number, n) => [v.toLocaleString('en-IN'), n as string]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="flex flex-1 flex-col gap-2.5">
            {employmentTypeSplit.map((d, i) => (
              <li key={d.type} className="flex items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ background: COLORS[i % COLORS.length] }}
                    aria-hidden="true"
                  />
                  {d.type}
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {Math.round((d.value / total) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
