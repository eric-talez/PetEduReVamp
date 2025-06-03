import React, { useState } from 'react';
import { useTheme } from '@/context/theme-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Palette, 
  Eye,
  Settings,
  Check
} from 'lucide-react';

/**
 * 테마 설정 컴포넌트
 * 사용자가 라이트/다크 모드 및 기타 테마 설정을 조정할 수 있는 통합 설정 패널
 */
export function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const [autoTheme, setAutoTheme] = useState(theme === 'system');

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    setAutoTheme(newTheme === 'system');
    console.log('테마 변경됨:', newTheme);
  };

  const currentTheme = theme || 'light';

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          테마 설정
        </CardTitle>
        <CardDescription>
          화면 테마와 표시 설정을 조정하세요
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 테마 모드 선택 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">화면 모드</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={currentTheme === 'light' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleThemeChange('light')}
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              <Sun className="h-4 w-4" />
              <span className="text-xs">라이트</span>
              {currentTheme === 'light' && <Check className="h-3 w-3" />}
            </Button>
            
            <Button
              variant={currentTheme === 'dark' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleThemeChange('dark')}
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              <Moon className="h-4 w-4" />
              <span className="text-xs">다크</span>
              {currentTheme === 'dark' && <Check className="h-3 w-3" />}
            </Button>
            
            <Button
              variant={currentTheme === 'system' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleThemeChange('system')}
              className="flex flex-col items-center gap-1 h-auto py-3"
            >
              <Monitor className="h-4 w-4" />
              <span className="text-xs">자동</span>
              {currentTheme === 'system' && <Check className="h-3 w-3" />}
            </Button>
          </div>
        </div>

        <Separator />

        {/* 자동 테마 설정 */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">시스템 설정 따르기</Label>
            <p className="text-xs text-muted-foreground">
              운영체제의 다크/라이트 모드 설정을 자동으로 따릅니다
            </p>
          </div>
          <Switch
            checked={autoTheme}
            onCheckedChange={(checked) => {
              handleThemeChange(checked ? 'system' : 'light');
            }}
          />
        </div>

        <Separator />

        {/* 현재 테마 상태 표시 */}
        <div className="rounded-lg bg-muted p-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              {currentTheme === 'light' && <Sun className="h-4 w-4" />}
              {currentTheme === 'dark' && <Moon className="h-4 w-4" />}
              {currentTheme === 'system' && <Monitor className="h-4 w-4" />}
              <span className="font-medium">현재 테마:</span>
            </div>
            <span className="capitalize">
              {currentTheme === 'light' && '라이트 모드'}
              {currentTheme === 'dark' && '다크 모드'}
              {currentTheme === 'system' && '시스템 자동'}
            </span>
          </div>
        </div>

        {/* 테마 미리보기 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">미리보기</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded border bg-background p-2 text-foreground">
              <div className="text-xs font-medium">라이트 모드</div>
              <div className="text-xs text-muted-foreground mt-1">밝은 화면</div>
            </div>
            <div className="rounded border bg-gray-900 p-2 text-white">
              <div className="text-xs font-medium">다크 모드</div>
              <div className="text-xs text-gray-400 mt-1">어두운 화면</div>
            </div>
          </div>
        </div>

        {/* 접근성 정보 */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Eye className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p>
            다크 모드는 눈의 피로를 줄이고 배터리 사용량을 절약할 수 있습니다.
            시스템 자동 설정을 사용하면 시간대에 따라 자동으로 전환됩니다.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 간단한 테마 토글 버튼 컴포넌트
 * TopBar나 다른 곳에서 빠른 테마 전환을 위해 사용
 */
export function QuickThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    console.log('빠른 테마 전환:', newTheme);
    console.log('현재 document.documentElement.className:', document.documentElement.className);
    
    // 즉시 DOM에 클래스 적용하여 시각적 변화 보장
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.remove('light');
      root.classList.add('dark');
      console.log('다크 모드 클래스 추가됨');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      console.log('라이트 모드 클래스 추가됨');
    }
    
    console.log('변경 후 document.documentElement.className:', document.documentElement.className);
    
    // 테마 상태 업데이트
    setTheme(newTheme);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="h-9 w-9 px-0 hover:bg-accent border-gray-300 dark:border-gray-600"
      aria-label="테마 전환"
      title="다크/라이트 모드 전환"
    >
      <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}