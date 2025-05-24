import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
  ChevronRight,
  ChevronLeft,
  X,
  Home,
  Video,
  BookOpen,
  PawPrint,
  Edit,
  MapPin,
  ShoppingBag
} from 'lucide-react';

// 사용자 역할별 온보딩 가이드 내용
const onboardingSteps = {
  // 반려인용 온보딩 단계
  'pet-owner': [
    {
      title: '탈레즈에 오신 것을 환영합니다!',
      description: '탈레즈는 반려견과 함께하는 즐거운 여정을 도와드립니다. 이제 몇 가지 간단한 단계를 통해 주요 기능을 알아볼게요.',
      icon: <PawPrint className="h-16 w-16 text-primary" />,
      cta: '시작하기',
      image: '/assets/onboarding/welcome.svg'
    },
    {
      title: '나만의 대시보드',
      description: '홈 화면에서 반려견 정보, 추천 콘텐츠, 예정된 수업 등 중요한 정보를 한눈에 확인하세요.',
      icon: <Home className="h-16 w-16 text-primary" />,
      cta: '다음',
      image: '/assets/onboarding/dashboard.svg'
    },
    {
      title: '영상 훈련 콘텐츠',
      description: '전문 훈련사가 제공하는 다양한 훈련 영상을 통해 반려견과 함께 배워보세요.',
      icon: <Video className="h-16 w-16 text-primary" />,
      cta: '다음',
      image: '/assets/onboarding/video-training.svg'
    },
    {
      title: '화상 훈련 수업',
      description: '실시간 화상 수업으로 전문 훈련사에게 1:1 맞춤 지도를 받아보세요.',
      icon: <BookOpen className="h-16 w-16 text-primary" />,
      cta: '다음',
      image: '/assets/onboarding/video-call.svg'
    },
    {
      title: '알림장 기능',
      description: '훈련사와 소통하고 반려견의 성장 과정을 기록하세요.',
      icon: <Edit className="h-16 w-16 text-primary" />,
      cta: '다음',
      image: '/assets/onboarding/notebook.svg'
    },
    {
      title: '위치 기반 서비스',
      description: '반려견과 함께 갈 수 있는 장소를 찾고 정보를 공유하세요.',
      icon: <MapPin className="h-16 w-16 text-primary" />,
      cta: '다음',
      image: '/assets/onboarding/locations.png'
    },
    {
      title: '준비 완료!',
      description: '이제 탈레즈의 다양한 기능을 활용하여 반려견과 함께 성장하는 여정을 시작하세요.',
      icon: <PawPrint className="h-16 w-16 text-primary" />,
      cta: '시작하기',
      image: '/assets/onboarding/complete.png'
    },
  ],
  // 훈련사용 온보딩 단계
  'trainer': [
    {
      title: '훈련사님, 환영합니다!',
      description: '탈레즈는 전문 훈련사와 반려인을 연결하는 플랫폼입니다. 주요 기능들을 살펴보세요.',
      icon: <PawPrint className="h-16 w-16 text-primary" />,
      cta: '시작하기',
      image: '/assets/onboarding/trainer-welcome.png'
    },
    {
      title: '훈련사 대시보드',
      description: '수업 일정, 수강생 현황, 수익 정보 등을 한눈에 확인하세요.',
      icon: <Home className="h-16 w-16 text-primary" />,
      cta: '다음',
      image: '/assets/onboarding/trainer-dashboard.png'
    },
    {
      title: '수업 관리',
      description: '화상 수업을 개설하고 일정을 관리하며 수강생과 소통하세요.',
      icon: <Video className="h-16 w-16 text-primary" />,
      cta: '다음',
      image: '/assets/onboarding/trainer-classes.png'
    },
    {
      title: '알림장 작성',
      description: '수강생에게 상세한 피드백과 훈련 지침을 제공하세요.',
      icon: <Edit className="h-16 w-16 text-primary" />,
      cta: '다음',
      image: '/assets/onboarding/trainer-notebook.png'
    },
    {
      title: '제품 추천',
      description: '수강생에게 유용한 제품을 추천하고 추가 수익을 창출하세요.',
      icon: <ShoppingBag className="h-16 w-16 text-primary" />,
      cta: '다음',
      image: '/assets/onboarding/trainer-products.png'
    },
    {
      title: '준비 완료!',
      description: '이제 탈레즈에서 전문 지식을 공유하고 수강생들과 함께 성장하세요.',
      icon: <PawPrint className="h-16 w-16 text-primary" />,
      cta: '시작하기',
      image: '/assets/onboarding/trainer-complete.png'
    },
  ],
  // 관리자용 온보딩 단계
  'admin': [
    {
      title: '관리자님, 환영합니다!',
      description: '탈레즈 관리자 페이지에서는 서비스의 모든 측면을 관리하고 제어할 수 있습니다.',
      icon: <PawPrint className="h-16 w-16 text-primary" />,
      cta: '시작하기',
      image: '/assets/onboarding/admin-welcome.png'
    },
    {
      title: '사용자 관리',
      description: '모든 사용자 계정을 관리하고 권한을 제어하세요.',
      icon: <Home className="h-16 w-16 text-primary" />,
      cta: '다음',
      image: '/assets/onboarding/admin-users.png'
    },
    {
      title: '콘텐츠 관리',
      description: '영상 콘텐츠를 업로드하고 관리하세요.',
      icon: <Video className="h-16 w-16 text-primary" />,
      cta: '다음',
      image: '/assets/onboarding/admin-content.png'
    },
    {
      title: '배너 및 UI 관리',
      description: '사이트의 시각적 요소와 홍보 배너를 관리하세요.',
      icon: <Edit className="h-16 w-16 text-primary" />,
      cta: '다음',
      image: '/assets/onboarding/admin-banner.png'
    },
    {
      title: '초대 및 베타 관리',
      description: '새로운 사용자 초대와 베타 프로그램을 관리하세요.',
      icon: <ShoppingBag className="h-16 w-16 text-primary" />,
      cta: '다음',
      image: '/assets/onboarding/admin-invite.png'
    },
    {
      title: '준비 완료!',
      description: '이제 탈레즈 플랫폼을 효과적으로 관리하고 성장시킬 준비가 되었습니다.',
      icon: <PawPrint className="h-16 w-16 text-primary" />,
      cta: '시작하기',
      image: '/assets/onboarding/admin-complete.png'
    },
  ],
};

