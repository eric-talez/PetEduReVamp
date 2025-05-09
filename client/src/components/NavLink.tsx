import React from 'react';
import { Link, useLocation } from 'wouter';

// NavLink 컴포넌트는 Wouter의 Link를 개선한 버전으로,
// 현재 경로와 링크 경로가 일치할 때 active 클래스를 추가합니다.
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  exactMatch?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function NavLink({
  href,
  children,
  className = '',
  activeClassName = 'active',
  exactMatch = false,
  onClick,
  ...props
}: NavLinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const [location] = useLocation();
  
  // 현재 경로와 링크 경로가 일치하는지 확인
  const isActive = exactMatch
    ? location === href
    : location.startsWith(href) && (href !== '/' || location === '/');
  
  // 클래스 이름 결합
  const classes = `${className}${isActive ? ` ${activeClassName}` : ''}`;
  
  // 클릭 이벤트 핸들러
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // 사용자 정의 클릭 핸들러가 있으면 실행
    if (onClick) {
      onClick(e);
    }
  };
  
  return (
    <Link href={href} className={classes} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}