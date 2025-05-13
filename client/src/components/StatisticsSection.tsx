import React, { useState } from 'react';
import { Activity, ArrowUp, ChevronDown, ChevronRight, Droplets, Wind, Sun } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StatisticsSectionProps {
  expanded: boolean;
}

export function StatisticsSection({ expanded }: StatisticsSectionProps) {
  // 서비스 상태 및 날씨 정보 토글을 위한 통합 상태
  const [isOpen, setIsOpen] = useState(false);
  
  // 토글 함수
  const toggleSection = () => {
    console.log("서비스 현황 토글 실행:", !isOpen);
    setIsOpen(prev => !prev);
  };

  // 사이드바가 축소되었을 때는 아이콘만 표시 (툴팁 추가)
  if (!expanded) {
    return (
      <div className="mt-auto mb-4 px-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 flex justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                onClick={toggleSection}
              >
                <Activity className="w-5 h-5 text-primary" aria-label="서비스 정보" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>서비스 현황</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <div className="mt-auto mb-4 px-3">
      <div 
        className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3"
      >
        {/* 헤더 영역: 토글 가능 */}
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={toggleSection}
        >
          <div className="flex items-center">
            <Activity className="w-5 h-5 text-primary mr-2" />
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">서비스 현황</h3>
          </div>
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          )}
        </div>

        {/* 컨텐츠 영역: 토글 상태에 따라 표시 */}
        {isOpen && (
          <div className="mt-3 space-y-3">
            {/* 서비스 상태 지표 */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500 dark:text-gray-400">시스템 상태</span>
                <span className="text-green-500 font-medium flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  100%
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            {/* API 상태 표시 */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500 dark:text-gray-400">API 응답 시간</span>
                <span className="text-green-500 font-medium">45ms</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>

            {/* 날씨 정보 섹션 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">현재 날씨</h4>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Sun className="h-5 w-5 text-amber-500 mr-2" />
                  <span className="text-sm">맑음</span>
                </div>
                <span className="text-sm font-medium">23°C</span>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <div className="flex items-center">
                  <Wind className="h-3 w-3 mr-1" />
                  <span>3m/s</span>
                </div>
                <div className="flex items-center">
                  <Droplets className="h-3 w-3 mr-1" />
                  <span>습도 45%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}