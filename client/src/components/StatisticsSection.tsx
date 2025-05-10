import React, { useState } from 'react';
import { Activity, ChevronDown, ChevronRight, Cloud, Droplets, Wind, Sun } from 'lucide-react';

interface StatisticsSectionProps {
  expanded: boolean;
}

export function StatisticsSection({ expanded }: StatisticsSectionProps) {
  // 서비스 상태 및 날씨 정보 토글을 위한 통합 상태
  const [isOpen, setIsOpen] = useState(true);

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
      <div>
        {/* 헤더 영역 - 클릭 시 토글 */}
        <div 
          className="flex items-center justify-between mb-2 cursor-pointer bg-gray-100 dark:bg-gray-700 p-2 rounded"
          onClick={() => {
            console.log("서비스 정보 토글 클릭됨:", !isOpen);
            setIsOpen(!isOpen);
          }}
        >
          <div className="flex items-center">
            <Activity className="w-4 h-4 mr-1 text-primary" />
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              서비스 정보
            </h3>
          </div>
          {isOpen ? 
            <ChevronDown className="h-4 w-4 text-primary" /> : 
            <ChevronRight className="h-4 w-4 text-primary" />
          }
        </div>

        {/* 통합된 정보 내용 - 토글 상태에 따라 표시/숨김 */}
        {isOpen && (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-xs">
            {/* 서비스 현황 섹션 */}
            <div className="mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
              <h4 className="font-medium text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                <Activity className="w-4 h-4 mr-1 text-primary" />
                서비스 현황
              </h4>
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

            {/* 날씨 정보 섹션 */}
            <div>
              <h4 className="font-medium text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                <Sun className="w-4 h-4 mr-1 text-amber-500" />
                오늘의 날씨
              </h4>
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
          </div>
        )}
      </div>
    </div>
  );
}