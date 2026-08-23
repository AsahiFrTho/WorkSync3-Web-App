import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/page-header'
import { AnalyticsView } from '@/components/analytics/analytics-view'

export default function AnalyticsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Analytics"
        title="Skill Gap & Non-placement Analytics"
        description="Where employer demand outpaces training coverage, and why certified trainees remain unplaced. Use the filters to explore by district and course. All figures are illustrative demonstration data."
      />
      <AnalyticsView />
    </AppShell>
  )
}
