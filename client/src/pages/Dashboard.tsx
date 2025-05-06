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
              <p>서버 상태: <Badge variant="green">정상</Badge></p>
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
    <div>
      <h1 className="text-2xl font-bold mb-6">반려견 교육 현황</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>학습 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <p>진행 중인 강의: 3개</p>
            <p>완료한 강의: 2개</p>
            <div className="mt-4">
              <Link href="/my-courses">
                <Button variant="outline" size="sm">내 강의실</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>반려견 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <p>등록된 반려견: 2마리</p>
            <p>건강 상태: 양호</p>
            <div className="mt-4">
              <Link href="/my-pets">
                <Button variant="outline" size="sm">반려견 관리</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>일정</CardTitle>
          </CardHeader>
          <CardContent>
            <p>오늘 일정: 1개</p>
            <p>이번 주 일정: 3개</p>
            <div className="mt-4">
              <Link href="/calendar">
                <Button variant="outline" size="sm">일정 관리</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
