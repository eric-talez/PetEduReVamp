import { Express } from "express";
import { storage } from "../storage";

export function registerInstituteRoutes(app: Express) {
  // ===== Institute Routes =====

  // Get all institutes
  app.get("/api/institutes", async (req, res) => {
    try {
      const institutes = await storage.getAllInstitutes();
      return res.status(200).json(institutes);
    } catch (error: any) {
      console.error("Get institutes error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get trainers by institute ID
  app.get("/api/institutes/:id/trainers", async (req, res) => {
    try {
      const instituteId = parseInt(req.params.id);

      // 해당 기관의 훈련사 목록 조회
      const trainers = await storage.getTrainersByInstitute(instituteId);

      if (!trainers || trainers.length === 0) {
        // 샘플 데이터 반환 (실제 데이터가 없을 경우)
        const sampleTrainers = [
          {
            id: 1,
            name: '김민수 전문 훈련사',
            specialty: ['기본 복종 훈련', '사회화 훈련'],
            experience: '10년+',
            rating: 4.9,
            reviews: 156,
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
            bio: '10년 이상의 경력을 가진 전문 훈련사로서 수천 마리의 반려견을 교육했습니다.',
            certifications: ['국제 반려견 훈련사 자격증', 'KKF 공인 훈련사'],
            instituteId: instituteId,
            isVerified: true,
            availableSlots: {
              '2025-06-20': ['10:00', '14:00', '16:00'],
              '2025-06-21': ['09:00', '11:00', '15:00'],
              '2025-06-22': ['10:30', '13:30', '16:30']
            }
          },
          {
            id: 2,
            name: '박지혜 행동교정사',
            specialty: ['행동 교정', '문제행동 해결'],
            experience: '8년+',
            rating: 4.8,
            reviews: 132,
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b4c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
            bio: '문제행동 전문가로 공격성, 분리불안 등의 해결에 특화되어 있습니다.',
            certifications: ['동물행동학 석사', 'CCPDT 공인 훈련사'],
            instituteId: instituteId,
            isVerified: true,
            availableSlots: {
              '2025-06-20': ['11:00', '15:00'],
              '2025-06-21': ['10:00', '14:00', '16:00'],
              '2025-06-23': ['09:30', '13:00', '15:30']
            }
          }
        ];
        return res.status(200).json(sampleTrainers);
      }

      return res.status(200).json(trainers);
    } catch (error: any) {
      console.error("Get institute trainers error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get institute by ID
  app.get("/api/institutes/:id", async (req, res) => {
    try {
      const instituteId = parseInt(req.params.id);
      const institute = await storage.getInstitute(instituteId);

      if (!institute) {
        return res.status(404).json({ message: "Institute not found" });
      }

      return res.status(200).json(institute);
    } catch (error: any) {
      console.error("Get institute error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get institute by code
  app.get("/api/institute/code/:code", async (req, res) => {
    try {
      const instituteCode = req.params.code;
      const institute = await storage.getInstituteByCode(instituteCode);

      if (!institute) {
        return res.status(404).json({ message: "Institute not found with provided code" });
      }

      return res.status(200).json(institute);
    } catch (error: any) {
      console.error("Get institute by code error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
}