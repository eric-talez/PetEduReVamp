import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Users, DollarSign, AlertTriangle, Plus, Eye, MessageCircle, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface SubstituteClassPost {
  id: string;
  title: string;
  description: string;
  classDate: string;
  classTime: string;
  location: string;
  isOnline: boolean;
  compensation: number;
  studentCount: number;
  urgency: 'low' | 'normal' | 'high' | 'urgent';
  requiredSkills: string[];
  currentApplicants: number;
  maxApplicants: number;
  status: 'open' | 'in_progress' | 'closed' | 'completed';
  originalTrainer: string;
  specialRequirements?: string;
}

interface SubstituteApplication {
  id: string;
  postId: string;
  applicantName: string;
  message: string;
  proposedCompensation?: number;
  applicationDate: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const MOCK_POSTS: SubstituteClassPost[] = [
  {
    id: '1',
    title: '기초 복종 훈련 - 성인반',
    description: '성견 대상 기초 복종 훈련 수업입니다. 앉아, 기다려, 이리와 등 기본 명령어 교육을 진행합니다.',
    classDate: '2025-01-25',
    classTime: '14:00-15:30',
    location: '강남구 테헤란로 123',
    isOnline: false,
    compensation: 80000,
    studentCount: 5,
    urgency: 'high',
    requiredSkills: ['기초 복종', '성견 훈련'],
    currentApplicants: 2,
    maxApplicants: 3,
    status: 'open',
    originalTrainer: '김훈련사',
    specialRequirements: '대형견 경험 필수'
  },
  {
    id: '2',
    title: '퍼피 사회화 교육',
    description: '3-6개월 퍼피 대상 사회화 교육 프로그램입니다.',
    classDate: '2025-01-26',
    classTime: '10:00-11:30',
    location: '온라인 (Zoom)',
    isOnline: true,
    compensation: 60000,
    studentCount: 3,
    urgency: 'normal',
    requiredSkills: ['퍼피 교육', '사회화 훈련'],
    currentApplicants: 1,
    maxApplicants: 2,
    status: 'open',
    originalTrainer: '이훈련사'
  }
];

const MOCK_APPLICATIONS: SubstituteApplication[] = [
  {
    id: '1',
    postId: '1',
    applicantName: '박대체훈련사',
    message: '대형견 훈련 경험이 5년 이상 있습니다. 해당 시간에 수업 진행 가능합니다.',
    proposedCompensation: 80000,
    applicationDate: '2025-01-20',
    status: 'pending'
  }
];

export default function SubstituteClassBoard() {
  const [selectedTab, setSelectedTab] = useState('available');
  const [newPostDialog, setNewPostDialog] = useState(false);
  const [viewApplicationsDialog, setViewApplicationsDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 대체 수업 게시글 조회
  const { data: postsData = [], isLoading: isLoadingPosts } = useQuery({
    queryKey: ['/api/substitute-posts'],
    queryFn: () => apiRequest('GET', '/api/substitute-posts')
  });

  // 대체 수업 지원 신청 조회
  const { data: applicationsData = [], isLoading: isLoadingApplications } = useQuery({
    queryKey: ['/api/substitute-applications'],
    queryFn: () => apiRequest('GET', '/api/substitute-applications')
  });

  // 안전한 배열 변환
  const posts = Array.isArray(postsData) ? postsData : [];
  const applications = Array.isArray(applicationsData) ? applicationsData : [];

  // 대체 수업 게시글 생성
  const createPostMutation = useMutation({
    mutationFn: (postData: any) => apiRequest('POST', '/api/substitute-posts', postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/substitute-posts'] });
      toast({
        title: "대체 수업 게시글 등록",
        description: "대체 수업 게시글이 성공적으로 등록되었습니다.",
      });
      setNewPostDialog(false);
    }
  });

  // 대체 수업 지원 신청
  const applyMutation = useMutation({
    mutationFn: (applicationData: any) => apiRequest('POST', '/api/substitute-applications', applicationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/substitute-applications'] });
      toast({
        title: "대체 수업 신청",
        description: "대체 수업 신청이 완료되었습니다.",
      });
    }
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'normal': return 'bg-blue-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'closed': return 'bg-gray-500';
      case 'completed': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const handleCreatePost = (formData: any) => {
    createPostMutation.mutate(formData);
  };

  const handleViewApplications = (post: any) => {
    setSelectedPost(post);
    setViewApplicationsDialog(true);
  };

  const handleApplyForSubstitute = (postId: string) => {
    applyMutation.mutate({
      postId,
      applicantId: 1, // 현재 사용자 ID
      message: "대체 수업을 진행하겠습니다."
    });
  };

  const renderPostCard = (post: any, showActions: boolean = true) => (
    <Card key={post.id} className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{post.title}</CardTitle>
            <CardDescription className="text-sm text-gray-600 mt-1">
              {post.trainer?.name || '훈련사'} 훈련사
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge className={`${getStatusColor(post.status)} text-white`}>
              {post.status === 'open' ? '모집중' : 
               post.status === 'in_progress' ? '진행중' : 
               post.status === 'closed' ? '마감' : '완료'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 mb-4">{post.content}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{new Date(post.substituteDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{post.substituteTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{post.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{post.trainingType}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-600">
            {post.paymentAmount?.toLocaleString()}원
          </span>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">반려동물 정보:</p>
          <p className="text-sm text-gray-600">{post.petInfo}</p>
        </div>

        {post.requirements && (
          <div className="flex items-start gap-2 mb-4 p-2 bg-yellow-50 rounded">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-yellow-700">{post.requirements}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            신청자: {post.applications?.length || 0}명
          </span>
          {showActions && (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleViewApplications(post)}
              >
                <Eye className="h-4 w-4 mr-1" />
                신청 현황
              </Button>
              <Button 
                size="sm"
                onClick={() => handleApplyForSubstitute(post.id)}
                disabled={post.status !== 'open'}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                신청하기
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const myPosts = Array.isArray(posts) ? posts.filter(post => post.trainerId === 1) : []; // 현재 사용자 ID로 필터링
  const availablePosts = Array.isArray(posts) ? posts.filter(post => post.status === 'open') : [];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">대체 훈련사 게시판</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            휴식이 필요한 수업을 다른 훈련사에게 맡기고, 대체 수업 기회를 찾아보세요
          </p>
        </div>
        <Dialog open={newPostDialog} onOpenChange={setNewPostDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              대체 수업 등록
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>대체 수업 등록</DialogTitle>
              <DialogDescription>
                휴식이 필요한 수업을 다른 훈련사에게 맡기실 수 있습니다.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">수업 제목</Label>
                  <Input id="title" placeholder="예: 기초 복종 훈련 - 성인반" />
                </div>
                <div>
                  <Label htmlFor="compensation">수업료</Label>
                  <Input id="compensation" type="number" placeholder="80000" />
                </div>
              </div>
              <div>
                <Label htmlFor="description">수업 설명</Label>
                <Textarea id="description" placeholder="수업 내용을 상세히 설명해주세요..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="classDate">수업 날짜</Label>
                  <Input id="classDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="classTime">수업 시간</Label>
                  <Input id="classTime" placeholder="14:00-15:30" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">수업 장소</Label>
                  <Input id="location" placeholder="강남구 테헤란로 123" />
                </div>
                <div>
                  <Label htmlFor="urgency">긴급도</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">낮음</SelectItem>
                      <SelectItem value="normal">보통</SelectItem>
                      <SelectItem value="high">높음</SelectItem>
                      <SelectItem value="urgent">긴급</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="requirements">특별 요구사항</Label>
                <Textarea id="requirements" placeholder="대형견 경험 필수, 특별한 주의사항 등..." />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setNewPostDialog(false)}>
                취소
              </Button>
              <Button onClick={handleCreatePost}>
                등록하기
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available">이용 가능한 수업</TabsTrigger>
          <TabsTrigger value="my-posts">내가 등록한 수업</TabsTrigger>
          <TabsTrigger value="applications">내 신청 현황</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-6">
          <div className="grid gap-4">
            {availablePosts.map(post => renderPostCard(post))}
            {availablePosts.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-gray-500">현재 이용 가능한 대체 수업이 없습니다.</p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="my-posts" className="mt-6">
          <div className="grid gap-4">
            {myPosts.map(post => renderPostCard(post, false))}
            {myPosts.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-gray-500">등록한 대체 수업이 없습니다.</p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="mt-6">
          <div className="grid gap-4">
            {applications.map(app => {
              const post = posts.find(p => p.id === app.postId);
              return (
                <Card key={app.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{post?.title}</h3>
                    <Badge className={`${app.status === 'pending' ? 'bg-yellow-500' : 
                                     app.status === 'accepted' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                      {app.status === 'pending' ? '대기중' : 
                       app.status === 'accepted' ? '승인됨' : '거절됨'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{app.message}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>신청일: {app.applicationDate}</span>
                    {app.proposedCompensation && (
                      <span>제안 수수료: {app.proposedCompensation.toLocaleString()}원</span>
                    )}
                  </div>
                </Card>
              );
            })}
            {applications.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-gray-500">신청한 대체 수업이 없습니다.</p>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* 신청 현황 보기 다이얼로그 */}
      <Dialog open={viewApplicationsDialog} onOpenChange={setViewApplicationsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>신청 현황</DialogTitle>
            <DialogDescription>
              {selectedPost?.title}에 대한 신청 현황입니다.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {applications.filter(app => app.postId === selectedPost?.id).map(app => (
              <Card key={app.id} className="mb-4 p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{app.applicantName}</h4>
                  <Badge className="bg-blue-500 text-white">
                    {app.status === 'pending' ? '검토중' : 
                     app.status === 'accepted' ? '승인됨' : '거절됨'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{app.message}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>신청일: {app.applicationDate}</span>
                  {app.proposedCompensation && (
                    <span>제안 수수료: {app.proposedCompensation.toLocaleString()}원</span>
                  )}
                </div>
                {app.status === 'pending' && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      승인
                    </Button>
                    <Button size="sm" variant="outline">
                      거절
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}