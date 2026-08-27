import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          'bg-blue-700 text-white shadow-xs hover:bg-blue-800 focus-visible:ring-blue-600',
        outline:
          'border-slate-300 bg-white text-slate-800 shadow-2xs hover:bg-slate-50 hover:text-slate-950 hover:border-slate-400',
        secondary:
          'bg-slate-100 text-slate-900 border border-slate-200/90 hover:bg-slate-200/80',
        ghost:
          'hover:bg-slate-100 hover:text-slate-950 text-slate-700',
        destructive:
          'bg-rose-50 text-rose-950 border border-rose-200 hover:bg-rose-100 hover:border-rose-300 focus-visible:ring-rose-600',
        link: 'text-blue-700 underline-offset-4 hover:underline hover:text-blue-900',
      },
      size: {
        default:
          'h-8.5 gap-1.5 px-3 py-1.5 text-xs sm:text-sm',
        xs: "h-6 gap-1 rounded-md px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7.5 gap-1.5 rounded-md px-2.5 text-xs font-semibold [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-10 gap-2 px-4 py-2 text-sm font-bold',
        icon: 'size-8.5',
        'icon-xs':
          "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        'icon-sm':
          'size-7.5 rounded-md',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
