import { Check, Clock, MapPin, GraduationCap, Building2, BadgeCheck, AlertTriangle, Award, ShieldCheck, Calendar, TrendingUp, CheckCircle2, XCircle } from 'lucide-react'
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
          <Card className="border-slate-200 bg-white shadow-xs">
            <CardContent className="flex flex-col items-center justify-center gap-2 p-8 text-center">
              <AlertTriangle className="size-8 text-amber-700" />
              <p className="text-base font-bold text-slate-950">
                {dbError ? "Database Connection Unavailable" : "Trainee Record Not Found"}
              </p>
              <p className="max-w-md text-xs font-medium text-slate-600">
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
        {/* Trainee Switcher */}
        {allTrainees.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-xs shadow-xs">
            <span className="font-bold uppercase tracking-wider text-slate-600 px-1">
              Candidate Passport:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {allTrainees.map((tr) => {
                const active = tr.traineeId === trainee.traineeId;
                return (
                  <Link
                    key={tr.traineeId}
                    href={`/trainee?id=${tr.traineeId}`}
                    className={cn(
                      'rounded-lg px-3 py-1.5 font-bold transition-all',
                      active
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    )}
                  >
                    {tr.name} ({tr.traineeId})
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Identity Card */}
        <Card className="border border-slate-200 bg-white shadow-xs">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-xl font-black text-white shadow-xs">
              {t.photoInitials}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black text-slate-950">{t.name}</h2>
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
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {t.id}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-blue-700" aria-hidden="true" /> {t.district}
                </span>
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="size-3.5 text-blue-700" aria-hidden="true" /> {t.course}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="size-3.5 text-blue-700" aria-hidden="true" /> {t.provider}
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <Calendar className="size-3.5 text-slate-500" aria-hidden="true" /> {t.trainingPeriodStr}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Outcome Journey Timeline */}
            <Card className="border border-slate-200 bg-white shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-950">Outcome Journey</CardTitle>
                <CardDescription className="text-xs text-slate-600">
                  Training → Certification → Placement → Employment Verification → Wage Progression
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="relative flex flex-col gap-6 pl-2">
                  {t.journey.map((j, i) => {
                    const done = j.status === 'complete'
                    return (
                      <li key={j.step} className="relative flex gap-4">
                        {i < t.journey.length - 1 ? (
                          <span
                            className="absolute left-[13px] top-7 h-full w-px bg-slate-200"
                            aria-hidden="true"
                          />
                        ) : null}
                        <span
                          className={cn(
                            'z-10 flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold shadow-2xs',
                            done
                              ? 'border-emerald-300 bg-emerald-100 text-emerald-800'
                              : 'border-amber-300 bg-amber-100 text-amber-800',
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
                            <span className="text-sm font-bold text-slate-950">{j.step}</span>
                            <span className="text-xs font-bold text-slate-600">{j.date}</span>
                          </div>
                          <span className="text-xs font-medium text-slate-700 leading-relaxed">{j.detail}</span>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </CardContent>
            </Card>

            {/* Post-Placement Retention Card */}
            <Card className="border border-slate-200 bg-white shadow-xs">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-950">
                    <TrendingUp className="size-4.5 text-blue-700" aria-hidden="true" />
                    Post-Placement Retention & Career Outcome
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-600">
                    Longitudinal outcome milestones at 30, 90, 180, and 365 days
                  </CardDescription>
                </div>
                {/* Wage Progression Indicator */}
                {startingWage > 0 && (
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-1.5 text-xs">
                    <span className="font-bold text-slate-700">Wage Progression:</span>
                    {wageDiff > 0 ? (
                      <div className="flex items-center gap-1 font-bold text-emerald-800">
                        <span>{inr(startingWage)}</span>
                        <span>→</span>
                        <span>{inr(latestWage)}</span>
                        <Badge variant="success" className="ml-1 text-[10px] py-0 px-1.5 font-bold">
                          +{inr(wageDiff)} (+{wageGrowthPct}%)
                        </Badge>
                      </div>
                    ) : (
                      <span className="font-bold text-slate-950">{inr(startingWage)}/mo</span>
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
                            "flex flex-col justify-between rounded-xl border p-3.5 text-xs transition-colors",
                            isRetained
                              ? "border-emerald-200 bg-emerald-50/70"
                              : isLeft
                              ? "border-rose-200 bg-rose-50/70"
                              : "border-slate-200 bg-slate-50/80"
                          )}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="font-bold text-slate-950">
                              {milestoneLabels[f.milestone] || f.milestone.replace(/_/g, " ")}
                            </span>
                            {isRetained ? (
                              <Badge variant="success" className="text-[10px] py-0 font-bold">
                                <CheckCircle2 className="size-2.5 mr-0.5" /> Retained
                              </Badge>
                            ) : isLeft ? (
                              <Badge variant="destructive" className="text-[10px] py-0 font-bold">
                                <XCircle className="size-2.5 mr-0.5" /> Discontinued
                              </Badge>
                            ) : (
                              <Badge variant="neutral" className="text-[10px] py-0 font-bold">
                                <Clock className="size-2.5 mr-0.5" /> In Progress
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-col gap-1 text-slate-700 font-medium mt-1">
                            {isRetained && (
                              <>
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-600 font-semibold">Verified Wage:</span>
                                  <span className="font-bold text-slate-950">
                                    {f.currentWage ? `${inr(f.currentWage)}/mo` : `${inr(startingWage)}/mo`}
                                  </span>
                                </div>
                                {completedDateStr && (
                                  <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-slate-500">Verified On:</span>
                                    <span className="font-semibold text-slate-800">{completedDateStr}</span>
                                  </div>
                                )}
                                {f.notes && (
                                  <p className="mt-1 text-[11px] text-slate-700 italic">
                                    &ldquo;{f.notes}&rdquo;
                                  </p>
                                )}
                              </>
                            )}

                            {isLeft && (
                              <>
                                <p className="text-rose-900 text-[11px] font-bold">
                                  {f.notes || "Candidate did not join or left role"}
                                </p>
                                {dueDateStr && (
                                  <span className="text-[11px] text-slate-600">Milestone date: {dueDateStr}</span>
                                )}
                              </>
                            )}

                            {isPending && (
                              <>
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-600">Tracking Status:</span>
                                  <span className="text-slate-800 font-bold">Scheduled</span>
                                </div>
                                {dueDateStr && (
                                  <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-slate-500">Target Due Date:</span>
                                    <span className="font-semibold text-slate-800">{dueDateStr}</span>
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
                  <div className="flex items-center justify-center p-6 text-center text-xs font-semibold text-slate-600">
                    <p>Post-placement retention tracking activates upon employer verification.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Career Intelligence Section */}
            <CareerIntelligenceCard traineeId={trainee.traineeId} />
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Verified Credential Card */}
            <Card className="border border-slate-200 bg-white shadow-xs">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-bold text-slate-950">
                  <ShieldCheck className="size-4.5 text-emerald-700" aria-hidden="true" />
                  Verified Credential
                </CardTitle>
                <CardDescription className="text-xs text-slate-600">
                  Government-recognized qualification certificate
                </CardDescription>
              </CardHeader>
              <CardContent>
                {t.certificate?.certificateId ? (
                  <div className="flex flex-col gap-2.5 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-bold text-slate-600">Certificate ID</span>
                      <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {t.certificate.certificateId}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-bold text-slate-600">Framework Level</span>
                      <Badge variant="neutral" className="text-[11px] font-bold">
                        NSQF Level {t.certificate.nsqfLevel || 4}
                      </Badge>
                    </div>
                    {t.certificate.issuer && (
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-600">Issuing Body</span>
                        <span className="font-bold text-right text-slate-950">{t.certificate.issuer}</span>
                      </div>
                    )}
                    {t.certificate.grade && (
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-600">Grade</span>
                        <Badge variant="success" className="text-[11px] font-bold">
                          {t.certificate.grade}
                        </Badge>
                      </div>
                    )}
                    {formattedCertDate && (
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="font-bold text-slate-600">Issue Date</span>
                        <span className="font-semibold text-slate-800">{formattedCertDate}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs font-medium text-slate-600">Certificate information pending issuance</p>
                )}
              </CardContent>
            </Card>

            {/* Certified Skills Card */}
            <Card className="border border-slate-200 bg-white shadow-xs">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-bold text-slate-950">
                  <Award className="size-4.5 text-blue-700" aria-hidden="true" />
                  Certified Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                {t.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {t.skills.map((s: string) => (
                      <Badge key={s} variant="neutral" className="px-2.5 py-1 text-xs font-bold">
                        {s}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs font-medium text-slate-600">No certified skills listed</p>
                )}
              </CardContent>
            </Card>

            {/* Current Employer Card */}
            <Card className="border border-slate-200 bg-white shadow-xs">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-slate-950">Current Employer</CardTitle>
                <CardDescription className="text-xs text-slate-600">
                  {employmentRecord
                    ? 'Connected database outcome record'
                    : 'Awaiting placement confirmation'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-700 shadow-2xs">
                    <Building2 className="size-5" aria-hidden="true" />
                  </span>
                  <div className="flex flex-col">
                    <p className="text-sm font-bold text-slate-950">{t.employer}</p>
                    {t.jobRole && (
                      <p className="text-xs font-medium text-slate-700">{t.jobRole}</p>
                    )}
                    {relevanceInfo && (
                      <div className="mt-1">
                        <Badge variant={relevanceInfo.variant} className="text-[11px] font-bold">
                          {relevanceInfo.label}
                        </Badge>
                      </div>
                    )}
                    {employmentRecord && (
                      <div className="mt-1 flex items-center gap-2">
                        {isVerified ? (
                          <p className="text-xs font-bold text-emerald-800">
                            Verified · {inr(latestWage)}/mo
                          </p>
                        ) : isPendingVerification ? (
                          <p className="text-xs font-bold text-amber-800">
                            Pending confirmation · {inr(startingWage)}/mo
                          </p>
                        ) : isDisputed ? (
                          <p className="text-xs font-bold text-rose-800">
                            Disputed · {inr(startingWage)}/mo
                          </p>
                        ) : (
                          <p className="text-xs font-bold text-slate-700">
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
                    "mt-2 flex flex-col gap-2 rounded-xl border p-3.5 text-xs",
                    isVerified
                      ? "border-emerald-200 bg-emerald-50/80"
                      : isDisputed
                      ? "border-rose-200 bg-rose-50/80"
                      : "border-amber-200 bg-amber-50/80"
                  )}>
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                      <span className="font-bold text-slate-950 flex items-center gap-1.5">
                        {isVerified ? (
                          <>
                            <BadgeCheck className="size-3.5 text-emerald-700" />
                            <span>Employer Verification Evidence</span>
                          </>
                        ) : isDisputed ? (
                          <>
                            <AlertTriangle className="size-3.5 text-rose-700" />
                            <span>Verification Disputed</span>
                          </>
                        ) : (
                          <>
                            <Clock className="size-3.5 text-amber-700" />
                            <span>Verification In Progress</span>
                          </>
                        )}
                      </span>
                      {isVerified ? (
                        <Badge variant="success" className="text-[10px] py-0 font-bold">Verified</Badge>
                      ) : isDisputed ? (
                        <Badge variant="destructive" className="text-[10px] py-0 font-bold">Disputed</Badge>
                      ) : (
                        <Badge variant="warning" className="text-[10px] py-0 font-bold">Pending</Badge>
                      )}
                    </div>

                    {isVerified && (
                      <div className="flex flex-col gap-1 text-slate-700 font-medium">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Verified By:</span>
                          <span className="font-bold text-slate-950">{verifiedByStr || "Employer HR"}</span>
                        </div>
                        {verifiedAtStr && (
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-600">Verified On:</span>
                            <span className="font-bold text-slate-950">{verifiedAtStr}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-600">Method:</span>
                          <span className="font-bold text-slate-950">{methodLabel}</span>
                        </div>
                        {employerRemarks && (
                          <div className="mt-1 rounded-md bg-white p-2 text-[11px] font-semibold text-slate-800 italic border border-emerald-200">
                            &ldquo;{employerRemarks}&rdquo;
                          </div>
                        )}
                      </div>
                    )}

                    {isDisputed && (
                      <div className="flex flex-col gap-1 text-slate-700 font-medium">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-rose-950">Dispute Reason:</span>
                          <span className="font-semibold text-slate-900">{disputeReasonStr || "Trainee did not join on scheduled date"}</span>
                        </div>
                        {employerRemarks && (
                          <div className="mt-1 rounded-md bg-white p-2 text-[11px] font-semibold text-slate-800 italic border border-rose-200">
                            &ldquo;{employerRemarks}&rdquo;
                          </div>
                        )}
                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <span className="text-slate-600">Channel:</span>
                          <span className="font-bold text-slate-950">{methodLabel}</span>
                        </div>
                      </div>
                    )}

                    {isPendingVerification && (
                      <div className="flex flex-col gap-1 text-slate-700 font-medium">
                        <p className="text-[11px] text-slate-700">
                          Awaiting confirmation on the employer verification queue.
                        </p>
                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <span className="text-slate-600">Verification Channel:</span>
                          <span className="font-bold text-slate-950">{methodLabel}</span>
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
