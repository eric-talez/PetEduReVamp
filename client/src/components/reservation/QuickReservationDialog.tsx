import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, User, Phone, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface LocationData {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: 'hospital' | 'training' | 'grooming' | 'hotel' | 'cafe' | 'park';
  phone?: string;
  hours?: string;
  rating?: number;
  description?: string;
  services?: string[];
}

interface QuickReservationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  location: LocationData | null;
  onReservationSubmit: (reservationData: any) => void;
}

export function QuickReservationDialog({ 
  isOpen, 
  onClose, 
  location, 
  onReservationSubmit 
}: QuickReservationDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [petName, setPetName] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // 예약 가능한 시간대
  const availableTimeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  // 서비스 타입별 옵션
  const getServiceOptions = (type: string) => {
    switch (type) {
      case 'hospital':
        return [
          { value: 'checkup', label: '건강검진', duration: 30, price: 50000 },
          { value: 'vaccination', label: '예방접종', duration: 15, price: 30000 },
          { value: 'treatment', label: '치료상담', duration: 45, price: 80000 },
          { value: 'emergency', label: '응급진료', duration: 60, price: 120000 }
        ];
      case 'training':
        return [
          { value: 'basic', label: '기본 복종 훈련', duration: 60, price: 70000 },
          { value: 'behavior', label: '문제행동 교정', duration: 90, price: 100000 },
          { value: 'socialization', label: '사회화 훈련', duration: 60, price: 80000 },
          { value: 'puppy', label: '퍼피 트레이닝', duration: 45, price: 60000 }
        ];
      case 'grooming':
        return [
          { value: 'full', label: '풀 그루밍', duration: 120, price: 80000 },
          { value: 'wash', label: '목욕 & 드라이', duration: 60, price: 40000 },
          { value: 'nail', label: '발톱깎기', duration: 15, price: 15000 },
          { value: 'styling', label: '스타일링', duration: 90, price: 60000 }
        ];
      default:
        return [
          { value: 'consultation', label: '상담', duration: 30, price: 30000 }
        ];
    }
  };

  const serviceOptions = getServiceOptions(location?.type || '');
  const selectedServiceData = serviceOptions.find(s => s.value === selectedService);

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !selectedService || !customerName || !customerPhone) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    
    try {
      const reservationData = {
        locationId: location?.id,
        locationName: location?.name,
        locationAddress: location?.address,
        locationPhone: location?.phone,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        service: selectedService,
        serviceName: selectedServiceData?.label,
        duration: selectedServiceData?.duration,
        price: selectedServiceData?.price,
        customerName,
        customerPhone,
        petName,
        notes,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      await onReservationSubmit(reservationData);
      
      // 폼 초기화
      setSelectedDate(new Date());
      setSelectedTime('');
      setSelectedService('');
      setCustomerName('');
      setCustomerPhone('');
      setPetName('');
      setNotes('');
      
      onClose();
    } catch (error) {
      console.error('예약 실패:', error);
      alert('예약 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const getLocationTypeLabel = (type: string) => {
    const typeLabels = {
      hospital: '동물병원',
      training: '훈련소',
      grooming: '미용실',
      hotel: '호텔',
      cafe: '펫카페',
      park: '공원'
    };
    return typeLabels[type as keyof typeof typeLabels] || type;
  };

  if (!location) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            {location.name} 예약
          </DialogTitle>
          <DialogDescription>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {getLocationTypeLabel(location.type)}
                </Badge>
                {location.rating && (
                  <div className="flex items-center text-yellow-500">
                    <span>⭐ {location.rating}</span>
                  </div>
                )}
              </div>
              <p className="text-gray-600">{location.address}</p>
              {location.phone && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Phone className="h-4 w-4" />
                  {location.phone}
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* 서비스 선택 */}
          <div className="space-y-2">
            <Label>서비스 선택 *</Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="서비스를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {serviceOptions.map(service => (
                  <SelectItem key={service.value} value={service.value}>
                    <div className="flex justify-between items-center w-full">
                      <span>{service.label}</span>
                      <div className="text-sm text-gray-500 ml-4">
                        {service.duration}분 • {service.price.toLocaleString()}원
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 날짜 및 시간 선택 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>예약 날짜 *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'yyyy년 MM월 dd일', { locale: ko }) : '날짜 선택'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>예약 시간 *</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="시간 선택" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.map(time => (
                    <SelectItem key={time} value={time}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {time}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 고객 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>보호자 이름 *</Label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="이름을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <Label>연락처 *</Label>
              <Input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="010-0000-0000"
              />
            </div>
          </div>

          {/* 반려동물 정보 */}
          <div className="space-y-2">
            <Label>반려동물 이름</Label>
            <Input
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="반려동물 이름을 입력하세요"
            />
          </div>

          {/* 특이사항 */}
          <div className="space-y-2">
            <Label>특이사항 및 요청사항</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="특별한 요청사항이나 반려동물의 특이사항을 적어주세요"
              rows={3}
            />
          </div>

          {/* 예약 요약 */}
          {selectedServiceData && selectedDate && selectedTime && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">예약 요약</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <p>서비스: {selectedServiceData.label}</p>
                <p>일시: {format(selectedDate, 'yyyy년 MM월 dd일', { locale: ko })} {selectedTime}</p>
                <p>소요시간: 약 {selectedServiceData.duration}분</p>
                <p className="font-medium">예상 비용: {selectedServiceData.price.toLocaleString()}원</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? '예약 중...' : '예약하기'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}