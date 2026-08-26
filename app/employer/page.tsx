'use client'

import { useState, useEffect, useCallback } from 'react'
import { BadgeCheck, Clock, AlertTriangle, Users, ShieldCheck, TimerReset, Sparkles, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ITraineePopulated {
  _id: string
  traineeId: string
  name: string
  district: string
  course: string
  status: string
}

interface IEmploymentRecordItem {
  _id: string
  trainee: ITraineePopulated | null
  traineeId: string
  employerName: string
  employerContactEmail?: string
  jobRole: string
  employmentType: string
  district: string
  startDate: string
  monthlyWage: number
  trainingRelevance?: 'directly_related' | 'partially_related' | 'unrelated'
  verificationStatus: 'pending' | 'verified' | 'disputed' | 'flagged'
  verificationMetadata?: {
    verifiedAt?: string
    verifiedBy?: string
    disputeReason?: string
    remarks?: string
  }
}

const statusMeta = {
  verified: { label: 'Verified', variant: 'success' as const, Icon: BadgeCheck },
  pending: { label: 'Pending', variant: 'warning' as const, Icon: Clock },
  disputed: { label: 'Disputed', variant: 'destructive' as const, Icon: AlertTriangle },
  flagged: { label: 'Needs review', variant: 'destructive' as const, Icon: AlertTriangle },
}

const relevanceMeta = {
  directly_related: { label: 'Direct Trade Alignment', variant: 'success' as const },
  partially_related: { label: 'Partially Related', variant: 'warning' as const },
  unrelated: { label: 'Not Related', variant: 'neutral' as const },
}

const inr = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n)

