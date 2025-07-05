import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Filter, Plus, Eye, Edit, Trash2, Building, MapPin, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export default function AdminInstitutes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddInstituteOpen, setIsAddInstituteOpen] = useState(false);
  const [newInstitute, setNewInstitute] = useState({
    name: "",
    code: "",
    location: "",
    director: "",
    phone: "",
    email: ""
  });

  // 기관 추가 함수
  const handleAddInstitute = () => {
    if (!newInstitute.name || !newInstitute.code || !newInstitute.director || !newInstitute.email) {
      alert("필수 필드를 모두 입력해주세요.");
      return;
    }
    
    console.log("새 기관 추가:", newInstitute);
    // 여기서 실제 API 호출 구현
    
    // 폼 초기화
    setNewInstitute({
      name: "",
      code: "",
      location: "",
      director: "",
      phone: "",
      email: ""
    });
    setIsAddInstituteOpen(false);
  };

  // 실제 기관 데이터 가져오기
  const { data: institutesData, isLoading, error } = useQuery({
    queryKey: ['/api/institutes'],
    staleTime: 5 * 60 * 1000, // 5분
  });

  const institutes = institutesData || [];

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">기관 정보를 불러올 수 없습니다</h2>
            <p className="text-muted-foreground">잠시 후 다시 시도해주세요.</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">활성</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">비활성</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">정지</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">기관 관리</h1>
          <p className="text-muted-foreground">등록된 훈련 기관들을 관리합니다</p>
        </div>
        <Dialog open={isAddInstituteOpen} onOpenChange={setIsAddInstituteOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              새 기관 등록
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>새 기관 등록</DialogTitle>
              <DialogDescription>
                새로운 훈련 기관을 플랫폼에 등록합니다.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  기관명 *
                </Label>
                <Input
                  id="name"
                  value={newInstitute.name}
                  onChange={(e) => setNewInstitute({ ...newInstitute, name: e.target.value })}
                  className="col-span-3"
                  placeholder="서울반려견아카데미"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  기관코드 *
                </Label>
                <Input
                  id="code"
                  value={newInstitute.code}
                  onChange={(e) => setNewInstitute({ ...newInstitute, code: e.target.value })}
                  className="col-span-3"
                  placeholder="INST001"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="director" className="text-right">
                  원장명 *
                </Label>
                <Input
                  id="director"
                  value={newInstitute.director}
                  onChange={(e) => setNewInstitute({ ...newInstitute, director: e.target.value })}
                  className="col-span-3"
                  placeholder="김원장"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  이메일 *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newInstitute.email}
                  onChange={(e) => setNewInstitute({ ...newInstitute, email: e.target.value })}
                  className="col-span-3"
                  placeholder="admin@institute.com"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  연락처
                </Label>
                <Input
                  id="phone"
                  value={newInstitute.phone}
                  onChange={(e) => setNewInstitute({ ...newInstitute, phone: e.target.value })}
                  className="col-span-3"
                  placeholder="02-1234-5678"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  주소
                </Label>
                <Input
                  id="location"
                  value={newInstitute.location}
                  onChange={(e) => setNewInstitute({ ...newInstitute, location: e.target.value })}
                  className="col-span-3"
                  placeholder="서울시 강남구"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddInstitute}>
                기관 등록
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 기관 수</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Array.isArray(institutes) ? institutes.length : 0}</div>
            <p className="text-xs text-muted-foreground">
              활성 {Array.isArray(institutes) ? institutes.filter((i: any) => i.isActive === true).length : 0}개
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 훈련사</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.isArray(institutes) ? institutes.reduce((total: number, inst: any) => total + (inst.trainersCount || (inst.trainerId ? 1 : 0)), 0) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              전체 기관 소속
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 교육생</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.isArray(institutes) ? institutes.reduce((total: number, inst: any) => total + (inst.studentsCount || 0), 0) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              모든 기관 합계
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 규모</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.isArray(institutes) && institutes.length > 0 ? 
                Math.round(institutes.reduce((total: number, inst: any) => total + (inst.trainersCount || (inst.trainerId ? 1 : 0)), 0) / institutes.length) : 0}명
            </div>
            <p className="text-xs text-muted-foreground">
              기관당 평균 훈련사
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardHeader>
          <CardTitle>기관 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="기관명, 코드, 원장명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="active">활성</SelectItem>
                <SelectItem value="inactive">비활성</SelectItem>
                <SelectItem value="suspended">정지</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              고급 필터
            </Button>
          </div>

          {/* 기관 테이블 */}
          <div className="border rounded-lg">
            <div className="grid grid-cols-8 gap-4 p-4 font-medium border-b bg-muted/50">
              <div>기관명</div>
              <div>코드</div>
              <div>원장</div>
              <div>위치</div>
              <div>훈련사</div>
              <div>교육생</div>
              <div>상태</div>
              <div>작업</div>
            </div>
            {Array.isArray(institutes) && institutes.length > 0 ? (
              institutes.map((institute: any) => (
                <div key={institute.id} className="grid grid-cols-8 gap-4 p-4 border-b last:border-b-0">
                  <div>
                    <div className="font-medium">{institute.name || '이름 없음'}</div>
                    <div className="text-sm text-muted-foreground">{institute.email || '-'}</div>
                  </div>
                  <div className="font-mono text-sm">{institute.code || '-'}</div>
                  <div>
                    <div className="font-medium">{institute.trainerName || institute.director || '미지정'}</div>
                    <div className="text-sm text-muted-foreground">{institute.phone || '-'}</div>
                  </div>
                  <div className="text-sm flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {institute.address || institute.location || '위치 미지정'}
                  </div>
                  <div className="text-center font-medium">
                    {institute.trainersCount || (institute.trainerId ? 1 : 0)}명
                  </div>
                  <div className="text-center font-medium">
                    {institute.studentsCount || 0}명
                  </div>
                  <div>{getStatusBadge(institute.isActive ? 'active' : 'inactive')}</div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        console.log('기관 상세보기:', institute.name);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        console.log('기관 편집:', institute.name);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        console.log('기관 삭제:', institute.name);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                등록된 기관이 없습니다.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}