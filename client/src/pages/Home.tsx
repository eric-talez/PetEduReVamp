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

// 훈련사 홈 페이지를 동적으로 임포트
const TrainerHome = lazy(() => import('./trainer/TrainerHome'));

export default function Home() {
  console.log("홈 페이지 렌더링");
  const { isAuthenticated, userRole, userName, logout } = useAuth();
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  
  // 훈련사 권한일 경우 훈련사 홈페이지를 표시
  if (isAuthenticated && userRole === 'trainer') {
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <TrainerHome />
      </Suspense>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 서비스 현황 및 날씨 - 배너 위 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
        {/* 등록된 전문 훈련사 */}
        <Link href="/trainers" className="group">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">등록된 전문 훈련사</h3>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full mr-3 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold">254명</p>
                <div className="flex items-center">
                  <span className="text-sm text-green-500 dark:text-green-400 font-medium">+12명</span>
                  <span className="mx-1 text-gray-500 dark:text-gray-400 text-xs">지난 달 대비</span>
                  <span className="text-green-500 dark:text-green-400">↑</span>
                </div>
              </div>
            </div>
            
            <div className="mt-3 h-12">
              <MiniChart 
                data={[
                  { name: '7월', value: 220 },
                  { name: '8월', value: 230 },
                  { name: '9월', value: 235 },
                  { name: '10월', value: 242 },
                  { name: '11월', value: 254 }
                ]} 
                stroke="#22c55e"
                fill="rgba(34, 197, 94, 0.2)"
                positive={true}
              />
            </div>
            
            <div className="mt-2">
              <p className="text-sm">다양한 분야의 전문 훈련사들이 대기중입니다.</p>
            </div>
          </div>
        </Link>
        
        {/* 등록된 교육 기관 */}
        <Link href="/institutes" className="group">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">등록된 교육 기관</h3>
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full mr-3 group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold">86개</p>
                <div className="flex items-center">
                  <span className="text-sm text-purple-500 dark:text-purple-400 font-medium">+3개</span>
                  <span className="mx-1 text-gray-500 dark:text-gray-400 text-xs">지난 달 대비</span>
                  <span className="text-purple-500 dark:text-purple-400">↑</span>
                </div>
              </div>
            </div>
            
            <div className="mt-3 h-12">
              <MiniChart 
                data={[
                  { name: '7월', value: 78 },
                  { name: '8월', value: 80 },
                  { name: '9월', value: 83 },
                  { name: '10월', value: 83 },
                  { name: '11월', value: 86 }
                ]} 
                stroke="#a855f7"
                fill="rgba(168, 85, 247, 0.2)"
                positive={true}
              />
            </div>
            
            <div className="mt-2">
              <p className="text-sm">전국 각지의 교육 기관에서 수준 높은 교육을 제공합니다.</p>
            </div>
          </div>
        </Link>
        
        {/* 활성화된 교육 과정 */}
        <Link href="/courses" className="group">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">활성화된 교육 과정</h3>
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-full mr-3 group-hover:bg-amber-200 dark:group-hover:bg-amber-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold">425개</p>
                <div className="flex items-center">
                  <span className="text-sm text-amber-500 dark:text-amber-400 font-medium">+28개</span>
                  <span className="mx-1 text-gray-500 dark:text-gray-400 text-xs">지난 달 대비</span>
                  <span className="text-amber-500 dark:text-amber-400">↑</span>
                </div>
              </div>
            </div>
            
            <div className="mt-3 h-12">
              <MiniChart 
                data={[
                  { name: '7월', value: 350 },
                  { name: '8월', value: 375 },
                  { name: '9월', value: 390 },
                  { name: '10월', value: 397 },
                  { name: '11월', value: 425 }
                ]} 
                stroke="#f59e0b"
                fill="rgba(245, 158, 11, 0.2)"
                positive={true}
              />
            </div>
            
            <div className="mt-2">
              <p className="text-sm">다양한 교육 과정이 매일 새롭게 등록되고 있습니다.</p>
            </div>
          </div>
        </Link>
        
        {/* 날씨 영역 - 맨 오른쪽으로 이동 */}
        <div className="group" onClick={() => setIsWeatherModalOpen(true)}>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">오늘의 날씨</h3>
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full mr-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold">24°C</p>
                <div className="flex items-center">
                  <span className="text-sm text-blue-500 dark:text-blue-400 font-medium">좋음</span>
                  <span className="mx-1 text-gray-500 dark:text-gray-400 text-xs">미세먼지</span>
                </div>
              </div>
            </div>
            
            <div className="mt-3 h-12">
              <MiniChart 
                data={[
                  { name: '오전 6시', value: 18 },
                  { name: '오전 9시', value: 20 },
                  { name: '오후 12시', value: 23 },
                  { name: '오후 3시', value: 24 },
                  { name: '오후 6시', value: 22 }
                ]} 
                stroke="#3b82f6"
                fill="rgba(59, 130, 246, 0.2)"
                positive={true}
              />
            </div>
            
            <div className="mt-2">
              <p className="text-sm">산책하기 좋은 날씨입니다! 반려견과 함께 외출해보세요.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 상단 영역: 배너와 프로필 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* 배너 영역 */}
        <div className="lg:col-span-2">
          <BannerSlider />
        </div>
        
        {/* 프로필 영역 (로그인/회원가입) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {isAuthenticated ? (
            <div className="flex flex-col h-full">
              {/* 로그인된 상태 */}
              <div className="bg-primary/10 dark:bg-primary/5 p-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">{userName?.charAt(0) || "U"}</span>
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-lg">{userName || "사용자"} 님</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {userRole === 'pet-owner' ? '견주 회원' : 
                      userRole === 'trainer' ? '훈련사 회원' : 
                      userRole === 'institute-admin' ? '기관 관리자' : 
                      userRole === 'admin' ? '시스템 관리자' : '일반 회원'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 flex-1">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <Link href="/my-page" className="w-full">
                    <Button variant="default" className="w-full">마이페이지</Button>
                  </Link>
                  <Button variant="outline" className="w-full" onClick={logout}>
                    로그아웃
                  </Button>
                </div>
                
                <div className="space-y-2 mt-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    안내사항
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 p-2 rounded">
                    반려견 교육 및 훈련 관련 서비스를 이용하시려면 내 반려견 정보를 등록해주세요.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* 로그인 안내 */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/20 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-medium text-gray-800 dark:text-gray-200">로그인</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  로그인하여 맞춤형 훈련 서비스를 이용해보세요
                </p>
              </div>
              
              <div className="p-4">
                <div className="space-y-3 mb-4">
                  <Link href="/auth" className="w-full">
                    <Button variant="default" className="w-full">로그인</Button>
                  </Link>
                  <Link href="/auth?tab=register" className="w-full">
                    <Button variant="outline" className="w-full">회원가입</Button>
                  </Link>
                </div>
                
                <div className="flex justify-center text-xs text-gray-500 dark:text-gray-400 space-x-3 mb-4">
                  <Link href="/auth/find-id" className="hover:text-primary hover:underline">아이디 찾기</Link>
                  <span>|</span>
                  <Link href="/auth/reset-password" className="hover:text-primary hover:underline">비밀번호 찾기</Link>
                </div>
                
                {/* 소셜 로그인 */}
                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs text-gray-500 dark:text-gray-400">
                    <span className="px-2 bg-white dark:bg-gray-800">소셜 계정으로 로그인</span>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-3">
                  <button className="p-2 rounded-full bg-yellow-400 text-white hover:bg-yellow-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                      <path fill="currentColor" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z"/>
                      <path fill="white" d="M16.2 11.1h-3.1V8.3h-2.2v2.8H7.8v2.1h3.1v2.8h2.2v-2.8h3.1v-2.1Z"/>
                    </svg>
                  </button>
                  <button className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                      <path fill="currentColor" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z"/>
                      <path fill="white" d="M12.7 14.9c-.5.2-1 .4-1.6.4-2.5 0-4.6-2-4.6-4.6s2-4.6 4.6-4.6c.6 0 1.1.1 1.6.3.7.3 1.3.7 1.8 1.3.4.5.7 1.1.9 1.7.2.4.2.9.2 1.4 0 .6-.1 1.1-.3 1.6-.4.9-1.1 1.6-2 2-.6.3-1 .4-1.6.4-.3 0-.6-.1-.9-.2-.2-.1-.5-.3-.6-.5h-.1c0 .1-.1.2-.1.4 0 .1-.1.2-.1.3v.9h-1.4v-7.7h1.4v.7h.1c.1-.2.3-.4.6-.5.3-.1.6-.2.9-.2.6 0 1.1.1 1.6.4.9.4 1.6 1.1 2 2 .2.5.3 1 .3 1.6 0 .5-.1 1-.3 1.5-.3.7-.8 1.4-1.5 1.9h-.9Z"/>
                      <path fill="white" d="M12.2 12.7c.2 0 .3 0 .5-.1.3-.1.5-.3.7-.5.2-.2.3-.5.3-.8.1-.3.1-.5.1-.8 0-.3 0-.5-.1-.8-.1-.3-.2-.5-.3-.8-.2-.2-.4-.4-.7-.5-.2-.1-.3-.1-.5-.1-.2 0-.3 0-.5.1-.3.1-.5.3-.7.5-.2.2-.3.5-.4.8-.1.3-.1.5-.1.8 0 .3 0 .5.1.8.1.3.2.5.4.8.2.2.4.4.7.5.1 0 .3.1.5.1Z"/>
                    </svg>
                  </button>
                  <button className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                      <path fill="currentColor" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z"/>
                      <path fill="white" d="M16.1 12c0 .3-.1.6-.3.8l-.1.1c-.1.1-.1.2-.2.3l-2.3 3c-.1.2-.3.3-.5.4-.2.1-.5.1-.7 0-.1 0-.3-.1-.4-.2-.2-.2-.3-.4-.3-.6-.1-.3 0-.5.1-.7l1.6-2.1h-5c-.3 0-.5-.1-.7-.3-.2-.2-.3-.4-.3-.7 0-.3.1-.5.3-.7.2-.2.4-.3.7-.3h5l-1.6-2.1c-.2-.2-.2-.5-.1-.7 0-.2.1-.4.3-.6.1-.1.2-.2.4-.2.3-.1.5-.1.7 0 .2.1.4.2.5.4l2.3 3c.1.1.1.2.2.3v.1c.1.2.2.5.2.8h.2Z"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* 안내 문구 */}
              <div className="mt-auto border-t border-gray-100 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700/20">
                <div className="flex items-start space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <p className="font-medium mb-1">회원가입 시 혜택</p>
                    <ul className="list-disc list-inside ml-1 space-y-1">
                      <li>반려견 맞춤 교육 프로그램 추천</li>
                      <li>전문 훈련사 1:1 상담 서비스</li>
                      <li>신규 회원 첫 구매 할인 쿠폰</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      

      
      {/* 디버깅용 링크 */}
      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-xl">
        <h2 className="text-lg font-semibold mb-2">디버깅 링크</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          <a href="/shop-new" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Shop-New 페이지 직접 접근
          </a>
          <a href="/shop" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Shop 페이지
          </a>
        </div>
      </div>
      
      {/* 트렌딩 섹션 추가 */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6">트렌딩</h2>
        <TrendingSection />
      </div>
      
      {/* 주요 서비스 섹션 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">PetEdu 주요 서비스</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">전문 훈련 프로그램</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">전문 트레이너가 제공하는 체계적인 커리큘럼으로 효과적인 반려견 교육을 경험하세요.</p>
            <Button variant="outline" size="sm" className="w-full">
              <Link href="/courses">프로그램 보기</Link>
            </Button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">1:1 맞춤 교육</h3>
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