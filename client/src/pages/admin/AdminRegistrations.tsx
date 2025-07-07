import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { UserPlus, Building, CheckCircle, XCircle, FileText, Calendar, User, Phone, Mail, MapPin } from 'lucide-react';
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
  return type === 'trainer' ? 
    <Badge variant="info">훈련사</Badge> : 
    <Badge variant="purple">기관</Badge>;
}

interface RegistrationApplication {
  id: string;
  type: 'trainer' | 'institute';
  applicantInfo: any;
  documents: any;
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

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      console.log('🔥 등록 신청 목록 조회 시작');
      const response = await fetch('/api/admin/registrations');
      const data = await response.json();
      console.log('🔥 등록 신청 데이터:', data);
      
      if (data.success) {
        setApplications(data.applications);
        console.log('🔥 등록 신청 목록 설정 완료:', data.applications.length, '건');
      } else {
        toast({
          title: "오류",
          description: "등록 신청 목록을 불러올 수 없습니다.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('등록 신청 조회 실패:', error);
      toast({
        title: "오류",
        description: "서버 연결에 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const processedApplications = applications.filter(app => app.status !== 'pending');

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <span className="ml-2">로딩 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">등록 신청 관리</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          훈련사 및 기관 등록 신청을 검토하고 승인/거부를 관리합니다.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">대기 중</p>
                <p className="text-2xl font-bold text-orange-600">{pendingApplications.length}</p>
              </div>
              <UserPlus className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">승인됨</p>
                <p className="text-2xl font-bold text-green-600">
                  {applications.filter(app => app.status === 'approved').length}
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
                  {applications.filter(app => app.status === 'rejected').length}
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
                <p className="text-2xl font-bold text-blue-600">{applications.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            대기 중 ({pendingApplications.length})
          </TabsTrigger>
          <TabsTrigger value="processed">
            처리 완료 ({processedApplications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingApplications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">검토 대기 중인 신청이 없습니다.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingApplications.map((application) => (
                <ApplicationCard 
                  key={application.id} 
                  application={application}
                  onSelect={setSelectedApplication}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="processed" className="space-y-4">
          {processedApplications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">처리 완료된 신청이 없습니다.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {processedApplications.map((application) => (
                <ApplicationCard 
                  key={application.id} 
                  application={application}
                  onSelect={setSelectedApplication}
                  readonly={true}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* 신청 상세 다이얼로그 */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedApplication?.type === 'trainer' ? <User className="w-5 h-5" /> : <Building className="w-5 h-5" />}
              {selectedApplication?.type === 'trainer' ? '훈련사' : '기관'} 등록 신청 상세
            </DialogTitle>
            <DialogDescription>
              신청자 정보를 검토하고 승인 또는 거부를 결정하세요.
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <ApplicationDetails 
              application={selectedApplication}
              reviewNotes={reviewNotes}
              setReviewNotes={setReviewNotes}
              onReview={handleReview}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ApplicationCard({ 
  application, 
  onSelect, 
  readonly = false 
}: { 
  application: RegistrationApplication;
  onSelect: (app: RegistrationApplication) => void;
  readonly?: boolean;
}) {
  const getApplicantName = () => {
    if (application.type === 'trainer') {
      return application.applicantInfo?.personalInfo?.name || '이름 없음';
    } else {
      return application.applicantInfo?.basicInfo?.instituteName || '기관명 없음';
    }
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

  const handleCardClick = () => {
    console.log('🔥 등록 신청 카드 클릭:', application.id, application.type, getApplicantName());
    onSelect(application);
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleCardClick}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              {application.type === 'trainer' ? 
                <User className="w-5 h-5 text-primary" /> : 
                <Building className="w-5 h-5 text-primary" />
              }
            </div>
            <div>
              <h3 className="font-semibold">{getApplicantName()}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                신청일: {new Date(application.submittedAt).toLocaleDateString('ko-KR')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getTypeBadge(application.type)}
            {getStatusBadge(application.status)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ApplicationDetails({ 
  application, 
  reviewNotes, 
  setReviewNotes, 
  onReview 
}: {
  application: RegistrationApplication;
  reviewNotes: string;
  setReviewNotes: (notes: string) => void;
  onReview: (id: string, status: 'approved' | 'rejected' | 'pending') => void;
}) {
  const isReadonly = application.status !== 'pending';

  if (application.type === 'trainer') {
    const info = application.applicantInfo;
    
    return (
      <div className="space-y-6">
        {/* 개인 정보 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <User className="w-5 h-5" />
            개인 정보
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
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label>경력</Label>
              <p className="mt-1 p-2 border rounded">{info?.professionalInfo?.experience || '-'}년</p>
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
                  alt="프로필 사진" 
                  className="mt-1 w-32 h-32 object-cover rounded border"
                />
              </div>
            )}
            {application.documents?.certificationDocs?.length > 0 && (
              <div>
                <Label>자격증 ({application.documents.certificationDocs.length}개)</Label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {application.documents.certificationDocs.map((doc: string, index: number) => (
                    <a 
                      key={index}
                      href={doc} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
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
              <div className="grid grid-cols-3 gap-2">
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

        {/* 위치 정보 */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            위치 정보
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label>주소</Label>
              <p className="mt-1 p-2 border rounded">{info?.locationInfo?.address || '-'}</p>
            </div>
          </div>
        </div>

        {/* 서비스 정보 */}
        <div>
          <h3 className="text-lg font-semibold mb-3">서비스 정보</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label>서비스 유형</Label>
              <p className="mt-1 p-2 border rounded">
                {info?.serviceInfo?.serviceTypes?.join(', ') || '-'}
              </p>
            </div>
            <div>
              <Label>설명</Label>
              <p className="mt-1 p-2 border rounded h-20 overflow-y-auto">
                {info?.serviceInfo?.description || '-'}
              </p>
            </div>
          </div>
        </div>

        {/* 시설 정보 */}
        <div>
          <h3 className="text-lg font-semibold mb-3">시설 정보</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>수용 인원</Label>
              <p className="mt-1 p-2 border rounded">{info?.facilityInfo?.capacity || '-'}명</p>
            </div>
            <div>
              <Label>시설</Label>
              <p className="mt-1 p-2 border rounded">
                {info?.facilityInfo?.facilities?.join(', ') || '-'}
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
            {application.documents?.businessLicense && (
              <div>
                <Label>사업자등록증</Label>
                <a 
                  href={application.documents.businessLicense} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-1 block text-blue-600 hover:underline"
                >
                  사업자등록증 보기
                </a>
              </div>
            )}
            {application.documents?.facilityImages?.length > 0 && (
              <div>
                <Label>시설 사진 ({application.documents.facilityImages.length}개)</Label>
                <div className="mt-1 grid grid-cols-3 gap-2">
                  {application.documents.facilityImages.map((img: string, index: number) => (
                    <img 
                      key={index}
                      src={img} 
                      alt={`시설 사진 ${index + 1}`} 
                      className="w-full h-20 object-cover rounded border"
                    />
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
              <div className="grid grid-cols-3 gap-2">
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