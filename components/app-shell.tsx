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
    href: '/dashboard',
    icon: LayoutDashboard,
    hint: 'State-wide macro metrics',
    roleBadge: 'Admin',
    badgeColor: 'bg-blue-100 text-blue-950 border-blue-200 font-bold',
  },
  {
    label: 'Training Provider',
    href: '/analytics',
    icon: LineChart,
    hint: 'Skill gaps & performance',
    roleBadge: 'Provider',
    badgeColor: 'bg-indigo-100 text-indigo-950 border-indigo-200 font-bold',
  },
  {
    label: 'Employer Portal',
    href: '/employer',
    icon: Building2,
    hint: 'Join & wage verification',
    roleBadge: 'Employer',
    badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-200 font-bold',
  },
  {
    label: 'Trainee Passport',
    href: '/trainee',
    icon: UserCheck,
    hint: 'Verifiable outcome record',
    roleBadge: 'Trainee',
    badgeColor: 'bg-amber-100 text-amber-950 border-amber-200 font-bold',
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
    badgeColor: 'bg-purple-100 text-purple-950 border-purple-200 font-bold',
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
      badgeClass: 'bg-indigo-50 text-indigo-950 border-indigo-200 font-bold',
      accentColor: 'bg-indigo-100 text-indigo-950 border-indigo-300',
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
      badgeClass: 'bg-emerald-50 text-emerald-950 border-emerald-200 font-bold',
      accentColor: 'bg-emerald-100 text-emerald-950 border-emerald-300',
    }
  }
  if (pathname.startsWith('/trainee')) {
    return {
      roleTitle: 'Trainee Candidate',
      name: 'Rahul Pawar',
      organization: 'ID: KP-0001 • Pune District',
      roleCategory: 'Certified Candidate',
      shortRole: 'Trainee',
      icon: Users,
      badgeClass: 'bg-amber-50 text-amber-950 border-amber-200 font-bold',
      accentColor: 'bg-amber-100 text-amber-950 border-amber-300',
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
      badgeClass: 'bg-purple-50 text-purple-950 border-purple-200 font-bold',
      accentColor: 'bg-purple-100 text-purple-950 border-purple-300',
    }
  }
  // Default: Government Administrator (/dashboard or /)
  return {
    roleTitle: 'Government / Administrator',
    name: 'Dr. Sanjay Patil',
    organization: 'MSSDS Mantralaya, Mumbai',
    roleCategory: 'State Directorate',
    shortRole: 'Govt Admin',
    icon: ShieldCheck,
    badgeClass: 'bg-blue-50 text-blue-950 border-blue-200 font-bold',
    accentColor: 'bg-blue-100 text-blue-950 border-blue-300',
  }
}

