import React, { useEffect, useState } from 'react';
import { useSeasonalTheme } from '@/hooks/use-seasonal-theme';
import { useTheme } from '@/hooks/use-theme';

// CSS 변수를 동적으로 업데이트하는 함수
const updateCssVariable = (name: string, value: string) => {
  document.documentElement.style.setProperty(name, value);
};

// 애플리케이션 전체 테마 관리 컴포넌트
export function ThemeManager({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const { 
    currentSeason, 
    currentEvent, 
    activeAccentColor, 
    hasActiveSeasonalTheme,
    getSeasonalEffectClass
  } = useSeasonalTheme();
  
  // 현재 활성화된 효과 클래스
  const [effectClass, setEffectClass] = useState<string>('');
  
  // 계절 및 테마 변경 시 CSS 변수 업데이트
  useEffect(() => {
    if (hasActiveSeasonalTheme && activeAccentColor) {
      // 계절/이벤트 테마 색상을 CSS 변수로 설정
      updateCssVariable('--seasonal-accent', activeAccentColor);
      
      // 계절/이벤트 효과 비활성화 (낙엽, 눈 등 배경 효과 제거)
      setEffectClass('');
    } else {
      // 효과 제거
      setEffectClass('');
    }
  }, [currentSeason, currentEvent, activeAccentColor, hasActiveSeasonalTheme, getSeasonalEffectClass]);
  
  // 테마 모드(라이트/다크) 변경 시 콘텐츠에 애니메이션 효과 추가
  useEffect(() => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.classList.add('theme-transition');
      
      const timeout = setTimeout(() => {
        mainContent.classList.remove('theme-transition');
      }, 500); // 애니메이션 지속 시간
      
      return () => clearTimeout(timeout);
    }
  }, [theme]);

  // ARIA 속성 추가로 접근성 향상
  useEffect(() => {
    // 다크 모드 상태를 ARIA 속성으로 표시
    document.documentElement.setAttribute('aria-theme', theme);
    
    // 계절/이벤트 테마 상태를 ARIA 속성으로 표시
    if (currentEvent !== 'none') {
      document.documentElement.setAttribute('aria-seasonal-theme', currentEvent);
    } else if (currentSeason) {
      document.documentElement.setAttribute('aria-seasonal-theme', currentSeason);
    } else {
      document.documentElement.removeAttribute('aria-seasonal-theme');
    }
  }, [theme, currentSeason, currentEvent]);
  
  return (
    <>
      {/* 접근성 설정은 별도로 적용됨 */}
      
      {/* 활성화된 계절/이벤트 효과가 있는 경우 효과 컨테이너 추가 */}
      {effectClass && (
        <div className={`fixed inset-0 pointer-events-none z-50 ${effectClass}`} aria-hidden="true" />
      )}
      
      {/* 앱 콘텐츠 */}
      {children}
    </>
  );
}