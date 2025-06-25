import { pgTable, text, integer, boolean, timestamp, serial, decimal, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// 수수료 정책 테이블
export const feePolicies = pgTable("fee_policies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  feeType: varchar("fee_type", { length: 50 }).notNull(), // 'percentage', 'fixed', 'tiered'
  baseRate: decimal("base_rate", { precision: 5, scale: 2 }).notNull(), // 기본 수수료율 또는 금액
  minAmount: decimal("min_amount", { precision: 10, scale: 2 }), // 최소 수수료
  maxAmount: decimal("max_amount", { precision: 10, scale: 2 }), // 최대 수수료
  tierConfig: jsonb("tier_config"), // 차등 수수료 설정
  targetType: varchar("target_type", { length: 50 }).notNull(), // 'trainer', 'institute', 'all'
  targetId: integer("target_id"), // 특정 대상 ID (null이면 전체 적용)
  isActive: boolean("is_active").default(true),
  validFrom: timestamp("valid_from").defaultNow(),
  validTo: timestamp("valid_to"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 거래 내역 테이블
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  transactionType: varchar("transaction_type", { length: 50 }).notNull(), // 'course_payment', 'consultation', 'product_sale'
  referenceId: integer("reference_id").notNull(), // 강의, 상담, 상품 등의 ID
  referenceType: varchar("reference_type", { length: 50 }).notNull(), // 'course', 'consultation', 'product'
  payerId: integer("payer_id").notNull(), // 결제자 ID
  payeeId: integer("payee_id").notNull(), // 수취인 ID (훈련사/기관)
  grossAmount: decimal("gross_amount", { precision: 10, scale: 2 }).notNull(), // 총 결제금액
  feeAmount: decimal("fee_amount", { precision: 10, scale: 2 }).notNull(), // 수수료
  netAmount: decimal("net_amount", { precision: 10, scale: 2 }).notNull(), // 실 지급액
  currency: varchar("currency", { length: 3 }).default("KRW"),
  paymentMethod: varchar("payment_method", { length: 50 }), // 'card', 'bank_transfer', 'virtual_account'
  paymentProvider: varchar("payment_provider", { length: 50 }), // 'stripe', 'toss', 'kakao_pay'
  externalTransactionId: varchar("external_transaction_id", { length: 100 }),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // 'pending', 'completed', 'failed', 'refunded'
  feePolicyId: integer("fee_policy_id").references(() => feePolicies.id),
  instituteId: integer("institute_id"), // 기관 거래인 경우
  metadata: jsonb("metadata"), // 추가 정보
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 정산 내역 테이블
export const settlements = pgTable("settlements", {
  id: serial("id").primaryKey(),
  settlementType: varchar("settlement_type", { length: 50 }).notNull(), // 'trainer', 'institute'
  targetId: integer("target_id").notNull(), // 훈련사 또는 기관 ID
  targetName: varchar("target_name", { length: 200 }).notNull(),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  totalGrossAmount: decimal("total_gross_amount", { precision: 12, scale: 2 }).notNull(),
  totalFeeAmount: decimal("total_fee_amount", { precision: 12, scale: 2 }).notNull(),
  totalNetAmount: decimal("total_net_amount", { precision: 12, scale: 2 }).notNull(),
  transactionCount: integer("transaction_count").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // 'pending', 'processing', 'completed', 'paid'
  bankAccount: jsonb("bank_account"), // 계좌 정보
  settlementDetails: jsonb("settlement_details"), // 상세 정산 내역
  approvedBy: integer("approved_by"), // 승인자 ID
  processedAt: timestamp("processed_at"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 정산 항목 테이블 (정산의 세부 항목들)
export const settlementItems = pgTable("settlement_items", {
  id: serial("id").primaryKey(),
  settlementId: integer("settlement_id").references(() => settlements.id).notNull(),
  transactionId: integer("transaction_id").references(() => transactions.id).notNull(),
  itemName: varchar("item_name", { length: 200 }).notNull(),
  itemType: varchar("item_type", { length: 50 }).notNull(), // 'course', 'consultation', 'product'
  quantity: integer("quantity").default(1),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  grossAmount: decimal("gross_amount", { precision: 10, scale: 2 }).notNull(),
  feeAmount: decimal("fee_amount", { precision: 10, scale: 2 }).notNull(),
  netAmount: decimal("net_amount", { precision: 10, scale: 2 }).notNull(),
  feeRate: decimal("fee_rate", { precision: 5, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// 수수료 조정 내역 테이블
export const feeAdjustments = pgTable("fee_adjustments", {
  id: serial("id").primaryKey(),
  targetType: varchar("target_type", { length: 50 }).notNull(), // 'trainer', 'institute'
  targetId: integer("target_id").notNull(),
  adjustmentType: varchar("adjustment_type", { length: 50 }).notNull(), // 'discount', 'penalty', 'bonus'
  originalAmount: decimal("original_amount", { precision: 10, scale: 2 }).notNull(),
  adjustmentAmount: decimal("adjustment_amount", { precision: 10, scale: 2 }).notNull(),
  finalAmount: decimal("final_amount", { precision: 10, scale: 2 }).notNull(),
  reason: text("reason").notNull(),
  referenceId: integer("reference_id"), // 관련 거래 또는 정산 ID
  approvedBy: integer("approved_by").notNull(),
  isActive: boolean("is_active").default(true),
  effectiveDate: timestamp("effective_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// 환불 내역 테이블
export const refunds = pgTable("refunds", {
  id: serial("id").primaryKey(),
  originalTransactionId: integer("original_transaction_id").references(() => transactions.id).notNull(),
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }).notNull(),
  refundFeeAmount: decimal("refund_fee_amount", { precision: 10, scale: 2 }).notNull(),
  refundReason: text("refund_reason").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // 'pending', 'approved', 'completed', 'rejected'
  requestedBy: integer("requested_by").notNull(),
  approvedBy: integer("approved_by"),
  externalRefundId: varchar("external_refund_id", { length: 100 }),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 매출 통계 테이블 (캐싱용)
export const revenueStats = pgTable("revenue_stats", {
  id: serial("id").primaryKey(),
  targetType: varchar("target_type", { length: 50 }).notNull(), // 'trainer', 'institute', 'platform'
  targetId: integer("target_id"), // null이면 플랫폼 전체
  statsPeriod: varchar("stats_period", { length: 20 }).notNull(), // 'daily', 'weekly', 'monthly', 'yearly'
  periodDate: varchar("period_date", { length: 20 }).notNull(), // '2025-01', '2025-W01', '2025-01-15'
  totalRevenue: decimal("total_revenue", { precision: 12, scale: 2 }).notNull(),
  totalFees: decimal("total_fees", { precision: 12, scale: 2 }).notNull(),
  transactionCount: integer("transaction_count").notNull(),
  avgTransactionAmount: decimal("avg_transaction_amount", { precision: 10, scale: 2 }),
  topCategory: varchar("top_category", { length: 100 }),
  metadata: jsonb("metadata"), // 추가 통계 데이터
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod 스키마 생성
export const insertFeePolicySchema = createInsertSchema(feePolicies);
export const selectFeePolicySchema = createSelectSchema(feePolicies);
export type InsertFeePolicy = z.infer<typeof insertFeePolicySchema>;
export type FeePolicy = z.infer<typeof selectFeePolicySchema>;

export const insertTransactionSchema = createInsertSchema(transactions);
export const selectTransactionSchema = createSelectSchema(transactions);
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = z.infer<typeof selectTransactionSchema>;

export const insertSettlementSchema = createInsertSchema(settlements);
export const selectSettlementSchema = createSelectSchema(settlements);
export type InsertSettlement = z.infer<typeof insertSettlementSchema>;
export type Settlement = z.infer<typeof selectSettlementSchema>;

export const insertSettlementItemSchema = createInsertSchema(settlementItems);
export const selectSettlementItemSchema = createSelectSchema(settlementItems);
export type InsertSettlementItem = z.infer<typeof insertSettlementItemSchema>;
export type SettlementItem = z.infer<typeof selectSettlementItemSchema>;

export const insertFeeAdjustmentSchema = createInsertSchema(feeAdjustments);
export const selectFeeAdjustmentSchema = createSelectSchema(feeAdjustments);
export type InsertFeeAdjustment = z.infer<typeof insertFeeAdjustmentSchema>;
export type FeeAdjustment = z.infer<typeof selectFeeAdjustmentSchema>;

export const insertRefundSchema = createInsertSchema(refunds);
export const selectRefundSchema = createSelectSchema(refunds);
export type InsertRefund = z.infer<typeof insertRefundSchema>;
export type Refund = z.infer<typeof selectRefundSchema>;

export const insertRevenueStatsSchema = createInsertSchema(revenueStats);
export const selectRevenueStatsSchema = createSelectSchema(revenueStats);
export type InsertRevenueStats = z.infer<typeof insertRevenueStatsSchema>;
export type RevenueStats = z.infer<typeof selectRevenueStatsSchema>;