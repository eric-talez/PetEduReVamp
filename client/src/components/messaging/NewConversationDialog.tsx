import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMessaging } from "@/hooks/useMessaging";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, UserPlus } from "lucide-react";

// 사용자 역할에 따른 색상 지정
const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin':
      return 'text-red-500';
    case 'institute-admin':
      return 'text-amber-500';
    case 'trainer':
      return 'text-green-500';
    case 'pet-owner':
      return 'text-blue-500';
    default:
      return 'text-gray-500';
  }
};

// 사용자 역할 한글화
const getRoleLabel = (role: string) => {
  switch (role) {
    case 'admin':
      return '관리자';
    case 'institute-admin':
      return '기관 관리자';
    case 'trainer':
      return '훈련사';
    case 'pet-owner':
      return '반려인';
    default:
      return '사용자';
  }
};

// 사용자 타입 정의
interface User {
  id: number;
  name: string;
  role: string;
  avatar: string | null;
  email?: string;
}

export function NewConversationButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button 
        variant="outline" 
        className="w-full mb-2" 
        onClick={() => setOpen(true)}
      >
        <UserPlus className="h-4 w-4 mr-2" />
        새 대화 시작
      </Button>
      
      <NewConversationDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewConversationDialog({ open, onOpenChange }: NewConversationDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const { startConversation } = useMessaging();
  const { toast } = useToast();

  // 검색 핸들러
  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) return;
    
    try {
      setIsSearching(true);
      
      // JSON POST 요청으로 변경하여 인코딩 문제 해결
      const response = await fetch('/api/users/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ query: searchTerm.trim() })
      });
      
      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.users) {
        setSearchResults(data.users);
      } else {
        throw new Error(data.message || '검색 결과를 가져오는데 실패했습니다.');
      }
    } catch (error) {
      console.error("사용자 검색 오류:", error);
      toast({
        title: "검색 실패",
        description: error instanceof Error ? error.message : "사용자 검색 중 오류가 발생했습니다.",
        variant: "destructive"
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchTerm, toast]);

  // 대화 시작 핸들러
  const handleStartConversation = useCallback((userId: number) => {
    startConversation(userId);
    onOpenChange(false);
    setSearchTerm("");
    setSearchResults([]);
    
    toast({
      title: "대화 시작",
      description: "새로운 대화가 시작되었습니다.",
      variant: "default"
    });
  }, [startConversation, onOpenChange, toast]);

  // 초기 상태 리셋
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSearchTerm("");
      setSearchResults([]);
    }
    onOpenChange(open);
  };

  // 엔터키로 검색 실행
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>새 대화 시작</DialogTitle>
          <DialogDescription>
            대화할 사용자를 검색하고 선택하세요.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 mb-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="user-search" className="sr-only">
              사용자 검색
            </Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="user-search"
                placeholder="이름 또는 역할로 검색"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSearching}
              />
            </div>
          </div>
          <Button onClick={handleSearch} disabled={isSearching || !searchTerm.trim()}>
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "검색"}
          </Button>
        </div>
        
        <div className="max-h-[200px] overflow-y-auto border rounded-md">
          {isSearching ? (
            <div className="p-4 text-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
              <p>검색 중...</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              {searchTerm.trim() ? "검색 결과가 없습니다." : "사용자를 검색하세요."}
            </div>
          ) : (
            <ul className="divide-y">
              {searchResults.map((user: User) => (
                <li key={user.id} className="p-3 hover:bg-secondary transition-colors">
                  <button
                    className="w-full flex items-center justify-between"
                    onClick={() => handleStartConversation(user.id)}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
                        ) : (
                          <span>{user.name.substring(0, 1)}</span>
                        )}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-medium">{user.name}</span>
                        {user.email && (
                          <span className="text-xs text-muted-foreground">
                            {user.email}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`text-xs ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button variant="secondary" onClick={() => handleOpenChange(false)}>
            취소
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}