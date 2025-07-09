import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Award, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Plus,
  Search,
  Filter,
  Calendar,
  FileText,
  Shield,
  Star,
  TrendingUp
} from 'lucide-react';

interface TrainerProgram {
  id: number;
  name: string;
  description: string;
  level: 'basic' | 'advanced' | 'expert';
  duration: number;
  maxParticipants: number;
  isActive: boolean;
  requirements: string[];
  curriculum: string[];
  certificateValidityPeriod: number;
  createdAt: string;
  updatedAt: string;
}

interface TrainerApplication {
  id: number;
  userId: number;
  programId: number;
  status: 'pending' | 'approved' | 'rejected';
  experience: string;
  motivation: string;
  previousCertifications: string[];
  portfolioUrl?: string;
  applicationDate: string;
  reviewDate?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface TrainerCertification {
  id: number;
  trainerId: number;
  programId: number;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  level: 'basic' | 'advanced' | 'expert';
  score: number;
  status: 'active' | 'expired' | 'revoked';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TrainerCertificationManagement() {
  const [programs, setPrograms] = useState<TrainerProgram[]>([]);
  const [applications, setApplications] = useState<TrainerApplication[]>([]);
  const [certifications, setCertifications] = useState<TrainerCertification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // 병렬로 데이터 로드
      const [programsRes, applicationsRes, certificationsRes] = await Promise.all([
        apiRequest('GET', '/api/trainer-programs'),
        apiRequest('GET', '/api/trainer-applications'),
        apiRequest('GET', '/api/trainer-certifications')
      ]);

      const programsData = await programsRes.json();
      const applicationsData = await applicationsRes.json();
      const certificationsData = await certificationsRes.json();

      if (programsData.success) {
        setPrograms(programsData.programs);
      }
      if (applicationsData.success) {
        setApplications(applicationsData.applications);
      }
      if (certificationsData.success) {
        setCertifications(certificationsData.certifications);
      }
    } catch (error) {
      console.error('데이터 로드 오류:', error);
      toast({
        title: "데이터 로드 실패",
        description: "훈련사 인증 데이터를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationReview = async (applicationId: number, action: 'approve' | 'reject', notes?: string) => {
    try {
      const response = await apiRequest('POST', `/api/trainer-applications/${applicationId}/review`, {
        action,
        notes
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "신청서 검토 완료",
          description: `신청서가 ${action === 'approve' ? '승인' : '거부'}되었습니다.`,
          variant: "default"
        });
        
        // 데이터 다시 로드
        loadData();
      } else {
        throw new Error(result.message || '검토 처리 실패');
      }
    } catch (error) {
      console.error('신청서 검토 오류:', error);
      toast({
        title: "검토 실패",
        description: "신청서 검토 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">대기중</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">승인됨</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">거부됨</Badge>;
      case 'active':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">활성</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">만료</Badge>;
      case 'revoked':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">취소</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'basic':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">기본</Badge>;
      case 'advanced':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">전문</Badge>;
      case 'expert':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">마스터</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">훈련사 인증 관리</h1>
          <p className="text-gray-600 mt-2">훈련사 인증 프로그램 및 신청서를 관리합니다</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          새 프로그램 추가
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">전체 프로그램</p>
                <p className="text-2xl font-bold text-gray-900">{programs.length}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Award className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">대기 중인 신청</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'pending').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">활성 인증서</p>
                <p className="text-2xl font-bold text-gray-900">
                  {certifications.filter(cert => cert.status === 'active').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">승인률</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.length > 0 ? 
                    Math.round((applications.filter(app => app.status === 'approved').length / applications.length) * 100) : 0
                  }%
                </p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 탭 메뉴 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="programs">프로그램</TabsTrigger>
          <TabsTrigger value="applications">신청서</TabsTrigger>
          <TabsTrigger value="certifications">인증서</TabsTrigger>
        </TabsList>

        {/* 개요 탭 */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  인증 프로그램 현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {programs.map((program) => (
                    <div key={program.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{program.name}</p>
                        <p className="text-sm text-gray-600">{program.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getLevelBadge(program.level)}
                        <Badge variant={program.isActive ? "default" : "secondary"}>
                          {program.isActive ? "활성" : "비활성"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  최근 신청서
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.slice(0, 5).map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">신청 ID: {application.id}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(application.applicationDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(application.status)}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 프로그램 탭 */}
        <TabsContent value="programs" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">인증 프로그램 관리</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  새 프로그램 추가
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>새 인증 프로그램 추가</DialogTitle>
                </DialogHeader>
                <NewProgramForm onSuccess={loadData} />
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <Card key={program.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{program.name}</span>
                    {getLevelBadge(program.level)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{program.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>교육 기간:</span>
                      <span>{program.duration}일</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>최대 참여자:</span>
                      <span>{program.maxParticipants}명</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>인증 유효기간:</span>
                      <span>{program.certificateValidityPeriod}일</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">필수 요건:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {program.requirements.map((req, index) => (
                        <li key={index}>• {req}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={program.isActive ? "default" : "secondary"}>
                      {program.isActive ? "활성" : "비활성"}
                    </Badge>
                    <Button size="sm" variant="outline" className="ml-auto">
                      편집
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 신청서 탭 */}
        <TabsContent value="applications" className="space-y-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="신청서 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="pending">대기중</SelectItem>
                <SelectItem value="approved">승인됨</SelectItem>
                <SelectItem value="rejected">거부됨</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {applications
              .filter(app => statusFilter === 'all' || app.status === statusFilter)
              .map((application) => (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">신청 ID: {application.id}</h3>
                        <p className="text-sm text-gray-600">
                          신청일: {new Date(application.applicationDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(application.status)}
                        <Badge variant="outline">프로그램 ID: {application.programId}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium mb-1">경력:</p>
                        <p className="text-sm text-gray-600">{application.experience}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">지원 동기:</p>
                        <p className="text-sm text-gray-600">{application.motivation}</p>
                      </div>
                    </div>

                    {application.previousCertifications.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">보유 자격증:</p>
                        <div className="flex flex-wrap gap-1">
                          {application.previousCertifications.map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {application.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApplicationReview(application.id, 'approve')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          승인
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApplicationReview(application.id, 'reject')}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          거부
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* 인증서 탭 */}
        <TabsContent value="certifications" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {certifications.map((certification) => (
              <Card key={certification.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">인증서 번호: {certification.certificateNumber}</h3>
                      <p className="text-sm text-gray-600">
                        발급일: {new Date(certification.issueDate).toLocaleDateString()} | 
                        만료일: {new Date(certification.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(certification.status)}
                      {getLevelBadge(certification.level)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium">훈련사 ID:</p>
                      <p className="text-sm text-gray-600">{certification.trainerId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">프로그램 ID:</p>
                      <p className="text-sm text-gray-600">{certification.programId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">점수:</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-gray-600">{certification.score}/100</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Badge variant={certification.isVerified ? "default" : "secondary"}>
                      {certification.isVerified ? "인증됨" : "미인증"}
                    </Badge>
                    <Button size="sm" variant="outline" className="ml-auto">
                      <FileText className="h-4 w-4 mr-1" />
                      인증서 보기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// 새 프로그램 추가 폼 컴포넌트
function NewProgramForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: 'basic' as 'basic' | 'advanced' | 'expert',
    duration: 30,
    maxParticipants: 20,
    certificateValidityPeriod: 365,
    requirements: '',
    curriculum: '',
    isActive: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const programData = {
        ...formData,
        requirements: formData.requirements.split('\n').filter(req => req.trim()),
        curriculum: formData.curriculum.split('\n').filter(curr => curr.trim())
      };

      const response = await apiRequest('POST', '/api/trainer-programs', programData);
      const result = await response.json();

      if (result.success) {
        toast({
          title: "프로그램 추가 완료",
          description: "새로운 인증 프로그램이 성공적으로 추가되었습니다.",
          variant: "default"
        });
        onSuccess();
      } else {
        throw new Error(result.message || '프로그램 추가 실패');
      }
    } catch (error) {
      console.error('프로그램 추가 오류:', error);
      toast({
        title: "추가 실패",
        description: "프로그램 추가 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">프로그램명</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="예: 기초 반려견 훈련사 과정"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">레벨</label>
          <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value as any})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">기초</SelectItem>
              <SelectItem value="advanced">고급</SelectItem>
              <SelectItem value="expert">전문가</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">프로그램 설명</label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="프로그램에 대한 간단한 설명을 입력하세요"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">교육 기간 (일)</label>
          <Input
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
            min="1"
            max="365"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">최대 참여자 수</label>
          <Input
            type="number"
            value={formData.maxParticipants}
            onChange={(e) => setFormData({...formData, maxParticipants: parseInt(e.target.value)})}
            min="1"
            max="100"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">인증 유효기간 (일)</label>
          <Input
            type="number"
            value={formData.certificateValidityPeriod}
            onChange={(e) => setFormData({...formData, certificateValidityPeriod: parseInt(e.target.value)})}
            min="30"
            max="1095"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">필수 요건 (한 줄당 하나씩)</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md resize-y min-h-[100px]"
          value={formData.requirements}
          onChange={(e) => setFormData({...formData, requirements: e.target.value})}
          placeholder="예:&#10;만 18세 이상&#10;반려견 양육 경험 1년 이상&#10;기본적인 반려견 지식 보유"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">커리큘럼 (한 줄당 하나씩)</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md resize-y min-h-[120px]"
          value={formData.curriculum}
          onChange={(e) => setFormData({...formData, curriculum: e.target.value})}
          placeholder="예:&#10;1주차: 반려견 심리와 행동 이해&#10;2주차: 기본 명령어 훈련&#10;3주차: 사회화 훈련&#10;4주차: 문제행동 교정 기법"
          required
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
          className="rounded"
        />
        <label htmlFor="isActive" className="text-sm font-medium">
          프로그램 활성화
        </label>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" disabled={isSubmitting}>
          취소
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '추가 중...' : '프로그램 추가'}
        </Button>
      </div>
    </form>
  );
}

// 헬퍼 함수들
function getStatusBadge(status: string) {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="text-yellow-600 border-yellow-600">대기중</Badge>;
    case 'approved':
      return <Badge variant="default" className="bg-green-600">승인됨</Badge>;
    case 'rejected':
      return <Badge variant="destructive">거부됨</Badge>;
    case 'active':
      return <Badge variant="default" className="bg-green-600">활성</Badge>;
    case 'expired':
      return <Badge variant="outline" className="text-gray-600 border-gray-600">만료</Badge>;
    case 'revoked':
      return <Badge variant="destructive">취소됨</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function getLevelBadge(level: string) {
  switch (level) {
    case 'basic':
      return <Badge variant="outline" className="text-blue-600 border-blue-600">기초</Badge>;
    case 'advanced':
      return <Badge variant="outline" className="text-purple-600 border-purple-600">고급</Badge>;
    case 'expert':
      return <Badge variant="outline" className="text-red-600 border-red-600">전문가</Badge>;
    default:
      return <Badge variant="outline">{level}</Badge>;
  }
}