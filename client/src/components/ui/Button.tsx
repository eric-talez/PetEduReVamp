import { ButtonHTMLAttributes, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        // 추가 사용자 지정 버튼 스타일
        success: "bg-green-600 text-white hover:bg-green-700",
        info: "bg-blue-600 text-white hover:bg-blue-700",
        warning: "bg-orange-500 text-white hover:bg-orange-600",
        destructive: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-8 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    // 접근성 향상을 위한 aria-disabled 속성 추가
    const ariaProps: Record<string, any> = {};
    
    // 버튼이 비활성화된 경우, 접근성을 위한 ARIA 속성 추가
    if (props.disabled) {
      ariaProps['aria-disabled'] = true;
    }
    
    // 아이콘 버튼인 경우 ARIA 레이블 필요함을 확인
    const isIconButton = size === 'icon' && !props['aria-label'] && !props['aria-labelledby'];
    
    // 개발 모드에서 아이콘 버튼에 접근성 경고 (콘솔 경고만 출력)
    if (process.env.NODE_ENV === 'development' && isIconButton) {
      console.warn(
        'Accessibility warning: Icon button is missing aria-label or aria-labelledby attribute. ' +
        'Add an aria-label describing the button\'s action.'
      );
    }
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        type={Comp === 'button' && !props.type ? 'button' : props.type} // 명시적 type 속성 추가
        {...ariaProps}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
