import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Settings,
  Save,
  RefreshCw,
  Globe,
  Bell,
  Shield,
  Lock,
  Server,
  Database,
  FileText,
  Upload,
  Download,
  Mail,
  Trash2,
  AlertTriangle,
  Info,
  ListChecks,
  DollarSign,
  Percent,
  Users,
  UserCog,
  Clock,
  Activity,
  Binary
} from 'lucide-react';

// 시스템 설정 타입
interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    supportPhone: string;
    maintenanceMode: boolean;
    registrationOpen: boolean;
    defaultLanguage: string;
    timezone: string;
  };
  security: {
    passwordMinLength: number;
    passwordRequireSpecialChar: boolean;
    passwordRequireNumber: boolean;
    passwordRequireUppercase: boolean;
    loginAttempts: number;
    lockoutDuration: number;
    twoFactorAuthForced: boolean;
    sessionTimeout: number;
  };
  email: {
    smtpServer: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    emailFromAddress: string;
    emailFromName: string;
    sendWelcomeEmail: boolean;
    sendPasswordResetNotification: boolean;
  };
  payment: {
    basicPlanPrice: number;
    premiumPlanPrice: number;
    trialDays: number;
    platformFee: number;
    automaticRenewal: boolean;
    allowCancellation: boolean;
    gracePeriod: number;
  };
  backups: {
    backupFrequency: string;
    backupRetention: number;
    lastBackupDate: string;
    backupLocation: string;
    autoBackup: boolean;
  };
  api: {
    rateLimit: number;
    rateLimitWindow: number;
    logApiCalls: boolean;
    apiTimeout: number;
  };
}

