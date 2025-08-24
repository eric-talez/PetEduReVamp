import React from 'react';
import { Button } from '@/components/ui/button';

interface SocialLoginButtonProps {
  provider: 'kakao' | 'naver' | 'google';
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
    },
    google: {
      backgroundColor: '#FFFFFF',
      hoverColor: '#F5F5F5',
      textColor: '#333333',
      logo: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
      text: '구글 로그인',
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

  const handleGoogleLogin = () => {
    // 구글 로그인 API 엔드포인트로 리다이렉트
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-row gap-3 w-full">
        <SocialLoginButton provider="kakao" onClick={handleKakaoLogin} className="flex-1" />
        <SocialLoginButton provider="naver" onClick={handleNaverLogin} className="flex-1" />
      </div>
      <SocialLoginButton provider="google" onClick={handleGoogleLogin} className="w-full" />
    </div>
  );
}