import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, Users, Video, User, MessageSquare, Lock } from 'lucide-react';
import { useAuth } from '@/SimpleApp';
import { useLocation } from 'wouter';

export default function VideoCall() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  // 로그인 여부 검사하여 비로그인 상태면 로그인 페이지로 리디렉션
  useEffect(() => {
    const storedAuth = localStorage.getItem('petedu_auth');
    const isLoggedIn = !!storedAuth;
    
    if (!isLoggedIn) {
      console.log("VideoCall: 비로그인 상태 - 로그인 페이지로 리디렉션");
      // 현재 URL에 redirect 파라미터로 추가하여 리디렉션
      const currentPath = window.location.pathname + window.location.search;
      setLocation(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [setLocation]);
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
