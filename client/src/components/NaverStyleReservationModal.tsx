import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  CreditCard,
  Shield,
  Users,
  Building
} from 'lucide-react';

interface ReservationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  location: any;
  onReservationComplete: (reservation: any) => void;
}

export function NaverStyleReservationModal({ 
  isOpen, 
  onOpenChange, 
  location, 
  onReservationComplete 
}: ReservationModalProps) {
  const [step, setStep] = useState(1); // 1: 날짜/시간, 2: 정보입력, 3: 확인
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [formData, setFormData] = useState({
    petName: '',
    petBreed: '',
    petAge: '',
    ownerName: '',
    phone: '',
    email: '',
    requests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 달력 생성 (다음 2개월)
  const generateCalendarDates = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const dates = [];

    // 현재 달과 다음 달
    for (let monthOffset = 0; monthOffset < 2; monthOffset++) {
      const targetDate = new Date(currentYear, currentMonth + monthOffset, 1);
      const month = targetDate.getMonth();
      const year = targetDate.getFullYear();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDayOfWeek = new Date(year, month, 1).getDay();
      
      // 월 정보
      const monthInfo = {
        year,
        month,
        monthName: targetDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' }),
        dates: []
      };

      // 빈 칸 추가 (첫 주 시작 전)
      for (let i = 0; i < firstDayOfWeek; i++) {
        monthInfo.dates.push(null);
      }

      // 실제 날짜들
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateString = date.toISOString().split('T')[0];
        const isPast = date < today;
        const isToday = dateString === today.toISOString().split('T')[0];
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const isAvailable = !isPast && Math.random() > 0.2; // 80% 확률로 예약 가능

        monthInfo.dates.push({
          date: dateString,
          day,
          isPast,
          isToday,
          isWeekend,
          isAvailable,
          dayName: date.toLocaleDateString('ko-KR', { weekday: 'short' })
        });
      }

      dates.push(monthInfo);
    }
    return dates;
  };

  // 시간대 생성
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        const isAvailable = Math.random() > 0.3; // 70% 확률로 예약 가능
        slots.push({
          time: timeString,
          available: isAvailable,
          popular: Math.random() > 0.8 // 20% 확률로 인기 시간
        });
      }
    }
    return slots;
  };

  // 서비스별 옵션
  const getServiceOptions = () => {
    const serviceMap = {
      'grooming': [
        { id: 'basic', name: '기본 미용', price: '30,000원', duration: '1시간' },
        { id: 'premium', name: '프리미엄 미용', price: '50,000원', duration: '1.5시간' },
        { id: 'nail', name: '발톱깎기', price: '10,000원', duration: '30분' },
        { id: 'bath', name: '목욕 서비스', price: '20,000원', duration: '45분' }
      ],
      'hospital': [
        { id: 'checkup', name: '종합 건강검진', price: '80,000원', duration: '1시간' },
        { id: 'vaccination', name: '예방접종', price: '40,000원', duration: '30분' },
        { id: 'dental', name: '치과 검진', price: '60,000원', duration: '45분' },
        { id: 'surgery', name: '외과 상담', price: '100,000원', duration: '1시간' }
      ],
      'hotel': [
        { id: 'daycare', name: '데이케어 (1일)', price: '25,000원', duration: '8시간' },
        { id: 'overnight', name: '1박 숙박', price: '45,000원', duration: '24시간' },
        { id: 'weekend', name: '주말 패키지', price: '120,000원', duration: '2박3일' },
        { id: 'premium-room', name: '프리미엄룸', price: '70,000원', duration: '1박' }
      ],
      'daycare': [
        { id: 'half-day', name: '반일 케어', price: '15,000원', duration: '4시간' },
        { id: 'full-day', name: '종일 케어', price: '25,000원', duration: '8시간' },
        { id: 'socialization', name: '사회화 프로그램', price: '35,000원', duration: '3시간' },
        { id: 'play-time', name: '놀이 시간', price: '20,000원', duration: '2시간' }
      ],
      'park': [
        { id: 'entry', name: '입장권', price: '5,000원', duration: '제한없음' },
        { id: 'agility', name: '어질리티 체험', price: '15,000원', duration: '1시간' },
        { id: 'training', name: '기본 훈련 체험', price: '25,000원', duration: '1시간' },
        { id: 'group-play', name: '단체 놀이', price: '10,000원', duration: '30분' }
      ]
    };
    return serviceMap[location.type] || [];
  };

  const calendarData = generateCalendarDates();
  const timeSlots = generateTimeSlots();
  const services = getServiceOptions();

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // 시뮬레이션된 API 호출
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const reservation = {
        id: Date.now(),
        location: location.name,
        date: selectedDate,
        time: selectedTime,
        service: selectedService,
        petInfo: {
          name: formData.petName,
          breed: formData.petBreed,
          age: formData.petAge
        },
        ownerInfo: {
          name: formData.ownerName,
          phone: formData.phone,
          email: formData.email
        },
        requests: formData.requests,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      console.log('예약 완료:', reservation);
      
      // 부모 컴포넌트에 전달
      if (onReservationComplete) {
        onReservationComplete(reservation);
      }
      
      // 모달 닫기
      onOpenChange(false);
      
      // 성공 알림
      const serviceName = services.find(s => s.id === selectedService)?.name || '서비스';
      alert(`${location.name} 예약이 완료되었습니다!\n\n예약 정보:\n날짜: ${selectedDate}\n시간: ${selectedTime}\n서비스: ${serviceName}`);
      
    } catch (error) {
      console.error('예약 실패:', error);
      alert('예약 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedServiceInfo = services.find(s => s.id === selectedService);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            {location.name} 예약하기
          </DialogTitle>
        </DialogHeader>

        {/* 단계 표시 */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > stepNum ? <Check className="h-4 w-4" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step > stepNum ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 좌측: 예약 정보 */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">서비스 선택</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {services.map((service) => (
                      <Card 
                        key={service.id} 
                        className={`cursor-pointer transition-all ${
                          selectedService === service.id 
                            ? 'ring-2 ring-blue-600 bg-blue-50' 
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedService(service.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{service.name}</h4>
                            <Badge variant="outline">{service.duration}</Badge>
                          </div>
                          <p className="text-lg font-bold text-blue-600">{service.price}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">날짜 선택</h3>
                  <div className="space-y-6">
                    {calendarData.map((monthData, monthIndex) => (
                      <div key={monthIndex} className="border rounded-lg p-4">
                        <h4 className="text-center font-semibold mb-4 text-gray-800">
                          {monthData.monthName}
                        </h4>
                        
                        {/* 요일 헤더 */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
                            <div key={i} className={`text-center text-xs font-medium py-2 ${
                              i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-600'
                            }`}>
                              {day}
                            </div>
                          ))}
                        </div>
                        
                        {/* 날짜 그리드 */}
                        <div className="grid grid-cols-7 gap-1">
                          {monthData.dates.map((dateInfo, dateIndex) => {
                            if (!dateInfo) {
                              return <div key={dateIndex} className="h-10"></div>;
                            }
                            
                            const isSelected = selectedDate === dateInfo.date;
                            const canSelect = !dateInfo.isPast && dateInfo.isAvailable;
                            
                            return (
                              <button
                                key={dateIndex}
                                disabled={!canSelect}
                                onClick={() => canSelect && setSelectedDate(dateInfo.date)}
                                className={`
                                  h-10 w-full rounded-lg text-sm font-medium transition-all relative
                                  ${isSelected 
                                    ? 'bg-blue-600 text-white ring-2 ring-blue-300' 
                                    : canSelect
                                      ? 'hover:bg-blue-50 text-gray-700'
                                      : 'text-gray-300 cursor-not-allowed'
                                  }
                                  ${dateInfo.isToday ? 'ring-2 ring-orange-400' : ''}
                                  ${dateInfo.isWeekend && canSelect ? 'text-red-600' : ''}
                                  ${!dateInfo.isAvailable && !dateInfo.isPast ? 'bg-gray-100 text-gray-400' : ''}
                                `}
                              >
                                {dateInfo.day}
                                {dateInfo.isToday && (
                                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-400 rounded-full"></div>
                                )}
                                {!dateInfo.isAvailable && !dateInfo.isPast && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-0.5 h-6 bg-gray-400 rotate-45"></div>
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 날짜 선택 안내 */}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-600 rounded"></div>
                        <span>선택됨</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 border-2 border-orange-400 rounded"></div>
                        <span>오늘</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gray-100 rounded relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-0.5 h-2 bg-gray-400 rotate-45"></div>
                          </div>
                        </div>
                        <span>예약불가</span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedDate && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">시간 선택</h3>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedTime === slot.time ? "default" : "outline"}
                          size="sm"
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`relative ${slot.popular ? 'ring-1 ring-orange-400' : ''}`}
                        >
                          {slot.time}
                          {slot.popular && (
                            <Badge className="absolute -top-2 -right-2 text-xs bg-orange-500">
                              인기
                            </Badge>
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">예약 정보 입력</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">반려동물 이름 *</label>
                    <Input
                      value={formData.petName}
                      onChange={(e) => setFormData(prev => ({...prev, petName: e.target.value}))}
                      placeholder="반려동물 이름을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">품종</label>
                    <Input
                      value={formData.petBreed}
                      onChange={(e) => setFormData(prev => ({...prev, petBreed: e.target.value}))}
                      placeholder="품종을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">나이</label>
                    <Input
                      value={formData.petAge}
                      onChange={(e) => setFormData(prev => ({...prev, petAge: e.target.value}))}
                      placeholder="나이를 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">보호자 이름 *</label>
                    <Input
                      value={formData.ownerName}
                      onChange={(e) => setFormData(prev => ({...prev, ownerName: e.target.value}))}
                      placeholder="보호자 이름을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">연락처 *</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                      placeholder="010-0000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">이메일</label>
                    <Input
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                      placeholder="이메일을 입력하세요"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">요청사항</label>
                  <Textarea
                    value={formData.requests}
                    onChange={(e) => setFormData(prev => ({...prev, requests: e.target.value}))}
                    placeholder="특별한 요청사항이나 주의사항을 입력해주세요"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">예약 정보 확인</h3>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">예약 장소</span>
                        <span className="font-semibold">{location.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">서비스</span>
                        <span className="font-semibold">{selectedServiceInfo?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">예약 날짜</span>
                        <span className="font-semibold">{selectedDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">예약 시간</span>
                        <span className="font-semibold">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">반려동물</span>
                        <span className="font-semibold">{formData.petName} ({formData.petBreed})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">보호자</span>
                        <span className="font-semibold">{formData.ownerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">연락처</span>
                        <span className="font-semibold">{formData.phone}</span>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex justify-between text-lg">
                          <span className="font-semibold">총 예약 금액</span>
                          <span className="font-bold text-blue-600">{selectedServiceInfo?.price}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-semibold mb-1">예약 안내사항</p>
                      <ul className="space-y-1 text-xs">
                        <li>• 예약 취소는 이용 24시간 전까지 가능합니다.</li>
                        <li>• 노쇼(No-show) 시 다음 예약이 제한될 수 있습니다.</li>
                        <li>• 반려동물의 예방접종 증명서를 지참해 주세요.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 우측: 시설 정보 요약 */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <img 
                  src={location.image} 
                  alt={location.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-semibold mb-2">{location.name}</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{location.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{location.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{location.rating} ({location.reviewCount}개 리뷰)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 선택한 정보 요약 */}
            {(selectedService || selectedDate || selectedTime) && (
              <Card>
                <CardContent className="p-4">
                  <h5 className="font-semibold mb-3">선택 정보</h5>
                  <div className="space-y-2 text-sm">
                    {selectedService && (
                      <div className="flex justify-between">
                        <span>서비스:</span>
                        <span className="font-medium">{selectedServiceInfo?.name}</span>
                      </div>
                    )}
                    {selectedDate && (
                      <div className="flex justify-between">
                        <span>날짜:</span>
                        <span className="font-medium">{selectedDate}</span>
                      </div>
                    )}
                    {selectedTime && (
                      <div className="flex justify-between">
                        <span>시간:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                    )}
                    {selectedServiceInfo && (
                      <div className="flex justify-between border-t pt-2">
                        <span>금액:</span>
                        <span className="font-bold text-blue-600">{selectedServiceInfo.price}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-3 pt-6 border-t">
          <Button
            variant="outline"
            className="flex-1"
            onClick={step === 1 ? () => onOpenChange(false) : handlePrev}
          >
            {step === 1 ? '취소' : '이전'}
          </Button>
          
          {step < 3 ? (
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleNext}
              disabled={
                (step === 1 && (!selectedService || !selectedDate || !selectedTime)) ||
                (step === 2 && (!formData.petName || !formData.ownerName || !formData.phone))
              }
            >
              다음
            </Button>
          ) : (
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  예약 중...
                </div>
              ) : (
                '예약 완료'
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}