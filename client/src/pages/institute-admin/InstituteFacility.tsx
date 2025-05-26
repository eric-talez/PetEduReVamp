import { useState, useEffect } from 'react';
import { useGlobalAuth } from '@/hooks/useGlobalAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Building,
  MapPin,
  Calendar,
  Users,
  Settings,
  Plus,
  Edit,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

interface Facility {
  id: number;
  name: string;
  type: 'classroom' | 'training_ground' | 'outdoor' | 'office';
  capacity: number;
  location: string;
  status: 'available' | 'occupied' | 'maintenance';
  equipment: string[];
  size: string;
  bookings: number;
  nextAvailable: string;
}

export default function InstituteFacility() {
  const { userName } = useGlobalAuth();
  const { toast } = useToast();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFacilities = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockFacilities: Facility[] = [
          {
            id: 1,
            name: 'A동 1층 훈련장',
            type: 'training_ground',
            capacity: 15,
            location: 'A동 1층',
            status: 'available',
            equipment: ['장애물', '매트', '음향시설'],
            size: '50평',
            bookings: 12,
            nextAvailable: '2024-05-27T14:00:00Z'
          },
          {
            id: 2,
            name: 'B동 2층 소강의실',
            type: 'classroom',
            capacity: 10,
            location: 'B동 2층',
            status: 'occupied',
            equipment: ['프로젝터', '화이트보드', '의자'],
            size: '30평',
            bookings: 8,
            nextAvailable: '2024-05-27T16:00:00Z'
          },
          {
            id: 3,
            name: 'C동 야외 훈련장',
            type: 'outdoor',
            capacity: 20,
            location: 'C동 야외',
            status: 'available',
            equipment: ['어질리티 장비', '그늘막', '급수대'],
            size: '100평',
            bookings: 5,
            nextAvailable: '2024-05-27T10:00:00Z'
          },
          {
            id: 4,
            name: 'A동 2층 상담실',
            type: 'office',
            capacity: 4,
            location: 'A동 2층',
            status: 'maintenance',
            equipment: ['책상', '의자', '서류함'],
            size: '15평',
            bookings: 0,
            nextAvailable: '2024-05-28T09:00:00Z'
          }
        ];
        
        setFacilities(mockFacilities);
      } catch (error) {
        console.error('시설 데이터 로딩 오류:', error);
        toast({
          title: '데이터 로딩 오류',
          description: '시설 정보를 불러오는 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFacilities();
  }, [toast]);

  const StatusBadge = ({ status }: { status: Facility['status'] }) => {
    const config = {
      available: { label: '이용 가능', icon: CheckCircle, className: 'bg-green-100 text-green-700 border-green-200' },
      occupied: { label: '사용 중', icon: Clock, className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      maintenance: { label: '점검 중', icon: AlertCircle, className: 'bg-red-100 text-red-700 border-red-200' }
    };

    const { label, icon: Icon, className } = config[status];
    return (
      <Badge variant="outline" className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-2">
          <Building className="h-8 w-8 animate-pulse text-primary" />
          <p className="text-sm text-muted-foreground">시설 정보 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">시설 관리</h1>
          <p className="text-muted-foreground">기관의 시설 현황을 관리하고 예약 상태를 확인하세요</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          새 시설 등록
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">전체 시설</p>
                <p className="text-2xl font-bold">{facilities.length}개</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">이용 가능</p>
                <p className="text-2xl font-bold">{facilities.filter(f => f.status === 'available').length}개</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">총 수용 인원</p>
                <p className="text-2xl font-bold">{facilities.reduce((sum, f) => sum + f.capacity, 0)}명</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-amber-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">총 예약</p>
                <p className="text-2xl font-bold">{facilities.reduce((sum, f) => sum + f.bookings, 0)}건</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 시설 목록 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {facilities.map((facility) => (
          <Card key={facility.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    {facility.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4" />
                    {facility.location}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={facility.status} />
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* 기본 정보 */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">수용 인원</p>
                  <p className="font-medium">{facility.capacity}명</p>
                </div>
                <div>
                  <p className="text-muted-foreground">면적</p>
                  <p className="font-medium">{facility.size}</p>
                </div>
              </div>

              {/* 장비 */}
              <div>
                <p className="text-sm font-medium mb-2">보유 장비</p>
                <div className="flex flex-wrap gap-1">
                  {facility.equipment.map((item, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 예약 현황 */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">이번 주 예약</span>
                  <span className="font-medium">{facility.bookings}건</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">다음 이용 가능</span>
                  <span className="font-medium">
                    {new Date(facility.nextAvailable).toLocaleString('ko-KR', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {/* 이용률 표시 */}
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>주간 이용률</span>
                  <span>{Math.round((facility.bookings / 20) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${Math.min((facility.bookings / 20) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex justify-between pt-2">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  예약 현황
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  설정
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 빠른 액세스 */}
      <Card>
        <CardHeader>
          <CardTitle>시설 관리 도구</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              <span>예약 관리</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Settings className="h-6 w-6 mb-2" />
              <span>시설 설정</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <AlertCircle className="h-6 w-6 mb-2" />
              <span>점검 일정</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              <span>이용 통계</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}