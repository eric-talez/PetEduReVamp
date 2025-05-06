import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { getUserRole } from '@/lib/utils';
import { Link } from 'wouter';
import { Button } from '@/components/ui/Button';

export default function Dashboard() {
  const userRole = getUserRole();
  
  if (userRole === 'trainer') {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">훈련사 대시보드</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>강의 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <p>현재 제공 중인 강의: 5개</p>
              <p>준비 중인 강의: 2개</p>
              <div className="mt-4">
                <Link href="/trainer/courses">
                  <Button variant="outline" size="sm">강의 관리</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>수강생 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <p>총 수강생: 78명</p>
              <p>신규 수강생 (이번 달): 12명</p>
              <div className="mt-4">
                <Link href="/trainer/students">
                  <Button variant="outline" size="sm">수강생 관리</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>수익 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <p>이번 달 수익: 2,450,000원</p>
              <p>전월 대비: <Badge variant="green">+15%</Badge></p>
              <div className="mt-4">
                <Link href="/trainer/earnings">
                  <Button variant="outline" size="sm">수익 관리</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (userRole === 'institute-admin') {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">기관 관리자 대시보드</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>기관 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <p>총 강의: 15개</p>
              <p>소속 훈련사: 8명</p>
              <div className="mt-4">
                <Link href="/institute/courses">
                  <Button variant="outline" size="sm">기관 강의 관리</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>훈련사 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <p>활동 중인 훈련사: 6명</p>
              <p>신규 훈련사: 2명</p>
              <div className="mt-4">
                <Link href="/institute/trainers">
                  <Button variant="outline" size="sm">훈련사 관리</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>매출 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <p>이번 달 매출: 12,750,000원</p>
              <p>전월 대비: <Badge variant="green">+8%</Badge></p>
              <div className="mt-4">
                <Link href="/institute/analytics">
                  <Button variant="outline" size="sm">매출 분석</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (userRole === 'admin') {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">시스템 관리자 대시보드</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>사용자 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <p>총 사용자: 2,356명</p>
              <p>신규 가입자 (이번 달): 128명</p>
              <div className="mt-4">
                <Link href="/admin/users">
                  <Button variant="outline" size="sm">사용자 관리</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>승인 대기 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <p>훈련사 승인 대기: 15명</p>
              <p>기관 승인 대기: 3개</p>
              <div className="mt-4">
                <Link href="/admin/approvals">
                  <Button variant="outline" size="sm">승인 관리</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>시스템 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <p>서버 상태: <Badge variant="success">정상</Badge></p>
              <p>최근 백업: 오늘 03:00</p>
              <div className="mt-4">
                <Link href="/admin/settings">
                  <Button variant="outline" size="sm">시스템 설정</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // Default pet-owner dashboard
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">반려견 교육 플랫폼</h1>
        <Badge variant="outline" className="px-3 py-1 text-sm bg-primary/10">
          환영합니다!
        </Badge>
      </div>

      {/* 유저 현황 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">학습 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">진행 중인 강의</p>
                <p className="text-2xl font-bold">3개</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/my-courses">
                <Button variant="outline" size="sm" className="w-full">내 강의실 바로가기</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">반려견 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">등록된 반려견</p>
                <p className="text-2xl font-bold">2마리</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 5.172C10 3.12 8.21 1.55 6.17 1.95c-1.4.28-2.47 1.47-2.6 2.9-.12 1.47.63 2.76 1.73 3.55.2.15.33.35.4.57l.08.26a1 1 0 0 0 1.95-.38c0-.06.03-.12.08-.16 1.03-.86 1.63-2.01 1.4-3.54" /><path d="M17.79 1.95c-2.04-.4-3.82 1.17-3.82 3.22 0 1.25.5 2.28 1.32 3.09.05.04.08.1.08.16a1 1 0 0 0 1.95.38l.08-.26c.07-.22.2-.42.4-.57a4.16 4.16 0 0 0 1.73-3.55c-.13-1.43-1.2-2.62-2.6-2.9z" /><path d="M13.73 14.43a6 6 0 0 0-3.46 0" /><path d="M10 19c.16.77.7 1.5 1.94 2a6.37 6.37 0 0 0 2.13 0c1.24-.5 1.78-1.23 1.94-2" /><path d="M19.2 16.797a9 9 0 0 1-14.582-.13" /><path d="M12 8a4 4 0 0 0-4 4" /><path d="M16 12a4 4 0 0 0-4-4" /></svg>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/my-pets">
                <Button variant="outline" size="sm" className="w-full">반려견 관리</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">일정 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">오늘 일정</p>
                <p className="text-2xl font-bold">1개</p>
                <p className="text-sm text-muted-foreground mt-1">이번 주: 3개</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="m9 16 2 2 4-4" /></svg>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/calendar">
                <Button variant="outline" size="sm" className="w-full">일정 확인하기</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 추천 및 인기 서비스 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">추천 훈련과정</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="overflow-hidden">
            <div className="h-40 bg-gray-200 relative">
              <img src="https://images.unsplash.com/photo-1541599484646-5f7e3f3b2b2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fGRvZyUyMHRyYWluaW5nfGVufDB8fDB8fHww" alt="기초 사회화 훈련" className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary">인기강의</Badge>
              </div>
            </div>
            <CardContent className="pt-4">
              <h3 className="font-semibold mb-2">기초 사회화 훈련 코스</h3>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-muted-foreground">김전문 훈련사</p>
                <span className="flex items-center text-sm text-yellow-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  <span className="ml-1">5.0</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">반려견의 기본적인 사회화 훈련과 기본 감정 및 행동 콘트롤을 배움니다.</p>
              <div className="flex justify-between items-center">
                <p className="font-semibold">128,000원</p>
                <Link href="/courses/1">
                  <Button size="sm">자세히 보기</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="h-40 bg-gray-200 relative">
              <img src="https://images.unsplash.com/photo-1534361960057-19889db9621e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZG9nJTIwdHJpY2t8ZW58MHx8MHx8fDA%3D" alt="문제행동 교정 프로그램" className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary">추천강의</Badge>
              </div>
            </div>
            <CardContent className="pt-4">
              <h3 className="font-semibold mb-2">문제행동 교정 프로그램</h3>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-muted-foreground">박서연 훈련사</p>
                <span className="flex items-center text-sm text-yellow-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  <span className="ml-1">4.8</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">물기, 소리지르기, 떠들기 등 문제행동을 개선하는 전문 훈련 프로그램</p>
              <div className="flex justify-between items-center">
                <p className="font-semibold">165,000원</p>
                <Link href="/courses/2">
                  <Button size="sm">자세히 보기</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="h-40 bg-gray-200 relative">
              <img src="https://images.unsplash.com/photo-1484190929067-65e7edd5a22f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZG9nJTIwYWdpbGl0eXxlbnwwfHwwfHx8MA%3D%3D" alt="어질리티 초급 과정" className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2">
                <Badge variant="danger">신규강의</Badge>
              </div>
            </div>
            <CardContent className="pt-4">
              <h3 className="font-semibold mb-2">어질리티 초급 과정</h3>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-muted-foreground">이진호 훈련사</p>
                <span className="flex items-center text-sm text-yellow-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  <span className="ml-1">5.0</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">잠재력을 끌어낼 수 있는 어질리티 초급 과정, 경기대회를 위한 기본 훈련</p>
              <div className="flex justify-between items-center">
                <p className="font-semibold">185,000원</p>
                <Link href="/courses/3">
                  <Button size="sm">자세히 보기</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 인기 훈련사 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">인기 훈련사</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3">
                <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWFufGVufDB8fDB8fHww" alt="김전문 훈련사" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-semibold">김전문 훈련사</h3>
              <p className="text-sm text-muted-foreground mb-2">사회화 훈련 전문</p>
              <div className="flex items-center justify-center mb-3 text-sm text-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                <span className="ml-1">5.0</span>
                <span className="ml-1 text-muted-foreground">(수강생 128명)</span>
              </div>
              <Link href="/trainers/1">
                <Button variant="outline" size="sm" className="w-full">프로필 보기</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 text-center">
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3">
                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d29tYW58ZW58MHx8MHx8fDA%3D" alt="박서연 훈련사" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-semibold">박서연 훈련사</h3>
              <p className="text-sm text-muted-foreground mb-2">행동교정 전문가</p>
              <div className="flex items-center justify-center mb-3 text-sm text-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                <span className="ml-1">4.8</span>
                <span className="ml-1 text-muted-foreground">(수강생 95명)</span>
              </div>
              <Link href="/trainers/2">
                <Button variant="outline" size="sm" className="w-full">프로필 보기</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 text-center">
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3">
                <img src="https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWFufGVufDB8fDB8fHww" alt="이진호 훈련사" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-semibold">이진호 훈련사</h3>
              <p className="text-sm text-muted-foreground mb-2">어질리티 전문</p>
              <div className="flex items-center justify-center mb-3 text-sm text-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                <span className="ml-1">4.9</span>
                <span className="ml-1 text-muted-foreground">(수강생 85명)</span>
              </div>
              <Link href="/trainers/3">
                <Button variant="outline" size="sm" className="w-full">프로필 보기</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 text-center">
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fHdvbWFufGVufDB8fDB8fHww" alt="최민지 훈련사" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-semibold">최민지 훈련사</h3>
              <p className="text-sm text-muted-foreground mb-2">피아니스트/상담사</p>
              <div className="flex items-center justify-center mb-3 text-sm text-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                <span className="ml-1">4.7</span>
                <span className="ml-1 text-muted-foreground">(수강생 76명)</span>
              </div>
              <Link href="/trainers/4">
                <Button variant="outline" size="sm" className="w-full">프로필 보기</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 인기 소식/커뮤니티 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">인기 커뮤니티 소식</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center mb-1">
                <Badge variant="outline">훈련 노하우</Badge>
                <p className="text-sm text-muted-foreground">3일 전</p>
              </div>
              <CardTitle className="text-base">반려견 집안에서 훈련할 때 주의할 점 5가지</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                  <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWFufGVufDB8fDB8fHww" alt="김전문 훈련사" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-medium">김전문 훈련사</p>
                  <p className="text-xs text-muted-foreground">조회 1,245</p>
                </div>
              </div>
              <div className="mt-3">
                <Link href="/community/post/1">
                  <Button variant="ghost" size="sm">글 읽기</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center mb-1">
                <Badge variant="outline">사료 정보</Badge>
                <p className="text-sm text-muted-foreground">1주일 전</p>
              </div>
              <CardTitle className="text-base">반려견에게 예견지식 - 몇세에 시작해야 할까요?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                  <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d29tYW58ZW58MHx8MHx8fDA%3D" alt="박서연 훈련사" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-medium">박서연 훈련사</p>
                  <p className="text-xs text-muted-foreground">조회 982</p>
                </div>
              </div>
              <div className="mt-3">
                <Link href="/community/post/2">
                  <Button variant="ghost" size="sm">글 읽기</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center mb-1">
                <Badge variant="outline">훈련 사례</Badge>
                <p className="text-sm text-muted-foreground">2주일 전</p>
              </div>
              <CardTitle className="text-base">비언소리 냄새 때문에 고생했던 집사루 이야기</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                  <img src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHdvbWFufGVufDB8fDB8fHww" alt="유하나 회원" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-medium">유하나 회원</p>
                  <p className="text-xs text-muted-foreground">조회 876</p>
                </div>
              </div>
              <div className="mt-3">
                <Link href="/community/post/3">
                  <Button variant="ghost" size="sm">글 읽기</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