function Brand() {
  return (
    <Link href="/dashboard" className="flex items-center gap-3 px-1 py-1 text-foreground group min-w-0">
      <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white border border-slate-200 shadow-xs transition-transform duration-200 group-hover:scale-105">
        <Image
          src="/favicon1.png"
          alt="KaushalPulse"
          width={38}
          height={38}
          className="size-full object-contain p-0.5"
          priority
        />
      </div>
      <div className="flex flex-col leading-tight min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-base font-black tracking-tight text-slate-950 font-sans">
            KAUSHAL<span className="text-blue-700">PULSE</span>
          </span>
        </div>
        <span className="text-[10px] font-bold text-slate-600 truncate">
          Skilling Outcomes & Intelligence
        </span>
        <div className="mt-1 h-0.5 w-full rounded-full bg-gradient-to-r from-orange-500 via-slate-300 to-emerald-600 opacity-80" />
      </div>
    </Link>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const activePersona = getPersonaForPath(pathname)
  const PersonaIcon = activePersona.icon

  return (
    <div className="flex min-h-screen w-full bg-slate-100/70 lg:h-screen lg:min-h-0 lg:overflow-hidden font-sans">
      {/* Desktop Sidebar (Government Command Rail) */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between border-r border-slate-200/90 bg-white lg:h-full lg:min-h-0 lg:overflow-y-auto shadow-xs">
        <div className="flex flex-col gap-5 p-4">
          <Brand />

          {/* Stakeholder Portals Group */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between px-2.5">
              <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                Stakeholder Portals
              </p>
              <span className="size-1.5 rounded-full bg-blue-600" aria-hidden="true" />
            </div>
            <nav className="flex flex-col gap-1" aria-label="Stakeholder portals">
              {stakeholderPortals.map((item) => {
                const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                const Icon = item.icon
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group flex items-start justify-between rounded-lg px-3 py-2.5 text-xs transition-all duration-150',
                      active
                        ? 'border-l-4 border-blue-700 bg-blue-50/70 text-blue-950 font-bold shadow-xs'
                        : 'border-l-4 border-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-950 font-medium',
                    )}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      {Icon && (
                        <Icon
                          className={cn(
                            'mt-0.5 size-4 shrink-0 transition-colors',
                            active ? 'text-blue-700 stroke-[2.5]' : 'text-slate-500 group-hover:text-slate-800',
                          )}
                          aria-hidden="true"
                        />
                      )}
                      <span className="flex flex-col leading-tight truncate">
                        <span className="font-bold text-xs tracking-tight">{item.label}</span>
                        <span className="text-[10px] font-medium text-slate-500 truncate">
                          {item.hint}
                        </span>
                      </span>
                    </div>
                    <span
                      className={cn(
                        'ml-1.5 mt-0.5 rounded border px-1.5 py-0.2 text-[9px] tracking-wide shrink-0 font-bold',
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
            <div className="flex items-center justify-between px-2.5">
              <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                Intelligence & Signals
              </p>
              <span className="size-1.5 rounded-full bg-purple-600" aria-hidden="true" />
            </div>
            <nav className="flex flex-col gap-1" aria-label="Intelligence tools">
              {intelligenceTools.map((item) => {
                const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                const Icon = item.icon
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group flex items-start justify-between rounded-lg px-3 py-2.5 text-xs transition-all duration-150',
                      active
                        ? 'border-l-4 border-purple-700 bg-purple-50/70 text-purple-950 font-bold shadow-xs'
                        : 'border-l-4 border-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-950 font-medium',
                    )}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      {Icon && (
                        <Icon
                          className={cn(
                            'mt-0.5 size-4 shrink-0 transition-colors',
                            active ? 'text-purple-700 stroke-[2.5]' : 'text-slate-500 group-hover:text-slate-800',
                          )}
                          aria-hidden="true"
                        />
                      )}
                      <span className="flex flex-col leading-tight truncate">
                        <span className="font-bold text-xs tracking-tight">{item.label}</span>
                        <span className="text-[10px] font-medium text-slate-500 truncate">
                          {item.hint}
                        </span>
                      </span>
                    </div>
                    <span
                      className={cn(
                        'ml-1.5 mt-0.5 rounded border px-1.5 py-0.2 text-[9px] tracking-wide shrink-0 font-bold',
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

        {/* Desktop Sidebar Footer / Active Persona Command Badge */}
        <div className="border-t border-slate-200 bg-slate-50/80 p-3.5 space-y-2.5">
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-slate-600 uppercase">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                Active Session
              </span>
              <span className={cn('rounded px-1.5 py-0.2 text-[9px] font-bold border', activePersona.badgeClass)}>
                {activePersona.shortRole}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-2xs', activePersona.accentColor)}>
                {PersonaIcon && <PersonaIcon className="size-4" />}
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
            className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50/90 px-3 py-2 text-xs font-bold text-blue-900 shadow-2xs transition-colors hover:bg-blue-100 hover:text-blue-950"
          >
            <span className="flex items-center gap-1.5">
              <ArrowLeftRight className="size-3.5 text-blue-700" />
              <span>Switch Demo Role</span>
            </span>
            <span className="rounded bg-blue-200 px-1.5 py-0.5 text-[9px] font-bold text-blue-950">
              Select
            </span>
          </Link>

          <p className="px-1 text-[10px] leading-tight text-slate-500 font-semibold">
            Evaluation Platform • MSSDS Skilling Intelligence
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden lg:h-full lg:min-h-0 bg-slate-100/70">
        {/* Mobile Header */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3">
            <Brand />
            <Link
              href="/login"
              className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-900 shadow-2xs hover:bg-blue-100"
            >
              <ArrowLeftRight className="size-3 text-blue-700" />
              <span>Switch Role</span>
            </Link>
          </div>

          {/* Active Persona Strip (Mobile) */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-2 text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              {PersonaIcon && <PersonaIcon className="size-3.5 text-blue-700 shrink-0" />}
              <span className="truncate text-slate-700 font-medium">
                Persona: <strong className="text-slate-950 font-bold">{activePersona.name}</strong>
              </span>
            </div>
            <span className={cn('ml-2 rounded px-1.5 py-0.2 text-[9px] font-bold border shrink-0', activePersona.badgeClass)}>
              {activePersona.shortRole}
            </span>
          </div>

          {/* Mobile Navigation Strip */}
          <nav
            className="flex gap-1.5 overflow-x-auto border-t border-slate-200 px-3 py-2 bg-white"
            aria-label="Primary mobile"
          >
            {[...stakeholderPortals, ...intelligenceTools].map((item) => {
              const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
              const Icon = item.icon
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition-colors',
                    active ? 'bg-blue-700 text-white shadow-2xs' : 'text-slate-700 hover:bg-slate-100',
                  )}
                >
                  {Icon && <Icon className="size-3.5" aria-hidden="true" />}
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </header>

        {/* Global Desktop Persona Header Strip (Executive Command Bar) */}
        <div className="hidden lg:flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-200/90 bg-white px-5 xl:px-8 py-2.5 text-xs shadow-2xs">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex shrink-0 items-center gap-2 font-medium text-slate-700">
              <span className="flex size-6 items-center justify-center rounded-md bg-blue-100 text-blue-800">
                <ShieldCheck className="size-3.5" />
              </span>
              <span>
                Active Stakeholder: <strong className="text-slate-950 font-bold">{activePersona.roleTitle}</strong>
              </span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="truncate text-slate-700 font-medium">
              {activePersona.name} <span className="text-slate-500 font-normal">({activePersona.organization})</span>
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2.5">
            <span className={cn('rounded px-2 py-0.5 text-[10px] font-bold border', activePersona.badgeClass)}>
              {activePersona.roleCategory}
            </span>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 font-bold text-blue-700 hover:text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md text-xs transition-colors hover:bg-blue-100"
            >
              <ArrowLeftRight className="size-3 text-blue-700" />
              <span>Switch Role</span>
            </Link>
          </div>
        </div>

        <main className="flex-1 min-w-0 lg:min-h-0 lg:overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
