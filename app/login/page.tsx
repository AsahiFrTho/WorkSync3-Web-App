'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Building2,
  GraduationCap,
  Briefcase,
  IdCard,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Users,
  Sparkles,
  Info,
  Check,
  TrendingUp,
  Award,
  Layers,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { summary, inr, compact } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface RoleOption {
  id: string
  title: string
  marathiTitle: string
  category: string
  targetHref: string
  icon: typeof Building2
  persona: {
    name: string
    designation: string
    organization: string
    location: string
  }
  description: string
  highlights: string[]
  badgeText: string
  primaryActionLabel: string
  accentColor: {
    bg: string
    border: string
    text: string
    badgeBg: string
    badgeText: string
    activeBorder: string
    activeRing: string
  }
}

const roles: RoleOption[] = [
  {
    id: 'admin',
    title: 'Government / Administrator',
    marathiTitle: 'शासकीय / प्रशासक',
    category: 'State & District Directorate',
    targetHref: '/dashboard',
    icon: Building2,
    persona: {
      name: 'Dr. Sanjay Patil',
      designation: 'Director of Policy & Analytics',
      organization: 'Maharashtra State Skill Development Society (MSSDS)',
      location: 'Mantralaya, Mumbai',
    },
    description:
      'Statewide longitudinal outcomes, 12-district comparative analytics, certification-to-placement funnels, wage growth indices, and 6-month retention monitoring.',
    highlights: [
      'Executive KPI Funnel (Enrolled → Certified → Retained)',
      '12-District & Course-Wise Performance Benchmarks',
      'Longitudinal Wage Growth & 6-Month Retention Audits',
    ],
    badgeText: 'Executive Oversight',
    primaryActionLabel: 'Enter Administrator Portal',
    accentColor: {
      bg: 'bg-blue-100',
      border: 'border-blue-300',
      text: 'text-blue-800',
      badgeBg: 'bg-blue-100 border-blue-200',
      badgeText: 'text-blue-900',
      activeBorder: 'border-blue-600',
      activeRing: 'ring-2 ring-blue-500/30',
    },
  },
  {
    id: 'provider',
    title: 'Training Provider',
    marathiTitle: 'प्रशिक्षण संस्था',
    category: 'VTPs, ITIs & Implementing Agencies',
    targetHref: '/analytics',
    icon: GraduationCap,
    persona: {
      name: 'Sahyadri Vocational Institute',
      designation: 'Centre Head / Training Officer',
      organization: 'Affiliated to MSSDS (Pune & Nashik Centres)',
      location: 'Pune Center (96 Active VTPs)',
    },
    description:
      'Batch certification outcomes, skill gap diagnostics mapped against live employer demand, trade-wise placement rates, and candidate non-placement root causes.',
    highlights: [
      'Trade Skill-Gap Matrix vs. Industry Demand',
      'Course Placement Rates & Median Wage Metrics',
      'Dropout & Unplaced Trainee Diagnostic Signals',
    ],
    badgeText: 'Curriculum & Gaps',
    primaryActionLabel: 'Enter Provider Analytics',
    accentColor: {
      bg: 'bg-indigo-100',
      border: 'border-indigo-300',
      text: 'text-indigo-800',
      badgeBg: 'bg-indigo-100 border-indigo-200',
      badgeText: 'text-indigo-900',
      activeBorder: 'border-indigo-600',
      activeRing: 'ring-2 ring-indigo-500/30',
    },
  },
  {
    id: 'employer',
    title: 'Employer',
    marathiTitle: 'नियोक्ता / उद्योग भागीदार',
    category: 'Industry & Hiring Partners',
    targetHref: '/employer',
    icon: Briefcase,
    persona: {
      name: 'Deccan Electricals Pvt. Ltd.',
      designation: 'HR Operations & Talent Verification Cell',
      organization: 'Chakan Industrial Area, Pune',
      location: 'Manufacturing & Power Sector',
    },
    description:
      'Direct candidate employment confirmation, wage verification, 30/90/180-day retention milestone audits, and trade relevance validation.',
    highlights: [
      '1-Click Employment & Wage Record Confirmation',
      '30-Day, 90-Day & 180-Day Retention Milestones',
      'Direct Trade Alignment & Dispute Flagging',
    ],
    badgeText: 'Verification & Retention',
    primaryActionLabel: 'Enter Employer Portal',
    accentColor: {
      bg: 'bg-emerald-100',
      border: 'border-emerald-300',
      text: 'text-emerald-800',
      badgeBg: 'bg-emerald-100 border-emerald-200',
      badgeText: 'text-emerald-900',
      activeBorder: 'border-emerald-600',
      activeRing: 'ring-2 ring-emerald-500/30',
    },
  },
  {
    id: 'trainee',
    title: 'Trainee',
    marathiTitle: 'प्रशिक्षणार्थी उमेदवार',
    category: 'Certified Candidate & Alumni',
    targetHref: '/trainee',
    icon: IdCard,
    persona: {
      name: 'Rahul Pawar',
      designation: 'Trainee ID: KP-0001 (Electrician)',
      organization: 'Yashaswi Skill Academy, Pune',
      location: 'Employed at Deccan Electricals (₹16,800/mo)',
    },
    description:
      'Verifiable Trainee Outcome Passport, NSQF Level 4 certification records, verified multi-stage employment timeline, and AI Career Intelligence recommendations.',
    highlights: [
      'Verifiable Digital Outcome Passport (NSQF Level 4)',
      'Multi-Stage Retention & Monthly Wage Timeline',
      'AI Career Intelligence & Upskilling Pathways',
    ],
    badgeText: 'Outcome Passport',
    primaryActionLabel: 'Enter Trainee Passport',
    accentColor: {
      bg: 'bg-amber-100',
      border: 'border-amber-300',
      text: 'text-amber-800',
      badgeBg: 'bg-amber-100 border-amber-200',
      badgeText: 'text-amber-900',
      activeBorder: 'border-amber-600',
      activeRing: 'ring-2 ring-amber-500/30',
    },
  },
]

