'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { employerDemandedSkills } from '@/lib/mock-data'

export function EmployerDemandChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employer-demanded skills</CardTitle>
        <CardDescription>Open positions reported by employers (mock)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={employerDemandedSkills}
              layout="vertical"
              margin={{ left: 8, right: 24, top: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              />
              <YAxis
                type="category"
                dataKey="skill"
                width={120}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: 'var(--foreground)' }}
              />
              <Tooltip
                cursor={{ fill: 'var(--muted)' }}
                contentStyle={{
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  background: 'var(--popover)',
                  color: 'var(--popover-foreground)',
                  fontSize: 12,
                }}
                formatter={(v: number) => [v.toLocaleString('en-IN'), 'Openings']}
              />
              <Bar dataKey="openings" radius={[0, 6, 6, 0]} barSize={18}>
                {employerDemandedSkills.map((entry, i) => (
                  <Cell key={entry.skill} fill={i < 4 ? 'var(--chart-1)' : 'var(--chart-2)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
