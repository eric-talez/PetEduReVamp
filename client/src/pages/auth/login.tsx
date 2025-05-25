import React, { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "../../SimpleApp";
import { SocialLoginButtons } from "@/components/SocialLoginButtons";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const auth = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // 이미 인증된 경우 대시보드로 리다이렉트
  if (auth.isAuthenticated) {
    // 대시보드로 리다이렉트
    const dashboardPath = auth.userRole === 'pet-owner' ? '/dashboard' : 
                         auth.userRole === 'trainer' ? '/trainer/dashboard' : 
                         auth.userRole === 'institute-admin' ? '/institute/dashboard' : 
                         auth.userRole === 'admin' ? '/admin/dashboard' : '/dashboard';
    
    // useEffect 내에서 리다이렉션 처리
    React.useEffect(() => {
      setLocation(dashboardPath);
    }, [dashboardPath, setLocation]);
    
    // 로딩 표시
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>이미 로그인되어 있습니다. 리다이렉트 중...</p>
        </div>
      </div>
    );
  }

  // 로그인 처리 함수
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 입력 검증
    if (!username || !password) {
      toast({
        title: "입력 오류",
        description: "아이디와 비밀번호를 모두 입력해주세요.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // 서버에 로그인 요청을 보내는 대신 
    // 소셜 로그인을 권장하는 메시지 표시
    setTimeout(() => {
      toast({
        title: "소셜 로그인 권장",
        description: "현재 Talez는 카카오와 네이버 소셜 로그인만 지원합니다.",
        variant: "default",
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen">
      {/* 왼쪽 컬럼 - 폼 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-950">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">
              <span className="text-primary">Talez</span>
            </h1>
            <p className="mt-2 text-muted-foreground">반려견과 함께하는 특별한 교육 여정</p>
          </div>
          
          <div className="w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">로그인</h2>
              <Button 
                variant="outline" 
                onClick={() => setLocation("/auth/register")}
                className="flex items-center gap-2"
              >
                회원가입
              </Button>
            </div>
            
            {/* 소셜 로그인 버튼 */}
            <div className="space-y-4 mb-6">
              <h2 className="text-lg font-medium text-center">소셜 계정으로 로그인</h2>
              <SocialLoginButtons />
            </div>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-950 px-2 text-muted-foreground">
                  또는 아이디로 로그인
                </span>
              </div>
            </div>
            
            {/* 아이디 로그인 폼 */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">아이디</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="아이디를 입력하세요"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">비밀번호</Label>
                  <a href="#" className="text-xs text-primary hover:underline">
                    비밀번호 찾기
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>로그인 중...</span>
                  </div>
                ) : (
                  "로그인"
                )}
              </Button>

              <div className="text-center text-sm mt-4">
                <span className="text-muted-foreground">계정이 없으신가요?</span>{" "}
                <Button variant="link" className="p-0" onClick={() => setLocation("/auth/register")}>
                  회원가입
                </Button>
              </div>
            </form>
          </div>
          
          {/* 약관 안내 */}
          <div className="text-xs text-center text-muted-foreground mt-6">
            <p>계속 진행하면 Talez의 <a href="/terms" className="text-primary hover:underline">이용약관</a>과 <a href="/privacy" className="text-primary hover:underline">개인정보처리방침</a>에 동의하게 됩니다.</p>
          </div>
          
          <div className="mt-4 flex justify-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
      
      {/* 오른쪽 컬럼 - 설명 영역 (데스크톱에서만 표시) */}
      <div className="hidden md:flex flex-1 bg-gradient-to-b from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 p-8 items-center justify-center">
        <div className="max-w-md text-center">
          <h2 className="text-3xl font-bold mb-4">Talez와 함께하는 반려견 교육</h2>
          <p className="mb-6 text-lg">
            반려견과 보호자를 위한 지능형 교육 플랫폼에서 
            전문 훈련사들과 함께 즐겁고 효과적인 교육 경험을 시작하세요.
          </p>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="p-4 bg-white bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-50 rounded-lg">
              <h3 className="font-bold text-lg mb-2">맞춤형 교육 코스</h3>
              <p>개별 반려견의 특성과 수준에 맞는 맞춤형 교육 코스</p>
            </div>
            <div className="p-4 bg-white bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-50 rounded-lg">
              <h3 className="font-bold text-lg mb-2">전문 훈련사 연결</h3>
              <p>검증된 전문 훈련사들과의 화상 훈련 및 1:1 상담</p>
            </div>
            <div className="p-4 bg-white bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-50 rounded-lg">
              <h3 className="font-bold text-lg mb-2">AI 행동 분석</h3>
              <p>인공지능을 활용한 반려견 행동 분석 및 진단</p>
            </div>
            <div className="p-4 bg-white bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-50 rounded-lg">
              <h3 className="font-bold text-lg mb-2">커뮤니티 참여</h3>
              <p>다양한 반려견 보호자들과의 교류 및 정보 공유</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}