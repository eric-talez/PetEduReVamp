import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  text?: string
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  }

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      {text && (
        <span className="text-sm text-muted-foreground">{text}</span>
      )}
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="animate-pulse">
      <div className="rounded-lg border border-border/60 bg-card p-6">
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </div>
    </div>
  )
}

export function LoadingTable({ rows = 5, cols = 4 }: { rows?: number, cols?: number }) {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex space-x-4">
          {Array.from({ length: cols }, (_, j) => (
            <div key={j} className="h-8 bg-muted rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  )
}