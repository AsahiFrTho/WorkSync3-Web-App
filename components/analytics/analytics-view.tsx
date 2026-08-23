'use client'

import { useState } from 'react'
import { Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { SkillGapMatrix } from '@/components/analytics/skill-gap-matrix'
import { EmployerDemandChart } from '@/components/analytics/employer-demand-chart'
import { NonPlacementChart } from '@/components/analytics/non-placement-chart'
import { CoverageComparisonChart } from '@/components/analytics/coverage-comparison-chart'
import { districts, courses, coursePerformance } from '@/lib/mock-data'

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="font-medium text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 min-w-44 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}

function TrainingCoverageCard({ courseFilter }: { courseFilter: string }) {
  const rows =
    courseFilter === 'All Courses'
      ? coursePerformance
      : coursePerformance.filter((c) => c.course === courseFilter)
  const view = rows.length ? rows : coursePerformance
  return (
    <Card>
      <CardHeader>
        <CardTitle>Training coverage</CardTitle>
        <CardDescription>Trainee volume by course as a coverage proxy</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {view.map((c) => {
          const max = Math.max(...coursePerformance.map((x) => x.trainees))
          return (
            <div key={c.course} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  {c.course}
                  <Badge variant={c.demand === 'High' ? 'success' : 'neutral'}>{c.demand}</Badge>
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {c.trainees.toLocaleString('en-IN')}
                </span>
              </div>
              <Progress value={(c.trainees / max) * 100} indicatorClassName="bg-chart-2" />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export function AnalyticsView() {
  const [district, setDistrict] = useState(districts[0])
  const [course, setCourse] = useState(courses[0])

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Filter className="size-4 text-muted-foreground" aria-hidden="true" />
            Filters
          </div>
          <FilterSelect
            label="District"
            value={district}
            options={districts}
            onChange={setDistrict}
          />
          <FilterSelect
            label="Course"
            value={course}
            options={courses}
            onChange={setCourse}
          />
          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <span>Showing:</span>
            <Badge variant="neutral">{district}</Badge>
            <Badge variant="neutral">{course}</Badge>
          </div>
        </CardContent>
      </Card>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SkillGapMatrix />
        <div className="flex flex-col gap-6">
          <EmployerDemandChart />
          <TrainingCoverageCard courseFilter={course} />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CoverageComparisonChart courseFilter={course} />
        <NonPlacementChart />
      </section>
    </div>
  )
}
