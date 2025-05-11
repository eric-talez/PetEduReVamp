import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Save, 
  RefreshCw,
  Loader2,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Copy,
  Image,
  Shield,
  Lock,
  Key,
  User,
  UserPlus,
  Settings,
  Info,
  HelpCircle,
  BellRing,
  Eye,
  Calendar,
  CreditCard,
  Percent
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// 기관 정보 인터페이스
interface Institute {
  id: number;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  description: string;
  establishedYear: number;
  businessLicense: string;
  operatingHours: string;
  facilities: string[];
  admins: {
    id: number;
    name: string;
    email: string;
    role: string;
    image?: string;
  }[];
}

export default function InstituteSettings() {
  const { userName } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // 기관 정보 상태
  const [institute, setInstitute] = useState<Institute | null>(null);
  const [showRegenerateCodeDialog, setShowRegenerateCodeDialog] = useState(false);
  const [showAddAdminDialog, setShowAddAdminDialog] = useState(false);
  
  // 알림 설정 상태
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    appNotifications: true,
    marketingEmails: false,
    courseUpdates: true,
    paymentAlerts: true,
    adminNotifications: true
  });
  
  // 수수료 설정 상태
  const [commissionSettings, setCommissionSettings] = useState({
    trainerCommissionRate: 70, // 트레이너가 받는 비율
    instituteCommissionRate: 20, // 기관이 받는 비율
    platformCommissionRate: 10, // 플랫폼이 받는 비율
    productReferralRate: 5 // 상품 추천 수수료 비율
  });
  
  // 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // 실제 API 구현 시 이 부분을 API 호출로 대체
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 임시 기관 데이터
        const mockInstitute: Institute = {
          id: 1,
          name: '펫하이 트레이닝 센터',
          code: 'PTR2023',
          address: '서울특별시 강남구 테헤란로 123',
          phone: '02-1234-5678',
          email: 'info@pethigh.com',
          website: 'https://www.pethigh.com',
          description: '펫하이 트레이닝 센터는 반려견과 반려인의 행복한 동행을 위한 전문 훈련 센터입니다. 다양한 훈련 프로그램과 전문 트레이너를 통해 맞춤형 교육을 제공합니다.',
          establishedYear: 2015,
          businessLicense: '123-45-67890',
          operatingHours: '평일 09:00-18:00, 주말 10:00-17:00',
          facilities: ['실내 훈련장', '야외 활동 공간', '미용실', '카페', '반려용품 샵'],
          admins: [
            {
              id: 101,
              name: '김경영',
              email: 'ceo@pethigh.com',
              role: '대표',
              image: ''
            },
            {
              id: 102,
              name: '이관리',
              email: 'manager@pethigh.com',
              role: '운영 관리자',
              image: ''
            }
          ]
        };
        
        setInstitute(mockInstitute);
      } catch (error) {
        toast({
          title: "데이터 로딩 오류",
          description: "기관 정보를 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);
  
  // 코드 재생성 처리
  const regenerateInstituteCode = () => {
    setIsSaving(true);
    
    // 실제 API 구현 시 이 부분을 API 호출로 대체
    setTimeout(() => {
      if (institute) {
        // 임의의 새 코드 생성 (실제로는 서버에서 생성해야 함)
        const newCode = `PTR${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
        
        setInstitute({
          ...institute,
          code: newCode
        });
        
        toast({
          title: "코드 재생성 완료",
          description: `새로운 기관 코드가 생성되었습니다: ${newCode}`,
        });
      }
      
      setIsSaving(false);
      setShowRegenerateCodeDialog(false);
    }, 1500);
  };
  
  // 기관 정보 업데이트 처리
  const handleInstituteUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSaving(true);
    
    // 실제 API 구현 시 이 부분을 API 호출로 대체
    setTimeout(() => {
      toast({
        title: "정보 업데이트 완료",
        description: "기관 정보가 성공적으로 업데이트되었습니다.",
      });
      
      setIsSaving(false);
    }, 1500);
  };
  
  // 알림 설정 업데이트
  const handleNotificationSettingsUpdate = () => {
    setIsSaving(true);
    
    // 실제 API 구현 시 이 부분을 API 호출로 대체
    setTimeout(() => {
      toast({
        title: "알림 설정 업데이트",
        description: "알림 설정이 성공적으로 업데이트되었습니다.",
      });
      
      setIsSaving(false);
    }, 1000);
  };
  
  // 수수료 설정 업데이트
  const handleCommissionSettingsUpdate = () => {
    setIsSaving(true);
    
    // 실제 API 구현 시 이 부분을 API 호출로 대체
    setTimeout(() => {
      toast({
        title: "수수료 설정 업데이트",
        description: "수수료 비율 설정이 성공적으로 업데이트되었습니다.",
      });
      
      setIsSaving(false);
    }, 1000);
  };
  
  // 관리자 추가 처리
  const handleAddAdmin = () => {
    setIsSaving(true);
    
    // 실제 API 구현 시 이 부분을 API 호출로 대체
    setTimeout(() => {
      toast({
        title: "관리자 추가",
        description: "새로운 관리자가 추가되었습니다.",
      });
      
      setIsSaving(false);
      setShowAddAdminDialog(false);
    }, 1000);
  };
  
  // 코드 복사 핸들러
  const handleCopyCode = () => {
    if (institute) {
      navigator.clipboard.writeText(institute.code);
      toast({
        title: "코드 복사됨",
        description: "기관 코드가 클립보드에 복사되었습니다.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">기관 설정 정보 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">기관 설정</h1>
          <p className="text-muted-foreground mt-1">기관 정보 및 설정을 관리합니다.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            새로고침
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="general" className="mb-6">
        <TabsList>
          <TabsTrigger value="general">기본 정보</TabsTrigger>
          <TabsTrigger value="admins">관리자 설정</TabsTrigger>
          <TabsTrigger value="notifications">알림 설정</TabsTrigger>
          <TabsTrigger value="commissions">수수료 설정</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6 space-y-6">
          {institute && (
            <Card>
              <CardHeader>
                <CardTitle>기관 기본 정보</CardTitle>
                <CardDescription>
                  기관의 기본 정보를 관리합니다. 이 정보는 수강생과 훈련사에게 표시됩니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInstituteUpdate}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">기관명</Label>
                        <Input
                          id="name"
                          value={institute.name}
                          onChange={(e) => setInstitute({ ...institute, name: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="code">기관 코드</Label>
                        <div className="flex gap-2">
                          <Input
                            id="code"
                            value={institute.code}
                            readOnly
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon"
                            onClick={handleCopyCode}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setShowRegenerateCodeDialog(true)}
                          >
                            재생성
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          기관 코드는 훈련사와 수강생이 가입 시 사용하는 고유 코드입니다.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">주소</Label>
                        <Input
                          id="address"
                          value={institute.address}
                          onChange={(e) => setInstitute({ ...institute, address: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">전화번호</Label>
                        <Input
                          id="phone"
                          value={institute.phone}
                          onChange={(e) => setInstitute({ ...institute, phone: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">이메일</Label>
                        <Input
                          id="email"
                          type="email"
                          value={institute.email}
                          onChange={(e) => setInstitute({ ...institute, email: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="website">웹사이트</Label>
                        <Input
                          id="website"
                          value={institute.website || ''}
                          onChange={(e) => setInstitute({ ...institute, website: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="description">기관 소개</Label>
                        <Textarea
                          id="description"
                          value={institute.description}
                          onChange={(e) => setInstitute({ ...institute, description: e.target.value })}
                          rows={4}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="establishedYear">설립연도</Label>
                        <Input
                          id="establishedYear"
                          type="number"
                          value={institute.establishedYear}
                          onChange={(e) => setInstitute({ ...institute, establishedYear: parseInt(e.target.value) })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="businessLicense">사업자등록번호</Label>
                        <Input
                          id="businessLicense"
                          value={institute.businessLicense}
                          onChange={(e) => setInstitute({ ...institute, businessLicense: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="operatingHours">운영 시간</Label>
                        <Input
                          id="operatingHours"
                          value={institute.operatingHours}
                          onChange={(e) => setInstitute({ ...institute, operatingHours: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>시설 정보</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {['실내 훈련장', '야외 활동 공간', '미용실', '카페', '반려용품 샵', '호텔링', '데이케어'].map((facility) => (
                            <div key={facility} className="flex items-center space-x-2">
                              <Checkbox
                                id={`facility-${facility}`}
                                checked={institute.facilities.includes(facility)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setInstitute({
                                      ...institute,
                                      facilities: [...institute.facilities, facility]
                                    });
                                  } else {
                                    setInstitute({
                                      ...institute,
                                      facilities: institute.facilities.filter(f => f !== facility)
                                    });
                                  }
                                }}
                              />
                              <label
                                htmlFor={`facility-${facility}`}
                                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {facility}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="logo">로고 이미지</Label>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={institute.logo} alt={institute.name} />
                            <AvatarFallback>
                              <Building className="h-8 w-8" />
                            </AvatarFallback>
                          </Avatar>
                          <Button type="button" variant="outline">
                            <Image className="h-4 w-4 mr-2" />
                            이미지 업로드
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          저장 중...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          변경사항 저장
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="admins" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>기관 관리자</CardTitle>
                  <CardDescription>
                    기관의 관리자 계정을 관리합니다. 관리자는 기관의 설정을 변경할 수 있습니다.
                  </CardDescription>
                </div>
                <Button onClick={() => setShowAddAdminDialog(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  관리자 추가
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {institute && (
                <div className="space-y-4">
                  {institute.admins.map((admin) => (
                    <Card key={admin.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-12 w-12 mr-4">
                              <AvatarImage src={admin.image} alt={admin.name} />
                              <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{admin.name}</div>
                              <div className="text-sm text-muted-foreground">{admin.email}</div>
                              <Badge variant="outline" className="mt-1">{admin.role}</Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4 mr-2" />
                              권한 설정
                            </Button>
                            <Button variant="outline" size="sm">
                              <Mail className="h-4 w-4 mr-2" />
                              메일 발송
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>로그인 보안</CardTitle>
              <CardDescription>관리자 계정 보안 설정을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">2단계 인증</div>
                    <div className="text-sm text-muted-foreground">로그인 시 추가 인증 단계를 요구합니다.</div>
                  </div>
                  <Switch checked={true} />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">로그인 알림</div>
                    <div className="text-sm text-muted-foreground">새로운 기기에서 로그인 시 이메일 알림을 받습니다.</div>
                  </div>
                  <Switch checked={true} />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">비밀번호 정책</div>
                    <div className="text-sm text-muted-foreground">관리자는 90일마다 비밀번호를 변경해야 합니다.</div>
                  </div>
                  <Switch checked={false} />
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button>
                    <Shield className="h-4 w-4 mr-2" />
                    보안 설정 저장
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>알림 설정</CardTitle>
              <CardDescription>알림 수신 설정을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">이메일 알림</div>
                    <div className="text-sm text-muted-foreground">중요 알림을 이메일로 받습니다.</div>
                  </div>
                  <Switch 
                    checked={notificationSettings.emailNotifications} 
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, emailNotifications: checked})
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">앱 알림</div>
                    <div className="text-sm text-muted-foreground">앱에서 알림을 받습니다.</div>
                  </div>
                  <Switch 
                    checked={notificationSettings.appNotifications} 
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, appNotifications: checked})
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">마케팅 이메일</div>
                    <div className="text-sm text-muted-foreground">프로모션 및 마케팅 정보를 이메일로 받습니다.</div>
                  </div>
                  <Switch 
                    checked={notificationSettings.marketingEmails} 
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, marketingEmails: checked})
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">코스 업데이트</div>
                    <div className="text-sm text-muted-foreground">코스 변경 사항에 대한 알림을 받습니다.</div>
                  </div>
                  <Switch 
                    checked={notificationSettings.courseUpdates} 
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, courseUpdates: checked})
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">결제 알림</div>
                    <div className="text-sm text-muted-foreground">결제 및 재정 관련 알림을 받습니다.</div>
                  </div>
                  <Switch 
                    checked={notificationSettings.paymentAlerts} 
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, paymentAlerts: checked})
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">관리자 알림</div>
                    <div className="text-sm text-muted-foreground">다른 관리자의 작업에 대한 알림을 받습니다.</div>
                  </div>
                  <Switch 
                    checked={notificationSettings.adminNotifications} 
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, adminNotifications: checked})
                    }
                  />
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button onClick={handleNotificationSettingsUpdate} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        저장 중...
                      </>
                    ) : (
                      <>
                        <BellRing className="h-4 w-4 mr-2" />
                        알림 설정 저장
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="commissions" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>수수료 설정</CardTitle>
              <CardDescription>훈련사 수수료 및 수익 분배 비율을 설정합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">교육 수익 분배</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    교육 수수료에 대한 훈련사, 기관, 플랫폼 간의 분배 비율을 설정합니다.
                    총합은 100%가 되어야 합니다.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <h4 className="font-medium mb-2">훈련사 비율</h4>
                          <div className="text-3xl font-bold text-primary mb-1">
                            {commissionSettings.trainerCommissionRate}%
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="90"
                            value={commissionSettings.trainerCommissionRate}
                            onChange={(e) => {
                              const newRate = parseInt(e.target.value);
                              // 플랫폼 비율은 고정, 기관 비율은 조정
                              setCommissionSettings({
                                ...commissionSettings,
                                trainerCommissionRate: newRate,
                                instituteCommissionRate: 100 - newRate - commissionSettings.platformCommissionRate
                              });
                            }}
                            className="w-full"
                          />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <h4 className="font-medium mb-2">기관 비율</h4>
                          <div className="text-3xl font-bold text-blue-600 dark:text-blue-500 mb-1">
                            {commissionSettings.instituteCommissionRate}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            (훈련사 비율에 따라 자동 조정)
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <h4 className="font-medium mb-2">플랫폼 비율</h4>
                          <div className="text-3xl font-bold text-gray-500 mb-1">
                            {commissionSettings.platformCommissionRate}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            (고정 비율)
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">상품 추천 수수료</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    훈련사가 쇼핑몰 상품을 추천하여 발생하는 매출에 대한 수수료 비율을 설정합니다.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <Label>추천 수수료 비율</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          max="20"
                          value={commissionSettings.productReferralRate}
                          onChange={(e) => setCommissionSettings({
                            ...commissionSettings,
                            productReferralRate: parseInt(e.target.value)
                          })}
                          className="w-20"
                        />
                        <span>%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        훈련사가 추천한 상품이 판매될 때 받게 되는 수수료 비율입니다.
                      </p>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="font-medium mb-2">예시 계산</h4>
                      <div className="text-sm space-y-1">
                        <p>- 10만원 상품 추천 및 판매 시</p>
                        <p>- 훈련사 수수료: {commissionSettings.productReferralRate}% = {(100000 * commissionSettings.productReferralRate / 100).toLocaleString()}원</p>
                        <p>- 기관 수수료: 2% = {(100000 * 2 / 100).toLocaleString()}원</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button onClick={handleCommissionSettingsUpdate} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        저장 중...
                      </>
                    ) : (
                      <>
                        <Percent className="h-4 w-4 mr-2" />
                        수수료 설정 저장
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* 기관 코드 재생성 다이얼로그 */}
      <Dialog open={showRegenerateCodeDialog} onOpenChange={setShowRegenerateCodeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>기관 코드 재생성</DialogTitle>
            <DialogDescription>
              새로운 기관 코드를 생성하시겠습니까? 기존 코드는 더 이상 사용할 수 없게 됩니다.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 p-4 rounded-md flex items-start">
              <Info className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium">주의: 코드 변경 시 영향</p>
                <p className="mt-1">
                  기관 코드를 변경하면 아직 가입하지 않은 훈련사와 수강생은 새 코드를 사용해야 합니다.
                  이미 가입된 사용자에게는 영향이 없습니다.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="destructive" 
              onClick={regenerateInstituteCode}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  처리 중...
                </>
              ) : (
                "코드 재생성"
              )}
            </Button>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 관리자 추가 다이얼로그 */}
      <Dialog open={showAddAdminDialog} onOpenChange={setShowAddAdminDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 관리자 추가</DialogTitle>
            <DialogDescription>
              새로운 기관 관리자 계정을 추가합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminName">이름</Label>
              <Input id="adminName" placeholder="관리자 이름" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail">이메일</Label>
              <Input id="adminEmail" type="email" placeholder="관리자 이메일" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminRole">역할</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="역할 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">일반 관리자</SelectItem>
                  <SelectItem value="finance">재정 관리자</SelectItem>
                  <SelectItem value="trainer">훈련사 관리자</SelectItem>
                  <SelectItem value="content">콘텐츠 관리자</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>권한</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="perm-trainers" />
                  <label htmlFor="perm-trainers">훈련사 관리</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="perm-students" />
                  <label htmlFor="perm-students">학생 관리</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="perm-courses" />
                  <label htmlFor="perm-courses">과정 관리</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="perm-financial" />
                  <label htmlFor="perm-financial">재정 관리</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="perm-settings" />
                  <label htmlFor="perm-settings">설정 관리</label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleAddAdmin}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  처리 중...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  관리자 추가
                </>
              )}
            </Button>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}