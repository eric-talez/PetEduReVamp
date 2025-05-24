/**
 * 알림 시스템 관련 열거형 및 타입 정의
 */

// 알림 유형
export enum NotificationType {
  SYSTEM = 'system',         // 시스템 알림 (점검, 업데이트 등)
  MESSAGE = 'message',       // 메시지 알림 (채팅, 쪽지 등)
  COURSE = 'course',         // 강좌 관련 알림 (새 강좌, 일정 변경 등)
  PAYMENT = 'payment',       // 결제 관련 알림 (결제 완료, 환불 등)
  MARKETING = 'marketing',   // 마케팅 알림 (이벤트, 프로모션 등)
  NOTEBOOK = 'notebook',     // 알림장 관련 알림
  REVIEW = 'review',         // 리뷰 관련 알림
  COMMENT = 'comment',       // 댓글 관련 알림
  VIDEO_CALL = 'video_call', // 화상 수업 관련 알림
  TRAINING = 'training'      // 훈련 진행 상황 알림
}

// 알림 채널
export enum NotificationChannel {
  WEB = 'web',               // 웹 알림 (웹 앱 내부)
  EMAIL = 'email',           // 이메일 알림
  PUSH = 'push'              // 모바일 푸시 알림
}

// 알림 우선순위
export enum NotificationPriority {
  LOW = 'low',               // 낮은 우선순위 (마케팅 등)
  NORMAL = 'normal',         // 일반 우선순위 (대부분의 알림)
  HIGH = 'high',             // 높은 우선순위 (중요 알림)
  URGENT = 'urgent'          // 긴급 우선순위 (결제, 보안 등)
}

// 알림 템플릿 타입
export enum NotificationTemplateType {
  // 이메일 템플릿
  EMAIL_WELCOME = 'email_welcome',                    // 회원 가입 환영
  EMAIL_PASSWORD_RESET = 'email_password_reset',      // 비밀번호 재설정
  EMAIL_VERIFICATION = 'email_verification',          // 이메일 인증
  EMAIL_COURSE_ENROLLMENT = 'email_course_enrollment',// 강좌 등록
  EMAIL_PAYMENT_RECEIPT = 'email_payment_receipt',    // 결제 영수증
  EMAIL_NOTIFICATION = 'email_notification',          // 일반 알림
  
  // 푸시 알림 템플릿
  PUSH_MESSAGE = 'push_message',                      // 메시지 알림
  PUSH_COURSE_REMINDER = 'push_course_reminder',      // 강좌 일정 알림
  PUSH_SYSTEM = 'push_system',                        // 시스템 알림
  
  // 웹 알림 템플릿
  WEB_NOTIFICATION = 'web_notification'               // 웹 알림
}