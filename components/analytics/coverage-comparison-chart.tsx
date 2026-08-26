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
    <Card className="border border-slate-200 bg-white shadow-xs">
      <CardHeader>
        <CardTitle className="text-base font-bold text-slate-950">Course-to-Skill Comparison</CardTitle>
        <CardDescription className="text-xs text-slate-600">Training coverage vs. employer demand index by course</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={view} margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="course"
                tickLine={false}
                axisLine={false}
                interval={0}
                tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={36}
                tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
              />
              <Tooltip
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{
                  borderRadius: 10,
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#0f172a',
                  fontSize: 12,
                  fontWeight: 600,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600, color: '#334155', paddingTop: 8 }} />
              <Bar
                dataKey="trainingCoverage"
                name="Training Coverage"
                fill="#4f46e5"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="employerDemand"
                name="Employer Demand"
                fill="#1d4ed8"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
