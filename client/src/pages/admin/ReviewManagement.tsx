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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Search, Star, Eye, Edit, Trash2, Flag, MessageCircle, Calendar, Filter, MoreVertical, AlertTriangle, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Review {
  id: string;
  businessId: string;
  businessName: string;
  businessType: string;
  authorName: string;
  authorImage?: string;
  rating: number;
  comment: string;
  date: string;
  helpful?: number;
  photos?: string[];
  isVerifiedPurchase?: boolean;
  status: 'active' | 'hidden' | 'reported' | 'deleted';
  reportCount: number;
  lastReportDate?: string;
  businessResponse?: {
    content: string;
    date: string;
    author: string;
  };
  moderationNotes?: string;
  moderatedBy?: string;
  moderatedAt?: string;
}

interface Report {
  id: string;
  reviewId: string;
  reporterName: string;
  reporterEmail: string;
  reason: string;
  description: string;
  date: string;
  status: 'pending' | 'reviewed' | 'dismissed';
}

export default function ReviewManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [businessTypeFilter, setBusinessTypeFilter] = useState<string>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isReportsDialogOpen, setIsReportsDialogOpen] = useState(false);
  const [editedComment, setEditedComment] = useState('');
  const [editedRating, setEditedRating] = useState(5);
  const [moderationNotes, setModerationNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // 샘플 데이터 로드
  useEffect(() => {
    const sampleReviews: Review[] = [
      {
        id: 'rev001',
        businessId: 'tc1',
        businessName: '서울 펫 트레이닝 센터',
        businessType: 'training-center',
        authorName: '김고객',
        rating: 5,
        comment: '정말 만족스러운 서비스였습니다. 우리 강아지가 많이 발전했어요!',
        date: '2024-06-26T10:30:00Z',
        helpful: 12,
        isVerifiedPurchase: true,
        status: 'active',
        reportCount: 0,
        photos: []
      },
      {
        id: 'rev002',
        businessId: 'ps1',
        businessName: '펫프렌즈 강남점',
        businessType: 'pet-store',
        authorName: '박반려',
        rating: 2,
        comment: '서비스가 너무 별로였습니다. 직원들이 불친절하고 가격도 비싸요.',
        date: '2024-06-25T14:20:00Z',
        helpful: 3,
        status: 'reported',
        reportCount: 2,
        lastReportDate: '2024-06-26T09:15:00Z',
        businessResponse: {
          content: '불편을 드려 죄송합니다. 개선하도록 노력하겠습니다.',
          date: '2024-06-25T16:30:00Z',
          author: '펫프렌즈 매니저'
        }
      },
      {
        id: 'rev003',
        businessId: 'vet1',
        businessName: '서울동물병원',
        businessType: 'veterinary',
        authorName: '이애견',
        rating: 4,
        comment: '의료진이 전문적이고 친절했습니다. 다만 대기시간이 조금 길었어요.',
        date: '2024-06-24T16:45:00Z',
        helpful: 8,
        status: 'active',
        reportCount: 0,
        moderationNotes: '정상적인 리뷰로 확인됨',
        moderatedBy: '관리자',
        moderatedAt: '2024-06-25T10:00:00Z'
      },
      {
        id: 'rev004',
        businessId: 'tc2',
        businessName: '스마트독 교육센터',
        businessType: 'training-center',
        authorName: '최돌봄',
        rating: 1,
        comment: '최악의 서비스입니다. 절대 가지 마세요!!! 사기업체!!!',
        date: '2024-06-23T11:20:00Z',
        helpful: 1,
        status: 'hidden',
        reportCount: 5,
        lastReportDate: '2024-06-24T08:30:00Z',
        moderationNotes: '부적절한 표현으로 인해 숨김 처리',
        moderatedBy: '관리자',
        moderatedAt: '2024-06-24T09:00:00Z'
      }
    ];

    const sampleReports: Report[] = [
      {
        id: 'rpt001',
        reviewId: 'rev002',
        reporterName: '신고자1',
        reporterEmail: 'reporter1@example.com',
        reason: 'inappropriate_content',
        description: '과도하게 부정적이고 사실과 다른 내용이 포함되어 있습니다.',
        date: '2024-06-26T09:15:00Z',
        status: 'pending'
      },
      {
        id: 'rpt002',
        reviewId: 'rev004',
        reporterName: '업체관계자',
        reporterEmail: 'business@example.com',
        reason: 'false_information',
        description: '허위 사실을 유포하고 있습니다.',
        date: '2024-06-24T08:30:00Z',
        status: 'reviewed'
      }
    ];

    setReviews(sampleReviews);
    setReports(sampleReports);
    setFilteredReviews(sampleReviews);
    setLoading(false);
  }, []);

  // 필터링
  useEffect(() => {
    let filtered = reviews;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(review => review.status === statusFilter);
    }

    if (ratingFilter !== 'all') {
      const rating = parseInt(ratingFilter);
      filtered = filtered.filter(review => review.rating === rating);
    }

    if (businessTypeFilter !== 'all') {
      filtered = filtered.filter(review => review.businessType === businessTypeFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReviews(filtered);
  }, [reviews, statusFilter, ratingFilter, businessTypeFilter, searchTerm]);

  const getStatusBadge = (status: string, reportCount: number) => {
    const variants = {
      active: { color: 'bg-green-100 text-green-800', label: '활성' },
      hidden: { color: 'bg-yellow-100 text-yellow-800', label: '숨김' },
      reported: { color: 'bg-red-100 text-red-800', label: `신고됨 (${reportCount})` },
      deleted: { color: 'bg-gray-100 text-gray-800', label: '삭제됨' }
    };
    const variant = variants[status as keyof typeof variants];
    return <Badge className={variant.color}>{variant.label}</Badge>;
  };

  const getBusinessTypeLabel = (type: string) => {
    const labels = {
      'training-center': '훈련소',
      'pet-store': '펫샵',
      'veterinary': '동물병원',
      'grooming': '미용실',
      'hotel': '펜션',
      'cafe': '카페'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleEditReview = (review: Review) => {
    setSelectedReview(review);
    setEditedComment(review.comment);
    setEditedRating(review.rating);
    setModerationNotes(review.moderationNotes || '');
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedReview) return;

    try {
      const updatedReview = {
        ...selectedReview,
        comment: editedComment,
        rating: editedRating,
        moderationNotes,
        moderatedBy: '관리자',
        moderatedAt: new Date().toISOString()
      };

      setReviews(prev => prev.map(review => 
        review.id === selectedReview.id ? updatedReview : review
      ));

      toast({
        title: "리뷰 수정 완료",
        description: `${selectedReview.businessName}의 리뷰가 수정되었습니다.`
      });

      setIsEditDialogOpen(false);
      setSelectedReview(null);
    } catch (error) {
      toast({
        title: "수정 실패",
        description: "리뷰 수정 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteReview = async () => {
    if (!selectedReview) return;

    try {
      setReviews(prev => prev.map(review => 
        review.id === selectedReview.id 
          ? { 
              ...review, 
              status: 'deleted' as const,
              moderationNotes: moderationNotes || '관리자에 의해 삭제됨',
              moderatedBy: '관리자',
              moderatedAt: new Date().toISOString()
            }
          : review
      ));

      toast({
        title: "리뷰 삭제 완료",
        description: `${selectedReview.businessName}의 리뷰가 삭제되었습니다.`
      });

      setIsDeleteDialogOpen(false);
      setSelectedReview(null);
      setModerationNotes('');
    } catch (error) {
      toast({
        title: "삭제 실패",
        description: "리뷰 삭제 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleToggleVisibility = async (review: Review) => {
    try {
      const newStatus = review.status === 'active' ? 'hidden' : 'active';
      
      setReviews(prev => prev.map(r => 
        r.id === review.id 
          ? { 
              ...r, 
              status: newStatus,
              moderatedBy: '관리자',
              moderatedAt: new Date().toISOString()
            }
          : r
      ));

      toast({
        title: newStatus === 'hidden' ? "리뷰 숨김 처리" : "리뷰 표시 처리",
        description: `${review.businessName}의 리뷰가 ${newStatus === 'hidden' ? '숨김' : '표시'} 처리되었습니다.`
      });
    } catch (error) {
      toast({
        title: "처리 실패",
        description: "리뷰 상태 변경 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleViewReports = (review: Review) => {
    setSelectedReview(review);
    setIsReportsDialogOpen(true);
  };

  const getReviewCounts = () => {
    return {
      all: reviews.length,
      active: reviews.filter(r => r.status === 'active').length,
      hidden: reviews.filter(r => r.status === 'hidden').length,
      reported: reviews.filter(r => r.status === 'reported').length,
      deleted: reviews.filter(r => r.status === 'deleted').length
    };
  };

  const counts = getReviewCounts();

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
          <h1 className="text-3xl font-bold">리뷰 관리</h1>
          <p className="text-gray-600 mt-1">업체 리뷰를 검토하고 관리합니다</p>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{counts.all}</div>
            <div className="text-sm text-gray-600">전체 리뷰</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{counts.active}</div>
            <div className="text-sm text-gray-600">활성 리뷰</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{counts.hidden}</div>
            <div className="text-sm text-gray-600">숨김 리뷰</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{counts.reported}</div>
            <div className="text-sm text-gray-600">신고된 리뷰</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{counts.deleted}</div>
            <div className="text-sm text-gray-600">삭제된 리뷰</div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="업체명, 작성자, 리뷰 내용으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="active">활성</SelectItem>
                <SelectItem value="hidden">숨김</SelectItem>
                <SelectItem value="reported">신고됨</SelectItem>
                <SelectItem value="deleted">삭제됨</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger>
                <SelectValue placeholder="평점 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 평점</SelectItem>
                <SelectItem value="5">★★★★★ (5점)</SelectItem>
                <SelectItem value="4">★★★★☆ (4점)</SelectItem>
                <SelectItem value="3">★★★☆☆ (3점)</SelectItem>
                <SelectItem value="2">★★☆☆☆ (2점)</SelectItem>
                <SelectItem value="1">★☆☆☆☆ (1점)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={businessTypeFilter} onValueChange={setBusinessTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="업종 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 업종</SelectItem>
                <SelectItem value="training-center">훈련소</SelectItem>
                <SelectItem value="pet-store">펫샵</SelectItem>
                <SelectItem value="veterinary">동물병원</SelectItem>
                <SelectItem value="grooming">미용실</SelectItem>
                <SelectItem value="hotel">펜션</SelectItem>
                <SelectItem value="cafe">카페</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 리뷰 목록 */}
      <div className="grid gap-4">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{review.businessName}</h3>
                    <Badge variant="outline">{getBusinessTypeLabel(review.businessType)}</Badge>
                    {getStatusBadge(review.status, review.reportCount)}
                  </div>
                  
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={review.authorImage} />
                      <AvatarFallback>{review.authorName[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{review.authorName}</span>
                        {review.isVerifiedPurchase && (
                          <Badge variant="secondary" className="text-xs">인증된 구매</Badge>
                        )}
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(review.date), { addSuffix: true, locale: ko })}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm font-medium">{review.rating}.0</span>
                      </div>
                      
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      
                      {review.photos && review.photos.length > 0 && (
                        <div className="flex gap-2 mb-2">
                          {review.photos.map((photo, index) => (
                            <img
                              key={index}
                              src={photo}
                              alt={`리뷰 사진 ${index + 1}`}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>도움됨: {review.helpful || 0}</span>
                        {review.reportCount > 0 && (
                          <span className="text-red-600">신고: {review.reportCount}건</span>
                        )}
                        {review.moderatedBy && (
                          <span>최종 검토: {review.moderatedBy}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 업체 답변 */}
                  {review.businessResponse && (
                    <div className="ml-14 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-blue-600">업체 답변</Badge>
                        <span className="text-sm text-gray-600">{review.businessResponse.author}</span>
                      </div>
                      <p className="text-sm text-gray-700">{review.businessResponse.content}</p>
                    </div>
                  )}

                  {/* 관리자 메모 */}
                  {review.moderationNotes && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-200">
                      <div className="text-sm font-medium text-yellow-800 mb-1">관리자 메모</div>
                      <p className="text-sm text-yellow-700">{review.moderationNotes}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditReview(review)}
                    className="gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    수정
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleVisibility(review)}
                    className={`gap-2 ${
                      review.status === 'hidden' 
                        ? 'text-green-600 border-green-200 hover:bg-green-50' 
                        : 'text-yellow-600 border-yellow-200 hover:bg-yellow-50'
                    }`}
                  >
                    {review.status === 'hidden' ? (
                      <>
                        <Eye className="w-4 h-4" />
                        표시
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        숨김
                      </>
                    )}
                  </Button>
                  
                  {review.reportCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewReports(review)}
                      className="gap-2 text-orange-600 border-orange-200 hover:bg-orange-50"
                    >
                      <Flag className="w-4 h-4" />
                      신고 ({review.reportCount})
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedReview(review);
                      setModerationNotes('');
                      setIsDeleteDialogOpen(true);
                    }}
                    className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    삭제
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredReviews.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">리뷰가 없습니다</h3>
              <p className="text-gray-600">현재 조건에 맞는 리뷰가 없습니다.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 리뷰 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>리뷰 수정 - {selectedReview?.businessName}</DialogTitle>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="rating">평점</Label>
                <Select value={editedRating.toString()} onValueChange={(value) => setEditedRating(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">★★★★★ (5점)</SelectItem>
                    <SelectItem value="4">★★★★☆ (4점)</SelectItem>
                    <SelectItem value="3">★★★☆☆ (3점)</SelectItem>
                    <SelectItem value="2">★★☆☆☆ (2점)</SelectItem>
                    <SelectItem value="1">★☆☆☆☆ (1점)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="comment">리뷰 내용</Label>
                <Textarea
                  id="comment"
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                  rows={5}
                />
              </div>

              <div>
                <Label htmlFor="moderation-notes">관리자 메모</Label>
                <Textarea
                  id="moderation-notes"
                  value={moderationNotes}
                  onChange={(e) => setModerationNotes(e.target.value)}
                  placeholder="수정 사유나 관리자 메모를 입력하세요..."
                  rows={3}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
              취소
            </Button>
            <Button onClick={handleSaveEdit} className="flex-1">
              수정 저장
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 리뷰 삭제 확인 다이얼로그 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>리뷰 삭제 확인</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedReview?.businessName}의 리뷰를 삭제하시겠습니까?
              <br />삭제된 리뷰는 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <Label htmlFor="delete-reason">삭제 사유</Label>
            <Textarea
              id="delete-reason"
              value={moderationNotes}
              onChange={(e) => setModerationNotes(e.target.value)}
              placeholder="삭제 사유를 입력하세요..."
              rows={3}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setModerationNotes('')}>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteReview} className="bg-red-600 hover:bg-red-700">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 신고 내역 다이얼로그 */}
      <Dialog open={isReportsDialogOpen} onOpenChange={setIsReportsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>신고 내역 - {selectedReview?.businessName}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
            {reports
              .filter(report => report.reviewId === selectedReview?.id)
              .map((report) => (
                <div key={report.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{report.reporterName}</span>
                      <Badge variant={report.status === 'pending' ? 'warning' : 'secondary'}>
                        {report.status === 'pending' ? '검토 대기' : 
                         report.status === 'reviewed' ? '검토 완료' : '기각됨'}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(report.date), { addSuffix: true, locale: ko })}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>신고 사유:</strong> {report.reason}
                  </div>
                  
                  <p className="text-sm text-gray-700">
                    {report.description}
                  </p>
                </div>
              ))}

            {reports.filter(report => report.reviewId === selectedReview?.id).length === 0 && (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">신고 내역이 없습니다.</p>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setIsReportsDialogOpen(false)}>
              닫기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}