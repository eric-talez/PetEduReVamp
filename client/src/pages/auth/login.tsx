import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "../../SimpleApp";
import AgreementSectionTalez, { AgreementValues } from "@/components/AgreementSectionTalez";
import { toast } from "@/hooks/use-toast";
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
    }, []);
    
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
          <CardTitle>로그인 / 회원가입</CardTitle>
          <CardDescription>Talez 서비스를 이용하세요</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">로그인</TabsTrigger>
              <TabsTrigger value="register">회원가입</TabsTrigger>
            </TabsList>
            
            {/* 로그인 폼 */}
            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="loginUsername" className="text-sm font-medium">
                      아이디
                    </label>
                    <input
                      id="loginUsername"
                      type="text"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="loginPassword" className="text-sm font-medium">
                      비밀번호
                    </label>
                    <input
                      id="loginPassword"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                      required
                    />
                  </div>
                  
                  {loginError && (
                    <div className="text-destructive text-sm">{loginError}</div>
                  )}
                  
                  <Button type="submit" className="w-full" disabled={isLoginLoading}>
                    {isLoginLoading ? "로그인 중..." : "로그인"}
                  </Button>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    <a href="/forgot-password" className="text-primary hover:underline">
                      비밀번호를 잊으셨나요?
                    </a>
                  </div>
                </div>
              </form>
            </TabsContent>
            
            {/* 회원가입 폼 */}
            <TabsContent value="register">
              <form onSubmit={handleRegisterSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="registerUsername" className="text-sm font-medium">
                      아이디
                    </label>
                    <input
                      id="registerUsername"
                      type="text"
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      className={`w-full p-2 border rounded-md bg-white dark:bg-gray-800 ${
                        registerUsername.length > 0 && registerUsername.length < 3 
                          ? "border-red-500 dark:border-red-600" 
                          : "border-gray-300 dark:border-gray-700"
                      }`}
                      required
                      minLength={3}
                    />
                    {registerUsername.length > 0 && registerUsername.length < 3 && (
                      <p className="text-red-500 text-xs mt-1">아이디는 3자 이상이어야 합니다</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="registerName" className="text-sm font-medium">
                      이름
                    </label>
                    <input
                      id="registerName"
                      type="text"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className={`w-full p-2 border rounded-md bg-white dark:bg-gray-800 ${
                        registerName.length > 0 && registerName.length < 2 
                          ? "border-red-500 dark:border-red-600" 
                          : "border-gray-300 dark:border-gray-700"
                      }`}
                      required
                      minLength={2}
                    />
                    {registerName.length > 0 && registerName.length < 2 && (
                      <p className="text-red-500 text-xs mt-1">이름을 올바르게 입력해주세요</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="registerEmail" className="text-sm font-medium">
                      이메일
                    </label>
                    <input
                      id="registerEmail"
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className={`w-full p-2 border rounded-md bg-white dark:bg-gray-800 ${
                        registerEmail.length > 0 && !/^\S+@\S+\.\S+$/.test(registerEmail) 
                          ? "border-red-500 dark:border-red-600" 
                          : "border-gray-300 dark:border-gray-700"
                      }`}
                      required
                    />
                    {registerEmail.length > 0 && !/^\S+@\S+\.\S+$/.test(registerEmail) && (
                      <p className="text-red-500 text-xs mt-1">유효한 이메일 형식이 아닙니다</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="registerPassword" className="text-sm font-medium">
                      비밀번호
                    </label>
                    <input
                      id="registerPassword"
                      type="password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className={`w-full p-2 border rounded-md bg-white dark:bg-gray-800 ${
                        registerPassword.length > 0 && registerPassword.length < 6 
                          ? "border-red-500 dark:border-red-600" 
                          : "border-gray-300 dark:border-gray-700"
                      }`}
                      required
                      minLength={6}
                    />
                    {registerPassword.length > 0 && registerPassword.length < 6 && (
                      <p className="text-red-500 text-xs mt-1">비밀번호는 6자 이상이어야 합니다</p>
                    )}
                  </div>
                  
                  {/* 이용약관 동의 섹션 */}
                  <AgreementSectionTalez 
                    onChange={(values, valid) => {
                      setAgreements(values);
                      setIsAgreementValid(valid);
                    }}
                  />
                  
                  {registerError && (
                    <div className="text-destructive text-sm">{registerError}</div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isRegisterLoading || !isAgreementValid}
                  >
                    {isRegisterLoading ? "가입 중..." : "회원가입"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="mt-6 text-center text-sm text-muted-foreground space-y-2">
        <p>테스트 계정</p>
        <p><strong>일반 회원: </strong><code>demo / password</code></p>
        <p><strong>견주 회원: </strong><code>pet-owner / password</code></p>
        <p><strong>훈련사: </strong><code>trainer / password</code></p>
        <p><strong>기관 관리자: </strong><code>institute / password</code></p>
        <p><strong>시스템 관리자: </strong><code>admin / password</code></p>
      </div>
    </div>
  );
}