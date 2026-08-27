import type * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold whitespace-nowrap transition-colors tracking-tight select-none',
  {
    variants: {
      variant: {
        default: 'border-blue-200/90 bg-blue-50 text-blue-950 font-bold',
        neutral: 'border-slate-200/90 bg-slate-100 text-slate-800 font-semibold',
        success: 'border-emerald-200/90 bg-emerald-50 text-emerald-950 font-bold',
        warning: 'border-amber-200/90 bg-amber-50 text-amber-950 font-bold',
        destructive: 'border-rose-200/90 bg-rose-50 text-rose-950 font-bold',
        outline: 'border-slate-300 bg-white text-slate-800 font-semibold',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
