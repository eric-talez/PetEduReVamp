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
        const modalWrapper = document.createElement('div');
        modalWrapper.style.position = 'fixed';
        modalWrapper.style.top = '0';
        modalWrapper.style.left = '0';
        modalWrapper.style.width = '100%';
        modalWrapper.style.height = '100%';
        modalWrapper.style.background = 'rgba(0,0,0,0.7)';
        modalWrapper.style.zIndex = '9999';
        modalWrapper.style.display = 'flex';
        modalWrapper.style.justifyContent = 'center';
        modalWrapper.style.alignItems = 'center';
        
        const modalContent = document.createElement('div');
        modalContent.style.background = 'white';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '8px';
        modalContent.style.maxWidth = '600px';
        modalContent.style.maxHeight = '80vh';
        modalContent.style.overflow = 'auto';
        modalContent.setAttribute('role', 'dialog');
        modalContent.setAttribute('aria-labelledby', 'shortcuts-title');
        modalContent.setAttribute('aria-modal', 'true');
        
        const title = document.createElement('h2');
        title.id = 'shortcuts-title';
        title.style.marginTop = '0';
        title.style.color = '#333';
        title.textContent = '키보드 단축키';
        
        const list = document.createElement('ul');
        list.style.paddingLeft = '20px';
        
        const shortcuts = [
          { key: 'Alt + H', desc: '홈으로 이동' },
          { key: 'Alt + C', desc: '강좌 페이지로 이동' },
          { key: 'Alt + D', desc: '대시보드로 이동' },
          { key: 'Alt + P', desc: '반려동물 관리 페이지로 이동' },
          { key: 'Alt + M', desc: '메시지 페이지로 이동' },
          { key: 'Alt + S', desc: '쇼핑몰로 이동' },
          { key: 'Alt + K', desc: '이 도움말 표시' },
          { key: 'Esc', desc: '모달 닫기' }
        ];
        
        shortcuts.forEach(shortcut => {
          const item = document.createElement('li');
          const keySpan = document.createElement('strong');
          keySpan.textContent = shortcut.key;
          item.appendChild(keySpan);
          item.appendChild(document.createTextNode(': ' + shortcut.desc));
          list.appendChild(item);
        });
        
        const closeButton = document.createElement('button');
        closeButton.textContent = '닫기';
        closeButton.style.padding = '8px 16px';
        closeButton.style.background = '#4c6ef5';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '4px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.marginTop = '10px';
        
        modalContent.appendChild(title);
        modalContent.appendChild(list);
        modalContent.appendChild(closeButton);
        modalWrapper.appendChild(modalContent);
        
        document.body.appendChild(modalWrapper);
        
        // 포커스를 모달 내부로 이동
        closeButton.focus();
        
        const closeModal = () => {
          document.body.removeChild(modalWrapper);
        };
        
        closeButton.addEventListener('click', closeModal);
        
        modalWrapper.addEventListener('click', (e: MouseEvent) => {
          if (e.target === modalWrapper) closeModal();
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