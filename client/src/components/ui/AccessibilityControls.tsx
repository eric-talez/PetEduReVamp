import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { Slider } from './slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { Switch } from './switch';
import { Label } from './label';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Settings, ZoomIn, Type, PanelLeft, MousePointer, Monitor } from 'lucide-react';

// 접근성 설정 상태 인터페이스
interface AccessibilitySettings {
  fontSize: number; // 100 = 기본 크기, 200 = 2배 크기
  contrastMode: 'normal' | 'high' | 'inverted';
  reduceMotion: boolean;
  focusIndicator: boolean;
  keyboardMode: boolean;
}

// 기본 접근성 설정
const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  contrastMode: 'normal',
  reduceMotion: false,
  focusIndicator: true,
  keyboardMode: false,
};

// 접근성 설정을 로컬 스토리지에 저장/로드하는 함수
const STORAGE_KEY = 'petedu-accessibility-settings';

const saveSettings = (settings: AccessibilitySettings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('접근성 설정 저장 실패:', e);
  }
};

const loadSettings = (): AccessibilitySettings => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('접근성 설정 로드 실패:', e);
  }
  return defaultSettings;
};

// 접근성 설정 플로팅 버튼
export const AccessibilityFloatingButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed left-4 bottom-20 z-50 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 h-10 w-10 md:h-12 md:w-12"
          aria-label="접근성 설정"
        >
          <Settings className="h-5 w-5 text-primary" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5 text-primary" />
            접근성 설정
          </DialogTitle>
        </DialogHeader>
        <AccessibilityPanel />
      </DialogContent>
    </Dialog>
  );
};

