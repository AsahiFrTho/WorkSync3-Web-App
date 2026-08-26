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
    <Card className="border border-slate-200/90 bg-white shadow-xs rounded-xl overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
        <CardTitle className="text-base font-extrabold text-slate-950 font-sans">
          Industry Verified Demand
        </CardTitle>
        <CardDescription className="text-xs font-semibold text-slate-600 mt-0.5">
          Open verified positions reported across employer network
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={employerDemandedSkills}
              layout="vertical"
              margin={{ left: 8, right: 24, top: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
              />
              <YAxis
                type="category"
                dataKey="skill"
                width={130}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#0f172a', fontWeight: 700 }}
              />
              <Tooltip
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{
                  borderRadius: 10,
                  border: '1px solid #cbd5e1',
                  background: '#0f172a',
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '8px 12px',
                }}
                formatter={(v) => [typeof v === 'number' ? v.toLocaleString('en-IN') + ' Openings' : String(v ?? ''), 'Demand']}
              />
              <Bar dataKey="openings" radius={[0, 6, 6, 0]} barSize={18}>
                {employerDemandedSkills.map((entry, i) => (
                  <Cell key={entry.skill} fill={i < 3 ? '#1d4ed8' : '#4f46e5'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
