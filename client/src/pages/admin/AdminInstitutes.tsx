import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Filter, Plus, Eye, Edit, Trash2, Building, MapPin, Users } from "lucide-react";
import { useState } from "react";

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

  // 샘플 기관 데이터
  const institutes = [
    {
      id: 1,
      name: "서울반려견아카데미",
      code: "INST001",
      location: "서울시 강남구",
      director: "김원장",
      phone: "02-1234-5678",
      email: "admin@seoul-pet.com",
      status: "active",
      trainersCount: 15,
      studentsCount: 234,
      establishedDate: "2020-03-15",
      lastActivity: "2024-01-20"
    },
    {
      id: 2,
      name: "부산펫트레이닝센터",
      code: "INST002", 
      location: "부산시 해운대구",
      director: "이관리",
      phone: "051-987-6543",
      email: "contact@busan-pet.com",
      status: "active",
      trainersCount: 8,
      studentsCount: 156,
      establishedDate: "2019-07-22",
      lastActivity: "2024-01-19"
    },
    {
      id: 3,
      name: "대구동물교육원",
      code: "INST003",
      location: "대구시 중구",
      director: "박센터장",
      phone: "053-555-1234",
      email: "info@daegu-animal.com",
      status: "inactive",
      trainersCount: 5,
      studentsCount: 89,
      establishedDate: "2021-01-10",
      lastActivity: "2024-01-15"
    }
  ];

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
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          새 기관 등록
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 기관 수</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{institutes.length}</div>
            <p className="text-xs text-muted-foreground">
              활성 {institutes.filter(i => i.status === 'active').length}개
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
              {institutes.reduce((total, inst) => total + inst.trainersCount, 0)}
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
              {institutes.reduce((total, inst) => total + inst.studentsCount, 0)}
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
              {Math.round(institutes.reduce((total, inst) => total + inst.trainersCount, 0) / institutes.length)}명
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
            {institutes.map((institute) => (
              <div key={institute.id} className="grid grid-cols-8 gap-4 p-4 border-b last:border-b-0">
                <div>
                  <div className="font-medium">{institute.name}</div>
                  <div className="text-sm text-muted-foreground">{institute.email}</div>
                </div>
                <div className="font-mono text-sm">{institute.code}</div>
                <div>
                  <div className="font-medium">{institute.director}</div>
                  <div className="text-sm text-muted-foreground">{institute.phone}</div>
                </div>
                <div className="text-sm flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {institute.location}
                </div>
                <div className="text-center font-medium">{institute.trainersCount}명</div>
                <div className="text-center font-medium">{institute.studentsCount}명</div>
                <div>{getStatusBadge(institute.status)}</div>
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}