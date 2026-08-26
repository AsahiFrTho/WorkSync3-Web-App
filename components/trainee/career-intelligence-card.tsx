'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Sparkles,
  Brain,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Loader2,
  Lightbulb,
  FileCheck,
  Info,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import type { IAICareerIntelligenceResult } from '@/lib/ai/types'

interface CareerIntelligenceCardProps {
  traineeId: string
}

const outcomeVariantMap: Record<string, 'success' | 'warning' | 'destructive' | 'neutral'> = {
  Strong: 'success',
  Positive: 'success',
  Moderate: 'neutral',
  'Needs Attention': 'warning',
  'At Risk': 'destructive',
}

const alignmentVariantMap: Record<string, 'success' | 'warning' | 'destructive' | 'neutral'> = {
  'Direct Match': 'success',
  'Partial Match': 'warning',
  Unrelated: 'neutral',
  Mismatched: 'destructive',
}

const riskVariantMap: Record<string, 'success' | 'warning' | 'destructive'> = {
  Low: 'success',
  Medium: 'warning',
  High: 'destructive',
  Critical: 'destructive',
}

function normalizeEvidenceList(evidenceList?: string[]): string[] {
  if (!Array.isArray(evidenceList)) return []
  const items: string[] = []

  for (const raw of evidenceList) {
    if (typeof raw !== 'string') continue
    // Split on newlines or clear delimiters if strings were concatenated
    const splitParts = raw.split(/\r?\n|;\s*/g)
    for (const part of splitParts) {
      const trimmed = part.trim().replace(/^[-*•]\s*/, '')
      if (trimmed) {
        items.push(trimmed)
      }
    }
  }

  return items.length > 0 ? items : evidenceList
}

