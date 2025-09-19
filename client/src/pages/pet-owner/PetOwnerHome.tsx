import { useAuth } from '@/lib/auth-compat';
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { EnhancedAnalytics } from "@/components/dashboard/EnhancedAnalytics";

import { useLocation, Link } from "wouter";
import { BookOpen, Calendar, Medal, PawPrint, Star, Bone, Award, Clock, BarChart3 } from "lucide-react";

interface BannerSlide {
  id: number;
  title: string;
  description: string;
  features: string[];
  image: string;
  primaryAction: {
    text: string;
    path: string;
  };
  secondaryAction: {
    text: string;
    path: string;
  };
}

export default function PetOwnerHome() {
  const { userName, userRole } = useAuth();
  const [, setLocation] = useLocation();
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [activeTab, setActiveTab] = useState('dashboard');

  // 배너 슬라이드 데이터
  const bannerSlides: BannerSlide[] = [
    {
      id: 1,
      title: "반려견 맞춤형 전문 교육 서비스",
      description: "Talez의 전문 훈련사가 제공하는 개인 맞춤형 교육으로 반려견의 성장을 돕습니다",
      features: [
        "1:1 전문가 코칭",
        "행동 교정 프로그램",
        "실시간 화상 교육"
      ],
      image: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400&q=80",
      primaryAction: {
        text: "프로그램 둘러보기",
        path: "/courses"
      },
      secondaryAction: {
        text: "무료 체험 신청",
        path: "/courses"
      }
    },
    {
      id: 2,
      title: "AI 기반 반려견 행동 분석",
      description: "최신 인공지능 기술로 반려견의 행동과 감정을 분석하고 맞춤형 솔루션을 제공합니다",
      features: [
        "영상 기반 행동 분석",
        "감정 상태 모니터링",
        "맞춤형 훈련 가이드"
      ],
      image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400&q=80",
      primaryAction: {
        text: "AI 분석 체험하기",
        path: "/ai-analysis"
      },
      secondaryAction: {
        text: "기술 소개 보기",
        path: "/courses"
      }
    },
    {
      id: 3,
      title: "반려견 친화적 장소 찾기",
      description: "전국의 반려견 동반 가능 장소를 한 눈에 확인하고 실시간 리뷰와 평점을 확인하세요",
      features: [
        "위치 기반 추천 시스템",
        "사용자 실시간 리뷰",
        "Talez 인증 장소 정보"
      ],
      image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400&q=80",
      primaryAction: {
        text: "주변 장소 찾기",
        path: "/locations"
      },
      secondaryAction: {
        text: "장소 등록하기",
        path: "/locations"
      }
    },
    {
      id: 4,
      title: "반려견 건강 모니터링 시스템",
      description: "일상 활동, 식이 패턴, 수면 상태를 기록하고 건강 변화를 추적하여 질병을 예방합니다",
      features: [
        "건강 데이터 대시보드",
        "식이 관리 캘린더",
        "건강 알림 서비스"
      ],
      image: "https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400&q=80",
      primaryAction: {
        text: "건강 기록 시작하기",
        path: "/pet-care/health-record"
      },
      secondaryAction: {
        text: "건강 정보 살펴보기",
        path: "/pet-care/health-record"
      }
    },
    {
      id: 5,
      title: "반려견 소셜 커뮤니티",
      description: "비슷한 관심사를 가진 반려인들과 소통하고 경험을 공유하는 활발한 커뮤니티에 참여하세요",
      features: [
        "지역별 모임 정보",
        "실시간 Q&A",
        "전문가 상담 서비스"
      ],
      image: "https://images.unsplash.com/photo-1548658166-136d9f6a7e76?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400&q=80",
      primaryAction: {
        text: "커뮤니티 가입하기",
        path: "/community"
      },
      secondaryAction: {
        text: "이벤트 참여하기",
        path: "/events"
      }
    }
  ];

  // 슬라이드 자동 변경 기능
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000); // 5초마다 슬라이드 변경

    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  // 슬라이드 수동 변경 함수
  const goToSlide = (index: number) => {
    console.log(`슬라이드 변경: ${currentSlide} → ${index}`);
    setCurrentSlide(index);
  };

  const courses = [
    {
      id: 1,
      title: "반려견 기초 훈련 마스터하기",
      description: "앉아, 기다려, 엎드려 등 기본 명령어부터 산책 예절까지 체계적으로 배우는 초보 견주 필수 코스",
      image: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      progress: 65,
      trainer: {
        name: "김훈련 트레이너",
        avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      },
      popular: true
    },
    {
      id: 2,
      title: "반려견 어질리티 입문",
      description: "다양한 장애물 코스를 통해 반려견의 민첩성과 집중력을 향상시키는 어질리티 훈련 기초 과정",
      image: "https://images.unsplash.com/photo-1583336663277-620dc1996580?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      progress: 30,
      trainer: {
        name: "박민첩 트레이너",
        avatar: "https://images.unsplash.com/photo-1548535537-3cfaf1fc327c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      },
      level: "중급"
    },
    {
      id: 3,
      title: "반려견 사회화 훈련",
      description: "다른 반려견, 사람, 환경에 올바르게 적응하는 방법을 배우는 필수 사회화 과정",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
      progress: 45,
      trainer: {
        name: "이사회 트레이너",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
      },
      level: "초급"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            안녕하세요, {userName}님! 🐾
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            오늘도 소중한 반려견과 함께하는 특별한 하루를 만들어보세요
          </p>
        </div>

        {/* 메인 배너 슬라이드 */}
        <Card className="mb-8 overflow-hidden">
          <div className="relative">
            <div className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-600">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${bannerSlides[currentSlide].image})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              </div>
              
              <div className="relative z-10 flex items-center h-full">
                <div className="container mx-auto px-6">
                  <div className="max-w-2xl text-white">
                    <h2 className="text-4xl font-bold mb-4">
                      {bannerSlides[currentSlide].title}
                    </h2>
                    <p className="text-xl mb-6 text-gray-100">
                      {bannerSlides[currentSlide].description}
                    </p>
                    
                    <div className="flex flex-wrap gap-3 mb-8">
                      {bannerSlides[currentSlide].features.map((feature, index) => (
                        <span 
                          key={index}
                          className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium"
                        >
                          ✨ {feature}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-4">
                      <Link href={bannerSlides[currentSlide].primaryAction.path}>
                        <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                          {bannerSlides[currentSlide].primaryAction.text}
                        </Button>
                      </Link>
                      <Link href={bannerSlides[currentSlide].secondaryAction.path}>
                        <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold">
                          {bannerSlides[currentSlide].secondaryAction.text}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 슬라이드 인디케이터 */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {bannerSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white w-8' 
                      : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                  }`}
                  aria-label={`슬라이드 ${index + 1}로 이동`}
                />
              ))}
            </div>
          </div>
        </Card>

        {/* 핵심 기능 대시보드 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* 내 반려동물 관리 */}
          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <PawPrint className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">내 반려동물</h3>
                <p className="text-gray-600 dark:text-gray-300">반려동물 정보 관리</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              반려동물의 기본 정보, 특성, 건강 상태를 체계적으로 관리하세요
            </p>
            <Link href="/my-pets">
              <Button className="w-full">
                <PawPrint className="w-4 h-4 mr-2" />
                반려동물 관리하기
              </Button>
            </Link>
          </Card>

          {/* 건강 관리 */}
          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">건강 관리</h3>
                <p className="text-gray-600 dark:text-gray-300">예방접종 & 건강검진</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              예방접종 일정 관리, 건강검진 기록, 의료 기록을 체계적으로 관리하세요
            </p>
            <Link href="/pet-care/health-record">
              <Button className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                건강 기록 관리하기
              </Button>
            </Link>
          </Card>

          {/* 교육 과정 */}
          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">교육 과정</h3>
                <p className="text-gray-600 dark:text-gray-300">전문 훈련 프로그램</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              전문 훈련사와 함께하는 맞춤형 교육 프로그램에 참여하세요
            </p>
            <Link href="/courses">
              <Button className="w-full">
                <BookOpen className="w-4 h-4 mr-2" />
                교육 과정 둘러보기
              </Button>
            </Link>
          </Card>
        </div>

        {/* 추천 교육 과정 */}
        <Card className="mb-8">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  🎓 추천 교육 과정
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {userName}님의 반려견에게 특별히 추천하는 인기 교육 과정입니다
                </p>
              </div>
              <Link href="/courses">
                <Button variant="outline">
                  모든 과정 보기
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div 
                    className="h-48 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${course.image})` }}
                  >
                    <div className="h-full bg-black bg-opacity-20 flex items-end p-4">
                      {course.popular && (
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          🔥 인기
                        </span>
                      )}
                      {course.level && (
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium ml-2">
                          {course.level}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Avatar className="w-8 h-8 mr-3">
                          <AvatarImage src={course.trainer.avatar} />
                          <AvatarFallback>
                            {course.trainer.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {course.trainer.name}
                        </span>
                      </div>
                      
                      {course.progress && (
                        <span className="text-sm text-blue-600 font-medium">
                          진행률 {course.progress}%
                        </span>
                      )}
                    </div>
                    
                    <Link href="/courses">
                      <Button className="w-full">
                        자세히 보기
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>

        {/* 통계 및 분석 */}
        <div className="mb-8">
          <EnhancedAnalytics />
        </div>

        {/* 빠른 액션 바 */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            🚀 빠른 바로가기
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/my-pets">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center gap-2">
                <PawPrint className="w-6 h-6" />
                <span className="text-sm">반려동물 추가</span>
              </Button>
            </Link>
            <Link href="/pet-care/health-record">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center gap-2">
                <Calendar className="w-6 h-6" />
                <span className="text-sm">건강 기록</span>
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center gap-2">
                <BookOpen className="w-6 h-6" />
                <span className="text-sm">교육 신청</span>
              </Button>
            </Link>
            <Link href="/community">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center gap-2">
                <Star className="w-6 h-6" />
                <span className="text-sm">커뮤니티</span>
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}