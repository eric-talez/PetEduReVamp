import React, { useState } from 'react';
import { Activity, ArrowUp, ChevronDown, ChevronRight, Droplets, Wind, Sun } from 'lucide-react';

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
      <div className="overflow-hidden rounded-xl">
        {/* 헤더 영역 - 클릭 시 토글 */}
        <div 
          className="flex items-center justify-between cursor-pointer bg-gray-800/80 p-3 rounded-t-xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              서비스 현황
            </h3>
          </div>
          <div className="flex items-center">
            <span className="text-xs text-white mr-2">확장</span>
            {isOpen ? 
              <ChevronDown className="h-4 w-4 text-white" /> : 
              <ChevronRight className="h-4 w-4 text-white" />
            }
          </div>
        </div>

        {/* 통합된 정보 내용 - 토글 상태에 따라 표시/숨김 */}
        {isOpen && (
          <div className="bg-gray-700/80 p-3">
            <div className="grid grid-cols-3 gap-4">
              {/* 활성 사용자 */}
              <div className="bg-gray-800/70 rounded-lg p-3">
                <div className="text-blue-400 text-xl font-bold mb-1">2,580</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300">활성 사용자</span>
                  <div className="flex items-center text-green-400">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    <span>+12.5%</span>
                  </div>
                </div>
                <div className="mt-2 h-1 bg-gray-600 rounded overflow-hidden">
                  <div className="h-full bg-blue-500 rounded" style={{width: '45%'}}></div>
                </div>
              </div>

              {/* 인증 훈련사 */}
              <div className="bg-gray-800/70 rounded-lg p-3">
                <div className="text-green-400 text-xl font-bold mb-1">157</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300">인증 훈련사</span>
                  <div className="flex items-center text-green-400">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    <span>+4.7%</span>
                  </div>
                </div>
                <div className="mt-2 h-1 bg-gray-600 rounded overflow-hidden">
                  <div className="h-full bg-green-500 rounded" style={{width: '35%'}}></div>
                </div>
              </div>

              {/* 수료 반려견 */}
              <div className="bg-gray-800/70 rounded-lg p-3">
                <div className="text-purple-400 text-xl font-bold mb-1">4,750</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300">수료 반려견</span>
                  <div className="flex items-center text-green-400">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    <span>+21.3%</span>
                  </div>
                </div>
                <div className="mt-2 h-1 bg-gray-600 rounded overflow-hidden">
                  <div className="h-full bg-purple-500 rounded" style={{width: '65%'}}></div>
                </div>
              </div>
            </div>

            {/* 날씨 정보 섹션 */}
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div className="bg-gray-800/70 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs text-gray-400">오늘의 날씨</div>
                    <div className="font-bold text-white text-lg">23°C</div>
                    <div className="text-xs text-gray-300">맑음 - 서울 강남구</div>
                  </div>
                  <div className="bg-amber-500/20 p-2 rounded-full">
                    <Sun className="w-8 h-8 text-amber-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/70 rounded-lg p-3 grid grid-cols-2 gap-2">
                <div>
                  <div className="text-xs text-gray-400">습도</div>
                  <div className="font-bold text-white">45%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">바람</div>
                  <div className="font-bold text-white">3m/s</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">미세먼지</div>
                  <div className="font-bold text-white">좋음</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">산책날씨</div>
                  <div className="font-bold text-green-400">적합</div>
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