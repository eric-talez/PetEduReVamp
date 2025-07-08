import { Express } from "express";
import { storage } from "../storage";

export function registerInstituteRoutes(app: Express, storage: IStorage) {
  // 기관 목록 조회
  app.get("/api/institutes", async (req, res) => {
    try {
      const institutes = await storage.getAllInstitutes();
      res.json(institutes || []);
    } catch (error) {
      console.error('Error fetching institutes:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 기관 상세 조회
  app.get("/api/institutes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      console.log('[InstituteAPI] 기관 상세 조회 요청:', id);
      
      const institute = await storage.getInstitute(id);
      console.log('[InstituteAPI] 조회된 기관 데이터:', institute);

      if (!institute) {
        console.log('[InstituteAPI] 기관을 찾을 수 없음:', id);
        return res.status(404).json({ message: 'Institute not found' });
      }

      res.json(institute);
    } catch (error) {
      console.error('Error fetching institute:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 기관별 훈련사 조회
  app.get("/api/institutes/:id/trainers", async (req, res) => {
    try {
      const instituteId = parseInt(req.params.id);
      const trainers = await storage.getTrainers();
      const instituteTrainers = trainers.filter(t => t.instituteId === instituteId);

      res.json(instituteTrainers || []);
    } catch (error) {
      console.error('Error fetching institute trainers:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 기관별 수강생 조회
  app.get("/api/institutes/:id/students", async (req, res) => {
    try {
      const instituteId = parseInt(req.params.id);
      // 여기서는 샘플 데이터를 반환합니다
      const students = [
        { id: 1, name: '김반려', petName: '멍멍이', instituteId },
        { id: 2, name: '박펫샵', petName: '야옹이', instituteId }
      ];

      res.json(students);
    } catch (error) {
      console.error('Error fetching institute students:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 기관별 통계 조회
  app.get("/api/institutes/:id/stats", async (req, res) => {
    try {
      const instituteId = parseInt(req.params.id);
      const stats = {
        totalTrainers: 5,
        totalStudents: 23,
        monthlyRevenue: 2500000,
        activeClasses: 8
      };

      res.json(stats);
    } catch (error) {
      console.error('Error fetching institute stats:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
}