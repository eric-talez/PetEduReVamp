import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { SocialLoginButtons } from '@/components/SocialLoginButtons';
import { useAuth } from '@/hooks/useAuth';

const NewAuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Talez</CardTitle>
            <CardDescription className="text-center">
              반려동물 교육 플랫폼에 오신 것을 환영합니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Custom Tab Navigation */}
            <div className="flex border-b mb-6">
              <button
                className={`flex-1 py-2 font-medium text-center transition-colors ${
                  activeTab === 'login' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('login')}
              >
                로그인
              </button>
              <button
                className={`flex-1 py-2 font-medium text-center transition-colors ${
                  activeTab === 'register' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('register')}
              >
                회원가입
              </button>
            </div>
            
            {/* Login Form */}
            {activeTab === 'login' && <LoginForm />}
            
            {/* Register Form */}
            {activeTab === 'register' && <RegisterForm />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

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
    <div>
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">아이디</label>
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
          <label htmlFor="password" className="text-sm font-medium">비밀번호</label>
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
    </div>
  );
};

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
      
      // Reset form and switch to login tab
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setEmail('');
      setName('');
      setRole('pet-owner');
      setInstituteCode('');
      
      // Go back to login tab (parent component will handle this)
      document.querySelector('[data-tab="login"]')?.dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      );
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
    <div>
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="reg-username" className="text-sm font-medium">아이디</label>
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
            <label htmlFor="reg-password" className="text-sm font-medium">비밀번호</label>
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
            <label htmlFor="reg-confirm-password" className="text-sm font-medium">비밀번호 확인</label>
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
          <label htmlFor="reg-email" className="text-sm font-medium">이메일</label>
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
          <label htmlFor="reg-name" className="text-sm font-medium">이름</label>
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
          <label htmlFor="reg-role" className="text-sm font-medium">역할</label>
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
            <label htmlFor="reg-institute-code" className="text-sm font-medium">기관 코드</label>
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
    </div>
  );
};

export default NewAuthPage;