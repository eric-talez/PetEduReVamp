import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  ImageIcon, 
  Plus, 
  Sparkles, 
  Users, 
  Settings,
  ArrowRight,
  Info
} from 'lucide-react';
import { Link } from 'wouter';

export type EmptyBannerVariant = 
  | 'admin'           // Admin users - show banner management CTA
  | 'institute-admin' // Institute admin - show banner creation guidance  
  | 'trainer'         // Trainer - encouraging message with community link
  | 'pet-owner'       // Pet owners - friendly alternative content
  | 'guest'           // Not logged in - general welcome message
  | 'loading'         // Loading state
  | 'error';          // Error state

export interface EmptyBannerStateProps {
  /** Variant determines the messaging and actions shown */
  variant: EmptyBannerVariant;
  /** Custom title override */
  title?: string;
  /** Custom description override */
  description?: string;
  /** Custom action button text */
  actionText?: string;
  /** Custom action button link */
  actionLink?: string;
  /** Additional CSS classes */
  className?: string;
  /** Height of the empty state container */
  height?: string;
  /** Whether to show the action button */
  showAction?: boolean;
  /** Custom icon override */
  icon?: React.ReactNode;
  /** Context about where this empty state appears */
  context?: 'home' | 'dashboard' | 'admin' | 'slider';
}

/**
 * EmptyBannerState Component
 * 
 * Provides a professional, role-specific empty state for banner sections
 * when no banners are configured. Maintains visual hierarchy and provides
 * appropriate guidance based on user permissions.
 */
