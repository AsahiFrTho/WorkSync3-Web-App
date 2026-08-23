'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Activity,
  LayoutDashboard,
  LineChart,
  Sparkles,
  IdCard,
  BadgeCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, hint: 'Government overview' },
  { href: '/analytics', label: 'Skill Gap Analytics', icon: LineChart, hint: 'Gaps & non-placement' },
  { href: '/insights', label: 'AI Insights', icon: Sparkles, hint: 'Prototype signals' },
  { href: '/trainee', label: 'Trainee Passport', icon: IdCard, hint: 'Outcome record' },
  { href: '/employer', label: 'Employer Verify', icon: BadgeCheck, hint: 'Confirm employment' },
]

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Activity className="size-5" aria-hidden="true" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold tracking-tight">KaushalPulse</p>
        <p className="text-[11px] text-muted-foreground">Maharashtra Skilling Impact</p>
      </div>
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="border-b border-sidebar-border px-5 py-4">
          <Brand />
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Primary">
          {nav.map((item) => {
            const active =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-sidebar-foreground hover:bg-muted',
                )}
              >
                <Icon
                  className={cn(
                    'mt-0.5 size-4 shrink-0',
                    active ? 'text-primary' : 'text-muted-foreground',
                  )}
                  aria-hidden="true"
                />
                <span className="flex flex-col leading-tight">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-[11px] text-muted-foreground">{item.hint}</span>
                </span>
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-sidebar-border p-4">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Prototype · demonstration data only. Not connected to live government
            records.
          </p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <Brand />
          </div>
          <nav
            className="flex gap-1 overflow-x-auto border-t border-border px-3 py-2"
            aria-label="Primary mobile"
          >
            {nav.map((item) => {
              const active =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                    active ? 'bg-primary/10 text-primary' : 'text-muted-foreground',
                  )}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