export function CareerIntelligenceCard({ traineeId }: CareerIntelligenceCardProps) {
  const [data, setData] = useState<IAICareerIntelligenceResult | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [errorStatus, setErrorStatus] = useState<number | null>(null)

  const fetchIntelligence = useCallback(async () => {
    if (!traineeId) return
    setLoading(true)
    setErrorStatus(null)

    try {
      const res = await fetch(
        `/api/ai/career-intelligence?traineeId=${encodeURIComponent(traineeId)}`
      )
      if (res.status === 404) {
        setErrorStatus(404)
        setData(null)
      } else if (!res.ok) {
        setErrorStatus(res.status)
        setData(null)
      } else {
        const json: IAICareerIntelligenceResult = await res.json()
        setData(json)
      }
    } catch {
      setErrorStatus(500)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [traineeId])

  useEffect(() => {
    fetchIntelligence()
  }, [fetchIntelligence])

  const evidenceItems = useMemo(
    () => normalizeEvidenceList(data?.evidenceUsed),
    [data?.evidenceUsed]
  )

  return (
    <Card className="overflow-hidden border-border">
      {/* Header with AI styling */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-primary/5 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary/15 text-primary">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">AI Career Intelligence</h3>
              <Badge variant="default" className="text-[10px] py-0 px-1.5 font-normal">
                Live Analysis
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Evidence-grounded career trajectory & outcome intelligence
            </p>
          </div>
        </div>

        {!loading && (
          <Button
            variant="outline"
            size="sm"
            onClick={fetchIntelligence}
            className="h-7 text-xs gap-1.5 px-2.5"
          >
            <RefreshCw className="size-3" />
            <span>Re-analyze</span>
          </Button>
        )}
      </div>

      <CardContent className="p-5">
        {/* State 1: Loading Skeleton */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">
                Generating Career Intelligence...
              </p>
              <p className="text-xs text-muted-foreground max-w-sm">
                Synthesizing verified training, employment verification, wage trajectory, and retention milestones.
              </p>
            </div>
          </div>
        )}

        {/* State 2: 404 / Insufficient Evidence */}
        {!loading && errorStatus === 404 && (
          <div className="flex flex-col items-center justify-center gap-2.5 rounded-lg border border-dashed border-border p-6 text-center">
            <Info className="size-6 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm font-medium text-foreground">
              Career Evidence Required
            </p>
            <p className="max-w-md text-xs text-muted-foreground leading-relaxed">
              Career Intelligence requires sufficient employment and verification evidence to synthesize an outcome analysis. Once employment records are recorded, analysis will activate automatically.
            </p>
          </div>
        )}

        {/* State 3: Generic Error / API Unavailable */}
        {!loading && errorStatus && errorStatus !== 404 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center">
            <AlertTriangle className="size-6 text-destructive" aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">
                Career Intelligence Unavailable
              </p>
              <p className="max-w-md text-xs text-muted-foreground">
                The career intelligence engine could not process this request at this time. Please try again.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchIntelligence}
              className="mt-1 h-7 text-xs"
            >
              <RefreshCw className="mr-1.5 size-3" /> Retry
            </Button>
          </div>
        )}

        {/* State 4: Structured Success Content */}
        {!loading && data && (
          <div className="flex flex-col gap-5">
            {/* Top Metrics Row: Career Outcome, Confidence, Risk Level */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* Career Outcome */}
              <div className="flex flex-col justify-between rounded-lg border border-border/80 bg-card p-3.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Career Outcome
                </span>
                <div className="mt-2 flex items-center">
                  <Badge
                    variant={outcomeVariantMap[data.careerOutcome] || 'neutral'}
                    className="text-xs font-semibold px-2.5 py-0.5"
                  >
                    {data.careerOutcome}
                  </Badge>
                </div>
              </div>

              {/* Training & Employment Alignment */}
              <div className="flex flex-col justify-between rounded-lg border border-border/80 bg-card p-3.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Training Alignment
                </span>
                <div className="mt-2 flex items-center">
                  <Badge
                    variant={alignmentVariantMap[data.trainingEmploymentAlignment] || 'neutral'}
                    className="text-xs font-semibold px-2.5 py-0.5"
                  >
                    {data.trainingEmploymentAlignment}
                  </Badge>
                </div>
              </div>

              {/* Risk Level & Confidence */}
              <div className="flex flex-col justify-between rounded-lg border border-border/80 bg-card p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Retention Risk
                  </span>
                  <Badge
                    variant={riskVariantMap[data.riskLevel] || 'neutral'}
                    className="text-xs font-semibold px-2.5 py-0.5"
                  >
                    {data.riskLevel}
                  </Badge>
                </div>
                <div className="mt-2 flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Model Confidence:</span>
                    <span className="font-semibold text-foreground tabular-nums">
                      {data.outcomeConfidence}%
                    </span>
                  </div>
                  <Progress value={data.outcomeConfidence} className="h-1.5" />
                </div>
              </div>
            </div>

            {/* Strategic Career Insight Narrative */}
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Brain className="size-4 text-primary" aria-hidden="true" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Synthesized Career Insight
                </h4>
              </div>
              <p className="text-sm leading-relaxed text-foreground text-pretty">
                {data.careerInsight}
              </p>
            </div>

            {/* Alignment & Risk Detailed Reasons */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 rounded-lg border border-border/70 bg-card p-3.5 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  <CheckCircle2 className="size-3.5 text-success" />
                  <span>Alignment Rationale</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {data.alignmentReason}
                </p>
              </div>

              <div className="flex flex-col gap-1.5 rounded-lg border border-border/70 bg-card p-3.5 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  <AlertCircle className="size-3.5 text-warning" />
                  <span>Risk Rationale</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {data.riskReason}
                </p>
              </div>
            </div>

            {/* Recommended Next Skill Card */}
            <div className="flex items-start gap-3 rounded-lg border border-primary/25 bg-primary/5 p-4">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Lightbulb className="size-4" aria-hidden="true" />
              </span>
              <div className="flex flex-1 flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Recommended Next Skill:
                  </span>
                  <Badge variant="default" className="text-xs font-semibold py-0.5 px-2.5">
                    {data.recommendedNextSkill?.skill || 'Domain Skill Enhancement'}
                  </Badge>
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed text-pretty">
                  {data.recommendedNextSkill?.rationale}
                </p>
              </div>
            </div>

            {/* Evidence Used Badges & Transparency Note */}
            <div className="flex flex-col gap-2.5 rounded-lg border border-border/70 bg-muted/20 p-3.5 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <FileCheck className="size-3.5 text-primary" aria-hidden="true" />
                <span>Evidence Grounding:</span>
              </div>
              {evidenceItems.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {evidenceItems.map((ev: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-md border border-border bg-card px-2.5 py-1 text-[11px] font-mono text-muted-foreground shadow-2xs"
                    >
                      {ev}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-1 pt-2 border-t border-border/40 text-[11px] text-muted-foreground/80 italic">
                AI-generated from available verified training, employment, verification, and wage evidence.
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
