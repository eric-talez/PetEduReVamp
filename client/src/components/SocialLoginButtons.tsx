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
      borderColor: 'transparent',
      logo: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 3C7.03 3 3 6.16 3 10c0 2.38 1.56 4.48 3.93 5.67.28.13.48.4.55.71l.35 1.39c.11.45.61.63.98.37l1.59-1.12c.27-.19.6-.26.92-.2.96.17 1.96.26 2.99.26 4.97 0 9-3.16 9-7s-4.03-7-9-7z"/>
        </svg>
      ),
      text: '카카오 로그인',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    naver: {
      backgroundColor: '#03C75A',
      hoverColor: '#02B150',
      textColor: '#FFFFFF',
      borderColor: 'transparent',
      logo: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.5683 10.7393L6.15833 0H0V20H6.43167V9.26067L13.8417 20H20V0H13.5683V10.7393Z" fill="white"/>
        </svg>
      ),
      text: '네이버 로그인',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    google: {
      backgroundColor: '#FFFFFF',
      hoverColor: '#F8F8F8',
      textColor: '#3c4043',
      borderColor: '#dadce0',
      logo: (
        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" fillRule="evenodd">
            <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </g>
        </svg>
      ),
      text: '구글 로그인',
      fontFamily: '"Roboto", system-ui, -apple-system, sans-serif',
    }
  };

  const config = providerConfig[provider];

  return (
    <Button
      type="button"
      className={`w-full flex items-center justify-center gap-3 font-medium transition-colors ${className}`}
      style={{
        backgroundColor: config.backgroundColor,
        color: config.textColor,
        border: `1px solid ${config.borderColor}`,
        fontFamily: config.fontFamily,
        fontSize: '14px',
        height: '44px',
        borderRadius: '6px',
        padding: '0 16px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = config.hoverColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = config.backgroundColor;
      }}
      onClick={onClick}
    >
      <span className="flex items-center justify-center" style={{ minWidth: '20px' }}>
        {config.logo}
      </span>
      <span style={{ fontWeight: 500 }}>{config.text}</span>
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