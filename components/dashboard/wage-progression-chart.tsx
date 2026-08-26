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
import { TrendingUp, IndianRupee } from 'lucide-react'

export function WageProgressionChart() {
  const startWage = wageProgression[0]?.wage || 14000
  const endWage = wageProgression[wageProgression.length - 1]?.wage || 17200
  const growthPct = (((endWage - startWage) / startWage) * 100).toFixed(1)

  return (
    <Card className="border border-slate-200/90 bg-white shadow-xs rounded-xl overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-extrabold text-slate-950 font-sans">
                Post-Placement Wage Progression
              </CardTitle>
              <Badge variant="default" className="bg-blue-100 text-blue-950 border-blue-300 font-extrabold text-[10px]">
                12-Month Audit
              </Badge>
            </div>
            <CardDescription className="text-xs font-semibold text-slate-600 mt-0.5">
              Longitudinal median monthly wage trajectory across verified candidates
            </CardDescription>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-950 shadow-2xs">
            <TrendingUp className="size-3.5 text-blue-700" />
            <span>+{growthPct}% 1-Year Growth</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-5">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={wageProgression} margin={{ left: 8, right: 12, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="wageFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1d4ed8" stopOpacity={0.35} />
                  <stop offset="60%" stopColor="#2563eb" stopOpacity={0.10} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.01} />
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
                width={62}
                domain={['auto', 'auto']}
                tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                cursor={{ stroke: '#94a3b8', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                contentStyle={{
                  borderRadius: 10,
                  border: '1px solid #cbd5e1',
                  background: '#0f172a',
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 700,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  padding: '8px 12px',
                }}
                formatter={(v) => [typeof v === 'number' ? inr(v) : String(v ?? ''), 'Median Wage']}
              />
              <Area
                type="monotone"
                dataKey="wage"
                stroke="#1d4ed8"
                strokeWidth={3}
                dot={{ fill: '#1d4ed8', r: 4, strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 6, stroke: '#1d4ed8', strokeWidth: 3, fill: '#ffffff' }}
                fill="url(#wageFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Milestone Footer Strip */}
        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-xs sm:grid-cols-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Starting Wage</span>
            <span className="font-extrabold text-slate-950 tabular-nums text-sm">₹{startWage.toLocaleString('en-IN')}/mo</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">6-Month Wage</span>
            <span className="font-extrabold text-slate-950 tabular-nums text-sm">₹16,100/mo</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">1-Year Median</span>
            <span className="font-extrabold text-emerald-950 tabular-nums text-sm">₹{endWage.toLocaleString('en-IN')}/mo</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Net Increment</span>
            <span className="font-extrabold text-blue-900 tabular-nums text-sm">+₹{(endWage - startWage).toLocaleString('en-IN')} (+{growthPct}%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
