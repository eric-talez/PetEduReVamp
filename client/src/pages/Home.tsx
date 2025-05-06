import { Button } from '@/components/ui/Button';
import { Link } from 'wouter';
import { useAppAuth } from '../hooks/useAppAuth';

export default function Home() {
  const auth = useAppAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 상단 영역: 배너와 프로필 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* 배너 영역 */}
        <div className="lg:col-span-2 relative rounded-xl overflow-hidden h-60 md:h-80 bg-gradient-to-r from-primary/80 to-accent/80 shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400"
            alt="반려견 교육"
            className="w-full h-full object-cover absolute mix-blend-overlay"
          />
          
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/30 mix-blend-multiply"></div>
          
          <div className="relative h-full flex flex-col justify-center px-8 md:px-12">
            <h1 className="text-white text-2xl md:text-4xl font-display font-bold mb-2 md:mb-4 max-w-xl">
              반려견과 함께하는 특별한 교육 여정
            </h1>
            <p className="text-white text-sm md:text-lg max-w-xl mb-6">
              PetEduPlatform과 함께 전문 훈련사의 체계적인 교육으로 더 행복한 반려생활을 시작하세요.
            </p>
            <div>
              <Button
                variant="default"
                className="bg-white text-primary font-semibold mr-3"
              >
                <Link href="/courses">강의 둘러보기</Link>
              </Button>
              
              <Button 
                variant="outline"
                className="text-white border-white hover:bg-white/10"
              >
                <Link href="/free-webinar">무료 웨비나 참여</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* 프로필 영역 (로그인/회원가입) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          {auth.isAuthenticated ? (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-primary">{auth.userName?.charAt(0) || "U"}</span>
              </div>
              <p className="font-semibold text-xl mb-2">{auth.userName || "사용자"} 님</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {auth.userRole === 'pet-owner' ? '견주 회원' : 
                 auth.userRole === 'trainer' ? '훈련사 회원' : 
                 auth.userRole === 'institute-admin' ? '기관 관리자' : 
                 auth.userRole === 'admin' ? '시스템 관리자' : '일반 회원'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                <Link href="/my-page" className="w-full">
                  <Button variant="default" className="w-full">마이페이지</Button>
                </Link>
                <Button variant="outline" className="w-full" onClick={auth.logout}>
                  로그아웃
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-4">로그인 후 더 많은 서비스를 이용해보세요</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                <Button variant="default" className="w-full">
                  <Link href="/auth">로그인</Link>
                </Button>
                <Button variant="outline" className="w-full">
                  <Link href="/auth?tab=register">회원가입</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 서비스 현황 및 날씨 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 mt-2">
        {/* 날씨 영역 */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-2">오늘의 날씨</h3>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold">24°C</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">서울특별시 강남구</p>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm">산책하기 좋은 날씨입니다! 반려견과 함께 외출해보세요.</p>
          </div>
        </div>
        
        {/* 등록된 전문 훈련사 */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-2">등록된 전문 훈련사</h3>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold">254명</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">지난 달 대비 +12명</p>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm">다양한 분야의 전문 훈련사들이 대기중입니다.</p>
          </div>
        </div>
        
        {/* 등록된 교육 기관 */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-2">등록된 교육 기관</h3>
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold">86개</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">지난 달 대비 +3개</p>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm">전국 각지의 교육 기관에서 수준 높은 교육을 제공합니다.</p>
          </div>
        </div>
        
        {/* 활성화된 교육 과정 */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-2">활성화된 교육 과정</h3>
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold">425개</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">지난 달 대비 +28개</p>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm">다양한 교육 과정이 매일 새롭게 등록되고 있습니다.</p>
          </div>
        </div>
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
    </div>
  );
}