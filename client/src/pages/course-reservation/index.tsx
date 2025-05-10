import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Info, MapPin, CalendarIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';

export default function CourseReservation() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [step, setStep] = useState(1); // 1: 수업 선택, 2: 날짜 시간 선택, 3: 예약 확인
  
  // URL에서 trainerId 파라미터 가져오기
  const [trainerId, setTrainerId] = useState<string | null>(null);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const trainerParam = params.get('trainer');
    if (trainerParam) {
      setTrainerId(trainerParam);
    }
  }, []);
  
  // 모의 데이터
  const trainerClasses = [
    {
      id: 1,
      title: '반려견 기초 훈련 클래스',
      type: '그룹 수업',
      maxParticipants: 5,
      duration: '60분',
      price: 25000,
      description: '반려견과 견주를 위한 기초 훈련 클래스입니다. 앉아, 엎드려, 기다려 등의 기본 명령어를 훈련합니다.',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350',
      trainer: {
        id: 1,
        name: '김훈련',
        avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
      },
      location: '서울시 강남구 테헤란로 123',
      availableDates: [new Date(), new Date(Date.now() + 86400000), new Date(Date.now() + 86400000 * 2)],
      timeSlots: ['10:00', '14:00', '16:00'],
      reviews: [
        { id: 1, author: '박지민', rating: 5, comment: '아주 유익한 수업이었습니다! 강아지가 기본 명령어를 잘 따르게 되었어요.' },
        { id: 2, author: '김영희', rating: 4, comment: '친절하게 가르쳐주셔서 좋았습니다. 다음 과정도 듣고 싶어요.' }
      ]
    },
    {
      id: 2,
      title: '문제 행동 교정 1:1 상담',
      type: '1:1 상담',
      maxParticipants: 1,
      duration: '50분',
      price: 50000,
      description: '짖음, 분리불안, 공격성 등 반려견의 문제 행동을 분석하고 교정하는 1:1 맞춤형 상담입니다.',
      image: 'https://images.unsplash.com/photo-1541687536467-89201e011187?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350',
      trainer: {
        id: 1,
        name: '김훈련',
        avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
      },
      location: '서울시 강남구 테헤란로 123',
      availableDates: [new Date(), new Date(Date.now() + 86400000), new Date(Date.now() + 86400000 * 3)],
      timeSlots: ['11:00', '13:00', '17:00'],
      reviews: [
        { id: 3, author: '이하준', rating: 5, comment: '우리 강아지의 분리불안이 많이 개선되었어요. 정말 감사합니다!' }
      ]
    },
    {
      id: 3,
      title: '어질리티 중급 과정',
      type: '그룹 수업',
      maxParticipants: 4,
      duration: '90분',
      price: 35000,
      description: '반려견의 민첩성과 균형감각을 키우는 어질리티 중급 과정입니다. 기초 훈련을 마친 반려견에게 추천합니다.',
      image: 'https://images.unsplash.com/photo-1566647387313-9fda80664848?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350',
      trainer: {
        id: 1,
        name: '김훈련',
        avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
      },
      location: '서울시 강남구 대치동 반려견 훈련센터',
      availableDates: [new Date(Date.now() + 86400000), new Date(Date.now() + 86400000 * 4)],
      timeSlots: ['15:00', '18:00'],
      reviews: [
        { id: 4, author: '최준호', rating: 4, comment: '전문적인 교육이 좋았습니다. 강아지가 장애물을 잘 넘기게 되었어요.' }
      ]
    }
  ];

  // 오늘 날짜 이전의 날짜는 비활성화
  const disabledDates = (date: Date) => {
    return date < new Date(new Date().setHours(0, 0, 0, 0));
  };
  
  // 클래스 선택 처리
  const handleSelectClass = (classItem: any) => {
    setSelectedClass(classItem);
    setStep(2);
    window.scrollTo(0, 0);
  };
  
  // 날짜 선택 처리
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // 날짜 변경 시 시간 선택 초기화
  };
  
  // 시간 선택 처리
  const handleTimeSelect = (time: string) => {
    setSelectedTimeSlot(time);
  };
  
  // 예약 진행 처리
  const handleContinueReservation = () => {
    if (!selectedTimeSlot) {
      alert('수업 시간을 선택해주세요.');
      return;
    }
    setStep(3);
    window.scrollTo(0, 0);
  };
  
  // 예약 확정 처리
  const handleConfirmReservation = () => {
    if (!isAuthenticated) {
      // 비로그인 사용자는 로그인 페이지로 리디렉션
      const currentPath = window.location.pathname + window.location.search;
      setLocation(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    
    console.log('예약 확정', {
      class: selectedClass,
      date: selectedDate,
      time: selectedTimeSlot
    });
    
    // 예약 성공 페이지로 이동
    setLocation('/reservation-complete');
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      {/* 단계 표시기 */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
              1
            </div>
            <span className="text-sm">수업 선택</span>
          </div>
          
          <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
          
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
              2
            </div>
            <span className="text-sm">일정 선택</span>
          </div>
          
          <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
          
          <div className={`flex flex-col items-center ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
              3
            </div>
            <span className="text-sm">예약 확인</span>
          </div>
        </div>
      </div>
      
      {/* 1단계: 수업 선택 */}
      {step === 1 && (
        <div>
          <h1 className="text-2xl font-bold mb-6">수업 예약</h1>
          
          <div className="space-y-6">
            {trainerClasses.map((classItem) => (
              <Card key={classItem.id} className="overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3 h-48 md:h-auto">
                    <img 
                      src={classItem.image} 
                      alt={classItem.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 md:w-2/3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-semibold mb-2">{classItem.title}</h2>
                        <div className="flex items-center mb-4">
                          <img 
                            src={classItem.trainer.avatar} 
                            alt={classItem.trainer.name}
                            className="w-6 h-6 rounded-full mr-2"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{classItem.trainer.name} 훈련사</span>
                        </div>
                      </div>
                      <Badge className={classItem.type === '1:1 상담' ? 'bg-blue-500' : 'bg-green-500'}>
                        {classItem.type}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {classItem.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm mb-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-600 dark:text-gray-400" />
                        <span>{classItem.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-600 dark:text-gray-400" />
                        <span>최대 {classItem.maxParticipants}명</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-600 dark:text-gray-400" />
                        <span>{classItem.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-primary">
                        {classItem.price.toLocaleString()}원
                      </div>
                      <Button onClick={() => handleSelectClass(classItem)}>
                        예약하기
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* 2단계: 날짜 및 시간 선택 */}
      {step === 2 && selectedClass && (
        <div>
          <h1 className="text-2xl font-bold mb-6">일정 선택</h1>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <Card className="p-4">
                <h2 className="text-lg font-medium mb-4">날짜 선택</h2>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="rounded-md border"
                  disabled={disabledDates}
                  initialFocus
                />
              </Card>
            </div>
            
            <div className="md:w-1/2">
              <Card className="p-4">
                <h2 className="text-lg font-medium mb-4">시간 선택</h2>
                {selectedDate ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {selectedClass.timeSlots.map((time: string) => (
                      <Button
                        key={time}
                        variant={selectedTimeSlot === time ? "default" : "outline"}
                        className="justify-center"
                        onClick={() => handleTimeSelect(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    날짜를 먼저 선택해주세요.
                  </div>
                )}
              </Card>
              
              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  이전
                </Button>
                <Button onClick={handleContinueReservation}>
                  다음
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 3단계: 예약 확인 */}
      {step === 3 && selectedClass && selectedDate && selectedTimeSlot && (
        <div>
          <h1 className="text-2xl font-bold mb-6">예약 확인</h1>
          
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">예약 정보</h2>
            
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row">
                <div className="font-medium md:w-1/4">수업명</div>
                <div className="md:w-3/4">{selectedClass.title}</div>
              </div>
              
              <div className="flex flex-col md:flex-row">
                <div className="font-medium md:w-1/4">수업 유형</div>
                <div className="md:w-3/4">
                  <Badge className={selectedClass.type === '1:1 상담' ? 'bg-blue-500' : 'bg-green-500'}>
                    {selectedClass.type}
                  </Badge>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row">
                <div className="font-medium md:w-1/4">훈련사</div>
                <div className="md:w-3/4 flex items-center">
                  <img 
                    src={selectedClass.trainer.avatar} 
                    alt={selectedClass.trainer.name}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <span>{selectedClass.trainer.name} 훈련사</span>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row">
                <div className="font-medium md:w-1/4">일정</div>
                <div className="md:w-3/4 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                  <span>
                    {selectedDate ? format(selectedDate, 'yyyy년 M월 d일 (EEEE)', { locale: ko }) : ''}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row">
                <div className="font-medium md:w-1/4">시간</div>
                <div className="md:w-3/4 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                  <span>{selectedTimeSlot} (소요시간: {selectedClass.duration})</span>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row">
                <div className="font-medium md:w-1/4">장소</div>
                <div className="md:w-3/4 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                  <span>{selectedClass.location}</span>
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row">
                <div className="font-medium md:w-1/4">결제 금액</div>
                <div className="md:w-3/4 font-bold text-primary text-lg">
                  {selectedClass.price.toLocaleString()}원
                </div>
              </div>
              
              {!isAuthenticated && (
                <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-md flex items-start">
                  <Info className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-amber-800 dark:text-amber-200 text-sm">
                      로그인 후 예약하시면 예약 내역을 확인하고 관리할 수 있습니다.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>
              이전
            </Button>
            <Button onClick={handleConfirmReservation}>
              예약 확정하기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}