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
  const [userRole, setUserRole] = useState<UserRole>("pet-owner");
  const [instituteCode, setInstituteCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // 회원가입 처리 함수
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 입력 검증
    if (!username || !password || !confirmPassword || !email || !name) {
      toast({
        title: "입력 오류",
        description: "모든 필드를 입력해주세요.",
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
    
    // 서버에 회원가입 요청을 보내는 대신
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