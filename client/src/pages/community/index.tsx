import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/avatar";
import { Send, Search, Heart, MessageSquare, Share2, BookmarkPlus, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Community() {
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [postsData, setPostsData] = useState<any[]>([]);
  
  // 로그인 상태 확인 함수
  const isAuthenticated = (): boolean => {
    const storedAuth = localStorage.getItem('petedu_auth');
    return storedAuth !== null;
  };
  
  // 로그인 유도 함수
  const promptLogin = () => {
    // 먼저 토스트 알림 표시
    toast({
      title: "로그인이 필요합니다",
      description: "이 기능을 사용하려면 로그인이 필요합니다.",
      variant: "destructive",
    });
    
    // 확인 클릭 전까지는 커뮤니티 페이지 그대로 유지
    const confirmed = window.confirm("로그인 페이지로 이동하시겠습니까?");
    if (confirmed) {
      window.location.href = "/auth/login";
    }
  };
  
  // 댓글 입력 처리
  const handleCommentInputChange = (postId: number, value: string) => {
    setCommentInputs(prev => ({
      ...prev,
      [postId]: value
    }));
  };
  
  // 댓글 등록 처리
  const handleAddComment = (postId: number) => {
    if (!isAuthenticated()) {
      promptLogin();
      return;
    }
    
    const commentText = commentInputs[postId] || '';
    
    if (!commentText.trim()) {
      toast({
        title: "댓글 오류",
        description: "댓글 내용을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    // 실제 구현에서는 API 호출로 댓글 등록
    // 여기서는 로컬 상태 업데이트로 시뮬레이션
    
    // 댓글 카운트 증가
    const updatedPosts = postsData.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments + 1
        };
      }
      return post;
    });
    
    setPostsData(updatedPosts);
    
    // 입력창 초기화
    setCommentInputs(prev => ({
      ...prev,
      [postId]: ''
    }));
    
    // 성공 메시지
    toast({
      title: "댓글 등록 완료",
      description: "댓글이 성공적으로 등록되었습니다.",
    });
    
    // 옵션: 상세 페이지로 이동할지 확인
    setTimeout(() => {
      const shouldRedirect = window.confirm("등록된 댓글을 확인하기 위해 상세 페이지로 이동하시겠습니까?");
      if (shouldRedirect) {
        window.location.href = `/community/post/${postId}`;
      }
    }, 500);
  };
  
  const posts = [
    {
      id: 1,
      author: {
        name: "최견주",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        time: "3시간 전"
      },
      title: "산책 중 다른 강아지 만났을 때 대처법",
      content: "오늘 산책 중 크고 활발한 강아지를 만났는데, 우리집 강아지가 너무 긴장하더라구요. 훈련사님이 알려주신 대로 거리를 두고 차분히 대응했더니 효과가 있었어요. 다른 견주분들도 시도해보세요!",
      likes: 28,
      comments: 12,
      tag: "산책팁",
      isLiked: false
    },
    {
      id: 2,
      author: {
        name: "김훈련",
        avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        time: "어제",
        isTrainer: true
      },
      title: "강아지가 말을 안들을 때 해결법",
      content: "많은 견주님들이 반려견이 말을 안들어서 힘들어하십니다. 하지만 강아지 입장에선 여러분이 무슨 말을 하는지 모를 수 있어요. 일관된 명령어와 적절한 보상으로 서서히 훈련하는 것이 중요합니다. 다음 주 라이브 세션에서 자세히 알려드릴게요!",
      likes: 56,
      comments: 23,
      tag: "훈련팁",
      isLiked: true
    },
    {
      id: 3,
      author: {
        name: "박반려",
        avatar: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        time: "2일 전"
      },
      title: "분리불안 극복 성공 후기",
      content: "저희 코코가 혼자 있으면 짖고 물건을 망가뜨리는 문제가 심했는데, 이 플랫폼에서 분리불안 과정을 수강하고 정말 많이 좋아졌어요! 특히 점진적 이별 훈련이 효과적이었습니다. 비슷한 고민 있으신 분들께 추천해요.",
      likes: 42,
      comments: 18,
      tag: "성공후기",
      isLiked: false,
      image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: 4,
      author: {
        name: "이영양",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        time: "3일 전"
      },
      title: "반려견 수제 간식 레시피 공유",
      content: "안녕하세요! 오늘은 제가 우리 멍이에게 자주 만들어주는 건강한 수제 간식 레시피를 공유할게요. 단백질 소스로 닭가슴살을, 건강한 섬유질을 위해 당근과 호박을 사용했어요. 만드는 방법은 정말 간단합니다...(생략)... 여러분의 반려견에게도 건강한 간식을 만들어주세요!",
      likes: 87,
      comments: 32,
      tag: "반려견간식",
      isLiked: true,
      image: "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: 5,
      author: {
        name: "최훈련",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        time: "3일 전",
        isTrainer: true
      },
      title: "반려견 장난감 선택의 중요성",
      content: "반려견에게 적절한 장난감을 선택하는 것은 정신적 자극과 신체 활동에 큰 영향을 미칩니다. 특히 지능 개발 장난감은 반려견의 문제 해결 능력을 키우는데 도움이 됩니다. 장난감을 선택할 때는 반려견의 크기, 나이, 성격을 고려하세요. 또한 안전을 위해 작은 부품이 떨어질 위험이 없는지 확인하는 것도 중요합니다.",
      likes: 45,
      comments: 14,
      tag: "반려견용품",
      isLiked: false
    },
    {
      id: 6,
      author: {
        name: "김포토",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        time: "4일 전"
      },
      title: "우리 댕댕이 첫 산책 나들이",
      content: "입양한 지 3주 만에 첫 산책을 나갔어요! 처음에는 조금 무서워했지만 천천히 적응하더니 이제는 산책 가자고 하면 너무 신나서 달려와요. 다른 강아지들과도 인사를 잘 하고 사람들도 좋아합니다. 사회화 훈련의 중요성을 다시 한번 느꼈네요.",
      likes: 63,
      comments: 21,
      tag: "일상",
      isLiked: true,
      image: "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    }
  ];

  // 컴포넌트 마운트 시 posts 데이터를 postsData 상태에 설정
  useEffect(() => {
    setPostsData(posts);
  }, []);
  
  // postsData를 사용하여 필터링
  const filteredPosts = filter === "all" 
    ? postsData 
    : postsData.filter(post => post.tag === filter);

  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>(() => {
    const initialLikes: Record<number, boolean> = {};
    posts.forEach(post => {
      initialLikes[post.id] = post.isLiked;
    });
    return initialLikes;
  });

  // 좋아요 기능 (로그인 필요)
  const toggleLike = (postId: number) => {
    if (isAuthenticated()) {
      // 로그인 상태일 때만 좋아요 토글 처리
      setLikedPosts(prev => ({
        ...prev,
        [postId]: !prev[postId]
      }));
    } else {
      // 비로그인 상태면 로그인 유도
      promptLogin();
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      {/* Banner */}
      <div className="relative rounded-xl overflow-hidden h-48 md:h-64 mb-8 bg-gradient-to-r from-primary/80 to-accent/80 shadow-lg">
        <img 
          src="https://images.unsplash.com/photo-1560743641-3914f2c45636?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=400" 
          alt="커뮤니티"
          className="w-full h-full object-cover absolute mix-blend-overlay"
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/30 mix-blend-multiply"></div>
        
        <div className="relative h-full flex flex-col justify-center px-6 md:px-10">
          <h1 className="text-white text-xl md:text-3xl font-bold mb-2 md:mb-4 max-w-xl">
            반려견 커뮤니티
          </h1>
          <p className="text-white text-sm md:text-base max-w-xl mb-4">
            다른 견주들과 경험을 공유하고 유용한 정보를 나눠보세요.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-lg bg-white dark:bg-gray-800 rounded-lg flex items-center p-1">
            <div className="px-2">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="게시물 검색" 
              className="flex-1 py-2 px-2 bg-transparent focus:outline-none text-gray-800 dark:text-gray-200"
            />
            <Button className="ml-2">
              검색
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side - Post List */}
        <div className="w-full md:w-2/3">
          {/* Filters */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mr-4">
              <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400 ml-2 mr-1" />
              <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">태그:</span>
            </div>
            
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className="text-xs"
            >
              전체
            </Button>
            
            <Button
              variant={filter === "훈련팁" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("훈련팁")}
              className="text-xs"
            >
              훈련팁
            </Button>
            
            <Button
              variant={filter === "산책팁" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("산책팁")}
              className="text-xs"
            >
              산책팁
            </Button>
            
            <Button
              variant={filter === "성공후기" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("성공후기")}
              className="text-xs"
            >
              성공후기
            </Button>
            
            <Button
              variant={filter === "일상" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("일상")}
              className="text-xs"
            >
              일상
            </Button>
            
            <Button
              variant={filter === "반려견간식" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("반려견간식")}
              className="text-xs"
            >
              반려견간식
            </Button>
          </div>
          
          {/* Write Button (Mobile) - 로그인 필요 */}
          <div className="mb-6 md:hidden">
            <Button 
              className="w-full"
              onClick={() => {
                if (!isAuthenticated()) {
                  promptLogin();
                } else {
                  toast({
                    title: "게시물 작성",
                    description: "게시물 작성 페이지로 이동합니다.",
                  });
                  // 실제로는 게시물 작성 페이지로 이동
                }
              }}
            >
              새 게시물 작성하기
            </Button>
          </div>
          
          {/* Posts */}
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} hover className="overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="p-5">
                  <div className="flex items-center mb-4">
                    <Avatar 
                      className="w-10 h-10"
                      src={post.author.avatar}
                      fallback={post.author.name.charAt(0)}
                    />
                    
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
                  
                  <h4 className="text-base font-semibold text-gray-800 dark:text-white mb-2">{post.title}</h4>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {post.content}
                  </p>
                  
                  {post.image && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-auto max-h-80 object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex space-x-4">
                      <button 
                        className="flex items-center focus:outline-none"
                        onClick={() => toggleLike(post.id)}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${likedPosts[post.id] ? 'fill-red-500 text-red-500' : ''}`} />
                        <span>{likedPosts[post.id] ? post.likes + 1 : post.likes}</span>
                      </button>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span>{post.comments}</span>
                      </div>
                      <button className="flex items-center focus:outline-none">
                        <Share2 className="h-4 w-4 mr-1" />
                        <span>공유</span>
                      </button>
                    </div>
                    
                    <div className="flex items-center">
                      <BookmarkPlus className="h-4 w-4 mr-1" />
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
                
                {/* Comment Section Preview */}
                {post.comments > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <input 
                          type="text" 
                          placeholder="댓글을 입력하세요..." 
                          className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full px-4 py-1.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => handleCommentInputChange(post.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddComment(post.id);
                            }
                          }}
                        />
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-2"
                        onClick={() => handleAddComment(post.id)}
                      >
                        등록
                      </Button>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <a 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          console.log(`이동: /community/post/${post.id}`);
                          window.location.href = `/community/post/${post.id}`;
                        }}
                        className="text-primary hover:text-primary/80"
                      >
                        {post.comments}개의 댓글 모두 보기
                      </a>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="text-sm">
                이전
              </Button>
              <Button variant="default" size="sm" className="text-sm">
                1
              </Button>
              <Button variant="outline" size="sm" className="text-sm">
                2
              </Button>
              <Button variant="outline" size="sm" className="text-sm">
                3
              </Button>
              <Button variant="outline" size="sm" className="text-sm">
                다음
              </Button>
            </nav>
          </div>
        </div>
        
        {/* Right Side - Sidebar */}
        <div className="w-full md:w-1/3">
          {/* Write Post */}
          <Card className="p-5 border border-gray-100 dark:border-gray-700 mb-6 hidden md:block">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">새 게시물 작성</h3>
            <div className="space-y-3 mb-4">
              <input 
                type="text" 
                placeholder="제목" 
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-4 py-2"
              />
              <textarea 
                placeholder="내용을 입력하세요..." 
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-4 py-2 min-h-[120px]"
              ></textarea>
            </div>
            <Button 
              className="w-full"
              onClick={() => {
                if (!isAuthenticated()) {
                  promptLogin();
                } else {
                  toast({
                    title: "게시물 작성",
                    description: "게시물을 작성 중입니다...",
                  });
                  // 실제 구현에서는 게시물 데이터 서버로 전송
                }
              }}
            >
              게시하기
            </Button>
          </Card>
          
          {/* Trending Topics */}
          <Card className="p-5 border border-gray-100 dark:border-gray-700 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">인기 토픽</h3>
            <div className="space-y-3">
              <div className="pb-3 border-b border-gray-100 dark:border-gray-700">
                <a href="#" className="text-sm font-medium text-gray-800 dark:text-white hover:text-primary">
                  #반려견산책
                </a>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  게시물 254개
                </p>
              </div>
              <div className="pb-3 border-b border-gray-100 dark:border-gray-700">
                <a href="#" className="text-sm font-medium text-gray-800 dark:text-white hover:text-primary">
                  #분리불안
                </a>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  게시물 178개
                </p>
              </div>
              <div className="pb-3 border-b border-gray-100 dark:border-gray-700">
                <a href="#" className="text-sm font-medium text-gray-800 dark:text-white hover:text-primary">
                  #강아지훈련
                </a>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  게시물 142개
                </p>
              </div>
              <div className="pb-3 border-b border-gray-100 dark:border-gray-700">
                <a href="#" className="text-sm font-medium text-gray-800 dark:text-white hover:text-primary">
                  #강아지장난감
                </a>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  게시물 98개
                </p>
              </div>
              <div>
                <a href="#" className="text-sm font-medium text-gray-800 dark:text-white hover:text-primary">
                  #반려견수제간식
                </a>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  게시물 87개
                </p>
              </div>
            </div>
          </Card>
          
          {/* Active Trainers */}
          <Card className="p-5 border border-gray-100 dark:border-gray-700 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">활발한 훈련사</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Avatar 
                  className="w-9 h-9"
                  src="https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
                  fallback="김"
                />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-800 dark:text-white">김훈련 트레이너</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">게시물 47개, 댓글 128개</p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto text-xs">
                  팔로우
                </Button>
              </div>
              <div className="flex items-center">
                <Avatar 
                  className="w-9 h-9"
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
                  fallback="최"
                />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-800 dark:text-white">최훈련 트레이너</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">게시물 35개, 댓글 96개</p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto text-xs">
                  팔로우
                </Button>
              </div>
              <div className="flex items-center">
                <Avatar 
                  className="w-9 h-9"
                  src="https://images.unsplash.com/photo-1548535537-3cfaf1fc327c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
                  fallback="박"
                />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-800 dark:text-white">박민첩 트레이너</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">게시물 28개, 댓글 76개</p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto text-xs">
                  팔로우
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Community Rules */}
          <Card className="p-5 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">커뮤니티 규칙</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <span className="font-medium mr-2">1.</span>
                <span>모든 구성원을 존중하는 언어를 사용해주세요.</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">2.</span>
                <span>검증되지 않은 의학적 조언은 삼가해주세요.</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">3.</span>
                <span>반려견 학대나 부적절한 훈련 방법을 권장하는 콘텐츠는 금지됩니다.</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">4.</span>
                <span>허가 없이 광고나 판매 목적의 게시물을 올리지 마세요.</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">5.</span>
                <span>질문이나 문제가 있으면 관리자에게 문의해주세요.</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
