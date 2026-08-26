'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Sparkles,
  Brain,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  FileCheck,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import type { IAICareerIntelligenceResult } from '@/lib/ai/types'

interface CareerIntelligenceCardProps {
  traineeId: string
}

const outcomeVariantMap: Record<string, 'success' | 'warning' | 'destructive' | 'neutral' | 'default'> = {
  'Direct Trade Placement': 'success',
  'Related Sector Role': 'default',
  'Unrelated Role': 'warning',
  'Wage Progression Verified': 'success',
  'High Retention Risk': 'destructive',
  'Underemployed': 'warning',
}

const alignmentVariantMap: Record<string, 'success' | 'warning' | 'destructive' | 'neutral'> = {
  'High Alignment': 'success',
  'Moderate Alignment': 'warning',
  'Low Alignment': 'destructive',
}

const riskVariantMap: Record<string, 'success' | 'warning' | 'destructive' | 'neutral'> = {
  'Low': 'success',
  'Moderate': 'warning',
  'High': 'destructive',
}

export function CareerIntelligenceCard({ traineeId }: CareerIntelligenceCardProps) {
  const [data, setData] = useState<IAICareerIntelligenceResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorStatus, setErrorStatus] = useState<number | null>(null)

  const fetchIntelligence = useCallback(async () => {
    try {
      setLoading(true)
      setErrorStatus(null)
      const res = await fetch(`/api/ai/career-intelligence?traineeId=${traineeId}`)
      if (!res.ok) {
        setErrorStatus(res.status)
        return
      }
      const json = await res.json()
      if (json.success && json.data) {
        setData(json.data)
      } else {
        setErrorStatus(500)
      }
    } catch {
      setErrorStatus(500)
    } finally {
      setLoading(false)
    }
  }, [traineeId])

  useEffect(() => {
    fetchIntelligence()
  }, [fetchIntelligence])

  const evidenceItems: string[] = data?.evidenceUsed
    ? Array.isArray(data.evidenceUsed)
      ? data.evidenceUsed
      : (Object.values(data.evidenceUsed) as string[])
    : []

  return (
    <Card className="overflow-hidden border border-slate-200 bg-white shadow-xs">
      {/* Header Banner */}
      <CardHeader className="border-b border-slate-200 bg-purple-50/80 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-600 text-white shadow-xs">
              <Sparkles className="size-4.5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle className="text-sm font-bold text-purple-950 sm:text-base">
                AI Career Intelligence
              </CardTitle>
              <CardDescription className="text-xs font-semibold text-purple-800">
                Longitudinal outcome prediction, trade alignment, and career progression
              </CardDescription>
            </div>
          </div>
          <Badge variant="default" className="border-purple-300 bg-purple-100 text-purple-950 font-bold text-[11px] shrink-0">
            Policy AI
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-purple-50 text-purple-700 animate-pulse">
              <Brain className="size-5 animate-spin" />
            </div>
            <p className="text-sm font-bold text-slate-900">
              Generating Career Intelligence synthesis...
            </p>
            <p className="text-xs font-medium text-slate-500">
              Aggregating verified training, NSQF certification, and wage progression evidence.
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && errorStatus && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-amber-200 bg-amber-50/80 p-6 text-center">
            <AlertTriangle className="size-6 text-amber-700" aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold text-slate-950">
                Career Intelligence Unavailable
              </p>
              <p className="max-w-md text-xs font-medium text-slate-700">
                The career intelligence engine could not process this request at this time. Please retry.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchIntelligence}
              className="mt-1 h-8 text-xs font-bold border-slate-300 bg-white hover:bg-slate-100"
            >
              <RefreshCw className="mr-1.5 size-3.5" /> Retry
            </Button>
          </div>
        )}

        {/* Success Content */}
        {!loading && data && (
          <div className="flex flex-col gap-5">
            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Career Outcome
                </span>
                <div className="mt-2 flex items-center">
                  <Badge
                    variant={outcomeVariantMap[data.careerOutcome] || 'neutral'}
                    className="text-xs font-bold px-2.5 py-0.5"
                  >
                    {data.careerOutcome}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Training Alignment
                </span>
                <div className="mt-2 flex items-center">
                  <Badge
                    variant={alignmentVariantMap[data.trainingEmploymentAlignment] || 'neutral'}
                    className="text-xs font-bold px-2.5 py-0.5"
                  >
                    {data.trainingEmploymentAlignment}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Retention Risk
                  </span>
                  <Badge
                    variant={riskVariantMap[data.riskLevel] || 'neutral'}
                    className="text-xs font-bold px-2.5 py-0.5"
                  >
                    {data.riskLevel}
                  </Badge>
                </div>
                <div className="mt-2 flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Confidence:</span>
                    <span className="font-extrabold text-slate-950 tabular-nums">
                      {data.outcomeConfidence}%
                    </span>
                  </div>
                  <Progress value={data.outcomeConfidence} className="h-1.5" />
                </div>
              </div>
            </div>

            {/* Strategic Narrative */}
            <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-4 text-slate-800">
              <div className="flex items-center gap-2 mb-1.5">
                <Brain className="size-4 text-purple-700" aria-hidden="true" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-950">
                  Synthesized Career Insight
                </h4>
              </div>
              <p className="text-sm leading-relaxed font-medium text-slate-900 text-pretty">
                {data.careerInsight}
              </p>
            </div>

            {/* Alignment & Risk Detailed Reasons */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-950">
                  <CheckCircle2 className="size-3.5 text-emerald-700" />
                  <span>Alignment Rationale</span>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed">
                  {data.alignmentReason}
                </p>
              </div>

              <div className="flex flex-col gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-950">
                  <AlertCircle className="size-3.5 text-amber-700" />
                  <span>Risk Rationale</span>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed">
                  {data.riskReason}
                </p>
              </div>
            </div>

            {/* Recommended Next Skill Card */}
            <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-slate-800">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                <Lightbulb className="size-4" aria-hidden="true" />
              </span>
              <div className="flex flex-1 flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-950">
                    Recommended Next Skill:
                  </span>
                  <Badge variant="default" className="text-xs font-bold py-0.5 px-2.5">
                    {data.recommendedNextSkill?.skill || 'Domain Skill Enhancement'}
                  </Badge>
                </div>
                <p className="text-xs font-medium text-slate-800 leading-relaxed text-pretty">
                  {data.recommendedNextSkill?.rationale}
                </p>
              </div>
            </div>

            {/* Evidence Used Badges */}
            <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 font-bold">
                <FileCheck className="size-3.5 text-blue-700" aria-hidden="true" />
                <span>Evidence Grounding:</span>
              </div>
              {evidenceItems.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {evidenceItems.map((ev: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-mono font-bold text-slate-800 shadow-2xs"
                    >
                      {ev}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-1 pt-2 border-t border-slate-200 text-[11px] text-slate-500 font-medium italic">
                AI-generated from available verified training, employment, verification, and wage evidence.
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
