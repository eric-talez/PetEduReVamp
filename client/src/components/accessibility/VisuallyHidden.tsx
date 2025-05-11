import React from 'react';
import { srOnly } from '@/utils/accessibility/a11y-utils';

interface VisuallyHiddenProps {
  /** 시각적으로만 숨길 콘텐츠 */
  children: React.ReactNode;
  /** 요소가 완전히 제거되어야 하는지 여부 */
  remove?: boolean;
  /** 강제로 표시해야 하는지 여부 */
  show?: boolean;
  /** HTML 요소 타입 */
  as?: React.ElementType;
}

/**
 * 시각적으로만 숨겨진 컴포넌트
 * 
 * 시각적으로는 보이지 않지만 스크린 리더는 읽을 수 있는 텍스트를 위한 컴포넌트
 * 아이콘 버튼이나 시각적 UI에 대한 추가 설명 등을 제공할 때 유용
 */
const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({
  children,
  remove = false,
  show = false,
  as: Component = 'span',
  ...rest
}) => {
  // remove가 true이고 show가 false이면 컴포넌트를 렌더링하지 않음
  if (remove && !show) {
    return null;
  }

  // show가 true이면 일반적으로 보이는 요소로 렌더링
  if (show) {
    return <Component {...rest}>{children}</Component>;
  }

  // 기본적으로 시각적으로만 숨겨진 요소로 렌더링
  return (
    <Component className={srOnly} {...rest}>
      {children}
    </Component>
  );
};

export default VisuallyHidden;