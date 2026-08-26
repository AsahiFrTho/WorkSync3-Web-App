import { Badge } from '@/components/ui/badge'
import { ShieldCheck, Calendar } from 'lucide-react'

export function PageHeader({
  title,
  description,
  eyebrow,
}: {
  title: string
  description: string
  eyebrow?: string
}) {
  return (
    <div className="border-b border-slate-200/90 bg-white/95 backdrop-blur shadow-2xs">
      <div className="mx-auto flex max-w-7xl flex-col gap-2.5 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {eyebrow ? (
              <Badge variant="default" className="border-blue-300 bg-blue-100/90 font-extrabold uppercase tracking-wider text-blue-950 text-[11px] px-2.5 py-0.5">
                {eyebrow}
              </Badge>
            ) : null}
            <Badge variant="warning" className="border-amber-300 bg-amber-50 font-bold text-amber-950 text-xs px-2.5 py-0.5 flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-amber-700" />
              <span>Prototype — Demonstration Data</span>
            </Badge>
          </div>
          
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-md">
            <Calendar className="size-3.5 text-blue-700" />
            <span>Reporting Period: FY 2024–25 (Longitudinal Audit)</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 font-sans">
          {title}
        </h1>
        <p className="max-w-4xl text-xs sm:text-sm leading-relaxed font-medium text-slate-700 text-pretty">
          {description}
        </p>
      </div>
    </div>
  )
}
