import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// UserRole 타입 정의
type UserRole = 'pet-owner' | 'trainer' | 'institute-admin' | 'admin';

/**
 * 회원가입 폼 컴포넌트
 * 새 계정을 등록할 수 있는 폼을 제공합니다.
 */
export default function RegisterForm() {
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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // 회원가입 처리 함수
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 입력 검증
    if (!username || !password || !confirmPassword || !email || !name || !phoneNumber || !birthDate || !gender) {
      toast({
        title: "입력 오류",
        description: "모든 필수 필드를 입력해주세요.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
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
    
    if (password !== confirmPassword) {
      toast({
        title: "비밀번호 불일치",
        description: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // 서버에 회원가입 요청
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username,
          password,
          email,
          name,
          phoneNumber,
          birthDate,
          gender,
          age: new Date().getFullYear() - new Date(birthDate).getFullYear(),
          role: userRole,
          instituteCode: (userRole === 'trainer' || userRole === 'institute-admin') ? instituteCode : undefined
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || '회원가입에 실패했습니다.');
      }

      const userData = await response.json();
      
      // 회원가입 성공 시 로그인 이벤트 발행
      const loginEvent = new CustomEvent('login', {
        detail: {
          role: userData.role,
          name: userData.name,
          userRole: userData.role,
          userName: userData.name
        }
      });
      window.dispatchEvent(loginEvent);

      toast({
        title: "회원가입 성공",
        description: `${userData.name}님, 환영합니다!`,
        variant: "default",
      });

      // 로그인 탭으로 전환하거나 대시보드로 이동
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);

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
        <Label htmlFor="phone">휴대폰 번호 <span className="text-red-500">*</span></Label>
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
        <Label htmlFor="birthDate">생년월일 <span className="text-red-500">*</span></Label>
        <Input
          id="birthDate"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          required
        />
        {birthDate && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            만 {new Date().getFullYear() - new Date(birthDate).getFullYear()}세
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">성별 <span className="text-red-500">*</span></Label>
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
          <Label htmlFor="institute-code">기관 코드</Label>
          <Input
            id="institute-code"
            type="text"
            placeholder="소속 기관 코드를 입력하세요"
            value={instituteCode}
            onChange={(e) => setInstituteCode(e.target.value)}
            required={userRole === 'trainer' || userRole === 'institute-admin'}
          />
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
    </form>
  );
}