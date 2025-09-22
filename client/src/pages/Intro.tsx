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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* 메인 로고/타이틀 */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-[#2BAA61] mb-4">TALEZ</h1>
          <div className="w-24 h-1 bg-[#2BAA61] mx-auto rounded-full"></div>
        </div>

        {/* 환영 메시지 카드 */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 leading-relaxed">
                어서오세요. 반려견 종합 관리 솔루션 talez 에 오신것을 환영합니다.
              </h2>
              
              {/* 현재 날짜/시간 */}
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#2BAA61]">
                <p className="text-lg font-mono text-gray-700" data-testid="text-current-time">
                  {formatTime(currentTime)}
                </p>
              </div>

              <p className="text-lg text-gray-600 font-medium">
                즐거운 여행을 시작하겠습니다.
              </p>
            </div>

            {/* 시작 버튼 */}
            <div className="pt-4">
              <Button 
                onClick={handleStart}
                className="bg-[#2BAA61] hover:bg-[#249954] text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                data-testid="button-start-journey"
              >
                여행 시작하기
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 서비스 특징 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <div className="text-[#2BAA61] text-3xl mb-3">🐕</div>
            <h3 className="font-semibold text-gray-800 mb-2">전문 훈련</h3>
            <p className="text-sm text-gray-600">국가자격 전문 훈련사와 함께하는 체계적인 반려견 교육</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <div className="text-[#FFA726] text-3xl mb-3">🏥</div>
            <h3 className="font-semibold text-gray-800 mb-2">건강 관리</h3>
            <p className="text-sm text-gray-600">반려견의 건강을 체계적으로 관리하고 기록</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <div className="text-[#29B5F6] text-3xl mb-3">🛒</div>
            <h3 className="font-semibold text-gray-800 mb-2">쇼핑몰</h3>
            <p className="text-sm text-gray-600">반려견 용품을 한 곳에서 편리하게 구매</p>
          </div>
        </div>
      </div>
    </div>
  );
}