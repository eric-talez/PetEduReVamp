/**
 * 알림 템플릿 관리 시스템
 * 
 * 다양한 종류의 알림에 대한 템플릿을 정의하고 관리합니다.
 * 각 템플릿은 제목, 내용 형식을 포함하며 변수를 지원합니다.
 */

import { NotificationType } from '../notification-types';

// 템플릿 변수 타입 정의
export interface TemplateVariables {
  [key: string]: string | number | boolean | null | undefined;
}

// 알림 템플릿 인터페이스
export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  titleTemplate: string;
  bodyTemplate: string;
  channels?: string[]; // 기본 발송 채널 (설정되지 않으면 사용자 기본 설정 사용)
  category?: string;   // 템플릿 분류 (마케팅, 거래, 시스템 등)
  description?: string; // 템플릿 설명
  previewText?: string; // 미리보기 텍스트 (푸시 알림 등에서 사용)
}

// 변수 대체 함수
export function applyTemplate(template: string, variables: TemplateVariables): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
    const value = variables[key.trim()];
    return value !== undefined && value !== null ? String(value) : match;
  });
}

// 알림 템플릿 컬렉션
const templates: { [key: string]: NotificationTemplate } = {
  // 시스템 알림 템플릿
  'system_maintenance': {
    id: 'system_maintenance',
    type: NotificationType.SYSTEM,
    titleTemplate: '시스템 점검 안내',
    bodyTemplate: '{{date}} {{startTime}}부터 {{endTime}}까지 시스템 점검이 예정되어 있습니다. 이용에 참고해 주세요.',
    description: '시스템 점검 안내를 위한 템플릿',
    category: '시스템'
  },
  'system_update': {
    id: 'system_update',
    type: NotificationType.SYSTEM,
    titleTemplate: '시스템 업데이트 안내',
    bodyTemplate: '새로운 기능이 추가되었습니다: {{featureName}}. 지금 확인해보세요!',
    description: '시스템 업데이트 안내를 위한 템플릿',
    category: '시스템'
  },
  
  // 메시지 알림 템플릿
  'new_message': {
    id: 'new_message',
    type: NotificationType.MESSAGE,
    titleTemplate: '새 메시지 도착',
    bodyTemplate: '{{senderName}}님으로부터 새 메시지가 도착했습니다.',
    description: '새 메시지 알림을 위한 템플릿',
    category: '메시지'
  },
  'message_reply': {
    id: 'message_reply',
    type: NotificationType.MESSAGE,
    titleTemplate: '메시지 답장',
    bodyTemplate: '{{senderName}}님이 회원님의 메시지에 답장했습니다.',
    description: '메시지 답장 알림을 위한 템플릿',
    category: '메시지'
  },
  
  // 수업 관련 알림 템플릿
  'course_reminder': {
    id: 'course_reminder',
    type: NotificationType.COURSE,
    titleTemplate: '수업 일정 안내',
    bodyTemplate: '내일 {{time}}에 "{{courseName}}" 수업이 예정되어 있습니다.',
    description: '수업 일정 알림을 위한 템플릿',
    category: '수업'
  },
  'course_canceled': {
    id: 'course_canceled',
    type: NotificationType.COURSE,
    titleTemplate: '수업 취소 안내',
    bodyTemplate: '{{date}} {{time}}에 예정되어 있던 "{{courseName}}" 수업이 취소되었습니다.',
    description: '수업 취소 알림을 위한 템플릿',
    category: '수업'
  },
  'course_rescheduled': {
    id: 'course_rescheduled',
    type: NotificationType.COURSE,
    titleTemplate: '수업 일정 변경',
    bodyTemplate: '{{courseName}} 수업 일정이 {{oldDate}} {{oldTime}}에서 {{newDate}} {{newTime}}으로 변경되었습니다.',
    description: '수업 일정 변경 알림을 위한 템플릿',
    category: '수업'
  },
  'course_feedback': {
    id: 'course_feedback',
    type: NotificationType.COURSE,
    titleTemplate: '수업 피드백 요청',
    bodyTemplate: '{{courseName}} 수업에 대한 피드백을 남겨주세요. 더 나은 서비스를 위해 소중한 의견을 기다립니다.',
    description: '수업 피드백 요청 알림을 위한 템플릿',
    category: '수업'
  },
  
  // 결제 관련 알림 템플릿
  'payment_success': {
    id: 'payment_success',
    type: NotificationType.PAYMENT,
    titleTemplate: '결제 완료',
    bodyTemplate: '{{amount}}원 결제가 성공적으로 완료되었습니다. 결제 정보: {{paymentInfo}}',
    description: '결제 완료 알림을 위한 템플릿',
    category: '결제'
  },
  'payment_failed': {
    id: 'payment_failed',
    type: NotificationType.PAYMENT,
    titleTemplate: '결제 실패',
    bodyTemplate: '결제 처리 중 오류가 발생했습니다. 오류 내용: {{errorMessage}}',
    description: '결제 실패 알림을 위한 템플릿',
    category: '결제'
  },
  'subscription_expiring': {
    id: 'subscription_expiring',
    type: NotificationType.PAYMENT,
    titleTemplate: '구독 만료 예정',
    bodyTemplate: '회원님의 구독이 {{expiryDate}}에 만료될 예정입니다. 지금 갱신하세요.',
    description: '구독 만료 예정 알림을 위한 템플릿',
    category: '결제'
  },
  'receipt': {
    id: 'receipt',
    type: NotificationType.PAYMENT,
    titleTemplate: '영수증 발행',
    bodyTemplate: '{{date}} 결제에 대한 영수증이 발행되었습니다. 마이페이지에서 확인하세요.',
    description: '영수증 발행 알림을 위한 템플릿',
    category: '결제'
  },
  
  // 마케팅 관련 알림 템플릿
  'promotion': {
    id: 'promotion',
    type: NotificationType.MARKETING,
    titleTemplate: '특별 할인 이벤트',
    bodyTemplate: '{{discountRate}} 할인! {{eventName}} 이벤트가 {{endDate}}까지 진행됩니다.',
    description: '할인 이벤트 알림을 위한 템플릿',
    category: '마케팅'
  },
  'new_course': {
    id: 'new_course',
    type: NotificationType.MARKETING,
    titleTemplate: '새로운 강좌 오픈',
    bodyTemplate: '새로운 강좌 "{{courseName}}"가 오픈되었습니다. {{instructorName}} 강사님과 함께하는 특별한 수업을 만나보세요.',
    description: '새 강좌 알림을 위한 템플릿',
    category: '마케팅'
  },
  'event_invitation': {
    id: 'event_invitation',
    type: NotificationType.MARKETING,
    titleTemplate: '이벤트 초대',
    bodyTemplate: '{{eventName}} 이벤트에 초대합니다. 일시: {{date}} {{time}}, 장소: {{location}}',
    description: '이벤트 초대 알림을 위한 템플릿',
    category: '마케팅'
  }
};

// 템플릿 조회 함수
export function getTemplate(templateId: string): NotificationTemplate | undefined {
  return templates[templateId];
}

// 템플릿 목록 조회 함수
export function getAllTemplates(): NotificationTemplate[] {
  return Object.values(templates);
}

// 특정 유형의 템플릿 목록 조회 함수
export function getTemplatesByType(type: NotificationType): NotificationTemplate[] {
  return Object.values(templates).filter(template => template.type === type);
}

// 특정 카테고리의 템플릿 목록 조회 함수
export function getTemplatesByCategory(category: string): NotificationTemplate[] {
  return Object.values(templates).filter(template => template.category === category);
}

// 템플릿을 사용하여 알림 내용 생성 함수
export function generateNotificationContent(
  templateId: string, 
  variables: TemplateVariables
): { title: string; body: string } | null {
  const template = getTemplate(templateId);
  
  if (!template) {
    return null;
  }
  
  return {
    title: applyTemplate(template.titleTemplate, variables),
    body: applyTemplate(template.bodyTemplate, variables)
  };
}

// 템플릿 시스템 초기화 메시지
console.log('[NotificationTemplates] 알림 템플릿 시스템 초기화 완료');