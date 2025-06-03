
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Star, User, Phone, Mail, MapPin, Award, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Consultation {
  id: number;
  trainerId: number;
  trainerName: string;
  trainerAvatar: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date: string;
  time: string;
  type: string;
  petName: string;
  message: string;
  createdAt: string;
}

interface Trainer {
  id: number;
  name: string;
  avatar: string;
  specialty: string[];
  rating: number;
  reviewCount: number;
  location: string;
  experience: string;
  availableSlots: string[];
  price: number;
  description: string;
}

export default function ConsultationPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('book');
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 폼 상태
  const [bookingForm, setBookingForm] = useState({
    petName: '',
    petAge: '',
    petBreed: '',
    consultationType: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    fetchTrainers();
    if (user) {
      fetchMyConsultations();
    }
  }, [user]);

  const fetchTrainers = async () => {
    try {
      // 목업 데이터
      const mockTrainers: Trainer[] = [
        {
          id: 1,
          name: '김민수 전문 훈련사',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
          specialty: ['행동교정', '기본훈련', '소형견전문'],
          rating: 4.8,
          reviewCount: 127,
          location: '서울시 강남구',
          experience: '5년',
          availableSlots: ['09:00', '10:00', '14:00', '15:00', '16:00'],
          price: 50000,
          description: '반려견 행동교정 전문가로 5년간 300마리 이상의 강아지를 훈련시킨 경험이 있습니다.'
        },
        {
          id: 2,
          name: '박지연 훈련사',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b494?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
          specialty: ['소형견전문', '사회화훈련', '퍼피클래스'],
          rating: 4.9,
          reviewCount: 89,
          location: '서울시 송파구',
          experience: '3년',
          availableSlots: ['10:00', '11:00', '13:00', '15:00', '17:00'],
          price: 45000,
          description: '소형견 전문 훈련사로 특히 퍼피 클래스와 사회화 훈련에 특화되어 있습니다.'
        }
      ];
      setTrainers(mockTrainers);
    } catch (error) {
      console.error('훈련사 목록 조회 오류:', error);
    }
  };

  const fetchMyConsultations = async () => {
    try {
      const response = await fetch('/api/consultations/my-requests');
      const result = await response.json();
      
      if (result.success) {
        setConsultations(result.consultations);
      }
    } catch (error) {
      console.error('상담 목록 조회 오류:', error);
    }
  };

  const handleBookConsultation = async () => {
    if (!selectedTrainer) return;

    setLoading(true);
    try {
      const response = await fetch('/api/consultation/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trainerId: selectedTrainer.id,
          trainerName: selectedTrainer.name,
          ...bookingForm
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('상담 신청이 완료되었습니다. 곧 연락드리겠습니다.');
        setIsBookingDialogOpen(false);
        setBookingForm({
          petName: '',
          petAge: '',
          petBreed: '',
          consultationType: '',
          preferredDate: '',
          preferredTime: '',
          message: '',
          phone: '',
          email: ''
        });
        fetchMyConsultations();
      } else {
        alert('상담 신청에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('상담 신청 오류:', error);
      alert('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConsultation = async (consultationId: number) => {
    if (!confirm('상담을 취소하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/consultations/${consultationId}/cancel`, {
        method: 'POST',
      });

      const result = await response.json();

      if (result.success) {
        alert('상담이 취소되었습니다.');
        fetchMyConsultations();
      } else {
        alert('상담 취소에 실패했습니다.');
      }
    } catch (error) {
      console.error('상담 취소 오류:', error);
      alert('네트워크 오류가 발생했습니다.');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: '대기중', variant: 'secondary' as const },
      confirmed: { label: '확정', variant: 'default' as const },
      completed: { label: '완료', variant: 'outline' as const },
      cancelled: { label: '취소', variant: 'destructive' as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">전문가 상담</h1>
        <p className="text-gray-600">반려동물 전문가와 1:1 상담을 받아보세요</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="book">상담 예약</TabsTrigger>
          <TabsTrigger value="my-consultations">내 상담</TabsTrigger>
        </TabsList>

        <TabsContent value="book" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trainers.map((trainer) => (
              <Card key={trainer.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={trainer.avatar} alt={trainer.name} />
                      <AvatarFallback>{trainer.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{trainer.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{trainer.rating}</span>
                        <span className="text-sm text-gray-500">({trainer.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {trainer.specialty.map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {trainer.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="h-4 w-4" />
                      경력 {trainer.experience}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{trainer.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">{trainer.price.toLocaleString()}원</span>
                    <Dialog open={isBookingDialogOpen && selectedTrainer?.id === trainer.id} onOpenChange={setIsBookingDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={() => setSelectedTrainer(trainer)}>상담 신청</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>상담 신청 - {trainer.name}</DialogTitle>
                          <DialogDescription>
                            상담 정보를 입력해주세요. 확인 후 연락드리겠습니다.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="petName">반려동물 이름</Label>
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
                                placeholder="예: 2년 3개월"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="petBreed">품종</Label>
                            <Input
                              id="petBreed"
                              value={bookingForm.petBreed}
                              onChange={(e) => setBookingForm({...bookingForm, petBreed: e.target.value})}
                              placeholder="품종을 입력하세요"
                            />
                          </div>
                          <div>
                            <Label htmlFor="consultationType">상담 유형</Label>
                            <Select value={bookingForm.consultationType} onValueChange={(value) => setBookingForm({...bookingForm, consultationType: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="상담 유형을 선택하세요" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="behavior">행동 교정</SelectItem>
                                <SelectItem value="basic">기본 훈련</SelectItem>
                                <SelectItem value="socialization">사회화</SelectItem>
                                <SelectItem value="health">건강 상담</SelectItem>
                                <SelectItem value="nutrition">영양 상담</SelectItem>
                                <SelectItem value="other">기타</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="preferredDate">희망 날짜</Label>
                              <Input
                                id="preferredDate"
                                type="date"
                                value={bookingForm.preferredDate}
                                onChange={(e) => setBookingForm({...bookingForm, preferredDate: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="preferredTime">희망 시간</Label>
                              <Select value={bookingForm.preferredTime} onValueChange={(value) => setBookingForm({...bookingForm, preferredTime: value})}>
                                <SelectTrigger>
                                  <SelectValue placeholder="시간 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                  {trainer.availableSlots.map((slot) => (
                                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="phone">연락처</Label>
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
                          <div>
                            <Label htmlFor="message">상담 내용</Label>
                            <Textarea
                              id="message"
                              value={bookingForm.message}
                              onChange={(e) => setBookingForm({...bookingForm, message: e.target.value})}
                              placeholder="상담받고 싶은 내용을 자세히 적어주세요"
                              rows={4}
                            />
                          </div>
                          <div className="flex gap-2 pt-4">
                            <Button onClick={() => setIsBookingDialogOpen(false)} variant="outline" className="flex-1">
                              취소
                            </Button>
                            <Button onClick={handleBookConsultation} disabled={loading} className="flex-1">
                              {loading ? '신청 중...' : '상담 신청'}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-consultations" className="space-y-6">
          {!user ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-600">로그인 후 상담 내역을 확인할 수 있습니다.</p>
                <Button className="mt-4" onClick={() => window.location.href = '/auth/login'}>
                  로그인
                </Button>
              </CardContent>
            </Card>
          ) : consultations.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-600">아직 신청한 상담이 없습니다.</p>
                <Button className="mt-4" onClick={() => setActiveTab('book')}>
                  상담 신청하기
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {consultations.map((consultation) => (
                <Card key={consultation.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={consultation.trainerAvatar} alt={consultation.trainerName} />
                          <AvatarFallback>{consultation.trainerName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <div>
                            <h3 className="font-semibold">{consultation.trainerName}</h3>
                            <p className="text-sm text-gray-600">{consultation.type} 상담</p>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {consultation.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {consultation.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {consultation.petName}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 max-w-md">{consultation.message}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(consultation.status)}
                        {consultation.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelConsultation(consultation.id)}
                          >
                            취소
                          </Button>
                        )}
                        {consultation.status === 'confirmed' && (
                          <Button size="sm">
                            상담 참여
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
