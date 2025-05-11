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