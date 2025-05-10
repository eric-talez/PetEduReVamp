import React, { useState, useEffect } from 'react';
import { Activity, ChevronDown, ChevronRight, Cloud, Droplets, Wind, Sun } from 'lucide-react';

interface StatisticsSectionProps {
  expanded: boolean;
}

export function StatisticsSection({ expanded }: StatisticsSectionProps) {
  // 통계 데이터 토글을 위한 상태
  const [isOpen, setIsOpen] = useState(true);
  
  // 날씨 데이터 토글을 위한 상태
  const [weatherOpen, setWeatherOpen] = useState(true);
  
  // 상태 변화 디버깅 및 직접 DOM 이벤트 처리를 위한 로직
  const statsRef = React.useRef<HTMLDivElement>(null);
  const weatherRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    console.log("StatisticsSection 상태 변경:", { isOpen, weatherOpen, expanded });
    
    // DOM 직접 접근하여 이벤트 리스너 추가
    const statsHeader = statsRef.current;
    const weatherHeader = weatherRef.current;
    
    const handleStatsClick = () => {
      console.log("서비스 현황 헤더 클릭 - DOM 이벤트");
      setIsOpen(prev => !prev);
    };
    
    const handleWeatherClick = () => {
      console.log("날씨 헤더 클릭 - DOM 이벤트");
      setWeatherOpen(prev => !prev);
    };
    
    if (statsHeader) {
      statsHeader.addEventListener('click', handleStatsClick);
    }
    
    if (weatherHeader) {
      weatherHeader.addEventListener('click', handleWeatherClick);
    }
    
    return () => {
      if (statsHeader) {
        statsHeader.removeEventListener('click', handleStatsClick);
      }
      if (weatherHeader) {
        weatherHeader.removeEventListener('click', handleWeatherClick);
      }
    };
  }, [expanded]);

  // 사이드바가 축소되었을 때는 아이콘만 표시
  if (!expanded) {
    return (
      <div className="mt-auto mb-4 px-2">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 flex justify-center">
          <Activity className="w-5 h-5 text-primary" aria-label="서비스 현황" />
        </div>
      </div>
    );
  }

  // 토글 핸들러 함수들
  const handleStatsToggle = () => {
    console.log("서비스 현황 토글 클릭됨:", !isOpen);
    setIsOpen(prev => !prev);
  };
  
  const handleWeatherToggle = () => {
    console.log("날씨 정보 토글 클릭됨:", !weatherOpen);
    setWeatherOpen(prev => !prev);
  };

  return (
    <div className="mt-auto mb-4 px-3">
      {/* 서비스 현황 컨테이너 */}
      <div className="mb-3">
        {/* 헤더 영역 - 클릭 시 토글 */}
        <div 
          ref={statsRef}
          className="flex items-center justify-between mb-2 cursor-pointer bg-gray-100 dark:bg-gray-700 p-2 rounded"
        >
          <div className="flex items-center">
            <Activity className="w-4 h-4 mr-1 text-primary" />
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              서비스 현황
            </h3>
          </div>
          {isOpen ? 
            <ChevronDown className="h-4 w-4 text-primary" /> : 
            <ChevronRight className="h-4 w-4 text-primary" />
          }
        </div>

        {/* 통계 내용 - 토글 상태에 따라 표시/숨김 */}
        {isOpen && (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-xs mb-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">실시간 이용자</span>
              <span className="font-semibold text-primary">2,458명</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-gray-600 dark:text-gray-300">사용자 분포</span>
              <span className="font-semibold text-blue-500">반려인 75%</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-gray-600 dark:text-gray-300">평균 체류시간</span>
              <span className="font-semibold text-green-500">32분</span>
            </div>
          </div>
        )}
      </div>

      {/* 날씨 컨테이너 */}
      <div>
        {/* 날씨 헤더 영역 - 클릭 시 토글 */}
        <div 
          ref={weatherRef}
          className="flex items-center justify-between mb-2 cursor-pointer bg-gray-100 dark:bg-gray-700 p-2 rounded"
        >
          <div className="flex items-center">
            <Sun className="w-4 h-4 mr-1 text-amber-500" />
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              오늘의 날씨
            </h3>
          </div>
          {weatherOpen ? 
            <ChevronDown className="h-4 w-4 text-primary" /> : 
            <ChevronRight className="h-4 w-4 text-primary" />
          }
        </div>

        {/* 날씨 내용 - 토글 상태에 따라 표시/숨김 */}
        {weatherOpen && (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Sun className="w-5 h-5 mr-2 text-amber-500" />
                <span className="text-gray-600 dark:text-gray-300">서울</span>
              </div>
              <span className="font-semibold text-orange-500">맑음 24℃</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <Droplets className="w-4 h-4 mr-2 text-blue-500" />
                <span className="text-gray-600 dark:text-gray-300">습도</span>
              </div>
              <span className="font-semibold">45%</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <Wind className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-300">바람</span>
              </div>
              <span className="font-semibold">3m/s</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}