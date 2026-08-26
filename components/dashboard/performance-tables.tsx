import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  districtPerformance,
  coursePerformance,
  providerPerformance,
  inr,
} from '@/lib/mock-data'

function DemandBadge({ level }: { level: 'High' | 'Medium' | 'Low' }) {
  const variant = level === 'High' ? 'success' : level === 'Medium' ? 'warning' : 'neutral'
  return <Badge variant={variant}>{level}</Badge>
}

export function DistrictTable() {
  return (
    <Card className="border border-slate-200 bg-white shadow-xs">
      <CardHeader>
        <CardTitle className="text-base font-bold text-slate-950">District Performance</CardTitle>
        <CardDescription className="text-xs text-slate-600">Employment and retention metrics by district</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-slate-200 bg-slate-50/80 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                <th className="px-5 py-2.5">District</th>
                <th className="px-3 py-2.5 text-right">Trainees</th>
                <th className="px-3 py-2.5">Employment</th>
                <th className="px-3 py-2.5 text-right">Retention</th>
                <th className="px-5 py-2.5 text-right">Avg Wage</th>
              </tr>
            </thead>
            <tbody>
              {districtPerformance.map((d) => (
                <tr key={d.district} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors text-slate-900">
                  <td className="px-5 py-2.5 font-bold">{d.district}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums font-medium text-slate-700">
                    {d.trainees.toLocaleString('en-IN')}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Progress value={d.employmentRate} className="w-20" />
                      <span className="tabular-nums font-semibold text-slate-800">{d.employmentRate}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums font-semibold text-slate-800">
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
    <Card className="border border-slate-200 bg-white shadow-xs">
      <CardHeader>
        <CardTitle className="text-base font-bold text-slate-950">Course Performance</CardTitle>
        <CardDescription className="text-xs text-slate-600">Placement rate and industry demand by trade</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-slate-200 bg-slate-50/80 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                <th className="px-5 py-2.5">Course</th>
                <th className="px-3 py-2.5 text-right">Trainees</th>
                <th className="px-3 py-2.5">Employment</th>
                <th className="px-3 py-2.5 text-right">Avg Wage</th>
                <th className="px-5 py-2.5 text-right">Demand</th>
              </tr>
            </thead>
            <tbody>
              {coursePerformance.map((c) => (
                <tr key={c.course} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors text-slate-900">
                  <td className="px-5 py-2.5 font-bold">{c.course}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums font-medium text-slate-700">
                    {c.trainees.toLocaleString('en-IN')}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Progress value={c.employmentRate} className="w-20" />
                      <span className="tabular-nums font-semibold text-slate-800">{c.employmentRate}%</span>
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
    <Card className="border border-slate-200 bg-white shadow-xs">
      <CardHeader>
        <CardTitle className="text-base font-bold text-slate-950">Provider Performance</CardTitle>
        <CardDescription className="text-xs text-slate-600">Training partners ranked by placement rate</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-slate-200 bg-slate-50/80 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                <th className="px-5 py-2.5">Provider</th>
                <th className="px-3 py-2.5 text-right">Trainees</th>
                <th className="px-3 py-2.5">Placement</th>
                <th className="px-5 py-2.5 text-right">Rating</th>
              </tr>
            </thead>
            <tbody>
              {providerPerformance.map((p) => (
                <tr key={p.provider} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors text-slate-900">
                  <td className="px-5 py-2.5 font-bold">{p.provider}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums font-medium text-slate-700">
                    {p.trainees.toLocaleString('en-IN')}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Progress value={p.placementRate} className="w-20" />
                      <span className="tabular-nums font-semibold text-slate-800">{p.placementRate}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-2.5 text-right tabular-nums font-bold text-slate-950">{p.rating.toFixed(1)} / 5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
