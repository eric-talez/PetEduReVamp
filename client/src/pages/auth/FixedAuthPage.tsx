import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Eye, EyeOff, User, Lock, Mail, Info, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { SocialLoginButtons } from '@/components/SocialLoginButtons';
import { useAuth } from '@/hooks/useAuth';

const FixedAuthPage = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // URL에서 tab 파라미터 확인
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'register') {
      setActiveTab('register');
    }
  }, []);

  // 이미 로그인한 사용자는 홈으로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, setLocation]);

  // 탭 변경 시 URL 업데이트
  const handleTabChange = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    const newUrl = tab === 'register' 
      ? `/auth?tab=register` 
      : `/auth`;
    window.history.pushState({}, '', newUrl);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 왼쪽: 인증 폼 */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-3xl font-bold">Talez</CardTitle>
              <CardDescription>
                반려견과 함께하는 특별한 교육 여정
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {/* 탭 네비게이션 */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                <button
                  onClick={() => handleTabChange('login')}
                  className={`flex-1 py-3 font-medium text-center transition-colors ${
                    activeTab === 'login'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  로그인
                </button>
                <button
                  onClick={() => handleTabChange('register')}
                  className={`flex-1 py-3 font-medium text-center transition-colors ${
                    activeTab === 'register'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  회원가입
                </button>
              </div>

              {/* 소셜 로그인 버튼 */}
              <div className="mb-4">
                <SocialLoginButtons />
              </div>

              {/* 구분선 */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                    또는 {activeTab === 'login' ? '이메일로 로그인' : '이메일로 회원가입'}
                  </span>
                </div>
              </div>

              {/* 로그인/회원가입 폼 */}
              {activeTab === 'login' ? (
                <LoginForm />
              ) : (
                <RegisterForm onSuccess={() => handleTabChange('login')} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 오른쪽: 홍보 콘텐츠 */}
      <div className="hidden md:flex md:w-1/2 bg-primary-50 dark:bg-gray-800 p-12 flex-col justify-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-3xl font-bold mb-6">반려견 교육의 새로운 패러다임</h2>
          <p className="text-lg mb-10 text-gray-600 dark:text-gray-300">
            전문 훈련사의 1:1 맞춤 교육과 AI 기반 분석으로 당신의 반려견에게 최적화된 교육을 제공합니다.
          </p>
          
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md flex items-start space-x-4 transition-transform hover:scale-105">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
                <User size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">전문가 인증 훈련사</h3>
                <p className="text-gray-600 dark:text-gray-300">엄격한 심사를 통과한 전문 훈련사들이 검증된 교육 프로그램을 제공합니다.</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md flex items-start space-x-4 transition-transform hover:scale-105">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
                <Info size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">AI 기반 행동 분석</h3>
                <p className="text-gray-600 dark:text-gray-300">최신 AI 기술을 활용한 반려견 행동 분석으로 과학적이고 체계적인 솔루션을 제공합니다.</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md flex items-start space-x-4 transition-transform hover:scale-105">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
                <Building size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">위치 기반 서비스</h3>
                <p className="text-gray-600 dark:text-gray-300">내 주변의 반려동물 친화적인 장소와 서비스를 쉽게 찾고 이용할 수 있습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 로그인 폼 컴포넌트
const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
      }

      toast({
        title: "로그인 성공",
        description: "환영합니다!",
      });

      // 로그인 성공 시 홈으로 이동
      window.location.href = '/';
    } catch (error) {
      toast({
        title: "로그인 실패",
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <User size={18} className="text-gray-500" />
          <label htmlFor="username" className="block text-sm font-medium">
            아이디
          </label>
        </div>
        <Input
          id="username"
          type="text"
          placeholder="아이디를 입력하세요"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isLoading}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Lock size={18} className="text-gray-500" />
          <label htmlFor="password" className="block text-sm font-medium">
            비밀번호
          </label>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="w-full"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember-me"
            className="h-4 w-4 text-primary border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-gray-600 dark:text-gray-400">
            로그인 상태 유지
          </label>
        </div>
        <a href="#" className="text-primary hover:underline">
          비밀번호 찾기
        </a>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
};

// 회원가입 폼 컴포넌트
interface RegisterFormProps {
  onSuccess: () => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<string>('pet-owner');
  const [instituteCode, setInstituteCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "비밀번호 불일치",
        description: "비밀번호와 확인 비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const userData: Record<string, any> = {
        username,
        password,
        email,
        name,
        role,
      };
      
      if (role === 'trainer' || role === 'institute-admin') {
        userData.instituteCode = instituteCode;
      }

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '회원가입에 실패했습니다.');
      }

      toast({
        title: "회원가입 성공",
        description: "회원가입이 완료되었습니다. 로그인해주세요!",
      });

      // 폼 초기화
      setUsername('');
      setEmail('');
      setName('');
      setPassword('');
      setConfirmPassword('');
      setRole('pet-owner');
      setInstituteCode('');

      // 로그인 탭으로 전환
      onSuccess();
    } catch (error) {
      toast({
        title: "회원가입 실패",
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <User size={18} className="text-gray-500" />
          <label htmlFor="reg-username" className="block text-sm font-medium">
            아이디
          </label>
        </div>
        <Input
          id="reg-username"
          type="text"
          placeholder="아이디를 입력하세요"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Mail size={18} className="text-gray-500" />
          <label htmlFor="reg-email" className="block text-sm font-medium">
            이메일
          </label>
        </div>
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
        <div className="flex items-center space-x-2">
          <User size={18} className="text-gray-500" />
          <label htmlFor="reg-name" className="block text-sm font-medium">
            이름
          </label>
        </div>
        <Input
          id="reg-name"
          type="text"
          placeholder="이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Lock size={18} className="text-gray-500" />
            <label htmlFor="reg-password" className="block text-sm font-medium">
              비밀번호
            </label>
          </div>
          <div className="relative">
            <Input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Lock size={18} className="text-gray-500" />
            <label htmlFor="reg-confirm-password" className="block text-sm font-medium">
              비밀번호 확인
            </label>
          </div>
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
        <div className="flex items-center space-x-2">
          <Info size={18} className="text-gray-500" />
          <label htmlFor="reg-role" className="block text-sm font-medium">
            역할
          </label>
        </div>
        <select
          id="reg-role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={isLoading}
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          required
        >
          <option value="pet-owner">반려인</option>
          <option value="trainer">훈련사</option>
          <option value="institute-admin">기관 관리자</option>
        </select>
      </div>

      {(role === 'trainer' || role === 'institute-admin') && (
        <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Building size={18} className="text-gray-500" />
            <label htmlFor="reg-institute-code" className="block text-sm font-medium">
              기관 코드
            </label>
          </div>
          <Input
            id="reg-institute-code"
            type="text"
            placeholder="소속 기관 코드를 입력하세요"
            value={instituteCode}
            onChange={(e) => setInstituteCode(e.target.value)}
            required
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            * 훈련사 또는 기관 관리자는 소속 기관 코드가 필요합니다.
          </p>
        </div>
      )}

      <div className="pt-2">
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "회원가입 중..." : "회원가입"}
        </Button>
      </div>
    </form>
  );
};

export default FixedAuthPage;