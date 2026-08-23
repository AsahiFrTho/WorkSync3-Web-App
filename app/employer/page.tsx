import { BadgeCheck, Clock, AlertTriangle } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { employerVerifications, inr } from '@/lib/mock-data'
import { Users, ShieldCheck, TimerReset } from 'lucide-react'

const statusMeta = {
  verified: { label: 'Verified', variant: 'success' as const, Icon: BadgeCheck },
  pending: { label: 'Pending', variant: 'warning' as const, Icon: Clock },
  flagged: { label: 'Needs review', variant: 'destructive' as const, Icon: AlertTriangle },
}

export default function EmployerPage() {
  const verified = employerVerifications.filter((e) => e.status === 'verified').length
  const pending = employerVerifications.filter((e) => e.status === 'pending').length

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
            value={String(employerVerifications.length)}
            sublabel="Confirmations this quarter"
            icon={Users}
          />
          <StatCard
            label="Verified"
            value={String(verified)}
            sublabel="Employment confirmed"
            icon={ShieldCheck}
          />
          <StatCard
            label="Awaiting action"
            value={String(pending)}
            sublabel="Pending employer response"
            icon={TimerReset}
          />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Verification queue</CardTitle>
            <CardDescription>Confirm employment against each Outcome Passport</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {employerVerifications.map((e) => {
              const meta = statusMeta[e.status]
              const Icon = meta.Icon
              return (
                <div
                  key={e.id}
                  className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">{e.trainee}</span>
                      <Badge variant={meta.variant}>
                        <Icon className="size-3" aria-hidden="true" /> {meta.label}
                      </Badge>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground">{e.passportId}</p>
                    <p className="text-xs text-muted-foreground">
                      {e.course} · {e.provider} · Joined {e.joinDate} · {inr(e.wage)}/mo
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {e.status === 'verified' ? (
                      <Button variant="outline" size="sm" disabled>
                        Confirmed
                      </Button>
                    ) : (
                      <>
                        <Button variant="outline" size="sm">
                          Dispute
                        </Button>
                        <Button size="sm">Confirm employment</Button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
