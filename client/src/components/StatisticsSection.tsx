import React, { useState } from 'react';
import { Activity, ChevronDown, ChevronRight } from 'lucide-react';

interface StatisticsSectionProps {
  expanded: boolean;
}

export function StatisticsSection({ expanded }: StatisticsSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!expanded) {
    return (
      <div className="mt-auto mb-4 px-2">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 flex justify-center">
          <Activity className="w-5 h-5 text-primary" aria-label="서비스 현황" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-auto mb-4 px-3">
      {/* 헤더 영역 - 클릭 시 토글 */}
      <div 
        className="flex items-center justify-between mb-2 cursor-pointer bg-gray-100 dark:bg-gray-700 p-1 rounded"
        onClick={() => {
          console.log("서비스 현황 토글:", !isOpen);
          setIsOpen(!isOpen);
        }}
      >
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          서비스 현황
        </h3>
        {isOpen ? 
          <ChevronDown className="h-4 w-4 text-primary" /> : 
          <ChevronRight className="h-4 w-4 text-primary" />
        }
      </div>

      {/* 통계 내용 - 토글 상태에 따라 표시/숨김 */}
      {isOpen ? (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-xs">
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
          <div className="flex items-center justify-between mt-2">
            <span className="text-gray-600 dark:text-gray-300">현재 날씨</span>
            <span className="font-semibold text-orange-500">맑음 24℃</span>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">이용자</span>
            <span className="font-semibold text-primary">2,458명</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-gray-600 dark:text-gray-300">날씨</span>
            <span className="font-semibold text-orange-500">맑음 24℃</span>
          </div>
        </div>
      )}
    </div>
  );
}