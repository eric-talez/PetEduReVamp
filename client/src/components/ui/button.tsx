import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg dark:bg-destructive dark:text-destructive-foreground dark:hover:bg-destructive/90",
        outline:
          "border-2 border-primary/30 bg-background text-primary hover:bg-primary/10 hover:border-primary font-semibold dark:border-primary/30 dark:text-primary dark:hover:bg-primary/20",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80",
        ghost: "text-primary hover:bg-primary/10 font-semibold dark:text-primary dark:hover:bg-primary/20",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80 font-semibold dark:text-primary dark:hover:text-primary/80",
        premium: "bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white hover:from-yellow-600 hover:via-amber-600 hover:to-orange-600 hover:shadow-xl hover:shadow-amber-500/30 font-bold border border-amber-400/30 shadow-lg",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg dark:bg-destructive dark:text-destructive-foreground dark:hover:bg-destructive/90",
      },
      size: {
        default: "h-11 px-6 py-2.5 text-base min-w-[3rem] rounded-lg",
        sm: "h-9 px-4 py-2 text-sm min-w-[2.5rem] rounded-lg",
        lg: "h-13 px-8 py-3 text-lg min-w-[3.5rem] rounded-lg",
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
