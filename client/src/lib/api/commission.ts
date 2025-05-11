import { apiRequest } from "../queryClient";

// 수수료 정책 API
export async function fetchCommissionPolicies() {
  const response = await fetch('/api/commission/policies');
  if (!response.ok) {
    throw new Error('Failed to fetch commission policies');
  }
  return response.json();
}

export async function fetchCommissionPolicy(id: number) {
  const response = await fetch(`/api/commission/policies/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch commission policy');
  }
  return response.json();
}

export async function createCommissionPolicy(data: any) {
  return apiRequest('POST', '/api/commission/policies', data)
    .then(res => res.json());
}

export async function updateCommissionPolicy(id: number, data: any) {
  return apiRequest('PUT', `/api/commission/policies/${id}`, data)
    .then(res => res.json());
}

// 수수료 거래 API
export async function fetchCommissionTransactions() {
  const response = await fetch('/api/commission/transactions');
  if (!response.ok) {
    throw new Error('Failed to fetch commission transactions');
  }
  return response.json();
}

// 정산 보고서 API
export async function fetchSettlementReports() {
  const response = await fetch('/api/commission/settlements');
  if (!response.ok) {
    throw new Error('Failed to fetch settlement reports');
  }
  return response.json();
}

export async function updateSettlementReport(id: number, data: any) {
  return apiRequest('PUT', `/api/commission/settlements/${id}`, data)
    .then(res => res.json());
}