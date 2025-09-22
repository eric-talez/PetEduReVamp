import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Intro() {
  const [, setLocation] = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // 매초 시간 업데이트
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleStart = () => {
    // localStorage에 방문 기록 저장
    localStorage.setItem('talez_visited', 'true');
    setLocation('/');
  };

  const formatTime = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}년 ${month}월 ${day}일 ${hours}시${minutes}분${seconds}초`;
  };

  return (
    <div className="min-h-screen bg-[#141414] relative overflow-hidden">
      {/* 배경 이미지 (TALEZ 관련 이미지로 대체 가능) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/attached_assets/KakaoTalk_Photo_2025-07-05-22-37-00 002_1751722697071.png')`
        }}
      />
      
      {/* 넷플릭스 스타일 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40"></div>

      {/* 헤더 (넷플릭스 스타일) */}
      <header className="relative z-20 flex items-center justify-between p-6 md:p-8">
        <div className="text-[#E50914] text-2xl md:text-3xl font-black">
          TALEZ
        </div>
        <div className="text-white text-sm">
          {formatTime(currentTime)}
        </div>
      </header>

      {/* 히어로 콘텐츠 (왼쪽 정렬 - 넷플릭스 스타일) */}
      <div className="relative z-10 flex items-center min-h-[80vh] px-6 md:px-16 lg:px-20">
        <div className="max-w-2xl space-y-6">
          {/* 메인 타이틀 */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight">
            TALEZ
          </h1>
          
          {/* 서브타이틀 */}
          <h2 className="text-xl md:text-2xl lg:text-3xl text-white font-light leading-relaxed">
            어서오세요. 반려견 종합 관리 솔루션에 오신것을 환영합니다.
          </h2>
          
          {/* 설명 텍스트 */}
          <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-xl" data-testid="text-current-time">
            {formatTime(currentTime)} - 즐거운 여행을 시작하겠습니다.
          </p>

          {/* 넷플릭스 스타일 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button 
              onClick={handleStart}
              className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-bold rounded-md flex items-center gap-2 transition-all duration-200"
              data-testid="button-start-journey"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              시작하기
            </Button>
            
            <Button 
              variant="outline"
              className="bg-gray-600/70 text-white border-gray-500 hover:bg-gray-500/70 px-8 py-3 text-lg font-semibold rounded-md flex items-center gap-2 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
              더 알아보기
            </Button>
          </div>

          {/* 서비스 특징 (간단하게) */}
          <div className="flex flex-wrap gap-4 pt-6">
            <span className="bg-gray-800/80 text-white px-3 py-1 rounded text-sm">전문 훈련</span>
            <span className="bg-gray-800/80 text-white px-3 py-1 rounded text-sm">건강 관리</span>
            <span className="bg-gray-800/80 text-white px-3 py-1 rounded text-sm">반려용품</span>
            <span className="bg-gray-800/80 text-white px-3 py-1 rounded text-sm">커뮤니티</span>
          </div>
        </div>
      </div>

      {/* 하단 정보 */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black to-transparent p-6 md:p-8">
        <p className="text-gray-400 text-sm max-w-2xl">
          반려견과 함께하는 특별한 여정이 시작됩니다. 전문 훈련사와 함께하는 체계적인 교육부터 건강 관리, 쇼핑까지 모든 것을 한 곳에서.
        </p>
      </div>
    </div>
  );
}