import { Check, Clock, MapPin, GraduationCap, Building2, BadgeCheck, AlertTriangle } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { connectToDatabase } from '@/lib/mongodb'
import Trainee from '@/models/trainee'
import EmploymentRecord, { type IEmploymentRecord } from '@/models/employment-record'
import { cn } from '@/lib/utils'

const inr = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n)

const relevanceLabels: Record<string, { label: string; variant: 'success' | 'warning' | 'neutral' }> = {
  directly_related: { label: 'Direct Trade Alignment', variant: 'success' },
  partially_related: { label: 'Partially Related', variant: 'warning' },
  unrelated: { label: 'Not Related', variant: 'neutral' },
}

import Link from 'next/link'

export default async function TraineePage({
  searchParams,
}: {
  searchParams?: Promise<{ id?: string }>
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const currentId = (resolvedParams.id || "KP-0001").trim();

  let trainee: any = null;
  let allTrainees: any[] = [];
  let employmentRecord: IEmploymentRecord | null = null;
  let dbError: string | null = null;

  try {
    await connectToDatabase();

    allTrainees = await Trainee.find().sort({ traineeId: 1 }).lean();

    trainee = await Trainee.findOne({
      traineeId: currentId,
    }).lean();

    // Fallback to first trainee if requested id is not found
    if (!trainee && allTrainees.length > 0) {
      trainee = allTrainees[0];
    }

    if (trainee) {
      employmentRecord = (await EmploymentRecord.findOne({
        traineeId: trainee.traineeId,
        isCurrent: true,
      }).lean()) as IEmploymentRecord | null;
    }
  } catch (err) {
    dbError = err instanceof Error ? err.message : "Database connection failed";
  }

  if (dbError || !trainee) {
    return (
      <AppShell>
        <PageHeader
          eyebrow="Trainee"
          title="Trainee Outcome Passport"
          description="A single, verifiable record that follows a trainee across the entire journey."
        />
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Card className="border-border">
            <CardContent className="flex flex-col items-center justify-center gap-2 p-8 text-center">
              <AlertTriangle className="size-8 text-warning" />
              <p className="text-sm font-semibold">{dbError ? "Database Connection Unavailable" : "Trainee Record Not Found"}</p>
              <p className="max-w-md text-xs text-muted-foreground">
                {dbError || `No record found for trainee ID '${currentId}'. Please ensure database is seeded.`}
              </p>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  const isVerified = employmentRecord?.verificationStatus === "verified";
  const isPendingVerification = employmentRecord?.verificationStatus === "pending";
  const isDisputed = employmentRecord?.verificationStatus === "disputed" || employmentRecord?.verificationStatus === "flagged";

  const relevanceInfo = employmentRecord?.trainingRelevance
    ? relevanceLabels[employmentRecord.trainingRelevance] || relevanceLabels.directly_related
    : null;

  const formattedStartDate = employmentRecord?.startDate
    ? new Date(employmentRecord.startDate).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      })
    : "Recent";

  const journey = [
    {
      step: "Training completed",
      date: "Completed",
      detail: `${trainee.course} vocational training completed`,
      status: "complete" as const,
    },
    {
      step: "Certification",
      date: "Certified",
      detail: "NSQF Level 4 assessment certified",
      status: "complete" as const,
    },
    {
      step: "Placement",
      date: employmentRecord ? formattedStartDate : "Pending",
      detail: employmentRecord
        ? `Placed at ${employmentRecord.employerName} (${employmentRecord.jobRole})`
        : "Awaiting campus placement",
      status: employmentRecord ? ("complete" as const) : ("pending" as const),
    },
    {
      step: "Employment Verification",
      date: isVerified ? "Confirmed" : isDisputed ? "Disputed" : isPendingVerification ? "In review" : "Upcoming",
      detail: isVerified
        ? `Verified by ${employmentRecord?.verificationMetadata?.verifiedBy || 'Employer'}`
        : isPendingVerification
        ? "Pending employer confirmation"
        : isDisputed
        ? `Verification disputed${employmentRecord?.verificationMetadata?.disputeReason ? `: ${employmentRecord.verificationMetadata.disputeReason}` : ''}`
        : "Verification not initiated",
      status: isVerified ? ("complete" as const) : ("pending" as const),
    },
    {
      step: "Wage & Outcome Tracking",
      date: employmentRecord ? "Active" : "Upcoming",
      detail: employmentRecord
        ? `${inr(employmentRecord.monthlyWage)}/mo · ${employmentRecord.employmentType.replace(/_/g, ' ')}`
        : "Wage tracking initiates upon placement",
      status: isVerified ? ("complete" as const) : ("pending" as const),
    },
  ];

  const t = {
    photoInitials: trainee.name
      .split(" ")
      .map((part: string) => part[0])
      .join(""),
    name: trainee.name,
    id: trainee.traineeId,
    district: trainee.district,
    course: trainee.course,
    provider: "Maharashtra State Skill Development Society",
    journey,
    skills: [trainee.course, "Wiring & Diagnostics", "Safety Standards", "Digital Tools"],
    employer: employmentRecord ? employmentRecord.employerName : "Not placed yet",
    jobRole: employmentRecord?.jobRole,
    wage: employmentRecord?.monthlyWage,
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Trainee"
        title="Trainee Outcome Passport"
        description="A single, verifiable record that follows a trainee across the entire journey — training, certification, placement, wages, and retention."
      />

      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Trainee Switcher (for demo evaluation) */}
        {allTrainees.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-2 text-xs">
            <span className="font-semibold text-muted-foreground px-2">Select Trainee Passport:</span>
            {allTrainees.map((tr) => {
              const active = tr.traineeId === trainee.traineeId;
              return (
                <Link
                  key={tr.traineeId}
                  href={`/trainee?id=${tr.traineeId}`}
                  className={cn(
                    'rounded-md px-3 py-1 font-medium transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {tr.name} ({tr.traineeId})
                </Link>
              );
            })}
          </div>
        )}

        {/* Identity */}
        <Card>
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-primary text-lg font-semibold text-primary-foreground">
              {t.photoInitials}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold">{t.name}</h2>
                {isVerified ? (
                  <Badge variant="success">
                    <BadgeCheck className="size-3" aria-hidden="true" /> Verified Outcome
                  </Badge>
                ) : isPendingVerification ? (
                  <Badge variant="warning">
                    <Clock className="size-3" aria-hidden="true" /> Verification Pending
                  </Badge>
                ) : isDisputed ? (
                  <Badge variant="destructive">
                    <AlertTriangle className="size-3" aria-hidden="true" /> Verification Flagged
                  </Badge>
                ) : (
                  <Badge variant="neutral">Enrolled</Badge>
                )}
                {relevanceInfo && (
                  <Badge variant={relevanceInfo.variant}>
                    {relevanceInfo.label}
                  </Badge>
                )}
              </div>
              <p className="font-mono text-xs text-muted-foreground">{t.id}</p>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5" aria-hidden="true" /> {t.district}
                </span>
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="size-3.5" aria-hidden="true" /> {t.course}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="size-3.5" aria-hidden="true" /> {t.provider}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Journey timeline */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Outcome journey</CardTitle>
              <CardDescription>
                Training → Certification → Placement → Employment Verification → Wage Progression
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="relative flex flex-col gap-6 pl-2">
                {t.journey.map((j, i) => {
                  const done = j.status === 'complete'
                  return (
                    <li key={j.step} className="relative flex gap-4">
                      {/* connector */}
                      {i < t.journey.length - 1 ? (
                        <span
                          className="absolute left-[13px] top-7 h-full w-px bg-border"
                          aria-hidden="true"
                        />
                      ) : null}
                      <span
                        className={cn(
                          'z-10 flex size-7 shrink-0 items-center justify-center rounded-full',
                          done
                            ? 'bg-success/15 text-success'
                            : 'bg-warning/15 text-warning',
                        )}
                      >
                        {done ? (
                          <Check className="size-4" aria-hidden="true" />
                        ) : (
                          <Clock className="size-4" aria-hidden="true" />
                        )}
                      </span>
                      <div className="flex flex-1 flex-col gap-0.5 pb-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-medium">{j.step}</span>
                          <span className="text-xs text-muted-foreground">{j.date}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{j.detail}</span>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </CardContent>
          </Card>

          {/* Side: skills + employer */}
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Certified skills</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {t.skills.map((s) => (
                  <Badge key={s} variant="neutral">
                    {s}
                  </Badge>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Current employer</CardTitle>
                <CardDescription>
                  {employmentRecord
                    ? 'Connected database outcome record'
                    : 'Awaiting placement confirmation'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Building2 className="size-5" aria-hidden="true" />
                  </span>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{t.employer}</p>
                    {t.jobRole && (
                      <p className="text-xs text-muted-foreground">{t.jobRole}</p>
                    )}
                    {relevanceInfo && (
                      <div className="mt-1">
                        <Badge variant={relevanceInfo.variant} className="text-[11px]">
                          {relevanceInfo.label}
                        </Badge>
                      </div>
                    )}
                    {employmentRecord && (
                      <div className="mt-1 flex items-center gap-2">
                        {isVerified ? (
                          <p className="text-xs font-medium text-success">
                            Verified · {inr(employmentRecord.monthlyWage)}/mo
                          </p>
                        ) : isPendingVerification ? (
                          <p className="text-xs font-medium text-warning">
                            Pending confirmation · {inr(employmentRecord.monthlyWage)}/mo
                          </p>
                        ) : isDisputed ? (
                          <p className="text-xs font-medium text-destructive">
                            Disputed · {inr(employmentRecord.monthlyWage)}/mo
                          </p>
                        ) : (
                          <p className="text-xs font-medium text-destructive">
                            Status: {employmentRecord.verificationStatus}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