export default function LoginPage() {
  const router = useRouter()
  const [selectedRoleId, setSelectedRoleId] = useState<string>('admin')

  const selectedRole = roles.find((r) => r.id === selectedRoleId) ?? roles[0]

  const handleQuickLaunch = (targetHref: string) => {
    router.push(targetHref)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      {/* Top Government Banner */}
      <header className="border-b border-slate-200 bg-white shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white border border-slate-200 shadow-xs">
              <Image
                src="/favicon1.png"
                alt="KaushalPulse"
                width={40}
                height={40}
                className="size-full object-contain p-0.5"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-slate-950 sm:text-base">
                  KAUSHAL
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-xs font-semibold text-slate-700 sm:text-sm">
                  कौशल्य विकास व रोजगार विभाग
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600 sm:text-xs">
                Government of Maharashtra • Skilling Outcomes & Career Intelligence
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-900">
              <ShieldCheck className="size-3.5 text-blue-700" />
              <span>Official Demonstration Environment</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex size-14 items-center justify-center overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-1">
            <Image
              src="/favicon1.png"
              alt="KaushalPulse"
              width={56}
              height={56}
              className="size-full object-contain"
              priority
            />
          </div>

          <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-blue-300 bg-blue-100/90 px-4 py-1 text-xs font-bold text-blue-900 shadow-2xs">
            <Sparkles className="size-3.5 text-blue-700" />
            <span>Maharashtra Longitudinal Skilling Outcomes</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            KAUSHAL
          </h1>
          <p className="mt-1.5 text-lg font-bold tracking-tight text-blue-800 sm:text-xl">
            Skilling Outcomes & Career Intelligence
          </p>

          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-800 sm:text-lg">
            <span className="font-bold text-slate-950">
              &ldquo;From training completion to measurable career outcomes.&rdquo;
            </span>
          </p>

          <p className="mt-2 max-w-2xl text-xs leading-normal text-slate-700 sm:text-sm">
            Select a prototype role below to inspect verified training records, live wage progression,
            skill-gap analytics, and employer-validated retention milestones.
          </p>
        </div>

        {/* Platform Demonstration KPIs Bar (Using Real Mock Data) */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Tracked Trainees</span>
              <Users className="size-4 text-blue-700" />
            </div>
            <p className="mt-1 text-xl font-extrabold text-slate-950 sm:text-2xl">
              {compact(summary.totalTrainees)}
            </p>
            <p className="mt-0.5 text-xs font-medium text-slate-600">
              {summary.totalTrainees.toLocaleString('en-IN')} across {summary.activeDistricts} districts
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Employment Rate</span>
              <Briefcase className="size-4 text-emerald-700" />
            </div>
            <p className="mt-1 text-xl font-extrabold text-slate-950 sm:text-2xl">
              {summary.employmentRate}%
            </p>
            <p className="mt-0.5 text-xs font-medium text-slate-600">
              Cert. rate {summary.certificationRate}%
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">6-Mo Retention</span>
              <Award className="size-4 text-blue-700" />
            </div>
            <p className="mt-1 text-xl font-extrabold text-slate-950 sm:text-2xl">
              {summary.retentionRate}%
            </p>
            <p className="mt-0.5 text-xs font-medium text-slate-600">
              Verified on-job stability
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Average Placed Wage</span>
              <TrendingUp className="size-4 text-amber-700" />
            </div>
            <p className="mt-1 text-xl font-extrabold text-slate-950 sm:text-2xl">
              {inr(summary.averageWage)}
            </p>
            <p className="mt-0.5 text-xs font-medium text-slate-600">
              +{summary.wageGrowth}% YoY median
            </p>
          </div>
        </div>

        {/* Role Selection Header */}
        <div className="mt-9 flex flex-col justify-between gap-2 border-b border-slate-200 pb-3.5 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
              Select Demo Role to Continue
            </h2>
            <p className="text-xs font-medium text-slate-600 sm:text-sm">
              Choose an access persona to test the end-to-end outcome verification workflow.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-900">
            <Info className="size-4 text-blue-700" />
            <span>Prototype Sandbox • Instant 1-Click Access</span>
          </div>
        </div>

        {/* 4 Roles Grid */}
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {roles.map((role) => {
            const Icon = role.icon
            const isSelected = selectedRoleId === role.id

            return (
              <div
                key={role.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedRoleId(role.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelectedRoleId(role.id)
                  }
                }}
                className={cn(
                  'group relative flex flex-col justify-between rounded-xl border bg-white p-5 text-left transition-all duration-200 cursor-pointer shadow-xs',
                  isSelected
                    ? cn(
                        'ring-2 shadow-md bg-blue-50/30',
                        role.accentColor.activeBorder,
                        role.accentColor.activeRing,
                      )
                    : 'border-slate-200 hover:border-slate-400 hover:shadow-sm',
                )}
              >
                {/* Selection Indicator Top-Right */}
                <div className="absolute right-4 top-4">
                  <div
                    className={cn(
                      'flex size-5 items-center justify-center rounded-full border transition-all',
                      isSelected
                        ? 'border-blue-700 bg-blue-700 text-white shadow-xs'
                        : 'border-slate-300 bg-slate-100 group-hover:border-slate-400',
                    )}
                  >
                    {isSelected && <Check className="size-3 stroke-[3]" />}
                  </div>
                </div>

                <div>
                  {/* Role Icon & Category */}
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex size-11 items-center justify-center rounded-lg border transition-transform duration-200 group-hover:scale-105',
                        role.accentColor.bg,
                        role.accentColor.border,
                        role.accentColor.text,
                      )}
                    >
                      <Icon className="size-5.5" />
                    </div>
                    <div className="pr-6">
                      <span className="block text-xs font-bold tracking-wider text-slate-600 uppercase">
                        {role.category}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        {role.marathiTitle}
                      </span>
                    </div>
                  </div>

                  {/* Title & Badge */}
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-slate-950">
                      {role.title}
                    </h3>
                    <div className="mt-1.5 inline-block">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-bold',
                          role.accentColor.badgeBg,
                          role.accentColor.badgeText,
                        )}
                      >
                        {role.badgeText}
                      </span>
                    </div>
                  </div>

                  {/* Persona Details Box */}
                  <div className="mt-3.5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
                    <p className="font-bold text-slate-950 text-sm">
                      {role.persona.name}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-slate-700">
                      {role.persona.designation}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-600">
                      {role.persona.location}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs leading-relaxed font-normal text-slate-700">
                    {role.description}
                  </p>

                  {/* Key Highlights */}
                  <div className="mt-3.5 space-y-1.5 border-t border-slate-200 pt-3">
                    <p className="text-xs font-bold tracking-wider text-slate-600 uppercase">
                      Key Capabilities
                    </p>
                    {role.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs font-medium text-slate-800">
                        <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-700" />
                        <span className="leading-tight">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Direct Continue Button */}
                <div className="mt-5 pt-3 border-t border-slate-200">
                  <Button
                    type="button"
                    variant={isSelected ? 'default' : 'outline'}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleQuickLaunch(role.targetHref)
                    }}
                    className={cn(
                      'w-full justify-between text-xs font-bold shadow-2xs',
                      isSelected
                        ? 'bg-blue-700 text-white hover:bg-blue-800'
                        : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100 hover:text-slate-950',
                    )}
                  >
                    <span>Launch as {role.title.split('/')[0].trim()}</span>
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Selected Role Action Drawer / Sticky Summary Bar */}
        <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50/90 p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-3.5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-blue-700 text-white shadow-xs">
                {selectedRole.icon && <selectedRole.icon className="size-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold tracking-wide text-blue-950 uppercase">
                    Active Demo Selection:
                  </span>
                  <span className="rounded-md border border-blue-300 bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-900">
                    {selectedRole.title}
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium text-slate-700 sm:text-sm">
                  Continuing as <span className="font-bold text-slate-950">{selectedRole.persona.name}</span> ({selectedRole.persona.organization})
                </p>
              </div>
            </div>

            <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
              <Link
                href={selectedRole.targetHref}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                <span>{selectedRole.primaryActionLabel}</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Prototype & Governance Notice */}
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-blue-700" />
              <div className="text-xs leading-relaxed text-slate-700">
                <p className="font-bold text-slate-950 text-sm">
                  Prototype Access & Governance Model
                </p>
                <p className="mt-1 font-medium">
                  This demo portal provides immediate role-based inspection of Maharashtra skilling data.
                  Production authentication (SSO, Aadhaar e-KYC, and VTP credentials) is decoupled for evaluator convenience.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-start gap-3">
              <Layers className="mt-0.5 size-5 shrink-0 text-emerald-700" />
              <div className="text-xs leading-relaxed text-slate-700">
                <p className="font-bold text-slate-950 text-sm">
                  Longitudinal Verification Lifecycle
                </p>
                <p className="mt-1 font-medium">
                  Tracks each candidate across enrollment, training completion, NSQF certification,
                  employer wage confirmation, and 30/90/180-day retention follow-ups.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-600">
          <p className="font-bold text-slate-800">
            Maharashtra State Skill Development Society (MSSDS)
          </p>
          <p className="mt-0.5 text-xs font-medium text-slate-600">
            Department of Skills, Employment, Entrepreneurship & Innovation • Government of Maharashtra
          </p>
          <p className="mt-1 text-xs text-slate-500">
            KAUSHAL Prototype Evaluation Platform • All demonstration records illustrative of Maharashtra skilling operations
          </p>
        </footer>
      </main>
    </div>
  )
}
