import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { announceToScreenReader } from '@/components/a11y/AnnouncementRegion';

/**
 * 테마 전환 드롭다운 컴포넌트
 * 
 * 라이트/다크 모드 및 시스템 설정 간 전환을 위한 드롭다운 메뉴입니다.
 * 아이콘과 텍스트를 함께 표시하여 직관적인 사용을 돕습니다.
 */
export function ThemeSwitcherDropdown() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 컴포넌트가 마운트된 후에만 렌더링
  // 이는 서버 사이드 렌더링과 클라이언트 렌더링 간의 불일치를 방지합니다
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
          <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">테마 변경</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => {
            setTheme('light');
            announceToScreenReader('라이트 모드로 전환되었습니다');
          }}
          className={theme === 'light' ? 'bg-accent' : ''}
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>라이트</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => {
            setTheme('dark');
            announceToScreenReader('다크 모드로 전환되었습니다');
          }}
          className={theme === 'dark' ? 'bg-accent' : ''}
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>다크</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => {
            setTheme('system');
            announceToScreenReader('시스템 테마 설정으로 전환되었습니다');
          }}
          className={theme === 'system' ? 'bg-accent' : ''}
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span>시스템</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * 테마 전환 버튼 그룹 컴포넌트
 * 
 * 라이트/다크 모드 및 시스템 설정 간 전환을 위한 버튼 그룹입니다.
 * 각 옵션을 버튼으로 표시하여 한눈에 선택할 수 있습니다.
 */
export function ThemeSwitcherButtonGroup() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 컴포넌트가 마운트된 후에만 렌더링
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex space-x-1 rounded-md border p-1">
      <Button
        variant={theme === 'light' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => {
          setTheme('light');
          announceToScreenReader('라이트 모드로 전환되었습니다');
        }}
        aria-label="라이트 모드"
      >
        <Sun className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">라이트</span>
      </Button>
      <Button
        variant={theme === 'dark' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => {
          setTheme('dark');
          announceToScreenReader('다크 모드로 전환되었습니다');
        }}
        aria-label="다크 모드"
      >
        <Moon className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">다크</span>
      </Button>
      <Button
        variant={theme === 'system' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => {
          setTheme('system');
          announceToScreenReader('시스템 테마 설정으로 전환되었습니다');
        }}
        aria-label="시스템 설정 사용"
      >
        <Monitor className="h-4 w-4 mr-1" />
        <span className="hidden sm:inline">시스템</span>
      </Button>
    </div>
  );
}

/**
 * 테마 전환 아이콘 버튼 컴포넌트
 * 
 * 라이트/다크 모드를 토글하는 간단한 아이콘 버튼입니다.
 * 최소한의 UI로 테마 전환 기능을 제공합니다.
 */
export function ThemeSwitcherIconButton() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 컴포넌트가 마운트된 후에만 렌더링
  useEffect(() => {
    setMounted(true);
  }, []);

  // 테마 토글 함수
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    announceToScreenReader(`${newTheme === 'dark' ? '다크' : '라이트'} 모드로 전환되었습니다`);
  };

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-9 w-9 px-0"
      aria-label={`${theme === 'dark' ? '라이트' : '다크'} 모드로 전환`}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}

/**
 * 테마 설정 패널 컴포넌트
 * 
 * 테마 색상 선택과 함께 다크/라이트 모드 전환 옵션을 제공하는 설정 패널입니다.
 * 사용자가 UI 테마를 세밀하게 커스터마이징할 수 있습니다.
 */
export function ThemeSettingsPanel() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [primaryColor, setPrimaryColor] = useState<string>('blue');

  // 사용 가능한 색상 테마
  const colorThemes = [
    { name: '파랑', value: 'blue', color: '#3b82f6' },
    { name: '빨강', value: 'red', color: '#ef4444' },
    { name: '녹색', value: 'green', color: '#22c55e' },
    { name: '보라', value: 'purple', color: '#a855f7' },
    { name: '주황', value: 'orange', color: '#f97316' },
    { name: '분홍', value: 'pink', color: '#ec4899' },
  ];

  // 컴포넌트가 마운트된 후에만 렌더링
  useEffect(() => {
    setMounted(true);
    
    // 저장된 색상 테마 불러오기
    const savedColor = localStorage.getItem('primaryColor') || 'blue';
    setPrimaryColor(savedColor);
    
    // 색상 테마 적용
    document.documentElement.setAttribute('data-color-theme', savedColor);
  }, []);

  // 색상 테마 변경 함수
  const handleColorChange = (color: string) => {
    setPrimaryColor(color);
    localStorage.setItem('primaryColor', color);
    document.documentElement.setAttribute('data-color-theme', color);
    announceToScreenReader(`주 색상이 ${colorThemes.find(c => c.value === color)?.name || color}(으)로 변경되었습니다`);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-background">
      <div>
        <h3 className="text-lg font-medium mb-4">테마 설정</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">모드</label>
            <div className="flex space-x-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setTheme('light');
                  announceToScreenReader('라이트 모드로 전환되었습니다');
                }}
              >
                <Sun className="h-4 w-4 mr-2" />
                라이트
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setTheme('dark');
                  announceToScreenReader('다크 모드로 전환되었습니다');
                }}
              >
                <Moon className="h-4 w-4 mr-2" />
                다크
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setTheme('system');
                  announceToScreenReader('시스템 테마 설정으로 전환되었습니다');
                }}
              >
                <Monitor className="h-4 w-4 mr-2" />
                시스템
              </Button>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-2">주 색상</label>
            <div className="flex flex-wrap gap-2">
              {colorThemes.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorChange(color.value)}
                  className={`w-8 h-8 rounded-full border-2 ${primaryColor === color.value ? 'border-ring ring-2 ring-ring ring-offset-2 ring-offset-background' : 'border-border'}`}
                  style={{ backgroundColor: color.color }}
                  aria-label={`${color.name} 색상 선택`}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ThemeToggle alias for backward compatibility
export const ThemeToggle = ThemeSwitcherIconButton;