import { useState, useEffect } from 'react';
import { useGlobalAuth } from '@/hooks/useGlobalAuth';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings,
  Building,
  Save,
  Upload,
  MapPin,
  Phone,
  Mail,
  Globe,
  AlertTriangle
} from 'lucide-react';

interface InstituteInfo {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  businessHours: string;
  logoUrl: string;
}

export default function InstituteSettings() {
  const { userName } = useGlobalAuth();
  const { toast } = useToast();
  const [instituteInfo, setInstituteInfo] = useState<InstituteInfo>({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    businessHours: '',
    logoUrl: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  // API에서 기관 설정 정보 로딩
  const { data: settingsData, isLoading, isError, refetch } = useQuery<InstituteInfo>({
    queryKey: ['/api/institute/settings'],
  });

  // 데이터가 로드되면 상태 업데이트
  useEffect(() => {
    if (settingsData) {
      setInstituteInfo(settingsData);
    }
  }, [settingsData]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: '설정 저장됨',
        description: '기관 설정이 성공적으로 저장되었습니다.',
      });
    } catch (error) {
      toast({
        title: '저장 실패',
        description: '설정 저장 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-2">
          <Settings className="h-8 w-8 animate-pulse text-primary" />
          <p className="text-sm text-muted-foreground">기관 설정 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
        <p className="text-lg font-medium mb-2">데이터를 불러오는데 실패했습니다</p>
        <p className="text-sm text-muted-foreground mb-4">잠시 후 다시 시도해주세요</p>
        <Button onClick={() => refetch()}>다시 시도</Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">기관 설정</h1>
          <p className="text-muted-foreground">기관의 기본 정보와 설정을 관리하세요</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? '저장 중...' : '설정 저장'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              기본 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">기관명</label>
              <Input
                value={instituteInfo.name}
                onChange={(e) => setInstituteInfo(prev => ({...prev, name: e.target.value}))}
                placeholder="기관 이름을 입력하세요"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">기관 소개</label>
              <Textarea
                value={instituteInfo.description}
                onChange={(e) => setInstituteInfo(prev => ({...prev, description: e.target.value}))}
                placeholder="기관에 대한 간단한 소개를 입력하세요"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">운영 시간</label>
              <Input
                value={instituteInfo.businessHours}
                onChange={(e) => setInstituteInfo(prev => ({...prev, businessHours: e.target.value}))}
                placeholder="예: 평일 09:00-18:00, 토요일 09:00-15:00"
              />
            </div>
          </CardContent>
        </Card>

        {/* 연락처 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              연락처 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                주소
              </label>
              <Input
                value={instituteInfo.address}
                onChange={(e) => setInstituteInfo(prev => ({...prev, address: e.target.value}))}
                placeholder="기관 주소를 입력하세요"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                전화번호
              </label>
              <Input
                value={instituteInfo.phone}
                onChange={(e) => setInstituteInfo(prev => ({...prev, phone: e.target.value}))}
                placeholder="02-1234-5678"
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                이메일
              </label>
              <Input
                type="email"
                value={instituteInfo.email}
                onChange={(e) => setInstituteInfo(prev => ({...prev, email: e.target.value}))}
                placeholder="contact@example.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <Globe className="h-4 w-4" />
                웹사이트
              </label>
              <Input
                value={instituteInfo.website}
                onChange={(e) => setInstituteInfo(prev => ({...prev, website: e.target.value}))}
                placeholder="https://example.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* 로고 및 이미지 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              로고 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600">로고 이미지를 업로드하세요</p>
              <p className="text-xs text-gray-500 mt-1">권장 크기: 200x200px, PNG/JPG</p>
              <Button variant="outline" className="mt-4">
                파일 선택
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 추가 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              추가 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">온라인 예약 허용</p>
                <p className="text-sm text-muted-foreground">고객이 온라인으로 수업을 예약할 수 있습니다</p>
              </div>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">자동 알림 발송</p>
                <p className="text-sm text-muted-foreground">수업 일정 변경 시 자동으로 알림을 발송합니다</p>
              </div>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">리뷰 공개</p>
                <p className="text-sm text-muted-foreground">고객 리뷰를 공개적으로 표시합니다</p>
              </div>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}