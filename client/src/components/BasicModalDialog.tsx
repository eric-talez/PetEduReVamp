import React, { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BasicModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
}

export function BasicModalDialog({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-3xl'
}: BasicModalDialogProps) {
  if (!isOpen) return null;

  console.log('모달 렌더링 - BasicModalDialog');

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      console.log('모달 배경 클릭');
      onClose();
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg ${maxWidth} w-full max-h-[90vh] overflow-y-auto`}
        onClick={handleModalClick}
      >
        {/* 헤더 */}
        {title && (
          <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-800 relative">
            <h2 className="text-lg md:text-xl font-bold pr-8">{title}</h2>
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('모달 닫기 버튼 클릭');
                onClose();
              }}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 cursor-pointer z-10"
              aria-label="닫기"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        
        {/* 본문 */}
        <div className="p-4 md:p-6">
          {children}
        </div>
        
        {/* 푸터 */}
        <div className="p-4 md:p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
          <Button 
            type="button"
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('모달 닫기 버튼 클릭');
              onClose();
            }}
          >
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}