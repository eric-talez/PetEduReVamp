import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { TrendingSection } from '@/components/TrendingSection';
import { MiniChart } from '@/components/ui/mini-chart';
import { WeeklyWeatherModal } from '@/components/WeeklyWeatherModal';
import { ShopPreview } from '@/components/ShopPreview';
import { SocialLoginButtons } from '@/components/SocialLoginButtons';
import { RealTimePopularChart } from '@/components/RealTimePopularChart';
import { useState, lazy, Suspense, useEffect } from 'react';
import { Loader2, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PasswordResetForm } from '@/components/PasswordResetForm';
import { useQuery } from '@tanstack/react-query';
import type { Banner } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

// 각 역할별 홈 페이지를 동적으로 임포트
const TrainerHome = lazy(() => import('./trainer/TrainerHome'));
const PetOwnerHome = lazy(() => import('./pet-owner/PetOwnerHome'));
const InstituteAdminHome = lazy(() => import('./institute-admin/InstituteAdminHome'));

export default function Home() {
  // 불필요한 로그 제거
  const { isAuthenticated, userRole, userName, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [isServiceStatsOpen, setIsServiceStatsOpen] = useState(true);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // 관리자가 등록한 배너 데이터 조회
  const { data: adminBanners = [], isLoading: bannersLoading } = useQuery({
    queryKey: ['/api/banners', 'main', 'hero'],
    queryFn: async () => {
      const response = await fetch('/api/banners?type=main&position=hero');
      if (!response.ok) {
        throw new Error('배너를 불러오는데 실패했습니다');
      }
      return response.json() as Promise<Banner[]>;
    }
  });

  // 기본 배너 데이터 (관리자 배너가 없을 때 사용)
  const defaultBannerSlides = [
    {
      id: 1,
      title: "Talez - 반려견과 함께하는 특별한 여정",
      subtitle: "전문 훈련사와 AI 기술로 반려견 교육의 새로운 기준을 만들어갑니다",
      features: ["전문가 1:1 교육", "AI 행동 분석", "실시간 상담", "커뮤니티"],
      image: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=280&q=80",
      primaryAction: { text: "교육 시작하기", path: "/courses" },
      secondaryAction: { text: "서비스 소개", path: "/about" }
    },
    {
      id: 2,
      title: "AI 기반 반려견 행동 분석",
      subtitle: "최신 인공지능 기술로 반려견의 행동과 감정을 분석하고 맞춤형 솔루션을 제공합니다",
      features: ["영상 기반 분석", "감정 모니터링", "맞춤형 가이드"],
      image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=280&q=80",
      primaryAction: { text: "AI 분석 체험", path: "/ai-analysis" },
      secondaryAction: { text: "기술 소개", path: "/about" }
    },
    {
      id: 3,
      title: "반려견 친화적 장소 찾기",
      subtitle: "전국의 반려견 동반 가능한 카페, 공원, 펜션을 한눈에 확인하세요",
      features: ["지역별 검색", "실시간 정보", "커뮤니티 리뷰"],
      image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=280&q=80",
      primaryAction: { text: "장소 찾기", path: "/locations" },
      secondaryAction: { text: "지도 보기", path: "/map" }
    },
    {
      id: 4,
      title: "전문 훈련사와 실시간 화상 교육",
      subtitle: "언제 어디서나 편리하게 전문가와 실시간 화상으로 교육받으세요",
      features: ["실시간 화상", "개별 커리큘럼", "녹화 복습"],
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=280&q=80",
      primaryAction: { text: "화상 교육", path: "/video-training" },
      secondaryAction: { text: "훈련사 보기", path: "/trainers" }
    },
    {
      id: 5,
      title: "반려견 건강 관리 & 기록",
      subtitle: "반려견의 건강 상태를 체계적으로 관리하고 기록해보세요",
      features: ["건강 기록", "예방접종 알림", "병원 예약"],
      image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=280&q=80",
      primaryAction: { text: "건강 관리", path: "/health" },
      secondaryAction: { text: "기록 시작", path: "/health-record" }
    },
    {
      id: 6,
      title: "반려견 교육 용품 쇼핑몰",
      subtitle: "교육에 필요한 다양한 용품들을 한 곳에서 만나보세요",
      features: ["훈련사 추천", "교육 연계 할인", "빠른 배송"],
      image: "https://images.unsplash.com/photo-1593134257782-e89567b7718a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=280&q=80",
      primaryAction: { text: "쇼핑하기", path: "/shop" },
      secondaryAction: { text: "추천 상품", path: "/shop/recommended" }
    },
    {
      id: 7,
      title: "반려인 커뮤니티",
      subtitle: "비슷한 고민을 가진 반려인들과 소통하고 정보를 공유하세요",
      features: ["반려인 소통", "경험 공유", "전문가 Q&A"],
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=280&q=80",
      primaryAction: { text: "커뮤니티", path: "/community" },
      secondaryAction: { text: "게시글 작성", path: "/community/create" }
    },
    {
      id: 8,
      title: "기관 및 훈련소 등록",
      subtitle: "전문 교육 기관이나 훈련소를 운영하신다면 Talez와 함께하세요",
      features: ["기관 등록", "코스 관리", "수익 창출"],
      image: "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=280&q=80",
      primaryAction: { text: "기관 등록", path: "/institutes/register" },
      secondaryAction: { text: "파트너 안내", path: "/partners" }
    }
  ];

  // 관리자 배너를 표시 형식으로 변환하는 함수
  const convertAdminBannerToSlide = (banner: Banner) => ({
    id: banner.id,
    title: banner.title,
    subtitle: banner.description || '',
    features: [],
    image: banner.imageUrl,
    primaryAction: { 
      text: "자세히 보기", 
      path: banner.linkUrl || "/" 
    },
    secondaryAction: { 
      text: "더 알아보기", 
      path: "/about" 
    }
  });

  // 표시할 배너 슬라이드 결정 (관리자 배너 우선, 없으면 기본 배너)
  const bannerSlides = adminBanners.length > 0 
    ? adminBanners.map(convertAdminBannerToSlide)
    : defaultBannerSlides;

  // 서비스 현황 토글 함수
  const toggleServiceStats = () => {
    setIsServiceStatsOpen(prev => !prev);
  };

  // 배너 슬라이드 네비게이션 함수
  const nextSlide = () => {
    console.log('Next slide clicked, current:', currentSlide);
    setCurrentSlide((prev) => {
      const next = (prev + 1) % bannerSlides.length;
      console.log('Moving to slide:', next);
      return next;
    });
  };

  const prevSlide = () => {
    console.log('Previous slide clicked, current:', currentSlide);
    setCurrentSlide((prev) => {
      const next = (prev - 1 + bannerSlides.length) % bannerSlides.length;
      console.log('Moving to slide:', next);
      return next;
    });
  };

  // 자동 슬라이드 진행
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000); // 5초마다 자동 진행

    return () => clearInterval(interval);
  }, [bannerSlides.length]);

  // 빠른 로그인 처리 함수
  const handleQuickLogin = (role: string) => {
    // 로그인 시뮬레이션을 위한 함수
    let mockUser = {
      id: 1,
      username: `demo-${role}`,
      name: role === 'pet-owner' ? '반려인' : 
            role === 'trainer' ? '훈련사' : 
            role === 'institute-admin' ? '기관 관리자' : 
            role === 'admin' ? '관리자' : `데모 사용자`,
      email: "test@example.com",
      role: role
    };

    // 로그인 이벤트 발생 (hooks/useAuth.tsx에서 이 이벤트를 감지함)
    const loginEvent = new CustomEvent('login', {
      detail: { 
        role: mockUser.role,
        name: mockUser.name,
        userName: mockUser.name,
        userRole: mockUser.role
      }
    });

    console.log('Login event dispatched as:', role);
    window.dispatchEvent(loginEvent);
  };

  // 사용자 역할에 따라 적절한 홈페이지 컴포넌트를 반환
  if (isAuthenticated) {
    console.log("Home 컴포넌트: 인증된 사용자, 역할:", userRole);
    let HomeComponent;

    switch(userRole) {
      case 'trainer':
        console.log("Home 컴포넌트: 훈련사 홈 렌더링");
        HomeComponent = TrainerHome;
        break;
      case 'pet-owner':
        console.log("Home 컴포넌트: 반려인 홈 렌더링");
        HomeComponent = PetOwnerHome;
        break;
      case 'institute-admin':
        console.log("Home 컴포넌트: 기관 관리자 홈 렌더링");
        HomeComponent = InstituteAdminHome;
        break;
      default:
        console.log("Home 컴포넌트: 기본 홈페이지로 폴백");
        // 기본 홈페이지(아래 정의됨)로 폴백
        return renderDefaultHome();
    }

    return (
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="ml-2">사용자 역할에 맞는 대시보드 로딩 중...</div>
        </div>
      }>
        <HomeComponent />
      </Suspense>
    );
  }

  // 기본 홈페이지 렌더링 함수
  function renderDefaultHome() {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* 서비스 현황 및 날씨 - 배너 위 영역 - 토글 가능한 섹션 */}
        
        

        <div className="mb-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300">
            {/* 헤더 영역 - 클릭 시 토글 */}
            <div 
              className="flex items-center justify-between px-4 py-3 cursor-pointer"
              onClick={toggleServiceStats}
            >
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-semibold">서비스 현황</h2>
              </div>
              <div className="flex items-center">
                {isServiceStatsOpen ? (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </div>

            {/* 축소된 상태일 때 간략한 정보 표시 */}
            {!isServiceStatsOpen && (
              <div className="px-4 pb-3 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3 flex justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">활성 사용자</span>
                      <span className="text-lg font-bold">2,580</span>
                    </div>
                    <button 
                      onClick={() => setLocation('/dashboard')}
                      className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 py-0.5 px-1.5 rounded-full hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors cursor-pointer"
                      title="대시보드에서 자세히 보기"
                    >
                      +12.5%
                    </button>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">인증 훈련사</span>
                      <span className="text-lg font-bold">157</span>
                    </div>
                    <button 
                      onClick={() => setLocation('/trainers')}
                      className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 py-0.5 px-1.5 rounded-full hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors cursor-pointer"
                      title="훈련사 목록 보기"
                    >
                      +4.7%
                    </button>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">수료 반려견</span>
                      <span className="text-lg font-bold">4,750</span>
                    </div>
                    <button 
                      onClick={() => setLocation('/courses')}
                      className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 py-0.5 px-1.5 rounded-full hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors cursor-pointer"
                      title="강좌 목록 보기"
                    >
                      +21.3%
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                        <circle cx="12" cy="12" r="5" />
                        <line x1="12" y1="1" x2="12" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="23" />
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                        <line x1="1" y1="12" x2="3" y2="12" />
                        <line x1="21" y1="12" x2="23" y2="12" />
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-bold">23°C</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">맑음 · 서울 강남구</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 확장된 상태일 때 상세 정보 표시 */}
            {isServiceStatsOpen && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4 pb-4">
                {/* 서비스 현황 카드 */}
                <div className="md:col-span-3">
                  <div className="grid grid-cols-3 gap-3">
                    {/* 활성 사용자 */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">2,580</span>
                          <div className="text-xs text-gray-600 dark:text-gray-400">활성 사용자 (주간)</div>
                        </div>
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800/50 rounded flex items-center justify-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-green-600 dark:text-green-400">+12% 전주 대비</div>
                      <div className="mt-1">
                        <div className="flex items-center gap-1 mb-1">
                          {[65, 78, 82, 89, 95, 102, 108].map((height, index) => (
                            <div key={index} className="flex-1 bg-blue-200 dark:bg-blue-700 rounded-sm" style={{height: `${height / 5}px`}}></div>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
                            <span key={index} className="flex-1 text-center">{day}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 완료된 수업 */}
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xl font-bold text-green-600 dark:text-green-400">156</span>
                          <div className="text-xs text-gray-600 dark:text-gray-400">완료된 수업 (주간)</div>
                        </div>
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-800/50 rounded flex items-center justify-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-green-600 dark:text-green-400">+8% 전주 대비</div>
                      <div className="mt-1">
                        <div className="flex items-center gap-1 mb-1">
                          {[18, 22, 25, 28, 24, 30, 32].map((height, index) => (
                            <div key={index} className="flex-1 bg-green-200 dark:bg-green-700 rounded-sm" style={{height: `${height}px`}}></div>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
                            <span key={index} className="flex-1 text-center">{day}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 신규 가입 */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xl font-bold text-purple-600 dark:text-purple-400">47</span>
                          <div className="text-xs text-gray-600 dark:text-gray-400">신규 가입 (주간)</div>
                        </div>
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800/50 rounded flex items-center justify-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">+23% 전주 대비</div>
                      <div className="mt-1">
                        <div className="flex items-center gap-1 mb-1">
                          {[8, 6, 12, 9, 15, 11, 18].map((height, index) => (
                            <div key={index} className="flex-1 bg-purple-200 dark:bg-purple-700 rounded-sm" style={{height: `${height + 10}px`}}></div>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
                            <span key={index} className="flex-1 text-center">{day}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 날씨 카드 */}
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h2 className="text-base font-semibold">오늘의 날씨</h2>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs h-6 px-2"
                      onClick={() => setIsWeatherModalOpen(true)}
                    >
                      주간
                    </Button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12">
                      {/* 날씨 아이콘 - 맑음 */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                        <circle cx="12" cy="12" r="5" />
                        <line x1="12" y1="1" x2="12" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="23" />
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                        <line x1="1" y1="12" x2="3" y2="12" />
                        <line x1="21" y1="12" x2="23" y2="12" />
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xl font-bold">23°C</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">맑음 · 서울 강남구</p>
                    </div>
                  </div>
                  <div className="flex justify-between w-full mt-2 text-xs">
                    <div className="text-center">
                      <p className="text-gray-600 dark:text-gray-400">습도</p>
                      <p className="font-semibold">45%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600 dark:text-gray-400">바람</p>
                      <p className="font-semibold">3m/s</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600 dark:text-gray-400">미세먼지</p>
                      <p className="font-semibold">좋음</p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <p>산책하기 좋은 날씨입니다!</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 메인 배너 슬라이더 */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-xl h-[168px] bg-gradient-to-r from-primary to-primary/80 shadow-lg">
            {/* 배경 이미지 */}
            <div className="absolute inset-0 transition-all duration-500 ease-in-out">
              <img 
                src={bannerSlides[currentSlide].image} 
                alt={bannerSlides[currentSlide].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30"></div>
            </div>
            
            {/* 배너 콘텐츠 */}
            <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-12">
              <h1 className="text-white text-xl md:text-2xl font-bold mb-2 max-w-3xl">
                {bannerSlides[currentSlide].title}
              </h1>
              <p className="text-white/90 text-sm md:text-base max-w-2xl mb-3">
                {bannerSlides[currentSlide].subtitle}
              </p>
              
              {/* 주요 기능 태그 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {bannerSlides[currentSlide].features.map((feature, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center text-xs bg-white/20 text-white px-2 py-1 rounded-full backdrop-blur-sm"
                  >
                    <span className="mr-1 text-yellow-300">✓</span> {feature}
                  </span>
                ))}
              </div>
              
              {/* 액션 버튼 */}
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="bg-background/95 text-foreground font-semibold hover:bg-background border border-border px-4 py-1.5 rounded-lg shadow-md backdrop-blur-sm"
                  onClick={() => setLocation(bannerSlides[currentSlide].primaryAction.path)}
                >
                  {bannerSlides[currentSlide].primaryAction.text}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-2 border-foreground/60 text-foreground/90 hover:bg-background/80 hover:text-foreground px-4 py-1.5 rounded-lg backdrop-blur-sm"
                  onClick={() => setLocation(bannerSlides[currentSlide].secondaryAction.path)}
                >
                  {bannerSlides[currentSlide].secondaryAction.text}
                </Button>
              </div>
            </div>

            {/* 네비게이션 화살표 */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 dark:bg-gray-800/40 hover:bg-white/50 dark:hover:bg-gray-800/60 text-white dark:text-gray-200 backdrop-blur-sm h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-20 border border-white/20 dark:border-gray-600/30"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevSlide();
              }}
              aria-label="이전 슬라이드"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 dark:bg-gray-800/40 hover:bg-white/50 dark:hover:bg-gray-800/60 text-white dark:text-gray-200 backdrop-blur-sm h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-20 border border-white/20 dark:border-gray-600/30"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextSlide();
              }}
              aria-label="다음 슬라이드"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            
            {/* 슬라이드 인디케이터 */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {bannerSlides.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-200 hover:scale-125 border border-white/30 dark:border-gray-400/40 ${
                    currentSlide === index 
                      ? 'bg-white dark:bg-gray-200 shadow-lg' 
                      : 'bg-white/50 dark:bg-gray-400/50 hover:bg-white/70 dark:hover:bg-gray-300/70'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Dot clicked, moving to slide:', index);
                    setCurrentSlide(index);
                  }}
                  aria-label={`${index + 1}번째 슬라이드로 이동`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 실시간 인기차트 영역 (통합) */}
        <div className="mb-8">
          <RealTimePopularChart />
        </div>

        {/* 테마 테스트 요소 */}
        <div className="mb-4 p-4 bg-background border border-border rounded-lg">
          <p className="text-foreground">테마 테스트: 배경색과 텍스트 색상이 테마에 따라 변경되어야 합니다.</p>
        </div>

        {/* 서비스 소개 섹션 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">우리의 서비스</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">교육 프로그램</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">다양한 상황에 맞는 교육 프로그램으로 반려견의 행동 개선을 도와드립니다.</p>
              <Button variant="outline" size="sm" className="w-full">
                <Link href="/courses">프로그램 보기</Link>
              </Button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">전문 트레이너</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">반려견의 개별 특성과 성향에 맞춘 맞춤형 교육 솔루션을 제공합니다.</p>
              <Button variant="outline" size="sm" className="w-full">
                <Link href="/trainers">트레이너 찾기</Link>
              </Button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">온라인 화상 교육</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">언제 어디서나 편리하게 전문가와 실시간 화상 교육을 통해 훈련할 수 있습니다.</p>
              <Button variant="outline" size="sm" className="w-full">
                <Link href="/video-call">화상 교육 체험하기</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* 쇼핑 페이지 접근 컴포넌트 */}
        <ShopPreview />

        {/* 주간 날씨 모달 */}
        <WeeklyWeatherModal
          isOpen={isWeatherModalOpen}
          onClose={() => setIsWeatherModalOpen(false)}
          location={{ name: "서울", region: "강남구" }}
        />

        {/* 비밀번호 찾기 모달 */}
        <Dialog open={showPasswordReset} onOpenChange={setShowPasswordReset}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>비밀번호 찾기</DialogTitle>
            </DialogHeader>
            <PasswordResetForm onClose={() => setShowPasswordReset(false)} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Return the default home content
  return renderDefaultHome();
}