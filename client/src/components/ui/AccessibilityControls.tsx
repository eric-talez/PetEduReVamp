import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Accessibility, ZoomIn, ZoomOut, PanelTop, Contrast, MousePointer2 } from 'lucide-react';

/**
 * 접근성 설정을 저장하는 로컬 스토리지 키
 */
const ACCESSIBILITY_STORAGE_KEY = 'petedu-accessibility-settings';

/**
 * 접근성 설정 타입 정의
 */
interface AccessibilitySettings {
  fontSize: number;        // 글꼴 크기 배율 (1.0 = 100%)
  contrast: number;        // 대비 설정 (1.0 = 기본)
  reduceMotion: boolean;   // 모션 감소 설정
  focusOutline: boolean;   // 포커스 아웃라인 강화 설정
  cursorSize: number;      // 커서 크기 설정 (1.0 = 기본)
}

/**
 * 기본 접근성 설정
 */
const defaultSettings: AccessibilitySettings = {
  fontSize: 1.0,
  contrast: 1.0,
  reduceMotion: false,
  focusOutline: false,
  cursorSize: 1.0
};

/**
 * 접근성 컨트롤 컴포넌트
 * 사용자가 접근성 설정을 조정할 수 있는 팝오버 UI를 제공
 */
export function AccessibilityControls() {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isOpen, setIsOpen] = useState(false);

  // 컴포넌트 마운트 시 로컬 스토리지에서 설정 불러오기
  useEffect(() => {
    const savedSettings = localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        applySettings(parsedSettings);
      } catch (e) {
        console.error('접근성 설정을 로드하는데 실패했습니다:', e);
        // 오류 발생 시 기본 설정 적용
        applySettings(defaultSettings);
      }
    }
  }, []);

  // 설정 변경 사항을 HTML/CSS에 적용
  const applySettings = (newSettings: AccessibilitySettings) => {
    // 글꼴 크기 적용
    document.documentElement.style.setProperty('--accessibility-font-scale', newSettings.fontSize.toString());
    
    // 대비 적용
    document.documentElement.style.setProperty('--accessibility-contrast', newSettings.contrast.toString());
    
    // 모션 감소 적용
    if (newSettings.reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    
    // 포커스 아웃라인 강화 적용
    if (newSettings.focusOutline) {
      document.documentElement.classList.add('enhance-focus');
    } else {
      document.documentElement.classList.remove('enhance-focus');
    }
    
    // 커서 크기 적용
    document.documentElement.style.setProperty('--accessibility-cursor-scale', newSettings.cursorSize.toString());
    
    // 로컬 스토리지에 설정 저장
    localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(newSettings));
  };

  // 설정 변경 핸들러
  const handleSettingChange = (key: keyof AccessibilitySettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettings(newSettings);
  };

  // 기본 설정으로 재설정
  const resetToDefaults = () => {
    setSettings(defaultSettings);
    applySettings(defaultSettings);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          aria-label="접근성 설정"
          className="rounded-full fixed bottom-4 left-4 z-50 bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary/10 transition-all"
        >
          <Accessibility className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" side="top">
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
            <Accessibility className="h-5 w-5" />
            <span>접근성 설정</span>
          </h3>
          
          {/* 글꼴 크기 설정 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="font-size" className="flex items-center gap-1">
                <ZoomIn className="h-4 w-4" />
                <span>글꼴 크기</span>
              </Label>
              <span className="text-xs text-muted-foreground">{Math.round(settings.fontSize * 100)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <ZoomOut className="h-3 w-3 text-muted-foreground" />
              <Slider
                id="font-size"
                min={0.8}
                max={1.5}
                step={0.05}
                value={[settings.fontSize]}
                onValueChange={(value) => handleSettingChange('fontSize', value[0])}
                className="flex-1"
              />
              <ZoomIn className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          {/* 대비 설정 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="contrast" className="flex items-center gap-1">
                <Contrast className="h-4 w-4" />
                <span>대비</span>
              </Label>
              <span className="text-xs text-muted-foreground">{Math.round(settings.contrast * 100)}%</span>
            </div>
            <Slider
              id="contrast"
              min={1}
              max={1.5}
              step={0.05}
              value={[settings.contrast]}
              onValueChange={(value) => handleSettingChange('contrast', value[0])}
            />
          </div>
          
          {/* 커서 크기 설정 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="cursor-size" className="flex items-center gap-1">
                <MousePointer2 className="h-4 w-4" />
                <span>커서 크기</span>
              </Label>
              <span className="text-xs text-muted-foreground">{Math.round(settings.cursorSize * 100)}%</span>
            </div>
            <Slider
              id="cursor-size"
              min={1}
              max={2}
              step={0.1}
              value={[settings.cursorSize]}
              onValueChange={(value) => handleSettingChange('cursorSize', value[0])}
            />
          </div>
          
          {/* 모션 감소 설정 */}
          <div className="flex items-center justify-between">
            <Label htmlFor="reduce-motion" className="flex items-center gap-1 cursor-pointer">
              <PanelTop className="h-4 w-4" />
              <span>모션 감소</span>
            </Label>
            <Switch
              id="reduce-motion"
              checked={settings.reduceMotion}
              onCheckedChange={(checked) => handleSettingChange('reduceMotion', checked)}
            />
          </div>
          
          {/* 포커스 아웃라인 강화 설정 */}
          <div className="flex items-center justify-between">
            <Label htmlFor="focus-outline" className="flex items-center gap-1 cursor-pointer">
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
              >
                <path d="M3 16v-2a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"></path>
                <path d="M12 12V2"></path>
                <path d="M12 12v10"></path>
              </svg>
              <span>포커스 표시 강화</span>
            </Label>
            <Switch
              id="focus-outline"
              checked={settings.focusOutline}
              onCheckedChange={(checked) => handleSettingChange('focusOutline', checked)}
            />
          </div>
          
          {/* 기본 설정으로 재설정 */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetToDefaults}
            className="w-full mt-4"
          >
            기본 설정으로 재설정
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}