import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ZoomMeeting from '@/components/ZoomMeeting';
import { Video, User, Phone, Calendar, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'wouter';

export default function ZoomTestPage() {
  const [showMeeting, setShowMeeting] = useState(false);
  const [meetingId, setMeetingId] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('테스트 사용자');
  const [isSpeaker, setIsSpeaker] = useState(false);
  const auth = useAuth();

  const handleJoinMeeting = () => {
    if (!auth.isAuthenticated) {
      alert('화상수업을 이용하시려면 로그인이 필요합니다.');
      return;
    }
    
    if (!meetingId.trim()) {
      alert('미팅 ID를 입력해주세요.');
      return;
    }
    setShowMeeting(true);
  };

  const handleCloseMeeting = () => {
    setShowMeeting(false);
  };

  if (showMeeting) {
    return (
      <ZoomMeeting
        meetingId={meetingId}
        password={password}
        userName={userName}
        onClose={handleCloseMeeting}
        isSpeaker={isSpeaker}
        startTime="지금"
        endTime=""
        trainer={{
          name: "김훈련사",
          avatar: "https://robohash.org/trainer?set=set4&size=200x200"
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-6 h-6 text-blue-600" />
              Zoom 화상수업 테스트
            </CardTitle>
            <CardDescription>
              실제 Zoom 미팅에 참여하여 화상수업 기능을 테스트해보세요.
              개인 회의 ID나 기존 Zoom 미팅 ID를 사용할 수 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* 비로그인 사용자 안내 */}
            {!auth.isAuthenticated && (
              <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  <div className="space-y-2">
                    <p className="font-medium">화상수업 이용 안내</p>
                    <p className="text-sm">
                      화상수업 기능을 이용하시려면 로그인이 필요합니다. 
                      로그인 후 다음과 같은 기능을 이용하실 수 있습니다:
                    </p>
                    <ul className="text-sm space-y-1 ml-4 list-disc">
                      <li>개인 Zoom 계정 연동 (무료, 40분 제한)</li>
                      <li>서비스 계정 이용 (유료, 시간 제한 없음)</li>
                      <li>강의 녹화 및 자료 공유</li>
                      <li>참여자 관리 및 채팅 기능</li>
                    </ul>
                    <div className="flex gap-2 mt-3">
                      <Link href="/auth/login">
                        <Button size="sm" className="text-xs">
                          <LogIn className="w-3 h-3 mr-1" />
                          로그인하기
                        </Button>
                      </Link>
                      <Link href="/auth/register">
                        <Button variant="outline" size="sm" className="text-xs">
                          <User className="w-3 h-3 mr-1" />
                          회원가입
                        </Button>
                      </Link>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* 로그인 사용자용 안내 */}
            {auth.isAuthenticated && (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                <User className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <p className="font-medium">환영합니다, {auth.userName}님!</p>
                  <p className="text-sm mt-1">
                    화상수업 기능을 자유롭게 테스트해보세요. 개인 Zoom 계정이나 테스트용 미팅 ID를 입력하여 기능을 체험할 수 있습니다.
                  </p>
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-4">
              <div>
                <Label htmlFor="meetingId">미팅 ID *</Label>
                <Input
                  id="meetingId"
                  type="text"
                  placeholder="예: 123-456-7890 또는 1234567890"
                  value={meetingId}
                  onChange={(e) => setMeetingId(e.target.value)}
                  data-testid="input-meeting-id"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Zoom 개인 회의 ID나 예약된 미팅 ID를 입력하세요.
                </p>
              </div>

              <div>
                <Label htmlFor="password">미팅 비밀번호 (선택사항)</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="미팅 비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="input-meeting-password"
                />
              </div>

              <div>
                <Label htmlFor="userName">사용자 이름</Label>
                <Input
                  id="userName"
                  type="text"
                  placeholder="화상수업에서 표시될 이름"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  data-testid="input-user-name"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isSpeaker"
                  checked={isSpeaker}
                  onChange={(e) => setIsSpeaker(e.target.checked)}
                  className="rounded"
                  data-testid="checkbox-is-speaker"
                />
                <Label htmlFor="isSpeaker">호스트/발표자로 참여</Label>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                테스트 방법:
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>1. 본인의 Zoom 개인 회의 ID를 입력하거나</li>
                <li>2. 다른 Zoom 미팅 ID를 입력하여</li>
                <li>3. 실제 화상수업 기능을 테스트해보세요</li>
                <li>4. 마이크, 비디오, 화면공유 등의 기능을 확인할 수 있습니다</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleJoinMeeting}
                className="flex-1"
                disabled={!auth.isAuthenticated}
                data-testid="button-join-meeting"
              >
                <Video className="w-4 h-4 mr-2" />
                {auth.isAuthenticated ? '화상수업 참여' : '로그인 후 이용 가능'}
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  setMeetingId('');
                  setPassword('');
                  setUserName('테스트 사용자');
                  setIsSpeaker(false);
                }}
                data-testid="button-reset"
              >
                초기화
              </Button>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">현재 상태:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span>Zoom SDK 통합 완료</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-green-600" />
                  <span>JWT 인증 토큰 생성 API 준비 완료</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-600" />
                  <span>실시간 화상 통신 기능 활성화</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}