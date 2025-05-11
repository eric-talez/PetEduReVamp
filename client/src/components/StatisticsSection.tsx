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
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-300">실시간 이용자</span>
          <span className="font-semibold text-primary">2,458명</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-300">사용자 분포</span>
          <span className="font-semibold text-blue-500">반려인 75%</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-300">평균 체류시간</span>
          <span className="font-semibold text-green-500">32분</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-300">서비스 상태</span>
          <span className="font-semibold text-green-500">정상</span>
        </div>
      </div>
    </div>
  );
}