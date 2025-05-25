import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useSSRLocalStorage } from '@/hooks/use-ssr-compatible';
import { KeyboardFocusOutline } from './KeyboardFocusOutline';
import { AnnouncementRegion } from './AnnouncementRegion';
import { ContentSkipLinks } from './ContentSkipLinks';

// 접근성 설정 타입 정의
interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  reduceMotion: boolean;
  dyslexicFont: boolean;
  focusIndicators: boolean;
  enableKeyboardShortcuts: boolean;
}

// 접근성 컨텍스트 타입 정의
interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (settings: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
  announce: (message: string, level?: 'polite' | 'assertive') => void;
}

// 기본 접근성 설정
const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  highContrast: false,
  reduceMotion: false,
  dyslexicFont: false,
  focusIndicators: true,
  enableKeyboardShortcuts: true,
};

// 접근성 컨텍스트 생성
const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

// 접근성 훅
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: ReactNode;
  skipLinks?: { id: string; label: string }[];
}

/**
 * 애플리케이션 전체 접근성 기능을 제공하는 Provider
 * 
 * 접근성 설정, 키보드 포커스 관리, 스크린 리더 지원 등
 * 다양한 접근성 기능을 통합적으로 제공합니다.
 */
export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
  children,
  skipLinks = [
    { id: 'main-content', label: '메인 콘텐츠로 바로 가기' },
    { id: 'main-navigation', label: '메인 메뉴로 바로 가기' },
    { id: 'search', label: '검색으로 바로 가기' },
  ],
}) => {
  // 로컬 스토리지에서 설정 가져오기
  const [settings, setSettings] = useSSRLocalStorage<AccessibilitySettings>(
    'accessibility-settings',
    defaultSettings
  );
  
  // 접근성 설정 업데이트 함수
  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };
  
  // 접근성 설정 초기화 함수
  const resetSettings = () => {
    setSettings(defaultSettings);
    if (typeof window !== 'undefined' && (window as any).announceToScreenReader) {
      (window as any).announceToScreenReader('접근성 설정이 초기화되었습니다');
    }
  };
  
  // 스크린 리더 알림 함수
  const announce = (message: string, level: 'polite' | 'assertive' = 'polite') => {
    if (typeof window !== 'undefined' && (window as any).announceToScreenReader) {
      (window as any).announceToScreenReader(message, level);
    }
  };
  
  // 시스템 설정 감지 및 적용
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // prefers-reduced-motion 미디어 쿼리 감지
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // 시스템 설정에 따라 모션 감소 설정 초기화
    if (prefersReducedMotion.matches && !settings.reduceMotion) {
      updateSettings({ reduceMotion: true });
    }
    
    // prefers-contrast 미디어 쿼리 감지
    const prefersContrast = window.matchMedia('(prefers-contrast: more)');
    
    // 시스템 설정에 따라 고대비 모드 설정 초기화
    if (prefersContrast.matches && !settings.highContrast) {
      updateSettings({ highContrast: true });
    }
    
    // 미디어 쿼리 변경 이벤트 리스너
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      updateSettings({ reduceMotion: e.matches });
    };
    
    const handleContrastChange = (e: MediaQueryListEvent) => {
      updateSettings({ highContrast: e.matches });
    };
    
    // 이벤트 리스너 등록
    prefersReducedMotion.addEventListener('change', handleReducedMotionChange);
    prefersContrast.addEventListener('change', handleContrastChange);
    
    // 정리 함수
    return () => {
      prefersReducedMotion.removeEventListener('change', handleReducedMotionChange);
      prefersContrast.removeEventListener('change', handleContrastChange);
    };
  }, []);
  
  // 설정 변경 시 DOM 업데이트
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // 폰트 크기 적용
    document.documentElement.style.fontSize = `${settings.fontSize}%`;
    
    // 고대비 모드 적용
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // 모션 감소 적용
    if (settings.reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    
    // 난독증 친화 폰트 적용
    if (settings.dyslexicFont) {
      document.documentElement.classList.add('dyslexic-font');
    } else {
      document.documentElement.classList.remove('dyslexic-font');
    }
    
    // 포커스 표시기 적용
    if (settings.focusIndicators) {
      document.documentElement.classList.add('focus-indicators');
    } else {
      document.documentElement.classList.remove('focus-indicators');
    }
  }, [settings]);
  
  // 컨텍스트 값
  const contextValue = {
    settings,
    updateSettings,
    resetSettings,
    announce,
  };
  
  return (
    <AccessibilityContext.Provider value={contextValue}>
      {/* 접근성 기능 컴포넌트들 */}
      <KeyboardFocusOutline />
      <AnnouncementRegion />
      <ContentSkipLinks links={skipLinks} />
      
      {/* 접근성 스타일 */}
      <style>{`
        /* 고대비 모드 스타일 */
        .high-contrast {
          --background: #000000;
          --foreground: #ffffff;
          --muted: #333333;
          --muted-foreground: #ffffff;
          --primary: #ffff00;
          --primary-foreground: #000000;
          --accent: #ffffff;
          --accent-foreground: #000000;
          --border: #ffffff;
          --input: #ffffff;
          --ring: #ffff00;
        }
        
        /* 난독증 친화 폰트 스타일 */
        .dyslexic-font {
          font-family: "Comic Sans MS", "OpenDyslexic", sans-serif;
          letter-spacing: 0.05em;
          word-spacing: 0.1em;
          line-height: 1.5;
        }
        
        /* 모션 감소 스타일 */
        .reduce-motion * {
          animation-duration: 0.001ms !important;
          transition-duration: 0.001ms !important;
        }
        
        /* 커서 및 터치 타겟 크기 개선 */
        .accessibility-enhanced-cursor button,
        .accessibility-enhanced-cursor a,
        .accessibility-enhanced-cursor input[type="checkbox"],
        .accessibility-enhanced-cursor input[type="radio"] {
          cursor: pointer;
        }
        
        /* 모바일 터치 타겟 최소 크기 보장 (44x44px) */
        @media (max-width: 768px) {
          .accessibility-enhanced-touch button:not(.icon-only),
          .accessibility-enhanced-touch a:not(.icon-only),
          .accessibility-enhanced-touch [role="button"]:not(.icon-only) {
            min-height: 44px;
            min-width: 44px;
            padding: 10px;
          }
          
          .accessibility-enhanced-touch input[type="checkbox"],
          .accessibility-enhanced-touch input[type="radio"] {
            transform: scale(1.2);
          }
        }
      `}</style>
      
      {children}
    </AccessibilityContext.Provider>
  );
};