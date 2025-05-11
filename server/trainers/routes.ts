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
}