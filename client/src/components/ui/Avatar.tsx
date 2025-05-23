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
    // 아바타 크기에 따른 대체 텍스트 세부 정보 추가
    const { size } = useContext(AvatarContext);
    const defaultAlt = size === 'lg' || size === 'xl' ? "사용자 프로필 이미지" : "프로필";
    
    return (
      <img
        ref={ref}
        alt={alt || defaultAlt}
        className={cn("aspect-square h-full w-full object-cover", className)}
        {...props}
        onError={(e) => {
          // 이미지 로딩 실패시 기본 이미지 표시 방지 (AvatarFallback 컴포넌트가 처리)
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }
);

const AvatarFallback = forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, children, ...props }, ref) => {
    const { size } = useContext(AvatarContext);
    // 크기에 따른 아이콘 사이즈 조정
    const iconSize = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
      xl: "h-8 w-8",
    }[size || 'md'];

    return (
      <div
        ref={ref}
        className={cn(
          "flex h-full w-full items-center justify-center bg-primary/20 border border-primary/10",
          className
        )}
        aria-label="프로필 이미지 없음"
        role="img"
        {...props}
      >
        {children || <User className={cn(iconSize, "text-primary")} aria-hidden="true" />}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";
AvatarImage.displayName = "AvatarImage";
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback, type AvatarProps, type AvatarImageProps, type AvatarFallbackProps };
