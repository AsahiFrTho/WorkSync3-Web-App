import { Check, Clock, MapPin, GraduationCap, Building2, BadgeCheck } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { connectToDatabase } from '@/lib/mongodb'
import Trainee from '@/models/trainee'
import { cn } from '@/lib/utils'

export default async function TraineePage() {
  await connectToDatabase();

  const trainee = await Trainee.findOne({
    traineeId: "KP-0001",
  }).lean();

  if (!trainee) {
    return <p className="p-6">Trainee record not found.</p>;
  }

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
    journey: [
      {
        step: "Training completed",
        date: "Demo record",
        detail: `${trainee.course} training completed`,
        status: "complete",
      },
      {
        step: "Employment",
        date: "Current record",
        detail: `Status: ${trainee.status}`,
        status: trainee.status === "employed" ? "complete" : "pending",
      },
    ],
    skills: [trainee.course],
    employer: trainee.status === "employed" ? "Employer to be added" : "Not placed yet",
  };
  return (
    <AppShell>
      <PageHeader
        eyebrow="Trainee"
        title="Trainee Outcome Passport"
        description="A single, verifiable record that follows a trainee across the entire journey — training, certification, placement, wages, and retention."
      />

      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Identity */}
        <Card>
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-primary text-lg font-semibold text-primary-foreground">
              {t.photoInitials}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold">{t.name}</h2>
                <Badge variant="success">
                  <BadgeCheck className="size-3" aria-hidden="true" /> Verified
                </Badge>
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
                Training → Certification → Placement → Employment → Wage progression → Retention
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
                <CardDescription>Confirmed via employer verification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Building2 className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{t.employer}</p>
                    <p className="text-xs text-success">Employment verified</p>
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
