import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Heart, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Post } from '@/types/community';

interface PostListItemProps {
  post: Post;
  onClick: (post: Post) => void;
  className?: string;
}

const PostListItem: React.FC<PostListItemProps> = ({ post, onClick, className = '' }) => {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ko });
    } catch {
      return '방금 전';
    }
  };

  const getCommentsCount = (comments: number | any[]) => {
    return Array.isArray(comments) ? comments.length : (comments || 0);
  };

  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-shadow ${className}`} 
      onClick={() => onClick(post)}
      data-testid={`post-list-item-${post.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* 썸네일 이미지 (리스트뷰에서는 작게) */}
          {post.linkInfo?.image && (
            <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-lg">
              <img 
                src={post.linkInfo.image} 
                alt={post.linkInfo.title || post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {post.tag}
              </Badge>
              <span className="text-xs text-gray-500">
                {post.author?.name || '익명 사용자'} • {formatDate(post.createdAt)}
              </span>
            </div>
            <h3 className="font-semibold text-lg mb-2 line-clamp-1">{post.title}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.content}</p>
            
            {/* 링크 정보 미리보기 (썸네일이 없고 리스트뷰일 때) */}
            {post.linkInfo && !post.linkInfo.image && (
              <div className="mb-3 p-2 bg-gray-50 rounded border text-xs">
                <div className="font-medium line-clamp-1">{post.linkInfo.title}</div>
                <div className="text-gray-600 line-clamp-1 mt-1">{post.linkInfo.description}</div>
              </div>
            )}
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>{post.likes || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{getCommentsCount(post.comments)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{post.views || 0}</span>
              </div>
            </div>
          </div>
          
          {/* 작성자 아바타 (오른쪽 끝) */}
          <div className="flex-shrink-0">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author?.image} alt={post.author?.name} />
              <AvatarFallback>{post.author?.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostListItem;