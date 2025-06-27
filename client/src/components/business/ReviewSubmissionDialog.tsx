import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReviewSubmissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  businessName: string;
  onSubmit: (reviewData: ReviewData) => void;
}

interface ReviewData {
  businessId: string;
  rating: number;
  comment: string;
  photos: File[];
  serviceType?: string;
  visitDate?: string;
}

export function ReviewSubmissionDialog({
  isOpen,
  onClose,
  businessId,
  businessName,
  onSubmit
}: ReviewSubmissionDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [serviceType, setServiceType] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (photos.length + files.length > 5) {
      toast({
        title: "사진 업로드 제한",
        description: "최대 5장까지 업로드할 수 있습니다.",
        variant: "destructive"
      });
      return;
    }
    setPhotos(prev => [...prev, ...files]);
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "평점을 선택해주세요",
        description: "별점을 클릭하여 평점을 선택해주세요.",
        variant: "destructive"
      });
      return;
    }

    if (comment.trim().length < 10) {
      toast({
        title: "리뷰 내용이 부족합니다",
        description: "최소 10자 이상 작성해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const reviewData: ReviewData = {
        businessId,
        rating,
        comment: comment.trim(),
        photos,
        serviceType: serviceType || undefined,
        visitDate: visitDate || undefined
      };

      await onSubmit(reviewData);
      
      toast({
        title: "리뷰가 등록되었습니다",
        description: "소중한 리뷰 감사합니다!"
      });

      // 폼 초기화
      setRating(0);
      setComment('');
      setPhotos([]);
      setServiceType('');
      setVisitDate('');
      onClose();
    } catch (error) {
      console.error('리뷰 제출 실패:', error);
      toast({
        title: "리뷰 등록 실패",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" aria-describedby="review-dialog-description">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {businessName} 리뷰 작성
          </DialogTitle>
          <p id="review-dialog-description" className="text-sm text-gray-600">
            이용하신 서비스에 대한 솔직한 후기를 남겨주세요.
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 평점 선택 */}
          <div className="space-y-2">
            <Label className="text-base font-medium">평점을 선택해주세요</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-lg font-medium text-gray-700">
                  {rating === 1 && '별로예요'}
                  {rating === 2 && '그저 그래요'}
                  {rating === 3 && '보통이에요'}
                  {rating === 4 && '좋아요'}
                  {rating === 5 && '최고예요'}
                </span>
              )}
            </div>
          </div>

          {/* 방문 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="visitDate">방문 날짜 (선택사항)</Label>
              <Input
                id="visitDate"
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceType">이용 서비스 (선택사항)</Label>
              <Input
                id="serviceType"
                placeholder="예: 기본 훈련, 미용 등"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
              />
            </div>
          </div>

          {/* 리뷰 내용 */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-base font-medium">
              리뷰 내용 <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="comment"
              placeholder="이용하신 서비스는 어떠셨나요? 자세한 후기를 남겨주세요. (최소 10자)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <div className="text-sm text-gray-500 text-right">
              {comment.length}/500자
            </div>
          </div>

          {/* 사진 업로드 */}
          <div className="space-y-2">
            <Label className="text-base font-medium">사진 첨부 (선택사항)</Label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => document.getElementById('photo-upload')?.click()}
                  disabled={photos.length >= 5}
                >
                  <Upload className="w-4 h-4" />
                  사진 추가 ({photos.length}/5)
                </Button>
                <span className="text-sm text-gray-500">
                  JPG, PNG 파일만 가능 (최대 5장)
                </span>
              </div>
              <input
                id="photo-upload"
                type="file"
                accept="image/jpeg,image/png"
                multiple
                className="hidden"
                onChange={handlePhotoUpload}
              />
              
              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`업로드된 사진 ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 안내사항 */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">리뷰 작성 안내</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 실제 이용 경험을 바탕으로 솔직한 리뷰를 작성해주세요</li>
              <li>• 욕설, 비방, 광고성 내용은 삭제될 수 있습니다</li>
              <li>• 업체 운영에 도움이 되는 건설적인 의견을 남겨주세요</li>
              <li>• 작성된 리뷰는 수정이 어려우니 신중히 작성해주세요</li>
            </ul>
          </div>
        </div>

        {/* 버튼 활성화 상태 안내 */}
        {(rating === 0 || comment.trim().length < 10) && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-amber-800">
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <span className="text-sm font-medium">리뷰 등록을 위해 필요한 정보</span>
            </div>
            <ul className="mt-2 text-sm text-amber-700 space-y-1">
              {rating === 0 && <li>• 별점을 선택해주세요</li>}
              {comment.trim().length < 10 && (
                <li>• 리뷰 내용을 최소 10자 이상 작성해주세요 (현재: {comment.trim().length}자)</li>
              )}
            </ul>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
            className="min-w-[100px]"
          >
            {isSubmitting ? '등록 중...' : '리뷰 등록'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}