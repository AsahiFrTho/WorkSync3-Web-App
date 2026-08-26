'use client'

import type * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  LineChart,
  Building2,
  UserCheck,
  Sparkles,
  ArrowLeftRight,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Stakeholder Portal Navigation Items
const stakeholderPortals = [
  {
    label: 'Government / Admin',
    href: '/',
    icon: LayoutDashboard,
    hint: 'State-wide macro metrics',
    roleBadge: 'Admin',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  {
    label: 'Training Provider',
    href: '/analytics',
    icon: LineChart,
    hint: 'Skill gaps & performance',
    roleBadge: 'Provider',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  {
    label: 'Employer Portal',
    href: '/employer',
    icon: Building2,
    hint: 'Join & wage verification',
    roleBadge: 'Employer',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    label: 'Trainee Passport',
    href: '/trainee',
    icon: UserCheck,
    hint: 'Verifiable outcome record',
    roleBadge: 'Trainee',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
  },
]

// Intelligence & AI Layer Tools
const intelligenceTools = [
  {
    label: 'AI Insights & Policy',
    href: '/insights',
    icon: Sparkles,
    hint: 'Automated policy signals',
    roleBadge: 'Policy AI',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
  },
]

interface DemoPersona {
  roleTitle: string
  name: string
  organization: string
  roleCategory: string
  shortRole: string
  icon: typeof ShieldCheck
  badgeClass: string
  accentColor: string
}

function getPersonaForPath(pathname: string): DemoPersona {
  if (pathname.startsWith('/analytics')) {
    return {
      roleTitle: 'Training Provider',
      name: 'Sahyadri Vocational Institute',
      organization: 'Pune Division Training Center',
      roleCategory: 'Training Partner',
      shortRole: 'Provider',
      icon: GraduationCap,
      badgeClass: 'bg-indigo-50 text-indigo-900 border-indigo-200',
      accentColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    }
  }
  if (pathname.startsWith('/employer')) {
    return {
      roleTitle: 'Employer Partner',
      name: 'Deccan Electricals Pvt. Ltd.',
      organization: 'Talegaon Industrial Area, Pune',
      roleCategory: 'Industry Partner',
      shortRole: 'Employer',
      icon: Briefcase,
      badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      accentColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    }
  }
  if (pathname.startsWith('/trainee')) {
    return {
      roleTitle: 'Trainee Candidate',
      name: 'Rahul Pawar',
      organization: 'ID: KP-0001 · Pune District',
      roleCategory: 'Certified Candidate',
      shortRole: 'Trainee',
      icon: Users,
      badgeClass: 'bg-amber-50 text-amber-900 border-amber-200',
      accentColor: 'bg-amber-100 text-amber-900 border-amber-300',
    }
  }
  if (pathname.startsWith('/insights')) {
    return {
      roleTitle: 'Intelligence Engine',
      name: 'Kaushal Policy AI Engine',
      organization: 'Directorate Analytics Cell',
      roleCategory: 'Policy AI',
      shortRole: 'AI Signal',
      icon: Sparkles,
      badgeClass: 'bg-purple-50 text-purple-900 border-purple-200',
      accentColor: 'bg-purple-100 text-purple-800 border-purple-300',
    }
  }
  // Default: Government Administrator (/)
  return {
    roleTitle: 'Government / Administrator',
    name: 'Dr. Sanjay Patil',
    organization: 'MSSDS Mantralaya, Mumbai',
    roleCategory: 'State Directorate',
    shortRole: 'Govt Admin',
    icon: ShieldCheck,
    badgeClass: 'bg-blue-50 text-blue-900 border-blue-200',
    accentColor: 'bg-blue-100 text-blue-800 border-blue-300',
  }
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5 px-3 py-2 text-foreground group">
      <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white border border-slate-200 shadow-xs">
        <Image
          src="/favicon1.png"
          alt="KaushalPulse"
          width={36}
          height={36}
          className="size-full object-contain p-0.5"
          priority
        />
      </div>
      <div className="flex flex-col leading-tight min-w-0">
        <span className="text-sm font-bold tracking-tight text-slate-950">
          KAUSHAL
        </span>
        <span className="text-[10px] font-medium text-slate-600 truncate">
          Skilling Outcomes & Intelligence
        </span>
      </div>
    </Link>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const activePersona = getPersonaForPath(pathname)
  const PersonaIcon = activePersona.icon

  return (
    <div className="flex min-h-screen w-full bg-slate-50 lg:h-screen lg:min-h-0 lg:overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between border-r border-slate-200 bg-white lg:h-full lg:min-h-0 lg:overflow-y-auto">
        <div className="flex flex-col gap-5 p-3">
          <Brand />

          {/* Stakeholder Portals Group */}
          <div className="flex flex-col gap-1.5">
            <p className="px-3 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
              Stakeholder Portals
            </p>
            <nav className="flex flex-col gap-1" aria-label="Stakeholder portals">
              {stakeholderPortals.map((item) => {
                const active =
                  item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group flex items-start justify-between rounded-lg px-2.5 py-2 text-sm transition-all',
                      active
                        ? 'bg-blue-50 text-blue-950 font-semibold shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950',
                    )}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <Icon
                        className={cn(
                          'mt-0.5 size-4 shrink-0 transition-colors',
                          active ? 'text-blue-700' : 'text-slate-500 group-hover:text-slate-800',
                        )}
                        aria-hidden="true"
                      />
                      <span className="flex flex-col leading-tight truncate">
                        <span className="font-semibold text-xs tracking-tight">{item.label}</span>
                        <span className="text-[10px] font-normal text-slate-500 truncate">
                          {item.hint}
                        </span>
                      </span>
                    </div>
                    <span
                      className={cn(
                        'ml-1.5 mt-0.5 rounded border px-1.5 py-0.2 text-[9px] font-bold tracking-wide shrink-0',
                        item.badgeColor,
                      )}
                    >
                      {item.roleBadge}
                    </span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Intelligence & AI Signals Group */}
          <div className="flex flex-col gap-1.5">
            <p className="px-3 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
              Intelligence & Signals
            </p>
            <nav className="flex flex-col gap-1" aria-label="Intelligence tools">
              {intelligenceTools.map((item) => {
                const active = pathname.startsWith(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group flex items-start justify-between rounded-lg px-2.5 py-2 text-sm transition-all',
                      active
                        ? 'bg-purple-50 text-purple-950 font-semibold shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950',
                    )}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <Icon
                        className={cn(
                          'mt-0.5 size-4 shrink-0 transition-colors',
                          active ? 'text-purple-700' : 'text-slate-500 group-hover:text-slate-800',
                        )}
                        aria-hidden="true"
                      />
                      <span className="flex flex-col leading-tight truncate">
                        <span className="font-semibold text-xs tracking-tight">{item.label}</span>
                        <span className="text-[10px] font-normal text-slate-500 truncate">
                          {item.hint}
                        </span>
                      </span>
                    </div>
                    <span
                      className={cn(
                        'ml-1.5 mt-0.5 rounded border px-1.5 py-0.2 text-[9px] font-bold tracking-wide shrink-0',
                        item.badgeColor,
                      )}
                    >
                      {item.roleBadge}
                    </span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Desktop Sidebar Footer */}
        <div className="border-t border-slate-200 bg-slate-50/60 p-3 space-y-2">
          <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-2xs">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                Active Persona
              </span>
              <span className={cn('rounded px-1.5 py-0.2 text-[9px] font-bold border', activePersona.badgeClass)}>
                {activePersona.shortRole}
              </span>
            </div>

            <div className="mt-1.5 flex items-center gap-2">
              <div className={cn('flex size-7 shrink-0 items-center justify-center rounded-md border', activePersona.accentColor)}>
                <PersonaIcon className="size-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-950">
                  {activePersona.name}
                </p>
                <p className="truncate text-[10px] font-medium text-slate-600">
                  {activePersona.organization}
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/login"
            className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-900 shadow-2xs transition-colors hover:bg-blue-100 hover:text-blue-950"
          >
            <span className="flex items-center gap-1.5">
              <ArrowLeftRight className="size-3.5 text-blue-700" />
              <span>Switch Role</span>
            </span>
            <span className="rounded bg-blue-200/80 px-1.5 py-0.2 text-[9px] font-bold text-blue-950">
              Select
            </span>
          </Link>

          <p className="px-1 text-[10px] leading-tight text-slate-500">
            Prototype — Demonstration data only. Not connected to live records.
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden lg:h-full lg:min-h-0">
        {/* Mobile Header */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between px-4 py-2.5">
            <Brand />
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-900 shadow-2xs hover:bg-blue-100"
            >
              <ArrowLeftRight className="size-3 text-blue-700" />
              <span>Switch Role</span>
            </Link>
          </div>

          {/* Active Persona Strip (Mobile) */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-1.5 text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <PersonaIcon className="size-3.5 text-blue-700 shrink-0" />
              <span className="truncate text-slate-700 font-medium">
                Persona: <strong className="text-slate-950">{activePersona.name}</strong>
              </span>
            </div>
            <span className={cn('ml-2 rounded px-1.5 py-0.2 text-[9px] font-bold border shrink-0', activePersona.badgeClass)}>
              {activePersona.shortRole}
            </span>
          </div>

          {/* Mobile Navigation Strip */}
          <nav
            className="flex gap-1 overflow-x-auto border-t border-slate-200 px-3 py-2 bg-white"
            aria-label="Primary mobile"
          >
            {[...stakeholderPortals, ...intelligenceTools].map((item) => {
              const active =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors',
                    active ? 'bg-blue-100 text-blue-900' : 'text-slate-600 hover:bg-slate-100',
                  )}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </header>

        {/* Global Desktop Persona Header Strip with safe wrapping & truncation */}
        <div className="hidden lg:flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-100/70 px-4 xl:px-6 py-2 text-xs">
          <div className="flex min-w-0 flex-1 items-center gap-2 xl:gap-3">
            <div className="flex shrink-0 items-center gap-1.5 font-medium text-slate-600">
              <ShieldCheck className="size-4 text-blue-700" />
              <span>
                Active Stakeholder: <strong className="text-slate-950 font-bold">{activePersona.roleTitle}</strong>
              </span>
            </div>
            <span className="hidden xl:inline text-slate-300">|</span>
            <span className="truncate text-slate-700 font-semibold">
              {activePersona.name} <span className="hidden 2xl:inline text-slate-500 font-normal">({activePersona.organization})</span>
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className={cn('rounded px-2 py-0.5 text-[10px] font-bold border', activePersona.badgeClass)}>
              {activePersona.roleCategory}
            </span>
            <Link
              href="/login"
              className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 hover:underline text-xs ml-1"
            >
              <ArrowLeftRight className="size-3.5" />
              <span>Switch Role</span>
            </Link>
          </div>
        </div>

        <main className="flex-1 min-w-0 lg:min-h-0 lg:overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