export function EmptyBannerState({
  variant,
  title,
  description,
  actionText,
  actionLink,
  className,
  height = "h-[300px] md:h-[400px]",
  showAction = true,
  icon,
  context = 'home'
}: EmptyBannerStateProps) {
  
  // Define content based on variant
  const getVariantContent = () => {
    switch (variant) {
      case 'admin':
        return {
          title: title || "배너가 설정되지 않았습니다",
          description: description || "첫 번째 배너를 추가하여 사용자들에게 중요한 정보와 프로모션을 전달하세요. 홈페이지와 대시보드에서 표시될 배너를 관리할 수 있습니다.",
          actionText: actionText || "배너 관리하기",
          actionLink: actionLink || "/admin/banners",
          icon: icon || <Settings className="h-8 w-8" />,
          bgGradient: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
          iconColor: "text-blue-600 dark:text-blue-400",
          buttonVariant: "default" as const
        };
        
      case 'institute-admin':
        return {
          title: title || "배너로 기관을 홍보하세요",
          description: description || "매력적인 배너를 통해 교육 프로그램과 시설을 소개하고 더 많은 수강생을 유치하세요. 전문적인 이미지로 신뢰도를 높일 수 있습니다.",
          actionText: actionText || "배너 만들기",
          actionLink: actionLink || "/institute/banners",
          icon: icon || <Sparkles className="h-8 w-8" />,
          bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30",
          iconColor: "text-emerald-600 dark:text-emerald-400",
          buttonVariant: "default" as const
        };
        
      case 'trainer':
        return {
          title: title || "전문성을 알리는 배너를 만들어보세요",
          description: description || "훈련사로서의 전문성과 경험을 배너로 표현하여 더 많은 반려인들에게 다가가세요. 성공 사례와 전문 분야를 어필할 수 있습니다.",
          actionText: actionText || "커뮤니티 둘러보기",
          actionLink: actionLink || "/community",
          icon: icon || <Users className="h-8 w-8" />,
          bgGradient: "from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30",
          iconColor: "text-orange-600 dark:text-orange-400",
          buttonVariant: "outline" as const
        };
        
      case 'pet-owner':
        return {
          title: title || "TALEZ와 함께하는 반려견 교육 여정",
          description: description || "전문 훈련사들이 준비한 맞춤형 교육 프로그램을 통해 반려견과 더 행복한 시간을 보내세요. 지금 바로 시작할 수 있습니다.",
          actionText: actionText || "교육 프로그램 보기",
          actionLink: actionLink || "/courses",
          icon: icon || <Sparkles className="h-8 w-8" />,
          bgGradient: "from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30",
          iconColor: "text-pink-600 dark:text-pink-400",
          buttonVariant: "default" as const
        };
        
      case 'guest':
        return {
          title: title || "TALEZ에 오신 것을 환영합니다",
          description: description || "반려견 교육 전문 플랫폼 TALEZ에서 최고의 훈련사들과 만나보세요. 전국 어디서나 전문적인 반려견 교육 서비스를 이용하실 수 있습니다.",
          actionText: actionText || "서비스 둘러보기",
          actionLink: actionLink || "/about",
          icon: icon || <ImageIcon className="h-8 w-8" />,
          bgGradient: "from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30",
          iconColor: "text-gray-600 dark:text-gray-400",
          buttonVariant: "outline" as const
        };
        
      case 'loading':
        return {
          title: "배너를 불러오는 중...",
          description: "잠시만 기다려주세요.",
          actionText: "",
          actionLink: "",
          icon: <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>,
          bgGradient: "from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30",
          iconColor: "text-gray-600 dark:text-gray-400",
          buttonVariant: "outline" as const
        };
        
      case 'error':
        return {
          title: title || "배너를 불러올 수 없습니다",
          description: description || "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
          actionText: actionText || "새로고침",
          actionLink: actionLink || "#",
          icon: icon || <Info className="h-8 w-8" />,
          bgGradient: "from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30",
          iconColor: "text-red-600 dark:text-red-400",
          buttonVariant: "outline" as const
        };
        
      default:
        return {
          title: "배너가 준비 중입니다",
          description: "곧 멋진 콘텐츠로 찾아뵙겠습니다.",
          actionText: "홈으로 가기",
          actionLink: "/",
          icon: <ImageIcon className="h-8 w-8" />,
          bgGradient: "from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30",
          iconColor: "text-gray-600 dark:text-gray-400",
          buttonVariant: "outline" as const
        };
    }
  };

  const content = getVariantContent();
  
  return (
    <Card 
      className={cn(
        "relative overflow-hidden border-dashed border-2",
        height,
        className
      )}
      data-testid={`empty-banner-state-${variant}`}
      role="region"
      aria-label={`배너 빈 상태 - ${content.title}`}
    >
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-50",
        content.bgGradient
      )} />
      
      <CardContent className="relative h-full flex flex-col items-center justify-center text-center p-8">
        {/* Icon */}
        <div className={cn(
          "mb-6 p-4 rounded-full bg-background/80 backdrop-blur-sm shadow-sm",
          content.iconColor
        )}>
          {content.icon}
        </div>
        
        {/* Content */}
        <div className="max-w-md mx-auto space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            {content.title}
          </h2>
          
          <p className="text-muted-foreground leading-relaxed">
            {content.description}
          </p>
          
          {/* Action Button */}
          {showAction && content.actionText && content.actionLink && variant !== 'loading' && (
            <div className="pt-4">
              {content.actionLink.startsWith('http') || content.actionLink === '#' ? (
                <Button
                  variant={content.buttonVariant}
                  size="lg"
                  onClick={() => {
                    if (content.actionLink === '#') {
                      window.location.reload();
                    } else {
                      window.open(content.actionLink, '_blank');
                    }
                  }}
                  className="group"
                  data-testid={`empty-banner-action-${variant}`}
                >
                  {content.actionText}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              ) : (
                <Button
                  variant={content.buttonVariant}
                  size="lg"
                  asChild
                  className="group"
                  data-testid={`empty-banner-action-${variant}`}
                >
                  <Link href={content.actionLink}>
                    {content.actionText}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              )}
            </div>
          )}
          
          {/* Additional Info for Admins */}
          {(variant === 'admin' || variant === 'institute-admin') && (
            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Plus className="h-4 w-4" />
                <span>첫 번째 배너 생성 후 자동으로 표시됩니다</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Context Badge */}
        {context !== 'home' && (
          <Badge 
            variant="secondary" 
            className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm"
          >
            {context}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Utility function to determine the appropriate variant based on user role
 */
export function getEmptyBannerVariant(
  userRole: string | null, 
  isAuthenticated: boolean,
  isLoading?: boolean,
  hasError?: boolean
): EmptyBannerVariant {
  if (isLoading) return 'loading';
  if (hasError) return 'error';
  if (!isAuthenticated) return 'guest';
  
  switch (userRole) {
    case 'admin':
      return 'admin';
    case 'institute-admin':
      return 'institute-admin';
    case 'trainer':
      return 'trainer';
    case 'pet-owner':
    case 'user':
      return 'pet-owner';
    default:
      return 'guest';
  }
}