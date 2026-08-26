'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  followUpStatus,
  skillGaps,
  nonPlacementReasons,
} from '@/lib/mock-data'
import { AlertTriangle, CheckCircle2, AlertCircle, HelpCircle, XCircle } from 'lucide-react'

const toneColors: Record<string, { dot: string; bar: string; text: string; bg: string }> = {
  success: { dot: 'bg-emerald-600', bar: 'bg-emerald-600', text: 'text-emerald-950', bg: 'bg-emerald-50' },
  warning: { dot: 'bg-amber-600', bar: 'bg-amber-500', text: 'text-amber-950', bg: 'bg-amber-50' },
  destructive: { dot: 'bg-rose-600', bar: 'bg-rose-600', text: 'text-rose-950', bg: 'bg-rose-50' },
  neutral: { dot: 'bg-slate-400', bar: 'bg-slate-400', text: 'text-slate-800', bg: 'bg-slate-50' },
}

export function FollowUpStatus() {
  const total = followUpStatus.reduce((s, d) => s + d.value, 0)
  return (
    <Card className="border border-slate-200/90 bg-white shadow-xs rounded-xl overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
        <CardTitle className="text-base font-extrabold text-slate-950 font-sans">
          Follow-Up Status
        </CardTitle>
        <CardDescription className="text-xs font-semibold text-slate-600 mt-0.5">
          Outcome verification audit across active cohort
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3.5 pt-5">
        {followUpStatus.map((f) => {
          const cfg = toneColors[f.tone] || toneColors.neutral
          const pct = Math.round((f.value / total) * 100)

          return (
            <div key={f.label} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="flex items-center gap-2 font-bold text-slate-900">
                  <span className={`size-2.5 rounded-full ${cfg.dot}`} aria-hidden="true" />
                  {f.label}
                </span>
                <span className="tabular-nums font-black text-slate-950">
                  {f.value.toLocaleString('en-IN')}
                  <span className="ml-2 text-xs font-bold text-slate-500">({pct}%)</span>
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200/60 p-0.5">
                <div
                  className={`h-full rounded-full ${cfg.bar}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export function SkillGapIndicators() {
  const top = skillGaps.filter((s) => s.gap > 0).slice(0, 4)
  return (
    <Card className="border border-slate-200/90 bg-white shadow-xs rounded-xl overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-extrabold text-slate-950 font-sans">
              Skill-Gap Indicators
            </CardTitle>
            <CardDescription className="text-xs font-semibold text-slate-600 mt-0.5">
              High employer demand vs. low training coverage
            </CardDescription>
          </div>
          <Badge variant="destructive" className="font-extrabold text-[10px] px-2 py-0.5">
            Priority Action
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pt-4">
        {top.map((s) => (
          <div
            key={s.skill}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 shadow-2xs hover:border-slate-300 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-extrabold text-slate-950">{s.skill}</p>
              <div className="mt-1 flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                <span className="rounded bg-blue-100 text-blue-900 px-1.5 py-0.2">Demand: {s.demand}</span>
                <span>•</span>
                <span className="rounded bg-slate-200 text-slate-800 px-1.5 py-0.2">Coverage: {s.coverage}</span>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <Badge variant={s.demand === 'High' ? 'destructive' : 'warning'} className="font-extrabold text-xs px-2.5 py-0.5">
                Gap {s.gap}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function NonPlacementReasonsCard() {
  const max = Math.max(...nonPlacementReasons.map((r) => r.value))
  return (
    <Card className="border border-slate-200/90 bg-white shadow-xs rounded-xl overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
        <CardTitle className="text-base font-extrabold text-slate-950 font-sans">
          Non-Placement Diagnostics
        </CardTitle>
        <CardDescription className="text-xs font-semibold text-slate-600 mt-0.5">
          Root cause analysis: Why certified candidates remain unplaced
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3.5 pt-5">
        {nonPlacementReasons.map((r, idx) => {
          const isTop = idx === 0
          return (
            <div key={r.reason} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className={`font-semibold ${isTop ? 'text-rose-950 font-bold' : 'text-slate-800'}`}>
                  {r.reason}
                </span>
                <span className={`tabular-nums font-black ${isTop ? 'text-rose-950 font-black' : 'text-slate-950'}`}>
                  {r.value}%
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200/60 p-0.5">
                <div
                  className={`h-full rounded-full transition-all ${
                    isTop ? 'bg-rose-600' : idx === 1 ? 'bg-amber-500' : 'bg-slate-600'
                  }`}
                  style={{ width: `${(r.value / max) * 100}%` }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
