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
    <div className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2">
          {eyebrow ? (
            <Badge variant="neutral" className="uppercase tracking-wide">
              {eyebrow}
            </Badge>
          ) : null}
          <Badge variant="warning">Prototype · Mock data</Badge>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          {title}
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground text-pretty">
          {description}
        </p>
      </div>
    </div>
  )
}
