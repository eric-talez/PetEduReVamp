import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, Users, Video, User, MessageSquare, Lock, Check, Info } from 'lucide-react';
import { useAuth } from '@/SimpleApp';
import { useLocation } from 'wouter';

export default function VideoCall() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [trainerId, setTrainerId] = useState<string | null>(null);
  const [showReservationSuccess, setShowReservationSuccess] = useState(false);
  const [isReservationMode, setIsReservationMode] = useState(false);
  
  // URL 파라미터에서 훈련사 ID 가져오기
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const trainerParam = params.get('trainer');
    if (trainerParam) {
      setTrainerId(trainerParam);
      setIsReservationMode(true);
    }
  }, []);
  
  // 로그인 여부 검사 - 비로그인 상태에서는 리디렉션하지 않고 예약 모드로 전환
  useEffect(() => {
    const storedAuth = localStorage.getItem('petedu_auth');
    const isLoggedIn = !!storedAuth;
    
    // trainer 파라미터가 있을 때는 예약 UI를 표시하므로 리디렉션하지 않음
    if (!isLoggedIn && !trainerId) {
      console.log("VideoCall: 비로그인 상태이며 trainer 파라미터 없음 - 로그인 페이지로 리디렉션");
      // 현재 URL에 redirect 파라미터로 추가하여 리디렉션
      const currentPath = window.location.pathname + window.location.search;
      setLocation(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [setLocation, trainerId]);
  const [meetingId, setMeetingId] = useState<string>('');
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([
    {
      id: 1,
      title: '반려견 기초 훈련 1단계',
      date: '2025년 5월 7일',
      time: '오후 3:00 - 4:00',
      trainer: '김훈련 트레이너',
      participants: 3,
      meetingId: 'zoom-123456789',
      status: 'scheduled'
    },
    {
      id: 2,
      title: '문제행동 교정 특별 강의',
      date: '2025년 5월 9일',
      time: '오전 11:00 - 12:00',
      trainer: '박교정 트레이너',
      participants: 5,
      meetingId: 'zoom-987654321',
      status: 'scheduled'
    }
  ]);

  const [pastClasses, setPastClasses] = useState<any[]>([
    {
      id: 3,
      title: '반려견 사회화 훈련',
      date: '2025년 5월 1일',
      time: '오후 2:00 - 3:00',
      trainer: '이사회 트레이너',
      recording: 'https://example.com/recording1',
      status: 'completed'
    }
  ]);

  const joinMeeting = (meetingId: string) => {
    setIsJoining(true);
    // ZOOM SDK를 통한 미팅 참여 구현 (실제 프로덕션에서는 ZOOM SDK 통합 필요)
    console.log(`Joining meeting: ${meetingId}`);
    
    // 실제로는 여기서 ZOOM SDK의 joinMeeting 함수를 호출해야 함
    setTimeout(() => {
      // 테스트용 지연 - 실제로는 SDK 완료 콜백에서 처리
      window.open(`https://zoom.us/j/${meetingId}`, '_blank');
      setIsJoining(false);
    }, 1500);
  };

  // 훈련사 예약 처리 함수
  const handleReservation = () => {
    console.log(`훈련사 ID: ${trainerId}에게 상담 예약 요청`);
    // 여기서 실제 API 호출 등의 로직 추가
    
    // 예약 성공 UI 표시
    setShowReservationSuccess(true);
    
    // 3초 후 메인 페이지로 리디렉션
    setTimeout(() => {
      setLocation('/');
    }, 3000);
  };
  
  // 로그인 버튼 클릭 처리
  const handleLogin = () => {
    const currentPath = window.location.pathname + window.location.search;
    setLocation(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
  };
  
  // 훈련사 예약 모드 UI
  if (isReservationMode && !showReservationSuccess) {
    // 모의 훈련사 데이터 (실제로는 API에서 가져와야 함)
    const trainerData = {
      id: trainerId,
      name: trainerId === '1' ? '김훈련' : 
            trainerId === '2' ? '박민첩' : 
            trainerId === '3' ? '이사회' : 
            trainerId === '4' ? '최행동' : '알 수 없는 훈련사',
      avatar: `https://images.unsplash.com/photo-160799028151${trainerId}-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200`,
      specialty: '반려견 기본 훈련',
      rating: 4.9
    };
    
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">화상 상담 예약</h1>
        
        <Card className="p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-3 border-2 border-primary">
                <img 
                  src={`https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200`} 
                  alt={trainerData.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">{trainerData.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{trainerData.specialty}</p>
              <div className="flex items-center">
                <div className="text-yellow-500">★</div>
                <span className="ml-1 text-gray-700 dark:text-gray-300">{trainerData.rating}</span>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <h2 className="text-xl font-semibold mb-4">상담 예약 정보</h2>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">예약 가능 시간</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Button size="sm" variant="outline" className="text-xs">오늘 14:00</Button>
                  <Button size="sm" variant="outline" className="text-xs">오늘 16:00</Button>
                  <Button size="sm" variant="outline" className="text-xs">내일 10:00</Button>
                  <Button size="sm" variant="outline" className="text-xs">내일 13:00</Button>
                  <Button size="sm" variant="outline" className="text-xs">내일 15:00</Button>
                  <Button size="sm" variant="outline" className="text-xs">모레 11:00</Button>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">상담 요금</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span>30분 상담</span>
                    <span className="font-semibold">30,000원</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>60분 상담</span>
                    <span className="font-semibold">50,000원</span>
                  </div>
                  <div className="text-gray-500 text-sm mt-2">
                    * 상담 예약 후 24시간 이내 취소 시 환불이 불가능합니다.
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button 
                  className="flex-1" 
                  onClick={handleReservation}
                >
                  예약하기
                </Button>
                <Button 
                  className="flex-1" 
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  뒤로 가기
                </Button>
              </div>
              
              {!isAuthenticated && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800 flex items-start">
                  <Info className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-amber-800 dark:text-amber-200 text-sm">
                      로그인 후 예약하시면 마이페이지에서 예약 내역을 확인하고 관리할 수 있습니다.
                    </p>
                    <Button size="sm" variant="link" className="text-amber-600 dark:text-amber-400 p-0 mt-1" onClick={handleLogin}>
                      로그인하기
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }
  
  // 예약 성공 UI
  if (showReservationSuccess) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold mb-2">예약이 완료되었습니다!</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
          상담 예약이 성공적으로 접수되었습니다. 훈련사의 확인 후 예약이 확정됩니다.
          잠시 후 메인 페이지로 이동합니다.
        </p>
        <Button onClick={() => setLocation('/')}>
          홈으로 돌아가기
        </Button>
      </div>
    );
  }
  
  // 일반 화상 훈련 페이지 UI
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">화상 훈련</h1>
      
      {/* 빠른 참여 섹션 */}
      <Card className="p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Video className="mr-2 h-5 w-5 text-primary" />
          빠른 미팅 참여
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Input 
            placeholder="Zoom 미팅 ID 입력"
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
            className="flex-grow"
          />
          <Button 
            onClick={() => joinMeeting(meetingId)}
            disabled={!meetingId || isJoining}
            className="min-w-[120px]"
          >
            {isJoining ? '연결 중...' : '참여하기'}
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          훈련사가 제공한 미팅 ID를 입력하여 바로 화상 훈련에 참여하세요.
        </p>
      </Card>
      
      {/* 예정된 강의 섹션 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">예정된 화상 훈련</h2>
        
        <div className="space-y-4">
          {upcomingClasses.length > 0 ? (
            upcomingClasses.map((classItem) => (
              <Card key={classItem.id} className="p-5 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{classItem.title}</h3>
                    <div className="flex flex-col sm:flex-row sm:gap-6 text-sm text-gray-600 dark:text-gray-400 mt-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {classItem.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {classItem.time}
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        {classItem.trainer}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        참여자 {classItem.participants}명
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex space-x-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                      onClick={() => window.location.href = `/messages?trainer=${encodeURIComponent(classItem.trainer)}`}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      메시지
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => joinMeeting(classItem.meetingId)}
                      disabled={isJoining}
                    >
                      {isJoining ? '연결 중...' : '참여하기'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">예정된 화상 훈련이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* 지난 강의 섹션 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">지난 화상 훈련</h2>
        
        <div className="space-y-4">
          {pastClasses.length > 0 ? (
            pastClasses.map((classItem) => (
              <Card key={classItem.id} className="p-5 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{classItem.title}</h3>
                    <div className="flex flex-col sm:flex-row sm:gap-6 text-sm text-gray-600 dark:text-gray-400 mt-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {classItem.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {classItem.time}
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        {classItem.trainer}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(classItem.recording, '_blank')}
                    >
                      녹화 영상 보기
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">지난 화상 훈련 기록이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
