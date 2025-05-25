import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// 임시로 직접 컴포넌트 구현
const LoginForm = () => {
  return <div>로그인 폼</div>
};

const RegisterForm = () => {
  return <div>회원가입 폼</div>
};
import { useLocation } from 'wouter';
import { SocialLoginButtons } from '@/components/SocialLoginButtons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/SimpleApp';

/**
 * 통합된 인증 페이지 컴포넌트
 * 로그인과 회원가입을 탭으로 구분하여 하나의 페이지에서 제공
 */
export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  
  // URL 파라미터에 따라 탭 설정
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    
    if (tabParam === 'register') {
      setActiveTab('register');
    } else {
      setActiveTab('login');
    }
  }, []);
  
  // 인증된 사용자는 홈으로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      console.log("이미 인증된 사용자가 인증 페이지 접근 - 홈으로 리다이렉트");
      setLocation('/');
    }
  }, [isAuthenticated, setLocation]);
  
  // 탭 변경 시 URL 업데이트
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newUrl = value === 'register' ? '/auth?tab=register' : '/auth';
    window.history.pushState({}, '', newUrl);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* 왼쪽: 인증 폼 */}
      <div className="flex flex-col justify-center w-full max-w-md p-8 mx-auto">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Talez</CardTitle>
            <CardDescription className="text-center">
              반려동물 교육 플랫폼에 오신 것을 환영합니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">로그인</TabsTrigger>
                <TabsTrigger value="register">회원가입</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <div className="mb-4">
                  <SocialLoginButtons />
                </div>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      또는 이메일로 로그인
                    </span>
                  </div>
                </div>
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                <div className="mb-4">
                  <SocialLoginButtons />
                </div>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      또는 이메일로 회원가입
                    </span>
                  </div>
                </div>
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* 오른쪽: 히어로 섹션 */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/10">
        <div className="flex flex-col justify-center p-12 text-center">
          <h1 className="text-4xl font-bold mb-6">반려견 교육의 새로운 패러다임</h1>
          <p className="text-lg mb-8">
            전문 훈련사의 1:1 맞춤 교육과 AI 기반 분석으로<br />
            당신의 반려견에게 최적화된 교육을 제공합니다.
          </p>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-white/10 rounded-lg">
              <div className="mr-4 rounded-full bg-primary/20 p-2">
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-medium">전문가 인증 훈련사</h3>
                <p className="text-sm opacity-80">검증된 자격을 갖춘 전문 훈련사의 교육</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-white/10 rounded-lg">
              <div className="mr-4 rounded-full bg-primary/20 p-2">
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-medium">AI 기반 행동 분석</h3>
                <p className="text-sm opacity-80">과학적 데이터를 기반으로 맞춤형 솔루션 제공</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-white/10 rounded-lg">
              <div className="mr-4 rounded-full bg-primary/20 p-2">
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-medium">실시간 피드백</h3>
                <p className="text-sm opacity-80">훈련 과정에서 즉각적인 조언과 피드백</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}