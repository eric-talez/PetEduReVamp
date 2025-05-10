import { Button } from '@/components/ui/Button';
import { Link } from 'wouter';
import { useAuth } from '../SimpleApp';
import { BannerSlider } from '@/components/BannerSlider';
import { TrendingSection } from '@/components/TrendingSection';
import { MiniChart } from '@/components/ui/mini-chart';
import { WeeklyWeatherModal } from '@/components/WeeklyWeatherModal';
import { ShopPreview } from '@/components/ShopPreview'; // 인증 상태에 의존하지 않는 컴포넌트
import { useState, lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// 각 역할별 홈 페이지를 동적으로 임포트
const TrainerHome = lazy(() => import('./trainer/TrainerHome'));
const PetOwnerHome = lazy(() => import('./pet-owner/PetOwnerHome'));
const InstituteAdminHome = lazy(() => import('./institute-admin/InstituteAdminHome'));

export default function Home() {
  console.log("홈 페이지 렌더링");
  const { isAuthenticated, userRole, userName, logout } = useAuth();
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  
  // 사용자 역할에 따라 적절한 홈페이지 컴포넌트를 반환
  if (isAuthenticated) {
    let HomeComponent;
    
    switch(userRole) {
      case 'trainer':
        HomeComponent = TrainerHome;
        break;
      case 'pet-owner':
        HomeComponent = PetOwnerHome;
        break;
      case 'institute-admin':
        HomeComponent = InstituteAdminHome;
        break;
      default:
        // 기본 홈페이지(아래 정의됨)로 폴백
        return renderDefaultHome();
    }
    
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <HomeComponent />
      </Suspense>
    );
  }
  
  // 기본 홈페이지 렌더링 함수
  return renderDefaultHome();
  
  function renderDefaultHome() {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* 서비스 현황 및 날씨 - 배너 위 영역 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
          {/* 서비스 현황 카드 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md md:col-span-2 lg:col-span-3">
            <h2 className="text-lg font-semibold mb-4">서비스 현황</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">2,580</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">활성 사용자</span>
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">157</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">인증 훈련사</span>
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">4,750</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">수료 반려견</span>
                </div>
              </div>
            </div>
            
            {/* 미니 차트 */}
            <div className="mt-4">
              <MiniChart data={[
                { name: '1월', value: 140 },
                { name: '2월', value: 180 },
                { name: '3월', value: 220 },
                { name: '4월', value: 280 },
                { name: '5월', value: 310 }
              ]} />
            </div>
          </div>
          
          {/* 날씨 카드 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold">오늘의 날씨</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={() => setIsWeatherModalOpen(true)}
              >
                주간 날씨
              </Button>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 mb-2">
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
              <div className="text-center">
                <p className="text-2xl font-bold">23°C</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">맑음</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">서울특별시 강남구</p>
              </div>
              <div className="flex justify-between w-full mt-4">
                <div className="text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400">습도</p>
                  <p className="font-semibold">45%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400">바람</p>
                  <p className="font-semibold">3m/s</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400">미세먼지</p>
                  <p className="font-semibold">좋음</p>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                <p>산책하기 좋은 날씨입니다!</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 배너 슬라이더와 로그인 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* 배너 슬라이더 - 왼쪽 3/4 */}
          <div className="lg:col-span-3">
            <BannerSlider />
          </div>
          
          {/* 로그인 영역 - 오른쪽 1/4 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col">
            <h2 className="text-lg font-semibold mb-4">로그인</h2>
            {isAuthenticated ? (
              <>
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
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  로그인하여 모든 서비스를 이용해보세요.
                </p>
                <div className="space-y-3">
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => window.location.href = '/auth/login'}
                  >
                    로그인
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.location.href = '/auth/register'}
                  >
                    회원가입
                  </Button>
                </div>
                <div className="mt-4">
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.location.href = '/auth/password-reset'}
                  >
                    비밀번호를 잊으셨나요?
                  </Button>
                </div>
              </>
            )}
            <hr className="my-4 dark:border-gray-700" />
            <div className="space-y-2">
              <Button 
                variant="success" 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => window.location.href = '/auth/login?role=pet-owner'}
              >
                반려인으로 로그인
              </Button>
              <Button 
                variant="info" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => window.location.href = '/auth/login?role=trainer'}
              >
                훈련사로 로그인
              </Button>
              <Button 
                variant="warning" 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => window.location.href = '/auth/login?role=institute'}
              >
                기관으로 로그인
              </Button>
            </div>
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
      </div>
    );
  }
}