'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { courseToSkillComparison } from '@/lib/mock-data'

export function CoverageComparisonChart({ courseFilter }: { courseFilter?: string }) {
  const data =
    courseFilter && courseFilter !== 'All Courses'
      ? courseToSkillComparison.filter((d) => courseFilter.startsWith(d.course))
      : courseToSkillComparison
  const view = data.length ? data : courseToSkillComparison

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course-to-skill comparison</CardTitle>
        <CardDescription>Training coverage vs. employer demand by course</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={view} margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="course"
                tickLine={false}
                axisLine={false}
                interval={0}
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={32}
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
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
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                dataKey="trainingCoverage"
                name="Training coverage"
                fill="var(--chart-2)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="employerDemand"
                name="Employer demand"
                fill="var(--chart-1)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
