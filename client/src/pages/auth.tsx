import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../hooks/useAuth";

const AuthPage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  
  // 이미 로그인되어 있으면 홈으로 리다이렉트
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      setLocation('/');
    }
  }, [isAuthenticated, isLoading, setLocation]);
  
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    
    // 개발용 더미 데이터 로그인
    if (username === 'user' && password === 'password') {
      // 일반 사용자 로그인
      localStorage.setItem('petedu_auth', JSON.stringify({
        user: 'demo-user',
        role: 'pet-owner'
      }));
      toast({
        title: "로그인 성공",
        description: "사용자로 로그인 되었습니다.",
      });
      window.location.href = '/';
    } else if (username === 'trainer' && password === 'password') {
      // 훈련사 로그인
      localStorage.setItem('petedu_auth', JSON.stringify({
        user: 'demo-trainer',
        role: 'trainer'
      }));
      toast({
        title: "로그인 성공",
        description: "훈련사로 로그인 되었습니다.",
      });
      window.location.href = '/';
    } else if (username === 'admin' && password === 'password') {
      // 관리자 로그인
      localStorage.setItem('petedu_auth', JSON.stringify({
        user: 'demo-admin',
        role: 'institute-admin'
      }));
      toast({
        title: "로그인 성공",
        description: "기관 관리자로 로그인 되었습니다.",
      });
      window.location.href = '/';
    } else if (username === 'system' && password === 'password') {
      // 시스템 관리자 로그인
      localStorage.setItem('petedu_auth', JSON.stringify({
        user: 'admin',
        role: 'admin'
      }));
      toast({
        title: "로그인 성공",
        description: "시스템 관리자로 로그인 되었습니다.",
      });
      window.location.href = '/';
    } else {
      toast({
        title: "로그인 실패",
        description: "계정 정보를 확인해주세요.",
        variant: "destructive",
      });
    }
  };
  
  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    if (!username || !email || !password || !confirmPassword) {
      toast({
        title: "필수 정보 누락",
        description: "모든 필드를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "비밀번호 불일치",
        description: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
        variant: "destructive",
      });
      return;
    }
    
    // 개발용 더미 데이터 회원가입 성공 처리
    toast({
      title: "회원가입 성공",
      description: "계정이 생성되었습니다. 로그인해주세요.",
    });
    
    // 로그인 탭으로 전환
    const loginTab = document.getElementById('login-tab') as HTMLButtonElement;
    if (loginTab) {
      loginTab.click();
    }
  };
  
  return (
    <div className="flex min-h-screen">
      {/* 로그인/회원가입 폼 */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">PetEduPlatform</h2>
            <p className="text-gray-600 dark:text-gray-400">반려동물 교육 플랫폼에 오신 것을 환영합니다</p>
          </div>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger id="login-tab" value="login">로그인</TabsTrigger>
              <TabsTrigger value="register">회원가입</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>로그인</CardTitle>
                  <CardDescription>
                    계정 정보를 입력하여 로그인하세요.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">아이디</Label>
                      <Input id="username" name="username" placeholder="아이디 입력" required />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">비밀번호</Label>
                        <a href="#" className="text-sm text-blue-500 hover:text-blue-600">
                          비밀번호 찾기
                        </a>
                      </div>
                      <Input id="password" name="password" type="password" placeholder="비밀번호 입력" required />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="remember" 
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <Label htmlFor="remember" className="text-sm font-normal">로그인 상태 유지</Label>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <strong>개발 모드 로그인 계정:</strong><br />
                      일반 사용자: user / password<br />
                      훈련사: trainer / password<br />
                      기관 관리자: admin / password<br />
                      시스템 관리자: system / password
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full">로그인</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>회원가입</CardTitle>
                  <CardDescription>
                    새 계정 생성을 위한 정보를 입력하세요.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-username">아이디</Label>
                      <Input id="reg-username" name="username" placeholder="아이디 입력" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">이메일</Label>
                      <Input id="email" name="email" type="email" placeholder="이메일 입력" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">비밀번호</Label>
                      <Input id="reg-password" name="password" type="password" placeholder="비밀번호 입력" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">비밀번호 확인</Label>
                      <Input id="confirm-password" name="confirmPassword" type="password" placeholder="비밀번호 재입력" required />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="terms" 
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        required
                      />
                      <Label htmlFor="terms" className="text-sm font-normal">
                        <span>이용약관 및 개인정보처리방침에 동의합니다</span>
                      </Label>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full">회원가입</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* 이미지/설명 섹션 */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-blue-500 to-indigo-600 flex-col justify-center items-center text-white p-8">
        <div className="max-w-md space-y-6">
          <h1 className="text-4xl font-bold">반려동물과 함께하는 교육 여정을 시작하세요</h1>
          <p className="text-xl">
            전문 훈련사의 맞춤 교육, 실시간 화상 수업, 올바른 반려동물 양육 정보를 제공합니다.
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-white mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <p>전문 훈련사의 맞춤형 교육 프로그램</p>
            </div>
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-white mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <p>비대면 화상 교육 및 훈련 서비스</p>
            </div>
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-white mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <p>반려동물 건강 및 행동 분석 서비스</p>
            </div>
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-white mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <p>전문 커뮤니티로 함께 성장하는 교육</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;