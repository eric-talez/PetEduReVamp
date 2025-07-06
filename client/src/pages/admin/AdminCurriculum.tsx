import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  Plus, 
  Video, 
  Edit, 
  Trash2, 
  Upload, 
  Play,
  Clock,
  Users,
  BookOpen,
  Star,
  CheckCircle,
  FileText,
  Save,
  Eye,
  XCircle,
  AlertCircle,
  Package,
  Settings
} from 'lucide-react';

interface CurriculumData {
  id: string;
  title: string;
  description: string;
  trainerId: string;
  trainerName: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  price: number;
  modules: ModuleData[];
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

interface ModuleData {
  id: string;
  title: string;
  description: string;
  order: number;
  duration: number;
  objectives: string[];
  content: string;
  videos: VideoData[];
  isRequired: boolean;
}

interface VideoData {
  id: string;
  title: string;
  description: string;
  duration: number;
  videoUrl?: string;
  thumbnailUrl?: string;
  status: 'pending' | 'processing' | 'ready' | 'failed';
  uploadedAt: Date;
}

// 영상강의 관련 인터페이스
interface VideoLecture {
  id: string;
  title: string;
  instructor: string;
  description: string;
  totalDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  studentCount: number;
  modules: LectureModule[];
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

interface LectureModule {
  id: string;
  title: string;
  description: string;
  duration: number;
  objectives: string[];
  materials: string[];
  format: 'theory' | 'practice' | 'theory_practice';
  isFree: boolean;
  order: number;
}

export default function AdminCurriculum() {
  const { userRole } = useAuth();
  const [curriculums, setCurriculums] = useState<CurriculumData[]>([]);
  const [selectedCurriculum, setSelectedCurriculum] = useState<CurriculumData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // 영상강의 관련 상태
  const [videoLectures, setVideoLectures] = useState<VideoLecture[]>([]);
  const [selectedLecture, setSelectedLecture] = useState<VideoLecture | null>(null);
  const [activeTab, setActiveTab] = useState('curriculum');
  
  const { toast } = useToast();

  // 영상강의 관련 함수들 추가
  useEffect(() => {
    fetchVideoLectures();
  }, []);

  const fetchVideoLectures = async () => {
    try {
      // 샘플 데이터로 대체 (실제로는 API 호출)
      const sampleLectures: VideoLecture[] = [
        {
          id: 'lecture-1',
          title: '반려동물 재활 전문과정',
          instructor: '한성규',
          description: '손상이나 질병 또는 장애를 가진 반려동물에게 의학적 중재 및 재활 훈련, 심리 치료 등을 통해 동물의 신체적, 정신적 기능을 최고의 수준으로 회복시키는 종합 재활 과정입니다.',
          totalDuration: 900,
          difficulty: 'advanced',
          category: '재활치료',
          price: 350000,
          rating: 4.9,
          reviewCount: 156,
          studentCount: 289,
          status: 'pending',
          modules: [
            {
              id: 'module-1',
              title: '1강: 오리엔테이션 (OT)',
              description: '강의 내용 개요 및 반려동물 재활의 기본 개념',
              duration: 45,
              objectives: ['반려동물 재활의 기본 개념 이해', '강의 전체 구성 파악'],
              materials: ['교재 및 학습노트', 'PPT 자료'],
              format: 'theory',
              isFree: true,
              order: 1
            }
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      setVideoLectures(sampleLectures);
    } catch (error) {
      console.error('영상강의 목록 조회 실패:', error);
    }
  };

  const handleApproveLecture = async (lectureId: string) => {
    try {
      setVideoLectures(videoLectures.map(lecture => 
        lecture.id === lectureId 
          ? { ...lecture, status: 'approved' as const }
          : lecture
      ));
      toast({
        title: "강의 승인 완료",
        description: "영상강의가 승인되어 공개되었습니다.",
      });
    } catch (error) {
      toast({
        title: "승인 실패",
        description: "영상강의 승인 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleRejectLecture = async (lectureId: string) => {
    try {
      setVideoLectures(videoLectures.map(lecture => 
        lecture.id === lectureId 
          ? { ...lecture, status: 'rejected' as const }
          : lecture
      ));
      toast({
        title: "강의 반려 완료",
        description: "영상강의가 반려되었습니다.",
      });
    } catch (error) {
      toast({
        title: "반려 실패",
        description: "영상강의 반려 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteLecture = async (lectureId: string) => {
    if (!confirm('정말로 이 영상강의를 삭제하시겠습니까?')) return;

    try {
      setVideoLectures(videoLectures.filter(lecture => lecture.id !== lectureId));
      toast({
        title: "강의 삭제 완료",
        description: "영상강의가 성공적으로 삭제되었습니다.",
      });
    } catch (error) {
      toast({
        title: "삭제 실패",
        description: "영상강의 삭제 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  // 미리 정의된 실제 커리큘럼 템플릿 (첨부 파일 기반)
  const realCurriculumTemplates = [
    {
      title: "기초 복종훈련 완전정복",
      description: "반려견의 기본적인 복종훈련부터 고급 명령어까지 체계적으로 학습하는 종합 과정입니다.",
      category: "기초훈련",
      difficulty: "beginner" as const,
      duration: 480, // 8시간
      price: 180000,
      modules: [
        {
          title: "1주차: 기본자세와 친화관계 형성",
          description: "훈련사와 반려견의 첫 만남, 기본적인 신뢰관계 구축",
          duration: 60,
          objectives: [
            "반려견과의 신뢰관계 형성",
            "기본적인 터치 훈련",
            "이름 부르기 반응 훈련"
          ],
          content: `
# 1주차: 기본자세와 친화관계 형성

## 목표
- 반려견과 훈련사 간의 신뢰관계 구축
- 기본적인 접촉과 소통 방법 익히기
- 이름을 부르면 반응하는 훈련

## 세부 커리큘럼

### 1. 첫 만남과 관계형성 (15분)
- 반려견의 성격과 특성 파악
- 긴장감 해소를 위한 자연스러운 접근
- 간식을 통한 긍정적 인상 만들기

### 2. 기본 터치 훈련 (20분)
- 목, 등, 가슴 등 편안한 부위부터 시작
- 점진적으로 발, 귀, 입 주변 터치
- 터치와 동시에 보상 제공

### 3. 이름 부르기 훈련 (25분)
- 조용한 환경에서 이름 부르기
- 반응 시 즉시 보상
- 점차 산만한 환경에서도 반응하도록 연습
          `,
          isRequired: true
        },
        {
          title: "2주차: 앉아, 엎드려 기본 명령어",
          description: "가장 기본이 되는 앉아와 엎드려 명령어를 완벽하게 마스터",
          duration: 60,
          objectives: [
            "앉아 명령어 완전 숙지",
            "엎드려 명령어 습득",
            "명령어와 손신호 연결"
          ],
          content: `
# 2주차: 앉아, 엎드려 기본 명령어

## 목표
- '앉아' 명령어 100% 성공률 달성
- '엎드려' 명령어 기본 습득
- 음성 명령과 손신호 동시 학습

## 세부 커리큘럼

### 1. 앉아 명령어 완성 (25분)
- 간식을 이용한 유도 방법
- 명령어와 동작의 정확한 타이밍
- 보상의 적절한 시점과 방법
- 다양한 장소에서의 반복 연습

### 2. 엎드려 명령어 도입 (25분)
- 앉은 자세에서 엎드려로 유도
- 점진적인 손신호 도입
- 자세 유지 시간 점차 증가

### 3. 명령어 복합 연습 (10분)
- 앉아 → 엎드려 연속 명령
- 다양한 환경에서의 적용 연습
          `,
          isRequired: true
        },
        {
          title: "3주차: 기다려와 이리와 명령어",
          description: "안전을 위한 필수 명령어인 기다려와 이리와를 집중 훈련",
          duration: 60,
          objectives: [
            "기다려 명령어로 충동 억제",
            "이리와 명령어로 리콜 훈련",
            "긴급상황 대응 능력 개발"
          ],
          content: `
# 3주차: 기다려와 이리와 명령어

## 목표
- 위험 상황에서의 정지 능력 개발
- 확실한 리콜(부름에 오기) 훈련
- 충동 억제 능력 향상

## 세부 커리큘럼

### 1. 기다려 명령어 훈련 (30분)
- 짧은 시간부터 점차 연장
- 다양한 유혹 상황에서의 기다리기
- 허용 신호까지 완벽한 대기

### 2. 이리와 명령어 훈련 (25분)
- 실내에서의 기본 리콜 훈련
- 긴 리드줄을 이용한 안전한 야외 연습
- 높은 보상가치 간식 활용

### 3. 실전 응용 연습 (5분)
- 산책 중 갑작스러운 상황 대응
- 다른 개나 사람 만날 때의 제어
          `,
          isRequired: true
        }
      ]
    },
    {
      title: "문제행동 교정 전문과정",
      description: "짖음, 물기, 분리불안 등 다양한 문제행동을 체계적으로 교정하는 전문 과정입니다.",
      category: "문제행동교정",
      difficulty: "intermediate" as const,
      duration: 600, // 10시간
      price: 300000,
      modules: [
        {
          title: "1단계: 문제행동 원인 분석",
          description: "반려견의 문제행동 근본 원인을 파악하고 맞춤형 교정 계획 수립",
          duration: 90,
          objectives: [
            "문제행동의 정확한 원인 분석",
            "개별 맞춤형 교정 계획 수립",
            "보호자 교육과 역할 이해"
          ],
          content: `
# 1단계: 문제행동 원인 분석

## 목표
- 문제행동의 근본 원인 정확한 파악
- 개체별 특성을 고려한 맞춤형 접근
- 보호자의 역할과 책임 이해

## 세부 분석 과정

### 1. 행동 관찰 및 기록 (30분)
- 문제행동 발생 패턴 분석
- 트리거(방아쇠) 상황 파악
- 행동 전후 환경 요인 조사

### 2. 개체 특성 평가 (30분)
- 성격, 기질, 사회화 정도 평가
- 스트레스 요인 및 두려움 대상 파악
- 학습 능력 및 집중력 테스트

### 3. 교정 계획 수립 (30분)
- 단계별 교정 로드맵 작성
- 목표 설정 및 성공 지표 정의
- 보호자 교육 내용 및 방법 결정
          `,
          isRequired: true
        },
        {
          title: "2단계: 과도한 짖음 교정",
          description: "경계, 요구, 스트레스성 짖음 등 원인별 맞춤 교정법 적용",
          duration: 120,
          objectives: [
            "짖음 유형별 원인 이해",
            "단계적 짖음 줄이기 훈련",
            "대체 행동 학습"
          ],
          content: `
# 2단계: 과도한 짖음 교정

## 짖음 유형별 분석 및 교정

### 1. 경계성 짖음 교정 (40분)
- 문밖 소리나 외부 자극에 대한 과도한 반응
- 점진적 둔감화 훈련
- '조용히' 명령어 학습
- 적절한 경계 수준 유지 방법

### 2. 요구성 짖음 교정 (40분)
- 관심 끌기, 간식 요구 등의 목적성 짖음
- 무시 기법과 타이밍의 중요성
- 올바른 요구 방법 대체 학습
- 보상 체계 재정립

### 3. 스트레스성 짖음 교정 (40분)
- 분리불안, 환경 변화 등으로 인한 짖음
- 스트레스 요인 제거 및 완화
- 안정감 제공 훈련
- 점진적 적응 훈련
          `,
          isRequired: true
        }
      ]
    }
  ];

  const [newCurriculum, setNewCurriculum] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'beginner' as const,
    duration: 0,
    price: 0,
    trainerId: '',
    trainerName: ''
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [selectedModule, setSelectedModule] = useState<ModuleData | null>(null);
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    videoFile: null as File | null
  });

  useEffect(() => {
    loadCurriculums();
  }, []);

  const loadCurriculums = async () => {
    try {
      const response = await fetch('/api/admin/curriculums');
      if (response.ok) {
        const data = await response.json();
        setCurriculums(data.curriculums || []);
      }
    } catch (error) {
      console.error('커리큘럼 목록 로딩 실패:', error);
    }
  };

  const createFromTemplate = async (template: typeof realCurriculumTemplates[0]) => {
    try {
      const curriculumData = {
        ...template,
        trainerId: '100', // 강동훈 훈련사 ID
        trainerName: '강동훈',
        modules: template.modules.map((module, index) => ({
          ...module,
          id: `module-${Date.now()}-${index}`,
          order: index + 1,
          videos: []
        }))
      };

      const response = await fetch('/api/admin/curriculums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(curriculumData)
      });

      if (response.ok) {
        const result = await response.json();
        setCurriculums(prev => [...prev, result]);
        toast({
          title: "성공",
          description: `"${template.title}" 커리큘럼이 생성되었습니다.`,
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "커리큘럼 생성에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // 파일 타입 검증
    const allowedTypes = ['.hwp', '.docx', '.doc', '.txt'];
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(fileExtension)) {
      toast({
        title: "파일 형식 오류",
        description: "지원하는 파일 형식: .hwp, .docx, .doc, .txt",
        variant: "destructive"
      });
      return;
    }

    setIsProcessingFile(true);
    setUploadedFile(file);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/curriculum/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        
        // 파일에서 추출된 내용으로 커리큘럼 폼 자동 입력
        const extractedData = result.extractedData || {};
        
        setNewCurriculum(prev => ({
          ...prev,
          title: extractedData.title || file.name.replace(/\.[^/.]+$/, ""),
          description: extractedData.description || "파일에서 추출된 커리큘럼",
          category: extractedData.category || "행동교정",
          difficulty: extractedData.difficulty || 'advanced',
          duration: extractedData.duration || 480, // 8시간 기본값
          price: extractedData.price || 300000,    // 30만원 기본값
          trainerId: '100', // 강동훈 훈련사 ID
          trainerName: '강동훈'
        }));

        // 새 커리큘럼 생성 모드로 전환
        setIsCreating(true);
        setSelectedCurriculum(null);

        toast({
          title: "파일 업로드 및 자동 입력 완료",
          description: `"${extractedData.title || file.name}" 커리큘럼 정보가 자동으로 입력되었습니다. 내용을 확인 후 등록해주세요.`,
          variant: "default"
        });
      } else {
        throw new Error('파일 처리 실패');
      }
    } catch (error) {
      toast({
        title: "파일 처리 오류",
        description: "파일을 처리하는 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingFile(false);
    }
  };

  const updateCurriculum = async (curriculum: CurriculumData) => {
    try {
      const response = await fetch(`/api/admin/curriculums/${curriculum.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...curriculum,
          updatedAt: new Date()
        })
      });

      if (response.ok) {
        const updatedCurriculum = await response.json();
        setCurriculums(prev => 
          prev.map(c => c.id === curriculum.id ? updatedCurriculum : c)
        );
        setIsEditing(false);
        toast({
          title: "성공",
          description: "커리큘럼이 수정되었습니다.",
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "커리큘럼 수정에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const deleteCurriculum = async (curriculumId: string) => {
    if (!confirm('정말로 이 커리큘럼을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/curriculums/${curriculumId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCurriculums(prev => prev.filter(c => c.id !== curriculumId));
        setSelectedCurriculum(null);
        setIsEditing(false);
        toast({
          title: "성공",
          description: "커리큘럼이 삭제되었습니다.",
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "커리큘럼 삭제에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  // 영상 업로드 함수
  const uploadVideoToModule = async (moduleId: string) => {
    if (!newVideo.videoFile || !newVideo.title.trim()) {
      toast({
        title: "입력 오류",
        description: "영상 파일과 제목을 모두 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    try {
      setVideoUploadProgress(0);
      const formData = new FormData();
      formData.append('video', newVideo.videoFile);
      formData.append('title', newVideo.title);
      formData.append('description', newVideo.description);
      formData.append('moduleId', moduleId);

      const response = await fetch('/api/admin/curriculum/videos/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const videoData = await response.json();
        
        // 커리큘럼 상태 업데이트
        if (selectedCurriculum) {
          const updatedCurriculum = {
            ...selectedCurriculum,
            modules: selectedCurriculum.modules.map(module =>
              module.id === moduleId
                ? { ...module, videos: [...module.videos, videoData] }
                : module
            )
          };
          setSelectedCurriculum(updatedCurriculum);
        }

        setIsAddingVideo(false);
        setNewVideo({ title: '', description: '', videoFile: null });
        toast({
          title: "성공",
          description: "영상이 성공적으로 업로드되었습니다.",
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "영상 업로드에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  // 영상 삭제 함수
  const deleteVideoFromModule = async (moduleId: string, videoId: string) => {
    if (!confirm('정말로 이 영상을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/curriculum/videos/${videoId}`, {
        method: 'DELETE'
      });

      if (response.ok && selectedCurriculum) {
        const updatedCurriculum = {
          ...selectedCurriculum,
          modules: selectedCurriculum.modules.map(module =>
            module.id === moduleId
              ? { ...module, videos: module.videos.filter(v => v.id !== videoId) }
              : module
          )
        };
        setSelectedCurriculum(updatedCurriculum);
        
        toast({
          title: "성공",
          description: "영상이 삭제되었습니다.",
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "영상 삭제에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  // 커리큘럼 미리보기 함수
  const previewCurriculum = (curriculumId: string) => {
    // 새 탭에서 미리보기 페이지 열기
    const previewUrl = `/courses/${curriculumId}/preview`;
    window.open(previewUrl, '_blank');
    
    toast({
      title: "미리보기",
      description: "새 탭에서 커리큘럼 미리보기를 열었습니다.",
      variant: "default"
    });
  };

  // 커리큘럼 발행 함수
  const publishCurriculum = async (curriculumId: string) => {
    if (!selectedCurriculum) return;

    try {
      const response = await fetch(`/api/admin/curriculums/${curriculumId}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedCurriculum)
      });

      if (response.ok) {
        const result = await response.json();
        
        // 커리큘럼 상태 업데이트
        setSelectedCurriculum(prev => prev ? { ...prev, status: 'published' } : null);
        
        // 커리큘럼 목록에서도 상태 업데이트
        setCurriculums(prev => 
          prev.map(curr => 
            curr.id === curriculumId 
              ? { ...curr, status: 'published' as const }
              : curr
          )
        );

        toast({
          title: "발행 완료",
          description: `커리큘럼이 강의로 성공적으로 발행되었습니다. (강의 ID: ${result.courseId})`,
          variant: "default"
        });

        // 발행된 강의 페이지로 이동 옵션 제공
        if (confirm('발행된 강의 페이지를 확인하시겠습니까?')) {
          window.open(`/courses/${result.courseId}`, '_blank');
        }
      } else {
        throw new Error('발행 실패');
      }
    } catch (error) {
      console.error('커리큘럼 발행 실패:', error);
      toast({
        title: "발행 실패",
        description: "커리큘럼 발행 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const createCustomCurriculum = async () => {
    if (!newCurriculum.title.trim()) {
      toast({
        title: "입력 오류",
        description: "커리큘럼 제목을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    try {
      const curriculumData = {
        ...newCurriculum,
        id: `curriculum-${Date.now()}`,
        modules: [],
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const response = await fetch('/api/admin/curriculums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(curriculumData)
      });

      if (response.ok) {
        const result = await response.json();
        setCurriculums(prev => [...prev, result]);
        setNewCurriculum({
          title: '',
          description: '',
          category: '',
          difficulty: 'beginner',
          duration: 0,
          price: 0,
          trainerId: '',
          trainerName: ''
        });
        setIsCreating(false);
        toast({
          title: "성공",
          description: "커리큘럼이 생성되었습니다.",
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "커리큘럼 생성에 실패했습니다.",
        variant: "destructive"
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'secondary';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '초급';
      case 'intermediate': return '중급';
      case 'advanced': return '고급';
      default: return '미정';
    }
  };




  // 영상강의 관련 헬퍼 함수
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">초안</Badge>;
      case 'pending':
        return <Badge variant="warning">검토중</Badge>;
      case 'approved':
        return <Badge variant="success">승인됨</Badge>;
      case 'rejected':
        return <Badge variant="danger">반려됨</Badge>;
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <Badge variant="default">초급</Badge>;
      case 'intermediate':
        return <Badge variant="secondary">중급</Badge>;
      case 'advanced':
        return <Badge variant="outline">고급</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">커리큘럼 & 영상강의 관리</h1>
          <p className="text-gray-600">훈련 프로그램 커리큘럼과 영상강의를 통합 관리합니다.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="curriculum">커리큘럼 관리</TabsTrigger>
            <TabsTrigger value="video-lectures">영상강의 관리</TabsTrigger>
            <TabsTrigger value="pending-approval">승인 대기</TabsTrigger>
          </TabsList>

          <TabsContent value="curriculum" className="space-y-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 미리 정의된 커리큘럼 템플릿 */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  실제 커리큘럼 템플릿
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {realCurriculumTemplates.map((template, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{template.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant={getDifficultyColor(template.difficulty)}>
                            {getDifficultyText(template.difficulty)}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {Math.floor(template.duration / 60)}시간
                          </span>
                          <span className="text-sm text-gray-500">
                            {template.modules.length}개 모듈
                          </span>
                          <span className="text-sm font-medium text-green-600">
                            ₩{template.price.toLocaleString()}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {template.modules.map((module, moduleIndex) => (
                            <div key={moduleIndex} className="text-xs text-gray-500">
                              • {module.title} ({module.duration}분)
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button 
                        onClick={() => createFromTemplate(template)}
                        className="flex items-center gap-1"
                        size="sm"
                      >
                        <Plus className="w-4 h-4" />
                        커리큘럼 생성
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        미리보기
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* 등록된 커리큘럼 목록 */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    등록된 커리큘럼
                  </CardTitle>
                  <Button 
                    onClick={() => setIsCreating(true)}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    직접 생성
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {curriculums.map(curriculum => (
                  <div
                    key={curriculum.id}
                    onClick={() => setSelectedCurriculum(curriculum)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedCurriculum?.id === curriculum.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{curriculum.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {curriculum.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={getDifficultyColor(curriculum.difficulty)} className="text-xs">
                            {getDifficultyText(curriculum.difficulty)}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {curriculum.modules.length}개 모듈
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {curriculum.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* 커스텀 커리큘럼 생성 폼 */}
                {isCreating && (
                  <div className="p-4 border border-dashed border-gray-300 rounded-lg">
                    <h4 className="font-medium mb-3">새 커리큘럼 생성</h4>
                    <div className="space-y-3">
                      {/* 파일 업로드 섹션 */}
                      <div className="p-3 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
                        <div className="text-center">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                          <p className="text-sm font-medium text-blue-700 mb-1">파일에서 커리큘럼 생성</p>
                          <p className="text-xs text-blue-600 mb-3">
                            한글파일(.hwp), 워드(.docx), 텍스트(.txt) 파일을 업로드하세요
                          </p>
                          <input
                            type="file"
                            accept=".hwp,.docx,.doc,.txt"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file);
                            }}
                            className="hidden"
                            id="curriculum-file-upload"
                          />
                          <label
                            htmlFor="curriculum-file-upload"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 cursor-pointer"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            파일 선택
                          </label>
                          {isProcessingFile && (
                            <div className="mt-2">
                              <div className="text-xs text-blue-600">파일 처리 중...</div>
                            </div>
                          )}
                          {uploadedFile && (
                            <div className="mt-2 text-xs text-green-600">
                              업로드됨: {uploadedFile.name}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-center text-gray-500 text-sm">또는</div>

                      {/* 수동 입력 폼 */}
                      <Input
                        placeholder="커리큘럼 제목"
                        value={newCurriculum.title}
                        onChange={(e) => setNewCurriculum(prev => ({ ...prev, title: e.target.value }))}
                      />
                      <Textarea
                        placeholder="커리큘럼 설명"
                        value={newCurriculum.description}
                        onChange={(e) => setNewCurriculum(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="카테고리"
                          value={newCurriculum.category}
                          onChange={(e) => setNewCurriculum(prev => ({ ...prev, category: e.target.value }))}
                        />
                        <Input
                          type="number"
                          placeholder="가격"
                          value={newCurriculum.price}
                          onChange={(e) => setNewCurriculum(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={createCustomCurriculum} size="sm" disabled={isProcessingFile}>
                          <Save className="w-4 h-4 mr-1" />
                          생성
                        </Button>
                        <Button 
                          onClick={() => {
                            setIsCreating(false);
                            setUploadedFile(null);
                            setNewCurriculum({
                              title: '',
                              description: '',
                              category: '',
                              difficulty: 'beginner',
                              duration: 0,
                              price: 0,
                              trainerId: '',
                              trainerName: ''
                            });
                          }} 
                          variant="outline" 
                          size="sm"
                        >
                          취소
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {curriculums.length === 0 && !isCreating && (
                  <div className="text-center text-gray-500 py-8">
                    <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <div>등록된 커리큘럼이 없습니다.</div>
                    <div className="text-sm">템플릿을 사용하거나 직접 생성해보세요.</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 선택된 커리큘럼 상세 정보 */}
            {selectedCurriculum && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    커리큘럼 상세
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedCurriculum.title}</h3>
                      <p className="text-gray-600 mt-1">{selectedCurriculum.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">총 시간</div>
                        <div className="font-semibold">{Math.floor(selectedCurriculum.duration / 60)}시간</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">모듈 수</div>
                        <div className="font-semibold">{selectedCurriculum.modules.length}개</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">가격</div>
                        <div className="font-semibold">₩{selectedCurriculum.price.toLocaleString()}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">모듈 구성</h4>
                      <div className="space-y-3">
                        {selectedCurriculum.modules.map((module, index) => (
                          <div key={module.id} className="p-4 bg-gray-50 rounded-lg border">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex-1">
                                <div className="font-medium text-lg">{module.title}</div>
                                <div className="text-sm text-gray-600 mt-1">{module.description}</div>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {module.duration}분
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Video className="w-4 h-4" />
                                    {module.videos?.length || 0}개 영상
                                  </span>
                                </div>
                              </div>
                              <Button
                                onClick={() => {
                                  setSelectedModule(module);
                                  setIsAddingVideo(true);
                                }}
                                size="sm"
                                variant="outline"
                                className="ml-3"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                영상 추가
                              </Button>
                            </div>

                            {/* 등록된 영상 목록 */}
                            {module.videos && module.videos.length > 0 && (
                              <div className="mt-3 pt-3 border-t">
                                <div className="text-sm font-medium text-gray-700 mb-2">등록된 영상:</div>
                                <div className="space-y-2">
                                  {module.videos.map((video) => (
                                    <div key={video.id} className="flex items-center justify-between p-2 bg-white rounded border">
                                      <div className="flex items-center gap-2">
                                        <Play className="w-4 h-4 text-blue-500" />
                                        <div>
                                          <div className="font-medium text-sm">{video.title}</div>
                                          <div className="text-xs text-gray-500">{video.description}</div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Badge 
                                          variant={video.status === 'ready' ? 'default' : 'destructive'}
                                        >
                                          {video.status === 'ready' ? '준비완료' : video.status === 'processing' ? '처리중' : '대기중'}
                                        </Badge>
                                        <Button
                                          onClick={() => deleteVideoFromModule(module.id, video.id)}
                                          size="sm"
                                          variant="destructive"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 커리큘럼 액션 버튼 */}
                    <div className="space-y-3 pt-4 border-t">
                      {/* 미리보기 및 발행 버튼 */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => previewCurriculum(selectedCurriculum.id)}
                          variant="outline"
                          size="sm"
                          className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          미리보기
                        </Button>
                        <Button
                          onClick={() => publishCurriculum(selectedCurriculum.id)}
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          disabled={selectedCurriculum.status === 'published'}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {selectedCurriculum.status === 'published' ? '발행완료' : '강의로 발행'}
                        </Button>
                      </div>

                      {/* 기본 액션 버튼 */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setIsEditing(true)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          수정
                        </Button>
                        <Button
                          onClick={() => deleteCurriculum(selectedCurriculum.id)}
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          삭제
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 커리큘럼 편집 모달 */}
            {isEditing && selectedCurriculum && (
              <Card className="mt-6 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Edit className="w-5 h-5" />
                    커리큘럼 수정
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      placeholder="커리큘럼 제목"
                      value={selectedCurriculum.title}
                      onChange={(e) => setSelectedCurriculum(prev => prev ? { ...prev, title: e.target.value } : null)}
                    />
                    <Textarea
                      placeholder="커리큘럼 설명"
                      value={selectedCurriculum.description}
                      onChange={(e) => setSelectedCurriculum(prev => prev ? { ...prev, description: e.target.value } : null)}
                      rows={4}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="카테고리"
                        value={selectedCurriculum.category}
                        onChange={(e) => setSelectedCurriculum(prev => prev ? { ...prev, category: e.target.value } : null)}
                      />
                      <Input
                        type="number"
                        placeholder="가격"
                        value={selectedCurriculum.price}
                        onChange={(e) => setSelectedCurriculum(prev => prev ? { ...prev, price: parseInt(e.target.value) } : null)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="number"
                        placeholder="총 시간 (분)"
                        value={selectedCurriculum.duration}
                        onChange={(e) => setSelectedCurriculum(prev => prev ? { ...prev, duration: parseInt(e.target.value) } : null)}
                      />
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={selectedCurriculum.difficulty}
                        onChange={(e) => setSelectedCurriculum(prev => prev ? { ...prev, difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced' } : null)}
                      >
                        <option value="beginner">초급</option>
                        <option value="intermediate">중급</option>
                        <option value="advanced">고급</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updateCurriculum(selectedCurriculum)}
                        size="sm"
                        className="flex-1"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        저장
                      </Button>
                      <Button
                        onClick={() => publishCurriculum(selectedCurriculum)}
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        disabled={selectedCurriculum.status === 'published'}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {selectedCurriculum.status === 'published' ? '발행됨' : '강의로 발행'}
                      </Button>
                      <Button
                        onClick={() => previewCurriculum(selectedCurriculum)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        미리보기
                      </Button>
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 영상 업로드 모달 */}
            {isAddingVideo && selectedModule && (
              <Card className="mt-6 border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Video className="w-5 h-5" />
                    영상 업로드 - {selectedModule.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">영상 제목</label>
                      <Input
                        placeholder="예: 1강 - 기본자세 익히기"
                        value={newVideo.title}
                        onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">영상 설명</label>
                      <Textarea
                        placeholder="영상 내용에 대한 간단한 설명을 입력해주세요"
                        value={newVideo.description}
                        onChange={(e) => setNewVideo(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">영상 파일</label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setNewVideo(prev => ({ ...prev, videoFile: file }));
                          }
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        지원 형식: MP4, AVI, MOV (최대 500MB)
                      </p>
                    </div>

                    {videoUploadProgress > 0 && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>업로드 진행률</span>
                          <span>{videoUploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${videoUploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={() => uploadVideoToModule(selectedModule.id)}
                        className="flex-1"
                        disabled={!newVideo.videoFile || !newVideo.title.trim()}
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        업로드
                      </Button>
                      <Button
                        onClick={() => {
                          setIsAddingVideo(false);
                          setSelectedModule(null);
                          setNewVideo({ title: '', description: '', videoFile: null });
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </TabsContent>

          {/* 영상강의 관리 탭 */}
          <TabsContent value="video-lectures" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoLectures.filter(lecture => lecture.status !== 'pending').map((lecture) => (
                <Card key={lecture.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{lecture.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {lecture.instructor} • {lecture.category}
                        </p>
                        <div className="flex items-center gap-2 mb-3">
                          {getDifficultyBadge(lecture.difficulty)}
                          {getStatusBadge(lecture.status)}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                      {lecture.description}
                    </p>

                    <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{Math.floor(lecture.totalDuration / 60)}시간</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{lecture.studentCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400" />
                        <span>{lecture.rating}</span>
                      </div>
                    </div>

                    <div className="text-lg font-bold mb-4">
                      ₩{lecture.price.toLocaleString()}
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedLecture(lecture)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        상세
                      </Button>
                      
                      {userRole === 'admin' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteLecture(lecture.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 승인 대기 탭 */}
          <TabsContent value="pending-approval" className="space-y-6">
            {userRole === 'admin' ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">승인 대기 중인 영상강의</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {videoLectures.filter(lecture => lecture.status === 'pending').map((lecture) => (
                    <Card key={lecture.id} className="border-orange-200 dark:border-orange-800">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{lecture.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {lecture.instructor} • {lecture.category}
                            </p>
                          </div>
                          <Badge variant="warning">검토중</Badge>
                        </div>
                        
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                          {lecture.description}
                        </p>

                        <div className="mb-4">
                          <div className="text-sm text-gray-500 mb-2">모듈 정보:</div>
                          <div className="space-y-1">
                            {lecture.modules.slice(0, 3).map((module, idx) => (
                              <div key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                                <BookOpen className="h-3 w-3" />
                                <span>{module.title} ({module.duration}분)</span>
                                <Badge variant="outline" className="text-xs">
                                  {module.format === 'theory' ? '이론' : 
                                   module.format === 'practice' ? '실습' : '이론+실습'}
                                </Badge>
                              </div>
                            ))}
                            {lecture.modules.length > 3 && (
                              <div className="text-xs text-gray-500">
                                외 {lecture.modules.length - 3}개 모듈
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => handleApproveLecture(lecture.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            승인
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleRejectLecture(lecture.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            반려
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedLecture(lecture)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            상세보기
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {videoLectures.filter(lecture => lecture.status === 'pending').length === 0 && (
                  <Card className="bg-gray-50 dark:bg-gray-800/50">
                    <CardContent className="p-8 text-center">
                      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        승인 대기 중인 강의가 없습니다
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        새로운 강의 등록이 있을 때까지 기다려주세요.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
                <CardContent className="p-6 text-center">
                  <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="font-medium text-orange-700 dark:text-orange-300 mb-2">
                    관리자 전용 기능
                  </h3>
                  <p className="text-orange-600 dark:text-orange-400">
                    강의 승인 기능은 관리자만 사용할 수 있습니다.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* 영상강의 상세 보기 모달 */}
        {selectedLecture && (
          <Dialog open={!!selectedLecture} onOpenChange={() => setSelectedLecture(null)}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  {selectedLecture.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">기본 정보</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">강사:</span> {selectedLecture.instructor}</div>
                      <div><span className="font-medium">카테고리:</span> {selectedLecture.category}</div>
                      <div><span className="font-medium">난이도:</span> {getDifficultyBadge(selectedLecture.difficulty)}</div>
                      <div><span className="font-medium">상태:</span> {getStatusBadge(selectedLecture.status)}</div>
                      <div><span className="font-medium">가격:</span> ₩{selectedLecture.price.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">통계</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">총 시간:</span> {Math.floor(selectedLecture.totalDuration / 60)}시간</div>
                      <div><span className="font-medium">평점:</span> {selectedLecture.rating} / 5.0</div>
                      <div><span className="font-medium">리뷰 수:</span> {selectedLecture.reviewCount}개</div>
                      <div><span className="font-medium">수강생:</span> {selectedLecture.studentCount}명</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">강의 설명</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedLecture.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">강의 모듈 ({selectedLecture.modules.length}개)</h4>
                  <div className="space-y-3">
                    {selectedLecture.modules.map((module, index) => (
                      <div key={module.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium">{module.title}</h5>
                          <div className="flex items-center gap-2">
                            <Badge variant={module.format === 'theory' ? 'secondary' : 
                                           module.format === 'practice' ? 'default' : 'outline'}>
                              {module.format === 'theory' ? '이론' : 
                               module.format === 'practice' ? '실습' : '이론+실습'}
                            </Badge>
                            <span className="text-xs text-gray-500">{module.duration}분</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {module.description}
                        </p>
                        
                        {module.materials.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs font-medium text-gray-500">준비물:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {module.materials.map((material, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {material}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  {userRole === 'admin' && selectedLecture.status === 'pending' && (
                    <>
                      <Button 
                        variant="default"
                        onClick={() => {
                          handleApproveLecture(selectedLecture.id);
                          setSelectedLecture(null);
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        승인
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => {
                          handleRejectLecture(selectedLecture.id);
                          setSelectedLecture(null);
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        반려
                      </Button>
                    </>
                  )}
                  <Button variant="outline" onClick={() => setSelectedLecture(null)}>
                    닫기
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}