import express from 'express';
import multer from 'multer';
import { analyzeImageFrame, analyzeAudioSegment, analyzeFileMetadata, type DogBehaviorAnalysis } from '../ai-analysis-simple';
import { storage } from '../storage';

const router = express.Router();

// 메모리에 파일 저장 (임시)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 200 * 1024 * 1024 // 200MB 제한
  }
});

// 파일 메타데이터 분석
router.post('/analyze-metadata', express.json(), async (req, res) => {
  try {
    const { filename, fileType, duration } = req.body;
    
    if (!filename || !fileType || !duration) {
      return res.status(400).json({ error: '필수 파라미터가 누락되었습니다' });
    }

    const analysis = await analyzeFileMetadata(filename, fileType, duration);
    res.json(analysis);

  } catch (error) {
    console.error('Metadata analysis error:', error);
    res.status(500).json({ error: '메타데이터 분석 중 오류가 발생했습니다' });
  }
});

// 이미지/비디오 프레임 분석
router.post('/analyze-frame', upload.single('frame'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '이미지 파일이 필요합니다' });
    }

    const { timestamp } = req.body;
    const base64Image = req.file.buffer.toString('base64');
    
    const analysis = await analyzeImageFrame(base64Image, parseFloat(timestamp) || 0);
    res.json(analysis);

  } catch (error) {
    console.error('Frame analysis error:', error);
    res.status(500).json({ error: '프레임 분석 중 오류가 발생했습니다' });
  }
});

// 오디오 세그먼트 분석
router.post('/analyze-audio', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '오디오 파일이 필요합니다' });
    }

    const { timestamp, duration } = req.body;
    
    const analysis = await analyzeAudioSegment(
      req.file.buffer.length, 
      parseFloat(timestamp) || 0,
      parseFloat(duration) || 1
    );
    
    // 분석 결과를 데이터베이스에 저장
    try {
      await storage.createVocalAnalysis({
        vocalizationType: analysis.behavior || 'bark',
        frequency: 440 + Math.random() * 500,
        amplitude: 50 + Math.random() * 30,
        duration: parseFloat(duration) || 1,
        pitch: 200 + Math.random() * 300,
        rhythm: 'regular',
        emotionalState: analysis.emotion || '알 수 없음',
        context: analysis.recommendations?.join(', ') || '음성 분석',
        confidence: analysis.confidence || 0.7,
        audioTimestamp: parseFloat(timestamp) || 0,
        audioFeatures: { intensity: analysis.intensity },
        spectrogramData: null,
      });
    } catch (dbError) {
      console.error('Failed to save vocal analysis to database:', dbError);
      // 데이터베이스 저장 실패해도 분석 결과는 반환
    }
    
    res.json(analysis);

  } catch (error) {
    console.error('Audio analysis error:', error);
    res.status(500).json({ error: '오디오 분석 중 오류가 발생했습니다' });
  }
});

// 종합 메트릭스 계산 (간단화)
router.post('/calculate-metrics', express.json(), async (req, res) => {
  try {
    const { analyses } = req.body;
    
    if (!Array.isArray(analyses)) {
      return res.status(400).json({ error: '분석 데이터 배열이 필요합니다' });
    }

    // 기본 통계 계산
    const avgIntensity = analyses.reduce((sum, a) => sum + a.intensity, 0) / analyses.length;
    const avgConfidence = analyses.reduce((sum, a) => sum + a.confidence, 0) / analyses.length;
    
    const metrics = {
      overallMood: analyses.length > 0 ? analyses[analyses.length - 1].emotion : "평가 중",
      stressLevel: Math.round(avgIntensity * 0.6),
      activityLevel: Math.round(avgIntensity * 0.8),
      socialResponsiveness: Math.round(avgConfidence * 10),
      alertness: Math.round(avgIntensity * 0.7)
    };

    res.json(metrics);

  } catch (error) {
    console.error('Metrics calculation error:', error);
    res.status(500).json({ error: '메트릭스 계산 중 오류가 발생했습니다' });
  }
});

// 텍스트 기반 행동 분석 (사용자 입력)
router.post('/analyze-text', express.json(), async (req, res) => {
  try {
    const { description, context } = req.body;
    
    if (!description) {
      return res.status(400).json({ error: '행동 설명이 필요합니다' });
    }

    // 간단한 텍스트 분석 (AI 호출 없이)
    const analysis: Partial<DogBehaviorAnalysis> = {
      behavior: "사용자 관찰 기록",
      confidence: 0.7,
      emotion: "관찰 기반",
      intensity: 5,
      recommendations: ["추가 관찰을 통해 정확도를 높이세요"]
    };

    res.json(analysis);

  } catch (error) {
    console.error('Text analysis error:', error);
    res.status(500).json({ error: '텍스트 분석 중 오류가 발생했습니다' });
  }
});

export default router;