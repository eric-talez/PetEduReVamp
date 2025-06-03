import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { BannerSlider } from '@/components/BannerSlider';
import { TrendingSection } from '@/components/TrendingSection';
import { MiniChart } from '@/components/ui/mini-chart';
import { WeeklyWeatherModal } from '@/components/WeeklyWeatherModal';
import { ShopPreview } from '@/components/ShopPreview'; // 인증 상태에 의존하지 않는 컴포넌트
import { SocialLoginButtons } from '@/components/SocialLoginButtons'; // 소셜 로그인 버튼
import { useState, lazy, Suspense } from 'react';
import { Loader2, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
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
  const [currentBannerSlide, setCurrentBannerSlide] = useState(0);

  // 메인 배너 슬라이드 데이터 (8개)
  const bannerSlides = [
    {
      title: "반려견 전문 훈련사와 함께하는 맞춤형 교육",
      description: "1:1 전문 상담으로 반려견에게 알맞은 교육 프로그램을 찾아드세요",
      features: ["전문가 코칭", "행동 교정", "실시간 화상 교육"],
      image: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=600&q=80",
      primaryAction: { text: "지금 시작하기", path: "/courses" },
      secondaryAction: { text: "무료 체험", path: "/free-trial" }
    },
    {
      title: "AI 기반 반려견 행동 분석",
      description: "최신 인공지능 기술로 반려견의 행동과 감정을 분석하고 맞춤형 솔루션을 제공합니다",
      features: ["영상 분석", "감정 모니터링", "맞춤 가이드"],
      image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=600&q=80",
      primaryAction: { text: "AI 분석 체험", path: "/ai-analysis" },
      secondaryAction: { text: "기술 소개", path: "/ai-technology" }
    },
    {
      title: "반려견 친화적 장소 찾기",
      description: "전국의 반려견 동반 가능한 카페, 공원, 펜션을 한눈에 확인하세요",
      features: ["지역별 검색", "실시간 정보", "커뮤니티 리뷰"],
      image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=600&q=80",
      primaryAction: { text: "장소 찾기", path: "/locations" },
      secondaryAction: { text: "지도 보기", path: "/map" }
    },
    {
      title: "반려견 건강 관리",
      description: "전문 수의사와 함께하는 체계적인 건강 관리 서비스",
      features: ["건강 체크", "예방 접종", "영양 상담"],
      image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=600&q=80",
      primaryAction: { text: "건강 체크", path: "/health-check" },
      secondaryAction: { text: "수의사 상담", path: "/vet-consultation" }
    },
    {
      title: "반려견 소셜 커뮤니티",
      description: "비슷한 관심사를 가진 반려인들과 소통하고 경험을 공유하세요",
      features: ["지역 모임", "실시간 Q&A", "육아 팁 공유"],
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=600&q=80",
      primaryAction: { text: "커뮤니티 참여", path: "/community" },
      secondaryAction: { text: "모임 찾기", path: "/meetups" }
    },
    {
      title: "온라인 화상 교육",
      description: "언제 어디서나 편리하게 전문가와 실시간 화상으로 교육받으세요",
      features: ["화상 수업", "녹화 복습", "1:1 상담"],
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=600&q=80",
      primaryAction: { text: "화상 교육", path: "/video-training" },
      secondaryAction: { text: "데모 보기", path: "/demo" }
    },
    {
      title: "반려용품 쇼핑몰",
      description: "검증된 고품질 반려용품을 합리적인 가격에 만나보세요",
      features: ["엄선된 상품", "빠른 배송", "전문가 추천"],
      image: "https://images.unsplash.com/photo-1593134257782-e89567b7718a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=600&q=80",
      primaryAction: { text: "쇼핑하기", path: "/shop" },
      secondaryAction: { text: "추천 상품", path: "/shop/recommended" }
    },
    {
      title: "전문 교육 기관 연결",
      description: "전국의 인증된 반려견 교육 기관과 전문 훈련사를 만나보세요",
      features: ["기관 인증", "전문 훈련사", "체계적 커리큘럼"],
      image: "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=600&q=80",
      primaryAction: { text: "기관 찾기", path: "/institutes" },
      secondaryAction: { text: "훈련사 보기", path: "/trainers" }
    }
  ];

  // 서비스 현황 토글 함수
  const toggleServiceStats = () => {
    setIsServiceStatsOpen(prev => !prev);
  };

  // 배너 슬라이드 네비게이션
  const nextBannerSlide = () => {
    setCurrentBannerSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevBannerSlide = () => {
    setCurrentBannerSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
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
        {/* 메인 전면 배너 슬라이더 */}
        <div className="mb-6">
          <div className="relative overflow-hidden rounded-xl h-[280px] bg-gradient-to-r from-primary/80 to-accent/80 shadow-lg">
            {/* 배너 슬라이드 이미지 */}
            <div className="absolute inset-0 transition-all duration-500 ease-in-out">
              <img 
                src={bannerSlides[currentBannerSlide].image} 
                alt={bannerSlides[currentBannerSlide].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
            </div>
            
            {/* 배너 콘텐츠 */}
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12">
              <h1 className="text-white text-2xl md:text-4xl font-bold mb-3 max-w-2xl">
                {bannerSlides[currentBannerSlide].title}
              </h1>
              <p className="text-white text-sm md:text-lg max-w-2xl mb-4 opacity-90">
                {bannerSlides[currentBannerSlide].description}
              </p>
              
              {/* 주요 기능 태그 */}
              <div className="flex flex-wrap gap-2 mb-6">
                {bannerSlides[currentBannerSlide].features.map((feature, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center text-xs md:text-sm bg-white/20 hover:bg-white/30 transition-colors text-white px-3 py-1.5 rounded-full backdrop-blur-sm"
                  >
                    <span className="mr-1.5 text-green-300 font-bold">✓</span> {feature}
                  </span>
                ))}
              </div>
              
              {/* 액션 버튼 */}
              <div className="flex flex-wrap gap-3">
                <Button
                  className="bg-white text-primary font-semibold hover:bg-gray-50 text-sm md:text-base py-2 px-6 rounded-full shadow-md transition-all hover:scale-105"
                  onClick={() => setLocation(bannerSlides[currentBannerSlide].primaryAction.path)}
                >
                  {bannerSlides[currentBannerSlide].primaryAction.text}
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary text-sm md:text-base py-2 px-6 rounded-full backdrop-blur-sm transition-all"
                  onClick={() => setLocation(bannerSlides[currentBannerSlide].secondaryAction.path)}
                >
                  {bannerSlides[currentBannerSlide].secondaryAction.text}
                </Button>
              </div>
            </div>
            
            {/* 네비게이션 화살표 */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-sm"
              onClick={prevBannerSlide}
              aria-label="이전 배너"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-sm"
              onClick={nextBannerSlide}
              aria-label="다음 배너"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            
            {/* 슬라이드 인디케이터 */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {bannerSlides.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentBannerSlide === index ? 'bg-white' : 'bg-white/40'
                  }`}
                  onClick={() => setCurrentBannerSlide(index)}
                  aria-label={`${index + 1}번째 배너로 이동`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 로그인 영역과 간단한 서비스 안내 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* 빈 공간 - 왼쪽 3/4 */}
          <div className="lg:col-span-3">
            {/* 추가 콘텐츠 영역 (필요시 사용) */}
          </div>

          {/* 로그인 영역 - 오른쪽 1/4 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col h-[400px] overflow-y-auto">
            {isAuthenticated ? (
              <>
                <h2 className="text-lg font-semibold mb-4">환영합니다</h2>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <span className="text-primary font-bold">{userName?.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{userName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {userRole === 'pet-owner' && '반려인'}
                      {userRole === 'trainer' && '훈련사'}
                      {userRole === 'institute-admin' && '기관 관리자'}
                      {userRole === 'admin' && '관리자'}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="default" 
                  className="mb-2 w-full"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  대시보드로 이동
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={logout}
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-4">Talez 서비스 안내</h2>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
                  <h3 className="font-medium text-blue-700 dark:text-blue-400 mb-1">맞춤형 반려견 교육</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">반려견의 특성과 수준에 맞는 교육을 전문 훈련사와 함께 시작해보세요.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-4">
                  <h3 className="font-medium text-green-700 dark:text-green-400 mb-1">AI 행동 분석</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">인공지능을 활용한 반려견 행동 분석으로 효과적인 훈련 방법을 찾아보세요.</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg mb-4">
                  <h3 className="font-medium text-purple-700 dark:text-purple-400 mb-1">반려견 친화 장소</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">전국의 반려견 친화적인 장소를 찾고 즐거운 시간을 보내세요.</p>
                </div>
                <div className="mt-auto text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    상단의 로그인 버튼을 통해 Talez를 시작하세요.
                  </p>
                </div>
              </>
            )}
            <hr className="my-4 dark:border-gray-700" />
            {/* 비로그인 시에만 소셜 로그인 안내 표시 */}
            {!isAuthenticated && (
              <div className="text-sm text-center text-gray-500 dark:text-gray-400">
                <p>카카오, 네이버로 간편하게 시작할 수 있습니다.</p>
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