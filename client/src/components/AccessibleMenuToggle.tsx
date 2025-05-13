import React from 'react';
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";

interface AccessibleMenuToggleProps {
  title: string;
  isOpen: boolean;
  onClick: () => void;
  expanded: boolean; // 사이드바 확장/축소 상태
  icon?: React.ReactNode; // 축소된 상태에서 표시할 아이콘
}

/**
 * 접근성이 개선된 메뉴 토글 컴포넌트
 * - 사이드바 확장 상태: 타이틀과 확장/축소 화살표 표시
 * - 사이드바 축소 상태: 접근성 레이블을 가진 아이콘 버튼 표시
 */
export function AccessibleMenuToggle({
  title,
  isOpen,
  onClick,
  expanded,
  icon
}: AccessibleMenuToggleProps) {
  if (expanded) {
    // 사이드바 확장 상태
    return (
      <div 
        className="px-3 py-2 flex items-center justify-between cursor-pointer"
        onClick={onClick}
        role="button"
        aria-expanded={isOpen}
        aria-label={`${title} 메뉴 ${isOpen ? '접기' : '펼치기'}`}
      >
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
        {isOpen ? 
          <ChevronDown className="h-4 w-4 text-gray-500" /> : 
          <ChevronRight className="h-4 w-4 text-gray-500" />
        }
      </div>
    );
  } else {
    // 사이드바 축소 상태
    return (
      <div className="flex justify-center py-2">
        <button
          onClick={onClick}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={`${title} 메뉴 토글`}
          aria-expanded={isOpen}
        >
          {icon || <ChevronRight className="w-5 h-5 text-primary" />}
        </button>
      </div>
    );
  }
}