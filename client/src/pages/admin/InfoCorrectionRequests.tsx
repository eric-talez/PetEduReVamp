import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye, Check, X, Clock, AlertTriangle, FileText, Phone, MapPin, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CorrectionRequest {
  id: string;
  businessId: string;
  businessName: string;
  field: string;
  currentValue: string;
  suggestedValue: string;
  reason: string;
  reporterName: string;
  reporterEmail: string;
  submittedAt: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  adminNotes?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  evidence?: {
    name: string;
    type: string;
    size: number;
  }[];
}

export default function InfoCorrectionRequests() {
  const [requests, setRequests] = useState<CorrectionRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<CorrectionRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<CorrectionRequest | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // 샘플 데이터 로드
  useEffect(() => {
    const sampleRequests: CorrectionRequest[] = [
      {
        id: 'req001',
        businessId: 'tc1',
        businessName: '서울 펫 트레이닝 센터',
        field: 'phone',
        currentValue: '02-1234-5678',
        suggestedValue: '02-1234-9999',
        reason: '전화번호가 변경되었습니다. 현재 번호로는 연결되지 않습니다.',
        reporterName: '김고객',
        reporterEmail: 'kim@example.com',
        submittedAt: '2024-06-26T10:30:00Z',
        status: 'pending',
        evidence: [
          { name: '전화번호_변경_공지.jpg', type: 'image/jpeg', size: 245000 }
        ]
      },
      {
        id: 'req002',
        businessId: 'tc2',
        businessName: '스마트독 교육센터',
        field: 'hours',
        currentValue: '10:00 - 19:00',
        suggestedValue: '09:00 - 20:00',
        reason: '운영시간이 확장되었습니다. 홈페이지에도 변경된 시간이 공지되어 있습니다.',
        reporterName: '박반려',
        reporterEmail: 'park@example.com',
        submittedAt: '2024-06-25T14:20:00Z',
        status: 'reviewing',
        adminNotes: '홈페이지 확인 중',
        reviewedBy: '관리자'
      },
      {
        id: 'req003',
        businessId: 'ps1',
        businessName: '펫프렌즈 강남점',
        field: 'address',
        currentValue: '서울특별시 강남구 역삼동 789',
        suggestedValue: '서울특별시 강남구 역삼로 123',
        reason: '주소가 부정확합니다. 실제로는 역삼로에 위치해 있습니다.',
        reporterName: '이애견',
        reporterEmail: 'lee@example.com',
        submittedAt: '2024-06-24T16:45:00Z',
        status: 'approved',
        adminNotes: '주소 확인 완료, 정보 업데이트됨',
        reviewedAt: '2024-06-25T09:15:00Z',
        reviewedBy: '관리자',
        evidence: [
          { name: '건물_외관.jpg', type: 'image/jpeg', size: 180000 },
          { name: '도로명_주소.pdf', type: 'application/pdf', size: 95000 }
        ]
      },
      {
        id: 'req004',
        businessId: 'vet1',
        businessName: '서울동물병원',
        field: 'services',
        currentValue: '일반 진료, 응급 진료',
        suggestedValue: '일반 진료, 응급 진료, 수술, 치과, 예방접종, 건강검진',
        reason: '제공 서비스가 누락되어 있습니다. 실제로는 더 많은 서비스를 제공하고 있습니다.',
        reporterName: '최돌봄',
        reporterEmail: 'choi@example.com',
        submittedAt: '2024-06-23T11:20:00Z',
        status: 'rejected',
        adminNotes: '업체 측에서 현재 서비스 범위를 확인한 결과 기존 정보가 정확함',
        reviewedAt: '2024-06-24T13:30:00Z',
        reviewedBy: '관리자'
      }
    ];

    setRequests(sampleRequests);
    setFilteredRequests(sampleRequests);
    setLoading(false);
  }, []);

  // 필터링
  useEffect(() => {
    let filtered = requests;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(req =>
        req.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.field.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  }, [requests, statusFilter, searchTerm]);

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: '대기 중' },
      reviewing: { color: 'bg-blue-100 text-blue-800', label: '검토 중' },
      approved: { color: 'bg-green-100 text-green-800', label: '승인' },
      rejected: { color: 'bg-red-100 text-red-800', label: '거부' }
    };
    const variant = variants[status as keyof typeof variants];
    return <Badge className={variant.color}>{variant.label}</Badge>;
  };

  const getFieldIcon = (field: string) => {
    const icons = {
      phone: Phone,
      address: MapPin,
      hours: Clock,
      description: FileText,
      services: Building2
    };
    const Icon = icons[field as keyof typeof icons] || FileText;
    return <Icon className="w-4 h-4" />;
  };

  const getFieldLabel = (field: string) => {
    const labels = {
      phone: '전화번호',
      address: '주소',
      hours: '운영시간',
      description: '업체 설명',
      services: '제공 서비스'
    };
    return labels[field as keyof typeof labels] || field;
  };

  const handleReviewRequest = (request: CorrectionRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setReviewAction(action);
    setAdminNotes('');
    setIsReviewDialogOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedRequest || !reviewAction) return;

    try {
      const updatedRequest: CorrectionRequest = {
        ...selectedRequest,
        status: reviewAction === 'approve' ? 'approved' : 'rejected',
        adminNotes,
        reviewedAt: new Date().toISOString(),
        reviewedBy: '관리자'
      };

      setRequests(prev => prev.map(req => 
        req.id === selectedRequest.id ? updatedRequest : req
      ));

      toast({
        title: reviewAction === 'approve' ? '요청 승인' : '요청 거부',
        description: `${selectedRequest.businessName}의 정보 수정 요청을 ${reviewAction === 'approve' ? '승인' : '거부'}했습니다.`
      });

      setIsReviewDialogOpen(false);
      setSelectedRequest(null);
      setReviewAction(null);
      setAdminNotes('');
    } catch (error) {
      toast({
        title: '처리 실패',
        description: '요청 처리 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    }
  };

  const handleViewDetails = (request: CorrectionRequest) => {
    setSelectedRequest(request);
  };

  const getRequestCounts = () => {
    return {
      all: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      reviewing: requests.filter(r => r.status === 'reviewing').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length
    };
  };

  const counts = getRequestCounts();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">정보 수정 요청 관리</h1>
          <p className="text-gray-600 mt-1">업체 정보 수정 요청을 검토하고 처리합니다</p>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="업체명, 신고자, 수정 항목으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 ({counts.all})</SelectItem>
                <SelectItem value="pending">대기 중 ({counts.pending})</SelectItem>
                <SelectItem value="reviewing">검토 중 ({counts.reviewing})</SelectItem>
                <SelectItem value="approved">승인 ({counts.approved})</SelectItem>
                <SelectItem value="rejected">거부 ({counts.rejected})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 요청 목록 */}
      <div className="grid gap-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{request.businessName}</h3>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    {getFieldIcon(request.field)}
                    <span className="font-medium">{getFieldLabel(request.field)} 수정 요청</span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">현재:</span>
                      <p className="font-mono bg-gray-50 p-2 rounded mt-1">{request.currentValue}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">제안:</span>
                      <p className="font-mono bg-blue-50 p-2 rounded mt-1">{request.suggestedValue}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="text-gray-500 text-sm">사유:</span>
                    <p className="text-sm mt-1">{request.reason}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                    <span>신고자: {request.reporterName}</span>
                    <span>접수일: {new Date(request.submittedAt).toLocaleDateString('ko-KR')}</span>
                    {request.evidence && request.evidence.length > 0 && (
                      <span>증빙 자료: {request.evidence.length}개</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(request)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  
                  {request.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => handleReviewRequest(request, 'approve')}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleReviewRequest(request, 'reject')}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredRequests.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <AlertTriangle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">요청이 없습니다</h3>
              <p className="text-gray-600">현재 조건에 맞는 정보 수정 요청이 없습니다.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 검토 다이얼로그 */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? '요청 승인' : '요청 거부'} - {selectedRequest?.businessName}
            </DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">현재 정보</Label>
                  <p className="font-mono bg-gray-50 p-3 rounded mt-1 text-sm">
                    {selectedRequest.currentValue}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">제안된 정보</Label>
                  <p className="font-mono bg-blue-50 p-3 rounded mt-1 text-sm">
                    {selectedRequest.suggestedValue}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">수정 사유</Label>
                <p className="bg-gray-50 p-3 rounded mt-1 text-sm">
                  {selectedRequest.reason}
                </p>
              </div>

              <div>
                <Label htmlFor="admin-notes">관리자 메모 *</Label>
                <Textarea
                  id="admin-notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder={reviewAction === 'approve' 
                    ? '승인 사유를 입력하세요...' 
                    : '거부 사유를 입력하세요...'
                  }
                  rows={3}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsReviewDialogOpen(false)}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              onClick={handleSubmitReview}
              className={`flex-1 ${reviewAction === 'approve' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
              }`}
              disabled={!adminNotes.trim()}
            >
              {reviewAction === 'approve' ? '승인 처리' : '거부 처리'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}