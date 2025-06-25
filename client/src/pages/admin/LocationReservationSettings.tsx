import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  MapPin, 
  Clock, 
  Users, 
  Calendar,
  Plus,
  Edit,
  Trash2,
  Save,
  AlertCircle
} from 'lucide-react';

interface ReservationSetting {
  id: number;
  locationId: number;
  locationName: string;
  type: 'trainer-consultation' | 'naver-style';
  isEnabled: boolean;
  bookingHours: {
    start: string;
    end: string;
  };
  maxBookingsPerDay: number;
  advanceBookingDays: number;
  services: Array<{
    id: string;
    name: string;
    duration: number;
    price: number;
    description: string;
  }>;
  timeSlots: string[];
  restrictions: {
    minAge: number;
    maxGroupSize: number;
    requiresApproval: boolean;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    confirmationRequired: boolean;
  };
}

export default function LocationReservationSettings() {
  const [settings, setSettings] = useState<ReservationSetting[]>([
    {
      id: 1,
      locationId: 1,
      locationName: "펫마트 강남점",
      type: "naver-style",
      isEnabled: true,
      bookingHours: { start: "09:00", end: "18:00" },
      maxBookingsPerDay: 20,
      advanceBookingDays: 30,
      services: [
        { id: "grooming", name: "미용 서비스", duration: 60, price: 50000, description: "전문 반려동물 미용" },
        { id: "health", name: "건강검진", duration: 30, price: 30000, description: "기본 건강검진" }
      ],
      timeSlots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
      restrictions: { minAge: 0, maxGroupSize: 1, requiresApproval: false },
      notifications: { email: true, sms: true, confirmationRequired: true }
    },
    {
      id: 2,
      locationId: 2,
      locationName: "해피독 훈련센터",
      type: "trainer-consultation",
      isEnabled: true,
      bookingHours: { start: "10:00", end: "19:00" },
      maxBookingsPerDay: 8,
      advanceBookingDays: 14,
      services: [
        { id: "basic-training", name: "기본 훈련", duration: 90, price: 80000, description: "기본 반려동물 훈련" },
        { id: "behavior", name: "행동 교정", duration: 120, price: 120000, description: "문제 행동 교정 상담" }
      ],
      timeSlots: ["10:00", "12:00", "14:00", "16:00", "18:00"],
      restrictions: { minAge: 6, maxGroupSize: 1, requiresApproval: true },
      notifications: { email: true, sms: false, confirmationRequired: true }
    }
  ]);

  const [selectedSetting, setSelectedSetting] = useState<ReservationSetting | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newService, setNewService] = useState({ name: '', duration: 60, price: 0, description: '' });
  const [newTimeSlot, setNewTimeSlot] = useState('');

  const handleSaveSetting = (updatedSetting: ReservationSetting) => {
    setSettings(prev => prev.map(s => s.id === updatedSetting.id ? updatedSetting : s));
    setIsEditModalOpen(false);
    setSelectedSetting(null);
  };

  const handleAddService = (settingId: number) => {
    if (!newService.name) return;
    
    setSettings(prev => prev.map(s => 
      s.id === settingId 
        ? {
            ...s,
            services: [...s.services, {
              id: `service_${Date.now()}`,
              ...newService
            }]
          }
        : s
    ));
    setNewService({ name: '', duration: 60, price: 0, description: '' });
  };

  const handleRemoveService = (settingId: number, serviceId: string) => {
    setSettings(prev => prev.map(s => 
      s.id === settingId 
        ? { ...s, services: s.services.filter(service => service.id !== serviceId) }
        : s
    ));
  };

  const handleAddTimeSlot = (settingId: number) => {
    if (!newTimeSlot) return;
    
    setSettings(prev => prev.map(s => 
      s.id === settingId 
        ? { ...s, timeSlots: [...s.timeSlots, newTimeSlot].sort() }
        : s
    ));
    setNewTimeSlot('');
  };

  const handleRemoveTimeSlot = (settingId: number, timeSlot: string) => {
    setSettings(prev => prev.map(s => 
      s.id === settingId 
        ? { ...s, timeSlots: s.timeSlots.filter(slot => slot !== timeSlot) }
        : s
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">위치별 예약 설정 관리</h1>
          <p className="text-muted-foreground">각 위치별 예약 시스템 및 서비스를 관리합니다</p>
        </div>
        <Button onClick={() => {
          setSelectedSetting(null);
          setIsEditModalOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          새 설정 추가
        </Button>
      </div>

      <div className="grid gap-6">
        {settings.map((setting) => (
          <Card key={setting.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle>{setting.locationName}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={setting.type === 'trainer-consultation' ? 'default' : 'secondary'}>
                        {setting.type === 'trainer-consultation' ? '훈련사 상담' : '네이버 스타일'}
                      </Badge>
                      <Badge variant={setting.isEnabled ? 'success' : 'destructive'}>
                        {setting.isEnabled ? '활성' : '비활성'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedSetting(setting);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSettings(prev => prev.filter(s => s.id !== setting.id));
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">기본 설정</TabsTrigger>
                  <TabsTrigger value="services">서비스</TabsTrigger>
                  <TabsTrigger value="schedule">시간 설정</TabsTrigger>
                  <TabsTrigger value="restrictions">제한 사항</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div className="text-sm">
                        <div className="font-medium">운영시간</div>
                        <div className="text-muted-foreground">
                          {setting.bookingHours.start} - {setting.bookingHours.end}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <div className="text-sm">
                        <div className="font-medium">일일 최대 예약</div>
                        <div className="text-muted-foreground">{setting.maxBookingsPerDay}건</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div className="text-sm">
                        <div className="font-medium">사전 예약</div>
                        <div className="text-muted-foreground">{setting.advanceBookingDays}일 전</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-gray-500" />
                      <div className="text-sm">
                        <div className="font-medium">승인 필요</div>
                        <div className="text-muted-foreground">
                          {setting.restrictions.requiresApproval ? '예' : '아니오'}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="services" className="space-y-4">
                  <div className="grid gap-3">
                    {setting.services.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {service.duration}분 • {service.price.toLocaleString()}원
                          </div>
                          <div className="text-sm text-muted-foreground">{service.description}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveService(setting.id, service.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="schedule" className="space-y-4">
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {setting.timeSlots.map((slot) => (
                      <div key={slot} className="flex items-center justify-between p-2 border rounded text-sm">
                        <span>{slot}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTimeSlot(setting.id, slot)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="restrictions" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>최소 연령 (개월)</Label>
                      <div className="text-2xl font-bold">{setting.restrictions.minAge}</div>
                    </div>
                    <div className="space-y-2">
                      <Label>최대 그룹 크기</Label>
                      <div className="text-2xl font-bold">{setting.restrictions.maxGroupSize}</div>
                    </div>
                    <div className="space-y-2">
                      <Label>알림 설정</Label>
                      <div className="flex gap-2">
                        {setting.notifications.email && <Badge>이메일</Badge>}
                        {setting.notifications.sms && <Badge>SMS</Badge>}
                        {setting.notifications.confirmationRequired && <Badge>확인 필요</Badge>}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 설정 편집 모달 */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedSetting ? '예약 설정 편집' : '새 예약 설정 추가'}
            </DialogTitle>
          </DialogHeader>
          
          {/* 모달 내용은 복잡하므로 별도 컴포넌트로 분리할 수 있음 */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>위치명</Label>
                <Input 
                  value={selectedSetting?.locationName || ''} 
                  placeholder="위치명을 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label>예약 타입</Label>
                <Select value={selectedSetting?.type || 'naver-style'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="naver-style">네이버 스타일 예약</SelectItem>
                    <SelectItem value="trainer-consultation">훈련사 상담 예약</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch checked={selectedSetting?.isEnabled || false} />
              <Label>예약 시스템 활성화</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>운영 시작 시간</Label>
                <Input 
                  type="time" 
                  value={selectedSetting?.bookingHours.start || '09:00'} 
                />
              </div>
              <div className="space-y-2">
                <Label>운영 종료 시간</Label>
                <Input 
                  type="time" 
                  value={selectedSetting?.bookingHours.end || '18:00'} 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>일일 최대 예약 수</Label>
                <Input 
                  type="number" 
                  value={selectedSetting?.maxBookingsPerDay || 20} 
                />
              </div>
              <div className="space-y-2">
                <Label>사전 예약 가능 일수</Label>
                <Input 
                  type="number" 
                  value={selectedSetting?.advanceBookingDays || 30} 
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                취소
              </Button>
              <Button onClick={() => {
                if (selectedSetting) {
                  handleSaveSetting(selectedSetting);
                }
              }}>
                <Save className="h-4 w-4 mr-2" />
                저장
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}