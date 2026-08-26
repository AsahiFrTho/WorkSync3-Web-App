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
    <Card className="border border-slate-200/90 bg-white shadow-xs rounded-xl overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
        <CardTitle className="text-base font-extrabold text-slate-950 font-sans">
          Course-to-Skill Alignment
        </CardTitle>
        <CardDescription className="text-xs font-semibold text-slate-600 mt-0.5">
          Comparative index: Institutional training volume vs. Industry job demand
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={view} margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="course"
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
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
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{
                  borderRadius: 10,
                  border: '1px solid #cbd5e1',
                  background: '#0f172a',
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '8px 12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, fontWeight: 700, color: '#334155', paddingTop: 10 }} />
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
