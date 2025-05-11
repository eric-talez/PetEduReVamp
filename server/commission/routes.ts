import { Express } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { commissionPolicies, commissionTiers, createCommissionPolicySchema } from "@shared/schema";

export function registerCommissionRoutes(app: Express) {
  // 수수료 정책 관련 API
  
  // 모든 수수료 정책 가져오기
  app.get("/api/commission/policies", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "인증이 필요합니다" });
      }
      
      // 관리자 권한 확인
      if (req.session.user.role !== "admin") {
        return res.status(403).json({ message: "관리자 권한이 필요합니다" });
      }
      
      const policies = await storage.getCommissionPolicies();
      return res.status(200).json(policies);
    } catch (error) {
      console.error("수수료 정책 목록 조회 오류:", error);
      return res.status(500).json({ message: "서버 오류" });
    }
  });
  
  // 특정 수수료 정책 가져오기
  app.get("/api/commission/policies/:id", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "인증이 필요합니다" });
      }
      
      const policyId = parseInt(req.params.id);
      const policy = await storage.getCommissionPolicy(policyId);
      
      if (!policy) {
        return res.status(404).json({ message: "수수료 정책을 찾을 수 없습니다" });
      }
      
      return res.status(200).json(policy);
    } catch (error) {
      console.error("수수료 정책 조회 오류:", error);
      return res.status(500).json({ message: "서버 오류" });
    }
  });
  
  // 수수료 정책 생성
  app.post("/api/commission/policies", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "인증이 필요합니다" });
      }
      
      // 관리자 권한 확인
      if (req.session.user.role !== "admin") {
        return res.status(403).json({ message: "관리자 권한이 필요합니다" });
      }
      
      const policyData = createCommissionPolicySchema.parse(req.body);
      const newPolicy = await storage.createCommissionPolicy(policyData);
      
      return res.status(201).json(newPolicy);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "유효하지 않은 데이터", errors: error.errors });
      }
      
      console.error("수수료 정책 생성 오류:", error);
      return res.status(500).json({ message: "서버 오류" });
    }
  });
  
  // 수수료 정책 업데이트
  app.put("/api/commission/policies/:id", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "인증이 필요합니다" });
      }
      
      // 관리자 권한 확인
      if (req.session.user.role !== "admin") {
        return res.status(403).json({ message: "관리자 권한이 필요합니다" });
      }
      
      const policyId = parseInt(req.params.id);
      const policyData = req.body;
      
      // 기존 정책 확인
      const existingPolicy = await storage.getCommissionPolicy(policyId);
      if (!existingPolicy) {
        return res.status(404).json({ message: "수수료 정책을 찾을 수 없습니다" });
      }
      
      const updatedPolicy = await storage.updateCommissionPolicy(policyId, policyData);
      return res.status(200).json(updatedPolicy);
    } catch (error) {
      console.error("수수료 정책 업데이트 오류:", error);
      return res.status(500).json({ message: "서버 오류" });
    }
  });
  
  // 수수료 거래 내역 조회
  app.get("/api/commission/transactions", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "인증이 필요합니다" });
      }
      
      const userId = req.session.user.id;
      let transactions;
      
      // 관리자는 모든 거래 조회 가능
      if (req.session.user.role === "admin") {
        transactions = await storage.getCommissionTransactions();
      } else {
        // 사용자 본인의 거래만 조회
        transactions = (await storage.getCommissionTransactions())
          .filter(t => t.userId === userId);
      }
      
      return res.status(200).json(transactions);
    } catch (error) {
      console.error("수수료 거래 조회 오류:", error);
      return res.status(500).json({ message: "서버 오류" });
    }
  });
  
  // 정산 보고서 조회
  app.get("/api/commission/settlements", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "인증이 필요합니다" });
      }
      
      const userId = req.session.user.id;
      let settlements;
      
      // 관리자는 모든 정산 보고서 조회 가능
      if (req.session.user.role === "admin") {
        settlements = await storage.getSettlementReports();
      } else {
        // 사용자 본인의 정산만 조회
        settlements = (await storage.getSettlementReports())
          .filter(s => s.userId === userId);
      }
      
      return res.status(200).json(settlements);
    } catch (error) {
      console.error("정산 보고서 조회 오류:", error);
      return res.status(500).json({ message: "서버 오류" });
    }
  });
  
  // 정산 보고서 상태 업데이트 (관리자용)
  app.put("/api/commission/settlements/:id", async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: "인증이 필요합니다" });
      }
      
      // 관리자 권한 확인
      if (req.session.user.role !== "admin") {
        return res.status(403).json({ message: "관리자 권한이 필요합니다" });
      }
      
      const settlementId = parseInt(req.params.id);
      const { status, paidAt, paymentMethod } = req.body;
      
      // 기존 정산 보고서 확인
      const existingSettlement = await storage.getSettlementReport(settlementId);
      if (!existingSettlement) {
        return res.status(404).json({ message: "정산 보고서를 찾을 수 없습니다" });
      }
      
      const updatedSettlement = await storage.updateSettlementReport(settlementId, {
        status,
        paidAt,
        paymentMethod,
        updatedAt: new Date()
      });
      
      return res.status(200).json(updatedSettlement);
    } catch (error) {
      console.error("정산 보고서 업데이트 오류:", error);
      return res.status(500).json({ message: "서버 오류" });
    }
  });
}