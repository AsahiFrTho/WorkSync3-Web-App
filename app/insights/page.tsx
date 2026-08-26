import { Info, Sparkles } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { InsightCard } from '@/components/insights/insight-card'
import { aiInsights } from '@/lib/mock-data'

export default function InsightsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="AI Insights"
        title="AI-assisted Programme Insights"
        description="A preview of the future AI layer: it reads outcome, skill-gap, and non-placement signals to surface where programmes could be improved."
      />

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Prototype disclaimer with high-contrast text */}
        <div className="rounded-xl border border-amber-300 bg-amber-50/90 p-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 size-4.5 shrink-0 text-amber-700" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-slate-800 font-normal">
              <strong className="font-bold text-slate-950">Prototype / demonstration only.</strong> These insights are
              illustrative examples of what the planned AI layer will produce. No real government data
              has been analysed, and no AI model is connected in this prototype.
            </p>
          </div>
        </div>

        {/* How it will work */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-md bg-blue-100 text-blue-800">
                <Sparkles className="size-4" aria-hidden="true" />
              </span>
              <h2 className="text-sm font-bold text-slate-950">How the AI layer will work</h2>
            </div>
            <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { n: '1', t: 'Read signals', d: 'Ingest outcomes, non-placement reasons, and employer demand.' },
                { n: '2', t: 'Detect gaps', d: 'Correlate recurring skill gaps against training coverage.' },
                { n: '3', t: 'Explain', d: 'Summarise the pattern in plain language for officials.' },
                { n: '4', t: 'Recommend', d: 'Suggest concrete programme actions to close the gap.' },
              ].map((s) => (
                <li key={s.n} className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-slate-50/90 p-3">
                  <span className="text-xs font-bold text-blue-800">Step {s.n}</span>
                  <span className="text-sm font-bold text-slate-950">{s.t}</span>
                  <span className="text-xs font-medium text-slate-700 leading-normal">{s.d}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Insight cards */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {aiInsights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </section>
      </div>
    </AppShell>
  )
}
