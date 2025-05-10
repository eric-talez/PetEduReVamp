import React, { useState } from 'react';
import { Activity, ArrowUp, ChevronDown, ChevronRight, Droplets, Wind, Sun } from 'lucide-react';

interface StatisticsSectionProps {
  expanded: boolean;
}

export function StatisticsSection({ expanded }: StatisticsSectionProps) {
  // 서비스 상태 및 날씨 정보 토글을 위한 통합 상태
  const [isOpen, setIsOpen] = useState(true);
  
  // 토글 함수
  const toggleSection = () => {
    console.log("서비스 현황 토글 실행:", !isOpen);
    setIsOpen(prev => !prev);
  };

  // 사이드바가 축소되었을 때는 아이콘만 표시
  if (!expanded) {
    return (
      <div className="mt-auto mb-4 px-2">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 flex justify-center">
          <Activity className="w-5 h-5 text-primary" aria-label="서비스 정보" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-auto mb-4 px-3">
      {/* 서비스 정보 컨테이너 */}
      <div className="overflow-hidden rounded-xl shadow-md transition-all duration-300 ease-in-out" id="statistics-section">
        {/* 헤더 영역 - 클릭 시 토글 */}
        <button 
          type="button"
          className="w-full flex items-center justify-between cursor-pointer bg-gray-900 p-3 rounded-t-xl hover:bg-gray-800 active:bg-gray-700 focus:outline-none"
          onClick={toggleSection}
        >
          <div className="flex items-center">
            <h3 className="text-sm font-semibold text-white">
              서비스 현황
            </h3>
          </div>
          <div className="flex items-center">
            <span className="text-xs text-gray-300 mr-2">주간</span>
            {isOpen ? 
              <ChevronDown className="h-4 w-4 text-gray-300" /> : 
              <ChevronRight className="h-4 w-4 text-gray-300" />
            }
          </div>
        </button>

        {/* 통합된 정보 내용 - 토글 상태에 따라 표시/숨김 */}
        {isOpen && (
          <div className="bg-gray-900 p-3">
            <div className="grid grid-cols-3 gap-4">
              {/* 활성 사용자 */}
              <button 
                type="button" 
                className="py-2 relative text-left focus:outline-none cursor-pointer"
                onClick={() => console.log('활성 사용자 통계 클릭')}
              >
                <div className="text-blue-400 text-3xl font-bold">2,580</div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-gray-400">활성 사용자</span>
                  <div className="text-green-400 flex items-center">
                    <span>+12.5%</span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full">
                  <div className="h-[2px] w-full bg-blue-900/50 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{width: '40%'}}></div>
                  </div>
                </div>
              </button>

              {/* 인증 훈련사 */}
              <button 
                type="button" 
                className="py-2 relative text-left focus:outline-none cursor-pointer"
                onClick={() => console.log('인증 훈련사 통계 클릭')}
              >
                <div className="text-green-400 text-3xl font-bold">157</div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-gray-400">인증 훈련사</span>
                  <div className="text-green-400 flex items-center">
                    <span>+4.7%</span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full">
                  <div className="h-[2px] w-full bg-green-900/50 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{width: '35%'}}></div>
                  </div>
                </div>
              </button>

              {/* 수료 반려견 */}
              <button 
                type="button" 
                className="py-2 relative text-left focus:outline-none cursor-pointer"
                onClick={() => console.log('수료 반려견 통계 클릭')}
              >
                <div className="text-purple-400 text-3xl font-bold">4,750</div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-gray-400">수료 반려견</span>
                  <div className="text-green-400 flex items-center">
                    <span>+21.3%</span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full">
                  <div className="h-[2px] w-full bg-purple-900/50 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{width: '65%'}}></div>
                  </div>
                </div>
              </button>
            </div>

            {/* 날씨 정보 섹션 - 헤더 */}
            <div className="mt-5 flex justify-between items-center">
              <div className="flex items-center">
                <div className="text-sm text-white mr-2">오늘의 날씨</div>
                <button 
                  type="button" 
                  className="text-xs text-gray-400 hover:text-gray-300 focus:outline-none"
                  onClick={() => console.log('주간 날씨 버튼 클릭')}
                >
                  주간
                </button>
              </div>
            </div>

            {/* 날씨 정보 내용 */}
            <div className="flex justify-between items-start mt-2">
              <button 
                type="button"
                className="flex-1 flex items-center text-left focus:outline-none cursor-pointer"
                onClick={() => console.log('현재 날씨 정보 클릭')}
              >
                <div className="flex items-center">
                  <div className="flex flex-col">
                    <div className="flex items-center mb-1">
                      <Sun className="w-8 h-8 text-amber-400 mr-3" />
                      <div className="font-bold text-white text-3xl">23°C</div>
                    </div>
                    <div className="text-xs text-gray-300 ml-11">맑음 · 서울 강남구</div>
                  </div>
                </div>
              </button>
              
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <button 
                    type="button"
                    className="text-left focus:outline-none cursor-pointer"
                    onClick={() => console.log('습도 정보 클릭')}
                  >
                    <div className="text-xs text-gray-400">습도</div>
                    <div className="font-bold text-white">45%</div>
                  </button>
                  <button 
                    type="button"
                    className="text-left focus:outline-none cursor-pointer"
                    onClick={() => console.log('바람 정보 클릭')}
                  >
                    <div className="text-xs text-gray-400">바람</div>
                    <div className="font-bold text-white">3m/s</div>
                  </button>
                  <button 
                    type="button"
                    className="text-left focus:outline-none cursor-pointer"
                    onClick={() => console.log('미세먼지 정보 클릭')}
                  >
                    <div className="text-xs text-gray-400">미세먼지</div>
                    <div className="font-bold text-white">좋음</div>
                  </button>
                  <button 
                    type="button"
                    className="text-left focus:outline-none cursor-pointer"
                    onClick={() => console.log('산책날씨 정보 클릭')}
                  >
                    <div className="text-xs text-gray-400">산책날씨</div>
                    <div className="font-bold text-green-400">적합</div>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-2 text-right">
              <span className="text-xs text-gray-400">신뢰도가 높은 날씨입니다!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}