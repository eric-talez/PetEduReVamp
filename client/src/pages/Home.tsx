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
import { Loader2, ChevronDown, ChevronRight } from 'lucide-react';
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
                          <div className="text-xs text-gray-600 dark:text-gray-400">활성 사용자</div>
                        </div>
                        <button 
                          onClick={() => setLocation('/dashboard')}
                          className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 py-0.5 px-1.5 rounded-full hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors cursor-pointer"
                          title="대시보드에서 자세히 보기"
                        >
                          +12.5%
                        </button>
                      </div>
                      <div className="h-6 mt-1">
                        <MiniChart 
                          data={[
                            { name: '1월', value: 1800 },
                            { name: '2월', value: 1950 },
                            { name: '3월', value: 2100 },
                            { name: '4월', value: 2350 },
                            { name: '5월', value: 2580 }
                          ]} 
                          stroke="#3b82f6"
                          fill="rgba(59, 130, 246, 0.2)"
                          height={25}
                        />
                      </div>
                    </div>
                    
                    {/* 인증 훈련사 */}
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xl font-bold text-green-600 dark:text-green-400">157</span>
                          <div className="text-xs text-gray-600 dark:text-gray-400">인증 훈련사</div>
                        </div>
                        <button 
                          onClick={() => setLocation('/trainers')}
                          className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 py-0.5 px-1.5 rounded-full hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors cursor-pointer"
                          title="훈련사 목록 보기"
                        >
                          +4.7%
                        </button>
                      </div>
                      <div className="h-6 mt-1">
                        <MiniChart 
                          data={[
                            { name: '1월', value: 135 },
                            { name: '2월', value: 142 },
                            { name: '3월', value: 147 },
                            { name: '4월', value: 152 },
                            { name: '5월', value: 157 }
                          ]} 
                          stroke="#16a34a"
                          fill="rgba(22, 163, 74, 0.2)"
                          height={25}
                        />
                      </div>
                    </div>
                    
                    {/* 수료 반려견 */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xl font-bold text-purple-600 dark:text-purple-400">4,750</span>
                          <div className="text-xs text-gray-600 dark:text-gray-400">수료 반려견</div>
                        </div>
                        <button 
                          onClick={() => setLocation('/courses')}
                          className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 py-0.5 px-1.5 rounded-full hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors cursor-pointer"
                          title="강좌 목록 보기"
                        >
                          +21.3%
                        </button>
                      </div>
                      <div className="h-6 mt-1">
                        <MiniChart 
                          data={[
                            { name: '1월', value: 3200 },
                            { name: '2월', value: 3650 },
                            { name: '3월', value: 4050 },
                            { name: '4월', value: 4450 },
                            { name: '5월', value: 4750 }
                          ]} 
                          stroke="#9333ea"
                          fill="rgba(147, 51, 234, 0.2)"
                          height={25}
                        />
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
        
        {/* 배너 슬라이더와 로그인 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* 배너 슬라이더 - 왼쪽 3/4 */}
          <div className="lg:col-span-3">
            <BannerSlider />
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