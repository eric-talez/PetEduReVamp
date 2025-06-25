import { Express } from "express";
import { storage } from "../storage";

export function registerTrainerRoutes(app: Express) {
  // ===== Trainer Routes =====
  
  // Get all trainers
  app.get("/api/trainers", async (req, res) => {
    try {
      const trainers = await storage.getAllTrainers();
      return res.status(200).json(trainers);
    } catch (error: any) {
      console.error("Get trainers error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get trainer by ID
  app.get("/api/trainers/:id", async (req, res) => {
    try {
      const trainerId = parseInt(req.params.id);
      const trainer = await storage.getTrainer(trainerId);
      
      if (!trainer) {
        return res.status(404).json({ message: "Trainer not found" });
      }
      
      return res.status(200).json(trainer);
    } catch (error: any) {
      console.error("Get trainer error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Book consultation with trainer
  app.post("/api/trainers/:id/consultation", async (req, res) => {
    try {
      const trainerId = parseInt(req.params.id);
      const consultationData = req.body;
      
      // 훈련사 존재 확인
      const trainer = await storage.getTrainer(trainerId);
      if (!trainer) {
        return res.status(404).json({ message: "Trainer not found" });
      }
      
      // 상담 예약 정보 저장 (실제로는 데이터베이스에 저장)
      const consultation = {
        id: Date.now(), // 임시 ID
        trainerId: trainerId,
        trainerName: trainer.name,
        date: consultationData.date,
        time: consultationData.time,
        petName: consultationData.petName,
        petAge: consultationData.petAge,
        petBreed: consultationData.petBreed,
        concerns: consultationData.concerns,
        phone: consultationData.phone,
        email: consultationData.email,
        status: 'pending',
        createdAt: new Date().toISOString(),
        institutionId: consultationData.institutionId
      };
      
      console.log('상담 예약 접수:', consultation);
      
      // 성공 응답
      return res.status(200).json({
        success: true,
        message: "상담 예약이 완료되었습니다.",
        consultation: consultation
      });
    } catch (error: any) {
      console.error("Consultation booking error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
}