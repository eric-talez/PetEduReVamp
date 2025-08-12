import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Settings, Mail, MessageSquare, Shield, Database, TestTube, Save } from 'lucide-react';
import { useGlobalAuth } from '@/hooks/useGlobalAuth';

type MessagingSettings = {
  region: string;
  accessKey: string;
  secretKey: string;
  sesFromEmail: string;
  sesConfigurationSet: string;
  snsDefaultSmsType: string;
  snsSenderId: string;
  pinpointAppId: string;
  chimeAppInstanceArn: string;
};

const initialSettings: MessagingSettings = {
  region: 'ap-northeast-2',
  accessKey: '',
  secretKey: '',
  sesFromEmail: '',
  sesConfigurationSet: '',
  snsDefaultSmsType: 'Transactional',
  snsSenderId: '',
  pinpointAppId: '',
  chimeAppInstanceArn: ''
};

export default function MessagingSettingsPage() {
  console.log("[DEBUG] MessagingSettingsPage component loaded!");
  const { userName } = useGlobalAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<MessagingSettings>(initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [smsTo, setSmsTo] = useState('');
  const [testingEmail, setTestingEmail] = useState(false);
  const [testingSms, setTestingSms] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/messaging/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        throw new Error('설정을 불러오는데 실패했습니다');
      }
    } catch (error) {
      toast({
        title: "설정 로딩 실패",
        description: "메시징 설정을 불러오는데 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/messaging/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Id': userName || 'admin'
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast({
          title: "저장 성공",
          description: "설정이 저장되어 즉시 반영되었습니다.",
          variant: "default"
        });
      } else {
        throw new Error('저장 실패');
      }
    } catch (error) {
      toast({
        title: "저장 실패",
        description: "설정을 저장하는데 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const testEmail = async () => {
    if (!emailTo) {
      toast({
        title: "이메일 필수",
        description: "테스트할 이메일 주소를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setTestingEmail(true);
    try {
      const params = new URLSearchParams({ to: emailTo });
      const response = await fetch(`/api/admin/messaging/test/email?${params}`, {
        method: 'POST'
      });

      if (response.ok) {
        toast({
          title: "이메일 발송 완료",
          description: `${emailTo}로 테스트 이메일을 발송했습니다.`,
          variant: "default"
        });
      } else {
        throw new Error('이메일 발송 실패');
      }
    } catch (error) {
      toast({
        title: "이메일 발송 실패",
        description: "테스트 이메일 발송에 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setTestingEmail(false);
    }
  };

  const testSms = async () => {
    if (!smsTo) {
      toast({
        title: "전화번호 필수",
        description: "테스트할 전화번호를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setTestingSms(true);
    try {
      const params = new URLSearchParams({ phone: smsTo });
      const response = await fetch(`/api/admin/messaging/test/sms?${params}`, {
        method: 'POST'
      });

      if (response.ok) {
        toast({
          title: "SMS 발송 완료",
          description: `${smsTo}로 테스트 SMS를 발송했습니다.`,
          variant: "default"
        });
      } else {
        throw new Error('SMS 발송 실패');
      }
    } catch (error) {
      toast({
        title: "SMS 발송 실패",
        description: "테스트 SMS 발송에 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setTestingSms(false);
    }
  };

  const handleInputChange = (field: keyof MessagingSettings) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSettings(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSelectChange = (field: keyof MessagingSettings) => (value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Settings className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">설정을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AWS 메시징 설정</h1>
          <p className="text-muted-foreground mt-2">
            Replit Secrets의 기본값을 사용하며, 여기서 저장하면 DB에 암호화되어 저장되고 즉시 적용됩니다.
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          암호화 저장
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* AWS 기본 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              AWS 기본 설정
            </CardTitle>
            <CardDescription>
              AWS 서비스 연결을 위한 기본 인증 정보
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="region">AWS 리전</Label>
              <Input
                id="region"
                value={settings.region}
                onChange={handleInputChange('region')}
                placeholder="ap-northeast-2"
              />
            </div>
            
            <div>
              <Label htmlFor="accessKey">Access Key (마스킹됨)</Label>
              <Input
                id="accessKey"
                type="password"
                value={settings.accessKey}
                onChange={handleInputChange('accessKey')}
                placeholder="AKIA..."
              />
            </div>
            
            <div>
              <Label htmlFor="secretKey">Secret Key (마스킹됨)</Label>
              <Input
                id="secretKey"
                type="password"
                value={settings.secretKey}
                onChange={handleInputChange('secretKey')}
                placeholder="****************"
              />
            </div>
          </CardContent>
        </Card>

        {/* SES 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Amazon SES 설정
            </CardTitle>
            <CardDescription>
              이메일 발송을 위한 SES 구성
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="sesFromEmail">발신 이메일 주소</Label>
              <Input
                id="sesFromEmail"
                type="email"
                value={settings.sesFromEmail}
                onChange={handleInputChange('sesFromEmail')}
                placeholder="noreply@domain.com"
              />
            </div>
            
            <div>
              <Label htmlFor="sesConfigurationSet">Configuration Set (선택)</Label>
              <Input
                id="sesConfigurationSet"
                value={settings.sesConfigurationSet}
                onChange={handleInputChange('sesConfigurationSet')}
                placeholder="기본 설정 사용"
              />
            </div>
          </CardContent>
        </Card>

        {/* SNS 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Amazon SNS 설정
            </CardTitle>
            <CardDescription>
              SMS 발송을 위한 SNS 구성
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="snsDefaultSmsType">SMS 타입</Label>
              <Select
                value={settings.snsDefaultSmsType}
                onValueChange={handleSelectChange('snsDefaultSmsType')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Transactional">Transactional</SelectItem>
                  <SelectItem value="Promotional">Promotional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="snsSenderId">Sender ID (선택)</Label>
              <Input
                id="snsSenderId"
                value={settings.snsSenderId}
                onChange={handleInputChange('snsSenderId')}
                placeholder="발신자 ID"
              />
            </div>

            <div>
              <Label htmlFor="pinpointAppId">Pinpoint App ID (선택)</Label>
              <Input
                id="pinpointAppId"
                value={settings.pinpointAppId}
                onChange={handleInputChange('pinpointAppId')}
                placeholder="Pinpoint 애플리케이션 ID"
              />
            </div>
          </CardContent>
        </Card>

        {/* Chime 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Amazon Chime 설정
            </CardTitle>
            <CardDescription>
              실시간 채팅을 위한 Chime 구성
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="chimeAppInstanceArn">App Instance ARN (선택)</Label>
              <Input
                id="chimeAppInstanceArn"
                value={settings.chimeAppInstanceArn}
                onChange={handleInputChange('chimeAppInstanceArn')}
                placeholder="arn:aws:chime:region:account-id:app-instance/instance-id"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 저장 버튼 */}
      <div className="flex justify-end">
        <Button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? '저장 중...' : '설정 저장'}
        </Button>
      </div>

      <Separator />

      {/* 테스트 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            서비스 테스트
          </CardTitle>
          <CardDescription>
            저장된 설정으로 실제 메시징 서비스를 테스트해보세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 이메일 테스트 */}
          <div>
            <Label htmlFor="emailTest">이메일 테스트</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="emailTest"
                type="email"
                placeholder="test@example.com"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={testEmail}
                disabled={testingEmail || !emailTo}
                variant="outline"
              >
                {testingEmail ? '발송 중...' : '이메일 테스트'}
              </Button>
            </div>
          </div>

          {/* SMS 테스트 */}
          <div>
            <Label htmlFor="smsTest">SMS 테스트</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="smsTest"
                type="tel"
                placeholder="+821012345678"
                value={smsTo}
                onChange={(e) => setSmsTo(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={testSms}
                disabled={testingSms || !smsTo}
                variant="outline"
              >
                {testingSms ? '발송 중...' : 'SMS 테스트'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}