export default function AdminSettings() {
  const { userName } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // 설정 로드
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        // 실제 구현 시 API 호출로 대체
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 임시 설정 데이터
        const mockSettings: SystemSettings = {
          general: {
            siteName: 'PetEdu Platform',
            siteDescription: '반려견 교육 전문 플랫폼',
            contactEmail: 'contact@petedu.com',
            supportPhone: '02-1234-5678',
            maintenanceMode: false,
            registrationOpen: true,
            defaultLanguage: 'ko',
            timezone: 'Asia/Seoul',
          },
          security: {
            passwordMinLength: 8,
            passwordRequireSpecialChar: true,
            passwordRequireNumber: true,
            passwordRequireUppercase: true,
            loginAttempts: 5,
            lockoutDuration: 15,
            twoFactorAuthForced: false,
            sessionTimeout: 60,
          },
          email: {
            smtpServer: 'smtp.example.com',
            smtpPort: 587,
            smtpUsername: 'noreply@petedu.com',
            smtpPassword: '********',
            emailFromAddress: 'noreply@petedu.com',
            emailFromName: 'PetEdu Platform',
            sendWelcomeEmail: true,
            sendPasswordResetNotification: true,
          },
          payment: {
            basicPlanPrice: 29900,
            premiumPlanPrice: 59900,
            trialDays: 14,
            platformFee: 10,
            automaticRenewal: true,
            allowCancellation: true,
            gracePeriod: 3,
          },
          backups: {
            backupFrequency: 'daily',
            backupRetention: 30,
            lastBackupDate: '2024-05-10 03:00:00',
            backupLocation: 'AWS S3',
            autoBackup: true,
          },
          api: {
            rateLimit: 100,
            rateLimitWindow: 60,
            logApiCalls: true,
            apiTimeout: 30,
          },
        };
        
        setSettings(mockSettings);
      } catch (error) {
        console.error('설정 데이터 로딩 오류:', error);
        toast({
          title: '데이터 로딩 오류',
          description: '시스템 설정을 불러오는 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, [toast]);
  
  // 설정 저장 처리
  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      // 실제 구현 시 API 호출로 대체
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: '설정 저장',
        description: '시스템 설정이 성공적으로 저장되었습니다.',
      });
    } catch (error) {
      console.error('설정 저장 오류:', error);
      toast({
        title: '설정 저장 오류',
        description: '시스템 설정을 저장하는 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // 설정 초기화 처리
  const handleResetSettings = async () => {
    setIsLoading(true);
    
    try {
      // 실제 구현 시 API 호출로 대체
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // ... 기본 설정으로 초기화 코드 ...
      
      toast({
        title: '설정 초기화',
        description: '시스템 설정이 기본값으로 초기화되었습니다.',
      });
    } catch (error) {
      console.error('설정 초기화 오류:', error);
      toast({
        title: '설정 초기화 오류',
        description: '시스템 설정을 초기화하는 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsResetConfirmOpen(false);
      setIsLoading(false);
    }
  };
  
  // 일반 설정 값 변경 처리
  const handleGeneralChange = (key: string, value: any) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      general: {
        ...settings.general,
        [key]: value
      }
    });
  };
  
  // 보안 설정 값 변경 처리
  const handleSecurityChange = (key: string, value: any) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      security: {
        ...settings.security,
        [key]: value
      }
    });
  };
  
  // 이메일 설정 값 변경 처리
  const handleEmailChange = (key: string, value: any) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      email: {
        ...settings.email,
        [key]: value
      }
    });
  };
  
  // 결제 설정 값 변경 처리
  const handlePaymentChange = (key: string, value: any) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      payment: {
        ...settings.payment,
        [key]: value
      }
    });
  };
  
  // 백업 설정 값 변경 처리
  const handleBackupChange = (key: string, value: any) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      backups: {
        ...settings.backups,
        [key]: value
      }
    });
  };
  
  // API 설정 값 변경 처리
  const handleApiChange = (key: string, value: any) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      api: {
        ...settings.api,
        [key]: value
      }
    });
  };
  
  // 설정 데이터 다운로드
  const handleDownloadSettings = () => {
    if (!settings) return;
    
    const settingsJson = JSON.stringify(settings, null, 2);
    const blob = new Blob([settingsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'petedu-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: '설정 다운로드',
      description: '시스템 설정이 JSON 파일로 다운로드되었습니다.',
    });
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">시스템 설정</h1>
        <div className="flex items-center space-x-2">
          <AlertDialog open={isResetConfirmOpen} onOpenChange={setIsResetConfirmOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                기본값으로 초기화
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>정말로 초기화하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  이 작업은 모든 시스템 설정을 기본값으로 되돌립니다. 이 작업은 되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetSettings} className="bg-destructive text-destructive-foreground">
                  초기화
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button onClick={handleSaveSettings} disabled={isLoading || isSaving}>
            {isSaving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                설정 저장
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              <div className="mt-4 text-sm text-muted-foreground">설정을 불러오고 있습니다...</div>
            </div>
          ) : settings ? (
            <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <div className="flex justify-between items-center">
                <TabsList className="grid grid-cols-6 w-auto">
                  <TabsTrigger value="general" className="flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    <span className="hidden md:inline">일반</span>
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    <span className="hidden md:inline">보안</span>
                  </TabsTrigger>
                  <TabsTrigger value="email" className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="hidden md:inline">이메일</span>
                  </TabsTrigger>
                  <TabsTrigger value="payment" className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span className="hidden md:inline">결제</span>
                  </TabsTrigger>
                  <TabsTrigger value="backups" className="flex items-center">
                    <Database className="w-4 h-4 mr-2" />
                    <span className="hidden md:inline">백업</span>
                  </TabsTrigger>
                  <TabsTrigger value="api" className="flex items-center">
                    <Binary className="w-4 h-4 mr-2" />
                    <span className="hidden md:inline">API</span>
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleDownloadSettings}>
                    <Download className="h-4 w-4 mr-2" />
                    설정 내보내기
                  </Button>
                </div>
              </div>
              
              {/* 일반 설정 탭 */}
              <TabsContent value="general" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">기본 정보</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">사이트 이름</Label>
                      <Input
                        id="siteName"
                        value={settings.general.siteName}
                        onChange={(e) => handleGeneralChange('siteName', e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">사이트 타이틀과 브랜딩에 사용됩니다.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="siteDescription">사이트 설명</Label>
                      <Input
                        id="siteDescription"
                        value={settings.general.siteDescription}
                        onChange={(e) => handleGeneralChange('siteDescription', e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">메타 태그 및 SEO에 사용됩니다.</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">연락처 정보</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">연락 이메일</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={settings.general.contactEmail}
                        onChange={(e) => handleGeneralChange('contactEmail', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supportPhone">고객 지원 전화번호</Label>
                      <Input
                        id="supportPhone"
                        value={settings.general.supportPhone}
                        onChange={(e) => handleGeneralChange('supportPhone', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">시스템 설정</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="maintenanceMode" className="cursor-pointer">
                          유지보수 모드
                        </Label>
                        <Switch
                          id="maintenanceMode"
                          checked={settings.general.maintenanceMode}
                          onCheckedChange={(checked) => handleGeneralChange('maintenanceMode', checked)}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        활성화하면 관리자 외 모든 사용자가 유지보수 페이지로 리다이렉트됩니다.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="registrationOpen" className="cursor-pointer">
                          회원가입 허용
                        </Label>
                        <Switch
                          id="registrationOpen"
                          checked={settings.general.registrationOpen}
                          onCheckedChange={(checked) => handleGeneralChange('registrationOpen', checked)}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        비활성화하면 새로운 사용자 등록이 차단됩니다.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">지역화</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="defaultLanguage">기본 언어</Label>
                      <Select
                        value={settings.general.defaultLanguage}
                        onValueChange={(value) => handleGeneralChange('defaultLanguage', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="언어 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ko">한국어</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ja">日本語</SelectItem>
                          <SelectItem value="zh">中文</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">시간대</Label>
                      <Select
                        value={settings.general.timezone}
                        onValueChange={(value) => handleGeneralChange('timezone', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="시간대 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Seoul">Seoul (GMT+9)</SelectItem>
                          <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                          <SelectItem value="America/Los_Angeles">Los Angeles (GMT-7)</SelectItem>
                          <SelectItem value="America/New_York">New York (GMT-4)</SelectItem>
                          <SelectItem value="Europe/London">London (GMT+1)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* 보안 설정 탭 */}
              <TabsContent value="security" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">비밀번호 정책</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="passwordMinLength">최소 길이</Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          id="passwordMinLength"
                          min={6}
                          max={16}
                          step={1}
                          value={[settings.security.passwordMinLength]}
                          onValueChange={(value) => handleSecurityChange('passwordMinLength', value[0])}
                          className="flex-grow"
                        />
                        <span className="w-12 text-center">{settings.security.passwordMinLength}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="passwordRequireSpecialChar" className="cursor-pointer">
                          특수문자 필수
                        </Label>
                        <Switch
                          id="passwordRequireSpecialChar"
                          checked={settings.security.passwordRequireSpecialChar}
                          onCheckedChange={(checked) => handleSecurityChange('passwordRequireSpecialChar', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="passwordRequireNumber" className="cursor-pointer">
                          숫자 필수
                        </Label>
                        <Switch
                          id="passwordRequireNumber"
                          checked={settings.security.passwordRequireNumber}
                          onCheckedChange={(checked) => handleSecurityChange('passwordRequireNumber', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="passwordRequireUppercase" className="cursor-pointer">
                          대문자 필수
                        </Label>
                        <Switch
                          id="passwordRequireUppercase"
                          checked={settings.security.passwordRequireUppercase}
                          onCheckedChange={(checked) => handleSecurityChange('passwordRequireUppercase', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">로그인 보안</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="loginAttempts">최대 로그인 시도 횟수</Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          id="loginAttempts"
                          min={1}
                          max={10}
                          step={1}
                          value={[settings.security.loginAttempts]}
                          onValueChange={(value) => handleSecurityChange('loginAttempts', value[0])}
                          className="flex-grow"
                        />
                        <span className="w-12 text-center">{settings.security.loginAttempts}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        이 횟수를 초과하면 계정이 일시적으로 잠깁니다.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lockoutDuration">계정 잠금 시간 (분)</Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          id="lockoutDuration"
                          min={5}
                          max={60}
                          step={5}
                          value={[settings.security.lockoutDuration]}
                          onValueChange={(value) => handleSecurityChange('lockoutDuration', value[0])}
                          className="flex-grow"
                        />
                        <span className="w-12 text-center">{settings.security.lockoutDuration}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">추가 보안 조치</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="twoFactorAuthForced" className="cursor-pointer">
                          2단계 인증 강제
                        </Label>
                        <Switch
                          id="twoFactorAuthForced"
                          checked={settings.security.twoFactorAuthForced}
                          onCheckedChange={(checked) => handleSecurityChange('twoFactorAuthForced', checked)}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        모든 사용자에게 2단계 인증을 요구합니다.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">세션 타임아웃 (분)</Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          id="sessionTimeout"
                          min={15}
                          max={240}
                          step={15}
                          value={[settings.security.sessionTimeout]}
                          onValueChange={(value) => handleSecurityChange('sessionTimeout', value[0])}
                          className="flex-grow"
                        />
                        <span className="w-12 text-center">{settings.security.sessionTimeout}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        비활성 상태 후 사용자가 재로그인해야 하는 시간
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* 이메일 설정 탭 */}
              <TabsContent value="email" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">SMTP 설정</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="smtpServer">SMTP 서버</Label>
                      <Input
                        id="smtpServer"
                        value={settings.email.smtpServer}
                        onChange={(e) => handleEmailChange('smtpServer', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP 포트</Label>
                      <Input
                        id="smtpPort"
                        type="number"
                        value={settings.email.smtpPort}
                        onChange={(e) => handleEmailChange('smtpPort', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpUsername">SMTP 사용자명</Label>
                      <Input
                        id="smtpUsername"
                        value={settings.email.smtpUsername}
                        onChange={(e) => handleEmailChange('smtpUsername', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">SMTP 비밀번호</Label>
                      <Input
                        id="smtpPassword"
                        type="password"
                        value={settings.email.smtpPassword}
                        onChange={(e) => handleEmailChange('smtpPassword', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">이메일 발신 설정</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="emailFromAddress">발신 이메일 주소</Label>
                      <Input
                        id="emailFromAddress"
                        type="email"
                        value={settings.email.emailFromAddress}
                        onChange={(e) => handleEmailChange('emailFromAddress', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailFromName">발신자 이름</Label>
                      <Input
                        id="emailFromName"
                        value={settings.email.emailFromName}
                        onChange={(e) => handleEmailChange('emailFromName', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">알림 설정</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="sendWelcomeEmail" className="cursor-pointer">
                          회원가입 환영 이메일 발송
                        </Label>
                        <Switch
                          id="sendWelcomeEmail"
                          checked={settings.email.sendWelcomeEmail}
                          onCheckedChange={(checked) => handleEmailChange('sendWelcomeEmail', checked)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="sendPasswordResetNotification" className="cursor-pointer">
                          비밀번호 재설정 알림 발송
                        </Label>
                        <Switch
                          id="sendPasswordResetNotification"
                          checked={settings.email.sendPasswordResetNotification}
                          onCheckedChange={(checked) => handleEmailChange('sendPasswordResetNotification', checked)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      테스트 이메일 발송
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* 결제 설정 탭 */}
              <TabsContent value="payment" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">요금제 설정</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="basicPlanPrice">베이직 플랜 가격 (원)</Label>
                      <Input
                        id="basicPlanPrice"
                        type="number"
                        value={settings.payment.basicPlanPrice}
                        onChange={(e) => handlePaymentChange('basicPlanPrice', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="premiumPlanPrice">프리미엄 플랜 가격 (원)</Label>
                      <Input
                        id="premiumPlanPrice"
                        type="number"
                        value={settings.payment.premiumPlanPrice}
                        onChange={(e) => handlePaymentChange('premiumPlanPrice', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="trialDays">무료 체험 기간 (일)</Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          id="trialDays"
                          min={0}
                          max={30}
                          step={1}
                          value={[settings.payment.trialDays]}
                          onValueChange={(value) => handlePaymentChange('trialDays', value[0])}
                          className="flex-grow"
                        />
                        <span className="w-12 text-center">{settings.payment.trialDays}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="platformFee">플랫폼 수수료 (%)</Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          id="platformFee"
                          min={0}
                          max={30}
                          step={1}
                          value={[settings.payment.platformFee]}
                          onValueChange={(value) => handlePaymentChange('platformFee', value[0])}
                          className="flex-grow"
                        />
                        <span className="w-12 text-center">{settings.payment.platformFee}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">구독 관리</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="automaticRenewal" className="cursor-pointer">
                          자동 갱신 허용
                        </Label>
                        <Switch
                          id="automaticRenewal"
                          checked={settings.payment.automaticRenewal}
                          onCheckedChange={(checked) => handlePaymentChange('automaticRenewal', checked)}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        구독이 만료되면 자동으로 갱신합니다.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="allowCancellation" className="cursor-pointer">
                          사용자 직접 구독 취소 허용
                        </Label>
                        <Switch
                          id="allowCancellation"
                          checked={settings.payment.allowCancellation}
                          onCheckedChange={(checked) => handlePaymentChange('allowCancellation', checked)}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        사용자가 직접 구독을 취소할 수 있습니다.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gracePeriod">결제 유예 기간 (일)</Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          id="gracePeriod"
                          min={0}
                          max={14}
                          step={1}
                          value={[settings.payment.gracePeriod]}
                          onValueChange={(value) => handlePaymentChange('gracePeriod', value[0])}
                          className="flex-grow"
                        />
                        <span className="w-12 text-center">{settings.payment.gracePeriod}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        결제 실패 후 서비스를 유지하는 기간
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* 백업 설정 탭 */}
              <TabsContent value="backups" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">백업 설정</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="backupFrequency">백업 주기</Label>
                      <Select
                        value={settings.backups.backupFrequency}
                        onValueChange={(value) => handleBackupChange('backupFrequency', value)}
                      >
                        <SelectTrigger>
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
                      <Label htmlFor="backupRetention">백업 보존 기간 (일)</Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          id="backupRetention"
                          min={1}
                          max={90}
                          step={1}
                          value={[settings.backups.backupRetention]}
                          onValueChange={(value) => handleBackupChange('backupRetention', value[0])}
                          className="flex-grow"
                        />
                        <span className="w-12 text-center">{settings.backups.backupRetention}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backupLocation">백업 위치</Label>
                      <Select
                        value={settings.backups.backupLocation}
                        onValueChange={(value) => handleBackupChange('backupLocation', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="백업 위치 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="local">로컬 서버</SelectItem>
                          <SelectItem value="AWS S3">AWS S3</SelectItem>
                          <SelectItem value="Google Cloud">Google Cloud</SelectItem>
                          <SelectItem value="Azure Blob">Azure Blob</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="autoBackup" className="cursor-pointer">
                          자동 백업
                        </Label>
                        <Switch
                          id="autoBackup"
                          checked={settings.backups.autoBackup}
                          onCheckedChange={(checked) => handleBackupChange('autoBackup', checked)}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        지정된 일정에 따라 자동으로 백업을 수행합니다.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">백업 관리</h3>
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">최근 백업 날짜</p>
                        <p className="text-sm text-muted-foreground">{settings.backups.lastBackupDate}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          백업 다운로드
                        </Button>
                        <Button size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          지금 백업
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* API 설정 탭 */}
              <TabsContent value="api" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">API 설정</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="rateLimit">요청 제한 (분당)</Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          id="rateLimit"
                          min={10}
                          max={500}
                          step={10}
                          value={[settings.api.rateLimit]}
                          onValueChange={(value) => handleApiChange('rateLimit', value[0])}
                          className="flex-grow"
                        />
                        <span className="w-12 text-center">{settings.api.rateLimit}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        API 사용자당 분당 최대 요청 수
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rateLimitWindow">제한 기간 (초)</Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          id="rateLimitWindow"
                          min={10}
                          max={300}
                          step={10}
                          value={[settings.api.rateLimitWindow]}
                          onValueChange={(value) => handleApiChange('rateLimitWindow', value[0])}
                          className="flex-grow"
                        />
                        <span className="w-12 text-center">{settings.api.rateLimitWindow}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="logApiCalls" className="cursor-pointer">
                          API 요청 로깅
                        </Label>
                        <Switch
                          id="logApiCalls"
                          checked={settings.api.logApiCalls}
                          onCheckedChange={(checked) => handleApiChange('logApiCalls', checked)}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        모든 API 요청을 로그에 기록합니다.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apiTimeout">타임아웃 (초)</Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          id="apiTimeout"
                          min={5}
                          max={120}
                          step={5}
                          value={[settings.api.apiTimeout]}
                          onValueChange={(value) => handleApiChange('apiTimeout', value[0])}
                          className="flex-grow"
                        />
                        <span className="w-12 text-center">{settings.api.apiTimeout}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        API 요청 타임아웃 시간
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">API 키 관리</h3>
                  <Button variant="outline">
                    <ListChecks className="h-4 w-4 mr-2" />
                    API 키 관리 페이지로 이동
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <AlertTriangle className="w-12 h-12 text-amber-500" />
              <h3 className="mt-4 text-lg font-semibold">설정을 불러올 수 없습니다</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                서버에 연결할 수 없거나 설정 데이터가 손상되었습니다.
              </p>
              <Button className="mt-4" onClick={() => window.location.reload()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                새로고침
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}