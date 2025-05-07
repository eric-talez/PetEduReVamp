import { useState, useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  ArrowLeft,
  Send,
  BookmarkPlus,
  MoreHorizontal,
  AlertCircle
} from "lucide-react";
import { isAuthenticated, getInitials } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// 댓글 타입 정의
interface Comment {
  id: number;
  text: string;
  author: {
    name: string;
    avatar: string;
    isTrainer?: boolean;
  };
  time: string;
  likes: number;
}

// 게시물 타입 정의
interface Post {
  id: number;
  title: string;
  content: string;
  image?: string;
  tag: string;
  author: {
    name: string;
    avatar: string;
    time: string;
    isTrainer?: boolean;
  };
  likes: number;
  comments: Comment[];
}

// 목업 데이터 - 실제로는 API 호출로 대체
const MOCK_POST: Post = {
  id: 1,
  title: "우리 강아지가 드디어 기본 훈련을 마쳤어요!",
  content: "3개월 동안 꾸준히 훈련한 결과, 드디어 앉아, 기다려, 엎드려 등 기본 명령을 모두 이해하게 되었습니다. 처음에는 정말 힘들었지만 포기하지 않고 꾸준히 한 결과가 값진 것 같아요. 다른 분들도 포기하지 마시고 꾸준히 하시면 반드시 효과가 있을 거예요!",
  image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
  tag: "성공후기",
  author: {
    name: "김견주",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    time: "2시간 전",
  },
  likes: 42,
  comments: [
    {
      id: 1,
      text: "축하드려요! 정말 멋진 성과네요. 저도 지금 훈련 중인데 희망이 생겼어요.",
      author: {
        name: "박주인",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      },
      time: "1시간 전",
      likes: 5
    },
    {
      id: 2,
      text: "훈련사로서 조언 드리자면, 지금 이 시기에 배운 것을 계속 복습하는 것이 중요합니다. 규칙적인 복습으로 더 견고하게 기억할 수 있어요!",
      author: {
        name: "최훈련",
        avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        isTrainer: true
      },
      time: "45분 전",
      likes: 12
    },
    {
      id: 3,
      text: "어떤 훈련 방법을 사용하셨나요? 저희 강아지도 훈련 중인데 좋은 팁이 있으시면 알려주세요!",
      author: {
        name: "이훈련중",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      },
      time: "30분 전",
      likes: 3
    }
  ]
};

