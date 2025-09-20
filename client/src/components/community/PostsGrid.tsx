import React from 'react';
import { Post, ViewType } from '@/types/community';
import PostCard from './PostCard';
import PostListItem from './PostListItem';

interface PostsGridProps {
  posts: Post[];
  viewType: ViewType;
  onPostClick: (post: Post) => void;
  isLoading?: boolean;
  className?: string;
}

const PostsGrid: React.FC<PostsGridProps> = ({
  posts,
  viewType,
  onPostClick,
  isLoading = false,
  className = ''
}) => {
  if (isLoading) {
    return (
      <div className={`grid gap-4 ${className}`}>
        {/* 로딩 스켈레톤 */}
        {Array.from({ length: 8 }).map((_, index) => (
          <div 
            key={index} 
            className="bg-gray-200 animate-pulse rounded-lg"
            style={{ 
              height: viewType === 'card' ? '320px' : '120px' 
            }}
          />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">게시글이 없습니다.</p>
        <p className="text-gray-400 text-sm mt-2">첫 번째 게시글을 작성해보세요!</p>
      </div>
    );
  }

  if (viewType === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {posts.map((post) => (
          <PostListItem
            key={post.id}
            post={post}
            onClick={onPostClick}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onClick={onPostClick}
        />
      ))}
    </div>
  );
};

export default PostsGrid;