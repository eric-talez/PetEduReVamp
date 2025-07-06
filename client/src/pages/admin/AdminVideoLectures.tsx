import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Upload, 
  BookOpen,
  Clock,
  Users,
  Star,
  Play,
  Settings,
  FileText,
  Package
} from 'lucide-react';

interface LectureMaterial {
  id: string;
  name: string;
  type: 'document' | 'video' | 'audio' | 'image' | 'other';
  url?: string;
  description?: string;
  isRequired: boolean;
}

interface LectureModule {
  id: string;
  title: string;
  description: string;
  duration: number;
  videoUrl: string;
  thumbnailUrl: string;
  transcript: string;
  notes: string;
  objectives: string[];
  materials: string[];
  format: 'theory' | 'practice' | 'theory_practice';
  isCompleted: boolean;
  isFree: boolean;
  order: number;
}

interface VideoLecture {
  id: string;
  title: string;
  instructor: string;
  description: string;
  totalDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  studentCount: number;
  modules: LectureModule[];
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminVideoLectures() {
  const [lectures, setLectures] = useState<VideoLecture[]>([]);
  const [selectedLecture, setSelectedLecture] = useState<VideoLecture | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<LectureModule | null>(null);
  const [activeTab, setActiveTab] = useState('list');
  const { toast } = useToast();

  // 새 강의 생성 폼 상태
  const [newLecture, setNewLecture] = useState({
    title: '',
    instructor: '',
    description: '',
    difficulty: 'beginner' as const,
    category: '',
    price: 0
  });

  // 모듈 자료 상태
  const [moduleMaterials, setModuleMaterials] = useState<LectureMaterial[]>([]);

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      const response = await fetch('/api/admin/video-lectures');
      if (response.ok) {
        const data = await response.json();
        setLectures(data);
      }
    } catch (error) {
      console.error('강의 목록 조회 실패:', error);
    }
  };

  const handleCreateLecture = async () => {
    try {
      const response = await fetch('/api/admin/video-lectures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newLecture,
          status: 'draft',
          modules: []
        })
      });

      if (response.ok) {
        const newLectureData = await response.json();
        setLectures([...lectures, newLectureData]);
        setIsCreateModalOpen(false);
        setNewLecture({
          title: '',
          instructor: '',
          description: '',
          difficulty: 'beginner',
          category: '',
          price: 0
        });
        toast({
          title: "강의 생성 완료",
          description: "새 강의가 성공적으로 생성되었습니다.",
        });
      }
    } catch (error) {
      toast({
        title: "강의 생성 실패",
        description: "강의 생성 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleApprove = async (lectureId: string) => {
    try {
      const response = await fetch(`/api/admin/video-lectures/${lectureId}/approve`, {
        method: 'POST'
      });

      if (response.ok) {
        setLectures(lectures.map(lecture => 
          lecture.id === lectureId 
            ? { ...lecture, status: 'approved' as const }
            : lecture
        ));
        toast({
          title: "강의 승인 완료",
          description: "강의가 승인되어 공개되었습니다.",
        });
      }
    } catch (error) {
      toast({
        title: "승인 실패",
        description: "강의 승인 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (lectureId: string) => {
    try {
      const response = await fetch(`/api/admin/video-lectures/${lectureId}/reject`, {
        method: 'POST'
      });

      if (response.ok) {
        setLectures(lectures.map(lecture => 
          lecture.id === lectureId 
            ? { ...lecture, status: 'rejected' as const }
            : lecture
        ));
        toast({
          title: "강의 반려 완료",
          description: "강의가 반려되었습니다.",
        });
      }
    } catch (error) {
      toast({
        title: "반려 실패",
        description: "강의 반려 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteLecture = async (lectureId: string) => {
    if (!confirm('정말로 이 강의를 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/admin/video-lectures/${lectureId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setLectures(lectures.filter(lecture => lecture.id !== lectureId));
        toast({
          title: "강의 삭제 완료",
          description: "강의가 성공적으로 삭제되었습니다.",
        });
      }
    } catch (error) {
      toast({
        title: "삭제 실패",
        description: "강의 삭제 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleAddMaterial = () => {
    const newMaterial: LectureMaterial = {
      id: Date.now().toString(),
      name: '',
      type: 'document',
      description: '',
      isRequired: false
    };
    setModuleMaterials([...moduleMaterials, newMaterial]);
  };

  const handleUpdateMaterial = (materialId: string, updates: Partial<LectureMaterial>) => {
    setModuleMaterials(moduleMaterials.map(material => 
      material.id === materialId ? { ...material, ...updates } : material
    ));
  };

  const handleRemoveMaterial = (materialId: string) => {
    setModuleMaterials(moduleMaterials.filter(material => material.id !== materialId));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">초안</Badge>;
      case 'pending':
        return <Badge variant="warning">검토중</Badge>;
      case 'approved':
        return <Badge variant="success">승인됨</Badge>;
      case 'rejected':
        return <Badge variant="danger">반려됨</Badge>;
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <Badge variant="default">초급</Badge>;
      case 'intermediate':
        return <Badge variant="secondary">중급</Badge>;
      case 'advanced':
        return <Badge variant="outline">고급</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">영상강의 관리</h1>
        <p className="text-gray-600 dark:text-gray-400">
          강의 등록, 승인, 자료 관리 (관리자 전용)
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">강의 목록</TabsTrigger>
          <TabsTrigger value="pending">승인 대기</TabsTrigger>
          <TabsTrigger value="analytics">통계</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">전체 강의 목록</h2>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  새 강의 생성
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>새 영상강의 생성</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">강의 제목</label>
                    <Input
                      value={newLecture.title}
                      onChange={(e) => setNewLecture({...newLecture, title: e.target.value})}
                      placeholder="강의 제목을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">강사명</label>
                    <Input
                      value={newLecture.instructor}
                      onChange={(e) => setNewLecture({...newLecture, instructor: e.target.value})}
                      placeholder="강사명을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">강의 설명</label>
                    <Textarea
                      value={newLecture.description}
                      onChange={(e) => setNewLecture({...newLecture, description: e.target.value})}
                      placeholder="강의 설명을 입력하세요"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">난이도</label>
                      <Select 
                        value={newLecture.difficulty} 
                        onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                          setNewLecture({...newLecture, difficulty: value})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="난이도 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">초급</SelectItem>
                          <SelectItem value="intermediate">중급</SelectItem>
                          <SelectItem value="advanced">고급</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">카테고리</label>
                      <Input
                        value={newLecture.category}
                        onChange={(e) => setNewLecture({...newLecture, category: e.target.value})}
                        placeholder="카테고리를 입력하세요"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">가격 (원)</label>
                    <Input
                      type="number"
                      value={newLecture.price}
                      onChange={(e) => setNewLecture({...newLecture, price: Number(e.target.value)})}
                      placeholder="0"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      취소
                    </Button>
                    <Button onClick={handleCreateLecture}>
                      생성
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lectures.map((lecture) => (
              <Card key={lecture.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{lecture.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {lecture.instructor} • {lecture.category}
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        {getDifficultyBadge(lecture.difficulty)}
                        {getStatusBadge(lecture.status)}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                    {lecture.description}
                  </p>

                  <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{Math.floor(lecture.totalDuration / 60)}시간</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{lecture.studentCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400" />
                      <span>{lecture.rating}</span>
                    </div>
                  </div>

                  <div className="text-lg font-bold mb-4">
                    ₩{lecture.price.toLocaleString()}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedLecture(lecture)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      상세
                    </Button>
                    
                    {lecture.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => handleApprove(lecture.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          승인
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleReject(lecture.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          반려
                        </Button>
                      </>
                    )}
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteLecture(lecture.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <h2 className="text-xl font-semibold">승인 대기 중인 강의</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lectures.filter(lecture => lecture.status === 'pending').map((lecture) => (
              <Card key={lecture.id} className="border-orange-200 dark:border-orange-800">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{lecture.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {lecture.instructor} • {lecture.category}
                      </p>
                    </div>
                    <Badge variant="warning">검토중</Badge>
                  </div>
                  
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                    {lecture.description}
                  </p>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => handleApprove(lecture.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      승인
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleReject(lecture.id)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      반려
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedLecture(lecture)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      상세보기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <h2 className="text-xl font-semibold">강의 통계</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">전체 강의</p>
                    <p className="text-2xl font-bold">{lectures.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">승인된 강의</p>
                    <p className="text-2xl font-bold">
                      {lectures.filter(l => l.status === 'approved').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">검토 대기</p>
                    <p className="text-2xl font-bold">
                      {lectures.filter(l => l.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">총 수강생</p>
                    <p className="text-2xl font-bold">
                      {lectures.reduce((total, lecture) => total + lecture.studentCount, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* 강의 상세 보기 모달 */}
      {selectedLecture && (
        <Dialog open={!!selectedLecture} onOpenChange={() => setSelectedLecture(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {selectedLecture.title}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">기본 정보</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">강사:</span> {selectedLecture.instructor}</div>
                    <div><span className="font-medium">카테고리:</span> {selectedLecture.category}</div>
                    <div><span className="font-medium">난이도:</span> {getDifficultyBadge(selectedLecture.difficulty)}</div>
                    <div><span className="font-medium">상태:</span> {getStatusBadge(selectedLecture.status)}</div>
                    <div><span className="font-medium">가격:</span> ₩{selectedLecture.price.toLocaleString()}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">통계</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">총 시간:</span> {Math.floor(selectedLecture.totalDuration / 60)}시간</div>
                    <div><span className="font-medium">평점:</span> {selectedLecture.rating} / 5.0</div>
                    <div><span className="font-medium">리뷰 수:</span> {selectedLecture.reviewCount}개</div>
                    <div><span className="font-medium">수강생:</span> {selectedLecture.studentCount}명</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">강의 설명</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {selectedLecture.description}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">강의 모듈 ({selectedLecture.modules.length}개)</h4>
                <div className="space-y-3">
                  {selectedLecture.modules.map((module, index) => (
                    <div key={module.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium">{module.title}</h5>
                        <div className="flex items-center gap-2">
                          <Badge variant={module.format === 'theory' ? 'secondary' : 
                                         module.format === 'practice' ? 'default' : 'outline'}>
                            {module.format === 'theory' ? '이론' : 
                             module.format === 'practice' ? '실습' : '이론+실습'}
                          </Badge>
                          <span className="text-xs text-gray-500">{module.duration}분</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {module.description}
                      </p>
                      
                      {module.materials.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs font-medium text-gray-500">준비물:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {module.materials.map((material, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {material}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 mt-3">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedModule(module);
                            setIsMaterialModalOpen(true);
                          }}
                        >
                          <Package className="h-3 w-3 mr-1" />
                          자료 관리
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3 mr-1" />
                          편집
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                {selectedLecture.status === 'pending' && (
                  <>
                    <Button 
                      variant="default"
                      onClick={() => {
                        handleApprove(selectedLecture.id);
                        setSelectedLecture(null);
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      승인
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        handleReject(selectedLecture.id);
                        setSelectedLecture(null);
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      반려
                    </Button>
                  </>
                )}
                <Button variant="outline" onClick={() => setSelectedLecture(null)}>
                  닫기
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* 자료 관리 모달 */}
      {selectedModule && (
        <Dialog open={isMaterialModalOpen} onOpenChange={setIsMaterialModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {selectedModule.title} - 자료 관리
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">강의 자료 목록</h4>
                <Button size="sm" onClick={handleAddMaterial}>
                  <Plus className="h-4 w-4 mr-1" />
                  자료 추가
                </Button>
              </div>

              <div className="space-y-3">
                {moduleMaterials.map((material) => (
                  <div key={material.id} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium mb-1 block">자료명</label>
                        <Input
                          value={material.name}
                          onChange={(e) => handleUpdateMaterial(material.id, { name: e.target.value })}
                          placeholder="자료명을 입력하세요"
                          size="sm"
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium mb-1 block">자료 유형</label>
                        <Select 
                          value={material.type} 
                          onValueChange={(value: any) => handleUpdateMaterial(material.id, { type: value })}
                        >
                          <SelectTrigger size="sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="document">문서</SelectItem>
                            <SelectItem value="video">동영상</SelectItem>
                            <SelectItem value="audio">오디오</SelectItem>
                            <SelectItem value="image">이미지</SelectItem>
                            <SelectItem value="other">기타</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="text-xs font-medium mb-1 block">설명</label>
                      <Textarea
                        value={material.description || ''}
                        onChange={(e) => handleUpdateMaterial(material.id, { description: e.target.value })}
                        placeholder="자료 설명을 입력하세요"
                        rows={2}
                        className="text-sm"
                      />
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={material.isRequired}
                          onChange={(e) => handleUpdateMaterial(material.id, { isRequired: e.target.checked })}
                          className="rounded"
                        />
                        <label className="text-xs">필수 자료</label>
                      </div>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRemoveMaterial(material.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsMaterialModalOpen(false)}>
                  취소
                </Button>
                <Button>
                  저장
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}