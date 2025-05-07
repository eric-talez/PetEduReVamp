import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  bordered?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, bordered = false, size = 'md', ...props }, ref) => {
    const hasImage = src && src.length > 0;
    
    // Size map
    const sizeClasses = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-14 w-14",
      xl: "h-20 w-20",
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full",
          sizeClasses[size],
          bordered && "border-2 border-primary",
          className
        )}
        {...props}
      >
        {hasImage ? (
          <img
            src={src}
            alt={alt || "Avatar"}
            className="aspect-square h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/20">
            {fallback || <User className="h-5 w-5 text-primary" />}
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar, type AvatarProps };
