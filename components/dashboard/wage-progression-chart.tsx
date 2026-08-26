'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { wageProgression, inr } from '@/lib/mock-data'
import { TrendingUp } from 'lucide-react'

export function WageProgressionChart() {
  const startWage = wageProgression[0]?.wage || 14000
  const endWage = wageProgression[wageProgression.length - 1]?.wage || 17200
  const growthPct = (((endWage - startWage) / startWage) * 100).toFixed(1)

  return (
    <Card className="border border-slate-200/90 bg-white shadow-xs rounded-xl overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/70 pb-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold text-slate-950 font-sans">
                Post-Placement Wage Progression
              </CardTitle>
              <Badge variant="default" className="bg-blue-100 text-blue-950 border-blue-200 font-bold text-[10px] px-2 py-0.2">
                12-Month Trajectory
              </Badge>
            </div>
            <CardDescription className="text-xs font-normal text-slate-500 mt-0.5">
              Longitudinal median monthly wage trajectory across verified candidates
            </CardDescription>
          </div>

          <div className="flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50/90 px-2 py-1 text-xs font-bold text-blue-950">
            <TrendingUp className="size-3.5 text-blue-700 stroke-[2.2]" />
            <span>+{growthPct}% 1-Year Growth</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={wageProgression} margin={{ left: 8, right: 12, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="wageFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1d4ed8" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={58}
                domain={['auto', 'auto']}
                tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  background: '#0f172a',
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '6px 10px',
                }}
                formatter={(v) => [typeof v === 'number' ? inr(v) : String(v ?? ''), 'Median Wage']}
              />
              <Area
                type="monotone"
                dataKey="wage"
                stroke="#1d4ed8"
                strokeWidth={2.5}
                dot={{ fill: '#1d4ed8', r: 3.5, strokeWidth: 1.5, stroke: '#ffffff' }}
                activeDot={{ r: 5.5, stroke: '#1d4ed8', strokeWidth: 2, fill: '#ffffff' }}
                fill="url(#wageFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Milestone Footer Strip */}
        <div className="mt-3.5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-xs sm:grid-cols-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Starting Wage</span>
            <span className="font-bold text-slate-950 tabular-nums text-sm">₹{startWage.toLocaleString('en-IN')}/mo</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">6-Month Wage</span>
            <span className="font-bold text-slate-950 tabular-nums text-sm">₹16,100/mo</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">1-Year Median</span>
            <span className="font-bold text-emerald-950 tabular-nums text-sm">₹{endWage.toLocaleString('en-IN')}/mo</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Net Increment</span>
            <span className="font-bold text-blue-900 tabular-nums text-sm">+₹{(endWage - startWage).toLocaleString('en-IN')} (+{growthPct}%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
