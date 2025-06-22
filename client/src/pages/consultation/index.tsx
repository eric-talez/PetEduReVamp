import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Video, MessageCircle, Phone, User, CheckCircle, AlertCircle } from "lucide-react";

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
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

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
                        <Button size="sm">
                          <Video className="h-4 w-4 mr-1" />
                          참여하기
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        상세보기
                      </Button>
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
    </div>
  );
}