// 온보딩 가이드가 보여질 상태를 로컬스토리지에 저장/조회하는 함수
const ONBOARDING_STORAGE_KEY = 'talez_onboarding_completed';

const hasCompletedOnboarding = () => {
  const stored = localStorage.getItem(ONBOARDING_STORAGE_KEY);
  return stored === 'true';
};

const markOnboardingComplete = () => {
  localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
};

export interface OnboardingGuideProps {
  forceShow?: boolean;
  onComplete?: () => void;
}

export function OnboardingGuide({ forceShow = false, onComplete }: OnboardingGuideProps) {
  const { userRole } = useAuth();
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  // 사용자 역할에 따른 온보딩 단계 가져오기
  const steps = userRole && onboardingSteps[userRole as keyof typeof onboardingSteps] 
    ? onboardingSteps[userRole as keyof typeof onboardingSteps]
    : onboardingSteps['pet-owner']; // 기본값으로 반려인용 단계 사용
  
  useEffect(() => {
    // 이미 온보딩을 완료했는지 확인하고, 완료하지 않았거나 강제 표시 옵션이 있으면 표시
    const shouldShow = forceShow || !hasCompletedOnboarding();
    
    if (shouldShow) {
      // 잠시 지연 후 표시하여 페이지 로딩과 겹치지 않게 함
      const timer = setTimeout(() => {
        setOpen(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [forceShow]);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleComplete = () => {
    markOnboardingComplete();
    setOpen(false);
    
    if (onComplete) {
      onComplete();
    }
  };
  
  const handleSkip = () => {
    markOnboardingComplete();
    setOpen(false);
    
    if (onComplete) {
      onComplete();
    }
  };

  if (!open) return null;

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <div className="absolute right-4 top-4 z-10">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleSkip}
            aria-label="건너뛰기"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-muted-foreground mt-1 text-right">
              {currentStep + 1} / {steps.length}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full">
              {currentStepData.icon}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <DialogHeader>
                <DialogTitle className="text-2xl">{currentStepData.title}</DialogTitle>
                <DialogDescription className="text-base mt-2">
                  {currentStepData.description}
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>
          
          {currentStepData.image && (
            <div className="mt-6 rounded-lg overflow-hidden border">
              <img 
                src={currentStepData.image} 
                alt={currentStepData.title} 
                className="w-full h-auto object-cover"
              />
            </div>
          )}
        </div>
        
        <DialogFooter className="p-6 pt-0 flex justify-between">
          <div>
            {currentStep > 0 ? (
              <Button variant="outline" onClick={handlePrevious}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                이전
              </Button>
            ) : (
              <Button variant="outline" onClick={handleSkip}>
                건너뛰기
              </Button>
            )}
          </div>
          
          <Button onClick={handleNext} className="ml-auto">
            {currentStep < steps.length - 1 ? (
              <>
                다음
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              '시작하기'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default OnboardingGuide;