export default function EmployerPage() {
  const [records, setRecords] = useState<IEmploymentRecordItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionInProgress, setActionInProgress] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ id: string; type: 'success' | 'error'; message: string } | null>(null)

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/employment?isCurrent=true')
      const data = await res.json()

      if (data.success && Array.isArray(data.employmentRecords)) {
        setRecords(data.employmentRecords)
      } else {
        setError(data.error || 'Failed to load employment records')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error loading records')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  const handleConfirm = async (id: string) => {
    setActionInProgress(id)
    setFeedback(null)
    try {
      const res = await fetch(`/api/employment/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationStatus: 'verified',
          verifiedBy: 'Employer HR',
        }),
      })
      const data = await res.json()

      if (data.success && data.employmentRecord) {
        setFeedback({
          id,
          type: 'success',
          message: 'Employment successfully confirmed & verified!',
        })
        setRecords((prev) =>
          prev.map((r) => (r._id === id ? { ...r, ...data.employmentRecord } : r))
        )
      } else {
        setFeedback({
          id,
          type: 'error',
          message: data.error || 'Failed to verify employment',
        })
      }
    } catch (err) {
      setFeedback({
        id,
        type: 'error',
        message: err instanceof Error ? err.message : 'Network error during verification',
      })
    } finally {
      setActionInProgress(null)
    }
  }

  const handleDispute = async (id: string) => {
    setActionInProgress(id)
    setFeedback(null)
    try {
      const res = await fetch(`/api/employment/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationStatus: 'disputed',
          disputeReason: 'Trainee did not join',
        }),
      })
      const data = await res.json()

      if (data.success && data.employmentRecord) {
        setFeedback({
          id,
          type: 'success',
          message: 'Record marked as disputed (Trainee did not join).',
        })
        setRecords((prev) =>
          prev.map((r) => (r._id === id ? { ...r, ...data.employmentRecord } : r))
        )
      } else {
        setFeedback({
          id,
          type: 'error',
          message: data.error || 'Failed to dispute record',
        })
      }
    } catch (err) {
      setFeedback({
        id,
        type: 'error',
        message: err instanceof Error ? err.message : 'Network error during dispute',
      })
    } finally {
      setActionInProgress(null)
    }
  }

  const verifiedCount = records.filter((e) => e.verificationStatus === 'verified').length
  const pendingCount = records.filter((e) => e.verificationStatus === 'pending').length
  const disputedCount = records.filter((e) => e.verificationStatus === 'disputed' || e.verificationStatus === 'flagged').length

  return (
    <AppShell>
      <PageHeader
        eyebrow="Employer"
        title="Employer Verification"
        description="Employers confirm that a placed trainee has actually joined and is employed — the check that turns a placement into a verified outcome."
      />

      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Submitted"
            value={String(records.length)}
            sublabel="Total employment records"
            icon={Users}
          />
          <StatCard
            label="Verified"
            value={String(verifiedCount)}
            sublabel="Employment confirmed in DB"
            icon={ShieldCheck}
          />
          <StatCard
            label="Awaiting action"
            value={String(pendingCount)}
            sublabel="Pending employer response"
            icon={TimerReset}
          />
        </section>

        <Card className="border border-slate-200 bg-white shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-950">Verification Queue</CardTitle>
              <CardDescription className="text-xs text-slate-600">Confirm or dispute employment against live database records</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRecords}
              disabled={loading}
              className="text-xs font-bold border-slate-300 bg-white hover:bg-slate-100"
            >
              {loading ? (
                <Loader2 className="mr-1.5 size-3 animate-spin" />
              ) : (
                <Sparkles className="mr-1.5 size-3 text-blue-700" />
              )}
              Refresh Queue
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {loading && records.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-sm font-semibold text-slate-600">
                <Loader2 className="mr-2 size-5 animate-spin text-blue-700" />
                Loading employment verification records from database...
              </div>
            ) : error && records.length === 0 ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-900">
                <p className="font-bold">Error connecting to database</p>
                <p className="text-xs font-medium text-rose-800">{error}</p>
              </div>
            ) : records.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-sm font-bold text-slate-950">No employment records found</p>
                <p className="text-xs font-medium text-slate-600">Seed records to begin testing the verification flow.</p>
              </div>
            ) : (
              records.map((e) => {
                const meta = statusMeta[e.verificationStatus] || statusMeta.pending
                const Icon = meta.Icon
                const relevance = e.trainingRelevance ? relevanceMeta[e.trainingRelevance] : relevanceMeta.directly_related
                const traineeName = e.trainee?.name || e.traineeId
                const courseName = e.trainee?.course || 'Vocational Trade'
                const formattedDate = e.startDate
                  ? new Date(e.startDate).toLocaleDateString('en-IN', {
                    month: 'short',
                    year: 'numeric',
                  })
                  : 'Recent'
                const isItemProcessing = actionInProgress === e._id
                const itemFeedback = feedback?.id === e._id ? feedback : null

                return (
                  <div
                    key={e._id}
                    className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 shadow-2xs sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-slate-950">{traineeName}</span>
                        <Badge variant={meta.variant}>
                          <Icon className="size-3" aria-hidden="true" /> {meta.label}
                        </Badge>
                        <Badge variant={relevance.variant}>
                          {relevance.label}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {e.traineeId}
                        </span>
                        <span className="font-bold text-slate-800">
                          {e.employerName}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-700">
                        {e.jobRole} · {courseName} · Joined {formattedDate} · <span className="font-bold text-slate-950">{inr(e.monthlyWage)}/mo</span>
                      </p>
                      {e.verificationStatus === 'disputed' && e.verificationMetadata?.disputeReason && (
                        <div className="rounded-md border border-rose-200 bg-rose-50/80 p-2 text-xs font-semibold text-rose-900">
                          Dispute Reason: {e.verificationMetadata.disputeReason}
                        </div>
                      )}
                      {e.verificationStatus === 'verified' && e.verificationMetadata?.verifiedBy && (
                        <div className="rounded-md border border-emerald-200 bg-emerald-50/80 p-2 text-xs font-semibold text-emerald-900">
                          Verified by {e.verificationMetadata.verifiedBy}
                          {e.verificationMetadata.verifiedAt && (
                            <span> on {new Date(e.verificationMetadata.verifiedAt).toLocaleDateString('en-IN')}</span>
                          )}
                        </div>
                      )}
                      {itemFeedback && (
                        <div
                          className={`mt-1 flex items-center gap-1.5 text-xs font-bold ${
                            itemFeedback.type === 'success' ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {itemFeedback.type === 'success' ? (
                            <CheckCircle2 className="size-3.5" />
                          ) : (
                            <XCircle className="size-3.5" />
                          )}
                          {itemFeedback.message}
                        </div>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {e.verificationStatus === 'verified' ? (
                        <Button variant="outline" size="sm" disabled className="text-emerald-900 border-emerald-300 bg-emerald-50 font-bold text-xs">
                          <CheckCircle2 className="mr-1.5 size-3.5 text-emerald-700" /> Confirmed
                        </Button>
                      ) : e.verificationStatus === 'disputed' ? (
                        <Button variant="outline" size="sm" disabled className="text-rose-900 border-rose-300 bg-rose-50 font-bold text-xs">
                          <XCircle className="mr-1.5 size-3.5 text-rose-700" /> Disputed
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDispute(e._id)}
                            disabled={isItemProcessing}
                            className="border-rose-300 bg-white text-rose-800 hover:bg-rose-50 font-bold text-xs"
                          >
                            {isItemProcessing ? <Loader2 className="size-3.5 animate-spin" /> : 'Dispute'}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleConfirm(e._id)}
                            disabled={isItemProcessing}
                            className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs"
                          >
                            {isItemProcessing ? (
                              <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                            ) : (
                              <BadgeCheck className="mr-1.5 size-3.5" />
                            )}
                            Confirm Employment
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
