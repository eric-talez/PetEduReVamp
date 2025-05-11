import React, { forwardRef } from 'react';
import { 
  Select as ShadcnSelect,
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel,
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Option {
  value: string;
  label: string;
}

interface GroupedOptions {
  label: string;
  options: Option[];
}

interface A11ySelectProps {
  /** 선택 요소의 ID */
  id: string;
  /** 선택 요소의 레이블 */
  label: string;
  /** 선택 옵션 목록 */
  options: Option[] | GroupedOptions[];
  /** 현재 선택된 값 */
  value?: string;
  /** 기본 선택 안내 텍스트 */
  placeholder?: string;
  /** 값 변경 시 콜백 */
  onChange?: (value: string) => void;
  /** 레이블이 시각적으로 숨겨져야 하는지 여부 */
  hideLabel?: boolean;
  /** 필수 입력 필드 여부 */
  required?: boolean;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 오류 여부 */
  error?: string;
  /** 도움말 텍스트 */
  helperText?: string;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 선택 요소가 그룹화되어 있는지 여부 */
  isGrouped?: boolean;
}

/**
 * 접근성이 강화된 Select 컴포넌트
 * 
 * 적절한 레이블링, ARIA 속성, 키보드 접근성이 추가된 드롭다운 선택 요소
 */
const A11ySelect = forwardRef<HTMLButtonElement, A11ySelectProps>(({
  id,
  label,
  options,
  value,
  placeholder = '선택하세요',
  onChange,
  hideLabel = false,
  required = false,
  disabled = false,
  error,
  helperText,
  className = '',
  isGrouped = false,
}, ref) => {
  // ID 생성
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;
  const labelId = `${id}-label`;
  
  // 그룹화된 옵션인지 확인
  const hasGroups = isGrouped || (options.length > 0 && 'options' in options[0]);
  
  return (
    <div className={`w-full ${className}`}>
      {/* 레이블 */}
      <Label
        htmlFor={id}
        id={labelId}
        className={hideLabel ? 'sr-only' : 'mb-2 block text-sm font-medium'}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      {/* Select 컴포넌트 */}
      <ShadcnSelect
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          ref={ref}
          aria-labelledby={labelId}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          aria-invalid={!!error}
          aria-required={required}
          className={`w-full ${error ? 'border-destructive' : ''}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        
        <SelectContent>
          {hasGroups ? (
            // 그룹화된 옵션 렌더링
            (options as GroupedOptions[]).map((group, groupIndex) => (
              <SelectGroup key={groupIndex}>
                <SelectLabel>{group.label}</SelectLabel>
                {group.options.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))
          ) : (
            // 단일 옵션 목록 렌더링
            (options as Option[]).map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </ShadcnSelect>
      
      {/* 오류 메시지 또는 도움말 텍스트 */}
      {error ? (
        <p
          id={errorId}
          className="mt-1.5 text-sm text-destructive"
        >
          {error}
        </p>
      ) : helperText ? (
        <p
          id={helperId}
          className="mt-1.5 text-sm text-muted-foreground"
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

A11ySelect.displayName = 'A11ySelect';

export default A11ySelect;