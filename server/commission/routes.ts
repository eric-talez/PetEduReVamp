import { Express, Request, Response } from "express";
import { storage } from "../storage";
import { createCommissionPolicySchema, createCommissionTransactionSchema, createSettlementReportSchema } from "@shared/schema";

export function registerCommissionRoutes(app: Express) {
  // 수수료 정책 API 라우트
  app.get("/api/commission/policies", async (req, res) => {
    try {
      const policies = await storage.getCommissionPolicies();
      res.json(policies);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch commission policies" });
    }
  });

  app.get("/api/commission/policies/:id", async (req, res) => {
    try {
      const policy = await storage.getCommissionPolicy(parseInt(req.params.id));
      if (!policy) {
        return res.status(404).json({ error: "Commission policy not found" });
      }
      res.json(policy);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch commission policy" });
    }
  });

  app.post("/api/commission/policies", async (req, res) => {
    try {
      const policyData = createCommissionPolicySchema.parse(req.body);
      const policy = await storage.createCommissionPolicy(policyData);
      res.status(201).json(policy);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create commission policy" });
    }
  });

  app.put("/api/commission/policies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const policy = await storage.getCommissionPolicy(id);
      if (!policy) {
        return res.status(404).json({ error: "Commission policy not found" });
      }
      
      const updatedPolicy = await storage.updateCommissionPolicy(id, req.body);
      res.json(updatedPolicy);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to update commission policy" });
    }
  });

  // 수수료 거래 API 라우트
  app.get("/api/commission/transactions", async (req, res) => {
    try {
      const transactions = await storage.getCommissionTransactions();
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch commission transactions" });
    }
  });

  app.get("/api/commission/transactions/:id", async (req, res) => {
    try {
      const transaction = await storage.getCommissionTransaction(parseInt(req.params.id));
      if (!transaction) {
        return res.status(404).json({ error: "Commission transaction not found" });
      }
      res.json(transaction);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch commission transaction" });
    }
  });

  app.post("/api/commission/transactions", async (req, res) => {
    try {
      const transactionData = createCommissionTransactionSchema.parse(req.body);
      const transaction = await storage.createCommissionTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create commission transaction" });
    }
  });

  app.put("/api/commission/transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const transaction = await storage.getCommissionTransaction(id);
      if (!transaction) {
        return res.status(404).json({ error: "Commission transaction not found" });
      }
      
      const updatedTransaction = await storage.updateCommissionTransaction(id, req.body);
      res.json(updatedTransaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to update commission transaction" });
    }
  });

  // 정산 보고서 API 라우트
  app.get("/api/commission/settlements", async (req, res) => {
    try {
      const reports = await storage.getSettlementReports();
      res.json(reports);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch settlement reports" });
    }
  });

  app.get("/api/commission/settlements/:id", async (req, res) => {
    try {
      const report = await storage.getSettlementReport(parseInt(req.params.id));
      if (!report) {
        return res.status(404).json({ error: "Settlement report not found" });
      }
      res.json(report);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch settlement report" });
    }
  });

  app.post("/api/commission/settlements", async (req, res) => {
    try {
      const reportData = createSettlementReportSchema.parse(req.body);
      const report = await storage.createSettlementReport(reportData);
      res.status(201).json(report);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create settlement report" });
    }
  });

  app.put("/api/commission/settlements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const report = await storage.getSettlementReport(id);
      if (!report) {
        return res.status(404).json({ error: "Settlement report not found" });
      }
      
      const updatedReport = await storage.updateSettlementReport(id, req.body);
      res.json(updatedReport);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to update settlement report" });
    }
  });
}