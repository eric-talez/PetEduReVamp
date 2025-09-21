import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95 touch-target",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:scale-[1.02] font-semibold border border-primary/10 shadow-sm transition-transform",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-md hover:scale-[1.02] font-semibold border border-destructive/10 shadow-sm transition-transform",
        outline:
          "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent hover:shadow-sm hover:scale-[1.02] font-medium transition-transform",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-md hover:scale-[1.02] font-medium border border-secondary/10 shadow-sm transition-transform",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] transition-transform",
        link: "text-primary underline-offset-4 hover:underline hover:scale-[1.02] font-medium transition-transform",
        premium: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 hover:shadow-lg hover:scale-[1.02] font-semibold border border-amber-400 shadow-md transition-transform",
        danger: "bg-red-600 text-white hover:bg-red-700 hover:shadow-md hover:scale-[1.02] font-semibold border border-red-500/10 shadow-sm transition-transform",
        success: "bg-green-600 text-white hover:bg-green-700 hover:shadow-md hover:scale-[1.02] font-semibold border border-green-500/10 shadow-sm transition-transform",
        warning: "bg-orange-600 text-white hover:bg-orange-700 hover:shadow-md hover:scale-[1.02] font-semibold border border-orange-500/10 shadow-sm transition-transform",
      },
      size: {
        default: "btn-responsive touch-target min-h-[44px]",
        sm: "btn-compact touch-target min-h-[36px]",
        lg: "btn-large touch-target min-h-[48px]",
        icon: "h-11 w-11 text-base touch-target min-h-[44px] min-w-[44px]",
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
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'premium' | 'danger' | 'success' | 'warning';
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false, 
    loadingText,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    const isDisabled = disabled || loading;
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        data-testid={props['data-testid'] || `button-${variant || 'default'}`}
        {...props}
      >
        {loading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {!loading && leftIcon && <span className="mr-1">{leftIcon}</span>}
        {loading ? (loadingText || children) : children}
        {!loading && rightIcon && <span className="ml-1">{rightIcon}</span>}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
