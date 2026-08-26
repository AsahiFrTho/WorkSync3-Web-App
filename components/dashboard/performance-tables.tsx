'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  districtPerformance,
  coursePerformance,
  providerPerformance,
  inr,
} from '@/lib/mock-data'
import { Star } from 'lucide-react'

function DemandBadge({ level }: { level: 'High' | 'Medium' | 'Low' }) {
  const variant = level === 'High' ? 'success' : level === 'Medium' ? 'warning' : 'neutral'
  return <Badge variant={variant} className="font-bold text-xs px-2 py-0.5">{level}</Badge>
}

export function DistrictTable() {
  return (
    <Card className="border border-slate-200/90 bg-white shadow-xs rounded-xl overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/70 pb-3.5">
        <CardTitle className="text-base font-bold text-slate-950 font-sans">
          District Performance Index
        </CardTitle>
        <CardDescription className="text-xs font-normal text-slate-500 mt-0.5">
          Longitudinal employment and retention audit by district
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/80 text-left text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th scope="col" className="px-5 py-2.5">District</th>
                <th scope="col" className="px-3 py-2.5 text-right">Trainees</th>
                <th scope="col" className="px-4 py-2.5">Employment Rate</th>
                <th scope="col" className="px-3 py-2.5 text-right">6M Retention</th>
                <th scope="col" className="px-5 py-2.5 text-right">Avg Monthly Wage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {districtPerformance.map((d) => (
                <tr key={d.district} className="hover:bg-blue-50/40 transition-colors text-slate-900">
                  <td className="px-5 py-2.5 font-bold text-slate-950 text-sm">{d.district}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums font-medium text-slate-700">
                    {d.trainees.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100 border border-slate-200/60">
                        <div
                          className="h-full rounded-full bg-blue-700"
                          style={{ width: `${d.employmentRate}%` }}
                        />
                      </div>
                      <span className="tabular-nums font-bold text-slate-950 text-xs">{d.employmentRate}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums font-bold text-slate-800">
                    {d.retentionRate}%
                  </td>
                  <td className="px-5 py-2.5 text-right tabular-nums font-bold text-slate-950">{inr(d.avgWage)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export function CourseTable() {
  return (
    <Card className="border border-slate-200/90 bg-white shadow-xs rounded-xl overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/70 pb-3.5">
        <CardTitle className="text-base font-bold text-slate-950 font-sans">
          Course & Trade Performance
        </CardTitle>
        <CardDescription className="text-xs font-normal text-slate-500 mt-0.5">
          Placement yield and industry demand by vocational qualification
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/80 text-left text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th scope="col" className="px-5 py-2.5">Course / Trade</th>
                <th scope="col" className="px-3 py-2.5 text-right">Trainees</th>
                <th scope="col" className="px-4 py-2.5">Placement Rate</th>
                <th scope="col" className="px-3 py-2.5 text-right">Avg Wage</th>
                <th scope="col" className="px-5 py-2.5 text-right">Demand</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coursePerformance.map((c) => (
                <tr key={c.course} className="hover:bg-blue-50/40 transition-colors text-slate-900">
                  <td className="px-5 py-2.5 font-bold text-slate-950 text-sm">{c.course}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums font-medium text-slate-700">
                    {c.trainees.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100 border border-slate-200/60">
                        <div
                          className="h-full rounded-full bg-blue-700"
                          style={{ width: `${c.employmentRate}%` }}
                        />
                      </div>
                      <span className="tabular-nums font-bold text-slate-950 text-xs">{c.employmentRate}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums font-bold text-slate-950">{inr(c.avgWage)}</td>
                  <td className="px-5 py-2.5 text-right">
                    <DemandBadge level={c.demand} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProviderTable() {
  return (
    <Card className="border border-slate-200/90 bg-white shadow-xs rounded-xl overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/70 pb-3.5">
        <CardTitle className="text-base font-bold text-slate-950 font-sans">
          Training Provider Ratings
        </CardTitle>
        <CardDescription className="text-xs font-normal text-slate-500 mt-0.5">
          Accredited training partners ranked by verified placement yield
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/80 text-left text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th scope="col" className="px-5 py-2.5">Training Provider</th>
                <th scope="col" className="px-3 py-2.5 text-right">Trainees</th>
                <th scope="col" className="px-4 py-2.5">Placement Rate</th>
                <th scope="col" className="px-5 py-2.5 text-right">Quality Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {providerPerformance.map((p, idx) => (
                <tr key={p.provider} className="hover:bg-blue-50/40 transition-colors text-slate-900">
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded bg-slate-100 border border-slate-300 text-[10px] font-bold text-slate-700">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-950 text-sm">{p.provider}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums font-medium text-slate-700">
                    {p.trainees.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100 border border-slate-200/60">
                        <div
                          className="h-full rounded-full bg-emerald-600"
                          style={{ width: `${p.placementRate}%` }}
                        />
                      </div>
                      <span className="tabular-nums font-bold text-slate-950 text-xs">{p.placementRate}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-2.5 text-right">
                    <div className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-xs font-bold text-amber-950 tabular-nums">
                      <Star className="size-3 text-amber-600 fill-amber-500" />
                      <span>{p.rating.toFixed(1)} / 5</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
