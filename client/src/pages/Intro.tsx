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
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* 배경 그라데이션 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
      
      {/* 배경 패턴 (선택적) */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-12">
        {/* 메인 로고/타이틀 */}
        <div className="space-y-6">
          <h1 className="text-8xl md:text-9xl font-black text-white mb-6 tracking-tight">
            TALEZ
          </h1>
          <div className="w-32 h-1 bg-red-600 mx-auto"></div>
        </div>

        {/* 환영 메시지 */}
        <div className="space-y-8">
          <h2 className="text-3xl md:text-4xl font-light text-white leading-relaxed max-w-4xl mx-auto">
            어서오세요. 반려견 종합 관리 솔루션 
            <span className="font-bold text-red-500"> TALEZ</span> 에 오신것을 환영합니다.
          </h2>
          
          {/* 현재 날짜/시간 */}
          <div className="inline-block bg-gray-800/80 backdrop-blur-sm rounded-lg px-6 py-3 border border-gray-700">
            <p className="text-xl font-mono text-gray-300" data-testid="text-current-time">
              {formatTime(currentTime)}
            </p>
          </div>

          <p className="text-2xl text-gray-300 font-light">
            즐거운 여행을 시작하겠습니다.
          </p>
        </div>

        {/* 시작 버튼 */}
        <div className="pt-8">
          <Button 
            onClick={handleStart}
            className="bg-red-600 hover:bg-red-700 text-white px-12 py-6 text-xl font-bold rounded-md shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 border-0"
            data-testid="button-start-journey"
          >
            시작하기
          </Button>
        </div>

        {/* 서비스 특징 - 넷플릭스 스타일 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
          <div className="group cursor-pointer">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:bg-gray-800/50">
              <div className="text-red-500 text-4xl mb-4">🐕</div>
              <h3 className="font-bold text-white text-xl mb-3">전문 훈련</h3>
              <p className="text-gray-400 leading-relaxed">국가자격 전문 훈련사와 함께하는 체계적인 반려견 교육</p>
            </div>
          </div>
          
          <div className="group cursor-pointer">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:bg-gray-800/50">
              <div className="text-red-500 text-4xl mb-4">🏥</div>
              <h3 className="font-bold text-white text-xl mb-3">건강 관리</h3>
              <p className="text-gray-400 leading-relaxed">반려견의 건강을 체계적으로 관리하고 기록</p>
            </div>
          </div>
          
          <div className="group cursor-pointer">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:bg-gray-800/50">
              <div className="text-red-500 text-4xl mb-4">🛒</div>
              <h3 className="font-bold text-white text-xl mb-3">쇼핑몰</h3>
              <p className="text-gray-400 leading-relaxed">반려견 용품을 한 곳에서 편리하게 구매</p>
            </div>
          </div>
        </div>

        {/* 하단 작은 텍스트 */}
        <div className="pt-12">
          <p className="text-gray-500 text-sm">
            반려견과 함께하는 특별한 여정이 시작됩니다
          </p>
        </div>
      </div>
    </div>
  );
}