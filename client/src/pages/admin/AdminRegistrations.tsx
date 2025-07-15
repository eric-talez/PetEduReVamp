import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { UserPlus, Building, CheckCircle, XCircle, FileText, Calendar, User, Phone, Mail, MapPin, RotateCcw, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Badge 컴포넌트 wrapper - 올바른 variant 타입 처리
function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'pending':
      return <Badge variant="warning">검토 중</Badge>;
    case 'approved':
      return <Badge variant="success">승인됨</Badge>;
    case 'rejected':
      return <Badge variant="danger">거부됨</Badge>;
    default:
      return <Badge variant="secondary">알 수 없음</Badge>;
  }
}

function TypeBadge({ type }: { type: string }) {
  switch (type) {
    case 'trainer':
      return <Badge variant="info">훈련사</Badge>;
    case 'institute':
      return <Badge variant="purple">기관</Badge>;
    case 'curriculum':
      return <Badge variant="success">커리큘럼</Badge>;
    default:
      return <Badge variant="secondary">기타</Badge>;
  }
}

interface RegistrationApplication {
  id: string;
  type: 'trainer' | 'institute' | 'curriculum';
  applicantInfo: any;
  documents?: any;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewerId?: string;
  reviewedAt?: string;
  notes?: string;
}

export default function AdminRegistrations() {
  const [applications, setApplications] = useState<RegistrationApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<RegistrationApplication | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // 등록 신청 목록 조회
  const fetchApplications = async () => {
    try {
      setLoading(true);
      console.log('🔥 등록 신청 목록 조회 시작');
      
      const response = await fetch('/api/admin/registrations');
      const data = await response.json();
      
      console.log('🔥 등록 신청 데이터:', data);
      
      if (data.success) {
        setApplications(data.applications);
        console.log('🔥 등록 신청 목록 설정 완료:', data.applications.length, '건');
      }
    } catch (error) {
      console.error('등록 신청 목록 조회 실패:', error);
      toast({
        title: "오류",
        description: "등록 신청 목록을 불러오는데 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleReview = async (applicationId: string, status: 'approved' | 'rejected' | 'pending') => {
    try {
      console.log('🔥 handleReview 호출:', applicationId, status, reviewNotes);
      
      const response = await fetch(`/api/admin/registrations/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          notes: status === 'pending' ? '상태 초기화됨' : reviewNotes
        })
      });

      const data = await response.json();
      console.log('🔥 서버 응답:', data);

      if (data.success) {
        const statusText = status === 'approved' ? '승인' : 
                          status === 'rejected' ? '거부' : '초기화';
        toast({
          title: "처리 완료",
          description: `등록 신청이 ${statusText}되었습니다.`,
          variant: "default"
        });
        
        fetchApplications(); // 목록 새로고침
        setSelectedApplication(null);
        setReviewNotes('');
      } else {
        toast({
          title: "오류",
          description: data.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('등록 신청 처리 실패:', error);
      toast({
        title: "오류",
        description: "처리 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  // 처리 완료된 신청 초기화 (승인/거부된 항목들을 삭제)
  const handleClearProcessedApplications = async () => {
    try {
      const processedApplications = applications.filter(app => app.status === 'approved' || app.status === 'rejected');
      
      if (processedApplications.length === 0) {
        toast({
          title: "초기화할 항목 없음",
          description: "처리 완료된 신청이 없습니다.",
          variant: "default"
        });
        return;
      }

      if (!confirm(`처리 완료된 ${processedApplications.length}개의 신청을 초기화하시겠습니까?`)) {
        return;
      }

      const response = await fetch('/api/admin/registrations/clear-processed', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "초기화 완료",
          description: `${data.clearedCount}개의 처리 완료된 신청이 초기화되었습니다.`,
          variant: "default"
        });
        
        fetchApplications(); // 목록 새로고침
      } else {
        toast({
          title: "오류",
          description: data.message || "초기화 중 오류가 발생했습니다.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('처리 완료된 신청 초기화 실패:', error);
      toast({
        title: "오류",
        description: "초기화 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  // 통계 계산
  const stats = {
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
    total: applications.length
  };

  const handleApplicationClick = (application: RegistrationApplication) => {
    console.log('🔥 등록 신청 카드 클릭:', application.id, application.type, application.applicantInfo?.personalInfo?.name || application.applicantInfo?.basicInfo?.instituteName);
    setSelectedApplication(application);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">검토 중</Badge>;
      case 'approved':
        return <Badge variant="success">승인됨</Badge>;
      case 'rejected':
        return <Badge variant="danger">거부됨</Badge>;
      default:
        return <Badge variant="secondary">알 수 없음</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    return type === 'trainer' ? 
      <Badge variant="info">훈련사</Badge> : 
      <Badge variant="purple">기관</Badge>;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">등록 신청을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">등록 신청 관리</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              훈련사 및 기관 등록 신청을 검토하고 승인/거부를 관리합니다.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleClearProcessedApplications}
              variant="outline"
              className="text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              disabled={stats.approved === 0 && stats.rejected === 0}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              처리 완료된 신청 초기화 ({stats.approved + stats.rejected})
            </Button>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">대기 중</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.pending}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">승인됨</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.approved}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">거부됨</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.rejected}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">전체</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.total}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 신청 목록 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">등록 신청 목록</h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {applications.map((application) => (
              <Card 
                key={application.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleApplicationClick(application)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {application.type === 'trainer' ? 
                        <User className="w-6 h-6 text-blue-600" /> : 
                        <Building className="w-6 h-6 text-purple-600" />
                      }
                      <div>
                        <h3 className="font-semibold">
                          {application.type === 'trainer' 
                            ? application.applicantInfo?.personalInfo?.name 
                            : application.applicantInfo?.basicInfo?.instituteName
                          }
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(application.submittedAt).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      {getTypeBadge(application.type)}
                      {getStatusBadge(application.status)}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {application.type === 'trainer' ? (
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {application.applicantInfo?.personalInfo?.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {application.applicantInfo?.personalInfo?.email}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {application.applicantInfo?.basicInfo?.instituteName}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {application.applicantInfo?.locationInfo?.address}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {applications.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">등록 신청이 없습니다.</p>
              </div>
            )}
          </div>
        </div>

        {/* 상세 정보 */}
        <div>
          {selectedApplication ? (
            <ApplicationDetails 
              application={selectedApplication}
              reviewNotes={reviewNotes}
              setReviewNotes={setReviewNotes}
              onReview={handleReview}
            />
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">신청을 선택하여 상세 정보를 확인하세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ApplicationDetailsProps {
  application: RegistrationApplication;
  reviewNotes: string;
  setReviewNotes: (notes: string) => void;
  onReview: (id: string, status: 'approved' | 'rejected' | 'pending') => void;
}

function ApplicationDetails({ application, reviewNotes, setReviewNotes, onReview }: ApplicationDetailsProps) {
  const isReadonly = application.status !== 'pending';

  if (application.type === 'trainer') {
    // 훈련사 정보 표시
    const info = application.applicantInfo;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">훈련사 등록 신청 상세</h2>
          <StatusBadge status={application.status} />
        </div>

        {/* 기본 정보 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <User className="w-5 h-5" />
            기본 정보
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>이름</Label>
              <p className="mt-1 p-2 border rounded">{info?.personalInfo?.name || '-'}</p>
            </div>
            <div>
              <Label>연락처</Label>
              <p className="mt-1 p-2 border rounded">{info?.personalInfo?.phone || '-'}</p>
            </div>
            <div>
              <Label>이메일</Label>
              <p className="mt-1 p-2 border rounded">{info?.personalInfo?.email || '-'}</p>
            </div>
            <div>
              <Label>주소</Label>
              <p className="mt-1 p-2 border rounded">{info?.personalInfo?.address || '-'}</p>
            </div>
          </div>
        </div>

        {/* 전문 정보 */}
        <div>
          <h3 className="text-lg font-semibold mb-3">전문 정보</h3>
          <div className="space-y-4">
            <div>
              <Label>경력</Label>
              <p className="mt-1 p-2 border rounded">{info?.professionalInfo?.experience || 0}년</p>
            </div>
            <div>
              <Label>전문 분야</Label>
              <p className="mt-1 p-2 border rounded">
                {info?.professionalInfo?.specialties?.join(', ') || '-'}
              </p>
            </div>
            <div>
              <Label>자격증</Label>
              <p className="mt-1 p-2 border rounded">
                {info?.professionalInfo?.certifications?.join(', ') || '-'}
              </p>
            </div>
            <div>
              <Label>소개</Label>
              <p className="mt-1 p-2 border rounded h-20 overflow-y-auto">
                {info?.professionalInfo?.bio || '-'}
              </p>
            </div>
          </div>
        </div>

        {/* 첨부 문서 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            첨부 문서
          </h3>
          <div className="space-y-2">
            {application.documents?.profileImage && (
              <div>
                <Label>프로필 사진</Label>
                <img 
                  src={application.documents.profileImage} 
                  alt="프로필" 
                  className="mt-1 w-20 h-20 object-cover rounded-full border"
                />
              </div>
            )}
            {application.documents?.certificationDocuments?.length > 0 && (
              <div>
                <Label>자격증 ({application.documents.certificationDocuments.length}개)</Label>
                <div className="mt-1 space-y-1">
                  {application.documents.certificationDocuments.map((doc: string, index: number) => (
                    <a 
                      key={index}
                      href={doc} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:underline text-sm"
                    >
                      자격증 {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 검토 섹션 */}
        {!isReadonly && (
          <div>
            <h3 className="text-lg font-semibold mb-3">검토</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="review-notes">검토 의견</Label>
                <Textarea
                  id="review-notes"
                  placeholder="승인/거부/초기화 사유를 입력하세요..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => onReview(application.id, 'approved')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  승인
                </Button>
                <Button 
                  onClick={() => onReview(application.id, 'rejected')}
                  variant="destructive"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  거부
                </Button>
                <Button 
                  onClick={() => onReview(application.id, 'pending')}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  초기화
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 처리 결과 */}
        {isReadonly && (
          <div>
            <h3 className="text-lg font-semibold mb-3">처리 결과</h3>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded">
              <p><strong>상태:</strong> {application.status === 'approved' ? '승인됨' : '거부됨'}</p>
              <p><strong>처리일:</strong> {application.reviewedAt ? new Date(application.reviewedAt).toLocaleString('ko-KR') : '-'}</p>
              {application.notes && (
                <p><strong>검토 의견:</strong> {application.notes}</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  } else if (application.type === 'curriculum') {
    // 커리큘럼 정보 표시
    const info = application.applicantInfo.curriculumInfo;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">커리큘럼 발행 신청 상세</h2>
          <StatusBadge status={application.status} />
        </div>

        {/* 커리큘럼 기본 정보 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            커리큘럼 정보
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>제목</Label>
                <p className="mt-1 p-2 border rounded font-medium">{info?.title || '-'}</p>
              </div>
              <div>
                <Label>카테고리</Label>
                <p className="mt-1 p-2 border rounded">{info?.category || '-'}</p>
              </div>
              <div>
                <Label>난이도</Label>
                <p className="mt-1 p-2 border rounded capitalize">{info?.difficulty || '-'}</p>
              </div>
              <div>
                <Label>소요시간</Label>
                <p className="mt-1 p-2 border rounded">{info?.duration || 0}분</p>
              </div>
              <div>
                <Label>가격</Label>
                <p className="mt-1 p-2 border rounded">₩{(info?.price || 0).toLocaleString()}</p>
              </div>
              <div>
                <Label>모듈 수</Label>
                <p className="mt-1 p-2 border rounded">{info?.moduleCount || 0}개</p>
              </div>
            </div>
            <div>
              <Label>설명</Label>
              <p className="mt-1 p-2 border rounded h-24 overflow-y-auto">
                {info?.description || '-'}
              </p>
            </div>
          </div>
        </div>

        {/* 작성자 정보 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <User className="w-5 h-5" />
            작성자 정보
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>이름</Label>
              <p className="mt-1 p-2 border rounded">{info?.trainerName || '-'}</p>
            </div>
            <div>
              <Label>이메일</Label>
              <p className="mt-1 p-2 border rounded">{info?.trainerEmail || '-'}</p>
            </div>
          </div>
        </div>

        {/* 검토 섹션 */}
        {!isReadonly && (
          <div>
            <h3 className="text-lg font-semibold mb-3">검토</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="review-notes">검토 의견</Label>
                <Textarea
                  id="review-notes"
                  placeholder="승인/거부 사유를 입력하세요..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => onReview(application.id, 'approved')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  승인 (서비스 반영)
                </Button>
                <Button 
                  onClick={() => onReview(application.id, 'rejected')}
                  variant="destructive"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  거부
                </Button>
                <Button 
                  onClick={() => onReview(application.id, 'pending')}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  초기화
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 처리 결과 */}
        {isReadonly && (
          <div>
            <h3 className="text-lg font-semibold mb-3">처리 결과</h3>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded">
              <p><strong>상태:</strong> {application.status === 'approved' ? '승인됨 (서비스 반영됨)' : '거부됨'}</p>
              <p><strong>처리일:</strong> {application.reviewedAt ? new Date(application.reviewedAt).toLocaleString('ko-KR') : '-'}</p>
              {application.notes && (
                <p><strong>검토 의견:</strong> {application.notes}</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  } else {
    // 기관 정보 표시
    const info = application.applicantInfo;
    
    return (
      <div className="space-y-6">
        {/* 기본 정보 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Building className="w-5 h-5" />
            기관 정보
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>기관명</Label>
              <p className="mt-1 p-2 border rounded">{info?.basicInfo?.instituteName || '-'}</p>
            </div>
            <div>
              <Label>설립년도</Label>
              <p className="mt-1 p-2 border rounded">{info?.basicInfo?.establishedYear || '-'}</p>
            </div>
            <div>
              <Label>연락처</Label>
              <p className="mt-1 p-2 border rounded">{info?.basicInfo?.phone || '-'}</p>
            </div>
            <div>
              <Label>이메일</Label>
              <p className="mt-1 p-2 border rounded">{info?.basicInfo?.email || '-'}</p>
            </div>
          </div>
        </div>

        {/* 검토 섹션 */}
        {!isReadonly && (
          <div>
            <h3 className="text-lg font-semibold mb-3">검토</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="review-notes">검토 의견</Label>
                <Textarea
                  id="review-notes"
                  placeholder="승인/거부/초기화 사유를 입력하세요..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => onReview(application.id, 'approved')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  승인
                </Button>
                <Button 
                  onClick={() => onReview(application.id, 'rejected')}
                  variant="destructive"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  거부
                </Button>
                <Button 
                  onClick={() => onReview(application.id, 'pending')}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  초기화
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 처리 결과 */}
        {isReadonly && (
          <div>
            <h3 className="text-lg font-semibold mb-3">처리 결과</h3>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded">
              <p><strong>상태:</strong> {application.status === 'approved' ? '승인됨' : '거부됨'}</p>
              <p><strong>처리일:</strong> {application.reviewedAt ? new Date(application.reviewedAt).toLocaleString('ko-KR') : '-'}</p>
              {application.notes && (
                <p><strong>검토 의견:</strong> {application.notes}</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}