import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function SpringBootTestPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // 사용자 생성 폼 상태
  const [userForm, setUserForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    bio: ''
  });

  // 반려동물 생성 폼 상태
  const [petForm, setPetForm] = useState({
    name: '',
    breed: '',
    age: 1,
    description: ''
  });

  // Spring Boot 스타일 API 쿼리들
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/spring/users'],
    queryFn: () => fetch('/api/spring/users').then(res => res.json())
  });

  const { data: pets, isLoading: petsLoading } = useQuery({
    queryKey: ['/api/spring/pets'],
    queryFn: () => fetch('/api/spring/pets').then(res => res.json())
  });

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['/api/spring/courses'],
    queryFn: () => fetch('/api/spring/courses').then(res => res.json())
  });

  const { data: healthStatus } = useQuery({
    queryKey: ['/actuator/health'],
    queryFn: () => fetch('/actuator/health').then(res => res.json()),
    refetchInterval: 10000 // 10초마다 헬스 체크
  });

  // 사용자 생성 뮤테이션
  const createUserMutation = useMutation({
    mutationFn: (userData: typeof userForm) => 
      apiRequest('/api/spring/users', {
        method: 'POST',
        body: userData
      }),
    onSuccess: () => {
      toast({
        title: '성공',
        description: 'Spring Boot 스타일로 사용자가 생성되었습니다.'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/spring/users'] });
      setUserForm({ name: '', username: '', email: '', password: '', bio: '' });
    },
    onError: (error: any) => {
      toast({
        title: '오류',
        description: error.message || '사용자 생성에 실패했습니다.',
        variant: 'destructive'
      });
    }
  });

  // 반려동물 생성 뮤테이션
  const createPetMutation = useMutation({
    mutationFn: (petData: typeof petForm) => 
      apiRequest('/api/spring/pets', {
        method: 'POST',
        body: petData
      }),
    onSuccess: () => {
      toast({
        title: '성공',
        description: 'Spring Boot 스타일로 반려동물이 생성되었습니다.'
      });
      queryClient.invalidateQueries({ queryKey: ['/api/spring/pets'] });
      setPetForm({ name: '', breed: '', age: 1, description: '' });
    },
    onError: (error: any) => {
      toast({
        title: '오류',
        description: error.message || '반려동물 생성에 실패했습니다.',
        variant: 'destructive'
      });
    }
  });

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUserMutation.mutate(userForm);
  };

  const handlePetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPetMutation.mutate(petForm);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Spring Boot 스타일 API 테스트</h1>
        <Badge variant={healthStatus?.status === 'UP' ? 'default' : 'destructive'}>
          {healthStatus?.status || 'UNKNOWN'} - {healthStatus?.service}
        </Badge>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">사용자</TabsTrigger>
          <TabsTrigger value="pets">반려동물</TabsTrigger>
          <TabsTrigger value="courses">강좌</TabsTrigger>
          <TabsTrigger value="health">시스템 상태</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 사용자 생성 폼 */}
            <Card>
              <CardHeader>
                <CardTitle>사용자 생성 (Spring Boot 스타일)</CardTitle>
                <CardDescription>
                  /api/spring/users POST 엔드포인트 테스트
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUserSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">이름</Label>
                    <Input
                      id="name"
                      value={userForm.name}
                      onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                      placeholder="사용자 이름"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">사용자명</Label>
                    <Input
                      id="username"
                      value={userForm.username}
                      onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                      placeholder="사용자명"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                      placeholder="이메일 주소"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">비밀번호</Label>
                    <Input
                      id="password"
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                      placeholder="비밀번호"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">소개</Label>
                    <Textarea
                      id="bio"
                      value={userForm.bio}
                      onChange={(e) => setUserForm({...userForm, bio: e.target.value})}
                      placeholder="간단한 소개"
                    />
                  </div>
                  <Button type="submit" disabled={createUserMutation.isPending}>
                    {createUserMutation.isPending ? '생성 중...' : '사용자 생성'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* 사용자 목록 */}
            <Card>
              <CardHeader>
                <CardTitle>사용자 목록</CardTitle>
                <CardDescription>
                  /api/spring/users GET 엔드포인트 결과
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div>로딩 중...</div>
                ) : (
                  <div className="space-y-2">
                    {users?.data?.map((user: any) => (
                      <div key={user.id} className="p-3 border rounded-lg">
                        <div className="font-medium">{user.name} (@{user.username})</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                        <div className="text-xs text-gray-500">역할: {user.role}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pets" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 반려동물 생성 폼 */}
            <Card>
              <CardHeader>
                <CardTitle>반려동물 생성 (Spring Boot 스타일)</CardTitle>
                <CardDescription>
                  /api/spring/pets POST 엔드포인트 테스트
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePetSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="petName">이름</Label>
                    <Input
                      id="petName"
                      value={petForm.name}
                      onChange={(e) => setPetForm({...petForm, name: e.target.value})}
                      placeholder="반려동물 이름"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="breed">품종</Label>
                    <Input
                      id="breed"
                      value={petForm.breed}
                      onChange={(e) => setPetForm({...petForm, breed: e.target.value})}
                      placeholder="품종"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">나이</Label>
                    <Input
                      id="age"
                      type="number"
                      value={petForm.age}
                      onChange={(e) => setPetForm({...petForm, age: parseInt(e.target.value)})}
                      min="0"
                      max="30"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">설명</Label>
                    <Textarea
                      id="description"
                      value={petForm.description}
                      onChange={(e) => setPetForm({...petForm, description: e.target.value})}
                      placeholder="반려동물 설명"
                    />
                  </div>
                  <Button type="submit" disabled={createPetMutation.isPending}>
                    {createPetMutation.isPending ? '생성 중...' : '반려동물 생성'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* 반려동물 목록 */}
            <Card>
              <CardHeader>
                <CardTitle>반려동물 목록</CardTitle>
                <CardDescription>
                  /api/spring/pets GET 엔드포인트 결과
                </CardDescription>
              </CardHeader>
              <CardContent>
                {petsLoading ? (
                  <div>로딩 중...</div>
                ) : (
                  <div className="space-y-2">
                    {pets?.data?.length > 0 ? (
                      pets.data.map((pet: any) => (
                        <div key={pet.id} className="p-3 border rounded-lg">
                          <div className="font-medium">{pet.name}</div>
                          <div className="text-sm text-gray-600">{pet.breed} - {pet.age}세</div>
                          {pet.description && (
                            <div className="text-xs text-gray-500">{pet.description}</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500">등록된 반려동물이 없습니다.</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>강좌 목록</CardTitle>
              <CardDescription>
                /api/spring/courses GET 엔드포인트 결과
              </CardDescription>
            </CardHeader>
            <CardContent>
              {coursesLoading ? (
                <div>로딩 중...</div>
              ) : (
                <div className="space-y-2">
                  {courses?.data?.length > 0 ? (
                    courses.data.map((course: any) => (
                      <div key={course.id} className="p-3 border rounded-lg">
                        <div className="font-medium">{course.title}</div>
                        <div className="text-sm text-gray-600">{course.description}</div>
                        <div className="text-xs text-gray-500">
                          훈련사 ID: {course.trainerId} | 가격: {course.price ? `${course.price}원` : '무료'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">등록된 강좌가 없습니다.</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>시스템 헬스 상태</CardTitle>
              <CardDescription>
                /actuator/health 엔드포인트 결과 (10초마다 자동 갱신)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {healthStatus ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant={healthStatus.status === 'UP' ? 'default' : 'destructive'}>
                      {healthStatus.status}
                    </Badge>
                    <span className="font-medium">{healthStatus.service}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    마지막 업데이트: {new Date(healthStatus.timestamp).toLocaleString()}
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <pre className="text-sm">{JSON.stringify(healthStatus, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div>헬스 상태를 확인하는 중...</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}