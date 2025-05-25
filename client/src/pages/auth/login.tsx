import React from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "../../SimpleApp";
import { SocialLoginButtons } from "@/components/SocialLoginButtons";

export default function Login() {
  const auth = useAuth();
  const [location, setLocation] = useLocation();
  
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

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">
          <span className="text-primary">Talez</span>
        </h1>
        <p className="mt-2 text-muted-foreground">반려견과 함께하는 특별한 교육 여정</p>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>소셜 계정으로 로그인</CardTitle>
          <CardDescription>간편하게 Talez 서비스를 이용하세요</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {/* 소셜 로그인 버튼 */}
            <SocialLoginButtons />
            
            {/* 약관 안내 */}
            <div className="text-xs text-center text-muted-foreground mt-6">
              <p>계속 진행하면 Talez의 <a href="/terms" className="text-primary hover:underline">이용약관</a>과 <a href="/privacy" className="text-primary hover:underline">개인정보처리방침</a>에 동의하게 됩니다.</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            소셜 로그인으로 시작하세요
          </div>
          <ThemeToggle />
        </CardFooter>
      </Card>
    </div>
  );
}