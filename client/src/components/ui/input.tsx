import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 min-h-[44px] w-full rounded-md border border-input bg-background px-4 py-3",
          "text-base text-foreground leading-normal",
          "ring-offset-background file:border-0 file:bg-transparent file:text-base file:font-medium",
          "placeholder:text-muted-foreground placeholder:opacity-70",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary",
          "transition-all duration-200 hover:border-primary/50",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
          "aria-invalid:border-destructive aria-invalid:ring-destructive",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }