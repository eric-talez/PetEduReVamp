import { Express, Request, Response } from 'express';
import { z } from 'zod';
import { storage } from '../storage';

// 행동 분석 요청 스키마
const behaviorAnalysisSchema = z.object({
  videoUrl: z.string().url(),
  petId: z.number().int().positive()
});

// 분석 결과 스키마
const analysisResultSchema = z.object({
  id: z.string(),
  petId: z.number(),
  date: z.string(),
  analysisType: z.enum(['behavior', 'training']),
  scores: z.record(z.string(), z.number()),
  summary: z.string(),
  recommendations: z.array(z.string()),
  videoId: z.string().optional(),
  imageUrl: z.string().optional()
});

// 훈련 진행 상황 스키마
const trainingProgressSchema = z.object({
  petId: z.number(),
  courseId: z.number(),
  skillId: z.number(),
  skillName: z.string(),
  progress: z.number().min(0).max(100),
  history: z.array(z.object({
    date: z.string(),
    score: z.number(),
    label: z.string().optional()
  }))
});

// AI 분석 라우트 등록
export function registerAIRoutes(app: Express) {
  // 동물 행동 분석
  app.post('/api/ai/analyze-behavior', async (req: Request, res: Response) => {
    try {
      // 요청 검증
      const validatedData = behaviorAnalysisSchema.parse(req.body);
      
      // 반려동물 정보 확인
      const pet = await storage.getPet(validatedData.petId);
      if (!pet) {
        return res.status(404).json({ message: '반려동물을 찾을 수 없습니다.' });
      }
      
      // 실제 구현에서는 AI 서비스 호출
      // 현재는 샘플 분석 결과 반환
      const result = {
        id: `analysis-${Date.now()}`,
        petId: validatedData.petId,
        date: new Date().toISOString(),
        analysisType: 'behavior',
        scores: {
          'energy': Math.random() * 100,
          'stress': Math.random() * 100,
          'anxiety': Math.random() * 100,
          'aggression': Math.random() * 100,
          'sociability': Math.random() * 100,
          'curiosity': Math.random() * 100
        },
        summary: '반려동물이 일반적으로 건강한 행동을 보이고 있습니다. 스트레스 수준이 약간 높게 나타납니다.',
        recommendations: [
          '규칙적인 운동 시간을 늘려보세요.',
          '조용한 환경에서 휴식 시간을 제공하세요.',
          '긍정적인 강화 훈련 방법을 사용하세요.'
        ],
        videoId: 'vid-12345',
        imageUrl: 'https://example.com/pet-analysis.jpg'
      };
      
      // 분석 결과 검증
      const validatedResult = analysisResultSchema.parse(result);
      
      // 결과를 실제 데이터베이스에 저장하는 로직이 여기에 들어갈 수 있습니다.
      
      res.json(validatedResult);
    } catch (error: any) {
      console.error('행동 분석 오류:', error);
      res.status(400).json({ message: error.message || '행동 분석 실패' });
    }
  });
  
  // 훈련 진행 상황 조회
  app.get('/api/ai/training-progress', async (req: Request, res: Response) => {
    try {
      const petId = Number(req.query.petId);
      const courseId = req.query.courseId ? Number(req.query.courseId) : undefined;
      const skillId = req.query.skillId ? Number(req.query.skillId) : undefined;
      
      if (!petId || isNaN(petId)) {
        return res.status(400).json({ message: '유효한 반려동물 ID가 필요합니다.' });
      }
      
      // 반려동물 정보 확인
      const pet = await storage.getPet(petId);
      if (!pet) {
        return res.status(404).json({ message: '반려동물을 찾을 수 없습니다.' });
      }
      
      // 샘플 데이터 생성
      const progressData = [
        {
          petId,
          courseId: 1,
          skillId: 101,
          skillName: '앉아',
          progress: 85,
          history: generateHistoryData(85)
        },
        {
          petId,
          courseId: 1,
          skillId: 102,
          skillName: '기다려',
          progress: 65,
          history: generateHistoryData(65)
        },
        {
          petId,
          courseId: 2,
          skillId: 201,
          skillName: '롤오버',
          progress: 40,
          history: generateHistoryData(40)
        },
        {
          petId,
          courseId: 2,
          skillId: 202,
          skillName: '손',
          progress: 60,
          history: generateHistoryData(60)
        }
      ];
      
      // 필터링
      let result = progressData;
      if (courseId !== undefined) {
        result = result.filter(p => p.courseId === courseId);
      }
      if (skillId !== undefined) {
        result = result.filter(p => p.skillId === skillId);
      }
      
      // 유효성 검사
      result.forEach(item => trainingProgressSchema.parse(item));
      
      res.json(result);
    } catch (error: any) {
      console.error('훈련 진행 상황 조회 오류:', error);
      res.status(400).json({ message: error.message || '훈련 진행 상황 조회 실패' });
    }
  });
  
  // 행동 분석 기록 조회
  app.get('/api/ai/behavior-history', async (req: Request, res: Response) => {
    try {
      const petId = Number(req.query.petId);
      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;
      
      if (!petId || isNaN(petId)) {
        return res.status(400).json({ message: '유효한 반려동물 ID가 필요합니다.' });
      }
      
      // 반려동물 정보 확인
      const pet = await storage.getPet(petId);
      if (!pet) {
        return res.status(404).json({ message: '반려동물을 찾을 수 없습니다.' });
      }
      
      // 샘플 데이터 생성
      const currentDate = new Date();
      const history = [
        generateAnalysisResult(petId, new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000)),
        generateAnalysisResult(petId, new Date(currentDate.getTime() - 20 * 24 * 60 * 60 * 1000)),
        generateAnalysisResult(petId, new Date(currentDate.getTime() - 10 * 24 * 60 * 60 * 1000)),
        generateAnalysisResult(petId, currentDate)
      ];
      
      // 필터링
      let result = history;
      if (startDate) {
        const start = new Date(startDate);
        result = result.filter(item => new Date(item.date) >= start);
      }
      if (endDate) {
        const end = new Date(endDate);
        result = result.filter(item => new Date(item.date) <= end);
      }
      
      // 유효성 검사
      result.forEach(item => analysisResultSchema.parse(item));
      
      // 날짜 기준 정렬
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      res.json(result);
    } catch (error: any) {
      console.error('행동 분석 기록 조회 오류:', error);
      res.status(400).json({ message: error.message || '행동 분석 기록 조회 실패' });
    }
  });
  
  // 훈련 추천 생성
  app.get('/api/ai/training-recommendations', async (req: Request, res: Response) => {
    try {
      const petId = Number(req.query.petId);
      
      if (!petId || isNaN(petId)) {
        return res.status(400).json({ message: '유효한 반려동물 ID가 필요합니다.' });
      }
      
      // 반려동물 정보 확인
      const pet = await storage.getPet(petId);
      if (!pet) {
        return res.status(404).json({ message: '반려동물을 찾을 수 없습니다.' });
      }
      
      // 샘플 추천 데이터
      const recommendations = [
        '규칙적인 일일 산책 루틴을 만드세요.',
        '간단한 복종 훈련부터 시작하는 것이 좋습니다.',
        '사회화 훈련을 위해 다른 반려동물들과 안전한 환경에서 만남을 가져보세요.',
        '놀이와 훈련을 결합한 인터랙티브 장난감을 활용해보세요.',
        '반려동물의 집중력 향상을 위한 노즈워크 훈련을 시도해보세요.'
      ];
      
      res.json(recommendations);
    } catch (error: any) {
      console.error('훈련 추천 생성 오류:', error);
      res.status(400).json({ message: error.message || '훈련 추천 생성 실패' });
    }
  });
}

// 도우미 함수: 히스토리 데이터 생성
function generateHistoryData(finalScore: number): { date: string; score: number; label?: string }[] {
  const dates = [];
  const currentDate = new Date();
  
  for (let i = 10; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - i * 3);
    
    // 점진적 향상을 보여주는 점수 계산
    const progress = Math.min(finalScore, Math.max(0, finalScore * (1 - i * 0.1) + (Math.random() * 10 - 5)));
    
    dates.push({
      date: date.toISOString().split('T')[0],
      score: Math.round(progress),
      label: i === 0 ? '현재' : undefined
    });
  }
  
  return dates;
}

// 도우미 함수: 분석 결과 생성
function generateAnalysisResult(petId: number, date: Date) {
  // 시간에 따라 향상되는 점수 시뮬레이션
  const improvement = Math.min(30, Math.max(0, (date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (365 * 24 * 60 * 60 * 1000) * 30));
  
  return {
    id: `analysis-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    petId,
    date: date.toISOString(),
    analysisType: 'behavior',
    scores: {
      'energy': Math.min(100, 60 + improvement + (Math.random() * 10)),
      'stress': Math.max(0, 50 - improvement + (Math.random() * 10)),
      'anxiety': Math.max(0, 40 - improvement + (Math.random() * 10)),
      'aggression': Math.max(0, 30 - improvement/2 + (Math.random() * 10)),
      'sociability': Math.min(100, 70 + improvement/2 + (Math.random() * 10)),
      'curiosity': Math.min(100, 75 + improvement/3 + (Math.random() * 10))
    },
    summary: `반려동물의 행동이 ${improvement > 15 ? '크게' : '점진적으로'} 개선되고 있습니다. ${improvement > 20 ? '스트레스와 불안이 크게 감소했습니다.' : ''}`,
    recommendations: [
      '긍정적인 강화 훈련을 계속 진행하세요.',
      '일관된 루틴을 유지하세요.',
      improvement < 15 ? '운동 시간을 늘려보는 것이 좋습니다.' : '현재 운동량을 유지하세요.',
      improvement < 10 ? '더 많은 사회화 경험이 필요합니다.' : '다양한 환경에서의 경험을 계속 제공하세요.'
    ],
    videoId: `vid-${Math.floor(Math.random() * 10000)}`,
    imageUrl: `https://example.com/pet-analysis-${Math.floor(Math.random() * 100)}.jpg`
  };
}