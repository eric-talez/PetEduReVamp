import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Video, MessageCircle, Phone, User, CheckCircle, AlertCircle, Send } from "lucide-react";

interface Consultation {
  id: string;
  trainerName: string;
  petName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  type: 'video' | 'phone' | 'in-person';
  topic: string;
  notes?: string;
}

export default function ConsultationStatusPage() {
  const { toast } = useToast();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  
  // 예약 폼 상태
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [consultationType, setConsultationType] = useState<'video' | 'phone' | 'in-person'>('video');
  const [bookingForm, setBookingForm] = useState({
    petName: '',
    petAge: '',
    petBreed: '',
    concerns: '',
    phone: '',
    email: '',
    notes: ''
  });

  useEffect(() => {
    // 임시 데이터 로딩
    setTimeout(() => {
      setConsultations([
        {
          id: '1',
          trainerName: '김훈련사',
          petName: '멍멍이',
          date: '2024-06-20',
          time: '14:00',
          status: 'scheduled',
          type: 'video',
          topic: '기본 복종 훈련 상담'
        },
        {
          id: '2',
          trainerName: '박전문가',
          petName: '멍멍이',
          date: '2024-06-15',
          time: '10:00',
          status: 'completed',
          type: 'video',
          topic: '분리불안 행동교정',
          notes: '상당한 진전이 있었습니다. 다음 주에 추가 상담 권장.'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Click handlers for consultation functionality
  const handleNewConsultation = () => {
    console.log('새 상담 예약 클릭');
    setShowBooking(true);
  };

  const handleViewDetails = (consultation: Consultation) => {
    console.log('상담 상세보기 클릭:', consultation.id);
    setSelectedConsultation(consultation);
    setShowDetails(true);
  };

  const handleJoinConsultation = (consultation: Consultation) => {
    console.log('상담 참여하기 클릭:', consultation.id);
    // 화상상담 참여 로직
    if (consultation.type === 'video') {
      window.open(`/video-call/${consultation.id}`, '_blank');
    } else if (consultation.type === 'phone') {
      alert(`전화상담이 곧 시작됩니다. 연락처: ${consultation.trainerName}`);
    }
  };

  const handleCancelConsultation = (consultationId: string) => {
    console.log('상담 취소 클릭:', consultationId);
    setConsultations(prev => 
      prev.map(c => 
        c.id === consultationId 
          ? { ...c, status: 'cancelled' as const }
          : c
      )
    );
  };

  const handleRescheduleConsultation = (consultationId: string) => {
    console.log('상담 일정 변경 클릭:', consultationId);
    // 일정 변경 모달 또는 페이지로 이동
    setShowBooking(true);
  };

  // 예약 제출 핸들러
  const handleBookingSubmit = async () => {
    if (!selectedTrainer || !selectedDate || !selectedTime || !bookingForm.petName || !bookingForm.phone) {
      toast({
        title: "필수 정보를 입력해주세요",
        description: "훈련사, 날짜, 시간, 반려동물 이름, 연락처는 필수입니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/consultation/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trainerId: selectedTrainer,
          date: selectedDate.toISOString().split('T')[0],
          time: selectedTime,
          type: consultationType,
          ...bookingForm
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "상담 예약 완료",
          description: "상담 예약이 성공적으로 접수되었습니다.",
        });
        
        // 폼 초기화
        setSelectedTrainer('');
        setSelectedDate(undefined);
        setSelectedTime('');
        setBookingForm({
          petName: '',
          petAge: '',
          petBreed: '',
          concerns: '',
          phone: '',
          email: '',
          notes: ''
        });
        setShowBooking(false);
        
        // 상담 목록 새로고침
        // TODO: 실제 API 호출로 상담 목록 업데이트
      } else {
        throw new Error(result.error || '예약 실패');
      }
    } catch (error) {
      toast({
        title: "예약 실패",
        description: "상담 예약 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // 가능한 훈련사 목록
  const availableTrainers = [
    { id: '1', name: '김민수 전문 훈련사', specialty: '기본 훈련' },
    { id: '2', name: '박지혜 펫 트레이너', specialty: '행동 교정' },
    { id: '3', name: '이준호 어질리티 코치', specialty: '어질리티 훈련' },
    { id: '4', name: '최예린 행동분석가', specialty: '분리불안 치료' },
  ];

  // 가능한 시간대
  const availableTimes = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      case 'in-progress': return <Video className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return '예정됨';
      case 'completed': return '완료됨';
      case 'cancelled': return '취소됨';
      case 'in-progress': return '진행중';
      default: return '알 수 없음';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'in-person': return <User className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-gray-600">상담 현황을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">내 상담 현황</h1>
          <p className="text-muted-foreground">전문가와의 상담 일정과 이력을 확인하세요</p>
        </div>
        <Button onClick={() => handleNewConsultation()}>
          <Calendar className="h-4 w-4 mr-2" />
          새 상담 예약
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">예정된 상담</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {consultations.filter(c => c.status === 'scheduled').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">완료된 상담</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {consultations.filter(c => c.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">이번 달 상담</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consultations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">화상 상담</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {consultations.filter(c => c.type === 'video').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 상담 목록 */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="scheduled">예정됨</TabsTrigger>
          <TabsTrigger value="completed">완료됨</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {consultations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">상담 내역이 없습니다</h3>
                <p className="text-muted-foreground text-center mb-4">
                  전문가와의 첫 상담을 예약해보세요!
                </p>
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  상담 예약하기
                </Button>
              </CardContent>
            </Card>
          ) : (
            consultations.map((consultation) => (
              <Card key={consultation.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{consultation.topic}</h3>
                        <Badge className={getStatusColor(consultation.status)}>
                          {getStatusIcon(consultation.status)}
                          <span className="ml-1">{getStatusText(consultation.status)}</span>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {consultation.trainerName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {consultation.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {consultation.time}
                        </div>
                        <div className="flex items-center gap-1">
                          {getTypeIcon(consultation.type)}
                          {consultation.type === 'video' ? '화상상담' : 
                           consultation.type === 'phone' ? '전화상담' : '대면상담'}
                        </div>
                      </div>
                      {consultation.notes && (
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                          {consultation.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {consultation.status === 'scheduled' && consultation.type === 'video' && (
                        <Button size="sm" onClick={() => handleJoinConsultation(consultation)}>
                          <Video className="h-4 w-4 mr-1" />
                          참여하기
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(consultation)}>
                        상세보기
                      </Button>
                      {consultation.status === 'scheduled' && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleRescheduleConsultation(consultation.id)}>
                            수정
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleCancelConsultation(consultation.id)}>
                            취소
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          {consultations.filter(c => c.status === 'scheduled').map((consultation) => (
            <Card key={consultation.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{consultation.topic}</h3>
                      <Badge className="bg-blue-100 text-blue-800">
                        <Clock className="h-4 w-4" />
                        <span className="ml-1">예정됨</span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {consultation.trainerName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {consultation.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {consultation.time}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {consultation.type === 'video' && (
                      <Button size="sm">
                        <Video className="h-4 w-4 mr-1" />
                        참여하기
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      수정
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {consultations.filter(c => c.status === 'completed').map((consultation) => (
            <Card key={consultation.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{consultation.topic}</h3>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <span className="ml-1">완료됨</span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {consultation.trainerName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {consultation.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {consultation.time}
                      </div>
                    </div>
                    {consultation.notes && (
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                        {consultation.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      리뷰 작성
                    </Button>
                    <Button variant="outline" size="sm">
                      재예약
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* 상담 예약 모달 */}
      <Dialog open={showBooking} onOpenChange={setShowBooking}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>새 상담 예약</DialogTitle>
            <DialogDescription>
              전문 훈련사와의 상담을 예약하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* 훈련사 선택 */}
            <div className="space-y-2">
              <Label htmlFor="trainer">훈련사 선택</Label>
              <Select value={selectedTrainer} onValueChange={setSelectedTrainer}>
                <SelectTrigger>
                  <SelectValue placeholder="훈련사를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {availableTrainers.map((trainer) => (
                    <SelectItem key={trainer.id} value={trainer.id}>
                      {trainer.name} - {trainer.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 상담 유형 */}
            <div className="space-y-2">
              <Label>상담 유형</Label>
              <div className="flex gap-4">
                <Button
                  variant={consultationType === 'video' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setConsultationType('video')}
                >
                  <Video className="h-4 w-4 mr-2" />
                  화상상담
                </Button>
                <Button
                  variant={consultationType === 'phone' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setConsultationType('phone')}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  전화상담
                </Button>
                <Button
                  variant={consultationType === 'in-person' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setConsultationType('in-person')}
                >
                  <User className="h-4 w-4 mr-2" />
                  대면상담
                </Button>
              </div>
            </div>

            {/* 날짜 선택 */}
            <div className="space-y-2">
              <Label>날짜 선택</Label>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date() || date.getDay() === 0} // 과거 날짜와 일요일 비활성화
                className="rounded-md border w-full"
              />
            </div>

            {/* 시간 선택 */}
            {selectedDate && (
              <div className="space-y-2">
                <Label>시간 선택</Label>
                <div className="grid grid-cols-4 gap-2">
                  {availableTimes.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className="text-sm"
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* 반려동물 정보 */}
            <div className="space-y-4">
              <h4 className="font-medium">반려동물 정보</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="petName">이름 *</Label>
                  <Input
                    id="petName"
                    value={bookingForm.petName}
                    onChange={(e) => setBookingForm({...bookingForm, petName: e.target.value})}
                    placeholder="반려동물 이름"
                  />
                </div>
                <div>
                  <Label htmlFor="petAge">나이</Label>
                  <Input
                    id="petAge"
                    value={bookingForm.petAge}
                    onChange={(e) => setBookingForm({...bookingForm, petAge: e.target.value})}
                    placeholder="예: 2살"
                  />
                </div>
                <div>
                  <Label htmlFor="petBreed">견종</Label>
                  <Input
                    id="petBreed"
                    value={bookingForm.petBreed}
                    onChange={(e) => setBookingForm({...bookingForm, petBreed: e.target.value})}
                    placeholder="예: 골든리트리버"
                  />
                </div>
              </div>
            </div>

            {/* 상담 내용 */}
            <div className="space-y-2">
              <Label htmlFor="concerns">상담하고 싶은 내용</Label>
              <Textarea
                id="concerns"
                value={bookingForm.concerns}
                onChange={(e) => setBookingForm({...bookingForm, concerns: e.target.value})}
                placeholder="어떤 문제나 궁금한 점이 있으신지 자세히 적어주세요"
                rows={3}
              />
            </div>

            {/* 연락처 정보 */}
            <div className="space-y-4">
              <h4 className="font-medium">연락처 정보</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">전화번호 *</Label>
                  <Input
                    id="phone"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                    placeholder="010-0000-0000"
                  />
                </div>
                <div>
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                    placeholder="example@email.com"
                  />
                </div>
              </div>
            </div>

            {/* 추가 요청사항 */}
            <div className="space-y-2">
              <Label htmlFor="notes">추가 요청사항</Label>
              <Textarea
                id="notes"
                value={bookingForm.notes}
                onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                placeholder="특별한 요청사항이 있으시면 적어주세요"
                rows={2}
              />
            </div>

            {/* 예약 정보 요약 */}
            {selectedTrainer && selectedDate && selectedTime && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">예약 정보 확인</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">훈련사:</span> {availableTrainers.find(t => t.id === selectedTrainer)?.name}</p>
                  <p><span className="font-medium">날짜:</span> {selectedDate.toLocaleDateString('ko-KR')}</p>
                  <p><span className="font-medium">시간:</span> {selectedTime}</p>
                  <p><span className="font-medium">상담방식:</span> {
                    consultationType === 'video' ? '화상상담' :
                    consultationType === 'phone' ? '전화상담' : '대면상담'
                  }</p>
                  <p><span className="font-medium">반려동물:</span> {bookingForm.petName}</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setShowBooking(false)}
            >
              취소
            </Button>
            <Button onClick={handleBookingSubmit}>
              <Send className="h-4 w-4 mr-2" />
              예약 신청
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}