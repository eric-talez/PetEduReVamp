import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  variant?: "default" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  showPercentage?: boolean;
  animated?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, variant = "default", size = "md", showPercentage = false, animated = false, ...props }, ref) => {
    const progressValue = Math.min(Math.max(value, 0), 100);

    const variantClasses = {
      default: "bg-primary",
      success: "bg-green-500",
      warning: "bg-yellow-500",
      error: "bg-red-500",
    };

    const sizeClasses = {
      sm: "h-1",
      md: "h-2",
      lg: "h-3",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full transition-all duration-300 ease-out",
            variantClasses[variant],
            animated && "animate-pulse"
          )}
          style={{ width: `${progressValue}%` }}
        />
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-900 dark:text-gray-100">
            {Math.round(progressValue)}%
          </div>
        )}
      </div>
    );
  }
);

Progress.displayName = "Progress";

export { Progress };