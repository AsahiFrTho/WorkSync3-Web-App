import { Badge } from '@/components/ui/badge'

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
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2">
          {eyebrow ? (
            <Badge variant="neutral" className="border-slate-200 bg-slate-100 font-bold uppercase tracking-wider text-slate-800">
              {eyebrow}
            </Badge>
          ) : null}
          <Badge variant="warning" className="border-amber-200 bg-amber-50 font-semibold text-amber-900">
            Prototype — Demonstration data
          </Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          {title}
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed font-normal text-slate-700 sm:text-base">
          {description}
        </p>
      </div>
    </div>
  )
}
