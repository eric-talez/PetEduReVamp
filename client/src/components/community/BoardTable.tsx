import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Heart, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Post {
  id: number;
  title: string;
  content: string;
  tag?: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  likes: number;
  comments: number;
  views?: number;
  createdAt: string;
}

interface BoardTableProps {
  posts: Post[];
  currentPage: number;
  itemsPerPage: number;
  onPostClick: (post: Post) => void;
}

export function BoardTable({ posts, currentPage, itemsPerPage, onPostClick }: BoardTableProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">번호</TableHead>
            <TableHead className="w-20">분류</TableHead>
            <TableHead>제목</TableHead>
            <TableHead className="w-32">작성자</TableHead>
            <TableHead className="w-20 text-center">조회</TableHead>
            <TableHead className="w-20 text-center">좋아요</TableHead>
            <TableHead className="w-32">작성일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post, index) => (
            <TableRow 
              key={post.id} 
              className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors" 
              onClick={() => onPostClick(post)}
            >
              <TableCell className="font-medium text-gray-500 text-center">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs font-normal">
                  {post.tag || '일반'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium hover:text-primary transition-colors line-clamp-1">
                    {post.title}
                  </span>
                  {post.comments > 0 && (
                    <span className="flex items-center text-xs text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      {post.comments}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={post.author?.avatar} />
                    <AvatarFallback className="text-xs bg-gray-100 dark:bg-gray-700">
                      {post.author?.name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm truncate max-w-20">
                    {post.author?.name || '익명'}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                  <Eye className="h-3 w-3" />
                  <span>{post.views || 0}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                  <Heart className="h-3 w-3" />
                  <span>{post.likes || 0}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt), { 
                  addSuffix: true, 
                  locale: ko 
                })}
              </TableCell>
            </TableRow>
          ))}
          {posts.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                게시글이 없습니다
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}