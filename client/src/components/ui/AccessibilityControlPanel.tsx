import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, ZoomIn, ZoomOut, Sun, Moon, RotateCcw, Check, Type } from 'lucide-react';
import { cn } from '@/lib/utils';
import { announceToScreenReader } from '@/components/a11y/AnnouncementRegion';

interface AccessibilityControlPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * 사용자 접근성 설정 패널 컴포넌트
 * 
 * 글꼴 크기 조정, 색상 대비, 모션 감소 등 다양한 접근성 설정을 제공합니다.
 * 사용자 선호도를 저장하고 앱 전체에 적용합니다.
 */
export const AccessibilityControlPanel: React.FC<AccessibilityControlPanelProps> = ({
  open,
  onOpenChange,
}) => {
  // 접근성 설정 상태
  const [fontSize, setFontSize] = useLocalStorage<number>('a11y-font-size', 100);
  const [highContrast, setHighContrast] = useLocalStorage<boolean>('a11y-high-contrast', false);
  const [reduceMotion, setReduceMotion] = useLocalStorage<boolean>('a11y-reduce-motion', false);
  const [dyslexicFont, setDyslexicFont] = useLocalStorage<boolean>('a11y-dyslexic-font', false);
  const [focusIndicators, setFocusIndicators] = useLocalStorage<boolean>('a11y-focus-indicators', true);
  
  // 설정 변경 시 DOM 업데이트 및 알림
  useEffect(() => {
    // 폰트 크기 적용
    document.documentElement.style.fontSize = `${fontSize}%`;
    
    // 고대비 모드 적용
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // 모션 감소 적용
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    
    // 난독증 친화 폰트 적용
    if (dyslexicFont) {
      document.documentElement.classList.add('dyslexic-font');
    } else {
      document.documentElement.classList.remove('dyslexic-font');
    }
    
    // 포커스 표시기 적용
    if (focusIndicators) {
      document.documentElement.classList.add('focus-indicators');
    } else {
      document.documentElement.classList.remove('focus-indicators');
    }
  }, [fontSize, highContrast, reduceMotion, dyslexicFont, focusIndicators]);
  
  // 설정 초기화
  const resetSettings = () => {
    setFontSize(100);
    setHighContrast(false);
    setReduceMotion(false);
    setDyslexicFont(false);
    setFocusIndicators(true);
    
    // 스크린 리더에 알림
    announceToScreenReader('접근성 설정이 초기화되었습니다');
  };
  
  // 글꼴 크기 조정
  const handleFontSizeChange = (value: number[]) => {
    const newSize = value[0];
    setFontSize(newSize);
    
    // 스크린 리더에 알림
    if (newSize === 100) {
      announceToScreenReader('글꼴 크기가 기본값으로 설정되었습니다');
    } else {
      announceToScreenReader(`글꼴 크기가 ${newSize}%로 설정되었습니다`);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">접근성 설정</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              aria-label="접근성 설정 닫기"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="p-6 pt-2 space-y-6">
          {/* 글꼴 크기 설정 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium" id="font-size-label">
                글꼴 크기
              </label>
              <span className="text-sm text-muted-foreground">
                {fontSize}%
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <ZoomOut className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Slider
                defaultValue={[fontSize]}
                min={75}
                max={150}
                step={5}
                onValueChange={handleFontSizeChange}
                aria-labelledby="font-size-label"
              />
              <ZoomIn className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </div>
          </div>
          
          {/* 고대비 모드 설정 */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium" id="high-contrast-label">
                고대비 모드
              </label>
              <p className="text-xs text-muted-foreground">
                텍스트와 배경 간 대비를 높여 가독성을 향상시킵니다
              </p>
            </div>
            <Switch
              checked={highContrast}
              onCheckedChange={(checked) => {
                setHighContrast(checked);
                announceToScreenReader(`고대비 모드가 ${checked ? '활성화' : '비활성화'}되었습니다`);
              }}
              aria-labelledby="high-contrast-label"
            />
          </div>
          
          {/* 모션 감소 설정 */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium" id="reduce-motion-label">
                모션 감소
              </label>
              <p className="text-xs text-muted-foreground">
                애니메이션 및 전환 효과를 최소화합니다
              </p>
            </div>
            <Switch
              checked={reduceMotion}
              onCheckedChange={(checked) => {
                setReduceMotion(checked);
                announceToScreenReader(`모션 감소가 ${checked ? '활성화' : '비활성화'}되었습니다`);
              }}
              aria-labelledby="reduce-motion-label"
            />
          </div>
          
          {/* 난독증 친화 폰트 설정 */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium" id="dyslexic-font-label">
                난독증 친화 폰트
              </label>
              <p className="text-xs text-muted-foreground">
                문자 구분이 용이한 폰트를 사용합니다
              </p>
            </div>
            <Switch
              checked={dyslexicFont}
              onCheckedChange={(checked) => {
                setDyslexicFont(checked);
                announceToScreenReader(`난독증 친화 폰트가 ${checked ? '활성화' : '비활성화'}되었습니다`);
              }}
              aria-labelledby="dyslexic-font-label"
            />
          </div>
          
          {/* 포커스 표시기 설정 */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium" id="focus-indicators-label">
                포커스 표시기
              </label>
              <p className="text-xs text-muted-foreground">
                키보드 내비게이션 시 포커스 위치를 강조 표시합니다
              </p>
            </div>
            <Switch
              checked={focusIndicators}
              onCheckedChange={(checked) => {
                setFocusIndicators(checked);
                announceToScreenReader(`포커스 표시기가 ${checked ? '활성화' : '비활성화'}되었습니다`);
              }}
              aria-labelledby="focus-indicators-label"
            />
          </div>
        </div>
        
        {/* 하단 작업 버튼 영역 */}
        <div className="flex items-center justify-between border-t p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={resetSettings}
            className="flex items-center"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            기본값으로 재설정
          </Button>
          <Button
            size="sm"
            onClick={() => onOpenChange(false)}
            className="flex items-center"
          >
            <Check className="h-4 w-4 mr-2" />
            적용하기
          </Button>
        </div>
      </DialogContent>
      
      {/* 전역 스타일 */}
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
      `}</style>
    </Dialog>
  );
};

export default AccessibilityControlPanel;