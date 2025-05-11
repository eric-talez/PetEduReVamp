import { createContext, useContext, useState, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// AI 분석 결과 타입
export interface AnalysisResult {
  id: string;
  petId: number;
  date: string;
  analysisType: 'behavior' | 'training';
  scores: Record<string, number>; // 항목별 점수
  summary: string;
  recommendations: string[];
  videoId?: string; // 분석에 사용된 비디오 ID (있는 경우)
  imageUrl?: string; // 분석에 사용된 이미지 URL (있는 경우)
}

// 그래프 데이터 포인트 타입
export interface ChartDataPoint {
  date: string;
  score: number;
  label?: string;
}

// 훈련 진행 상황 타입
export interface TrainingProgress {
  petId: number;
  courseId: number;
  skillId: number;
  skillName: string;
  progress: number; // 0-100 범위의 진행률
  history: ChartDataPoint[]; // 시간에 따른 진행 상황
}

// AI 분석 컨텍스트 타입
interface AIAnalysisContextType {
  isAnalyzing: boolean;
  analyzeAnimalBehavior: (videoUrl: string, petId: number) => Promise<AnalysisResult | null>;
  getTrainingProgress: (petId: number, courseId?: number, skillId?: number) => Promise<TrainingProgress[]>;
  getBehaviorHistory: (petId: number, startDate?: string, endDate?: string) => Promise<AnalysisResult[]>;
  generateTrainingRecommendations: (petId: number) => Promise<string[]>;
}

// 컨텍스트 생성
const AIAnalysisContext = createContext<AIAnalysisContextType | null>(null);

// AI 분석 제공자 컴포넌트
export function AIAnalysisProvider({ children }: { children: ReactNode }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  // 동물 행동 분석
  const analyzeAnimalBehavior = async (videoUrl: string, petId: number): Promise<AnalysisResult | null> => {
    setIsAnalyzing(true);

    try {
      // 서버에 분석 요청
      const response = await apiRequest('POST', '/api/ai/analyze-behavior', {
        videoUrl,
        petId
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '행동 분석 실패');
      }

      const result = await response.json();
      
      toast({
        title: "분석 완료",
        description: "반려동물 행동 분석이 완료되었습니다.",
      });

      return result;
    } catch (error: any) {
      console.error('행동 분석 실패:', error);
      
      toast({
        title: "분석 실패",
        description: error.message || "행동 분석 중 오류가 발생했습니다.",
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 훈련 진행 상황 조회
  const getTrainingProgress = async (
    petId: number, 
    courseId?: number, 
    skillId?: number
  ): Promise<TrainingProgress[]> => {
    try {
      // 쿼리 파라미터 구성
      let url = `/api/ai/training-progress?petId=${petId}`;
      if (courseId) url += `&courseId=${courseId}`;
      if (skillId) url += `&skillId=${skillId}`;

      const response = await apiRequest('GET', url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '훈련 진행 상황 조회 실패');
      }

      return await response.json();
    } catch (error: any) {
      console.error('훈련 진행 상황 조회 실패:', error);
      
      toast({
        title: "조회 실패",
        description: error.message || "훈련 진행 상황을 조회하는데 실패했습니다.",
        variant: "destructive"
      });
      
      return [];
    }
  };

  // 행동 분석 기록 조회
  const getBehaviorHistory = async (
    petId: number, 
    startDate?: string, 
    endDate?: string
  ): Promise<AnalysisResult[]> => {
    try {
      // 쿼리 파라미터 구성
      let url = `/api/ai/behavior-history?petId=${petId}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;

      const response = await apiRequest('GET', url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '행동 분석 기록 조회 실패');
      }

      return await response.json();
    } catch (error: any) {
      console.error('행동 분석 기록 조회 실패:', error);
      
      toast({
        title: "조회 실패",
        description: error.message || "행동 분석 기록을 조회하는데 실패했습니다.",
        variant: "destructive"
      });
      
      return [];
    }
  };

  // 훈련 추천 생성
  const generateTrainingRecommendations = async (petId: number): Promise<string[]> => {
    try {
      const response = await apiRequest('GET', `/api/ai/training-recommendations?petId=${petId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '훈련 추천 생성 실패');
      }

      return await response.json();
    } catch (error: any) {
      console.error('훈련 추천 생성 실패:', error);
      
      toast({
        title: "추천 생성 실패",
        description: error.message || "훈련 추천을 생성하는데 실패했습니다.",
        variant: "destructive"
      });
      
      return [];
    }
  };

  return (
    <AIAnalysisContext.Provider
      value={{
        isAnalyzing,
        analyzeAnimalBehavior,
        getTrainingProgress,
        getBehaviorHistory,
        generateTrainingRecommendations
      }}
    >
      {children}
    </AIAnalysisContext.Provider>
  );
}

// AI 분석 훅
export function useAIAnalysis() {
  const context = useContext(AIAnalysisContext);
  
  if (!context) {
    throw new Error('useAIAnalysis must be used within an AIAnalysisProvider');
  }
  
  return context;
}