import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  AlertCircle,
  Save,
  RefreshCw,
  Shield,
  Mail,
  Lock,
  Users,
  Database,
  Globe,
  Upload,
  BellRing,
  LayoutDashboard,
  Cog,
  FileText,
  MessageSquare,
  Loader2,
  CheckCircle,
  XCircle,
  Image as ImageIcon
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ImageUpload } from '@/components/ImageUpload';

export default function AdminSettings() {
  const { userName } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [showRestartDialog, setShowRestartDialog] = useState(false);
  const [logoImages, setLogoImages] = useState<{ [key: string]: string }>({});
  const [uploadingLogo, setUploadingLogo] = useState<string | null>(null);
  
  // 레이아웃 설정 상태
  const [defaultLayout, setDefaultLayout] = useState('sidebar');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [topNavEnabled, setTopNavEnabled] = useState(false);

  // 현재 로고 설정 조회
  const { data: currentLogos, isLoading: logosLoading } = useQuery({
    queryKey: ['/api/admin/logos'],
    retry: false,
  });

  // 로고 업로드 뮤테이션
  const logoUploadMutation = useMutation({
    mutationFn: async ({ type, file }: { type: string; file: File }) => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', type);
      
      const response = await fetch('/api/admin/logos/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('로고 업로드 실패');
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: '로고 업로드 완료',
        description: `${variables.type} 로고가 성공적으로 업로드되었습니다.`,
      });
      setUploadingLogo(null);
      // 로고 목록 다시 조회
      window.location.reload();
    },
    onError: (error: any) => {
      toast({
        title: '로고 업로드 실패',
        description: error.message || '로고 업로드 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
      setUploadingLogo(null);
    },
  });

  // 로고 삭제 뮤테이션
  const logoDeleteMutation = useMutation({
    mutationFn: async (type: string) => {
      return apiRequest(`/api/admin/logos/${type}`, {
        method: 'DELETE',
      });
    },
    onSuccess: (data, type) => {
      toast({
        title: '로고 삭제 완료',
        description: `${type} 로고가 성공적으로 삭제되었습니다.`,
      });
      // 로고 목록 다시 조회
      window.location.reload();
    },
    onError: (error: any) => {
      toast({
        title: '로고 삭제 실패',
        description: error.message || '로고 삭제 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    },
  });

  // 로고 업로드 핸들러
  const handleLogoUpload = async (type: string, urlOrFile: string | File) => {
    if (typeof urlOrFile === 'string') {
      // URL인 경우 API를 통해 로고 저장
      try {
        const response = await apiRequest(`/api/logo/set`, 'POST', {
          type,
          url: urlOrFile
        });
        
        if (response.success) {
          toast({
            title: '로고 업로드 완료',
            description: `${type === 'expanded' ? '확장' : '축소'} 로고가 성공적으로 저장되었습니다.`,
          });
          // 로고 목록 다시 조회
          window.location.reload();
        } else {
          throw new Error(response.message || '로고 저장 실패');
        }
      } catch (error: any) {
        toast({
          title: '로고 저장 실패',
          description: error.message || '로고 저장 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      }
    } else {
      // File인 경우 기존 로직 사용
      setUploadingLogo(type);
      logoUploadMutation.mutate({ type, file: urlOrFile });
    }
  };

  // 로고 삭제 핸들러
  const handleLogoDelete = (type: string) => {
    logoDeleteMutation.mutate(type);
  };

  // 레이아웃 설정 핸들러
  const handleLayoutChange = (layout: string) => {
    setDefaultLayout(layout);
    // 전역 상태 업데이트
    localStorage.setItem('defaultLayout', layout);
    
    toast({
      title: '레이아웃 설정 변경',
      description: `${layout === 'sidebar' ? '사이드바 레이아웃' : '상단 네비게이션'}으로 변경되었습니다.`,
    });
  };

  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
    localStorage.setItem('sidebarCollapsed', collapsed.toString());
    
    toast({
      title: '사이드바 설정 변경',
      description: `사이드바가 ${collapsed ? '축소' : '확장'}되었습니다.`,
    });
  };
  
  // 설정 저장 처리
  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // 실제 구현 시 API 호출로 대체
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: '설정 저장',
        description: '시스템 설정이 성공적으로 저장되었습니다.',
      });
    }, 1000);
  };
  
  // 서버 재시작
  const handleRestartServer = () => {
    setIsLoading(true);
    
    // 실제 구현 시 API 호출로 대체
    setTimeout(() => {
      setIsLoading(false);
      setShowRestartDialog(false);
      toast({
        title: '서버 재시작',
        description: '서버가 성공적으로 재시작되었습니다.',
      });
    }, 3000);
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">시스템 설정</h1>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setShowRestartDialog(true)} variant="outline" disabled={isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            서버 재시작
          </Button>
          <Button onClick={handleSaveSettings} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            설정 저장
            {isLoading && <RefreshCw className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        </div>
      </div>
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>주의</AlertTitle>
        <AlertDescription>
          일부 설정은 변경 후 서버 재시작이 필요합니다. 업무 시간 외에 변경하는 것을 권장합니다.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        <Card className="h-fit">
          <CardHeader className="py-4">
            <CardTitle className="text-lg">설정 메뉴</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            <div className="space-y-1">
              <Button 
                variant={activeTab === 'general' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('general')}
              >
                <Cog className="h-4 w-4 mr-2" />
                일반 설정
              </Button>
              <Button 
                variant={activeTab === 'security' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('security')}
              >
                <Shield className="h-4 w-4 mr-2" />
                보안 설정
              </Button>
              <Button 
                variant={activeTab === 'mail' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('mail')}
              >
                <Mail className="h-4 w-4 mr-2" />
                메일 설정
              </Button>
              <Button 
                variant={activeTab === 'notifications' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('notifications')}
              >
                <BellRing className="h-4 w-4 mr-2" />
                알림 설정
              </Button>
              <Button 
                variant={activeTab === 'appearance' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('appearance')}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                화면 및 로고 설정
              </Button>
              <Button 
                variant={activeTab === 'localization' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('localization')}
              >
                <Globe className="h-4 w-4 mr-2" />
                지역화 설정
              </Button>
              <Button 
                variant={activeTab === 'database' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('database')}
              >
                <Database className="h-4 w-4 mr-2" />
                데이터베이스 설정
              </Button>
              <Button 
                variant={activeTab === 'users' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('users')}
              >
                <Users className="h-4 w-4 mr-2" />
                사용자 설정
              </Button>
              <Button 
                variant={activeTab === 'contents' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('contents')}
              >
                <FileText className="h-4 w-4 mr-2" />
                콘텐츠 설정
              </Button>
              <Button 
                variant={activeTab === 'chat' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('chat')}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                채팅 설정
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === 'general' && '일반 설정'}
              {activeTab === 'security' && '보안 설정'}
              {activeTab === 'mail' && '메일 설정'}
              {activeTab === 'notifications' && '알림 설정'}
              {activeTab === 'appearance' && '화면 설정'}
              {activeTab === 'localization' && '지역화 설정'}
              {activeTab === 'database' && '데이터베이스 설정'}
              {activeTab === 'users' && '사용자 설정'}
              {activeTab === 'contents' && '콘텐츠 설정'}
              {activeTab === 'chat' && '채팅 설정'}
            </CardTitle>
            <CardDescription>
              {activeTab === 'general' && '시스템의 일반적인 설정을 관리합니다.'}
              {activeTab === 'security' && '시스템의 보안 관련 설정을 관리합니다.'}
              {activeTab === 'mail' && '이메일 발송과 관련된 설정을 관리합니다.'}
              {activeTab === 'notifications' && '사용자 알림과 관련된 설정을 관리합니다.'}
              {activeTab === 'appearance' && '사이트 화면과 관련된 설정을 관리합니다.'}
              {activeTab === 'localization' && '언어 및 지역화 관련 설정을 관리합니다.'}
              {activeTab === 'database' && '데이터베이스 관련 설정을 관리합니다.'}
              {activeTab === 'users' && '사용자 계정 관련 설정을 관리합니다.'}
              {activeTab === 'contents' && '콘텐츠 및 미디어 관련 설정을 관리합니다.'}
              {activeTab === 'chat' && '채팅 및 메시징 관련 설정을 관리합니다.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ScrollArea className="h-[500px] pr-4">
              {/* 일반 설정 */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">사이트 이름</Label>
                    <Input id="siteName" defaultValue="펫에듀 플랫폼" />
                    <p className="text-sm text-muted-foreground">
                      사이트의 공식 이름입니다. 브라우저 탭과 이메일에 표시됩니다.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">사이트 설명</Label>
                    <Textarea id="siteDescription" defaultValue="반려동물 훈련 및 교육을 위한 종합 플랫폼입니다." />
                    <p className="text-sm text-muted-foreground">
                      메타 태그에 사용되는 사이트 설명입니다.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">관리자 이메일</Label>
                    <Input id="adminEmail" type="email" defaultValue="admin@petedu.com" />
                    <p className="text-sm text-muted-foreground">
                      시스템 알림을 받는 주 관리자 이메일입니다.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">시스템 상태</h3>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="maintenanceMode" className="flex-1 cursor-pointer">
                        <div>유지보수 모드</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          활성화하면 일반 사용자는 사이트에 접근할 수 없게 됩니다.
                        </p>
                      </Label>
                      <Switch id="maintenanceMode" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maintenanceMessage">유지보수 메시지</Label>
                      <Textarea 
                        id="maintenanceMessage" 
                        defaultValue="현재 시스템 유지보수 중입니다. 빠른 시일 내에 서비스를 재개하겠습니다." 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="debugMode" className="flex-1 cursor-pointer">
                        <div>디버그 모드</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          상세한 오류 정보를 표시합니다. 프로덕션 환경에서는 비활성화하세요.
                        </p>
                      </Label>
                      <Switch id="debugMode" />
                    </div>
                  </div>
                </div>
              )}
              
              {/* 보안 설정 */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">인증 설정</h3>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="twoFactorAuth" className="flex-1 cursor-pointer">
                        <div>관리자 2단계 인증</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          관리자 계정에 2단계 인증을 필수로 적용합니다.
                        </p>
                      </Label>
                      <Switch id="twoFactorAuth" defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">세션 타임아웃 (분)</Label>
                      <Input id="sessionTimeout" type="number" defaultValue="30" />
                      <p className="text-sm text-muted-foreground">
                        사용자 비활성 후 세션이 만료되는 시간(분)입니다.
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="passwordPolicy" className="flex-1 cursor-pointer">
                        <div>강력한 비밀번호 정책 적용</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          최소 8자, 대소문자, 숫자, 특수문자를 포함해야 합니다.
                        </p>
                      </Label>
                      <Switch id="passwordPolicy" defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="passwordExpiration">비밀번호 만료 기간 (일)</Label>
                      <Input id="passwordExpiration" type="number" defaultValue="90" />
                      <p className="text-sm text-muted-foreground">
                        0으로 설정하면 만료되지 않습니다.
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">HTTPS 설정</h3>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="forceHTTPS" className="flex-1 cursor-pointer">
                        <div>HTTPS 강제 적용</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          모든 HTTP 요청을 HTTPS로 리다이렉트합니다.
                        </p>
                      </Label>
                      <Switch id="forceHTTPS" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="hsts" className="flex-1 cursor-pointer">
                        <div>HSTS 활성화</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          HTTP Strict Transport Security 활성화
                        </p>
                      </Label>
                      <Switch id="hsts" defaultChecked />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">접근 제어</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="allowedIPs">허용 IP 주소</Label>
                      <Textarea 
                        id="allowedIPs" 
                        placeholder="192.168.1.1, 10.0.0.1" 
                        defaultValue=""
                      />
                      <p className="text-sm text-muted-foreground">
                        관리자 페이지 접근을 특정 IP로 제한합니다. 비워두면 모든 IP 허용.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="loginAttempts">최대 로그인 시도 횟수</Label>
                      <Input id="loginAttempts" type="number" defaultValue="5" />
                      <p className="text-sm text-muted-foreground">
                        초과 시 계정이 일시적으로 잠깁니다.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lockoutDuration">계정 잠금 시간 (분)</Label>
                      <Input id="lockoutDuration" type="number" defaultValue="30" />
                    </div>
                  </div>
                </div>
              )}
              
              {/* 메일 설정 */}
              {activeTab === 'mail' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">SMTP 설정</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost">SMTP 서버</Label>
                      <Input id="smtpHost" defaultValue="smtp.example.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP 포트</Label>
                      <Input id="smtpPort" type="number" defaultValue="587" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtpUser">SMTP 사용자명</Label>
                      <Input id="smtpUser" defaultValue="noreply@petedu.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">SMTP 비밀번호</Label>
                      <Input id="smtpPassword" type="password" defaultValue="************" />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="smtpSsl" className="flex-1 cursor-pointer">
                        <div>SSL 사용</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          SMTP 연결에 SSL 사용
                        </p>
                      </Label>
                      <Switch id="smtpSsl" defaultChecked />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">발신자 정보</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="senderName">발신자 이름</Label>
                      <Input id="senderName" defaultValue="펫에듀 플랫폼" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="senderEmail">발신자 이메일</Label>
                      <Input id="senderEmail" type="email" defaultValue="noreply@petedu.com" />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">이메일 알림</h3>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="welcomeEmail" className="flex-1 cursor-pointer">
                        <div>가입 환영 이메일</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          새 사용자 가입 시 환영 이메일 발송
                        </p>
                      </Label>
                      <Switch id="welcomeEmail" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="passwordResetEmail" className="flex-1 cursor-pointer">
                        <div>비밀번호 재설정 이메일</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          비밀번호 재설정 요청 시 이메일 발송
                        </p>
                      </Label>
                      <Switch id="passwordResetEmail" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="courseNotifications" className="flex-1 cursor-pointer">
                        <div>강의 관련 알림</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          새 강의, 수료증 발급 등 강의 관련 알림
                        </p>
                      </Label>
                      <Switch id="courseNotifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="adminAlerts" className="flex-1 cursor-pointer">
                        <div>관리자 알림</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          새로운 신고, 시스템 경고 등 관리자 알림
                        </p>
                      </Label>
                      <Switch id="adminAlerts" defaultChecked />
                    </div>
                  </div>
                </div>
              )}
              
              {/* 알림 설정 */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">인앱 알림</h3>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="courseUpdates" className="flex-1 cursor-pointer">
                        <div>강의 업데이트</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          구독 중인 강의가 업데이트되면 알림
                        </p>
                      </Label>
                      <Switch id="courseUpdates" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="messageNotifications" className="flex-1 cursor-pointer">
                        <div>새 메시지</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          새 메시지 수신 시 알림
                        </p>
                      </Label>
                      <Switch id="messageNotifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="commentNotifications" className="flex-1 cursor-pointer">
                        <div>댓글 알림</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          내 글에 댓글이 달리면 알림
                        </p>
                      </Label>
                      <Switch id="commentNotifications" defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notificationRetention">알림 보관 기간 (일)</Label>
                      <Input id="notificationRetention" type="number" defaultValue="30" />
                      <p className="text-sm text-muted-foreground">
                        읽지 않은 알림이 자동으로 삭제되기 전 보관 기간
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">푸시 알림</h3>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="enablePush" className="flex-1 cursor-pointer">
                        <div>푸시 알림 활성화</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          웹 브라우저 푸시 알림 활성화
                        </p>
                      </Label>
                      <Switch id="enablePush" defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="vapidPublicKey">VAPID Public Key</Label>
                      <Input id="vapidPublicKey" defaultValue="BLVYfXwbMJ09NeN3z..." />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="vapidPrivateKey">VAPID Private Key</Label>
                      <Input id="vapidPrivateKey" type="password" defaultValue="********" />
                    </div>
                  </div>
                </div>
              )}
              
              {/* 화면 설정 */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">테마 설정</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="defaultTheme">기본 테마</Label>
                      <Select defaultValue="system">
                        <SelectTrigger id="defaultTheme">
                          <SelectValue placeholder="테마 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">라이트 모드</SelectItem>
                          <SelectItem value="dark">다크 모드</SelectItem>
                          <SelectItem value="system">시스템 설정 따름</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        사용자 설정이 없을 때 적용되는 기본 테마입니다.
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="userThemeToggle" className="flex-1 cursor-pointer">
                        <div>사용자 테마 선택 허용</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          사용자가 사이트 테마를 직접 변경할 수 있도록 합니다.
                        </p>
                      </Label>
                      <Switch id="userThemeToggle" defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">기본 색상</Label>
                      <div className="flex items-center space-x-2">
                        <Input id="primaryColor" type="color" defaultValue="#7C3AED" className="w-16 h-10" />
                        <Input defaultValue="#7C3AED" className="flex-1" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor">보조 색상</Label>
                      <div className="flex items-center space-x-2">
                        <Input id="secondaryColor" type="color" defaultValue="#10B981" className="w-16 h-10" />
                        <Input defaultValue="#10B981" className="flex-1" />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">로고 및 파비콘</h3>
                    
                    {/* 메인 로고 (라이트 모드) */}
                    <div className="space-y-2">
                      <Label>메인 로고 (라이트 모드)</Label>
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-32 bg-secondary rounded flex items-center justify-center border">
                          {currentLogos?.main ? (
                            <img 
                              src={currentLogos.main} 
                              alt="메인 로고" 
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="text-sm text-muted-foreground">미리보기</div>
                          )}
                        </div>
                        <div className="flex flex-col space-y-2">
                          <ImageUpload
                            onUpload={(file) => handleLogoUpload('main', file)}
                            accept="image/*"
                            className="w-auto"
                          >
                            <Button variant="outline" disabled={uploadingLogo === 'main'}>
                              {uploadingLogo === 'main' ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Upload className="h-4 w-4 mr-2" />
                              )}
                              메인 로고 업로드
                            </Button>
                          </ImageUpload>
                          {currentLogos?.main && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleLogoDelete('main')}
                              disabled={logoDeleteMutation.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              삭제
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 메인 로고 (다크 모드) */}
                    <div className="space-y-2">
                      <Label>메인 로고 (다크 모드)</Label>
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-32 bg-slate-800 rounded flex items-center justify-center border">
                          {currentLogos?.mainDark ? (
                            <img 
                              src={currentLogos.mainDark} 
                              alt="메인 로고 (다크)" 
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="text-sm text-white">미리보기</div>
                          )}
                        </div>
                        <div className="flex flex-col space-y-2">
                          <ImageUpload
                            onUpload={(file) => handleLogoUpload('mainDark', file)}
                            accept="image/*"
                            className="w-auto"
                          >
                            <Button variant="outline" disabled={uploadingLogo === 'mainDark'}>
                              {uploadingLogo === 'mainDark' ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Upload className="h-4 w-4 mr-2" />
                              )}
                              다크 로고 업로드
                            </Button>
                          </ImageUpload>
                          {currentLogos?.mainDark && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleLogoDelete('mainDark')}
                              disabled={logoDeleteMutation.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              삭제
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 컴팩트 로고 (라이트 모드) */}
                    <div className="space-y-2">
                      <Label>컴팩트 로고 (라이트 모드)</Label>
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-secondary rounded flex items-center justify-center border">
                          {currentLogos?.compact ? (
                            <img 
                              src={currentLogos.compact} 
                              alt="컴팩트 로고" 
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="text-xs text-muted-foreground">미리보기</div>
                          )}
                        </div>
                        <div className="flex flex-col space-y-2">
                          <ImageUpload
                            onUpload={(file) => handleLogoUpload('compact', file)}
                            accept="image/*"
                            className="w-auto"
                          >
                            <Button variant="outline" disabled={uploadingLogo === 'compact'}>
                              {uploadingLogo === 'compact' ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Upload className="h-4 w-4 mr-2" />
                              )}
                              컴팩트 로고 업로드
                            </Button>
                          </ImageUpload>
                          {currentLogos?.compact && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleLogoDelete('compact')}
                              disabled={logoDeleteMutation.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              삭제
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        사이드바 축소 시 표시되는 로고 (권장 크기: 40x40px)
                      </p>
                    </div>

                    {/* 컴팩트 로고 (다크 모드) */}
                    <div className="space-y-2">
                      <Label>컴팩트 로고 (다크 모드)</Label>
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-slate-800 rounded flex items-center justify-center border">
                          {currentLogos?.compactDark ? (
                            <img 
                              src={currentLogos.compactDark} 
                              alt="컴팩트 로고 (다크)" 
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="text-xs text-white">미리보기</div>
                          )}
                        </div>
                        <div className="flex flex-col space-y-2">
                          <ImageUpload
                            onUpload={(file) => handleLogoUpload('compactDark', file)}
                            accept="image/*"
                            className="w-auto"
                          >
                            <Button variant="outline" disabled={uploadingLogo === 'compactDark'}>
                              {uploadingLogo === 'compactDark' ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Upload className="h-4 w-4 mr-2" />
                              )}
                              컴팩트 다크 로고 업로드
                            </Button>
                          </ImageUpload>
                          {currentLogos?.compactDark && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleLogoDelete('compactDark')}
                              disabled={logoDeleteMutation.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              삭제
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* 파비콘 */}
                    <div className="space-y-2">
                      <Label>파비콘</Label>
                      <div className="flex items-center space-x-4">
                        <div className="h-8 w-8 bg-secondary rounded flex items-center justify-center border">
                          {currentLogos?.favicon ? (
                            <img 
                              src={currentLogos.favicon} 
                              alt="파비콘" 
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="text-xs text-muted-foreground">ICO</div>
                          )}
                        </div>
                        <div className="flex flex-col space-y-2">
                          <ImageUpload
                            onUpload={(file) => handleLogoUpload('favicon', file)}
                            accept="image/*"
                            className="w-auto"
                          >
                            <Button variant="outline" disabled={uploadingLogo === 'favicon'}>
                              {uploadingLogo === 'favicon' ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Upload className="h-4 w-4 mr-2" />
                              )}
                              파비콘 업로드
                            </Button>
                          </ImageUpload>
                          {currentLogos?.favicon && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleLogoDelete('favicon')}
                              disabled={logoDeleteMutation.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              삭제
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        32x32 크기의 파비콘 이미지를 업로드하세요.
                      </p>
                    </div>

                    {/* 로고 상태 표시 */}
                    {logosLoading && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>로고 설정을 불러오는 중...</span>
                      </div>
                    )}

                    {/* 적용 상태 알림 */}
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>로고 적용 안내</AlertTitle>
                      <AlertDescription>
                        로고를 업로드하면 즉시 사이드바에 적용됩니다. 
                        페이지를 새로고침하면 변경사항을 확인할 수 있습니다.
                      </AlertDescription>
                    </Alert>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">로고 설정</h3>
                    <p className="text-sm text-muted-foreground">
                      사이드바에 표시되는 로고를 설정합니다. 테마와 사이드바 상태에 따라 다른 로고가 표시됩니다.
                    </p>
                    
                    {/* 메인 로고 */}
                    <div className="space-y-2">
                      <Label>메인 로고</Label>
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-32 bg-secondary rounded flex items-center justify-center border">
                          {currentLogos?.main ? (
                            <img 
                              src={currentLogos.main} 
                              alt="메인 로고" 
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="text-sm text-muted-foreground">미리보기</div>
                          )}
                        </div>
                        <div className="flex flex-col space-y-2">
                          <ImageUpload
                            onUpload={(file) => handleLogoUpload('main', file)}
                            accept="image/*"
                            className="w-auto"
                          >
                            <Button variant="outline" disabled={uploadingLogo === 'main'}>
                              {uploadingLogo === 'main' ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Upload className="h-4 w-4 mr-2" />
                              )}
                              메인 로고 업로드
                            </Button>
                          </ImageUpload>
                          {currentLogos?.main && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleLogoDelete('main')}
                              disabled={logoDeleteMutation.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              삭제
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        사이드바 확장 시 표시되는 로고 (권장 크기: 180x60px)
                      </p>
                    </div>

                    {/* 컴팩트 로고 */}
                    <div className="space-y-2">
                      <Label>컴팩트 로고</Label>
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-secondary rounded flex items-center justify-center border">
                          {currentLogos?.compact ? (
                            <img 
                              src={currentLogos.compact} 
                              alt="컴팩트 로고" 
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="text-xs text-muted-foreground">미리보기</div>
                          )}
                        </div>
                        <div className="flex flex-col space-y-2">
                          <ImageUpload
                            onUpload={(file) => handleLogoUpload('compact', file)}
                            accept="image/*"
                            className="w-auto"
                          >
                            <Button variant="outline" disabled={uploadingLogo === 'compact'}>
                              {uploadingLogo === 'compact' ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Upload className="h-4 w-4 mr-2" />
                              )}
                              컴팩트 로고 업로드
                            </Button>
                          </ImageUpload>
                          {currentLogos?.compact && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleLogoDelete('compact')}
                              disabled={logoDeleteMutation.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              삭제
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        사이드바 축소 시 표시되는 로고 (권장 크기: 40x40px)
                      </p>
                    </div>
                    
                    {/* 파비콘 */}
                    <div className="space-y-2">
                      <Label>파비콘</Label>
                      <div className="flex items-center space-x-4">
                        <div className="h-8 w-8 bg-secondary rounded flex items-center justify-center border">
                          {currentLogos?.favicon ? (
                            <img 
                              src={currentLogos.favicon} 
                              alt="파비콘" 
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="text-xs text-muted-foreground">미리보기</div>
                          )}
                        </div>
                        <div className="flex flex-col space-y-2">
                          <ImageUpload
                            onUpload={(file) => handleLogoUpload('favicon', file)}
                            accept="image/*"
                            className="w-auto"
                          >
                            <Button variant="outline" disabled={uploadingLogo === 'favicon'}>
                              {uploadingLogo === 'favicon' ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Upload className="h-4 w-4 mr-2" />
                              )}
                              파비콘 업로드
                            </Button>
                          </ImageUpload>
                          {currentLogos?.favicon && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleLogoDelete('favicon')}
                              disabled={logoDeleteMutation.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              삭제
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        브라우저 탭에 표시되는 아이콘 (권장 크기: 32x32px)
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">레이아웃 설정</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="defaultLayout">기본 레이아웃</Label>
                      <Select 
                        value={defaultLayout} 
                        onValueChange={handleLayoutChange}
                      >
                        <SelectTrigger id="defaultLayout">
                          <SelectValue placeholder="레이아웃 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sidebar">사이드바 레이아웃</SelectItem>
                          <SelectItem value="topnav">상단 네비게이션</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        선택한 레이아웃이 기본 네비게이션 스타일로 적용됩니다.
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="sidebarCollapsed" className="flex-1 cursor-pointer">
                        <div>사이드바 기본 축소</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          사이드바를 기본적으로 축소된 상태로 표시합니다.
                        </p>
                      </Label>
                      <Switch 
                        id="sidebarCollapsed" 
                        checked={sidebarCollapsed}
                        onCheckedChange={handleSidebarToggle}
                      />
                    </div>
                    
                    <div className="rounded-lg bg-muted p-4">
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <LayoutDashboard className="h-4 w-4" />
                        <span className="font-medium">현재 레이아웃 설정</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">레이아웃:</span>
                          <span className="ml-2 font-medium">
                            {defaultLayout === 'sidebar' ? '사이드바' : '상단 네비게이션'}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">사이드바:</span>
                          <span className="ml-2 font-medium">
                            {sidebarCollapsed ? '축소' : '확장'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 지역화 설정 */}
              {activeTab === 'localization' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">언어 설정</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="defaultLanguage">기본 언어</Label>
                      <Select defaultValue="ko">
                        <SelectTrigger id="defaultLanguage">
                          <SelectValue placeholder="언어 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ko">한국어</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ja">日本語</SelectItem>
                          <SelectItem value="zh">中文</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        사용자 설정이 없을 때 적용되는 기본 언어입니다.
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="multiLanguage" className="flex-1 cursor-pointer">
                        <div>다국어 지원 활성화</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          사용자가 언어를 선택할 수 있게 합니다.
                        </p>
                      </Label>
                      <Switch id="multiLanguage" defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="availableLanguages">활성화된 언어</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="lang-ko" defaultChecked />
                          <Label htmlFor="lang-ko">한국어</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="lang-en" defaultChecked />
                          <Label htmlFor="lang-en">English</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="lang-ja" defaultChecked />
                          <Label htmlFor="lang-ja">日本語</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="lang-zh" defaultChecked />
                          <Label htmlFor="lang-zh">中文</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">날짜 및 시간 형식</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">날짜 형식</Label>
                      <Select defaultValue="yyyy-MM-dd">
                        <SelectTrigger id="dateFormat">
                          <SelectValue placeholder="날짜 형식 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                          <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="yyyy년 MM월 dd일">YYYY년 MM월 DD일</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timeFormat">시간 형식</Label>
                      <Select defaultValue="HH:mm">
                        <SelectTrigger id="timeFormat">
                          <SelectValue placeholder="시간 형식 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HH:mm">24시간 (HH:MM)</SelectItem>
                          <SelectItem value="hh:mm a">12시간 (HH:MM AM/PM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">기본 시간대</Label>
                      <Select defaultValue="Asia/Seoul">
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="시간대 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Seoul">서울 (GMT+9)</SelectItem>
                          <SelectItem value="America/New_York">뉴욕 (GMT-5/4)</SelectItem>
                          <SelectItem value="Europe/London">런던 (GMT+0/1)</SelectItem>
                          <SelectItem value="Europe/Paris">파리 (GMT+1/2)</SelectItem>
                          <SelectItem value="Asia/Tokyo">도쿄 (GMT+9)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 데이터베이스 설정 */}
              {activeTab === 'database' && (
                <div className="space-y-6">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>주의</AlertTitle>
                    <AlertDescription>
                      데이터베이스 설정을 변경하면 서버를 재시작해야 합니다. 데이터베이스 연결 정보를 변경하기 전에 백업을 확인하세요.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">데이터베이스 연결</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dbHost">데이터베이스 호스트</Label>
                      <Input id="dbHost" defaultValue="localhost" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dbPort">포트</Label>
                      <Input id="dbPort" type="number" defaultValue="5432" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dbName">데이터베이스명</Label>
                      <Input id="dbName" defaultValue="petedu" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dbUser">사용자명</Label>
                      <Input id="dbUser" defaultValue="petedu_user" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dbPassword">비밀번호</Label>
                      <Input id="dbPassword" type="password" defaultValue="********" />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">백업 설정</h3>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="autoBackup" className="flex-1 cursor-pointer">
                        <div>자동 백업 활성화</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          일정에 따라 데이터베이스를 자동 백업합니다.
                        </p>
                      </Label>
                      <Switch id="autoBackup" defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="backupSchedule">백업 주기</Label>
                      <Select defaultValue="daily">
                        <SelectTrigger id="backupSchedule">
                          <SelectValue placeholder="백업 주기 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">매시간</SelectItem>
                          <SelectItem value="daily">매일</SelectItem>
                          <SelectItem value="weekly">매주</SelectItem>
                          <SelectItem value="monthly">매월</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="backupRetention">백업 보관 기간 (일)</Label>
                      <Input id="backupRetention" type="number" defaultValue="30" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="backupLocation">백업 저장 경로</Label>
                      <Input id="backupLocation" defaultValue="/var/backups/petedu" />
                    </div>
                    
                    <Button variant="outline">
                      <Database className="h-4 w-4 mr-2" />
                      지금 백업 실행
                    </Button>
                  </div>
                </div>
              )}
              
              {/* 사용자 설정 */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">사용자 등록 설정</h3>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="allowRegistration" className="flex-1 cursor-pointer">
                        <div>새 사용자 등록 허용</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          비활성화하면 새 회원가입이 불가능합니다.
                        </p>
                      </Label>
                      <Switch id="allowRegistration" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="emailVerification" className="flex-1 cursor-pointer">
                        <div>이메일 인증 필수</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          가입 후 이메일 인증을 요구합니다.
                        </p>
                      </Label>
                      <Switch id="emailVerification" defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="defaultUserRole">기본 사용자 역할</Label>
                      <Select defaultValue="user">
                        <SelectTrigger id="defaultUserRole">
                          <SelectValue placeholder="역할 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pet-owner">반려동물 주인</SelectItem>
                          <SelectItem value="user">일반 사용자</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">소셜 로그인</h3>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="googleLogin" className="flex-1 cursor-pointer">
                        <div>Google 로그인</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          Google 계정으로 로그인 허용
                        </p>
                      </Label>
                      <Switch id="googleLogin" defaultChecked />
                    </div>
                    
                    <div className="space-y-2 ml-6">
                      <Label htmlFor="googleClientId">Google 클라이언트 ID</Label>
                      <Input id="googleClientId" defaultValue="123456789-abcdefg.apps.googleusercontent.com" />
                    </div>
                    
                    <div className="space-y-2 ml-6">
                      <Label htmlFor="googleClientSecret">Google 클라이언트 시크릿</Label>
                      <Input id="googleClientSecret" type="password" defaultValue="********" />
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="kakaoLogin" className="flex-1 cursor-pointer">
                        <div>카카오 로그인</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          카카오 계정으로 로그인 허용
                        </p>
                      </Label>
                      <Switch id="kakaoLogin" defaultChecked />
                    </div>
                    
                    <div className="space-y-2 ml-6">
                      <Label htmlFor="kakaoClientId">카카오 앱 키</Label>
                      <Input id="kakaoClientId" defaultValue="abcdef1234567890" />
                    </div>
                    
                    <div className="space-y-2 ml-6">
                      <Label htmlFor="kakaoClientSecret">카카오 시크릿 키</Label>
                      <Input id="kakaoClientSecret" type="password" defaultValue="********" />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">프로필 설정</h3>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="allowProfileCustomization" className="flex-1 cursor-pointer">
                        <div>프로필 커스터마이징 허용</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          사용자가 프로필 정보를 변경할 수 있도록 허용
                        </p>
                      </Label>
                      <Switch id="allowProfileCustomization" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="allowAvatarUpload" className="flex-1 cursor-pointer">
                        <div>프로필 이미지 업로드 허용</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          사용자가 프로필 이미지를 업로드할 수 있도록 허용
                        </p>
                      </Label>
                      <Switch id="allowAvatarUpload" defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maxAvatarSize">최대 이미지 크기 (KB)</Label>
                      <Input id="maxAvatarSize" type="number" defaultValue="1024" />
                    </div>
                  </div>
                </div>
              )}
              
              {/* 콘텐츠 설정 */}
              {activeTab === 'contents' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">업로드 설정</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maxUploadSize">최대 파일 크기 (MB)</Label>
                      <Input id="maxUploadSize" type="number" defaultValue="50" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="allowedFileTypes">허용된 파일 형식</Label>
                      <Input 
                        id="allowedFileTypes" 
                        defaultValue="jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx,mp4,mov,avi"
                      />
                      <p className="text-sm text-muted-foreground">
                        콤마로 구분된 파일 확장자
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="uploadPath">업로드 경로</Label>
                      <Input 
                        id="uploadPath" 
                        defaultValue="/var/www/uploads"
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">비디오 설정</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="videoProvider">기본 비디오 호스팅</Label>
                      <Select defaultValue="self">
                        <SelectTrigger id="videoProvider">
                          <SelectValue placeholder="비디오 호스팅 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="self">자체 호스팅</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="vimeo">Vimeo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="hlsStreaming" className="flex-1 cursor-pointer">
                        <div>HLS 스트리밍 사용</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          HTTP Live Streaming 활성화
                        </p>
                      </Label>
                      <Switch id="hlsStreaming" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="autoTranscode" className="flex-1 cursor-pointer">
                        <div>자동 트랜스코딩</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          업로드된 비디오를 다양한 해상도로 자동 변환
                        </p>
                      </Label>
                      <Switch id="autoTranscode" defaultChecked />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">이미지 처리</h3>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="imageOptimization" className="flex-1 cursor-pointer">
                        <div>이미지 자동 최적화</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          업로드된 이미지를 자동으로 최적화
                        </p>
                      </Label>
                      <Switch id="imageOptimization" defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maxImageWidth">최대 이미지 너비 (픽셀)</Label>
                      <Input id="maxImageWidth" type="number" defaultValue="1920" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="thumbnailSizes">썸네일 크기</Label>
                      <Input 
                        id="thumbnailSizes" 
                        defaultValue="150x150,300x200,600x400"
                      />
                      <p className="text-sm text-muted-foreground">
                        쉼표로 구분된 너비x높이 형식
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 채팅 설정 */}
              {activeTab === 'chat' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">채팅 기능</h3>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="enableChat" className="flex-1 cursor-pointer">
                        <div>채팅 기능 활성화</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          사용자 간 실시간 채팅 활성화
                        </p>
                      </Label>
                      <Switch id="enableChat" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="groupChats" className="flex-1 cursor-pointer">
                        <div>그룹 채팅 허용</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          3명 이상의 사용자가 참여하는 그룹 채팅 허용
                        </p>
                      </Label>
                      <Switch id="groupChats" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="fileSharing" className="flex-1 cursor-pointer">
                        <div>파일 공유 허용</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          채팅에서 파일 공유 허용
                        </p>
                      </Label>
                      <Switch id="fileSharing" defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maxAttachmentSize">최대 첨부 파일 크기 (MB)</Label>
                      <Input id="maxAttachmentSize" type="number" defaultValue="10" />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">메시지 관리</h3>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="messageModeration" className="flex-1 cursor-pointer">
                        <div>메시지 중재</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          부적절한 메시지 필터링 활성화
                        </p>
                      </Label>
                      <Switch id="messageModeration" defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bannedWords">금지어 목록</Label>
                      <Textarea 
                        id="bannedWords" 
                        placeholder="쉼표로 구분된 금지어"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="messageHistory">메시지 보관 기간 (일)</Label>
                      <Input id="messageHistory" type="number" defaultValue="90" />
                      <p className="text-sm text-muted-foreground">
                        0으로 설정하면 영구 보관
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">화상 채팅</h3>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="videoChat" className="flex-1 cursor-pointer">
                        <div>화상 채팅 활성화</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          훈련사-견주 간 화상 채팅 허용
                        </p>
                      </Label>
                      <Switch id="videoChat" defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="videoChatProvider">화상 채팅 제공자</Label>
                      <Select defaultValue="zoom">
                        <SelectTrigger id="videoChatProvider">
                          <SelectValue placeholder="제공자 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="zoom">Zoom</SelectItem>
                          <SelectItem value="webrtc">WebRTC (자체 호스팅)</SelectItem>
                          <SelectItem value="googlemeet">Google Meet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="zoomApiKey">Zoom API 키</Label>
                      <Input id="zoomApiKey" defaultValue="abc123def456ghi" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="zoomApiSecret">Zoom API 시크릿</Label>
                      <Input id="zoomApiSecret" type="password" defaultValue="********" />
                    </div>
                  </div>
                </div>
              )}
              
              {/* 로고 설정 제거됨 - appearance 탭으로 통합 */}
              {activeTab === 'logo-removed' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">사이드바 로고 설정</h3>
                    <p className="text-sm text-muted-foreground">
                      사이드바에 표시되는 로고를 설정합니다. 확장 상태와 축소 상태에 따라 다른 로고가 표시됩니다.
                    </p>
                    
                    {/* 확장 로고 */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">확장 로고 (사이드바 펼쳐졌을 때)</Label>
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-48 bg-secondary rounded-lg flex items-center justify-center border">
                          {currentLogos?.expandedLogo ? (
                            <img 
                              src={currentLogos.expandedLogo} 
                              alt="확장 로고" 
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="text-sm text-muted-foreground">확장 로고 미리보기</div>
                          )}
                        </div>
                        <div className="flex flex-col space-y-2">
                          <ImageUpload
                            value={currentLogos?.expandedLogo}
                            onChange={(url) => {
                              if (url) {
                                handleLogoUpload('expanded', url);
                              }
                            }}
                            maxSize={5}
                            label="확장 로고 업로드"
                            className="w-auto"
                          />
                          {currentLogos?.expandedLogo && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleLogoDelete('expanded')}
                              disabled={logoDeleteMutation.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              삭제
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 축소 로고 */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">축소 로고 (사이드바 축소됐을 때)</Label>
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-secondary rounded-lg flex items-center justify-center border">
                          {currentLogos?.compactLogo ? (
                            <img 
                              src={currentLogos.compactLogo} 
                              alt="축소 로고" 
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="text-xs text-muted-foreground text-center">축소 로고</div>
                          )}
                        </div>
                        <div className="flex flex-col space-y-2">
                          <ImageUpload
                            value={currentLogos?.compactLogo}
                            onChange={(url) => {
                              if (url) {
                                handleLogoUpload('compact', url);
                              }
                            }}
                            maxSize={5}
                            label="축소 로고 업로드"
                            className="w-auto"
                          />
                          {currentLogos?.compactLogo && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleLogoDelete('compact')}
                              disabled={logoDeleteMutation.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              삭제
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">로고 설정 안내</h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        <div>
                          <span className="font-medium">확장 로고:</span> 사이드바가 펼쳐져 있을 때 표시되는 로고입니다. 권장 크기는 180x60px입니다.
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        <div>
                          <span className="font-medium">축소 로고:</span> 사이드바가 축소됐을 때 표시되는 로고입니다. 권장 크기는 40x40px입니다.
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        <div>
                          <span className="font-medium">파일 형식:</span> PNG, JPG, SVG 형식을 지원합니다. SVG 형식을 권장합니다.
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        <div>
                          <span className="font-medium">투명 배경:</span> 로고는 투명한 배경을 가진 파일을 권장합니다.
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">빠른 작업</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // 로고 초기화 기능
                          if (confirm('모든 로고를 초기화하시겠습니까?')) {
                            // 로고 초기화 로직
                          }
                        }}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        기본 로고로 복원
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // 로고 정보 새로고침
                          window.location.reload();
                        }}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        새로고침
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab('general')}>
              기본 설정으로 돌아가기
            </Button>
            <Button onClick={handleSaveSettings} disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              설정 저장
              {isLoading && <RefreshCw className="ml-2 h-4 w-4 animate-spin" />}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* 서버 재시작 확인 대화상자 */}
      <Dialog open={showRestartDialog} onOpenChange={setShowRestartDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>서버 재시작 확인</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>서버를 재시작하면 현재 진행 중인 모든 활동이 일시적으로 중단됩니다.</p>
            <p className="mt-2 text-muted-foreground">
              이 작업은 약 30초 정도 소요됩니다. 계속하시겠습니까?
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRestartDialog(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleRestartServer} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  재시작 중...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  재시작
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}