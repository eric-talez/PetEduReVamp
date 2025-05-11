import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  PlusCircle,
  UserRoundCheck,
  PawPrint,
  Check,
  X,
  Sparkles,
  Undo2,
  MessageSquare,
  Calendar,
  Filter,
  CheckCircle2,
  BarChart4
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// 훈련사 정보 인터페이스
interface Trainer {
  id: number;
  name: string;
  image?: string;
  specialty: string;
  rating: number;
  activeStudents: number;
  maxCapacity: number;
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  skills: string[];
}

// 반려견 정보 인터페이스
interface Pet {
  id: number;
  name: string;
  breed: string;
  age: number;
  owner: {
    id: number;
    name: string;
    image?: string;
  };
  image?: string;
  issues: string[];
  goals: string[];
  status: 'unassigned' | 'assigned' | 'completed';
  assignedTrainer?: number;
  compatibility?: Record<number, number>; // 훈련사 ID와 호환성 점수
}

// 매칭 결과 인터페이스
interface Assignment {
  id: number;
  petId: number;
  trainerId: number;
  status: 'active' | 'pending' | 'completed';
  startDate: string;
  endDate?: string;
  progress: number;
  matchScore: number;
}

export default function InstitutePetAssignments() {
  const { userName } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('unassigned');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterBreed, setFilterBreed] = useState<string | null>(null);
  const [filterSpecialty, setFilterSpecialty] = useState<string | null>(null);
  
  // 상태 관리
  const [pets, setPets] = useState<Pet[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);
  
  // 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // 실제 API 구현 시 이 부분을 API 호출로 대체
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 임시 훈련사 데이터
        const mockTrainers: Trainer[] = [
          {
            id: 1,
            name: '김영수',
            specialty: '기초 훈련',
            rating: 4.8,
            activeStudents: 12,
            maxCapacity: 15,
            availability: {
              monday: true,
              tuesday: true,
              wednesday: true,
              thursday: false,
              friday: true,
              saturday: true,
              sunday: false
            },
            skills: ['기초 복종', '사회화', '매너 교육']
          },
          {
            id: 2,
            name: '박지민',
            specialty: '문제행동 교정',
            rating: 4.7,
            activeStudents: 8,
            maxCapacity: 10,
            availability: {
              monday: true,
              tuesday: true,
              wednesday: false,
              thursday: true,
              friday: true,
              saturday: false,
              sunday: false
            },
            skills: ['공격성 관리', '분리불안', '과도한 짖음']
          },
          {
            id: 3,
            name: '이하은',
            specialty: '사회화',
            rating: 4.9,
            activeStudents: 6,
            maxCapacity: 12,
            availability: {
              monday: false,
              tuesday: true,
              wednesday: true,
              thursday: true,
              friday: false,
              saturday: true,
              sunday: true
            },
            skills: ['다른 동물과 사회화', '낯선 환경 적응', '불안 관리']
          }
        ];
        
        // 임시 반려견 데이터
        const mockPets: Pet[] = [
          {
            id: 1,
            name: '코코',
            breed: '푸들',
            age: 2,
            owner: {
              id: 101,
              name: '김철수'
            },
            issues: ['기본 명령어 부족', '낯선 사람 경계'],
            goals: ['기본 훈련 완료', '사회화'],
            status: 'unassigned',
            compatibility: {
              1: 85,
              2: 60,
              3: 75
            }
          },
          {
            id: 2,
            name: '몽이',
            breed: '말티즈',
            age: 3,
            owner: {
              id: 102,
              name: '박지영'
            },
            issues: ['분리불안', '과도한 짖음'],
            goals: ['분리불안 완화', '안정적인 행동'],
            status: 'unassigned',
            compatibility: {
              1: 65,
              2: 90,
              3: 70
            }
          },
          {
            id: 3,
            name: '해피',
            breed: '비숑',
            age: 1,
            owner: {
              id: 103,
              name: '정민지'
            },
            issues: ['산책 시 끌기', '물건 씹기'],
            goals: ['줄 당김 없이 산책', '집안 물건 보존'],
            status: 'assigned',
            assignedTrainer: 1,
            compatibility: {
              1: 80,
              2: 75,
              3: 65
            }
          },
          {
            id: 4,
            name: '뽀삐',
            breed: '골든리트리버',
            age: 4,
            owner: {
              id: 104,
              name: '최준호'
            },
            issues: ['다른 개에 대한 공격성', '명령 무시'],
            goals: ['다른 개와 평화롭게 지내기', '명령 준수'],
            status: 'assigned',
            assignedTrainer: 2,
            compatibility: {
              1: 60,
              2: 85,
              3: 55
            }
          },
          {
            id: 5,
            name: '달래',
            breed: '시바견',
            age: 2,
            owner: {
              id: 105,
              name: '이미나'
            },
            issues: ['낯선 환경 불안', '사람 경계'],
            goals: ['자신감 향상', '사회성 증진'],
            status: 'completed',
            assignedTrainer: 3,
            compatibility: {
              1: 70,
              2: 65,
              3: 90
            }
          }
        ];
        
        // 임시 매칭 데이터
        const mockAssignments: Assignment[] = [
          {
            id: 1,
            petId: 3,
            trainerId: 1,
            status: 'active',
            startDate: '2023-04-15',
            progress: 60,
            matchScore: 80
          },
          {
            id: 2,
            petId: 4,
            trainerId: 2,
            status: 'active',
            startDate: '2023-03-20',
            progress: 75,
            matchScore: 85
          },
          {
            id: 3,
            petId: 5,
            trainerId: 3,
            status: 'completed',
            startDate: '2023-01-10',
            endDate: '2023-03-05',
            progress: 100,
            matchScore: 90
          }
        ];
        
        setTrainers(mockTrainers);
        setPets(mockPets);
        setAssignments(mockAssignments);
      } catch (error) {
        toast({
          title: "데이터 로딩 오류",
          description: "반려견 및 훈련사 정보를 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);
  
  // 자동 매칭 시뮬레이션
  const performAutoMatch = async (petId: number) => {
    setIsLoadingMatches(true);
    
    try {
      // 실제 API 구현 시 이 부분을 API 호출로 대체
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const pet = pets.find(p => p.id === petId);
      if (!pet || !pet.compatibility) return;
      
      // 호환성 점수에 따라 최적의 훈련사 찾기
      const bestTrainerId = Object.entries(pet.compatibility)
        .sort((a, b) => b[1] - a[1])[0][0];
      
      const bestTrainer = trainers.find(t => t.id === parseInt(bestTrainerId));
      if (!bestTrainer) return;
      
      setSelectedPet(pet);
      setSelectedTrainer(bestTrainer);
      setShowAssignDialog(true);
    } catch (error) {
      toast({
        title: "매칭 오류",
        description: "자동 매칭 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMatches(false);
    }
  };
  
  // 수동 매칭 - 훈련사 선택
  const selectTrainerForPet = (pet: Pet, trainer: Trainer) => {
    setSelectedPet(pet);
    setSelectedTrainer(trainer);
    setShowAssignDialog(true);
  };
  
  // 매칭 확정 처리
  const confirmAssignment = () => {
    if (!selectedPet || !selectedTrainer) return;
    
    // 새 매칭 생성
    const newAssignment: Assignment = {
      id: assignments.length + 1,
      petId: selectedPet.id,
      trainerId: selectedTrainer.id,
      status: 'active',
      startDate: new Date().toISOString().slice(0, 10),
      progress: 0,
      matchScore: selectedPet.compatibility?.[selectedTrainer.id] || 0
    };
    
    // 반려견 상태 업데이트
    setPets(prev => prev.map(pet => 
      pet.id === selectedPet.id 
        ? { ...pet, status: 'assigned', assignedTrainer: selectedTrainer.id } 
        : pet
    ));
    
    // 매칭 추가
    setAssignments(prev => [...prev, newAssignment]);
    
    toast({
      title: "매칭 성공",
      description: `${selectedPet.name}와(과) ${selectedTrainer.name} 훈련사의 매칭이 완료되었습니다.`,
    });
    
    setShowAssignDialog(false);
  };
  
  // 매칭 취소 처리
  const cancelAssignment = (petId: number) => {
    // 관련 매칭 찾기
    const assignment = assignments.find(a => a.petId === petId && a.status === 'active');
    if (!assignment) return;
    
    // 반려견 상태 업데이트
    setPets(prev => prev.map(pet => 
      pet.id === petId 
        ? { ...pet, status: 'unassigned', assignedTrainer: undefined } 
        : pet
    ));
    
    // 매칭 상태 업데이트
    setAssignments(prev => prev.filter(a => a.id !== assignment.id));
    
    toast({
      title: "매칭 취소",
      description: "훈련사 매칭이 취소되었습니다.",
    });
  };
  
  // 데이터 필터링 및 페이지네이션
  const getFilteredPets = () => {
    let filtered = [...pets];
    
    // 탭에 따른 필터링
    if (activeTab === 'unassigned') {
      filtered = filtered.filter(pet => pet.status === 'unassigned');
    } else if (activeTab === 'assigned') {
      filtered = filtered.filter(pet => pet.status === 'assigned');
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(pet => pet.status === 'completed');
    }
    
    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(pet => 
        pet.name.toLowerCase().includes(query) || 
        pet.breed.toLowerCase().includes(query) ||
        pet.owner.name.toLowerCase().includes(query)
      );
    }
    
    // 견종 필터링
    if (filterBreed) {
      filtered = filtered.filter(pet => pet.breed === filterBreed);
    }
    
    return filtered;
  };
  
  const getFilteredTrainers = () => {
    let filtered = [...trainers];
    
    // 전문 분야 필터링
    if (filterSpecialty) {
      filtered = filtered.filter(trainer => trainer.specialty === filterSpecialty);
    }
    
    // 수강생 수 필터링 (여유가 있는 훈련사만)
    filtered = filtered.filter(trainer => trainer.activeStudents < trainer.maxCapacity);
    
    return filtered;
  };
  
  // 페이지네이션 처리
  const filteredPets = getFilteredPets();
  const filteredTrainers = getFilteredTrainers();
  const totalPages = Math.ceil(filteredPets.length / itemsPerPage);
  const paginatedPets = filteredPets.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  
  // 새로고침 핸들러
  const handleRefresh = () => {
    setIsLoading(true);
    
    // 실제 구현에서는 API 호출로 데이터 가져오기
    setTimeout(() => {
      toast({
        title: "데이터 새로고침",
        description: "매칭 정보가 업데이트되었습니다.",
      });
      setIsLoading(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">반려견-훈련사 매칭 데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">반려견-훈련사 매칭</h1>
          <p className="text-muted-foreground mt-1">반려견과 전문 훈련사의 최적 매칭을 관리합니다.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="default" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            데이터 새로고침
          </Button>
          <Button variant="outline" onClick={() => toast({
            title: "자동 매칭 실행",
            description: "모든 미할당 반려견에 대한 자동 매칭을 실행합니다.",
          })}>
            <Sparkles className="h-4 w-4 mr-2" />
            일괄 자동 매칭
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-primary">{pets.filter(p => p.status === 'unassigned').length}</span>
              <span className="text-sm text-muted-foreground mt-2">미할당 반려견</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-green-600 dark:text-green-500">{pets.filter(p => p.status === 'assigned').length}</span>
              <span className="text-sm text-muted-foreground mt-2">훈련 중인 반려견</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-blue-600 dark:text-blue-500">{pets.filter(p => p.status === 'completed').length}</span>
              <span className="text-sm text-muted-foreground mt-2">훈련 완료</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-amber-600 dark:text-amber-500">
                {trainers.reduce((sum, trainer) => sum + (trainer.maxCapacity - trainer.activeStudents), 0)}
              </span>
              <span className="text-sm text-muted-foreground mt-2">가용 훈련사 자리</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="unassigned" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="unassigned">미할당 ({pets.filter(p => p.status === 'unassigned').length})</TabsTrigger>
            <TabsTrigger value="assigned">훈련 중 ({pets.filter(p => p.status === 'assigned').length})</TabsTrigger>
            <TabsTrigger value="completed">완료됨 ({pets.filter(p => p.status === 'completed').length})</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-md px-3 py-1">
              <Search className="h-4 w-4 text-muted-foreground mr-2" />
              <Input 
                placeholder="반려견 또는 견주 검색..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="border-0 h-8 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
              />
            </div>
            
            <Select value={filterBreed || ''} onValueChange={setFilterBreed}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="견종 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 견종</SelectItem>
                <SelectItem value="푸들">푸들</SelectItem>
                <SelectItem value="말티즈">말티즈</SelectItem>
                <SelectItem value="비숑">비숑</SelectItem>
                <SelectItem value="골든리트리버">골든리트리버</SelectItem>
                <SelectItem value="시바견">시바견</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="unassigned" className="mt-4 p-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead>반려견</TableHead>
                    <TableHead>견주</TableHead>
                    <TableHead className="hidden md:table-cell">문제 행동</TableHead>
                    <TableHead className="hidden md:table-cell">목표</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPets.length > 0 ? (
                    paginatedPets.map((pet, index) => (
                      <TableRow key={pet.id}>
                        <TableCell className="font-medium w-[50px]">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={pet.image} alt={pet.name} />
                              <AvatarFallback>
                                <PawPrint className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{pet.name}</div>
                              <div className="text-sm text-muted-foreground">{pet.breed}, {pet.age}세</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={pet.owner.image} alt={pet.owner.name} />
                              <AvatarFallback>{pet.owner.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{pet.owner.name}</div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {pet.issues.map((issue, issueIndex) => (
                              <Badge key={issueIndex} variant="outline">{issue}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {pet.goals.map((goal, goalIndex) => (
                              <Badge key={goalIndex} variant="secondary">{goal}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => performAutoMatch(pet.id)}
                              disabled={isLoadingMatches}
                            >
                              {isLoadingMatches ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Sparkles className="h-4 w-4 mr-2" />
                              )}
                              자동 매칭
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedPet(pet);
                                setShowAssignDialog(true);
                              }}
                            >
                              <UserRoundCheck className="h-4 w-4 mr-2" />
                              수동 선택
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        미할당 반려견이 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between py-4">
              <div className="text-sm text-muted-foreground">
                총 {filteredPets.length}마리 중 {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredPets.length)}마리 표시
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentPage} / {totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="assigned" className="mt-4 p-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead>반려견</TableHead>
                    <TableHead>훈련사</TableHead>
                    <TableHead className="hidden md:table-cell">시작일</TableHead>
                    <TableHead className="hidden md:table-cell">진행 상태</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPets.length > 0 ? (
                    paginatedPets.map((pet, index) => {
                      const assignment = assignments.find(a => a.petId === pet.id && a.status === 'active');
                      const trainer = trainers.find(t => t.id === pet.assignedTrainer);
                      
                      if (!assignment || !trainer) return null;
                      
                      return (
                        <TableRow key={pet.id}>
                          <TableCell className="font-medium w-[50px]">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={pet.image} alt={pet.name} />
                                <AvatarFallback>
                                  <PawPrint className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{pet.name}</div>
                                <div className="text-sm text-muted-foreground">{pet.breed}, {pet.age}세</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={trainer.image} alt={trainer.name} />
                                <AvatarFallback>{trainer.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{trainer.name}</div>
                                <div className="text-sm text-muted-foreground">{trainer.specialty}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {assignment.startDate}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>진행률</span>
                                <span>{assignment.progress}%</span>
                              </div>
                              <Progress value={assignment.progress} className="h-2" />
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => cancelAssignment(pet.id)}
                              >
                                <Undo2 className="h-4 w-4 mr-2" />
                                매칭 취소
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                상담 기록
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        훈련 중인 반려견이 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between py-4">
              <div className="text-sm text-muted-foreground">
                총 {filteredPets.length}마리 중 {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredPets.length)}마리 표시
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentPage} / {totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4 p-0">
          {/* 완료된 훈련 목록 */}
        </TabsContent>
      </Tabs>
      
      {/* 훈련사 매칭 다이얼로그 */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>반려견-훈련사 매칭</DialogTitle>
            <DialogDescription>
              {selectedPet ? `${selectedPet.name} (${selectedPet.breed})` : '반려견'}에게 적합한 훈련사를 선택하세요.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPet && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">반려견 정보</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center mb-4">
                      <Avatar className="h-20 w-20 mb-2">
                        <AvatarImage src={selectedPet.image} alt={selectedPet.name} />
                        <AvatarFallback className="text-xl">
                          <PawPrint className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-xl font-semibold">{selectedPet.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedPet.breed}, {selectedPet.age}세</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-1">견주 정보</h4>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={selectedPet.owner.image} alt={selectedPet.owner.name} />
                            <AvatarFallback>{selectedPet.owner.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{selectedPet.owner.name}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold mb-1">문제 행동</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedPet.issues.map((issue, index) => (
                            <Badge key={index} variant="outline">{issue}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold mb-1">훈련 목표</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedPet.goals.map((goal, index) => (
                            <Badge key={index} variant="secondary">{goal}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">추천 훈련사</h3>
                  <div className="flex items-center gap-2">
                    <Select value={filterSpecialty || ''} onValueChange={setFilterSpecialty}>
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="전문 분야 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">모든 분야</SelectItem>
                        <SelectItem value="기초 훈련">기초 훈련</SelectItem>
                        <SelectItem value="문제행동 교정">문제행동 교정</SelectItem>
                        <SelectItem value="사회화">사회화</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {filteredTrainers.length > 0 ? (
                    filteredTrainers.map(trainer => {
                      const compatibility = selectedPet.compatibility?.[trainer.id] || 0;
                      const compatibilityColor = 
                        compatibility >= 80 ? 'text-green-600 dark:text-green-500' : 
                        compatibility >= 60 ? 'text-amber-600 dark:text-amber-500' : 
                        'text-red-600 dark:text-red-500';
                      
                      return (
                        <Card 
                          key={trainer.id} 
                          className={`cursor-pointer ${selectedTrainer?.id === trainer.id ? 'border-primary' : ''}`}
                          onClick={() => setSelectedTrainer(trainer)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center">
                                <Avatar className="h-12 w-12 mr-4">
                                  <AvatarImage src={trainer.image} alt={trainer.name} />
                                  <AvatarFallback>{trainer.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-medium">{trainer.name}</h4>
                                  <p className="text-sm text-muted-foreground">{trainer.specialty}</p>
                                  <div className="flex items-center mt-1">
                                    <div className="text-xs text-muted-foreground">
                                      현재 학생: {trainer.activeStudents}/{trainer.maxCapacity}
                                    </div>
                                    <div className={`ml-4 flex items-center ${compatibilityColor}`}>
                                      <Sparkles className="h-3 w-3 mr-1" />
                                      <span className="text-xs font-medium">호환성: {compatibility}%</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-end">
                                <div className="flex items-center">
                                  <span className="text-sm font-medium">{trainer.rating}</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-500 ml-1">
                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                
                                <div className="flex flex-wrap gap-1 mt-2 justify-end">
                                  {trainer.skills.slice(0, 2).map((skill, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">{skill}</Badge>
                                  ))}
                                  {trainer.skills.length > 2 && (
                                    <Badge variant="outline" className="text-xs">+{trainer.skills.length - 2}</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {selectedTrainer?.id === trainer.id && (
                              <div className="mt-4 pt-4 border-t">
                                <h5 className="text-sm font-medium mb-2">가용 시간</h5>
                                <div className="grid grid-cols-7 gap-1">
                                  {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => {
                                    const availabilityKey = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][index] as keyof typeof trainer.availability;
                                    const isAvailable = trainer.availability[availabilityKey];
                                    
                                    return (
                                      <div 
                                        key={day} 
                                        className={`text-center py-1 text-xs font-medium rounded ${
                                          isAvailable 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                            : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                                        }`}
                                      >
                                        {day}
                                      </div>
                                    );
                                  })}
                                </div>
                                
                                <div className="flex items-center mt-4">
                                  <div className="flex-1">
                                    <p className="text-sm">가능한 시작일: <span className="font-medium">즉시</span></p>
                                  </div>
                                  <Button 
                                    variant="default" 
                                    size="sm"
                                    onClick={() => selectTrainerForPet(selectedPet, trainer)}
                                  >
                                    <Check className="h-4 w-4 mr-2" />
                                    이 훈련사 선택
                                  </Button>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">현재 가용한 훈련사가 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="default" 
              onClick={confirmAssignment}
              disabled={!selectedPet || !selectedTrainer}
            >
              <Check className="h-4 w-4 mr-2" />
              매칭 확정
            </Button>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}