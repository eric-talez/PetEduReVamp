import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { TrendingSection } from '@/components/TrendingSection';
import { MiniChart } from '@/components/ui/mini-chart';
import { WeeklyWeatherModal } from '@/components/WeeklyWeatherModal';
import { ShopPreview } from '@/components/ShopPreview';
import { SocialLoginButtons } from '@/components/SocialLoginButtons';
import { useState, lazy, Suspense } from 'react';
import { Loader2, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PasswordResetForm } from '@/components/PasswordResetForm';

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

  // 8개의 배너 슬라이드 데이터
  const bannerSlides = [
    {
      id: 1,
      title: "반려견 맞춤형 전문 교육 서비스",
      description: "Talez의 전문 훈련사가 제공하는 개인 맞춤형 교육으로 반려견의 성장을 돕습니다",
      features: ["1:1 전문가 코칭", "행동 교정 프로그램", "실시간 화상 교육"],
      image: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400&q=80",
      primaryAction: { text: "프로그램 둘러보기", path: "/courses" },
      secondaryAction: { text: "무료 체험 신청", path: "/auth" }
    },
    {
      id: 2,
      title: "AI 기반 반려견 행동 분석",
      description: "최신 인공지능 기술로 반려견의 행동과 감정을 분석하고 맞춤형 솔루션을 제공합니다",
      features: ["영상 기반 행동 분석", "감정 상태 모니터링", "맞춤형 훈련 가이드"],
      image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400&q=80",
      primaryAction: { text: "AI 분석 체험하기", path: "/ai-analysis" },
      secondaryAction: { text: "기술 소개 보기", path: "/about" }
    },
    {
      id: 3,
      title: "반려견 친화적 장소 찾기",
      description: "전국의 반려견 친화적인 장소를 찾고 즐거운 시간을 보내세요",
      features: ["반려견 동반 가능한 장소", "실시간 위치 정보", "사용자 리뷰"],
      image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400&q=80",
      primaryAction: { text: "장소 찾아보기", path: "/locations" },
      secondaryAction: { text: "내 주변 검색", path: "/location" }
    },
    {
      id: 4,
      title: "전문 훈련사와 실시간 화상 교육",
      description: "언제 어디서나 편리하게 전문가와 실시간 화상 교육을 받아보세요",
      features: ["실시간 화상 상담", "개별 맞춤 커리큘럼", "녹화 복습 제공"],
      image: "https://images.unsplash.com/photo-1606225457115-9b0de9c5fb09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400&q=80",
      primaryAction: { text: "화상 교육 시작", path: "/video-call" },
      secondaryAction: { text: "훈련사 찾기", path: "/trainers" }
    },
    {
      id: 5,
      title: "반려견 건강 관리 & 기록",
      description: "반려견의 건강 상태를 체계적으로 관리하고 기록해보세요",
      features: ["건강 기록 관리", "예방접종 알림", "병원 예약"],
      image: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400&q=80",
      primaryAction: { text: "건강 관리 시작", path: "/pet-care/health-record" },
      secondaryAction: { text: "AI 분석", path: "/pet-care/ai-analysis" }
    },
    {
      id: 6,
      title: "반려견 교육 용품 쇼핑몰",
      description: "교육에 필요한 다양한 용품들을 한 곳에서 만나보세요",
      features: ["훈련사 추천 상품", "교육 연계 할인", "빠른 배송"],
      image: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400&q=80",
      primaryAction: { text: "쇼핑몰 둘러보기", path: "/shop" },
      secondaryAction: { text: "추천 상품", path: "/shop/product" }
    },
    {
      id: 7,
      title: "반려인 커뮤니티",
      description: "비슷한 고민을 가진 반려인들과 소통하고 정보를 공유하세요",
      features: ["반려인 소통", "경험 공유", "전문가 Q&A"],
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400&q=80",
      primaryAction: { text: "커뮤니티 참여", path: "/community" },
      secondaryAction: { text: "게시글 작성", path: "/community/create" }
    },
    {
      id: 8,
      title: "기관 및 훈련소 등록",
      description: "전문 교육 기관이나 훈련소를 운영하신다면 Talez와 함께하세요",
      features: ["기관 등록", "코스 관리", "수익 창출"],
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400&q=80",
      primaryAction: { text: "기관 등록하기", path: "/institutes/register" },
      secondaryAction: { text: "파트너 안내", path: "/partners/institutions" }
    }
  ];

  // 서비스 현황 토글 함수
  const toggleServiceStats = () => {
    setIsServiceStatsOpen(prev => !prev);
  };



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
  return renderDefaultHome();

  // 기본 홈페이지 렌더링 함수
  function renderDefaultHome() {
    console.log('Home - renderDefaultHome() - auth state:', { isAuthenticated, userRole, userName });
    return (
      <div className="container mx-auto px-4 py-8">
        {/* 메인 배너 슬라이더 */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-xl h-[168px] bg-gradient-to-r from-primary to-primary/80 shadow-lg">
            {/* 배너 슬라이드들 */}
            <div className="relative h-full">
              {bannerSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {/* 배경 이미지 */}
                  <div className="absolute inset-0">
                    <img 
                      src={slide.image} 
                      alt={slide.title}
                      className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70"></div>
                  </div>
                  
                  {/* 배너 콘텐츠 */}
                  <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-12">
                    <h1 className="text-white text-lg md:text-2xl font-bold mb-2 max-w-3xl">
                      {slide.title}
                    </h1>
                    <p className="text-white/90 text-xs md:text-sm max-w-2xl mb-3">
                      {slide.description}
                    </p>
                    
                    {/* 주요 기능 태그 */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {slide.features.map((feature, idx) => (
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
                        className="bg-white text-primary font-semibold hover:bg-gray-50 px-4 py-1.5 rounded-lg shadow-md text-xs"
                        onClick={() => setLocation(slide.primaryAction.path)}
                      >
                        {slide.primaryAction.text}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white text-white hover:bg-white hover:text-primary px-4 py-1.5 rounded-lg backdrop-blur-sm text-xs"
                        onClick={() => setLocation(slide.secondaryAction.path)}
                      >
                        {slide.secondaryAction.text}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 네비게이션 버튼 */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white h-8 w-8"
              onClick={() => setCurrentSlide(prev => (prev - 1 + bannerSlides.length) % bannerSlides.length)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white h-8 w-8"
              onClick={() => setCurrentSlide(prev => (prev + 1) % bannerSlides.length)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* 슬라이드 인디케이터 */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {bannerSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'bg-white' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 서비스 현황 섹션 */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between cursor-pointer" onClick={toggleServiceStats}>
              <h2 className="text-xl font-bold">서비스 현황</h2>
              <ChevronDown className={`h-5 w-5 transition-transform ${isServiceStatsOpen ? 'rotate-180' : ''}`} />
            </div>
            {isServiceStatsOpen && (
              <div className="mt-6 space-y-6">
                {/* 주간 통계 */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">이번 주 활동</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <span className="text-sm font-medium">새로운 반려견 등록</span>
                      <div className="flex items-center space-x-3">
                        <MiniChart data={[12, 19, 24, 18, 26, 23, 31]} color="blue" />
                        <span className="text-lg font-bold text-blue-600">145</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <span className="text-sm font-medium">완료된 교육 세션</span>
                      <div className="flex items-center space-x-3">
                        <MiniChart data={[8, 15, 12, 20, 18, 25, 22]} color="green" />
                        <span className="text-lg font-bold text-green-600">89</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <span className="text-sm font-medium">활성 사용자</span>
                      <div className="flex items-center space-x-3">
                        <MiniChart data={[45, 52, 48, 61, 58, 67, 73]} color="purple" />
                        <span className="text-lg font-bold text-purple-600">1,247</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 실시간 날씨 정보 */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">산책하기 좋은 날씨</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsWeatherModalOpen(true)}
                    >
                      주간 예보 보기
                    </Button>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">서울 강남구</p>
                        <p className="text-2xl font-bold">22°C</p>
                        <p className="text-sm text-blue-600 dark:text-blue-400">산책하기 좋은 날씨입니다! 🌤️</p>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl">☀️</div>
                        <p className="text-sm text-gray-500 mt-1">맑음</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 인기 훈련사 섹션 */}
        <div className="mb-8">
          <TrendingSection />
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
}