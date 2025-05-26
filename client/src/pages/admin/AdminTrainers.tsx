import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Filter, Plus, Eye, Edit, Trash2, GraduationCap, MapPin, Star } from "lucide-react";
import { useState } from "react";

export default function AdminTrainers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddTrainerOpen, setIsAddTrainerOpen] = useState(false);
  const [newTrainer, setNewTrainer] = useState({
    name: "",
    email: "",
    phone: "",
    institute: "",
    certification: "",
    experience: "",
    specialties: ""
  });

  // 훈련사 추가 함수
  const handleAddTrainer = () => {
    if (!newTrainer.name || !newTrainer.email || !newTrainer.institute || !newTrainer.certification) {
      alert("필수 필드를 모두 입력해주세요.");
      return;
    }
    
    console.log("새 훈련사 추가:", newTrainer);
    // 여기서 실제 API 호출 구현
    
    // 폼 초기화
    setNewTrainer({
      name: "",
      email: "",
      phone: "",
      institute: "",
      certification: "",
      experience: "",
      specialties: ""
    });
    setIsAddTrainerOpen(false);
  };

  // 샘플 훈련사 데이터
  const trainers = [
    {
      id: 1,
      name: "김훈련사",
      email: "kim.trainer@example.com",
      phone: "010-1234-5678",
      institute: "서울반려견아카데미",
      certification: "국제반려견훈련사 1급",
      experience: "5년",
      specialties: ["기본 순종", "문제행동 교정", "어질리티"],
      rating: 4.8,
      studentsCount: 45,
      status: "active",
      joinDate: "2020-03-15"
    },
    {
      id: 2,
      name: "이전문가",
      email: "lee.expert@example.com",
      phone: "010-9876-5432",
      institute: "부산펫트레이닝센터",
      certification: "KKF 공인 훈련사",
      experience: "8년",
      specialties: ["공격성 교정", "분리불안", "사회화"],
      rating: 4.9,
      studentsCount: 62,
      status: "active",
      joinDate: "2018-07-22"
    },
    {
      id: 3,
      name: "박마스터",
      email: "park.master@example.com",
      phone: "010-5555-1234",
      institute: "대구동물교육원",
      certification: "동물행동학 전문가",
      experience: "10년",
      specialties: ["고급 훈련", "치료견 훈련", "컨설팅"],
      rating: 4.7,
      studentsCount: 38,
      status: "inactive",
      joinDate: "2016-01-10"
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

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="ml-1 text-sm font-medium">{rating}</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">훈련사 관리</h1>
          <p className="text-muted-foreground">등록된 훈련사들을 관리합니다</p>
        </div>
        <Dialog open={isAddTrainerOpen} onOpenChange={setIsAddTrainerOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              새 훈련사 등록
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>새 훈련사 등록</DialogTitle>
              <DialogDescription>
                새로운 훈련사를 플랫폼에 등록합니다.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trainer-name" className="text-right">
                  이름 *
                </Label>
                <Input
                  id="trainer-name"
                  value={newTrainer.name}
                  onChange={(e) => setNewTrainer({ ...newTrainer, name: e.target.value })}
                  className="col-span-3"
                  placeholder="김훈련사"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trainer-email" className="text-right">
                  이메일 *
                </Label>
                <Input
                  id="trainer-email"
                  type="email"
                  value={newTrainer.email}
                  onChange={(e) => setNewTrainer({ ...newTrainer, email: e.target.value })}
                  className="col-span-3"
                  placeholder="trainer@example.com"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trainer-phone" className="text-right">
                  연락처
                </Label>
                <Input
                  id="trainer-phone"
                  value={newTrainer.phone}
                  onChange={(e) => setNewTrainer({ ...newTrainer, phone: e.target.value })}
                  className="col-span-3"
                  placeholder="010-1234-5678"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trainer-institute" className="text-right">
                  소속 기관 *
                </Label>
                <Input
                  id="trainer-institute"
                  value={newTrainer.institute}
                  onChange={(e) => setNewTrainer({ ...newTrainer, institute: e.target.value })}
                  className="col-span-3"
                  placeholder="서울반려견아카데미"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trainer-certification" className="text-right">
                  자격증 *
                </Label>
                <Input
                  id="trainer-certification"
                  value={newTrainer.certification}
                  onChange={(e) => setNewTrainer({ ...newTrainer, certification: e.target.value })}
                  className="col-span-3"
                  placeholder="국제반려견훈련사 1급"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trainer-experience" className="text-right">
                  경력
                </Label>
                <Input
                  id="trainer-experience"
                  value={newTrainer.experience}
                  onChange={(e) => setNewTrainer({ ...newTrainer, experience: e.target.value })}
                  className="col-span-3"
                  placeholder="5년"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trainer-specialties" className="text-right">
                  전문 분야
                </Label>
                <Textarea
                  id="trainer-specialties"
                  value={newTrainer.specialties}
                  onChange={(e) => setNewTrainer({ ...newTrainer, specialties: e.target.value })}
                  className="col-span-3"
                  placeholder="기본 순종, 문제행동 교정, 어질리티"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddTrainer}>
                훈련사 등록
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 훈련사</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainers.length}</div>
            <p className="text-xs text-muted-foreground">
              활성 {trainers.filter(t => t.status === 'active').length}명
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 교육생</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trainers.reduce((total, trainer) => total + trainer.studentsCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              모든 훈련사 담당
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 평점</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(trainers.reduce((total, trainer) => total + trainer.rating, 0) / trainers.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              5점 만점 기준
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 경력</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(trainers.reduce((total, trainer) => total + parseInt(trainer.experience), 0) / trainers.length)}년
            </div>
            <p className="text-xs text-muted-foreground">
              전체 평균
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardHeader>
          <CardTitle>훈련사 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="훈련사명, 기관명, 전문분야로 검색..."
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

          {/* 훈련사 테이블 */}
          <div className="border rounded-lg">
            <div className="grid grid-cols-8 gap-4 p-4 font-medium border-b bg-muted/50">
              <div>훈련사</div>
              <div>소속 기관</div>
              <div>자격증</div>
              <div>경력</div>
              <div>전문분야</div>
              <div>평점</div>
              <div>상태</div>
              <div>작업</div>
            </div>
            {trainers.map((trainer) => (
              <div key={trainer.id} className="grid grid-cols-8 gap-4 p-4 border-b last:border-b-0">
                <div>
                  <div className="font-medium">{trainer.name}</div>
                  <div className="text-sm text-muted-foreground">{trainer.email}</div>
                  <div className="text-sm text-muted-foreground">{trainer.phone}</div>
                </div>
                <div className="text-sm">{trainer.institute}</div>
                <div>
                  <div className="text-sm font-medium">{trainer.certification}</div>
                  <div className="text-xs text-muted-foreground">경력 {trainer.experience}</div>
                </div>
                <div className="text-center font-medium">{trainer.experience}</div>
                <div className="text-xs">
                  {trainer.specialties.slice(0, 2).map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="mr-1 mb-1 text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {trainer.specialties.length > 2 && (
                    <span className="text-muted-foreground">+{trainer.specialties.length - 2}</span>
                  )}
                </div>
                <div>{getRatingStars(trainer.rating)}</div>
                <div>{getStatusBadge(trainer.status)}</div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      console.log('훈련사 상세보기:', trainer.name);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      console.log('훈련사 편집:', trainer.name);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      console.log('훈련사 삭제:', trainer.name);
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