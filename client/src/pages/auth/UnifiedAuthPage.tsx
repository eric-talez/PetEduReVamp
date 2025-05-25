import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { SocialLoginButtons } from '@/components/SocialLoginButtons';
import { useAuth } from '@/hooks/useAuth';

const UnifiedAuthPage = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect already authenticated users to home
  React.useEffect(() => {
    if (isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, setLocation]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Authentication Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Talez</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              반려견과 함께하는 특별한 교육 여정
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b mb-6">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 text-center transition-colors ${
                activeTab === 'login'
                  ? 'border-b-2 border-primary text-primary font-medium'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              로그인
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 text-center transition-colors ${
                activeTab === 'register'
                  ? 'border-b-2 border-primary text-primary font-medium'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              회원가입
            </button>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-2">
            <SocialLoginButtons />
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                또는 {activeTab === 'login' ? '이메일로 로그인' : '이메일로 회원가입'}
              </span>
            </div>
          </div>

          {/* Login/Register Form */}
          {activeTab === 'login' ? <LoginForm /> : <RegisterForm onSuccess={() => setActiveTab('login')} />}
        </div>
      </div>

      {/* Right side - Promotional content */}
      <div className="hidden md:block md:w-1/2 bg-gray-100 dark:bg-gray-800 p-12">
        <div className="h-full flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6">반려견 교육의 새로운 패러다임</h2>
          <p className="text-lg mb-8">
            전문 훈련사의 1:1 맞춤 교육과 AI 기반 분석으로 당신의 반려견에게 최적화된 교육을 제공합니다.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">1</div>
              <div>
                <h3 className="font-bold text-lg">전문가 인증 훈련사</h3>
                <p className="text-gray-600 dark:text-gray-400">검증된 자격을 갖춘 전문 훈련사의 교육</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">2</div>
              <div>
                <h3 className="font-bold text-lg">AI 기반 행동 분석</h3>
                <p className="text-gray-600 dark:text-gray-400">과학적 데이터를 기반으로 맞춤형 솔루션 제공</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">3</div>
              <div>
                <h3 className="font-bold text-lg">실시간 피드백</h3>
                <p className="text-gray-600 dark:text-gray-400">훈련 과정에서 즉각적인 조언과 피드백</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Login Form Component
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

      // Redirect to home page
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          아이디
        </label>
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

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          비밀번호
        </label>
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

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <a href="#" className="text-primary hover:underline">
            비밀번호를 잊으셨나요?
          </a>
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
};

// Register Form Component
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

      // Reset form
      setUsername('');
      setEmail('');
      setName('');
      setPassword('');
      setConfirmPassword('');
      setRole('pet-owner');
      setInstituteCode('');

      // Switch to login tab
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
      <div>
        <label htmlFor="reg-username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          아이디
        </label>
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

      <div>
        <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          이메일
        </label>
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

      <div>
        <label htmlFor="reg-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          이름
        </label>
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

      <div>
        <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          비밀번호
        </label>
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

      <div>
        <label htmlFor="reg-confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          비밀번호 확인
        </label>
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

      <div>
        <label htmlFor="reg-role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          역할
        </label>
        <select
          id="reg-role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={isLoading}
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          required
        >
          <option value="pet-owner">반려인</option>
          <option value="trainer">훈련사</option>
          <option value="institute-admin">기관 관리자</option>
        </select>
      </div>

      {(role === 'trainer' || role === 'institute-admin') && (
        <div>
          <label htmlFor="reg-institute-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            기관 코드
          </label>
          <Input
            id="reg-institute-code"
            type="text"
            placeholder="소속 기관 코드를 입력하세요"
            value={instituteCode}
            onChange={(e) => setInstituteCode(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "회원가입 중..." : "회원가입"}
      </Button>
    </form>
  );
};

export default UnifiedAuthPage;