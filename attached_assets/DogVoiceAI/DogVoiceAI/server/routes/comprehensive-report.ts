
import express from 'express';
import { generateComprehensiveReport } from '../ai-analysis-simple';
import { storage } from '../storage';

const router = express.Router();

// 종합 리포트 생성
router.post('/generate', express.json(), async (req, res) => {
  try {
    const { dogId, surveyData, motionData, behaviorData } = req.body;

    if (!surveyData || !motionData || !behaviorData) {
      return res.status(400).json({ error: '필수 데이터가 누락되었습니다' });
    }

    // AI를 통한 종합 리포트 생성
    const report = await generateComprehensiveReport(
      surveyData,
      motionData,
      behaviorData
    );

    // DB에 저장 (선택적)
    if (dogId) {
      try {
        await storage.createComprehensiveReport({
          dogId,
          surveyId: surveyData.id || null,
          sessionId: null,
          reportDate: new Date(),
          motionAnalysisSummary: report.motionAnalysisSummary,
          behaviorAnalysisSummary: report.behaviorAnalysisSummary,
          surveyInsights: report.surveyInsights,
          correlationFindings: report.correlationFindings,
          aiRecommendations: report.aiRecommendations,
          healthAlerts: report.healthAlerts,
          trainingAdvice: report.trainingAdvice,
          overallScore: report.overallScore,
          wellbeingIndex: report.wellbeingIndex
        });
      } catch (dbError) {
        console.error('DB 저장 오류:', dbError);
        // DB 저장 실패해도 리포트는 반환
      }
    }

    res.json(report);

  } catch (error) {
    console.error('Comprehensive report generation error:', error);
    res.status(500).json({ error: '종합 리포트 생성 중 오류가 발생했습니다' });
  }
});

// 저장된 리포트 조회
router.get('/dog/:dogId', async (req, res) => {
  try {
    const dogId = parseInt(req.params.dogId);
    const reports = await storage.getComprehensiveReportsByDog(dogId);
    res.json(reports);
  } catch (error) {
    console.error('Report fetch error:', error);
    res.status(500).json({ error: '리포트 조회 중 오류가 발생했습니다' });
  }
});

export default router;
