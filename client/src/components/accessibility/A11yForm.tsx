import React, { forwardRef } from 'react';
import { Form as ShadcnForm } from '@/components/ui/form';
import LiveRegion from './LiveRegion';

interface A11yFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  /** 폼 제목 (스크린 리더용) */
  ariaLabel?: string;
  /** 폼 설명 ID (aria-describedby에 연결) */
  descriptionId?: string;
  /** 제출 버튼 텍스트 */
  submitText?: string;
  /** 제출 중인지 여부 */
  isSubmitting?: boolean;
  /** 오류 메시지 */
  error?: string;
  /** 성공 메시지 */
  successMessage?: string;
  /** 폼 작성 진행률 (0-100) */
  progress?: number;
  /** 폼 항목 children */
  children: React.ReactNode;
  /** 폼 제출 핸들러 */
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  /** shadcn Form 컨텍스트 */
  formContext?: any;
}

/**
 * 접근성이 강화된 폼 컴포넌트
 * 
 * 스크린 리더 사용자를 위한 적절한 ARIA 속성 및 라이브 리전을 포함한 폼
 */
const A11yForm = forwardRef<HTMLFormElement, A11yFormProps>(({
  ariaLabel,
  descriptionId,
  error,
  successMessage,
  isSubmitting = false,
  progress,
  children,
  onSubmit,
  formContext,
  ...props
}, ref) => {
  // shadcn Form 사용 여부에 따라 다른 폼 렌더링
  const FormComponent = formContext ? ShadcnForm : 'form';
  
  // 폼 상태 메시지 생성
  const statusMessage = error 
    ? error 
    : successMessage 
    ? successMessage 
    : isSubmitting 
    ? '양식을 제출 중입니다. 잠시만 기다려주세요.'
    : '';

  return (
    <>
      <FormComponent
        ref={ref}
        aria-label={ariaLabel}
        aria-describedby={descriptionId}
        onSubmit={onSubmit}
        noValidate // HTML 기본 유효성 검사 비활성화, 자체 검증 사용
        {...(formContext ? { ...formContext } : {})}
        {...props}
      >
        {/* 진행률 표시 (있는 경우) */}
        {progress !== undefined && (
          <div 
            role="progressbar" 
            aria-valuemin={0} 
            aria-valuemax={100} 
            aria-valuenow={progress}
            aria-busy={isSubmitting}
            className="sr-only"
          >
            양식 작성 진행률: {progress}%
          </div>
        )}
        
        {children}
        
        {/* 폼이 제출 중일 때 접근성을 위한 숨겨진 로딩 표시기 */}
        {isSubmitting && (
          <div 
            aria-live="polite" 
            className="sr-only"
            role="status"
          >
            양식을 제출 중입니다. 잠시만 기다려주세요.
          </div>
        )}
      </FormComponent>
      
      {/* 폼 상태 변경 알림을 위한 라이브 리전 */}
      {statusMessage && (
        <LiveRegion 
          message={statusMessage}
          ariaLive={error ? 'assertive' : 'polite'}
        />
      )}
    </>
  );
});

A11yForm.displayName = 'A11yForm';

export default A11yForm;