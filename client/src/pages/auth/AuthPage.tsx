import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Eye, EyeOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useToast } from "@/hooks/use-toast";
import { SocialLoginButtons } from '@/components/SocialLoginButtons';
import { useAuth } from '@/hooks/useAuth';

/**
 * 로그인 폼 컴포넌트
 */
const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // 로그인 API 호출
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
      }

      toast({
        title: '로그인 성공',
        description: '환영합니다!',
      });
      
      // 로그인 성공 후 홈으로 리다이렉트
      window.location.href = '/';
    } catch (error) {
      toast({
        title: '로그인 실패',
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">아이디</Label>
        <Input
          id="username"
          placeholder="아이디를 입력하세요"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">비밀번호</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? '로그인 중...' : '로그인'}
      </Button>
    </form>
  );
};

/**
 * 회원가입 폼 컴포넌트
 */
const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<string>('pet-owner');
  const [instituteCode, setInstituteCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: '비밀번호 불일치',
        description: '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 회원가입 API 호출
      const userData: Record<string, any> = {
        username,
        password,
        email,
        name,
        role,
      };
      
      // 훈련사나 기관 관리자인 경우 기관 코드 추가
      if (role === 'trainer' || role === 'institute-admin') {
        userData.instituteCode = instituteCode;
      }
      
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '회원가입에 실패했습니다.');
      }

      toast({
        title: '회원가입 성공',
        description: '회원가입이 완료되었습니다. 로그인해주세요.',
      });
      
      // 회원가입 성공 후 로그인 탭으로 전환
      window.history.pushState({}, '', '/auth');
      window.location.reload();
    } catch (error) {
      toast({
        title: '회원가입 실패',
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reg-username">아이디</Label>
        <Input
          id="reg-username"
          placeholder="아이디를 입력하세요"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="reg-password">비밀번호</Label>
          <div className="relative">
            <Input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="reg-confirm-password">비밀번호 확인</Label>
          <Input
            id="reg-confirm-password"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-email">이메일</Label>
        <Input
          id="reg-email"
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-name">이름</Label>
        <Input
          id="reg-name"
          placeholder="이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-role">역할</Label>
        <select
          id="reg-role"
          className="w-full px-3 py-2 border rounded-md bg-background"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          disabled={isLoading}
        >
          <option value="pet-owner">반려인</option>
          <option value="trainer">훈련사</option>
          <option value="institute-admin">기관 관리자</option>
        </select>
      </div>
      
      {(role === 'institute-admin' || role === 'trainer') && (
        <div className="space-y-2">
          <Label htmlFor="reg-institute-code">기관 코드</Label>
          <Input
            id="reg-institute-code"
            placeholder="소속 기관 코드를 입력하세요"
            value={instituteCode}
            onChange={(e) => setInstituteCode(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
      )}
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? '회원가입 중...' : '회원가입'}
      </Button>
    </form>
  );
};

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