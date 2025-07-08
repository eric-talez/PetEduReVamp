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

  // 예약 생성 API
  app.post("/api/institutes/:id/reservations", async (req, res) => {
    try {
      const instituteId = parseInt(req.params.id);
      const reservationData = req.body;

      console.log('[Reservation API] 예약 생성 요청:', reservationData);

      // 기본 유효성 검사
      if (!reservationData.name || !reservationData.phone || !reservationData.date || !reservationData.time) {
        return res.status(400).json({ 
          message: 'Missing required fields',
          error: '필수 정보가 누락되었습니다.' 
        });
      }

      // 예약 데이터 저장 (실제로는 데이터베이스에 저장)
      const reservation = {
        id: Date.now(),
        instituteId,
        ...reservationData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      console.log('[Reservation API] 예약 생성 완료:', reservation);

      res.status(201).json({
        success: true,
        message: '예약이 성공적으로 생성되었습니다.',
        reservation
      });

    } catch (error) {
      console.error('Error creating reservation:', error);
      res.status(500).json({ 
        success: false,
        message: 'Internal server error',
        error: '예약 생성 중 오류가 발생했습니다.'
      });
    }
  });

  // 문의 생성 API
  app.post("/api/institutes/:id/inquiries", async (req, res) => {
    try {
      const instituteId = parseInt(req.params.id);
      const inquiryData = req.body;

      console.log('[Inquiry API] 문의 생성 요청:', inquiryData);

      // 기본 유효성 검사
      if (!inquiryData.name || !inquiryData.contact || !inquiryData.message) {
        return res.status(400).json({ 
          message: 'Missing required fields',
          error: '필수 정보가 누락되었습니다.' 
        });
      }

      // 문의 데이터 저장
      const inquiry = {
        id: Date.now(),
        instituteId,
        ...inquiryData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      console.log('[Inquiry API] 문의 생성 완료:', inquiry);

      res.status(201).json({
        success: true,
        message: '문의가 성공적으로 접수되었습니다.',
        inquiry
      });

    } catch (error) {
      console.error('Error creating inquiry:', error);
      res.status(500).json({ 
        success: false,
        message: 'Internal server error',
        error: '문의 접수 중 오류가 발생했습니다.'
      });
    }
  });

  // 리뷰 생성 API
  app.post("/api/institutes/:id/reviews", async (req, res) => {
    try {
      const instituteId = parseInt(req.params.id);
      const reviewData = req.body;

      console.log('[Review API] 리뷰 생성 요청:', reviewData);

      // 기본 유효성 검사
      if (!reviewData.authorName || !reviewData.rating || !reviewData.content) {
        return res.status(400).json({ 
          message: 'Missing required fields',
          error: '필수 정보가 누락되었습니다.' 
        });
      }

      // 평점 유효성 검사
      if (reviewData.rating < 1 || reviewData.rating > 5) {
        return res.status(400).json({ 
          message: 'Invalid rating',
          error: '평점은 1-5점 사이여야 합니다.' 
        });
      }

      // 리뷰 데이터 저장
      const review = {
        id: Date.now(),
        instituteId,
        ...reviewData,
        createdAt: new Date().toISOString()
      };

      console.log('[Review API] 리뷰 생성 완료:', review);

      res.status(201).json({
        success: true,
        message: '리뷰가 성공적으로 등록되었습니다.',
        review
      });

    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ 
        success: false,
        message: 'Internal server error',
        error: '리뷰 등록 중 오류가 발생했습니다.'
      });
    }
  });

  // 기관별 리뷰 조회 API
  app.get("/api/institutes/:id/reviews", async (req, res) => {
    try {
      const instituteId = parseInt(req.params.id);

      // 샘플 리뷰 데이터
      const reviews = [
        {
          id: 1,
          instituteId,
          authorName: "김반려",
          rating: 5,
          content: "강동훈 훈련사님이 정말 친절하고 전문적이세요. 우리 골든리트리버 맥스가 많이 발전했어요!",
          trainerId: 1,
          trainerName: "강동훈",
          createdAt: "2024-12-15T10:30:00Z"
        },
        {
          id: 2,
          instituteId,
          authorName: "박펫샵",
          rating: 4,
          content: "시설이 깔끔하고 교육 프로그램이 체계적입니다. 다만 주차공간이 조금 아쉬워요.",
          createdAt: "2024-12-10T14:20:00Z"
        }
      ];

      res.json({
        success: true,
        reviews
      });

    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ 
        success: false,
        message: 'Internal server error' 
      });
    }
  });

  // 전화 문의 로그 API
  app.post("/api/institutes/:id/call-inquiries", async (req, res) => {
    try {
      const instituteId = parseInt(req.params.id);
      const callData = req.body;

      console.log('[Call Inquiry API] 전화 문의 로그:', callData);

      // 전화 문의 로그 저장
      const callInquiry = {
        id: Date.now(),
        instituteId,
        callerInfo: callData.callerInfo,
        purpose: callData.purpose,
        timestamp: new Date().toISOString()
      };

      res.status(201).json({
        success: true,
        message: '전화 문의가 기록되었습니다.',
        callInquiry
      });

    } catch (error) {
      console.error('Error logging call inquiry:', error);
      res.status(500).json({ 
        success: false,
        message: 'Internal server error' 
      });
    }
  });
}