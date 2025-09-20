import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Grid, List, Plus } from 'lucide-react';
import { ViewType } from '@/types/community';

interface SearchSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  viewType: ViewType;
  onViewTypeChange: (type: ViewType) => void;
  onCreatePost: () => void;
  isAuthenticated: boolean;
  className?: string;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  searchQuery,
  onSearchChange,
  onSearch,
  viewType,
  onViewTypeChange,
  onCreatePost,
  isAuthenticated,
  className = ''
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      {/* 검색 입력 */}
      <div className="flex-1 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="게시글 제목, 내용, 작성자명으로 검색..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
            data-testid="search-input"
          />
        </div>
        <Button 
          onClick={onSearch} 
          variant="outline"
          data-testid="search-button"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* 뷰 타입 선택 및 글쓰기 버튼 */}
      <div className="flex gap-2">
        <div className="flex border rounded-lg overflow-hidden">
          <Button
            variant={viewType === 'card' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewTypeChange('card')}
            className="rounded-none"
            data-testid="view-card-button"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewType === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewTypeChange('list')}
            className="rounded-none"
            data-testid="view-list-button"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        {isAuthenticated && (
          <Button 
            onClick={onCreatePost}
            data-testid="create-post-button"
          >
            <Plus className="h-4 w-4 mr-1" />
            글쓰기
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchSection;