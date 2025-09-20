import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  FileText,
  Plus,
  Search,
  Calendar,
  Clock,
  Star,
  Send,
  Eye,
  Edit,
  Trash2,
  User,
  Heart,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Filter,
  Download,
  Upload,
  Camera,
  Brain,
  Sparkles,
  Activity,
  Bot
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { format, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Journal {
  id: number;
  title: string;
  content: string;
  trainer: {
    id: number;
    name: string;
    avatar?: string;
  };
  student: {
    id: number;
    name: string;
    email: string;
    pet: {
      id: number;
      name: string;
      breed: string;
      age: number;
    };
  };
  course: {
    id: number;
    title: string;
    session: number;
  };
  trainingDate: string;
  trainingDuration: number;
  progressRating: number;
  behaviorNotes: string;
  homeworkInstructions: string;
  nextGoals: string;
  attachments: string[];
  status: 'draft' | 'sent' | 'read' | 'replied';
  createdAt: string;
  updatedAt: string;
  readAt?: string;
  replyMessage?: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  pet: {
    id: number;
    name: string;
    breed: string;
    age: number;
  };
  course: {
    id: number;
    title: string;
    currentSession: number;
    totalSessions: number;
  };
  lastJournal?: string;
}

export default function TrainerNotebookPage() {
  const { userRole, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('journals');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const [isJournalDetailOpen, setIsJournalDetailOpen] = useState(false);
  const [isCreateJournalOpen, setIsCreateJournalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'activities' | 'media' | 'ai'>('basic');
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [notebookForm, setNotebookForm] = useState({
    title: '',
    content: '',
    studentId: '',
    petId: '',
    trainingDate: new Date().toISOString().split('T')[0],
    trainingDuration: 60,
    progressRating: 3,
    behaviorNotes: '',
    homeworkInstructions: '',
    nextGoals: '',
    activities: {
      bathroom: { times: [], notes: '' },
      walk: { times: [], duration: 0, notes: '' },
      play: { times: [], activities: [], notes: '' },
      meal: { times: [], amount: '', notes: '' }
    }
  });

  const queryClient = useQueryClient();

  // 알림장 생성 mutation
  const createNotebookMutation = useMutation({
    mutationFn: async (notebookData: any) => {
      const response = await fetch('/api/notebook/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notebookData)
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "알림장 전송 완료",
        description: "견주에게 알림장이 성공적으로 전송되었습니다."
      });
      setIsCreateJournalOpen(false);
      setNotebookForm({
        title: '',
        content: '',
        studentId: '',
        petId: '',
        trainingDate: new Date().toISOString().split('T')[0],
        trainingDuration: 60,
        progressRating: 3,
        behaviorNotes: '',
        homeworkInstructions: '',
        nextGoals: '',
        activities: {
          bathroom: { times: [], notes: '' },
          walk: { times: [], duration: 0, notes: '' },
          play: { times: [], activities: [], notes: '' },
          meal: { times: [], amount: '', notes: '' }
        }
      });
      queryClient.invalidateQueries({ queryKey: ['/api/trainer/journals'] });
    },
    onError: (error) => {
      toast({
        title: "전송 실패",
        description: "알림장 전송 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  });

  // AI 분석을 통한 알림장 자동 생성
  const handleAIGenerate = async () => {
    if (!notebookForm.studentId) {
      toast({
        title: "먼저 수강생을 선택해주세요",
        variant: "destructive"
      });
      setActiveTab('basic');
      return;
    }

    const selectedStudentData = students?.find(s => s.id.toString() === notebookForm.studentId);
    if (!selectedStudentData) {
      toast({
        title: "수강생 정보를 찾을 수 없습니다",
        variant: "destructive"
      });
      return;
    }

    setIsAIGenerating(true);
    
    try {
      // 현재 입력된 모든 데이터 수집
      const analysisData = {
        // 기본 정보
        student: {
          name: selectedStudentData.name,
          pet: {
            name: selectedStudentData.pet.name,
            breed: selectedStudentData.pet.breed,
            age: selectedStudentData.pet.age
          }
        },
        course: {
          title: selectedStudentData.course.title,
          currentSession: selectedStudentData.course.currentSession,
          totalSessions: selectedStudentData.course.totalSessions
        },
        trainingDate: notebookForm.trainingDate,
        trainingDuration: notebookForm.trainingDuration,
        progressRating: notebookForm.progressRating,
        
        // 이미 입력된 내용이 있다면 포함
        existingContent: {
          title: notebookForm.title,
          content: notebookForm.content,
          behaviorNotes: notebookForm.behaviorNotes,
          homeworkInstructions: notebookForm.homeworkInstructions,
          nextGoals: notebookForm.nextGoals
        },
        
        // 활동 데이터
        activities: notebookForm.activities
      };

      console.log('🤖 AI 분석 요청 데이터:', analysisData);

      const response = await fetch('/api/ai/analyze-notebook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate_notebook',
          data: analysisData
        })
      });

      if (!response.ok) {
        throw new Error('AI 분석 요청 실패');
      }

      const result = await response.json();
      console.log('🤖 AI 분석 결과:', result);

      if (result.success && result.generatedContent) {
        const content = result.generatedContent;
        
        // AI가 생성한 내용을 폼에 자동 입력
        setNotebookForm(prev => ({
          ...prev,
          title: content.title || prev.title || `${selectedStudentData.pet.name} 훈련 일지 - ${selectedStudentData.course.currentSession}회차`,
          content: content.trainingContent || prev.content,
          behaviorNotes: content.behaviorNotes || prev.behaviorNotes,
          homeworkInstructions: content.homeworkInstructions || prev.homeworkInstructions,
          nextGoals: content.nextGoals || prev.nextGoals
        }));

        // 기본 탭으로 이동하여 생성된 내용 확인
        setActiveTab('basic');
        
        toast({
          title: "AI 분석 완료!",
          description: "알림장 내용이 자동으로 생성되었습니다. 내용을 확인하고 필요시 수정해주세요.",
        });
      } else {
        throw new Error(result.error || 'AI 분석 결과를 받을 수 없습니다');
      }
    } catch (error) {
      console.error('🤖 AI 분석 오류:', error);
      toast({
        title: "AI 분석 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsAIGenerating(false);
    }
  };

  // 알림장 제출 핸들러 (카카오톡 전송 포함)
  const handleSubmitNotebook = async () => {
    if (!notebookForm.title.trim()) {
      toast({
        title: "제목을 입력해주세요",
        variant: "destructive"
      });
      return;
    }
    
    if (!notebookForm.content.trim()) {
      toast({
        title: "내용을 입력해주세요",
        variant: "destructive"
      });
      return;
    }
    
    if (!notebookForm.studentId) {
      toast({
        title: "수강생을 선택해주세요",
        variant: "destructive"
      });
      return;
    }

    const selectedStudentData = students?.find(s => s.id.toString() === notebookForm.studentId);
    if (!selectedStudentData) {
      toast({
        title: "수강생 정보를 찾을 수 없습니다",
        variant: "destructive"
      });
      return;
    }

    try {
      // 1. 알림장 저장
      await createNotebookMutation.mutateAsync(notebookForm);

      // 2. 카카오톡 메시지 전송
      console.log('📱 카카오톡 메시지 전송 시작...');
      
      const messageResponse = await apiRequest('/api/kakao/send-notebook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: notebookForm.studentId,
          notebookData: {
            title: notebookForm.title,
            content: notebookForm.content,
            studentName: selectedStudentData.name,
            petName: selectedStudentData.pet.name,
            trainingDate: notebookForm.trainingDate,
            progressRating: notebookForm.progressRating,
            trainerName: "김민수" // TODO: req.session.user.name 사용하도록 서버에서 처리
          }
        })
      });

      const result = await messageResponse.json();
      
      if (messageResponse.ok && result.success) {
        toast({
          title: "알림장 전송 완료! 📱",
          description: `${selectedStudentData.name}님에게 카카오톡 알림장이 전송되었습니다.`,
        });
      } else if (messageResponse.status === 503 && result.configurationRequired) {
        toast({
          title: "알림장 저장 완료",
          description: "카카오톡 서비스가 설정되지 않았습니다. 알림장은 정상적으로 저장되었습니다.",
          variant: "default"
        });
      } else if (result.needsPhoneNumber) {
        toast({
          title: "알림장 저장 완료",
          description: "수강생의 전화번호가 등록되지 않아 카카오톡을 전송할 수 없습니다. 알림장은 정상적으로 저장되었습니다.",
          variant: "default"
        });
      } else {
        toast({
          title: "알림장 저장 완료",
          description: result.error || "카카오톡 전송에 실패했지만 알림장은 정상적으로 저장되었습니다.",
          variant: "default"
        });
      }

      // 3. 다이얼로그 닫기
      setIsCreateJournalOpen(false);
      
      // 4. 폼 초기화
      setNotebookForm({
        title: '',
        content: '',
        studentId: '',
        petId: '',
        trainingDate: new Date().toISOString().split('T')[0],
        trainingDuration: 60,
        progressRating: 3,
        behaviorNotes: '',
        homeworkInstructions: '',
        nextGoals: '',
        activities: {
          bathroom: { times: [], notes: '' },
          walk: { times: [], durations: [], notes: '' },
          play: { times: [], activities: [], notes: '' }
        }
      });

    } catch (error) {
      console.error('알림장 전송 오류:', error);
      toast({
        title: "전송 실패",
        description: "알림장 전송 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    }
  };

  // 알림장 목록 조회
  const { data: journals, isLoading: journalsLoading } = useQuery({
    queryKey: ['/api/trainer/journals'],
    queryFn: async () => {
      return [
        {
          id: 1,
          title: "멍멍이 훈련 일지 - 1주차",
          content: "오늘은 기본 자세 훈련을 진행했습니다. 멍멍이는 앉기 명령에 대한 반응이 매우 좋았고, 기다리기 명령도 5초 정도 유지할 수 있었습니다. 처음 수업치고는 집중력이 뛰어났습니다.",
          trainer: { id: 1, name: "김민수", avatar: "/avatars/trainer1.jpg" },
          student: {
            id: 1,
            name: "홍길동",
            email: "hong@example.com",
            pet: { id: 1, name: "멍멍이", breed: "골든 리트리버", age: 2 }
          },
          course: { id: 1, title: "기초 복종 훈련", session: 1 },
          trainingDate: "2025-01-21",
          trainingDuration: 60,
          progressRating: 4,
          behaviorNotes: "적극적이고 집중력이 좋음. 다른 개들과의 사회성도 우수함.",
          homeworkInstructions: "매일 5분씩 앉기 연습을 해주세요. 간식을 활용하여 긍정적인 경험을 만들어주시기 바랍니다.",
          nextGoals: "기다리기 시간을 10초까지 연장하고, 이리와 명령 추가 예정",
          attachments: ["/attachments/progress-photo1.jpg"],
          status: 'sent',
          createdAt: "2025-01-21T16:00:00Z",
          updatedAt: "2025-01-21T16:00:00Z",
          readAt: "2025-01-21T18:30:00Z"
        },
        {
          id: 2,
          title: "바둑이 훈련 일지 - 3주차",
          content: "오늘은 어질리티 기초 과정 3주차 수업을 진행했습니다. 바둑이는 낮은 점프대 통과에 성공했고, 터널 통과도 망설임 없이 해냈습니다. 운동 능력이 뛰어나 진도가 빠르게 나가고 있습니다.",
          trainer: { id: 1, name: "김민수" },
          student: {
            id: 2,
            name: "김영희",
            email: "kim@example.com",
            pet: { id: 2, name: "바둑이", breed: "보더 콜리", age: 3 }
          },
          course: { id: 2, title: "어질리티 기초", session: 3 },
          trainingDate: "2025-01-20",
          trainingDuration: 90,
          progressRating: 5,
          behaviorNotes: "에너지가 넘치고 학습 능력이 뛰어남. 새로운 도전을 즐기는 성격",
          homeworkInstructions: "집에서 낮은 장애물을 설치하여 점프 연습을 해주세요. 안전에 주의하시기 바랍니다.",
          nextGoals: "더 높은 점프대와 복잡한 코스 도전 예정",
          attachments: [],
          status: 'read',
          createdAt: "2025-01-20T18:30:00Z",
          updatedAt: "2025-01-20T18:30:00Z",
          readAt: "2025-01-20T20:15:00Z",
          replyMessage: "감사합니다! 집에서도 열심히 연습하고 있어요."
        },
        {
          id: 3,
          title: "초코 행동 교정 상담 - 초회",
          content: "오늘은 초코의 짖기 문제에 대한 초회 상담을 진행했습니다. 방문자나 다른 개를 보면 과도하게 짖는 행동을 보이고 있습니다. 원인 분석 결과 불안감과 영역 보호 본능이 주요 원인으로 보입니다.",
          trainer: { id: 1, name: "김민수" },
          student: {
            id: 3,
            name: "박철수",
            email: "park@example.com",
            pet: { id: 3, name: "초코", breed: "시바견", age: 4 }
          },
          course: { id: 3, title: "문제행동 교정", session: 1 },
          trainingDate: "2025-01-19",
          trainingDuration: 120,
          progressRating: 3,
          behaviorNotes: "경계심이 강하고 새로운 환경에 민감함. 시간이 걸리더라도 인내심을 가지고 접근 필요",
          homeworkInstructions: "하루 2회, 10분씩 조용한 환경에서 이름 부르기 연습을 해주세요. 짖을 때는 무시하고, 조용할 때 칭찬과 간식을 주세요.",
          nextGoals: "기본 신뢰 관계 구축 후 점진적 둔감화 훈련 시작",
          attachments: ["/attachments/behavior-analysis1.pdf"],
          status: 'draft',
          createdAt: "2025-01-19T15:00:00Z",
          updatedAt: "2025-01-21T10:00:00Z"
        }
      ] as Journal[];
    },
    enabled: isAuthenticated
  });

  // 학생 목록 조회
  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ['/api/trainer/students-for-journal'],
    queryFn: async () => {
      return [
        {
          id: 1,
          name: "홍길동",
          email: "hong@example.com",
          pet: { id: 1, name: "멍멍이", breed: "골든 리트리버", age: 2 },
          course: { id: 1, title: "기초 복종 훈련", currentSession: 2, totalSessions: 8 },
          lastJournal: "2025-01-21"
        },
        {
          id: 2,
          name: "김영희",
          email: "kim@example.com",
          pet: { id: 2, name: "바둑이", breed: "보더 콜리", age: 3 },
          course: { id: 2, title: "어질리티 기초", currentSession: 4, totalSessions: 6 },
          lastJournal: "2025-01-20"
        },
        {
          id: 3,
          name: "박철수",
          email: "park@example.com",
          pet: { id: 3, name: "초코", breed: "시바견", age: 4 },
          course: { id: 3, title: "문제행동 교정", currentSession: 1, totalSessions: 12 },
          lastJournal: null
        }
      ] as Student[];
    },
    enabled: isAuthenticated
  });

  // 알림장 작성/수정
  const saveJournalMutation = useMutation({
    mutationFn: async (journalData: any) => {
      console.log('알림장 저장:', journalData);
      return { success: true, id: Math.random() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trainer/journals'] });
      setIsCreateJournalOpen(false);
      toast({
        title: "알림장 저장 완료",
        description: "알림장이 성공적으로 저장되었습니다."
      });
    }
  });

  // 알림장 전송
  const sendJournalMutation = useMutation({
    mutationFn: async (journalId: number) => {
      console.log('알림장 전송:', journalId);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trainer/journals'] });
      toast({
        title: "알림장 전송 완료",
        description: "학부모에게 알림장이 전송되었습니다."
      });
    }
  });

  // 알림장 삭제
  const deleteJournalMutation = useMutation({
    mutationFn: async (journalId: number) => {
      console.log('알림장 삭제:', journalId);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trainer/journals'] });
      toast({
        title: "알림장 삭제 완료",
        description: "알림장이 성공적으로 삭제되었습니다."
      });
    }
  });

  const getStatusBadge = (status: Journal['status']) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">임시저장</Badge>;
      case 'sent':
        return <Badge variant="default">전송됨</Badge>;
      case 'read':
        return <Badge variant="success">읽음</Badge>;
      case 'replied':
        return <Badge variant="info">답장받음</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredJournals = journals?.filter(journal => {
    const matchesSearch = journal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         journal.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         journal.student.pet.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || journal.status === statusFilter;
    const matchesDate = dateFilter === 'all' || 
                       (dateFilter === 'today' && journal.trainingDate === '2025-01-22') ||
                       (dateFilter === 'week' && new Date(journal.trainingDate) >= new Date('2025-01-16'));
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleJournalClick = (journal: Journal) => {
    setSelectedJournal(journal);
    setIsJournalDetailOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">알림장 관리</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {userRole === 'institute-admin' 
              ? '소속 훈련사들의 알림장 현황을 확인하고 관리하세요'
              : '수강생 훈련 일지를 작성하고 학부모와 소통하세요'}
          </p>
        </div>
        {userRole !== 'institute-admin' && (
          <Dialog open={isCreateJournalOpen} onOpenChange={setIsCreateJournalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                새 알림장 작성
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
              <DialogHeader className="pb-4 border-b">
                <DialogTitle className="text-xl font-bold text-gray-900">새 알림장 작성</DialogTitle>
                <p className="text-sm text-gray-500 mt-1">반려견의 하루 활동을 상세히 기록하고 학부모와 공유하세요</p>
              </DialogHeader>

              {/* Enhanced Tab Navigation System */}
              <div className="sticky top-0 bg-white z-10 pt-4 pb-2 border-b">
                <div className="flex space-x-1 bg-gray-50 p-1 rounded-lg">
                  <button 
                    onClick={() => {
                      console.log('Tab clicked: basic');
                      setActiveTab('basic');
                    }}
                    className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                      activeTab === 'basic' 
                        ? 'bg-white shadow-sm text-blue-700 border border-blue-200' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>기본 정보</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => {
                      console.log('Tab clicked: activities');
                      setActiveTab('activities');
                    }}
                    className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                      activeTab === 'activities' 
                        ? 'bg-white shadow-sm text-blue-700 border border-blue-200' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Activity className="h-4 w-4" />
                      <span>활동 기록</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => {
                      console.log('Tab clicked: media');
                      setActiveTab('media');
                    }}
                    className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                      activeTab === 'media' 
                        ? 'bg-white shadow-sm text-blue-700 border border-blue-200' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Camera className="h-4 w-4" />
                      <span>미디어</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => {
                      console.log('Tab clicked: ai');
                      setActiveTab('ai');
                    }}
                    className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                      activeTab === 'ai' 
                        ? 'bg-white shadow-sm text-blue-700 border border-blue-200' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Bot className="h-4 w-4" />
                      <span>AI 도우미</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="space-y-4">
                {/* Basic Information Tab */}
                {activeTab === 'basic' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="student">수강생 선택</Label>
                        <Select value={notebookForm.studentId} onValueChange={(value) => {
                          setNotebookForm(prev => ({ ...prev, studentId: value }));
                          const student = students?.find(s => s.id.toString() === value);
                          if (student) {
                            setNotebookForm(prev => ({ ...prev, petId: student.pet.id.toString() }));
                          }
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="수강생을 선택하세요" />
                          </SelectTrigger>
                          <SelectContent>
                            {students?.map((student: Student) => (
                              <SelectItem key={student.id} value={student.id.toString()}>
                                {student.name} - {student.pet.name} ({student.course.title})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="date">훈련 날짜</Label>
                        <Input 
                          id="date" 
                          type="date" 
                          value={notebookForm.trainingDate}
                          onChange={(e) => setNotebookForm(prev => ({ ...prev, trainingDate: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="duration">훈련 시간 (분)</Label>
                        <Input 
                          id="duration" 
                          type="number" 
                          value={notebookForm.trainingDuration}
                          onChange={(e) => setNotebookForm(prev => ({ ...prev, trainingDuration: Number(e.target.value) }))}
                          placeholder="60" 
                        />
                      </div>
                      <div>
                        <Label htmlFor="rating">진도 평가 (1-5점)</Label>
                        <Select value={notebookForm.progressRating.toString()} onValueChange={(value) => setNotebookForm(prev => ({ ...prev, progressRating: Number(value) }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="평점 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5점 - 매우 우수</SelectItem>
                            <SelectItem value="4">4점 - 우수</SelectItem>
                            <SelectItem value="3">3점 - 보통</SelectItem>
                            <SelectItem value="2">2점 - 미흡</SelectItem>
                            <SelectItem value="1">1점 - 매우 미흡</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="title">제목</Label>
                      <Input 
                        id="title" 
                        value={notebookForm.title}
                        onChange={(e) => setNotebookForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="알림장 제목을 입력하세요"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="content">훈련 내용</Label>
                      <Textarea 
                        id="content" 
                        value={notebookForm.content}
                        onChange={(e) => setNotebookForm(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="오늘 진행한 훈련 내용을 상세히 작성해주세요..."
                        rows={4}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="behaviorNotes">행동 관찰 노트</Label>
                      <Textarea 
                        id="behaviorNotes" 
                        value={notebookForm.behaviorNotes}
                        onChange={(e) => setNotebookForm(prev => ({ ...prev, behaviorNotes: e.target.value }))}
                        placeholder="반려동물의 행동이나 특이사항을 기록하세요..."
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="homeworkInstructions">숙제 안내</Label>
                      <Textarea 
                        id="homeworkInstructions" 
                        value={notebookForm.homeworkInstructions}
                        onChange={(e) => setNotebookForm(prev => ({ ...prev, homeworkInstructions: e.target.value }))}
                        placeholder="견주가 집에서 해야 할 연습이나 주의사항을 적어주세요..."
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="nextGoals">다음 목표</Label>
                      <Textarea 
                        id="nextGoals" 
                        value={notebookForm.nextGoals}
                        onChange={(e) => setNotebookForm(prev => ({ ...prev, nextGoals: e.target.value }))}
                        placeholder="다음 세션의 목표나 계획을 적어주세요..."
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {/* Activities Tab */}
                {activeTab === 'activities' && (
                  <div className="space-y-4">
                    {/* Time-based Activity Tracking */}
                    <div className="space-y-6">
                      {/* 배변 활동 */}
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-3 flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                          배변 활동
                        </h3>
                        <div className="grid grid-cols-6 gap-2 text-xs">
                          <div className="font-medium">시간</div>
                          <div className="text-center">
                            <input type="time" className="w-16 px-1 py-0.5 border rounded text-xs" defaultValue="06:00" />
                          </div>
                          <div className="text-center">
                            <input type="time" className="w-16 px-1 py-0.5 border rounded text-xs" defaultValue="10:00" />
                          </div>
                          <div className="text-center">
                            <input type="time" className="w-16 px-1 py-0.5 border rounded text-xs" defaultValue="14:00" />
                          </div>
                          <div className="text-center">
                            <input type="time" className="w-16 px-1 py-0.5 border rounded text-xs" defaultValue="18:00" />
                          </div>
                          <div className="text-center">
                            <input type="time" className="w-16 px-1 py-0.5 border rounded text-xs" defaultValue="22:00" />
                          </div>
                          
                          <div className="text-sm">정상 배변</div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          
                          <div className="text-sm">실수 발생</div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                        </div>
                      </div>

                      {/* 산책 활동 */}
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-3 flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          산책 활동
                        </h3>
                        <div className="grid grid-cols-6 gap-2 text-xs">
                          <div className="font-medium">시간</div>
                          <div className="text-center">
                            <input type="time" className="w-16 px-1 py-0.5 border rounded text-xs" defaultValue="07:00" />
                          </div>
                          <div className="text-center">
                            <input type="time" className="w-16 px-1 py-0.5 border rounded text-xs" defaultValue="12:00" />
                          </div>
                          <div className="text-center">
                            <input type="time" className="w-16 px-1 py-0.5 border rounded text-xs" defaultValue="16:00" />
                          </div>
                          <div className="text-center">
                            <input type="time" className="w-16 px-1 py-0.5 border rounded text-xs" defaultValue="19:00" />
                          </div>
                          <div className="text-center">
                            <input type="time" className="w-16 px-1 py-0.5 border rounded text-xs" defaultValue="21:00" />
                          </div>
                          
                          <div className="text-sm">실시함</div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          
                          <div className="text-sm">시간(분)</div>
                          <div className="text-center"><input type="number" className="w-12 px-1 py-0.5 border rounded text-xs" placeholder="30" /></div>
                          <div className="text-center"><input type="number" className="w-12 px-1 py-0.5 border rounded text-xs" placeholder="30" /></div>
                          <div className="text-center"><input type="number" className="w-12 px-1 py-0.5 border rounded text-xs" placeholder="30" /></div>
                          <div className="text-center"><input type="number" className="w-12 px-1 py-0.5 border rounded text-xs" placeholder="30" /></div>
                          <div className="text-center"><input type="number" className="w-12 px-1 py-0.5 border rounded text-xs" placeholder="30" /></div>
                        </div>
                      </div>

                      {/* 놀이 활동 */}
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-3 flex items-center">
                          <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                          놀이 활동
                        </h3>
                        <div className="grid grid-cols-6 gap-2 text-xs">
                          <div className="font-medium">시간</div>
                          <div className="text-center">
                            <input type="time" className="w-16 px-1 py-0.5 border rounded text-xs" defaultValue="08:00" />
                          </div>
                          <div className="text-center">
                            <input type="time" className="w-16 px-1 py-0.5 border rounded text-xs" defaultValue="11:00" />
                          </div>
                          <div className="text-center">
                            <input type="time" className="w-16 px-1 py-0.5 border rounded text-xs" defaultValue="15:00" />
                          </div>
                          <div className="text-center">
                            <input type="time" className="w-16 px-1 py-0.5 border rounded text-xs" defaultValue="17:00" />
                          </div>
                          <div className="text-center">
                            <input type="time" className="w-16 px-1 py-0.5 border rounded text-xs" defaultValue="20:00" />
                          </div>
                          
                          <div className="text-sm">공 던지기</div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          
                          <div className="text-sm">줄다리기</div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          
                          <div className="text-sm">퍼즐 놀이</div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                        </div>
                      </div>

                      {/* 식사 활동 */}
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-3 flex items-center">
                          <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                          식사 활동
                        </h3>
                        <div className="grid grid-cols-6 gap-2 text-xs">
                          <div className="font-medium">시간</div>
                          <div className="text-center">
                            <input type="time" className="w-16 px-1 py-0.5 border rounded text-xs" defaultValue="06:00" />
                          </div>
                          <div className="text-center">
                            <input type="time" className="w-16 px-1 py-0.5 border rounded text-xs" defaultValue="10:00" />
                          </div>
                          <div className="text-center">
                            <input type="time" className="w-16 px-1 py-0.5 border rounded text-xs" defaultValue="14:00" />
                          </div>
                          <div className="text-center">
                            <input type="time" className="w-16 px-1 py-0.5 border rounded text-xs" defaultValue="18:00" />
                          </div>
                          <div className="text-center">
                            <input type="time" className="w-16 px-1 py-0.5 border rounded text-xs" defaultValue="22:00" />
                          </div>
                          
                          <div className="text-sm">정상 식사</div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          
                          <div className="text-sm">간식</div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          <div className="text-center"><input type="checkbox" className="rounded" /></div>
                          
                          <div className="text-sm">식사량(%)</div>
                          <div className="text-center"><input type="number" className="w-12 px-1 py-0.5 border rounded text-xs" placeholder="100" /></div>
                          <div className="text-center"><input type="number" className="w-12 px-1 py-0.5 border rounded text-xs" placeholder="100" /></div>
                          <div className="text-center"><input type="number" className="w-12 px-1 py-0.5 border rounded text-xs" placeholder="100" /></div>
                          <div className="text-center"><input type="number" className="w-12 px-1 py-0.5 border rounded text-xs" placeholder="100" /></div>
                          <div className="text-center"><input type="number" className="w-12 px-1 py-0.5 border rounded text-xs" placeholder="100" /></div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="behavior">행동 특이사항</Label>
                      <Textarea 
                        id="behavior" 
                        placeholder="반려견의 행동이나 성격적 특징을 기록해주세요..."
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="homework">숙제 및 집에서 할 일</Label>
                      <Textarea 
                        id="homework" 
                        placeholder="집에서 연습해야 할 내용이나 주의사항을 작성해주세요..."
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="goals">다음 훈련 목표</Label>
                      <Textarea 
                        id="goals" 
                        placeholder="다음 수업에서 목표로 하는 내용을 작성해주세요..."
                        rows={2}
                      />
                    </div>
                  </div>
                )}

                {/* Media Tab */}
                {activeTab === 'media' && (
                  <div className="space-y-4">
                    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                      <Camera className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">미디어 업로드 기능</p>
                      <p className="text-xs text-gray-500">사진이나 동영상을 첨부할 수 있습니다</p>
                    </div>
                  </div>
                )}

                {/* AI Helper Tab */}
                {activeTab === 'ai' && (
                  <div className="space-y-4">
                    <div className="p-4 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                      <div className="flex items-center mb-2">
                        <Brain className="h-5 w-5 text-blue-600 mr-2" />
                        <h3 className="font-medium text-blue-900 dark:text-blue-100">AI 알림장 도우미</h3>
                      </div>
                      <p className="text-sm text-blue-700 dark:text-blue-200 mb-4">
                        AI가 입력된 정보를 바탕으로 알림장 내용을 자동으로 생성해드립니다.
                        수강생 정보, 기본 정보, 활동 기록 등을 종합하여 전문적인 알림장을 작성합니다.
                      </p>
                      
                      {/* 현재 입력된 정보 요약 */}
                      <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                        <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">입력된 정보:</h4>
                        <div className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                          <div>• 수강생: {notebookForm.studentId ? students?.find(s => s.id.toString() === notebookForm.studentId)?.name || '선택됨' : '미선택'}</div>
                          <div>• 훈련일: {notebookForm.trainingDate}</div>
                          <div>• 훈련시간: {notebookForm.trainingDuration}분</div>
                          <div>• 진도평가: {notebookForm.progressRating}/5점</div>
                          {notebookForm.content && <div>• 기존 훈련 내용: 입력됨</div>}
                          {notebookForm.behaviorNotes && <div>• 행동 관찰: 입력됨</div>}
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={handleAIGenerate}
                        disabled={isAIGenerating || !notebookForm.studentId}
                      >
                        {isAIGenerating ? (
                          <>
                            <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                            AI가 분석 중입니다...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            AI로 내용 생성하기
                          </>
                        )}
                      </Button>
                      
                      {!notebookForm.studentId && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 text-center">
                          * 먼저 기본 정보 탭에서 수강생을 선택해주세요
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter className="border-t pt-4 mt-6">
                <div className="flex justify-between items-center w-full">
                  <div className="text-sm text-gray-500">
                    모든 탭의 정보를 확인하고 저장하세요
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateJournalOpen(false)} className="px-4">
                      취소
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="px-4"
                      onClick={() => {
                        console.log('임시저장 완료');
                        // saveJournalMutation.mutate({ status: 'draft' })
                      }}
                    >
                      임시저장
                    </Button>
                    <Button 
                      className="px-4 bg-blue-600 hover:bg-blue-700"
                      onClick={handleSubmitNotebook}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      작성 완료 및 전송
                    </Button>
                  </div>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="journals">알림장 목록</TabsTrigger>
          <TabsTrigger value="students">수강생 현황</TabsTrigger>
          <TabsTrigger value="templates">템플릿 관리</TabsTrigger>
        </TabsList>

        {/* 알림장 목록 */}
        <TabsContent value="journals" className="space-y-4">
          {/* 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">총 알림장</p>
                    <p className="text-2xl font-bold">{journals?.length || 0}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">전송됨</p>
                    <p className="text-2xl font-bold text-green-600">
                      {journals?.filter(j => j.status === 'sent' || j.status === 'read').length || 0}
                    </p>
                  </div>
                  <Send className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">임시저장</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {journals?.filter(j => j.status === 'draft').length || 0}
                    </p>
                  </div>
                  <Edit className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">답장받음</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {journals?.filter(j => j.status === 'replied').length || 0}
                    </p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 검색 및 필터 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="제목, 학생명, 반려동물명으로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="상태 필터" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="draft">임시저장</SelectItem>
                    <SelectItem value="sent">전송됨</SelectItem>
                    <SelectItem value="read">읽음</SelectItem>
                    <SelectItem value="replied">답장받음</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="날짜 필터" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="today">오늘</SelectItem>
                    <SelectItem value="week">이번 주</SelectItem>
                    <SelectItem value="month">이번 달</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 알림장 목록 */}
          <div className="grid gap-4">
            {journalsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredJournals && filteredJournals.length > 0 ? (
              filteredJournals.map((journal: Journal) => (
                <Card 
                  key={journal.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleJournalClick(journal)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-5 w-5 text-green-600" />
                          <h3 className="text-lg font-semibold">{journal.title}</h3>
                          {getStatusBadge(journal.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{journal.student.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>{journal.student.pet.name} ({journal.student.pet.breed})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{journal.trainingDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{journal.trainingDuration}분</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                          {journal.content}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">진도 평가:</span>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < journal.progressRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {journal.readAt && (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span>읽음: {new Date(journal.readAt).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>

                        {journal.replyMessage && (
                          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm">
                              <MessageSquare className="h-4 w-4 inline mr-1" />
                              <strong>학부모 답장:</strong> {journal.replyMessage}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          상세보기
                        </Button>
                        {journal.status === 'draft' && (
                          <>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              편집
                            </Button>
                            <Button 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                sendJournalMutation.mutate(journal.id);
                              }}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              전송
                            </Button>
                          </>
                        )}
                        {journal.status === 'draft' && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('정말로 삭제하시겠습니까?')) {
                                deleteJournalMutation.mutate(journal.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            삭제
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' ? 
                      '검색 조건에 맞는 알림장이 없습니다' : 
                      '작성된 알림장이 없습니다'
                    }
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' ? 
                      '다른 검색어나 필터를 시도해보세요' : 
                      '첫 번째 알림장을 작성해보세요'
                    }
                  </p>
                  {!searchTerm && statusFilter === 'all' && dateFilter === 'all' && userRole !== 'institute-admin' && (
                    <Button onClick={() => setIsCreateJournalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      새 알림장 작성
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* 수강생 현황 */}
        <TabsContent value="students" className="space-y-4">
          <div className="grid gap-4">
            {studentsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              students?.map((student: Student) => (
                <Card key={student.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-5 w-5 text-blue-600" />
                          <h3 className="text-lg font-semibold">{student.name}</h3>
                          {student.lastJournal ? (
                            <Badge variant="success">최근 작성: {student.lastJournal}</Badge>
                          ) : (
                            <Badge variant="warning">알림장 미작성</Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">반려동물:</span>
                            <span className="font-medium ml-1">{student.pet.name} ({student.pet.breed})</span>
                          </div>
                          <div>
                            <span className="text-gray-500">과정:</span>
                            <span className="font-medium ml-1">{student.course.title}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">진도:</span>
                            <span className="font-medium ml-1">
                              {student.course.currentSession}/{student.course.totalSessions}회
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        size="sm"
                        onClick={() => {
                          setSelectedStudent(student.id);
                          setIsCreateJournalOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        알림장 작성
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* 템플릿 관리 */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>알림장 템플릿</CardTitle>
              <CardDescription>자주 사용하는 형식을 템플릿으로 저장하여 효율적으로 작성하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                템플릿 관리 기능 (향후 구현)
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 알림장 상세 모달 */}
      <Dialog open={isJournalDetailOpen} onOpenChange={setIsJournalDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedJournal && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-green-600" />
                  {selectedJournal.title}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  {getStatusBadge(selectedJournal.status)}
                  <span className="text-sm text-gray-500">
                    작성: {new Date(selectedJournal.createdAt).toLocaleDateString()}
                  </span>
                  {selectedJournal.readAt && (
                    <span className="text-sm text-green-600">
                      읽음: {new Date(selectedJournal.readAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* 기본 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">수강생 정보</h4>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">이름:</span> {selectedJournal.student.name}</div>
                      <div><span className="font-medium">이메일:</span> {selectedJournal.student.email}</div>
                      <div><span className="font-medium">반려동물:</span> {selectedJournal.student.pet.name} ({selectedJournal.student.pet.breed})</div>
                      <div><span className="font-medium">나이:</span> {selectedJournal.student.pet.age}살</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">훈련 정보</h4>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">과정:</span> {selectedJournal.course.title}</div>
                      <div><span className="font-medium">회차:</span> {selectedJournal.course.session}회차</div>
                      <div><span className="font-medium">날짜:</span> {selectedJournal.trainingDate}</div>
                      <div><span className="font-medium">시간:</span> {selectedJournal.trainingDuration}분</div>
                    </div>
                  </div>
                </div>

                {/* 훈련 내용 */}
                <div>
                  <h4 className="font-semibold mb-2">훈련 내용</h4>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg whitespace-pre-wrap">
                    {selectedJournal.content}
                  </div>
                </div>

                {/* 평가 및 특이사항 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">진도 평가</h4>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < selectedJournal.progressRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="font-medium">({selectedJournal.progressRating}/5)</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">행동 특이사항</h4>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                      {selectedJournal.behaviorNotes}
                    </div>
                  </div>
                </div>

                {/* 숙제 및 목표 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">숙제 및 집에서 할 일</h4>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                      {selectedJournal.homeworkInstructions}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">다음 훈련 목표</h4>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded text-sm">
                      {selectedJournal.nextGoals}
                    </div>
                  </div>
                </div>

                {/* 답장 */}
                {selectedJournal.replyMessage && (
                  <div>
                    <h4 className="font-semibold mb-2">학부모 답장</h4>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-sm">{selectedJournal.replyMessage}</p>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsJournalDetailOpen(false)}>
                  닫기
                </Button>
                {selectedJournal.status === 'draft' && (
                  <>
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      편집
                    </Button>
                    <Button onClick={() => sendJournalMutation.mutate(selectedJournal.id)}>
                      <Send className="h-4 w-4 mr-2" />
                      전송
                    </Button>
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}