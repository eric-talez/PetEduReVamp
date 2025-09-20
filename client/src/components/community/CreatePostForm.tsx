import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Link, X } from 'lucide-react';
import { NewPost } from '@/types/community';

interface CreatePostFormProps {
  post: NewPost;
  onPostChange: (post: NewPost) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  categories?: string[];
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({
  post,
  onPostChange,
  onSubmit,
  onCancel,
  isLoading = false,
  categories = ['일반', '훈련팁', '건강', '행동교정', '사회화', '질문', '후기']
}) => {
  const [showLinkSection, setShowLinkSection] = useState(false);

  const handleFieldChange = (field: keyof NewPost, value: string) => {
    onPostChange({ ...post, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 제목 */}
      <div className="space-y-2">
        <Label htmlFor="title">제목 *</Label>
        <Input
          id="title"
          placeholder="제목을 입력하세요"
          value={post.title}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          required
          data-testid="post-title-input"
        />
      </div>

      {/* 카테고리 */}
      <div className="space-y-2">
        <Label htmlFor="category">카테고리</Label>
        <Select value={post.category} onValueChange={(value) => handleFieldChange('category', value)}>
          <SelectTrigger data-testid="post-category-select">
            <SelectValue placeholder="카테고리를 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 내용 */}
      <div className="space-y-2">
        <Label htmlFor="content">내용 *</Label>
        <Textarea
          id="content"
          placeholder="내용을 입력하세요"
          value={post.content}
          onChange={(e) => handleFieldChange('content', e.target.value)}
          rows={10}
          required
          data-testid="post-content-textarea"
        />
      </div>

      {/* 태그 */}
      <div className="space-y-2">
        <Label htmlFor="tags">태그</Label>
        <Input
          id="tags"
          placeholder="태그를 쉼표로 구분하여 입력하세요 (예: 훈련, 산책, 사회화)"
          value={post.tags}
          onChange={(e) => handleFieldChange('tags', e.target.value)}
          data-testid="post-tags-input"
        />
      </div>

      {/* 링크 추가 섹션 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>링크 첨부</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowLinkSection(!showLinkSection)}
            data-testid="toggle-link-section"
          >
            <Link className="h-4 w-4 mr-1" />
            {showLinkSection ? '링크 섹션 닫기' : '링크 추가'}
          </Button>
        </div>

        {showLinkSection && (
          <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
            <div className="space-y-2">
              <Label htmlFor="linkUrl">링크 URL</Label>
              <Input
                id="linkUrl"
                placeholder="https://example.com"
                value={post.linkUrl}
                onChange={(e) => handleFieldChange('linkUrl', e.target.value)}
                data-testid="post-link-url-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkTitle">링크 제목</Label>
              <Input
                id="linkTitle"
                placeholder="링크 제목을 입력하세요"
                value={post.linkTitle}
                onChange={(e) => handleFieldChange('linkTitle', e.target.value)}
                data-testid="post-link-title-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkDescription">링크 설명</Label>
              <Textarea
                id="linkDescription"
                placeholder="링크에 대한 간단한 설명을 입력하세요"
                value={post.linkDescription}
                onChange={(e) => handleFieldChange('linkDescription', e.target.value)}
                rows={3}
                data-testid="post-link-description-textarea"
              />
            </div>
          </div>
        )}
      </div>

      {/* 버튼 */}
      <div className="flex gap-2 pt-4">
        <Button 
          type="submit" 
          disabled={isLoading || !post.title.trim() || !post.content.trim()}
          data-testid="submit-post-button"
        >
          {isLoading ? '게시 중...' : '게시하기'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          data-testid="cancel-post-button"
        >
          취소
        </Button>
      </div>
    </form>
  );
};

export default CreatePostForm;