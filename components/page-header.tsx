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
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {eyebrow ? (
              <Badge variant="default" className="border-blue-200/90 bg-blue-100 font-bold uppercase tracking-wider text-blue-950 text-[10px] px-2.5 py-0.5 shadow-2xs">
                {eyebrow}
              </Badge>
            ) : null}
            <Badge variant="warning" className="border-amber-200/90 bg-amber-50 font-bold text-amber-950 text-xs px-2.5 py-0.5 flex items-center gap-1.5 shadow-2xs">
              <ShieldCheck className="size-3.5 text-amber-700" />
              <span>Prototype — Demonstration Data</span>
            </Badge>
          </div>
          
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-md shadow-2xs">
            <Calendar className="size-3.5 text-blue-700" />
            <span>Reporting Period: FY 2024–25 (Longitudinal Audit)</span>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-950 font-sans break-words">
          {title}
        </h1>
        <p className="max-w-4xl text-xs sm:text-sm leading-relaxed font-medium text-slate-700 text-pretty">
          {description}
        </p>
      </div>
    </div>
  )
}
