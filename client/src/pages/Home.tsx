import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { TrendingSection } from '@/components/TrendingSection';
import { WeeklyWeatherModal } from '@/components/WeeklyWeatherModal';
import { ShopPreview } from '@/components/ShopPreview';
import { SocialLoginButtons } from '@/components/SocialLoginButtons';
import { useState, lazy, Suspense } from 'react';
import { Loader2, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PasswordResetForm } from '@/components/PasswordResetForm';

// 각 역할별 홈 페이지를 동적으로 임포트
const TrainerHome = lazy(() => import('./trainer/TrainerHome'));
const PetOwnerHome = lazy(() => import('./pet-owner/PetOwnerHome'));
const InstituteAdminHome = lazy(() => import('./institute-admin/InstituteAdminHome'));

export default function Home() {
  const { isAuthenticated, userRole, userName, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [isServiceStatsOpen, setIsServiceStatsOpen] = useState(true);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  // 간단한 메인 배너 데이터
  const mainBanner = {
    title: "Talez - 반려견과 함께하는 특별한 여정",
    subtitle: "전문 훈련사와 AI 기술로 반려견 교육의 새로운 기준을 만들어갑니다",
    features: ["전문가 1:1 교육", "AI 행동 분석", "실시간 상담", "커뮤니티"],
    image: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400&q=80"
  };

  // 서비스 현황 토글 함수
  const toggleServiceStats = () => {
    setIsServiceStatsOpen(prev => !prev);
  };

  // 빠른 로그인 처리 함수
  const handleQuickLogin = (role: string) => {
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

  return renderDefaultHome();

  // 기본 홈페이지 렌더링 함수
  function renderDefaultHome() {
    console.log('Home - renderDefaultHome() - auth state:', { isAuthenticated, userRole, userName });
    return (
      <div className="container mx-auto px-4 py-8">
        {/* 메인 배너 */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-xl h-[240px] bg-gradient-to-r from-primary to-primary/80 shadow-lg">
            {/* 배경 이미지 */}
            <div className="absolute inset-0">
              <img 
                src={mainBanner.image} 
                alt={mainBanner.title}
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70"></div>
            </div>
            
            {/* 배너 콘텐츠 */}
            <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-12">
              <h1 className="text-white text-2xl md:text-3xl font-bold mb-3 max-w-3xl">
                {mainBanner.title}
              </h1>
              <p className="text-white/90 text-sm md:text-lg max-w-2xl mb-4">
                {mainBanner.subtitle}
              </p>
              
              {/* 주요 기능 태그 */}
              <div className="flex flex-wrap gap-2 mb-6">
                {mainBanner.features.map((feature, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center text-xs md:text-sm bg-white/20 text-white px-3 py-1.5 rounded-full backdrop-blur-sm"
                  >
                    <span className="mr-1.5 text-yellow-300">✓</span> {feature}
                  </span>
                ))}
              </div>
              
              {/* 액션 버튼 */}
              <div className="flex flex-wrap gap-3">
                <Button
                  className="bg-white text-primary font-semibold hover:bg-gray-50 px-6 py-2 rounded-lg shadow-md"
                  onClick={() => setLocation('/courses')}
                >
                  교육 시작하기
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary px-6 py-2 rounded-lg backdrop-blur-sm"
                  onClick={() => setLocation('/about')}
                >
                  서비스 소개
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 서비스 현황 섹션 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Talez 서비스 현황</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleServiceStats}
              className="flex items-center gap-2"
            >
              {isServiceStatsOpen ? '접기' : '펼치기'}
              <ChevronDown className={`h-4 w-4 transition-transform ${isServiceStatsOpen ? 'rotate-180' : ''}`} />
            </Button>
          </div>
          
          {isServiceStatsOpen && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2,500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">등록된 반려견</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">150+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">전문 훈련사</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">50+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">교육 프로그램</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">95%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">고객 만족도</div>
              </div>
            </div>
          )}
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



        {/* 빠른 로그인 영역 */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-8 mb-8">
          <h2 className="text-xl font-bold mb-4 text-center">빠른 체험하기</h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
            역할별로 Talez 서비스를 빠르게 체험해보세요
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center justify-center"
              onClick={() => handleQuickLogin('pet-owner')}
            >
              <span className="font-semibold">반려인</span>
              <span className="text-xs text-gray-500">Pet Owner</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center justify-center"
              onClick={() => handleQuickLogin('trainer')}
            >
              <span className="font-semibold">훈련사</span>
              <span className="text-xs text-gray-500">Trainer</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center justify-center"
              onClick={() => handleQuickLogin('institute-admin')}
            >
              <span className="font-semibold">기관 관리자</span>
              <span className="text-xs text-gray-500">Institute Admin</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center justify-center"
              onClick={() => handleQuickLogin('admin')}
            >
              <span className="font-semibold">시스템 관리자</span>
              <span className="text-xs text-gray-500">Admin</span>
            </Button>
          </div>
        </div>

        {/* 쇼핑 프리뷰 섹션 */}
        <div className="mb-8">
          <ShopPreview />
        </div>

        {/* 주간 날씨 모달 */}
        <WeeklyWeatherModal 
          isOpen={isWeatherModalOpen} 
          onClose={() => setIsWeatherModalOpen(false)} 
        />

        {/* 비밀번호 재설정 모달 */}
        <Dialog open={showPasswordReset} onOpenChange={setShowPasswordReset}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>비밀번호 재설정</DialogTitle>
            </DialogHeader>
            <PasswordResetForm onClose={() => setShowPasswordReset(false)} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}