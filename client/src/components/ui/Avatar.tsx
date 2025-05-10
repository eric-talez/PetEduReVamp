import { forwardRef, createContext, useContext } from "react";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

const AvatarContext = createContext<{ size?: 'sm' | 'md' | 'lg' | 'xl' }>({});

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt?: string;
}

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, bordered = false, size = 'md', ...props }, ref) => {
    // Size map
    const sizeClasses = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-14 w-14",
      xl: "h-20 w-20",
    };
    
    return (
      <AvatarContext.Provider value={{ size }}>
        <div
          ref={ref}
          className={cn(
            "relative flex shrink-0 overflow-hidden rounded-full",
            sizeClasses[size],
            bordered && "border-2 border-primary",
            className
          )}
          {...props}
        />
      </AvatarContext.Provider>
    );
  }
);

const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, alt, ...props }, ref) => {
    return (
      <img
        ref={ref}
        alt={alt || "Avatar"}
        className={cn("aspect-square h-full w-full object-cover", className)}
        {...props}
      />
    );
  }
);

const AvatarFallback = forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-full w-full items-center justify-center bg-primary/20",
          className
        )}
        {...props}
      >
        {children || <User className="h-5 w-5 text-primary" />}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";
AvatarImage.displayName = "AvatarImage";
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback, type AvatarProps, type AvatarImageProps, type AvatarFallbackProps };
