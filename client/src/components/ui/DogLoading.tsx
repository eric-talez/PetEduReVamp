import { cn } from "@/lib/utils";

interface DogLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

/**
 * 강아지 테마 로딩 애니메이션 컴포넌트
 * 
 * @param size 로딩 컴포넌트 크기 (sm, md, lg)
 * @param message 로딩 메시지
 * @param className 추가 CSS 클래스
 */
export function DogLoading({ 
  size = 'md', 
  message = '로딩 중...', 
  className 
}: DogLoadingProps) {
  // 크기에 따른 스타일 매핑
  const sizeClasses = {
    sm: {
      container: "p-2",
      spinner: "w-8 h-8 border-2",
      text: "text-sm mt-2"
    },
    md: {
      container: "p-4",
      spinner: "w-12 h-12 border-4",
      text: "text-base mt-3"
    },
    lg: {
      container: "p-6",
      spinner: "w-16 h-16 border-4",
      text: "text-lg mt-4"
    }
  };

  const selectedSize = sizeClasses[size];

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative">
        {/* 강아지 귀 애니메이션 */}
        <div className="absolute -top-5 -left-4 w-4 h-6 bg-primary rounded-full transform -rotate-30 origin-bottom animate-wag-left"></div>
        <div className="absolute -top-5 -right-4 w-4 h-6 bg-primary rounded-full transform rotate-30 origin-bottom animate-wag-right"></div>
        
        {/* 스피너 (강아지 얼굴) */}
        <div className={cn(
          selectedSize.spinner,
          "border-primary border-t-transparent rounded-full animate-spin relative"
        )}>
          {/* 강아지 눈과
           코를 표현 */}
          <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-gray-700 dark:bg-gray-200 rounded-full"></div>
          <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-gray-700 dark:bg-gray-200 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-2 h-2 bg-gray-700 dark:bg-gray-200 rounded-full"></div>
        </div>
      </div>
      
      {/* 로딩 메시지 */}
      {message && (
        <p className={cn(
          selectedSize.text,
          "text-gray-600 dark:text-gray-300"
        )}>
          {message}
        </p>
      )}
    </div>
  );
}

export default DogLoading;