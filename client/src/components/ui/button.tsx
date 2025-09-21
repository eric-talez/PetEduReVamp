import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 hover:shadow-lg hover:shadow-emerald-500/25 font-semibold border border-emerald-600/20 shadow-md",
        destructive:
          "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:shadow-lg hover:shadow-red-500/25 font-semibold border border-red-600/20 shadow-md",
        outline:
          "border-2 border-emerald-600/30 bg-background text-emerald-700 hover:bg-emerald-50 hover:border-emerald-600 hover:text-emerald-800 hover:shadow-sm font-medium dark:border-emerald-400/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50",
        secondary:
          "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 hover:shadow-lg hover:shadow-amber-500/25 font-medium border border-amber-500/20 shadow-md",
        ghost: "text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/50",
        link: "text-emerald-700 underline-offset-4 hover:underline hover:text-emerald-800 font-medium dark:text-emerald-400 dark:hover:text-emerald-300",
        premium: "bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white hover:from-yellow-600 hover:via-amber-600 hover:to-orange-600 hover:shadow-xl hover:shadow-amber-500/30 font-bold border border-amber-400/30 shadow-lg",
        danger: "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 hover:shadow-lg hover:shadow-red-500/25 font-semibold border border-red-600/20 shadow-md",
      },
      size: {
        default: "h-11 px-6 py-2.5 text-base min-w-[3rem] rounded-lg",
        sm: "h-9 px-4 py-2 text-sm min-w-[2.5rem] rounded-md",
        lg: "h-13 px-8 py-3 text-lg min-w-[3.5rem] rounded-xl",
        icon: "h-11 w-11 text-base rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof buttonVariants>, 'variant'> {
  asChild?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'premium' | 'danger';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
