
/**
 * 서비스 연동 상태 및 권한별 접근 제어 유틸리티
 */

import { UserRole } from '../../../shared/schema';

export interface ServiceAccess {
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canManage: boolean;
}

export interface ServiceIntegrationStatus {
  notebook: ServiceAccess;
  consultation: ServiceAccess;
  courses: ServiceAccess;
  messaging: ServiceAccess;
  shop: ServiceAccess;
  analytics: ServiceAccess;
}

/**
 * 사용자 역할에 따른 서비스별 접근 권한 매트릭스
 */
export function getServiceAccessMatrix(userRole: UserRole | null): ServiceIntegrationStatus {
  if (!userRole) {
    return getDefaultServiceAccess();
  }

  const accessMatrix: Record<UserRole, ServiceIntegrationStatus> = {
    'admin': {
      notebook: { canRead: true, canWrite: true, canDelete: true, canManage: true },
      consultation: { canRead: true, canWrite: true, canDelete: true, canManage: true },
      courses: { canRead: true, canWrite: true, canDelete: true, canManage: true },
      messaging: { canRead: true, canWrite: true, canDelete: true, canManage: true },
      shop: { canRead: true, canWrite: true, canDelete: true, canManage: true },
      analytics: { canRead: true, canWrite: true, canDelete: true, canManage: true },
    },
    'institute-admin': {
      notebook: { canRead: true, canWrite: false, canDelete: false, canManage: true },
      consultation: { canRead: true, canWrite: false, canDelete: false, canManage: true },
      courses: { canRead: true, canWrite: true, canDelete: false, canManage: true },
      messaging: { canRead: true, canWrite: false, canDelete: false, canManage: true },
      shop: { canRead: true, canWrite: false, canDelete: false, canManage: false },
      analytics: { canRead: true, canWrite: false, canDelete: false, canManage: true },
    },
    'trainer': {
      notebook: { canRead: true, canWrite: true, canDelete: false, canManage: false },
      consultation: { canRead: true, canWrite: true, canDelete: false, canManage: false },
      courses: { canRead: true, canWrite: true, canDelete: true, canManage: false },
      messaging: { canRead: true, canWrite: true, canDelete: false, canManage: false },
      shop: { canRead: true, canWrite: false, canDelete: false, canManage: false },
      analytics: { canRead: true, canWrite: false, canDelete: false, canManage: false },
    },
    'pet-owner': {
      notebook: { canRead: true, canWrite: false, canDelete: false, canManage: false },
      consultation: { canRead: false, canWrite: true, canDelete: false, canManage: false },
      courses: { canRead: true, canWrite: false, canDelete: false, canManage: false },
      messaging: { canRead: true, canWrite: true, canDelete: false, canManage: false },
      shop: { canRead: true, canWrite: false, canDelete: false, canManage: false },
      analytics: { canRead: false, canWrite: false, canDelete: false, canManage: false },
    },
  };

  return accessMatrix[userRole] || getDefaultServiceAccess();
}

function getDefaultServiceAccess(): ServiceIntegrationStatus {
  const defaultAccess: ServiceAccess = { 
    canRead: false, 
    canWrite: false, 
    canDelete: false, 
    canManage: false 
  };
  
  return {
    notebook: defaultAccess,
    consultation: defaultAccess,
    courses: { canRead: true, canWrite: false, canDelete: false, canManage: false },
    messaging: defaultAccess,
    shop: { canRead: true, canWrite: false, canDelete: false, canManage: false },
    analytics: defaultAccess,
  };
}

/**
 * 서비스별 플로우 상태 체크
 */
export async function checkServiceIntegrationHealth(): Promise<Record<string, boolean>> {
  const services = ['auth', 'notebook', 'consultation', 'courses', 'messaging', 'shop'];
  const healthStatus: Record<string, boolean> = {};

  for (const service of services) {
    try {
      const response = await fetch(`/api/${service}/health`, { method: 'GET' });
      healthStatus[service] = response.ok;
    } catch (error) {
      console.error(`Service ${service} health check failed:`, error);
      healthStatus[service] = false;
    }
  }

  return healthStatus;
}

/**
 * 권한별 리다이렉션 경로 결정
 */
export function getDefaultRedirectPath(userRole: UserRole | null): string {
  const redirectPaths: Record<UserRole, string> = {
    'admin': '/admin/dashboard',
    'institute-admin': '/institute/dashboard',
    'trainer': '/trainer/dashboard',
    'pet-owner': '/dashboard',
  };

  return userRole ? redirectPaths[userRole] : '/auth';
}
