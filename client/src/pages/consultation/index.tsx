import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MessageSquare, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConsultationRequest {
  id: number;
  trainerId: number;
  trainerName: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date: string;
  time: string;
  type: string;
  petName: string;
  message: string;
  createdAt: string;
}

export default function ConsultationPage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const response = await fetch('/api/consultations/my-requests');
      if (response.ok) {
        const data = await response.json();
        setConsultations(data.consultations || []);
      }
    } catch (error) {
      console.error('상담 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConsultation = async (consultationId: number) => {
    try {
      const response = await fetch(`/api/consultations/${consultationId}/cancel`, {
        method: 'POST'
      });
      
      if (response.ok) {
        toast({
          title: "상담 취소 완료",
          description: "상담이 성공적으로 취소되었습니다.",
        });
        fetchConsultations();
      } else {
        throw new Error('취소 실패');
      }
    } catch (error) {
      toast({
        title: "취소 실패",
        description: "상담 취소 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: '대기중', variant: 'secondary' as const },
      confirmed: { label: '확정', variant: 'success' as const },
      completed: { label: '완료', variant: 'outline' as const },
      cancelled: { label: '취소', variant: 'danger' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    
    return (
      <Badge variant={statusInfo.variant}>
        {statusInfo.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg">상담 정보를 불러오는 중입니다...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">내 상담 현황</h1>
        <p className="text-muted-foreground">신청한 상담의 진행 상황을 확인하세요</p>
      </div>

      <div className="mb-6">
        <Button onClick={() => setLocation('/video-call/reserve')}>
          새 상담 신청
        </Button>
      </div>

      {consultations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">신청한 상담이 없습니다</h3>
            <p className="text-muted-foreground mb-4">
              전문 훈련사와의 상담을 신청해보세요
            </p>
            <Button onClick={() => setLocation('/video-call/reserve')}>
              상담 신청하기
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {consultations.map((consultation) => (
            <Card key={consultation.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {consultation.trainerName}
                  </CardTitle>
                  {getStatusBadge(consultation.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>희망 날짜: {consultation.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>희망 시간: {consultation.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      <span>상담 유형: {consultation.type}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">상담 내용</h4>
                      <p className="text-sm text-muted-foreground">
                        {consultation.message}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t">
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
                      화상 상담 입장
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    상세 보기
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}