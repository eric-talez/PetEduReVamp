import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle, ArrowLeft, Calendar, Clock, Info, Star, Video, Link as LinkIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

// 상세 화상 수업 정보 가져오기 (실제 구현에서는 API 호출로 대체)
const getVideoClassDetails = (id: number) => {
  const videoClasses = [
    {
      id: 1,
      title: "1:1 맞춤형 반려견 훈련 컨설팅",
      trainer: "김훈련",
      trainerId: 1,
      price: 35000,
      duration: 30,
      rating: 4.8,
      reviews: 128,
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      tags: ["1:1 훈련", "맞춤형", "문제행동"],
      description: "반려견의 문제행동 및 기본 훈련에 대한 1:1 맞춤형 화상 컨설팅 서비스입니다. 전문 훈련사가 당신의 반려견에 맞는 훈련 방법을 제시합니다.",
      availability: "평일 10AM-6PM",
      availableDates: [
        { date: "2025-05-10", slots: ["10:00", "11:00", "14:00", "15:00", "16:00"] },
        { date: "2025-05-11", slots: ["10:00", "11:00", "14:00", "15:00"] },
        { date: "2025-05-12", slots: ["11:00", "14:00", "16:00"] }
      ]
    },
    {
      id: 2,
      title: "그룹 화상 반려견 기초 훈련 클래스",
      trainer: "박훈련",
      trainerId: 2,
      price: 25000,
      duration: 45,
      rating: 4.6,
      reviews: 96,
      image: "https://images.unsplash.com/photo-1541599468348-e96984315921?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      tags: ["그룹 클래스", "기초 훈련", "사회화"],
      description: "최대 5명의 반려인과 함께하는 그룹 화상 훈련 클래스입니다. 기본 복종 훈련과 사회화 훈련을 배울 수 있습니다.",
      availability: "주말 클래스",
      availableDates: [
        { date: "2025-05-15", slots: ["14:00", "16:00"] },
        { date: "2025-05-16", slots: ["14:00", "16:00"] },
        { date: "2025-05-17", slots: ["10:00", "14:00"] }
      ]
    },
    // 다른 클래스 정보...
  ];

  return videoClasses.find(c => c.id === id);
};

