import React from 'react';

interface SkipLinkProps {
  /** 스킵할 콘텐츠의 ID */
  contentId: string;
  /** 링크 텍스트 */
  children?: React.ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 스킵 링크 컴포넌트
 * 
 * 키보드 사용자가 반복적인 네비게이션을 건너뛰고 바로 주요 콘텐츠로 이동할 수 있게 해주는 컴포넌트
 * Tab 키로 페이지에 처음 진입했을 때만 보이도록 설계되어 있습니다.
 */
const SkipLink: React.FC<SkipLinkProps> = ({
  contentId,
  children = '주요 콘텐츠로 건너뛰기',
  className = '',
}) => {
  return (
    <a
      href={`#${contentId}`}
      className={`fixed top-0 left-0 p-2.5 bg-primary text-white z-50 transform -translate-y-full focus:translate-y-0 transition-transform duration-200 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${className}`}
    >
      {children}
    </a>
  );
};

export default SkipLink;