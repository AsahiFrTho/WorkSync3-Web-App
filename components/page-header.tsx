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
    <div className="border-b border-slate-200/90 bg-white shadow-2xs">
      <div className="mx-auto flex max-w-7xl flex-col gap-2.5 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {eyebrow ? (
              <Badge variant="default" className="border-blue-200 bg-blue-100/90 font-bold uppercase tracking-wider text-blue-950 text-[10px] px-2.5 py-0.5">
                {eyebrow}
              </Badge>
            ) : null}
            <Badge variant="warning" className="border-amber-200 bg-amber-50 font-semibold text-amber-950 text-xs px-2.5 py-0.5 flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-amber-700" />
              <span>Prototype — Demonstration Data</span>
            </Badge>
          </div>
          
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100/80 border border-slate-200 px-2.5 py-0.5 rounded-md">
            <Calendar className="size-3.5 text-blue-700" />
            <span>Reporting Period: FY 2024–25 (Longitudinal Audit)</span>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-950 font-sans break-words">
          {title}
        </h1>
        <p className="max-w-4xl text-xs sm:text-sm leading-relaxed font-normal text-slate-600 text-pretty">
          {description}
        </p>
      </div>
    </div>
  )
}
