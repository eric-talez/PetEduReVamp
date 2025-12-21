import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/ThemeSwitcher";
import { useAuth } from "../../SimpleApp";
import { SocialLoginButtons } from "@/components/SocialLoginButtons";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// UserRole 타입 정의
type UserRole = 'user' | 'pet-owner' | 'trainer' | 'institute-admin' | 'admin';

export default function Register() {
  const auth = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Form states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [userRole, setUserRole] = useState<UserRole>("pet-owner");
  const [instituteCode, setInstituteCode] = useState("");
  const [instituteOption, setInstituteOption] = useState<"talez" | "custom">("talez");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialSignup, setIsSocialSignup] = useState(false);
  const [socialProvider, setSocialProvider] = useState<string>("");
  
  // 소셜 로그인 정보 가져오기
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const social = urlParams.get('social');
    
    if (social) {
      setIsSocialSignup(true);
      setSocialProvider(social);
      
      // API에서 소셜 로그인 정보 가져오기
      fetch('/api/auth/social-signup')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            const socialData = data.data;
            setEmail(socialData.email || "");
            setName(socialData.name || "");
            setPhoneNumber(socialData.mobile || "");
            setGender(socialData.gender || "");
            
            // 생년월일 처리
            if (socialData.birthyear && socialData.birthday) {
              const [month, day] = socialData.birthday.split('-');
              setBirthDate(`${socialData.birthyear}-${month}-${day}`);
            }
            
            toast({
              title: "소셜 로그인 정보 불러오기 성공",
              description: `${social} 계정 정보를 불러왔습니다. 추가 정보를 입력해주세요.`,
            });
          }
        })
        .catch(error => {
          console.error('소셜 가입 정보 조회 오류:', error);
        });
    }
  }, [toast]);
  
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

  // 로그인 페이지로 이동
  const goToLogin = () => {
    console.log("로그인 페이지로 이동 시도");
    
    // 로딩 표시를 위한 오버레이 요소 생성
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black/30 z-50 flex items-center justify-center';
    overlay.innerHTML = `
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center">
        <div class="animate-spin w-6 h-6 border-3 border-primary border-t-transparent rounded-full mr-3"></div>
        <p>페이지 이동 중...</p>
      </div>
    `;
    document.body.appendChild(overlay);
    
    // 약간의 지연 후 페이지 이동 (로딩 표시가 보이도록)
    setTimeout(() => {
      window.location.href = "/auth";
    }, 300);
  };

  // 회원가입 처리 함수
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 기본 필수 필드 검증
    if (!username || !email || !name || !phoneNumber || !birthDate || !gender) {
      toast({
        title: "입력 오류",
        description: "모든 필수 필드를 입력해주세요.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // 소셜 로그인이 아닌 경우 비밀번호 검증
    if (!isSocialSignup) {
      if (!password || !confirmPassword) {
        toast({
          title: "입력 오류",
          description: "비밀번호를 입력해주세요.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      if (password !== confirmPassword) {
        toast({
          title: "비밀번호 불일치",
          description: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    }

    // 생년월일 유효성 검증
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    
    if (age < 14 || age > 100) {
      toast({
        title: "생년월일 오류",
        description: "올바른 생년월일을 입력해주세요. (만 14세 이상)",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // 휴대폰 번호 유효성 검증
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast({
        title: "휴대폰 번호 오류",
        description: "휴대폰 번호는 010-0000-0000 형식으로 입력해주세요.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // CSRF 토큰 가져오기
      const csrfResponse = await fetch('/api/auth/csrf');
      const csrfData = await csrfResponse.json();
      const csrfToken = csrfData.token;
      
      // 회원가입 API 호출
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
          username,
          password: isSocialSignup ? undefined : password,
          email,
          name,
          phoneNumber,
          birthDate,
          gender,
          role: userRole,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "회원가입 성공",
          description: "회원가입이 완료되었습니다. 대시보드로 이동합니다.",
        });
        
        // 대시보드로 리다이렉트
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        toast({
          title: "회원가입 실패",
          description: data.message || "회원가입 중 오류가 발생했습니다.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      toast({
        title: "회원가입 오류",
        description: "서버와의 통신 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* 왼쪽 컬럼 - 폼 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-950">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">
              <span className="text-primary">Talez</span> 회원가입
            </h1>
            <p className="mt-2 text-muted-foreground">반려견과 함께하는 특별한 교육 여정에 참여하세요</p>
          </div>
          
          {/* 소셜 회원가입 버튼 */}
          <div className="space-y-4 mb-6">
            <h2 className="text-lg font-medium text-center">소셜 계정으로 간편 가입</h2>
            <SocialLoginButtons />
          </div>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-950 px-2 text-muted-foreground">
                또는 직접 가입
              </span>
            </div>
          </div>
          
          {/* 회원가입 폼 */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">아이디</Label>
              <Input
                id="username"
                type="text"
                placeholder="사용할 아이디를 입력하세요"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="이메일 주소를 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                type="text"
                placeholder="이름을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">휴대폰 번호</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="010-0000-0000"
                value={phoneNumber}
                onChange={(e) => {
                  let value = e.target.value.replace(/[^0-9]/g, '');
                  if (value.length >= 3) {
                    value = value.slice(0, 3) + '-' + value.slice(3);
                  }
                  if (value.length >= 8) {
                    value = value.slice(0, 8) + '-' + value.slice(8, 12);
                  }
                  setPhoneNumber(value);
                }}
                maxLength={13}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">생년월일</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">성별</Label>
              <Select
                value={gender}
                onValueChange={(value) => setGender(value as "male" | "female")}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="성별을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">남성</SelectItem>
                  <SelectItem value="female">여성</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* 소셜 로그인이 아닌 경우에만 비밀번호 필드 표시 */}
            {!isSocialSignup && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password">비밀번호</Label>
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
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">비밀번호 확인</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            
            {/* 소셜 로그인인 경우 안내 메시지 표시 */}
            {isSocialSignup && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {socialProvider === 'naver' ? '네이버' : socialProvider === 'kakao' ? '카카오' : '구글'} 계정으로 로그인하므로 비밀번호 설정이 필요하지 않습니다.
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="user-role">사용자 유형</Label>
              <Select
                value={userRole}
                onValueChange={(value) => setUserRole(value as UserRole)}
              >
                <SelectTrigger id="user-role">
                  <SelectValue placeholder="사용자 유형을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pet-owner">반려동물 보호자</SelectItem>
                  <SelectItem value="trainer">훈련사</SelectItem>
                  <SelectItem value="institute-admin">기관 관리자</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {(userRole === 'trainer' || userRole === 'institute-admin') && (
              <div className="space-y-2">
                <Label htmlFor="institute-option">소속 기관</Label>
                <Select 
                  value={instituteOption} 
                  onValueChange={(value: "talez" | "custom") => {
                    setInstituteOption(value);
                    if (value === "talez") {
                      setInstituteCode("");
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="소속 기관을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="talez">TALEZ 공식 기관</SelectItem>
                    <SelectItem value="custom">직접 입력</SelectItem>
                  </SelectContent>
                </Select>
                
                {instituteOption === "custom" && (
                  <Input
                    id="institute-code"
                    type="text"
                    placeholder="소속 기관 코드를 입력하세요"
                    value={instituteCode}
                    onChange={(e) => setInstituteCode(e.target.value)}
                    className="mt-2"
                  />
                )}
                
                {instituteOption === "talez" && (
                  <p className="text-sm text-muted-foreground mt-1">
                    TALEZ 공식 기관 소속으로 등록됩니다.
                  </p>
                )}
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>회원가입 중...</span>
                </div>
              ) : (
                "회원가입"
              )}
            </Button>
            
            <div className="text-center text-sm">
              <span className="text-muted-foreground">이미 계정이 있으신가요?</span>{" "}
              <Button variant="link" className="p-0" onClick={goToLogin}>
                로그인
              </Button>
            </div>
          </form>
          
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