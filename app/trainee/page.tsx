import { Check, Clock, MapPin, GraduationCap, Building2, BadgeCheck, AlertTriangle, Award, ShieldCheck, Calendar, TrendingUp, CheckCircle2, XCircle, FileText } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { connectToDatabase } from '@/lib/mongodb'
import Trainee, { type ITrainee } from '@/models/trainee'
import EmploymentRecord, { type IEmploymentRecord } from '@/models/employment-record'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { CareerIntelligenceCard } from '@/components/trainee/career-intelligence-card'

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

const milestoneLabels: Record<string, string> = {
  "30_day": "30-Day Retention",
  "90_day": "90-Day Retention",
  "180_day": "180-Day (6-Mo) Retention",
  "365_day": "365-Day (1-Yr) Retention",
}

const methodLabels: Record<string, string> = {
  employer_portal: "Employer Portal Verification",
  hr_call: "HR Telephonic Verification",
  offer_letter: "Offer Letter Submission",
  payslip: "Monthly Payslip Audit",
  pf_uan: "EPFO / UAN Confirmation",
}

export default async function TraineePage({
  searchParams,
}: {
  searchParams?: Promise<{ id?: string }>
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const currentId = (resolvedParams.id || "KP-0001").trim();

  let trainee: ITrainee | null = null;
  let allTrainees: ITrainee[] = [];
  let employmentRecord: IEmploymentRecord | null = null;
  let dbError: string | null = null;

  try {
    await connectToDatabase();

    allTrainees = (await Trainee.find().sort({ traineeId: 1 }).lean()) as ITrainee[];

    trainee = (await Trainee.findOne({
      traineeId: currentId,
    }).lean()) as ITrainee | null;

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

  const formatMonthYear = (d?: Date | string) => {
    if (!d) return null;
    const parsed = new Date(d);
    return isNaN(parsed.getTime())
      ? null
      : parsed.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  };

  const formatFullDate = (d?: Date | string) => {
    if (!d) return null;
    const parsed = new Date(d);
    return isNaN(parsed.getTime())
      ? null
      : parsed.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  };

  const formattedStartDate = employmentRecord?.startDate
    ? formatMonthYear(employmentRecord.startDate) || "Recent"
    : "Recent";

  const trainingStart = formatMonthYear(trainee.trainingPeriod?.startDate);
  const trainingEnd = formatMonthYear(trainee.trainingPeriod?.endDate);
  const trainingHours = trainee.trainingPeriod?.hours;

  const formattedTrainingPeriod =
    trainingStart && trainingEnd
      ? `${trainingStart} – ${trainingEnd}${trainingHours ? ` · ${trainingHours} hrs` : ''}`
      : trainingHours
      ? `${trainingHours} hrs completed`
      : "Training completed";

  const formattedCertDate = trainee.certificate?.issueDate
    ? formatFullDate(trainee.certificate.issueDate)
    : null;

  const providerName = trainee.trainingProvider || "Maharashtra State Skill Development Society";

  // Verification metadata
  const verifiedAtStr = formatFullDate(employmentRecord?.verificationMetadata?.verifiedAt);
  const verificationMethod = employmentRecord?.verificationMetadata?.method;
  const methodLabel = verificationMethod ? (methodLabels[verificationMethod] || verificationMethod.replace(/_/g, " ")) : "Employer Portal Verification";
  const verifiedByStr = employmentRecord?.verificationMetadata?.verifiedBy;
  const employerRemarks = employmentRecord?.verificationMetadata?.remarks;
  const disputeReasonStr = employmentRecord?.verificationMetadata?.disputeReason;

  // Follow-up retention and wage progression calculations
  const followUps = Array.isArray(employmentRecord?.followUps) ? employmentRecord.followUps : [];
  const startingWage = employmentRecord?.monthlyWage || 0;
  const completedFollowUps = followUps.filter((f) => f.status === "retained" && f.currentWage);
  const latestFollowUpWithWage = completedFollowUps.length > 0
    ? completedFollowUps[completedFollowUps.length - 1]
    : null;
  const latestWage = latestFollowUpWithWage?.currentWage || startingWage;
  const wageDiff = latestWage - startingWage;
  const wageGrowthPct = startingWage > 0 ? ((wageDiff / startingWage) * 100).toFixed(1) : "0";

  const journey = [
    {
      step: "Training completed",
      date: trainingEnd || "Completed",
      detail: `${trainee.course} (${formattedTrainingPeriod}) · ${providerName}`,
      status: "complete" as const,
    },
    {
      step: "Certification",
      date: formattedCertDate || "Certified",
      detail: trainee.certificate?.certificateId
        ? `NSQF Level ${trainee.certificate.nsqfLevel || 4} · ${trainee.certificate.certificateId} (${trainee.certificate.issuer || 'NCVET'})${trainee.certificate.grade ? ` · ${trainee.certificate.grade}` : ''}`
        : "NSQF Level 4 assessment certified",
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
      date: isVerified ? (verifiedAtStr || "Confirmed") : isDisputed ? "Disputed" : isPendingVerification ? "In review" : "Upcoming",
      detail: isVerified
        ? `Verified by ${verifiedByStr || 'Employer HR'}${verifiedAtStr ? ` on ${verifiedAtStr}` : ''} via ${methodLabel}${employerRemarks ? ` · "${employerRemarks}"` : ''}`
        : isPendingVerification
        ? "Pending employer confirmation on verification queue"
        : isDisputed
        ? `Verification disputed: ${disputeReasonStr || 'Disputed by employer'}${employerRemarks ? ` (${employerRemarks})` : ''}`
        : "Verification not initiated",
      status: isVerified ? ("complete" as const) : ("pending" as const),
    },
    {
      step: "Wage & Outcome Tracking",
      date: employmentRecord ? "Active" : "Upcoming",
      detail: employmentRecord
        ? `${inr(latestWage)}/mo · ${employmentRecord.employmentType.replace(/_/g, ' ')}${wageDiff > 0 ? ` (+${inr(wageDiff)} increment)` : ''}`
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
    provider: providerName,
    trainingPeriodStr: formattedTrainingPeriod,
    journey,
    skills: Array.isArray(trainee.skills) && trainee.skills.length > 0 ? trainee.skills : [],
    certificate: trainee.certificate,
    employer: employmentRecord ? employmentRecord.employerName : "Not placed yet",
    jobRole: employmentRecord?.jobRole,
    wage: latestWage,
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
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground/90">
                  <Calendar className="size-3.5" aria-hidden="true" /> {t.trainingPeriodStr}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Left Column: Journey Timeline + Post-Placement Retention */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Journey timeline Card */}
            <Card>
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

            {/* Post-Placement Retention & Career Outcome Card */}
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <TrendingUp className="size-4 text-primary" aria-hidden="true" />
                    Post-Placement Retention & Career Outcome
                  </CardTitle>
                  <CardDescription>
                    Longitudinal verification milestones at 30, 90, 180, and 365 days
                  </CardDescription>
                </div>
                {/* Wage Progression Indicator */}
                {startingWage > 0 && (
                  <div className="flex items-center gap-2 rounded-lg border border-border/80 bg-muted/40 px-3 py-1.5 text-xs">
                    <span className="text-muted-foreground">Wage Progression:</span>
                    {wageDiff > 0 ? (
                      <div className="flex items-center gap-1 font-semibold text-success">
                        <span>{inr(startingWage)}</span>
                        <span>→</span>
                        <span>{inr(latestWage)}</span>
                        <Badge variant="success" className="ml-1 text-[10px] py-0 px-1.5">
                          +{inr(wageDiff)} (+{wageGrowthPct}%)
                        </Badge>
                      </div>
                    ) : (
                      <span className="font-semibold text-foreground">{inr(startingWage)}/mo</span>
                    )}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {followUps.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {followUps.map((f, idx) => {
                      const isRetained = f.status === "retained" || f.status === "wage_increased";
                      const isLeft = f.status === "left_job";
                      const isPending = f.status === "pending";
                      const completedDateStr = formatMonthYear(f.completedDate);
                      const dueDateStr = formatMonthYear(f.dueDate);

                      return (
                        <div
                          key={f.milestone || idx}
                          className={cn(
                            "flex flex-col justify-between rounded-lg border p-3 text-xs transition-colors",
                            isRetained
                              ? "border-success/30 bg-success/5"
                              : isLeft
                              ? "border-destructive/30 bg-destructive/5"
                              : "border-border/70 bg-card"
                          )}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="font-semibold text-foreground">
                              {milestoneLabels[f.milestone] || f.milestone.replace(/_/g, " ")}
                            </span>
                            {isRetained ? (
                              <Badge variant="success" className="text-[10px] py-0">
                                <CheckCircle2 className="size-2.5 mr-0.5" /> Retained
                              </Badge>
                            ) : isLeft ? (
                              <Badge variant="destructive" className="text-[10px] py-0">
                                <XCircle className="size-2.5 mr-0.5" /> Discontinued
                              </Badge>
                            ) : (
                              <Badge variant="neutral" className="text-[10px] py-0">
                                <Clock className="size-2.5 mr-0.5" /> In Progress
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-col gap-1 text-muted-foreground mt-1">
                            {isRetained && (
                              <>
                                <div className="flex items-center justify-between">
                                  <span>Verified Wage:</span>
                                  <span className="font-semibold text-foreground">
                                    {f.currentWage ? `${inr(f.currentWage)}/mo` : `${inr(startingWage)}/mo`}
                                  </span>
                                </div>
                                {completedDateStr && (
                                  <div className="flex items-center justify-between text-[11px]">
                                    <span>Verified On:</span>
                                    <span>{completedDateStr}</span>
                                  </div>
                                )}
                                {f.notes && (
                                  <p className="mt-1 text-[11px] text-muted-foreground/90 italic">
                                    &ldquo;{f.notes}&rdquo;
                                  </p>
                                )}
                              </>
                            )}

                            {isLeft && (
                              <>
                                <p className="text-destructive text-[11px] font-medium">
                                  {f.notes || "Candidate did not join or left role"}
                                </p>
                                {dueDateStr && (
                                  <span className="text-[11px]">Milestone date: {dueDateStr}</span>
                                )}
                              </>
                            )}

                            {isPending && (
                              <>
                                <div className="flex items-center justify-between">
                                  <span>Tracking Status:</span>
                                  <span className="text-muted-foreground font-medium">Scheduled</span>
                                </div>
                                {dueDateStr && (
                                  <div className="flex items-center justify-between text-[11px]">
                                    <span>Target Due Date:</span>
                                    <span>{dueDateStr}</span>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-6 text-center text-xs text-muted-foreground">
                    <p>Post-placement retention tracking activates upon employer verification.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Career Intelligence Section */}
            <CareerIntelligenceCard traineeId={trainee.traineeId} />
          </div>

          {/* Right Column: Credential + Skills + Employer */}
          <div className="flex flex-col gap-6">
            {/* Credential / Certificate Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <ShieldCheck className="size-4 text-success" aria-hidden="true" />
                  Verified Credential
                </CardTitle>
                <CardDescription>
                  Government-recognized qualification certificate
                </CardDescription>
              </CardHeader>
              <CardContent>
                {t.certificate?.certificateId ? (
                  <div className="flex flex-col gap-2 text-xs">
                    <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                      <span className="text-muted-foreground">Certificate ID</span>
                      <span className="font-mono font-medium text-foreground">{t.certificate.certificateId}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                      <span className="text-muted-foreground">Framework Level</span>
                      <Badge variant="neutral" className="text-[11px]">
                        NSQF Level {t.certificate.nsqfLevel || 4}
                      </Badge>
                    </div>
                    {t.certificate.issuer && (
                      <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                        <span className="text-muted-foreground">Issuing Body</span>
                        <span className="font-medium text-right text-foreground">{t.certificate.issuer}</span>
                      </div>
                    )}
                    {t.certificate.grade && (
                      <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                        <span className="text-muted-foreground">Grade</span>
                        <Badge variant="success" className="text-[11px]">
                          {t.certificate.grade}
                        </Badge>
                      </div>
                    )}
                    {formattedCertDate && (
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-muted-foreground">Issue Date</span>
                        <span className="text-muted-foreground">{formattedCertDate}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Certificate information pending issuance</p>
                )}
              </CardContent>
            </Card>

            {/* Certified Skills Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Award className="size-4 text-primary" aria-hidden="true" />
                  Certified skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                {t.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {t.skills.map((s: string) => (
                      <Badge key={s} variant="neutral">
                        {s}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No certified skills listed</p>
                )}
              </CardContent>
            </Card>

            {/* Current Employer & Verification Evidence Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Current employer</CardTitle>
                <CardDescription>
                  {employmentRecord
                    ? 'Connected database outcome record'
                    : 'Awaiting placement confirmation'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
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
                            Verified · {inr(latestWage)}/mo
                          </p>
                        ) : isPendingVerification ? (
                          <p className="text-xs font-medium text-warning">
                            Pending confirmation · {inr(startingWage)}/mo
                          </p>
                        ) : isDisputed ? (
                          <p className="text-xs font-medium text-destructive">
                            Disputed · {inr(startingWage)}/mo
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

                {/* Verification Evidence Audit Block */}
                {employmentRecord && (
                  <div className={cn(
                    "mt-2 flex flex-col gap-2 rounded-lg border p-3 text-xs",
                    isVerified
                      ? "border-success/30 bg-success/5"
                      : isDisputed
                      ? "border-destructive/30 bg-destructive/5"
                      : "border-warning/30 bg-warning/5"
                  )}>
                    <div className="flex items-center justify-between border-b border-border/50 pb-1.5">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        {isVerified ? (
                          <>
                            <BadgeCheck className="size-3.5 text-success" />
                            <span>Employer Verification Evidence</span>
                          </>
                        ) : isDisputed ? (
                          <>
                            <AlertTriangle className="size-3.5 text-destructive" />
                            <span>Verification Disputed</span>
                          </>
                        ) : (
                          <>
                            <Clock className="size-3.5 text-warning" />
                            <span>Verification In Progress</span>
                          </>
                        )}
                      </span>
                      {isVerified ? (
                        <Badge variant="success" className="text-[10px] py-0">Verified</Badge>
                      ) : isDisputed ? (
                        <Badge variant="destructive" className="text-[10px] py-0">Disputed</Badge>
                      ) : (
                        <Badge variant="warning" className="text-[10px] py-0">Pending</Badge>
                      )}
                    </div>

                    {isVerified && (
                      <div className="flex flex-col gap-1 text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>Verified By:</span>
                          <span className="font-medium text-foreground">{verifiedByStr || "Employer HR"}</span>
                        </div>
                        {verifiedAtStr && (
                          <div className="flex items-center justify-between text-[11px]">
                            <span>Verified On:</span>
                            <span className="text-foreground">{verifiedAtStr}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-[11px]">
                          <span>Method:</span>
                          <span className="text-foreground">{methodLabel}</span>
                        </div>
                        {employerRemarks && (
                          <div className="mt-1 rounded bg-card/80 p-2 text-[11px] text-foreground italic border border-border/50">
                            &ldquo;{employerRemarks}&rdquo;
                          </div>
                        )}
                      </div>
                    )}

                    {isDisputed && (
                      <div className="flex flex-col gap-1 text-muted-foreground">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-destructive">Dispute Reason:</span>
                          <span className="text-foreground">{disputeReasonStr || "Trainee did not join on scheduled date"}</span>
                        </div>
                        {employerRemarks && (
                          <div className="mt-1 rounded bg-card/80 p-2 text-[11px] text-foreground italic border border-destructive/20">
                            &ldquo;{employerRemarks}&rdquo;
                          </div>
                        )}
                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <span>Channel:</span>
                          <span className="text-foreground">{methodLabel}</span>
                        </div>
                      </div>
                    )}

                    {isPendingVerification && (
                      <div className="flex flex-col gap-1 text-muted-foreground">
                        <p className="text-[11px] text-muted-foreground">
                          Awaiting confirmation on the employer verification queue.
                        </p>
                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <span>Verification Channel:</span>
                          <span className="text-foreground">{methodLabel}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}



