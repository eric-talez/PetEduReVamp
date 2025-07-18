import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Settings,
  Bell,
  Shield,
  CreditCard,
  Star,
  Eye,
  EyeOff,
  Camera,
  Globe,
  MessageSquare,
  Smartphone,
  Lock,
  Save,
  Upload,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TrainerSettings() {
  const { toast } = useToast();
  
  // 프로필 정보 상태
  const [profile, setProfile] = useState({
    name: '훈련사',
    email: 'trainer@example.com',
    phone: '010-1234-5678',
    address: '서울특별시 강남구',
    bio: '10년 경력의 전문 반려동물 훈련사입니다.',
    specialties: ['기초 훈련', '문제 행동 교정', '사회화 훈련'],
    experience: '10년',
    certification: 'TALEZ 인증 전문 훈련사',
    profileImage: null as File | null
  });

  // 알림 설정 상태
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    marketing: false,
    newStudent: true,
    paymentAlert: true,
    systemUpdate: true
  });

  // 보안 설정 상태
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: '30'
  });

  // 결제 설정 상태
  const [payment, setPayment] = useState({
    bankName: '국민은행',
    accountNumber: '123-456-789012',
    accountHolder: '훈련사',
    taxId: '123-45-67890'
  });

  // 개인정보 설정 상태
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    contactVisibility: 'students',
    showOnlineStatus: true,
    allowMessages: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleProfileUpdate = async () => {
    try {
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "프로필 업데이트 완료",
        description: "프로필 정보가 성공적으로 업데이트되었습니다.",
      });
    } catch (error) {
      toast({
        title: "업데이트 실패",
        description: "프로필 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleNotificationUpdate = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "알림 설정 변경됨",
        description: "알림 설정이 성공적으로 변경되었습니다.",
      });
    } catch (error) {
      toast({
        title: "설정 변경 실패",
        description: "알림 설정 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "비밀번호 불일치",
        description: "새 비밀번호와 비밀번호 확인이 일치하지 않습니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "비밀번호 변경 완료",
        description: "비밀번호가 성공적으로 변경되었습니다.",
      });
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({
        title: "비밀번호 변경 실패",
        description: "비밀번호 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfile(prev => ({ ...prev, profileImage: file }));
      toast({
        title: "이미지 업로드됨",
        description: "프로필 이미지가 업로드되었습니다. 저장 버튼을 눌러 적용하세요.",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">설정</h1>
          <p className="text-gray-600 dark:text-gray-400">계정 정보 및 환경 설정을 관리하세요</p>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">프로필</TabsTrigger>
          <TabsTrigger value="notifications">알림</TabsTrigger>
          <TabsTrigger value="security">보안</TabsTrigger>
          <TabsTrigger value="payment">결제</TabsTrigger>
          <TabsTrigger value="privacy">개인정보</TabsTrigger>
        </TabsList>

        {/* 프로필 설정 */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                프로필 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 프로필 이미지 */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    {profile.profileImage ? (
                      <img 
                        src={URL.createObjectURL(profile.profileImage)} 
                        alt="프로필" 
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 cursor-pointer hover:bg-blue-600">
                    <Camera className="w-4 h-4" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <h3 className="font-medium">프로필 사진</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    JPG, PNG 형식의 이미지 파일을 업로드하세요
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">연락처</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="experience">경력</Label>
                  <Input
                    id="experience"
                    value={profile.experience}
                    onChange={(e) => setProfile(prev => ({ ...prev, experience: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">주소</Label>
                <Input
                  id="address"
                  value={profile.address}
                  onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="bio">자기소개</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="certification">인증</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="certification"
                    value={profile.certification}
                    onChange={(e) => setProfile(prev => ({ ...prev, certification: e.target.value }))}
                  />
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    인증됨
                  </Badge>
                </div>
              </div>

              <div>
                <Label>전문 분야</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button onClick={handleProfileUpdate} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                프로필 저장
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 알림 설정 */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                알림 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">이메일 알림</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      중요한 알림을 이메일로 받습니다
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, email: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">SMS 알림</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      긴급 알림을 문자로 받습니다
                    </p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, sms: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">푸시 알림</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      브라우저 푸시 알림을 받습니다
                    </p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, push: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">새 수강생 알림</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      새로운 수강생 등록 시 알림
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newStudent}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, newStudent: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">결제 알림</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      결제 및 정산 관련 알림
                    </p>
                  </div>
                  <Switch
                    checked={notifications.paymentAlert}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, paymentAlert: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">마케팅 알림</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      프로모션 및 마케팅 정보
                    </p>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, marketing: checked }))
                    }
                  />
                </div>
              </div>

              <Button onClick={handleNotificationUpdate} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                알림 설정 저장
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 보안 설정 */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                보안 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 비밀번호 변경 */}
              <div className="space-y-4">
                <h3 className="font-medium">비밀번호 변경</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="currentPassword">현재 비밀번호</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="newPassword">새 비밀번호</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={handlePasswordChange} className="w-full">
                  <Lock className="w-4 h-4 mr-2" />
                  비밀번호 변경
                </Button>
              </div>

              <Separator />

              {/* 2단계 인증 */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">2단계 인증</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    계정 보안을 위한 2단계 인증을 설정합니다
                  </p>
                </div>
                <Switch
                  checked={security.twoFactorAuth}
                  onCheckedChange={(checked) => 
                    setSecurity(prev => ({ ...prev, twoFactorAuth: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">로그인 알림</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    새로운 기기에서 로그인 시 알림
                  </p>
                </div>
                <Switch
                  checked={security.loginAlerts}
                  onCheckedChange={(checked) => 
                    setSecurity(prev => ({ ...prev, loginAlerts: checked }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="sessionTimeout">세션 만료 시간 (분)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={security.sessionTimeout}
                  onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 결제 설정 */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                결제 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankName">은행명</Label>
                  <Input
                    id="bankName"
                    value={payment.bankName}
                    onChange={(e) => setPayment(prev => ({ ...prev, bankName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber">계좌번호</Label>
                  <Input
                    id="accountNumber"
                    value={payment.accountNumber}
                    onChange={(e) => setPayment(prev => ({ ...prev, accountNumber: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="accountHolder">예금주</Label>
                  <Input
                    id="accountHolder"
                    value={payment.accountHolder}
                    onChange={(e) => setPayment(prev => ({ ...prev, accountHolder: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="taxId">사업자등록번호</Label>
                  <Input
                    id="taxId"
                    value={payment.taxId}
                    onChange={(e) => setPayment(prev => ({ ...prev, taxId: e.target.value }))}
                  />
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">
                      결제 정보 안내
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-200">
                      수익 정산을 위한 계좌 정보입니다. 정확한 정보를 입력해주세요.
                    </p>
                  </div>
                </div>
              </div>

              <Button className="w-full">
                <Save className="w-4 h-4 mr-2" />
                결제 정보 저장
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 개인정보 설정 */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                개인정보 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="profileVisibility">프로필 공개 설정</Label>
                  <select
                    id="profileVisibility"
                    value={privacy.profileVisibility}
                    onChange={(e) => setPrivacy(prev => ({ ...prev, profileVisibility: e.target.value }))}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  >
                    <option value="public">전체 공개</option>
                    <option value="registered">회원만 공개</option>
                    <option value="students">수강생만 공개</option>
                    <option value="private">비공개</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="contactVisibility">연락처 공개 설정</Label>
                  <select
                    id="contactVisibility"
                    value={privacy.contactVisibility}
                    onChange={(e) => setPrivacy(prev => ({ ...prev, contactVisibility: e.target.value }))}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  >
                    <option value="public">전체 공개</option>
                    <option value="registered">회원만 공개</option>
                    <option value="students">수강생만 공개</option>
                    <option value="private">비공개</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">온라인 상태 표시</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      다른 사용자에게 온라인 상태를 보여줍니다
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showOnlineStatus}
                    onCheckedChange={(checked) => 
                      setPrivacy(prev => ({ ...prev, showOnlineStatus: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">메시지 수신 허용</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      다른 사용자로부터 메시지를 받을 수 있습니다
                    </p>
                  </div>
                  <Switch
                    checked={privacy.allowMessages}
                    onCheckedChange={(checked) => 
                      setPrivacy(prev => ({ ...prev, allowMessages: checked }))
                    }
                  />
                </div>
              </div>

              <Button className="w-full">
                <Save className="w-4 h-4 mr-2" />
                개인정보 설정 저장
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}