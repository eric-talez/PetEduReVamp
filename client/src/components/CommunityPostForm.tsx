import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle,
  X,
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface CommunityPostFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated: (post: any) => void;
}

export function CommunityPostForm({ isOpen, onOpenChange, onPostCreated }: CommunityPostFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: 'training', label: '훈련 팁' },
    { value: 'health', label: '건강 관리' },
    { value: 'behavior', label: '행동 문제' },
    { value: 'food', label: '사료/영양' },
    { value: 'grooming', label: '미용/관리' },
    { value: 'play', label: '놀이/운동' },
    { value: 'general', label: '일반' },
    { value: 'question', label: '질문' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 에러 제거
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    } else if (formData.title.length < 5) {
      newErrors.title = '제목은 5글자 이상 입력해주세요.';
    }

    if (!formData.content.trim()) {
      newErrors.content = '내용을 입력해주세요.';
    } else if (formData.content.length < 10) {
      newErrors.content = '내용은 10글자 이상 입력해주세요.';
    }

    if (!formData.category) {
      newErrors.category = '카테고리를 선택해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('새 게시글 작성:', formData);
      
      // 실제 API 호출
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          category: formData.category,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        })
      });

      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }

      const newPost = await response.json();
      console.log('서버에서 받은 새 게시글:', newPost);
      
      // 부모 컴포넌트에 즉시 전달
      onPostCreated(newPost);
      
      
      // 폼 초기화
      setFormData({
        title: '',
        content: '',
        category: '일반',
        tags: ''
      });
      
      // 에러 초기화
      setErrors({});
      
      // 모달 닫기
      onOpenChange(false);
      
      // 성공 메시지
      console.log('게시글 작성 완료 - 폼 초기화 및 모달 닫기 처리됨');
      
    } catch (error) {
      console.error('게시글 작성 오류:', error);
      setErrors({ submit: '게시글 작성 중 오류가 발생했습니다.' });
      alert('게시글 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      training: 'bg-blue-100 text-blue-800',
      health: 'bg-green-100 text-green-800',
      behavior: 'bg-yellow-100 text-yellow-800',
      food: 'bg-orange-100 text-orange-800',
      grooming: 'bg-purple-100 text-purple-800',
      play: 'bg-pink-100 text-pink-800',
      general: 'bg-gray-100 text-gray-800',
      question: 'bg-red-100 text-red-800'
    };
    return colors[category] || colors.general;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            새 게시글 작성
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              제목 *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="게시글 제목을 입력하세요"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="h-3 w-3" />
                {errors.title}
              </div>
            )}
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              카테고리 *
            </label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange('category', value)}
            >
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(category.value)}`}>
                      {category.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="h-3 w-3" />
                {errors.category}
              </div>
            )}
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              내용 *
            </label>
            <Textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="게시글 내용을 자세히 작성해주세요. 다른 반려인들에게 도움이 되는 정보나 경험을 공유해보세요."
              rows={8}
              className={errors.content ? 'border-red-500' : ''}
            />
            {errors.content && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="h-3 w-3" />
                {errors.content}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">
              {formData.content.length} / 1000자
            </div>
          </div>

          {/* 태그 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              태그 (선택사항)
            </label>
            <Input
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="태그를 쉼표로 구분하여 입력하세요 (예: 산책, 훈련, 사회화)"
            />
            <div className="text-xs text-gray-500 mt-1">
              태그는 다른 사용자들이 게시글을 쉽게 찾을 수 있도록 도와줍니다.
            </div>
            {formData.tags && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.split(',').map((tag, index) => (
                  tag.trim() && (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag.trim()}
                    </Badge>
                  )
                ))}
              </div>
            )}
          </div>

          {/* 미리보기 */}
          {formData.title && formData.content && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2 text-sm text-gray-600">미리보기</h4>
              <div className="bg-white p-4 rounded border">
                <div className="flex items-center gap-2 mb-2">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40" 
                    alt="사용자"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <span className="font-medium text-sm">반려인</span>
                    <span className="text-xs text-gray-500 ml-2">방금 전</span>
                  </div>
                  {formData.category && (
                    <Badge variant="secondary" className="text-xs ml-auto">
                      {categories.find(cat => cat.value === formData.category)?.label}
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold mb-2">{formData.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">{formData.content}</p>
              </div>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting || !formData.title || !formData.content || !formData.category}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  작성 중...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  게시글 작성
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}