// 접근성 설정 패널 컴포넌트
export const AccessibilityPanel = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  
  // 컴포넌트 마운트 시 저장된 설정 로드
  useEffect(() => {
    setSettings(loadSettings());
  }, []);
  
  // 설정이 변경될 때마다 적용 및 저장
  useEffect(() => {
    applySettings(settings);
    saveSettings(settings);
  }, [settings]);
  
  // 설정을 실제 페이지에 적용하는 함수
  const applySettings = (settings: AccessibilitySettings) => {
    // 폰트 크기 적용
    document.documentElement.style.fontSize = `${settings.fontSize}%`;
    
    // 색상 대비 모드 적용
    document.body.classList.remove('contrast-high', 'contrast-inverted');
    if (settings.contrastMode === 'high') {
      document.body.classList.add('contrast-high');
    } else if (settings.contrastMode === 'inverted') {
      document.body.classList.add('contrast-inverted');
    }
    
    // 모션 감소 적용
    if (settings.reduceMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
    
    // 포커스 표시기 강화 적용
    if (settings.focusIndicator) {
      document.body.classList.add('focus-enhanced');
    } else {
      document.body.classList.remove('focus-enhanced');
    }
    
    // 키보드 모드 적용
    if (settings.keyboardMode) {
      document.body.classList.add('keyboard-mode');
    } else {
      document.body.classList.remove('keyboard-mode');
    }
  };
  
  // 설정 변경 핸들러
  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  // 설정 초기화 핸들러
  const resetSettings = () => {
    setSettings(defaultSettings);
  };
  
  return (
    <div className="space-y-4 py-2">
      {/* 글꼴 크기 설정 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="flex items-center">
            <Type className="h-4 w-4 mr-2 text-primary" />
            글꼴 크기
          </Label>
          <span className="text-sm text-gray-500 dark:text-gray-400">{settings.fontSize}%</span>
        </div>
        <Slider
          min={80}
          max={150}
          step={5}
          value={[settings.fontSize]}
          onValueChange={(value) => updateSettings({ fontSize: value[0] })}
          aria-label="글꼴 크기 조절"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>작게</span>
          <span>보통</span>
          <span>크게</span>
        </div>
      </div>
      
      {/* 색상 대비 설정 */}
      <div className="space-y-2">
        <Label className="flex items-center">
          <Monitor className="h-4 w-4 mr-2 text-primary" />
          색상 대비
        </Label>
        <div className="flex space-x-2">
          <Button
            variant={settings.contrastMode === 'normal' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateSettings({ contrastMode: 'normal' })}
            className="flex-1"
          >
            기본
          </Button>
          <Button
            variant={settings.contrastMode === 'high' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateSettings({ contrastMode: 'high' })}
            className="flex-1"
          >
            고대비
          </Button>
          <Button
            variant={settings.contrastMode === 'inverted' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateSettings({ contrastMode: 'inverted' })}
            className="flex-1"
          >
            색상 반전
          </Button>
        </div>
      </div>
      
      {/* 모션 제어 설정 */}
      <div className="flex items-center justify-between">
        <Label className="flex items-center cursor-pointer" htmlFor="reduce-motion">
          <PanelLeft className="h-4 w-4 mr-2 text-primary" />
          애니메이션 줄이기
        </Label>
        <Switch
          id="reduce-motion"
          checked={settings.reduceMotion}
          onCheckedChange={(checked) => updateSettings({ reduceMotion: checked })}
          aria-label="애니메이션 줄이기"
        />
      </div>
      
      {/* 포커스 표시기 설정 */}
      <div className="flex items-center justify-between">
        <Label className="flex items-center cursor-pointer" htmlFor="focus-indicator">
          <MousePointer className="h-4 w-4 mr-2 text-primary" />
          포커스 표시 강화
        </Label>
        <Switch
          id="focus-indicator"
          checked={settings.focusIndicator}
          onCheckedChange={(checked) => updateSettings({ focusIndicator: checked })}
          aria-label="포커스 표시 강화"
        />
      </div>
      
      {/* 키보드 모드 설정 */}
      <div className="flex items-center justify-between">
        <Label className="flex items-center cursor-pointer" htmlFor="keyboard-mode">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="mr-2 text-primary"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
            <path d="M6 8h.001" />
            <path d="M10 8h.001" />
            <path d="M14 8h.001" />
            <path d="M18 8h.001" />
            <path d="M8 12h.001" />
            <path d="M12 12h.001" />
            <path d="M16 12h.001" />
            <path d="M7 16h10" />
          </svg>
          키보드 네비게이션 모드
        </Label>
        <Switch
          id="keyboard-mode"
          checked={settings.keyboardMode}
          onCheckedChange={(checked) => updateSettings({ keyboardMode: checked })}
          aria-label="키보드 네비게이션 모드"
        />
      </div>
      
      {/* 설정 초기화 버튼 */}
      <div className="pt-2 flex justify-end">
        <Button variant="ghost" onClick={resetSettings} size="sm">
          초기화
        </Button>
      </div>
    </div>
  );
};

// 접근성 단축키 설정 컴포넌트
export const AccessibilityShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + A: 접근성 메뉴 토글
      if (e.altKey && e.key === 'a') {
        // 접근성 메뉴 버튼 찾아서 클릭
        const accessibilityBtn = document.querySelector('[aria-label="접근성 설정"]');
        if (accessibilityBtn instanceof HTMLElement) {
          accessibilityBtn.click();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
};

// 접근성 단축키 안내 컴포넌트
export const AccessibilityHelpTrigger = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="fixed left-4 bottom-36 z-50 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 h-8 w-8 rounded-full flex items-center justify-center"
          aria-label="접근성 단축키 도움말"
        >
          ?
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" side="right">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">접근성 단축키</h4>
          <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
            <li className="flex justify-between">
              <span>접근성 메뉴 열기</span>
              <kbd className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded">Alt + A</kbd>
            </li>
            <li className="flex justify-between">
              <span>탭 이동</span>
              <kbd className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded">Tab</kbd>
            </li>
            <li className="flex justify-between">
              <span>이전 요소로 이동</span>
              <kbd className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded">Shift + Tab</kbd>
            </li>
            <li className="flex justify-between">
              <span>선택/활성화</span>
              <kbd className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded">Enter / Space</kbd>
            </li>
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
};