// 로그인 유도 함수
function promptLogin() {
  // 먼저 토스트 알림 표시 (toast는 useToast 훅에서 가져온 것을 사용해야 함)
  // 여기서는 전역 함수로 정의하므로 window.alert로 대체
  window.alert("로그인이 필요합니다. 이 기능을 사용하려면 로그인이 필요합니다.");
  
  // 확인 클릭 전까지는 페이지 그대로 유지
  const confirmed = window.confirm("로그인 페이지로 이동하시겠습니까?");
  if (confirmed) {
    window.location.href = "/auth/login";
  }
}

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const { toast } = useToast();

  // 댓글 좋아요 상태 관리
  const [commentLikes, setCommentLikes] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // 실제 구현에서는 API 호출로 대체
    const fetchPost = async () => {
      try {
        // 여기서는 목업 데이터 사용
        setPost(MOCK_POST);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // 게시물 좋아요 토글
  const toggleLike = () => {
    if (isAuthenticated()) {
      setLiked(!liked);
      toast({
        title: liked ? "좋아요 취소" : "좋아요",
        description: liked ? "게시물 좋아요를 취소했습니다." : "게시물을 좋아합니다.",
      });
    } else {
      promptLogin();
    }
  };

  // 댓글 좋아요 토글
  const toggleCommentLike = (commentId: number) => {
    if (isAuthenticated()) {
      setCommentLikes(prev => ({
        ...prev,
        [commentId]: !prev[commentId]
      }));
    } else {
      promptLogin();
    }
  };

  // 댓글 등록
  const handleAddComment = () => {
    if (!isAuthenticated()) {
      promptLogin();
      return;
    }

    if (!commentText.trim()) {
      toast({
        title: "댓글 오류",
        description: "댓글 내용을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    // 새 댓글 추가 (실제로는 API 호출)
    if (post) {
      const newComment: Comment = {
        id: Date.now(),
        text: commentText,
        author: {
          name: "현재 사용자", // 실제로는 로그인된 사용자 정보 사용
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        },
        time: "방금 전",
        likes: 0
      };

      setPost({
        ...post,
        comments: [newComment, ...post.comments]
      });

      setCommentText("");
      
      toast({
        title: "댓글 등록 완료",
        description: "댓글이 성공적으로 등록되었습니다.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">게시물을 찾을 수 없습니다</h1>
        <p className="text-gray-500 mb-6">요청하신 게시물이 존재하지 않거나 삭제되었습니다.</p>
        <Link href="/community">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> 
            커뮤니티로 돌아가기
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* 뒤로가기 */}
      <div className="mb-6">
        <Link href="/community">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" /> 
            커뮤니티로 돌아가기
          </Button>
        </Link>
      </div>

      {/* 게시물 카드 */}
      <Card className="mb-6 overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="p-6">
          {/* 작성자 정보 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Avatar className="w-10 h-10">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
              </Avatar>
              
              <div className="ml-3">
                <div className="flex items-center">
                  <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                    {post.author.name}
                  </h3>
                  {post.author.isTrainer && (
                    <Badge variant="success" className="ml-2 text-xs">훈련사</Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{post.author.time}</p>
              </div>
            </div>
            
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
          
          {/* 게시물 내용 */}
          <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{post.title}</h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-line">
            {post.content}
          </p>
          
          {post.image && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          
          {/* 게시물 상호작용 */}
          <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex space-x-6">
              <button 
                className="flex items-center focus:outline-none"
                onClick={toggleLike}
              >
                <Heart className={`h-5 w-5 mr-1.5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{liked ? post.likes + 1 : post.likes}</span>
              </button>
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-1.5" />
                <span>{post.comments.length}</span>
              </div>
              <button 
                className="flex items-center focus:outline-none"
                onClick={() => {
                  if (isAuthenticated()) {
                    navigator.clipboard.writeText(window.location.href);
                    toast({
                      title: "링크 복사됨",
                      description: "게시물 링크가 클립보드에 복사되었습니다.",
                    });
                  } else {
                    promptLogin();
                  }
                }}
              >
                <Share2 className="h-5 w-5 mr-1.5" />
                <span>공유</span>
              </button>
            </div>
            
            <div className="flex items-center">
              <BookmarkPlus className="h-5 w-5 mr-1.5" />
              <Badge 
                variant={
                  post.tag === "훈련팁" ? "success" : 
                  post.tag === "산책팁" ? "info" : 
                  post.tag === "성공후기" ? "purple" :
                  post.tag === "반려견간식" ? "warning" : "secondary"
                } 
              >
                {post.tag}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
      
      {/* 댓글 섹션 */}
      <Card className="border border-gray-100 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
            댓글 {post.comments.length}개
          </h2>
          
          {/* 댓글 작성 - 모든 사용자에게 표시하되, 비로그인 사용자에게는 안내 메시지 표시 */}
          <div className="mb-8">
            {!isAuthenticated() && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 mb-3">
                <p className="text-sm text-yellow-800 dark:text-yellow-300 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  댓글을 작성하려면 <Link href="/auth/login" className="text-blue-600 dark:text-blue-400 underline ml-1 mr-1">로그인</Link>이 필요합니다.
                </p>
              </div>
            )}
            <Textarea
              placeholder="댓글을 남겨보세요..."
              className="min-h-[80px] mb-3"
              value={commentText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCommentText(e.target.value)}
            />
            <div className="flex justify-end">
              <Button onClick={handleAddComment}>
                <Send className="h-4 w-4 mr-2" />
                댓글 등록
              </Button>
            </div>
          </div>
          
          {/* 댓글 목록 */}
          <div className="space-y-6">
            {post.comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-start mb-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                    <AvatarFallback>{getInitials(comment.author.name)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="ml-3 flex-1">
                    <div className="flex items-center">
                      <h4 className="text-sm font-medium text-gray-800 dark:text-white">
                        {comment.author.name}
                      </h4>
                      {comment.author.isTrainer && (
                        <Badge variant="success" className="ml-2 text-xs">훈련사</Badge>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        {comment.time}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {comment.text}
                    </p>
                    
                    <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <button 
                        className="flex items-center focus:outline-none mr-4"
                        onClick={() => toggleCommentLike(comment.id)}
                      >
                        <Heart className={`h-3.5 w-3.5 mr-1 ${commentLikes[comment.id] ? 'fill-red-500 text-red-500' : ''}`} />
                        <span>{commentLikes[comment.id] ? comment.likes + 1 : comment.likes}</span>
                      </button>
                      <button className="focus:outline-none">
                        답글
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}