export default function VideoClassReservePage() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [classId, setClassId] = useState<number | null>(null);
  const [videoClass, setVideoClass] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reservationStep, setReservationStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [connectionMethod, setConnectionMethod] = useState<'system' | 'personal'>('system');
  const [zoomMeetingLink, setZoomMeetingLink] = useState<string>("");

  useEffect(() => {
    // URL에서 ID 파싱 (실제 구현에서는 React Router 또는 다른 라우팅 라이브러리 사용)
    const pathParts = window.location.pathname.split('/');
    const id = parseInt(pathParts[pathParts.length - 1]);
    
    if (!isNaN(id)) {
      setClassId(id);
      const details = getVideoClassDetails(id);
      if (details) {
        setVideoClass(details);
      } else {
        // 존재하지 않는 클래스 ID인 경우
        setLocation('/video-call');
      }
    } else {
      // 잘못된 URL인 경우
      setLocation('/video-call');
    }

    // 로그인 상태를 확인하지만 비로그인 상태로도 계속 진행 가능
    console.log('예약 페이지 접근: 로그인 상태 =', isAuthenticated ? '로그인됨' : '비로그인');
  }, [isAuthenticated, setLocation]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  // 연결 방식 변경 핸들러
  const handleConnectionMethodChange = (value: string) => {
    setConnectionMethod(value as 'system' | 'personal');
  };
  
  // 줌 링크 변경 핸들러
  const handleZoomLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setZoomMeetingLink(event.target.value);
  };

  const handleContinue = () => {
    if (reservationStep === 1 && selectedDate && selectedTime) {
      setReservationStep(2);
    } else if (reservationStep === 2) {
      // 결제 처리 로직
      setLoading(true);
      
      // 결제 시뮬레이션
      setTimeout(() => {
        setLoading(false);
        setReservationStep(3);
      }, 1500);
    }
  };

  // 예약 시 비로그인 상태인 경우 로그인 안내 표시
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <div className="flex items-center space-x-2 text-amber-500">
              <AlertCircle className="h-6 w-6" />
              <CardTitle>로그인 필요</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>화상 수업 예약을 위해서는 로그인이 필요합니다.</p>
            <p className="mt-2 text-gray-500">로그인 페이지로 이동하시려면 아래 버튼을 클릭해주세요.</p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => window.location.href = '/auth'}
            >
              로그인 페이지로 이동
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!videoClass) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>클래스 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="outline" 
        className="mb-6" 
        onClick={() => setLocation('/video-call')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        화상 수업 목록으로 돌아가기
      </Button>

      {reservationStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <div className="h-48 overflow-hidden">
                <img 
                  src={videoClass.image} 
                  alt={videoClass.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{videoClass.title}</CardTitle>
                <CardDescription className="flex items-center">
                  <span>{videoClass.trainer} 훈련사</span>
                  <div className="flex items-center ml-auto">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                    <span>{videoClass.rating} ({videoClass.reviews})</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-2">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{videoClass.duration}분</span>
                </div>
                <div className="flex items-center mb-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{videoClass.availability}</span>
                </div>
                <div className="text-lg font-bold text-primary">
                  {videoClass.price.toLocaleString()}원
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>수업 일정 선택</CardTitle>
                <CardDescription>
                  원하시는 날짜와 시간을 선택해주세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">날짜 선택</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {videoClass.availableDates.map((dateInfo: any) => (
                      <Button
                        key={dateInfo.date}
                        variant={selectedDate === dateInfo.date ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => handleDateSelect(dateInfo.date)}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {new Date(dateInfo.date).toLocaleDateString('ko-KR', {
                          month: 'long',
                          day: 'numeric',
                          weekday: 'short'
                        })}
                      </Button>
                    ))}
                  </div>
                </div>

                {selectedDate && (
                  <div>
                    <h3 className="text-lg font-medium mb-3">시간 선택</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {videoClass.availableDates
                        .find((d: any) => d.date === selectedDate)
                        ?.slots.map((time: string) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            onClick={() => handleTimeSelect(time)}
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            {time}
                          </Button>
                        ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-medium mb-3">연결 방식 선택</h3>
                  <Tabs defaultValue="system" onValueChange={handleConnectionMethodChange}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="system">시스템 화상 연결</TabsTrigger>
                      <TabsTrigger value="personal">개인 줌 링크 사용</TabsTrigger>
                    </TabsList>
                    <TabsContent value="system">
                      <div className="p-4 bg-muted/40 rounded-md">
                        <div className="flex items-start">
                          <Video className="h-5 w-5 text-primary mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">내장 화상 시스템 사용</p>
                            <p className="text-sm text-muted-foreground">내장된 화상 회의 시스템을 통해 수업을 진행합니다. 별도의 앱 설치가 필요하지 않습니다.</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="personal">
                      <div className="p-4 bg-muted/40 rounded-md">
                        <div className="flex items-start mb-4">
                          <LinkIcon className="h-5 w-5 text-primary mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">개인 줌 회의 링크 사용</p>
                            <p className="text-sm text-muted-foreground">본인의 Zoom 회의 링크를 사용하여 수업을 진행합니다.</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zoom-link">줌 회의 링크</Label>
                          <Input 
                            id="zoom-link" 
                            placeholder="https://zoom.us/j/123456789" 
                            value={zoomMeetingLink} 
                            onChange={handleZoomLinkChange}
                          />
                          <p className="text-xs text-muted-foreground">예: https://zoom.us/j/123456789</p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline" onClick={() => setLocation('/video-call')}>
                  취소
                </Button>
                <Button 
                  disabled={!selectedDate || !selectedTime || (connectionMethod === 'personal' && !zoomMeetingLink)}
                  onClick={handleContinue}
                >
                  다음 단계
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}

      {reservationStep === 2 && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>결제 정보</CardTitle>
              <CardDescription>
                수업 예약을 완료하기 위해 결제 정보를 확인해주세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-b pb-4 mb-4">
                <h3 className="font-medium mb-2">예약 정보</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">수업명</p>
                    <p className="font-medium">{videoClass.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">훈련사</p>
                    <p className="font-medium">{videoClass.trainer} 훈련사</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">날짜</p>
                    <p className="font-medium">{new Date(selectedDate!).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      weekday: 'long'
                    })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">시간</p>
                    <p className="font-medium">{selectedTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">수업 시간</p>
                    <p className="font-medium">{videoClass.duration}분</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">연결 방식</p>
                    <p className="font-medium">{connectionMethod === 'system' ? '내장 화상 시스템' : '개인 줌 링크'}</p>
                  </div>
                  {connectionMethod === 'personal' && (
                    <div className="col-span-1 sm:col-span-2">
                      <p className="text-sm text-gray-500">입력한 줌 링크</p>
                      <p className="font-medium break-all">{zoomMeetingLink}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-b pb-4 mb-4">
                <h3 className="font-medium mb-2">결제 금액</h3>
                <div className="flex justify-between items-center">
                  <span>수업 금액</span>
                  <span className="font-medium">{videoClass.price.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between items-center mt-2 text-green-600">
                  <span>할인</span>
                  <span>- 0원</span>
                </div>
                <div className="flex justify-between items-center mt-4 font-bold text-lg">
                  <span>최종 결제 금액</span>
                  <span className="text-primary">{videoClass.price.toLocaleString()}원</span>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg flex gap-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <p>결제 완료 후 예약 확정 이메일이 발송됩니다. 수업 시작 10분 전에 입장 링크가 담긴 알림을 받게 됩니다.</p>
                  <p className="mt-1">수업 시작 10분 전까지 취소 시 100% 환불이 가능하며, 그 이후에는 취소 및 환불이 불가능합니다.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline" onClick={() => setReservationStep(1)}>
                이전 단계
              </Button>
              <Button 
                onClick={handleContinue}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                    처리 중...
                  </>
                ) : '결제하기'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {reservationStep === 3 && (
        <div className="max-w-md mx-auto">
          <Card className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-green-700 dark:text-green-300 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                예약이 완료되었습니다!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="mb-4">
                  {videoClass.trainer} 훈련사와의 화상 수업이 예약되었습니다. 
                  예약 확인 이메일이 발송되었으니 확인해주세요.
                </p>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">수업명</p>
                      <p className="font-medium">{videoClass.title}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">날짜 및 시간</p>
                      <p className="font-medium">{new Date(selectedDate!).toLocaleDateString('ko-KR', {
                        month: 'long',
                        day: 'numeric'
                      })} {selectedTime}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                  <Video className="h-4 w-4" />
                  <span className="text-sm">화상 수업 입장 링크는 수업 시작 10분 전에 이메일과 알림으로 발송됩니다.</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => setLocation('/video-call')}
              >
                화상 수업 목록으로 돌아가기
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}