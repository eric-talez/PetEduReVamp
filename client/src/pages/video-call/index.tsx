import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Video, 
  Plus, 
  Monitor, 
  UserPlus,
  Copy,
  Share2
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface Meeting {
  id: string;
  topic: string;
  start_time: string;
  duration: number;
  join_url: string;
  password: string;
  host_key: string;
}

export default function VideoCallPage() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading, userName } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('scheduled');
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [meetingData, setMeetingData] = useState({
    topic: '',
    date: new Date(),
    time: format(new Date(), 'HH:mm'),
    duration: 30,
    agenda: ''
  });
  const [meetingId, setMeetingId] = useState('');
  const [videoClasses, setVideoClasses] = useState<Array<{
    id: string;
    title: string;
    description: string;
    trainerId: number;
    trainerName: string;
    trainerImage: string;
    scheduledTime: string;
    duration: number;
    maxStudents: number;
    currentStudents: number;
    price: number;
    category: string;
    difficulty: string;
    zoomPMI: string;
    zoomPMIPassword: string;
    zoomHostKey: string;
    meetingSetupType: string;
    status: string;
  }>>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "로그인 필요",
        description: "화상 통화 기능을 사용하려면 로그인이 필요합니다.",
        variant: "destructive"
      });
      setLocation('/auth/login');
    } else if (isAuthenticated) {
      // 미팅 목록 가져오기
      fetchMeetings();
      // 화상수업 목록 가져오기
      fetchVideoClasses();
    }
  }, [isLoading, isAuthenticated, setLocation, toast]);

  const fetchMeetings = async () => {
    try {
      const response = await apiRequest('GET', '/api/videocall/my-meetings');
      const data = await response.json();
      
      if (data && data.meetings) {
        setMeetings(data.meetings);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
      toast({
        title: '미팅 목록 가져오기 실패',
        description: '미팅 목록을 가져오는 중 오류가 발생했습니다. 나중에 다시 시도해주세요.',
        variant: 'destructive'
      });
    }
  };

  const fetchVideoClasses = async () => {
    console.log('🎥 fetchVideoClasses 시작');
    try {
      console.log('🎥 API 요청 시작: /api/video-classes');
      
      // apiRequest 대신 직접 fetch 사용하여 문제 해결 시도
      const response = await fetch('/api/video-classes', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include' // 세션 쿠키 포함
      });
      
      console.log('🎥 API 응답 상태:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🎥 API 응답 데이터:', data);
      
      if (data && data.videoClasses) {
        console.log('🎥 화상수업 데이터 설정:', data.videoClasses.length, '개');
        setVideoClasses(data.videoClasses);
      } else {
        console.log('🎥 응답에 videoClasses가 없음:', data);
      }
    } catch (error) {
      console.error('🎥 fetchVideoClasses 오류:', error);
      console.error('🎥 오류 스택:', error instanceof Error ? error.stack : 'No stack');
      toast({
        title: '화상수업 목록 가져오기 실패',
        description: '화상수업 목록을 가져오는 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    }
    console.log('🎥 fetchVideoClasses 완료');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMeetingData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setMeetingData(prev => ({ ...prev, date }));
    }
  };

  const createMeeting = async () => {
    try {
      setIsCreating(true);

      // 날짜와 시간 조합
      const [hours, minutes] = meetingData.time.split(':').map(Number);
      const startTime = new Date(meetingData.date);
      startTime.setHours(hours, minutes, 0, 0);

      const response = await apiRequest('POST', '/api/videocall/create-meeting', {
        topic: meetingData.topic,
        start_time: startTime.toISOString(),
        duration: meetingData.duration,
        agenda: meetingData.agenda
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "미팅 생성 완료",
          description: `"${meetingData.topic}" 미팅이 성공적으로 생성되었습니다.`,
        });
        
        // 폼 초기화
        setMeetingData({
          topic: '',
          date: new Date(),
          time: format(new Date(), 'HH:mm'),
          duration: 30,
          agenda: ''
        });
        
        // 미팅 목록 새로고침
        fetchMeetings();
        
        // 예약된 미팅 탭으로 이동
        setActiveTab('scheduled');
      } else {
        throw new Error(data.error || '미팅 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast({
        title: "미팅 생성 실패",
        description: error instanceof Error ? error.message : "미팅 생성 중 오류가 발생했습니다. 나중에 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const joinMeeting = async () => {
    if (!meetingId.trim()) {
      toast({
        title: "미팅 ID 필요",
        description: "참여할 미팅 ID를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsJoining(true);
      
      // 미팅 ID로 미팅 참여 URL 생성
      const joinUrl = `https://zoom.us/j/${meetingId.replace(/\s/g, '')}`;
      window.open(joinUrl, '_blank');
      
      toast({
        title: "미팅 참여",
        description: "Zoom 미팅에 참여합니다.",
      });
      
      setMeetingId('');
    } catch (error) {
      console.error('Error joining meeting:', error);
      toast({
        title: "미팅 참여 실패",
        description: "미팅 참여 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* 페이지 헤더 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">화상 강의</h1>
        <p className="text-muted-foreground">실시간 화상 강의 및 미팅을 관리하고 참여하세요.</p>
      </div>

      {/* 메인 탭 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scheduled" className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            예약된 미팅
          </TabsTrigger>
          <TabsTrigger value="trainers" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            훈련사 수업
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            미팅 생성
          </TabsTrigger>
        </TabsList>

        {/* 예약된 미팅 탭 */}
        <TabsContent value="scheduled" id="scheduled-tab-content" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>내 예약된 미팅</CardTitle>
              <CardDescription>예약된 미팅 목록을 확인하고 참여할 수 있습니다.</CardDescription>
            </CardHeader>
            <CardContent>
              {meetings.length > 0 ? (
                <div className="space-y-4">
                  {meetings.map((meeting) => (
                    <Card key={meeting.id} className="overflow-hidden">
                      <CardHeader className="bg-muted/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{meeting.topic}</CardTitle>
                            <CardDescription className="mt-1">
                              <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                  <CalendarIcon className="w-4 h-4" />
                                  {format(new Date(meeting.start_time), 'yyyy년 MM월 dd일', { locale: ko })}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {format(new Date(meeting.start_time), 'HH:mm', { locale: ko })}
                                </span>
                                <span>{meeting.duration}분</span>
                              </div>
                            </CardDescription>
                          </div>
                          <Button 
                            onClick={() => window.open(meeting.join_url, '_blank')}
                            className="ml-4"
                            aria-label={`${meeting.topic} 미팅 참여하기`}
                          >
                            <Video className="w-4 h-4 mr-2" /> 참여
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4 pb-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-muted-foreground mb-1">미팅 ID:</p>
                            <p className="font-mono">{meeting.id}</p>
                          </div>
                          {meeting.password && (
                            <div>
                              <p className="font-medium text-muted-foreground mb-1">비밀번호:</p>
                              <p className="font-mono">{meeting.password}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2 border-t bg-muted/30 py-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            navigator.clipboard.writeText(meeting.join_url);
                            toast({
                              title: '복사 완료',
                              description: '미팅 링크가 클립보드에 복사되었습니다.',
                            });
                          }}
                          aria-label={`${meeting.topic} 미팅 링크 복사하기`}
                        >
                          <Copy className="w-4 h-4 mr-1" /> 링크 복사
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          aria-label={`${meeting.topic} 미팅 정보 공유하기`}
                        >
                          <Share2 className="w-4 h-4 mr-1" /> 공유
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">예약된 미팅이 없습니다</h3>
                  <p className="text-muted-foreground mb-4">새로운 미팅을 생성하거나 미팅 ID로 참여해보세요.</p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={() => setActiveTab('create')}>
                      <Plus className="w-4 h-4 mr-2" /> 미팅 생성
                    </Button>
                    <Button variant="outline">
                      <UserPlus className="w-4 h-4 mr-2" /> ID로 참여
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 미팅 ID로 참여 섹션 */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>미팅 ID로 참여</CardTitle>
              <CardDescription>다른 사람의 미팅에 참여하려면 미팅 ID를 입력하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="meetingId">미팅 ID</Label>
                  <Input
                    id="meetingId"
                    value={meetingId}
                    onChange={(e) => setMeetingId(e.target.value)}
                    placeholder="예: 123 456 7890"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={joinMeeting} disabled={isJoining || !meetingId.trim()}>
                    {isJoining ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        참여 중...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" /> 참여
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trainers" id="trainers-tab-content" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>테일즈 화상 수업</CardTitle>
              <CardDescription>테일즈 소속 훈련사가 진행하는 화상수업에 참여하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              {videoClasses.length > 0 ? (
                <div className="space-y-4">
                  {videoClasses.map((videoClass) => (
                    <Card key={videoClass.id} className="overflow-hidden">
                      <CardHeader className="bg-muted/50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="flex items-center gap-2 mb-2">
                              <Video className="w-5 h-5" />
                              {videoClass.title}
                            </CardTitle>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {videoClass.trainerName} 훈련사
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {format(new Date(videoClass.scheduledTime), 'MM월 dd일 HH:mm', { locale: ko })}
                              </div>
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="w-4 h-4" />
                                {videoClass.duration}분
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Button 
                              variant="default" 
                              size="sm" 
                              onClick={() => {
                                const pmiUrl = `https://zoom.us/j/${videoClass.zoomPMI.replace(/-/g, '')}?pwd=${videoClass.zoomPMIPassword}`;
                                window.open(pmiUrl, '_blank');
                                toast({
                                  title: "화상수업 참여",
                                  description: `${videoClass.title} 수업에 참여합니다.`,
                                });
                              }}
                              aria-label={`${videoClass.title} 화상수업 참여하기`}
                            >
                              <Video className="w-4 h-4 mr-2" /> 수업 참여
                            </Button>
                            <span className="text-lg font-bold text-primary">
                              {videoClass.price.toLocaleString()}원
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4 pb-2">
                        <p className="text-sm text-muted-foreground mb-4">
                          {videoClass.description}
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <p className="font-medium text-muted-foreground mb-1">카테고리:</p>
                            <p>{videoClass.category}</p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground mb-1">난이도:</p>
                            <p>{videoClass.difficulty === 'beginner' ? '초급' : 
                               videoClass.difficulty === 'intermediate' ? '중급' : '고급'}</p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground mb-1">참여인원:</p>
                            <p>{videoClass.currentStudents}/{videoClass.maxStudents}명</p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground mb-1">상태:</p>
                            <p>{videoClass.status === 'scheduled' ? '예정됨' : '진행중'}</p>
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">회의 정보</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-blue-700 dark:text-blue-300 font-medium">회의 번호:</p>
                              <p className="font-mono text-blue-900 dark:text-blue-100">{videoClass.zoomPMI}</p>
                            </div>
                            <div>
                              <p className="text-blue-700 dark:text-blue-300 font-medium">비밀번호:</p>
                              <p className="font-mono text-blue-900 dark:text-blue-100">{videoClass.zoomPMIPassword}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t bg-muted/30 py-2">
                        <div className="flex items-center gap-2">
                          <img 
                            src={videoClass.trainerImage} 
                            alt={`${videoClass.trainerName} 프로필`}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="text-sm font-medium">{videoClass.trainerName}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              const classInfo = `
${videoClass.title}
훈련사: ${videoClass.trainerName}
일시: ${format(new Date(videoClass.scheduledTime), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}
회의 번호: ${videoClass.zoomPMI}
비밀번호: ${videoClass.zoomPMIPassword}
참여방법: Zoom 앱에서 "미팅 참여" → 회의 번호 입력
                              `.trim();
                              
                              navigator.clipboard.writeText(classInfo)
                                .then(() => {
                                  toast({
                                    title: '복사 완료',
                                    description: '화상수업 정보가 클립보드에 복사되었습니다.',
                                  });
                                })
                                .catch(() => {
                                  toast({
                                    title: '복사 실패',
                                    description: '정보 복사 중 오류가 발생했습니다.',
                                    variant: 'destructive'
                                  });
                                });
                            }}
                            aria-label={`${videoClass.title} 화상수업 정보 복사하기`}
                          >
                            <Copy className="w-4 h-4 mr-1" /> 정보 복사
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            aria-label={`${videoClass.title} 화상수업 정보 공유하기`}
                          >
                            <Share2 className="w-4 h-4 mr-1" /> 공유
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">예정된 화상수업이 없습니다</h3>
                  <p className="text-muted-foreground mb-4">테일즈 소속 훈련사가 진행하는 화상수업을 준비 중입니다.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="create" id="create-tab-content" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>새 미팅 생성</CardTitle>
              <CardDescription>새로운 Zoom 미팅을 생성하여 다른 사람들을 초대하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="topic">미팅 제목 *</Label>
                    <Input
                      id="topic"
                      name="topic"
                      value={meetingData.topic}
                      onChange={handleInputChange}
                      placeholder="미팅 제목을 입력하세요"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="date">날짜 *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full mt-1 justify-start text-left font-normal",
                            !meetingData.date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {meetingData.date ? format(meetingData.date, "yyyy년 MM월 dd일", { locale: ko }) : "날짜 선택"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={meetingData.date}
                          onSelect={handleDateChange}
                          initialFocus
                          locale={ko}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label htmlFor="time">시간 *</Label>
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      value={meetingData.time}
                      onChange={handleInputChange}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="duration">진행 시간 (분) *</Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      min="15"
                      max="480"
                      value={meetingData.duration}
                      onChange={handleInputChange}
                      placeholder="30"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="agenda">안건 (선택사항)</Label>
                    <textarea
                      id="agenda"
                      name="agenda"
                      value={meetingData.agenda}
                      onChange={handleInputChange}
                      placeholder="미팅 안건이나 설명을 입력하세요"
                      className="mt-1 min-h-24 w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setMeetingData({
                      topic: '',
                      date: new Date(),
                      time: format(new Date(), 'HH:mm'),
                      duration: 30,
                      agenda: ''
                    });
                  }}
                >
                  초기화
                </Button>
                <Button 
                  onClick={createMeeting} 
                  disabled={isCreating || !meetingData.topic.trim()}
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      생성 중...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" /> 미팅 생성
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}