import React from 'react';
import { Button } from '@/components/ui/button';

interface SocialLoginButtonProps {
  provider: 'kakao' | 'naver';
  onClick?: () => void;
  className?: string;
}

/**
 * 소셜 로그인 버튼 컴포넌트
 */
export function SocialLoginButton({ provider, onClick, className = '' }: SocialLoginButtonProps) {
  const providerConfig = {
    kakao: {
      backgroundColor: '#FEE500',
      hoverColor: '#F6DC00',
      textColor: '#000000',
      logo: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M12 3C7.03 3 3 6.16 3 10c0 2.38 1.56 4.48 3.93 5.67.28.13.48.4.55.71l.35 1.39c.11.45.61.63.98.37l1.59-1.12c.27-.19.6-.26.92-.2.96.17 1.96.26 2.99.26 4.97 0 9-3.16 9-7s-4.03-7-9-7z"/>
        </svg>
      ),
      text: '카카오 로그인',
    },
    naver: {
      backgroundColor: '#03C75A',
      hoverColor: '#02B150',
      textColor: '#FFFFFF',
      logo: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z"/>
        </svg>
      ),
      text: '네이버 로그인',
    }
  };

  const config = providerConfig[provider];

  return (
    <Button
      type="button"
      className={`w-full flex items-center justify-center gap-2 font-medium ${className}`}
      style={{
        backgroundColor: config.backgroundColor,
        color: config.textColor,
      }}
      onClick={onClick}
    >
      <span className="w-5 h-5">{config.logo}</span>
      <span>{config.text}</span>
    </Button>
  );
}

/**
 * 소셜 로그인 버튼 그룹 컴포넌트
 */
export function SocialLoginButtons() {
  const handleKakaoLogin = () => {
    // 카카오 로그인 API 엔드포인트로 리다이렉트
    window.location.href = '/api/auth/kakao';
  };

  const handleNaverLogin = () => {
    // 네이버 로그인 API 엔드포인트로 리다이렉트
    window.location.href = '/api/auth/naver';
  };

  return (
    <div className="flex flex-row gap-3 w-full">
      <SocialLoginButton provider="kakao" onClick={handleKakaoLogin} className="flex-1" />
      <SocialLoginButton provider="naver" onClick={handleNaverLogin} className="flex-1" />
    </div>
  );
}