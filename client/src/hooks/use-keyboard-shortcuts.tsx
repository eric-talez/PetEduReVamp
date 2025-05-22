import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  description: string;
  action: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const [shortcutsEnabled, setShortcutsEnabled] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!shortcutsEnabled) return;
      
      // 입력 필드에서는 단축키 비활성화
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement instanceof HTMLSelectElement
      ) {
        return;
      }
      
      shortcuts.forEach(shortcut => {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey : !e.ctrlKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        
        if (keyMatch && ctrlMatch && altMatch && shiftMatch) {
          e.preventDefault();
          shortcut.action();
          
          // 단축키 사용 알림 (선택적)
          toast({
            title: '단축키 사용됨',
            description: shortcut.description,
            duration: 2000,
          });
        }
      });
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, shortcutsEnabled, toast]);
  
  return {
    shortcutsEnabled,
    setShortcutsEnabled
  };
}

// 애플리케이션 전체 단축키 설정
export function useGlobalShortcuts() {
  const [, navigate] = useLocation();
  
  const globalShortcuts: KeyboardShortcut[] = [
    {
      key: 'h',
      alt: true,
      description: '홈으로 이동',
      action: () => navigate('/')
    },
    {
      key: 'c',
      alt: true,
      description: '강좌 페이지로 이동',
      action: () => navigate('/courses')
    },
    {
      key: 'd',
      alt: true,
      description: '대시보드로 이동',
      action: () => navigate('/dashboard')
    },
    {
      key: 'p',
      alt: true,
      description: '반려동물 관리 페이지로 이동',
      action: () => navigate('/my-pets')
    },
    {
      key: 'm',
      alt: true,
      description: '메시지 페이지로 이동',
      action: () => navigate('/messages')
    },
    {
      key: 's',
      alt: true,
      description: '쇼핑몰로 이동',
      action: () => navigate('/shop')
    },
    {
      key: 'k',
      alt: true,
      description: '단축키 도움말 표시',
      action: () => {
        const modal = document.createElement('div');
        modal.innerHTML = `
          <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999; display: flex; justify-content: center; align-items: center;">
            <div style="background: white; padding: 20px; border-radius: 8px; max-width: 600px; max-height: 80vh; overflow-y: auto;">
              <h2 style="margin-top: 0; color: #333;">키보드 단축키</h2>
              <ul style="padding-left: 20px;">
                <li><strong>Alt + H</strong>: 홈으로 이동</li>
                <li><strong>Alt + C</strong>: 강좌 페이지로 이동</li>
                <li><strong>Alt + D</strong>: 대시보드로 이동</li>
                <li><strong>Alt + P</strong>: 반려동물 관리 페이지로 이동</li>
                <li><strong>Alt + M</strong>: 메시지 페이지로 이동</li>
                <li><strong>Alt + S</strong>: 쇼핑몰로 이동</li>
                <li><strong>Alt + K</strong>: 이 도움말 표시</li>
                <li><strong>Esc</strong>: 모달 닫기</li>
              </ul>
              <button style="padding: 8px 16px; background: #4c6ef5; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">닫기</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
        
        const closeModal = () => {
          document.body.removeChild(modal);
        };
        
        modal.querySelector('button').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closeModal();
        });
        
        // ESC 키로 닫기
        const escHandler = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            closeModal();
            window.removeEventListener('keydown', escHandler);
          }
        };
        window.addEventListener('keydown', escHandler);
      }
    }
  ];
  
  return useKeyboardShortcuts(globalShortcuts);
}