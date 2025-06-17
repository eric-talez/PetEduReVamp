import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  MoonStar, 
  Sun, 
  Eye, 
  Type, 
  ZoomIn, 
  ZoomOut, 
  LayoutGrid, 
  Contrast, 
  MousePointer2, 
  X,
  Settings,
  PanelLeft
} from 'lucide-react';
import { useTheme } from '@/context/theme-context';
import ContrastChecker from '@/components/ui/ContrastChecker';

interface AccessibilitySettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 접근성 설정 모달 컴포넌트
 * 글꼴 크기, 색 대비, 모션 감소 등 다양한 접근성 설정을 제공합니다.
 */
export function AccessibilitySettings({ isOpen, onClose }: AccessibilitySettingsProps) {
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState<number>(1);
  const [contrast, setContrast] = useState<number>(1);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [focusMode, setFocusMode] = useState<boolean>(false);
  
  // 글꼴 크기 변경 처리
  useEffect(() => {
    document.documentElement.style.setProperty('--accessibility-font-scale', fontSize.toString());
    const storageKey = 'petedu_accessibility_fontSize';
    localStorage.setItem(storageKey, fontSize.toString());
  }, [fontSize]);
  
  // 대비 변경 처리
  useEffect(() => {
    document.documentElement.style.setProperty('--accessibility-contrast', contrast.toString());
    const storageKey = 'petedu_accessibility_contrast';
    localStorage.setItem(storageKey, contrast.toString());
  }, [contrast]);
  
  // 고대비 모드 처리
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
    }
    const storageKey = 'petedu_accessibility_highContrast';
    localStorage.setItem(storageKey, highContrast.toString());
  }, [highContrast]);
  
  // 모션 감소 처리
  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
    const storageKey = 'petedu_accessibility_reducedMotion';
    localStorage.setItem(storageKey, reducedMotion.toString());
  }, [reducedMotion]);
  
  // 집중 모드 처리
  useEffect(() => {
    if (focusMode) {
      document.documentElement.classList.add('focus-mode');
    } else {
      document.documentElement.classList.remove('focus-mode');
    }
    const storageKey = 'petedu_accessibility_focusMode';
    localStorage.setItem(storageKey, focusMode.toString());
  }, [focusMode]);
  
  // 저장된 접근성 설정 로드
  useEffect(() => {
    const loadSavedSettings = () => {
      try {
        const savedFontSize = localStorage.getItem('petedu_accessibility_fontSize');
        if (savedFontSize) setFontSize(parseFloat(savedFontSize));
        
        const savedContrast = localStorage.getItem('petedu_accessibility_contrast');
        if (savedContrast) setContrast(parseFloat(savedContrast));
        
        const savedHighContrast = localStorage.getItem('petedu_accessibility_highContrast');
        if (savedHighContrast) setHighContrast(savedHighContrast === 'true');
        
        const savedReducedMotion = localStorage.getItem('petedu_accessibility_reducedMotion');
        if (savedReducedMotion) setReducedMotion(savedReducedMotion === 'true');
        
        const savedFocusMode = localStorage.getItem('petedu_accessibility_focusMode');
        if (savedFocusMode) setFocusMode(savedFocusMode === 'true');
      } catch (error) {
        console.error('접근성 설정을 로드하는 중 오류 발생:', error);
      }
    };
    
    loadSavedSettings();
  }, []);
  
  // 모든 설정 초기화
  const resetAllSettings = () => {
    setFontSize(1);
    setContrast(1);
    setHighContrast(false);
    setReducedMotion(false);
    setFocusMode(false);
    
    // 로컬 스토리지에서 설정 제거
    localStorage.removeItem('petedu_accessibility_fontSize');
    localStorage.removeItem('petedu_accessibility_contrast');
    localStorage.removeItem('petedu_accessibility_highContrast');
    localStorage.removeItem('petedu_accessibility_reducedMotion');
    localStorage.removeItem('petedu_accessibility_focusMode');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            접근성 설정
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* 글꼴 크기 설정 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-base font-medium flex items-center">
                <Type className="w-4 h-4 mr-2" />
                글꼴 크기
              </Label>
              <span className="text-sm text-muted-foreground">
                {Math.round((fontSize - 1) * 100)}% {fontSize > 1 ? '크게' : fontSize < 1 ? '작게' : '기본'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <ZoomOut className="w-4 h-4 text-muted-foreground" />
              <Slider
                defaultValue={[fontSize]}
                max={1.5}
                min={0.75}
                step={0.05}
                onValueChange={(value) => setFontSize(value[0])}
                aria-label="글꼴 크기 조절"
              />
              <ZoomIn className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          
          {/* 대비 설정 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-base font-medium flex items-center">
                <Contrast className="w-4 h-4 mr-2" />
                대비
              </Label>
              <span className="text-sm text-muted-foreground">
                {Math.round((contrast - 1) * 100)}% {contrast > 1 ? '높게' : contrast < 1 ? '낮게' : '기본'}
              </span>
            </div>
            <Slider
              defaultValue={[contrast]}
              max={1.3}
              min={0.8}
              step={0.05}
              onValueChange={(value) => setContrast(value[0])}
              aria-label="대비 조절"
            />
          </div>
          
          {/* 테마 전환 */}
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium flex items-center">
              {theme === 'dark' ? (
                <MoonStar className="w-4 h-4 mr-2" />
              ) : (
                <Sun className="w-4 h-4 mr-2" />
              )}
              다크 모드
            </Label>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              aria-label="다크 모드 전환"
            />
          </div>
          
          {/* 색상 대비 검사 */}
          <div className="pt-4 border-t">
            <ContrastChecker showDialog={true} />
          </div></old_str>bel="다크 모드 전환"
            />
          </div>
          
          {/* 고대비 모드 */}
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium flex items-center">
              <Contrast className="w-4 h-4 mr-2" />
              고대비 모드
            </Label>
            <Switch
              checked={highContrast}
              onCheckedChange={setHighContrast}
              aria-label="고대비 모드 전환"
            />
          </div>
          
          {/* 모션 감소 */}
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium flex items-center">
              <MousePointer2 className="w-4 h-4 mr-2" />
              모션 감소
            </Label>
            <Switch
              checked={reducedMotion}
              onCheckedChange={setReducedMotion}
              aria-label="모션 감소 전환"
            />
          </div>
          
          {/* 집중 모드 */}
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium flex items-center">
              <LayoutGrid className="w-4 h-4 mr-2" />
              집중 모드
            </Label>
            <Switch
              checked={focusMode}
              onCheckedChange={setFocusMode}
              aria-label="집중 모드 전환"
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={resetAllSettings}>
            설정 초기화
          </Button>
          <Button onClick={onClose}>적용</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * 접근성 설정을 여는 플로팅 버튼 컴포넌트
 */
export function AccessibilityFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-40 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={() => setIsOpen(true)}
        aria-label="접근성 설정 열기"
      >
        <Settings className="h-5 w-5" />
      </Button>
      
      <AccessibilitySettings isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}