import Link from 'next/link'
import { Users, Briefcase, Repeat, IndianRupee, ArrowLeftRight, ShieldCheck } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { OutcomeFunnel } from '@/components/dashboard/outcome-funnel'
import { WageProgressionChart } from '@/components/dashboard/wage-progression-chart'
import { EmploymentTypeChart } from '@/components/dashboard/employment-type-chart'
import {
  DistrictTable,
  CourseTable,
  ProviderTable,
} from '@/components/dashboard/performance-tables'
import {
  FollowUpStatus,
  SkillGapIndicators,
  NonPlacementReasonsCard,
} from '@/components/dashboard/signals'
import { summary, inr, compact } from '@/lib/mock-data'

export default function DashboardPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Government / Admin"
        title="Skilling Outcomes & Impact Dashboard"
        description="A longitudinal view of the Maharashtra skilling journey — from training and certification through placement, wage progression, and 6-month retention. Figures are illustrative demonstration data."
      />

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Active Demo Role Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50/60 px-4 py-2.5 text-xs text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-blue-600 dark:text-blue-400" />
            <span>
              <strong>Active Demo Persona:</strong> Dr. Sanjay Patil (Director of Policy & Analytics, MSSDS)
            </span>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-1 font-semibold text-blue-700 underline-offset-4 hover:underline dark:text-blue-300"
          >
            <ArrowLeftRight className="size-3.5" />
            <span>Switch Demo Role</span>
          </Link>
        </div>
        {/* KPIs */}
        <section aria-label="Key metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total trainees"
            value={compact(summary.totalTrainees)}
            sublabel={`${summary.totalTrainees.toLocaleString('en-IN')} across ${summary.activeDistricts} districts`}
            icon={Users}
            trend={{ value: '+8.2% vs last year', direction: 'up' }}
          />
          <StatCard
            label="Employment rate"
            value={`${summary.employmentRate}%`}
            sublabel={`Certification rate ${summary.certificationRate}%`}
            icon={Briefcase}
            trend={{ value: '+3.1 pts', direction: 'up' }}
          />
          <StatCard
            label="Retention rate"
            value={`${summary.retentionRate}%`}
            sublabel="Retained at 6 months"
            icon={Repeat}
            trend={{ value: '+1.4 pts', direction: 'up' }}
          />
          <StatCard
            label="Average wage"
            value={inr(summary.averageWage)}
            sublabel="Median monthly, post-placement"
            icon={IndianRupee}
            trend={{ value: `+${summary.wageGrowth}% YoY`, direction: 'up' }}
          />
        </section>

        {/* Funnel + wage */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <OutcomeFunnel />
          <WageProgressionChart />
        </section>

        {/* Signals row */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <FollowUpStatus />
          <EmploymentTypeChart />
          <NonPlacementReasonsCard />
        </section>

        {/* District + skill gaps */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DistrictTable />
          </div>
          <SkillGapIndicators />
        </section>

        {/* Course + Provider */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CourseTable />
          <ProviderTable />
        </section>
      </div>
    </AppShell>
  )
}
