import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "../../SimpleApp";

export default function Login() {
  const auth = useAuth();
  
  // 로그인 상태 관리
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  
  // 회원가입 상태 관리
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  
  const [, navigate] = useLocation();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoginLoading(true);

    try {
      // 실제 서버 로그인 API 호출
      console.log('로그인 시도:', { username: loginUsername });
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키를 포함하여 인증 세션 유지
        body: JSON.stringify({ 
          username: loginUsername, 
          password: loginPassword 
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '로그인에 실패했습니다');
      }
      
      // 서버에서 반환한 사용자 정보 처리
      const userData = await response.json();
      console.log('로그인 성공:', userData);
      
      // 글로벌 인증 상태 업데이트를 위한 이벤트 발생
      const loginEvent = new CustomEvent('login', {
        detail: { 
          role: userData.role,
          name: userData.name
        }
      });
      
      window.dispatchEvent(loginEvent);
      
      // 역할에 따라 다른 페이지로 리디렉션
      switch(userData.role) {
        case 'pet-owner':
          navigate("/dashboard");
          break;
        case 'trainer':
          navigate("/trainer/dashboard");
          break;
        case 'institute-admin':
          navigate("/institute/dashboard");
          break;
        case 'admin':
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/"); // 일반 회원은 홈페이지로
      }
    } catch (err) {
      console.error('로그인 오류:', err);
      setLoginError(err instanceof Error ? err.message : "로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
    } finally {
      setIsLoginLoading(false);
    }
  };
  
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    setIsRegisterLoading(true);
    
    try {
      // 실제 서버 회원가입 API 호출
      console.log('회원가입 시도:', { 
        username: registerUsername,
        name: registerName,
        email: registerEmail 
      });
      
      // 기본 역할은 pet-owner로 설정
      const registerRole = 'pet-owner';
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: registerUsername,
          password: registerPassword,
          email: registerEmail,
          name: registerName,
          role: registerRole
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '회원가입에 실패했습니다');
      }
      
      // 서버에서 반환한 사용자 정보 처리
      const userData = await response.json();
      console.log('회원가입 성공:', userData);
      
      // 글로벌 인증 상태 업데이트를 위한 이벤트 발생
      const loginEvent = new CustomEvent('login', {
        detail: { 
          role: userData.role,
          name: userData.name
        }
      });
      
      window.dispatchEvent(loginEvent);
      
      // 역할에 따라 다른 페이지로 리디렉션
      navigate("/dashboard");
      
    } catch (err) {
      console.error('회원가입 오류:', err);
      setRegisterError(err instanceof Error ? err.message : "회원가입에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsRegisterLoading(false);
    }
  };

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
          <Tabs defaultValue="login" className="w-full">
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
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                      required
                    />
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
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                      required
                    />
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
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                      required
                    />
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
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                      required
                    />
                  </div>
                  
                  {registerError && (
                    <div className="text-destructive text-sm">{registerError}</div>
                  )}
                  
                  <Button type="submit" className="w-full" disabled={isRegisterLoading}>
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