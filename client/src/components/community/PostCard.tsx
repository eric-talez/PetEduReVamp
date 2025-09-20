import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Heart, Eye, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Post } from '@/types/community';

interface PostCardProps {
  post: Post;
  onClick: (post: Post) => void;
  className?: string;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick, className = '' }) => {
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
      className={`h-full cursor-pointer hover:shadow-md transition-shadow ${className}`} 
      onClick={() => onClick(post)}
      data-testid={`post-card-${post.id}`}
    >
      {/* 썸네일 이미지 영역 */}
      {post.linkInfo?.image && (
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
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
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
          {post.tag && (
            <Badge variant="secondary" className="ml-2 shrink-0">
              {post.tag}
            </Badge>
          )}
        </div>
        <CardDescription className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Avatar className="h-5 w-5">
              <AvatarImage src={post.author?.image} alt={post.author?.name} />
              <AvatarFallback>{post.author?.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <span>{post.author?.name || '익명 사용자'}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-sm text-gray-600 line-clamp-3">{post.content}</p>
        
        {/* 링크 정보 미리보기 (썸네일이 없을 때만) */}
        {post.linkInfo && !post.linkInfo.image && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h4 className="font-medium text-sm line-clamp-1">{post.linkInfo.title}</h4>
                <p className="text-xs text-gray-600 line-clamp-2 mt-1">{post.linkInfo.description}</p>
                <p className="text-xs text-blue-600 mt-1 truncate">{post.linkInfo.url}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
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
      </CardFooter>
    </Card>
  );
};

export default PostCard;