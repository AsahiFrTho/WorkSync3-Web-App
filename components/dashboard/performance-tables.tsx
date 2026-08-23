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
    <Card>
      <CardHeader>
        <CardTitle>District performance</CardTitle>
        <CardDescription>Employment and retention by district</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-2.5 font-medium">District</th>
                <th className="px-3 py-2.5 text-right font-medium">Trainees</th>
                <th className="px-3 py-2.5 font-medium">Employment</th>
                <th className="px-3 py-2.5 text-right font-medium">Retention</th>
                <th className="px-5 py-2.5 text-right font-medium">Avg wage</th>
              </tr>
            </thead>
            <tbody>
              {districtPerformance.map((d) => (
                <tr key={d.district} className="border-b border-border/60 last:border-0">
                  <td className="px-5 py-2.5 font-medium">{d.district}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">
                    {d.trainees.toLocaleString('en-IN')}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Progress value={d.employmentRate} className="w-20" />
                      <span className="tabular-nums text-muted-foreground">{d.employmentRate}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">
                    {d.retentionRate}%
                  </td>
                  <td className="px-5 py-2.5 text-right tabular-nums">{inr(d.avgWage)}</td>
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
    <Card>
      <CardHeader>
        <CardTitle>Course performance</CardTitle>
        <CardDescription>Placement rate and demand by trade</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-2.5 font-medium">Course</th>
                <th className="px-3 py-2.5 text-right font-medium">Trainees</th>
                <th className="px-3 py-2.5 font-medium">Employment</th>
                <th className="px-3 py-2.5 text-right font-medium">Avg wage</th>
                <th className="px-5 py-2.5 text-right font-medium">Demand</th>
              </tr>
            </thead>
            <tbody>
              {coursePerformance.map((c) => (
                <tr key={c.course} className="border-b border-border/60 last:border-0">
                  <td className="px-5 py-2.5 font-medium">{c.course}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">
                    {c.trainees.toLocaleString('en-IN')}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Progress value={c.employmentRate} className="w-20" />
                      <span className="tabular-nums text-muted-foreground">{c.employmentRate}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{inr(c.avgWage)}</td>
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
    <Card>
      <CardHeader>
        <CardTitle>Provider performance</CardTitle>
        <CardDescription>Training partners ranked by placement rate</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-2.5 font-medium">Provider</th>
                <th className="px-3 py-2.5 text-right font-medium">Trainees</th>
                <th className="px-3 py-2.5 font-medium">Placement</th>
                <th className="px-5 py-2.5 text-right font-medium">Rating</th>
              </tr>
            </thead>
            <tbody>
              {providerPerformance.map((p) => (
                <tr key={p.provider} className="border-b border-border/60 last:border-0">
                  <td className="px-5 py-2.5 font-medium">{p.provider}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">
                    {p.trainees.toLocaleString('en-IN')}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Progress value={p.placementRate} className="w-20" />
                      <span className="tabular-nums text-muted-foreground">{p.placementRate}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-2.5 text-right tabular-nums">{p.rating.toFixed(1)} / 5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
