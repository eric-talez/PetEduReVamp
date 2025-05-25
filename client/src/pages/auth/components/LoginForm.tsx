import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

/**
 * 로그인 폼 컴포넌트
 * 이메일/아이디와 비밀번호로 로그인할 수 있는 폼을 제공합니다.
 */
export default function LoginForm() {
  const { toast } = useToast();
  
  // Form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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
    </form>
  );
}