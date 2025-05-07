import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, User, MessageSquare, Check, X, ArrowRight, Video } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export default function TrainerReservations() {
  // 상태 관리
  const [pendingReservations, setPendingReservations] = useState<any[]>([]);
  const [upcomingReservations, setUpcomingReservations] = useState<any[]>([]);
  const [completedReservations, setCompletedReservations] = useState<any[]>([]);
  const [availabilitySlots, setAvailabilitySlots] = useState<any[]>([]);
  
  // 다이얼로그 상태
  const [addSlotDialogOpen, setAddSlotDialogOpen] = useState(false);
  const [editReservationDialogOpen, setEditReservationDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  
  // 신규 가용 시간 추가 폼 상태
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [slotType, setSlotType] = useState('1:1');
  const [maxParticipants, setMaxParticipants] = useState(1);
  const [price, setPrice] = useState(30000);
  
  // 가용 시간 슬롯 시간 옵션
  const timeOptions = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00'
  ];
  
  useEffect(() => {
    // 모의 데이터 로드 (실제로는 API에서 가져와야 함)
    loadMockData();
  }, []);
  
  const loadMockData = () => {
    // 대기 중인 예약
    setPendingReservations([
      {
        id: 1,
        studentName: '김철수',
        studentAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100',
        petName: '초코',
        date: '2025년 5월 8일',
        time: '오후 2:00 - 3:00',
        type: '1:1 상담',
        status: 'pending',
        requestMessage: '반려견 분리불안 증상에 대해 상담하고 싶습니다.'
      },
      {
        id: 2,
        studentName: '이영희',
        studentAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100',
        petName: '뭉치',
        date: '2025년 5월 9일',
        time: '오전 11:00 - 12:00',
        type: '그룹 훈련',
        status: 'pending',
        requestMessage: '기본 훈련을 잘 따라하지 않는데 효과적인 방법이 있을까요?'
      }
    ]);
    
    // 예정된 예약
    setUpcomingReservations([
      {
        id: 3,
        studentName: '박지민',
        studentAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100',
        petName: '해피',
        date: '2025년 5월 7일',
        time: '오후 4:00 - 5:00',
        type: '1:1 상담',
        status: 'confirmed',
        meetingId: 'zoom-789456123',
        notes: '짖음 문제 개선 방법에 대한 상담'
      },
      {
        id: 4,
        studentName: '최준호',
        studentAvatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100',
        petName: '루시',
        date: '2025년 5월 7일',
        time: '오후 6:00 - 7:00',
        type: '1:1 상담',
        status: 'confirmed',
        meetingId: 'zoom-456789123',
        notes: '산책 시 다른 강아지에게 공격적인 행동 개선'
      }
    ]);
    
    // 완료된 예약
    setCompletedReservations([
      {
        id: 5,
        studentName: '정다연',
        studentAvatar: 'https://images.unsplash.com/photo-1499887142886-791eca5918cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100',
        petName: '코코',
        date: '2025년 5월 1일',
        time: '오후 3:00 - 4:00',
        type: '1:1 상담',
        status: 'completed',
        meetingId: 'zoom-123456789',
        feedback: '아주 유익한 훈련 시간이었습니다. 감사합니다!',
        rating: 5
      }
    ]);
    
    // 가용 시간 슬롯
    setAvailabilitySlots([
      {
        id: 1,
        date: '2025년 5월 8일',
        startTime: '10:00',
        endTime: '11:00',
        type: '1:1',
        maxParticipants: 1,
        price: 30000,
        booked: false
      },
      {
        id: 2,
        date: '2025년 5월 8일',
        startTime: '14:00',
        endTime: '15:00',
        type: '1:1',
        maxParticipants: 1,
        price: 30000,
        booked: true
      },
      {
        id: 3,
        date: '2025년 5월 9일',
        startTime: '16:00',
        endTime: '17:00',
        type: '그룹',
        maxParticipants: 5,
        price: 20000,
        booked: false
      }
    ]);
  };
  
  // 예약 처리 함수들
  const handleAcceptReservation = (reservationId: number) => {
    // 실제로는 API 호출을 통해 예약 승인
    console.log(`예약 ID ${reservationId} 승인`);
    
    // 모의 데이터 업데이트
    const reservation = pendingReservations.find(r => r.id === reservationId);
    if (reservation) {
      setPendingReservations(pendingReservations.filter(r => r.id !== reservationId));
      setUpcomingReservations([...upcomingReservations, {
        ...reservation,
        status: 'confirmed',
        meetingId: 'zoom-' + Math.floor(Math.random() * 1000000000)
      }]);
    }
  };
  
  const handleRejectReservation = (reservationId: number) => {
    // 실제로는 API 호출을 통해 예약 거절
    console.log(`예약 ID ${reservationId} 거절`);
    
    // 모의 데이터 업데이트
    setPendingReservations(pendingReservations.filter(r => r.id !== reservationId));
  };
  
  const handleSendMessage = (studentName: string) => {
    // 실제로는 메시지 페이지로 이동
    console.log(`${studentName}님에게 메시지 보내기`);
    window.location.href = `/messages?student=${encodeURIComponent(studentName)}`;
  };
  
  const handleJoinMeeting = (meetingId: string) => {
    // 실제로는 Zoom 미팅으로 이동
    console.log(`미팅 ID ${meetingId} 참여하기`);
    window.open(`https://zoom.us/j/${meetingId}`, '_blank');
  };
  
  const handleEditReservation = (reservation: any) => {
    setSelectedReservation(reservation);
    setEditReservationDialogOpen(true);
  };
  
  // 가용 시간 슬롯 추가
  const handleAddAvailabilitySlot = () => {
    if (!date) return;
    
    const formattedDate = format(date, 'yyyy년 M월 d일', { locale: ko });
    
    // 새 가용 시간 슬롯 생성
    const newSlot = {
      id: availabilitySlots.length + 1,
      date: formattedDate,
      startTime,
      endTime,
      type: slotType,
      maxParticipants: slotType === '1:1' ? 1 : maxParticipants,
      price,
      booked: false
    };
    
    // 슬롯 추가 (실제로는 API 호출)
    setAvailabilitySlots([...availabilitySlots, newSlot]);
    setAddSlotDialogOpen(false);
    
    // 폼 초기화
    setDate(new Date());
    setStartTime('10:00');
    setEndTime('11:00');
    setSlotType('1:1');
    setMaxParticipants(1);
    setPrice(30000);
  };
  
  const handleDeleteSlot = (slotId: number) => {
    // 슬롯 삭제 (실제로는 API 호출)
    setAvailabilitySlots(availabilitySlots.filter(slot => slot.id !== slotId));
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">예약 및 일정 관리</h1>
      
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="relative">
            대기 중인 예약
            {pendingReservations.length > 0 && (
              <Badge className="ml-2 bg-orange-500">{pendingReservations.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="upcoming">예정된 예약</TabsTrigger>
          <TabsTrigger value="availability">가용 시간 관리</TabsTrigger>
          <TabsTrigger value="completed">완료된 예약</TabsTrigger>
        </TabsList>
        
        {/* 대기 중인 예약 탭 */}
        <TabsContent value="pending" className="space-y-4">
          {pendingReservations.length > 0 ? (
            pendingReservations.map((reservation) => (
              <Card key={reservation.id} className="p-5 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 mb-4 md:mb-0 flex items-start">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                      <img
                        src={reservation.studentAvatar}
                        alt={reservation.studentName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{reservation.studentName}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">반려견: {reservation.petName}</p>
                    </div>
                  </div>
                  
                  <div className="md:w-2/4 mb-4 md:mb-0">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm">{reservation.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm">{reservation.time}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm">{reservation.type}</span>
                      </div>
                      <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">
                        "{reservation.requestMessage}"
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-1/4 flex flex-col justify-between md:items-end">
                    <div className="flex space-x-2 mb-3">
                      <Button variant="outline" size="sm" onClick={() => handleSendMessage(reservation.studentName)}>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        메시지
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleRejectReservation(reservation.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        거절
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleAcceptReservation(reservation.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        승인
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">대기 중인 예약이 없습니다.</p>
            </div>
          )}
        </TabsContent>
        
        {/* 예정된 예약 탭 */}
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingReservations.length > 0 ? (
            upcomingReservations.map((reservation) => (
              <Card key={reservation.id} className="p-5 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 mb-4 md:mb-0 flex items-start">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                      <img
                        src={reservation.studentAvatar}
                        alt={reservation.studentName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{reservation.studentName}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">반려견: {reservation.petName}</p>
                    </div>
                  </div>
                  
                  <div className="md:w-2/4 mb-4 md:mb-0">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm">{reservation.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm">{reservation.time}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm">{reservation.type}</span>
                      </div>
                      {reservation.notes && (
                        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">
                          <span className="font-medium">메모:</span> {reservation.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="md:w-1/4 flex flex-col justify-between md:items-end">
                    <div className="flex space-x-2 mb-3">
                      <Button variant="outline" size="sm" onClick={() => handleSendMessage(reservation.studentName)}>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        메시지
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditReservation(reservation)}
                      >
                        수정
                      </Button>
                    </div>
                    <Button 
                      className="mt-2" 
                      size="sm"
                      onClick={() => handleJoinMeeting(reservation.meetingId)}
                    >
                      <Video className="h-4 w-4 mr-1" />
                      수업 시작
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">예정된 예약이 없습니다.</p>
            </div>
          )}
        </TabsContent>
        
        {/* 가용 시간 관리 탭 */}
        <TabsContent value="availability" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">나의 가용 시간</h2>
            <Button onClick={() => setAddSlotDialogOpen(true)}>
              가용 시간 추가
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availabilitySlots.map((slot) => (
              <Card key={slot.id} className={cn(
                "p-4 relative", 
                slot.booked ? "border-primary border-opacity-50" : "border-gray-200 dark:border-gray-700"
              )}>
                {slot.booked && (
                  <Badge className="absolute top-2 right-2 bg-primary">예약됨</Badge>
                )}
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                    <span>{slot.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                    <span>{slot.startTime} - {slot.endTime}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                    <span>{slot.type} {slot.type === '그룹' && `(최대 ${slot.maxParticipants}명)`}</span>
                  </div>
                  <div className="flex items-center font-medium text-primary">
                    {slot.price.toLocaleString()}원
                  </div>
                  
                  {!slot.booked && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2" 
                      onClick={() => handleDeleteSlot(slot.id)}
                    >
                      삭제
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
          
          {availabilitySlots.length === 0 && (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">등록된 가용 시간이 없습니다.</p>
            </div>
          )}
        </TabsContent>
        
        {/* 완료된 예약 탭 */}
        <TabsContent value="completed" className="space-y-4">
          {completedReservations.length > 0 ? (
            completedReservations.map((reservation) => (
              <Card key={reservation.id} className="p-5 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 mb-4 md:mb-0 flex items-start">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                      <img
                        src={reservation.studentAvatar}
                        alt={reservation.studentName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{reservation.studentName}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">반려견: {reservation.petName}</p>
                    </div>
                  </div>
                  
                  <div className="md:w-2/4 mb-4 md:mb-0">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm">{reservation.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm">{reservation.time}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm">{reservation.type}</span>
                      </div>
                      
                      {reservation.feedback && (
                        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">
                          <div className="flex items-center mb-1">
                            <span className="font-medium mr-2">학생 피드백:</span>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, index) => (
                                <div key={index} className={`text-${index < reservation.rating ? 'yellow' : 'gray'}-500`}>★</div>
                              ))}
                            </div>
                          </div>
                          "{reservation.feedback}"
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="md:w-1/4 flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => handleSendMessage(reservation.studentName)}>
                      <MessageSquare className="h-4 w-4 mr-1" />
                      메시지
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">완료된 예약이 없습니다.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* 가용 시간 추가 다이얼로그 */}
      <Dialog open={addSlotDialogOpen} onOpenChange={setAddSlotDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>가용 시간 추가</DialogTitle>
            <DialogDescription>
              학생들이 예약할 수 있는 가용 시간을 추가합니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">날짜</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP', { locale: ko }) : <span>날짜 선택</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime">시작 시간</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="시작 시간" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="endTime">종료 시간</Label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="종료 시간" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">수업 유형</Label>
              <Select value={slotType} onValueChange={setSlotType}>
                <SelectTrigger>
                  <SelectValue placeholder="수업 유형" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1:1">1:1 상담</SelectItem>
                  <SelectItem value="그룹">그룹 훈련</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {slotType === '그룹' && (
              <div className="grid gap-2">
                <Label htmlFor="maxParticipants">최대 참가자 수</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  min="2"
                  max="20"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
                />
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="price">가격 (원)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value))}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" onClick={handleAddAvailabilitySlot}>추가하기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 예약 수정 다이얼로그 */}
      <Dialog open={editReservationDialogOpen} onOpenChange={setEditReservationDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>예약 정보 수정</DialogTitle>
            <DialogDescription>
              예약 정보 및 메모를 수정합니다.
            </DialogDescription>
          </DialogHeader>
          
          {selectedReservation && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>학생 정보</Label>
                <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <img
                      src={selectedReservation.studentAvatar}
                      alt={selectedReservation.studentName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{selectedReservation.studentName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">반려견: {selectedReservation.petName}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label>날짜 및 시간</Label>
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                    <span>{selectedReservation.date}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                    <span>{selectedReservation.time}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="meetingId">미팅 ID</Label>
                <Input
                  id="meetingId"
                  defaultValue={selectedReservation.meetingId}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="notes">메모</Label>
                <textarea
                  id="notes"
                  rows={3}
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-background"
                  defaultValue={selectedReservation.notes}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button type="submit">저장하기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}