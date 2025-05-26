import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { announceToScreenReader } from '@/components/a11y/AnnouncementRegion';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

// 컴포넌트의 기본 내보내기를 위한 객체

interface OnboardingStep {
  title: string;
  description: string;
  image?: string;
  highlightElement?: string; // CSS 선택자
}

interface OnboardingGuideProps {
  steps: OnboardingStep[];
  onComplete?: () => void;
  showSkip?: boolean;
  userRole?: string;
  forceShow?: boolean;
}

/**
 * 사용자 온보딩 가이드 컴포넌트
 * 
 * 새로운 사용자에게 애플리케이션의 주요 기능을 단계별로 소개합니다.
 * 각 사용자 역할에 맞는 맞춤형 가이드를 제공할 수 있습니다.
 */
export function OnboardingGuide({
  steps,
  onComplete,
  showSkip = true,
  userRole,
  forceShow = false,
}: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useLocalStorage<boolean>('hasSeenOnboarding', false);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  
  // 온보딩 시작 여부 결정
  useEffect(() => {
    if (forceShow || (!hasSeenOnboarding && steps.length > 0)) {
      setIsOpen(true);
      announceToScreenReader('온보딩 가이드가 시작되었습니다. 앱 사용법을 배워보세요.');
    }
  }, [forceShow, hasSeenOnboarding, steps.length]);
  
  // 하이라이트할 요소 찾기
  useEffect(() => {
    if (isOpen && steps[currentStep]?.highlightElement) {
      try {
        const element = document.querySelector(steps[currentStep].highlightElement!) as HTMLElement;
        setHighlightedElement(element);
        
        if (element) {
          // 요소에 하이라이트 효과 추가
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.setAttribute('data-highlighted', 'true');
        }
      } catch (error) {
        console.error('하이라이트 요소를 찾을 수 없습니다:', error);
      }
    }
    
    return () => {
      // 이전 하이라이트 제거
      if (highlightedElement) {
        highlightedElement.removeAttribute('data-highlighted');
        setHighlightedElement(null);
      }
    };
  }, [currentStep, isOpen, steps]);
  
  // 온보딩 완료 처리
  const completeOnboarding = () => {
    setIsOpen(false);
    setHasSeenOnboarding(true);
    if (onComplete) {
      onComplete();
    }
    announceToScreenReader('온보딩 가이드가 완료되었습니다.');
  };
  
  // 다음 단계로 이동
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      announceToScreenReader(`온보딩 단계 ${currentStep + 2}/${steps.length}: ${steps[currentStep + 1].title}`);
    } else {
      completeOnboarding();
    }
  };
  
  // 이전 단계로 이동
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      announceToScreenReader(`온보딩 단계 ${currentStep}/${steps.length}: ${steps[currentStep - 1].title}`);
    }
  };
  
  // 현재 표시할 단계
  const currentStepData = steps[currentStep];
  
  // CSS 스타일을 통한 하이라이트 효과
  useEffect(() => {
    // 하이라이트용 스타일 추가
    const style = document.createElement('style');
    style.innerHTML = `
      [data-highlighted="true"] {
        position: relative;
        z-index: 50;
        animation: pulse 2s infinite;
        box-shadow: 0 0 0 10px rgba(59, 130, 246, 0.3);
        border-radius: 4px;
      }
      
      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  if (!isOpen || !currentStepData) {
    return null;
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{currentStepData.title}</DialogTitle>
          <DialogDescription>
            {currentStepData.description}
          </DialogDescription>
        </DialogHeader>
        
        {currentStepData.image && (
          <div className="my-4">
            <img
              src={currentStepData.image}
              alt={`${currentStepData.title} 설명 이미지`}
              className="w-full rounded-md"
            />
          </div>
        )}
        
        <div className="flex items-center justify-center my-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full mx-1",
                currentStep === index ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
        
        <DialogFooter className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousStep}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              이전
            </Button>
            
            <span className="text-sm text-muted-foreground">
              {currentStep + 1}/{steps.length}
            </span>
            
            <Button
              variant="default"
              size="sm"
              onClick={goToNextStep}
            >
              {currentStep === steps.length - 1 ? "완료" : "다음"}
              {currentStep !== steps.length - 1 && (
                <ChevronRight className="h-4 w-4 ml-1" />
              )}
            </Button>
          </div>
          
          {showSkip && (
            <Button
              variant="ghost"
              size="sm"
              onClick={completeOnboarding}
            >
              건너뛰기
              <X className="h-4 w-4 ml-1" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * 역할별 온보딩 단계 데이터
 * 
 * 각 사용자 역할에 맞는 온보딩 단계를 정의합니다.
 * 필요에 따라 이미지와 하이라이트할 요소를 지정할 수 있습니다.
 */
export const onboardingStepsByRole = {
  // 일반 사용자용 온보딩 단계
  user: [
    {
      title: "탈레즈에 오신 것을 환영합니다!",
      description: "반려동물과 함께하는 더 나은 삶을 위한 교육 플랫폼, 탈레즈를 소개합니다. 주요 기능을 알아볼까요?",
      image: "/assets/onboarding/welcome.png"
    },
    {
      title: "AI 반려동물 분석",
      description: "인공지능을 활용해 반려동물의 행동과 감정을 분석하고 맞춤형 조언을 받아보세요.",
      image: "/assets/onboarding/ai-analysis.png",
      highlightElement: "#menu-ai-analysis"
    },
    {
      title: "맞춤형 교육 과정",
      description: "반려동물의 특성과 필요에 맞는 교육 과정을 추천받고 전문 훈련사와 함께 학습해보세요.",
      image: "/assets/onboarding/courses.png",
      highlightElement: "#menu-courses"
    },
    {
      title: "반려동물 친화 장소",
      description: "주변의 반려동물 친화적인 장소를 찾고 방문 후기를 공유해보세요.",
      image: "/assets/onboarding/locations.png",
      highlightElement: "#menu-locations"
    },
    {
      title: "시작해볼까요?",
      description: "이제 탈레즈의 다양한 기능을 직접 체험해보세요. 더 궁금한 점이 있으면 언제든 문의해주세요!",
      image: "/assets/onboarding/start.png"
    }
  ],
  
  // 훈련사용 온보딩 단계
  trainer: [
    {
      title: "훈련사님, 환영합니다!",
      description: "탈레즈의 훈련사 기능을 소개합니다. 더 효과적인 교육을 위한 도구들을 알아볼까요?",
      image: "/assets/onboarding/trainer-welcome.png"
    },
    {
      title: "교육 과정 관리",
      description: "나만의 교육 과정을 개설하고 관리할 수 있습니다. 영상, 문서 등 다양한 형태의 콘텐츠를 추가해보세요.",
      image: "/assets/onboarding/course-management.png",
      highlightElement: "#menu-course-management"
    },
    {
      title: "수강생 관리",
      description: "수강생의 진도와 성취도를 확인하고 개별 피드백을 제공할 수 있습니다.",
      image: "/assets/onboarding/student-management.png",
      highlightElement: "#menu-students"
    },
    {
      title: "화상 교육",
      description: "실시간 화상 교육을 통해 더 효과적인 지도가 가능합니다. 일정을 관리하고 알림을 보내보세요.",
      image: "/assets/onboarding/video-education.png",
      highlightElement: "#menu-video-calls"
    },
    {
      title: "제품 추천 수익",
      description: "교육에 필요한 제품을 추천하고 판매 수익의 일부를 얻을 수 있습니다.",
      image: "/assets/onboarding/product-recommendation.png",
      highlightElement: "#menu-products"
    }
  ],
  
  // 기관 관리자용 온보딩 단계
  institute: [
    {
      title: "기관 관리자님, 환영합니다!",
      description: "탈레즈의 기관 관리 기능을 소개합니다. 효율적인 운영을 위한 도구들을 알아볼까요?",
      image: "/assets/onboarding/institute-welcome.png"
    },
    {
      title: "기관 정보 관리",
      description: "기관의 프로필과 정보를 관리하고 방문객에게 효과적으로 알릴 수 있습니다.",
      image: "/assets/onboarding/institute-profile.png",
      highlightElement: "#menu-institute-profile"
    },
    {
      title: "훈련사 관리",
      description: "소속 훈련사를 등록하고 관리할 수 있습니다. 각 훈련사의 활동과 성과를 확인해보세요.",
      image: "/assets/onboarding/trainer-management.png",
      highlightElement: "#menu-trainers"
    },
    {
      title: "교육 과정 현황",
      description: "기관에서 제공 중인 모든 교육 과정의 현황과 통계를 확인할 수 있습니다.",
      image: "/assets/onboarding/course-statistics.png",
      highlightElement: "#menu-course-statistics"
    },
    {
      title: "수익 관리",
      description: "교육 수익과 제품 추천 수익을 확인하고 정산 내역을 관리할 수 있습니다.",
      image: "/assets/onboarding/revenue-management.png",
      highlightElement: "#menu-revenue"
    }
  ],
  
  // 관리자용 온보딩 단계
  admin: [
    {
      title: "관리자님, 환영합니다!",
      description: "탈레즈의 관리자 기능을 소개합니다. 플랫폼 운영을 위한 도구들을 알아볼까요?",
      image: "/assets/onboarding/admin-welcome.png"
    },
    {
      title: "사용자 관리",
      description: "모든 사용자의 정보와 활동을 확인하고 관리할 수 있습니다.",
      image: "/assets/onboarding/user-management.png",
      highlightElement: "#menu-users"
    },
    {
      title: "콘텐츠 관리",
      description: "교육 과정, 게시물 등 모든 콘텐츠를 검토하고 관리할 수 있습니다.",
      image: "/assets/onboarding/content-management.png",
      highlightElement: "#menu-content"
    },
    {
      title: "시스템 설정",
      description: "플랫폼의 다양한 설정을 조정하고 시스템 상태를 모니터링할 수 있습니다.",
      image: "/assets/onboarding/system-settings.png",
      highlightElement: "#menu-settings"
    },
    {
      title: "통계 및 분석",
      description: "플랫폼 사용 현황과 다양한 통계 데이터를 확인할 수 있습니다.",
      image: "/assets/onboarding/statistics.png",
      highlightElement: "#menu-statistics"
    }
  ]
};

/**
 * 새 기능 안내 컴포넌트
 * 
 * 업데이트된 기능이나 새로운 기능을 사용자에게 소개합니다.
 */
export function FeatureAnnouncement({ 
  title, 
  description, 
  image, 
  onDismiss 
}: { 
  title: string;
  description: string;
  image?: string;
  onDismiss: () => void;
}) {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onDismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            <span className="flex items-center">
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full mr-2">NEW</span>
              {title}
            </span>
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        {image && (
          <div className="my-4">
            <img
              src={image}
              alt={`${title} 기능 이미지`}
              className="w-full rounded-md"
            />
          </div>
        )}
        
        <DialogFooter>
          <Button onClick={onDismiss}>
            확인했습니다
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}