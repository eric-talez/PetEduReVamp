import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  Settings, 
  Eye, 
  Type, 
  Contrast, 
  MousePointer,
  Volume2,
  Minimize2
} from "lucide-react";

interface AccessibilitySettings {
  textScale: number;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  soundEffects: boolean;
  largerButtons: boolean;
}

export default function AccessibilityControls() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    textScale: 100,
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    soundEffects: true,
    largerButtons: false,
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage and apply them
  useEffect(() => {
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    applyAccessibilitySettings(settings);
  }, [settings]);

  const applyAccessibilitySettings = (settings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // Text scaling
    root.style.fontSize = `${settings.textScale}%`;
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('accessibility-high-contrast');
    } else {
      root.classList.remove('accessibility-high-contrast');
    }
    
    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('accessibility-reduced-motion');
    } else {
      root.classList.remove('accessibility-reduced-motion');
    }
    
    // Larger buttons
    if (settings.largerButtons) {
      root.classList.add('accessibility-large-buttons');
    } else {
      root.classList.remove('accessibility-large-buttons');
    }
  };

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-12 h-12 p-0 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        aria-label="접근성 설정"
      >
        <Settings className="w-5 h-5" />
      </Button>

      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-80 shadow-xl border-2 border-blue-200 bg-white z-50">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <Eye className="w-5 h-5 mr-2 text-blue-600" />
                접근성 설정
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)}
                aria-label="설정 닫기"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>

            {/* 텍스트 크기 조절 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center">
                  <Type className="w-4 h-4 mr-2" />
                  텍스트 크기
                </label>
                <span className="text-sm text-gray-600">{settings.textScale}%</span>
              </div>
              <Slider
                value={[settings.textScale]}
                onValueChange={(value) => updateSetting('textScale', value[0])}
                min={75}
                max={150}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>작게</span>
                <span>보통</span>
                <span>크게</span>
              </div>
            </div>

            {/* 고대비 모드 */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center">
                <Contrast className="w-4 h-4 mr-2" />
                고대비 모드
              </label>
              <Switch
                checked={settings.highContrast}
                onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                aria-label="고대비 모드 전환"
              />
            </div>

            {/* 애니메이션 줄이기 */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center">
                <MousePointer className="w-4 h-4 mr-2" />
                애니메이션 줄이기
              </label>
              <Switch
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
                aria-label="애니메이션 줄이기"
              />
            </div>

            {/* 큰 버튼 */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center">
                <MousePointer className="w-4 h-4 mr-2" />
                큰 버튼 사용
              </label>
              <Switch
                checked={settings.largerButtons}
                onCheckedChange={(checked) => updateSetting('largerButtons', checked)}
                aria-label="큰 버튼 사용"
              />
            </div>

            {/* 스크린 리더 최적화 */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center">
                <Volume2 className="w-4 h-4 mr-2" />
                스크린 리더 최적화
              </label>
              <Switch
                checked={settings.screenReader}
                onCheckedChange={(checked) => updateSetting('screenReader', checked)}
                aria-label="스크린 리더 최적화"
              />
            </div>

            {/* 음향 효과 */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center">
                <Volume2 className="w-4 h-4 mr-2" />
                음향 효과
              </label>
              <Switch
                checked={settings.soundEffects}
                onCheckedChange={(checked) => updateSetting('soundEffects', checked)}
                aria-label="음향 효과 켜기/끄기"
              />
            </div>

            {/* 키보드 단축키 안내 */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">키보드 단축키</h4>
              <div className="text-xs space-y-1 text-gray-600">
                <div>Ctrl+1-4: 탭 전환</div>
                <div>F1: 도움말</div>
                <div>ESC: 포커스 해제</div>
                <div>Tab: 다음 요소로 이동</div>
              </div>
            </div>

            {/* 설정 초기화 */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const defaultSettings: AccessibilitySettings = {
                  textScale: 100,
                  highContrast: false,
                  reducedMotion: false,
                  screenReader: false,
                  soundEffects: true,
                  largerButtons: false,
                };
                setSettings(defaultSettings);
              }}
            >
              설정 초기화
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}