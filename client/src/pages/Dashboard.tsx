import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { getUserRole } from '@/lib/utils';
import { Link } from 'wouter';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type DashboardProps = {
  typeProps?: string;
  subview?: string;
};

// 모달 타입 정의
type ModalType = 'course-management' | 'course-details' | 'course-history' | 
                'student-management' | 'student-details' | 'student-history' | 
                'earnings-management' | 'earnings-details' | 'earnings-history' | null;

export default function Dashboard({ typeProps, subview }: DashboardProps) {
  const userRole = typeProps || getUserRole();
  // 모달 상태
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [activeTab, setActiveTab] = useState("current"); // 기본 탭 설정
  
  // 모달 열기
  const openModal = (type: ModalType) => {
    console.log(`대시보드: ${type} 모달 열기`);
    setActiveModal(type);
  };

  // 모달 닫기
  const closeModal = () => {
    setActiveModal(null);
  };
  
  console.log("Dashboard accessed - User Role:", userRole);
  console.log("Dashboard component auth state:", {isAuthenticated: false, isLoading: true, userRole: null, userName: null});
  console.log("Global auth state:", {isAuthenticated: true, isLoading: false, userRole, userName: "demo-trainer"});
  
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
              <div className="mt-4 grid grid-cols-3 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => openModal('course-management')}
                >
                  관리
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => openModal('course-details')}
                >
                  상세
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => openModal('course-history')}
                >
                  내역
                </Button>
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
              <div className="mt-4 grid grid-cols-3 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => openModal('student-management')}
                >
                  관리
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => openModal('student-details')}
                >
                  상세
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => openModal('student-history')}
                >
                  내역
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>수익 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <p>이번 달 수익: 2,450,000원</p>
              <p>전월 대비: <Badge variant="success">+15%</Badge></p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => openModal('earnings-management')}
                >
                  관리
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => openModal('earnings-details')}
                >
                  상세
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => openModal('earnings-history')}
                >
                  내역
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* 강의 관리 모달 */}
        <Dialog open={activeModal === 'course-management'} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle className="text-xl">강의 관리</DialogTitle>
              <DialogDescription>
                현재 운영 중인 강의 및 예정된 강의를 관리합니다.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="active">진행 중</TabsTrigger>
                <TabsTrigger value="upcoming">예정</TabsTrigger>
                <TabsTrigger value="completed">완료</TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="mt-4">
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>강의명</TableHead>
                        <TableHead>유형</TableHead>
                        <TableHead>기간</TableHead>
                        <TableHead>수강생</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>액션</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">반려견 기초 훈련 마스터하기</TableCell>
                        <TableCell>그룹</TableCell>
                        <TableCell>4/15 - 6/15</TableCell>
                        <TableCell>12명</TableCell>
                        <TableCell>진행 중</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className="mr-2">수정</Button>
                          <Button variant="outline" size="sm">중지</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">문제행동 교정 과정</TableCell>
                        <TableCell>1:1</TableCell>
                        <TableCell>4/28 - 5/28</TableCell>
                        <TableCell>5명</TableCell>
                        <TableCell>진행 중</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className="mr-2">수정</Button>
                          <Button variant="outline" size="sm">중지</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="upcoming" className="mt-4">
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>강의명</TableHead>
                        <TableHead>유형</TableHead>
                        <TableHead>예정일</TableHead>
                        <TableHead>인원</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>액션</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">반려견 어질리티 입문</TableCell>
                        <TableCell>그룹</TableCell>
                        <TableCell>5/20 시작</TableCell>
                        <TableCell>6명/10명</TableCell>
                        <TableCell>모집 중</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className="mr-2">수정</Button>
                          <Button variant="outline" size="sm">취소</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="completed" className="mt-4">
                <div className="text-center py-8 text-gray-500">
                  <p>지난 3개월 내 완료된 강의가 없습니다.</p>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="flex justify-between">
              <Button variant="outline">새 강의 등록</Button>
              <Button onClick={closeModal}>닫기</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* 강의 상세 모달 */}
        <Dialog open={activeModal === 'course-details'} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle className="text-xl">강의 상세 정보</DialogTitle>
              <DialogDescription>
                강의 상세 정보 및 통계를 확인합니다.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="course1" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="course1">반려견 기초 훈련</TabsTrigger>
                <TabsTrigger value="course2">문제행동 교정</TabsTrigger>
              </TabsList>
              
              <TabsContent value="course1" className="mt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md">강의 정보</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">강의명:</span>
                            <span className="font-medium">반려견 기초 훈련 마스터하기</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">유형:</span>
                            <span>그룹 수업</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">기간:</span>
                            <span>2025.04.15 - 2025.06.15</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">시간:</span>
                            <span>매주 화/목 19:00-21:00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">장소:</span>
                            <span>서울 강남구 펫에듀센터</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">수강료:</span>
                            <span className="font-medium">240,000원</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md">통계</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">등록 인원:</span>
                            <span>12명 / 15명</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">진행률:</span>
                            <span>40%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">출석률:</span>
                            <span>95%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">과제 제출률:</span>
                            <span>88%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">만족도:</span>
                            <span className="font-medium">4.8/5.0</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">강의 커리큘럼</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>주차</TableHead>
                            <TableHead>내용</TableHead>
                            <TableHead>상태</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>1주차</TableCell>
                            <TableCell>기초 복종 훈련 - 앉기, 기다리기</TableCell>
                            <TableCell>완료</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>2주차</TableCell>
                            <TableCell>기초 복종 훈련 - 엎드리기, 일어서기</TableCell>
                            <TableCell>완료</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>3주차</TableCell>
                            <TableCell>기초 복종 훈련 - 따라오기, 제자리</TableCell>
                            <TableCell>진행 중</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="course2" className="mt-4">
                <div className="text-center py-8 text-gray-500">
                  <p>다른 강의를 선택하세요.</p>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button onClick={closeModal}>닫기</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* 강의 내역 모달 */}
        <Dialog open={activeModal === 'course-history'} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle className="text-xl">강의 이력</DialogTitle>
              <DialogDescription>
                과거 진행했던 강의 내역을 확인합니다.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>강의명</TableHead>
                    <TableHead>기간</TableHead>
                    <TableHead>수강생</TableHead>
                    <TableHead>만족도</TableHead>
                    <TableHead>수료율</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">반려견 사회화 트레이닝</TableCell>
                    <TableCell>2025.01.10 - 2025.03.10</TableCell>
                    <TableCell>15명</TableCell>
                    <TableCell>4.7/5.0</TableCell>
                    <TableCell>93%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">퍼피 기초 훈련</TableCell>
                    <TableCell>2024.11.05 - 2025.01.05</TableCell>
                    <TableCell>12명</TableCell>
                    <TableCell>4.9/5.0</TableCell>
                    <TableCell>100%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">반려견 공격성 교정</TableCell>
                    <TableCell>2024.09.15 - 2024.11.15</TableCell>
                    <TableCell>8명</TableCell>
                    <TableCell>4.6/5.0</TableCell>
                    <TableCell>88%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <DialogFooter>
              <Button onClick={closeModal}>닫기</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* 수강생 관리 모달 */}
        <Dialog open={activeModal === 'student-management'} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle className="text-xl">수강생 관리</DialogTitle>
              <DialogDescription>
                현재 등록된 수강생과 진행 상황을 관리합니다.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="current">현재 수강생</TabsTrigger>
                <TabsTrigger value="pending">대기 중</TabsTrigger>
                <TabsTrigger value="graduated">수료 완료</TabsTrigger>
              </TabsList>
              
              <TabsContent value="current" className="mt-4">
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>이름</TableHead>
                        <TableHead>반려견</TableHead>
                        <TableHead>강의</TableHead>
                        <TableHead>진도율</TableHead>
                        <TableHead>시작일</TableHead>
                        <TableHead>액션</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">이지은</TableCell>
                        <TableCell>몽이 (말티즈)</TableCell>
                        <TableCell>기초 훈련</TableCell>
                        <TableCell>65%</TableCell>
                        <TableCell>2025.04.15</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className="mr-2">보기</Button>
                          <Button variant="outline" size="sm">메시지</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">김민준</TableCell>
                        <TableCell>코코 (푸들)</TableCell>
                        <TableCell>문제행동 교정</TableCell>
                        <TableCell>40%</TableCell>
                        <TableCell>2025.04.28</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className="mr-2">보기</Button>
                          <Button variant="outline" size="sm">메시지</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="pending" className="mt-4">
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>이름</TableHead>
                        <TableHead>반려견</TableHead>
                        <TableHead>강의</TableHead>
                        <TableHead>신청일</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>액션</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">박서현</TableCell>
                        <TableCell>해피 (포메라니안)</TableCell>
                        <TableCell>어질리티 입문</TableCell>
                        <TableCell>2025.05.05</TableCell>
                        <TableCell>결제 완료</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className="mr-2">승인</Button>
                          <Button variant="outline" size="sm">거절</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="graduated" className="mt-4">
                <div className="text-center py-8 text-gray-500">
                  <p>지난 3개월 내 수료한 수강생이 없습니다.</p>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button onClick={closeModal}>닫기</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* 수강생 상세 모달 */}
        <Dialog open={activeModal === 'student-details'} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle className="text-xl">수강생 상세 정보</DialogTitle>
              <DialogDescription>
                수강생 상세 정보 및 진행 상황을 확인합니다.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="student1" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student1">이지은</TabsTrigger>
                <TabsTrigger value="student2">김민준</TabsTrigger>
              </TabsList>
              
              <TabsContent value="student1" className="mt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md">수강생 정보</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">이름:</span>
                            <span className="font-medium">이지은</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">연락처:</span>
                            <span>010-1234-5678</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">이메일:</span>
                            <span>jieun@example.com</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">등록일:</span>
                            <span>2025.04.10</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">현재 강의:</span>
                            <span>기초 훈련 마스터하기</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md">반려견 정보</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">이름:</span>
                            <span>몽이</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">품종:</span>
                            <span>말티즈</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">나이:</span>
                            <span>2살</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">성별:</span>
                            <span>수컷 (중성화)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">특이사항:</span>
                            <span>낯가림, 소심함</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">교육 진행 상황</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>회차</TableHead>
                            <TableHead>내용</TableHead>
                            <TableHead>출석</TableHead>
                            <TableHead>과제</TableHead>
                            <TableHead>평가</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>1회차</TableCell>
                            <TableCell>오리엔테이션, 기초 사회화</TableCell>
                            <TableCell>O</TableCell>
                            <TableCell>제출</TableCell>
                            <TableCell>A</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>2회차</TableCell>
                            <TableCell>앉기, 기다리기 훈련</TableCell>
                            <TableCell>O</TableCell>
                            <TableCell>제출</TableCell>
                            <TableCell>B+</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>3회차</TableCell>
                            <TableCell>엎드리기, 일어서기 훈련</TableCell>
                            <TableCell>O</TableCell>
                            <TableCell>미제출</TableCell>
                            <TableCell>-</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="student2" className="mt-4">
                <div className="text-center py-8 text-gray-500">
                  <p>다른 수강생을 선택하세요.</p>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button onClick={closeModal}>닫기</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* 수강생 내역 모달 */}
        <Dialog open={activeModal === 'student-history'} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle className="text-xl">수강생 이력</DialogTitle>
              <DialogDescription>
                과거 수강생 등록 및 수료 내역을 확인합니다.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>강의명</TableHead>
                    <TableHead>기간</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>결과</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">오수진</TableCell>
                    <TableCell>반려견 사회화 트레이닝</TableCell>
                    <TableCell>2025.01.10 - 2025.03.10</TableCell>
                    <TableCell>수료</TableCell>
                    <TableCell>A</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">정우진</TableCell>
                    <TableCell>퍼피 기초 훈련</TableCell>
                    <TableCell>2024.11.05 - 2025.01.05</TableCell>
                    <TableCell>수료</TableCell>
                    <TableCell>A+</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">김태희</TableCell>
                    <TableCell>반려견 공격성 교정</TableCell>
                    <TableCell>2024.09.15 - 2024.11.15</TableCell>
                    <TableCell>중도포기</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <DialogFooter>
              <Button onClick={closeModal}>닫기</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* 수익 관리 모달 */}
        <Dialog open={activeModal === 'earnings-management'} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle className="text-xl">수익 관리</DialogTitle>
              <DialogDescription>
                수익 현황을 관리하고 정산 내역을 확인합니다.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="monthly" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="monthly">월별 수익</TabsTrigger>
                <TabsTrigger value="courses">강의별 수익</TabsTrigger>
                <TabsTrigger value="payments">정산 현황</TabsTrigger>
              </TabsList>
              
              <TabsContent value="monthly" className="mt-4">
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>월</TableHead>
                        <TableHead>총 수익</TableHead>
                        <TableHead>강의 수</TableHead>
                        <TableHead>수강생 수</TableHead>
                        <TableHead>증감률</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">2025년 5월</TableCell>
                        <TableCell>₩2,450,000</TableCell>
                        <TableCell>3개</TableCell>
                        <TableCell>17명</TableCell>
                        <TableCell className="text-green-600">+15%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">2025년 4월</TableCell>
                        <TableCell>₩2,130,000</TableCell>
                        <TableCell>3개</TableCell>
                        <TableCell>15명</TableCell>
                        <TableCell className="text-green-600">+18%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">2025년 3월</TableCell>
                        <TableCell>₩1,800,000</TableCell>
                        <TableCell>2개</TableCell>
                        <TableCell>12명</TableCell>
                        <TableCell className="text-gray-500">-</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="courses" className="mt-4">
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>강의명</TableHead>
                        <TableHead>유형</TableHead>
                        <TableHead>수강생 수</TableHead>
                        <TableHead>월 수익</TableHead>
                        <TableHead>비율</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">반려견 기초 훈련 마스터하기</TableCell>
                        <TableCell>그룹</TableCell>
                        <TableCell>12명</TableCell>
                        <TableCell>₩1,200,000</TableCell>
                        <TableCell>49%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">문제행동 교정 과정</TableCell>
                        <TableCell>1:1</TableCell>
                        <TableCell>5명</TableCell>
                        <TableCell>₩1,250,000</TableCell>
                        <TableCell>51%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="payments" className="mt-4">
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>정산 예정일</TableHead>
                        <TableHead>금액</TableHead>
                        <TableHead>수수료</TableHead>
                        <TableHead>실 수령액</TableHead>
                        <TableHead>상태</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">2025.05.25</TableCell>
                        <TableCell>₩2,450,000</TableCell>
                        <TableCell>₩245,000 (10%)</TableCell>
                        <TableCell>₩2,205,000</TableCell>
                        <TableCell>예정</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">2025.04.25</TableCell>
                        <TableCell>₩2,130,000</TableCell>
                        <TableCell>₩213,000 (10%)</TableCell>
                        <TableCell>₩1,917,000</TableCell>
                        <TableCell>완료</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" className="mr-2">정산 계좌 설정</Button>
              <Button onClick={closeModal}>닫기</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* 수익 상세 모달 */}
        <Dialog open={activeModal === 'earnings-details'} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle className="text-xl">수익 상세 분석</DialogTitle>
              <DialogDescription>
                수익 상세 내역 및 분석 자료를 확인합니다.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">요약</TabsTrigger>
                <TabsTrigger value="trends">추이</TabsTrigger>
                <TabsTrigger value="details">상세</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="mt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md">수익 요약 (2025년 5월)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">총 수익:</span>
                            <span className="font-bold">₩2,450,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">수수료:</span>
                            <span>₩245,000 (10%)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">순 수익:</span>
                            <span className="font-bold">₩2,205,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">전월 대비:</span>
                            <span className="text-green-600">+15%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">수익 목표:</span>
                            <span>₩2,500,000 (98% 달성)</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md">수익원 분석</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">그룹 강의:</span>
                            <span>₩1,200,000 (49%)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">1:1 강의:</span>
                            <span>₩1,250,000 (51%)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">옵션 서비스:</span>
                            <span>₩0 (0%)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">기타:</span>
                            <span>₩0 (0%)</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="trends" className="mt-4">
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">월별 수익 추이 (최근 6개월)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-60 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <p className="text-muted-foreground">이 영역에 그래프가 표시됩니다.</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="mt-4">
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>날짜</TableHead>
                        <TableHead>설명</TableHead>
                        <TableHead>수강생</TableHead>
                        <TableHead>금액</TableHead>
                        <TableHead>수수료</TableHead>
                        <TableHead>순액</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>2025.05.05</TableCell>
                        <TableCell>기초 훈련 강의 수강료</TableCell>
                        <TableCell>이지은</TableCell>
                        <TableCell>₩240,000</TableCell>
                        <TableCell>₩24,000</TableCell>
                        <TableCell>₩216,000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2025.05.03</TableCell>
                        <TableCell>문제행동 교정 과정 수강료</TableCell>
                        <TableCell>김민준</TableCell>
                        <TableCell>₩280,000</TableCell>
                        <TableCell>₩28,000</TableCell>
                        <TableCell>₩252,000</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button onClick={closeModal}>닫기</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* 수익 내역 모달 */}
        <Dialog open={activeModal === 'earnings-history'} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle className="text-xl">수익 내역</DialogTitle>
              <DialogDescription>
                지난 정산 내역 및 이력을 확인합니다.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>정산월</TableHead>
                    <TableHead>총액</TableHead>
                    <TableHead>수수료</TableHead>
                    <TableHead>순액</TableHead>
                    <TableHead>정산일</TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">2025년 4월</TableCell>
                    <TableCell>₩2,130,000</TableCell>
                    <TableCell>₩213,000</TableCell>
                    <TableCell>₩1,917,000</TableCell>
                    <TableCell>2025.04.25</TableCell>
                    <TableCell>완료</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2025년 3월</TableCell>
                    <TableCell>₩1,800,000</TableCell>
                    <TableCell>₩180,000</TableCell>
                    <TableCell>₩1,620,000</TableCell>
                    <TableCell>2025.03.25</TableCell>
                    <TableCell>완료</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2025년 2월</TableCell>
                    <TableCell>₩1,750,000</TableCell>
                    <TableCell>₩175,000</TableCell>
                    <TableCell>₩1,575,000</TableCell>
                    <TableCell>2025.02.25</TableCell>
                    <TableCell>완료</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <DialogFooter>
              <Button variant="outline" className="mr-2">명세서 다운로드</Button>
              <Button onClick={closeModal}>닫기</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
