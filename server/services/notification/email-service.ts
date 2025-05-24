/**
 * SendGrid API를 활용한 이메일 발송 서비스
 */
import sgMail from '@sendgrid/mail';
import { NotificationType, NotificationTemplateType } from './notification-types';

// SendGrid API 키 설정
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

// 이메일 발송 옵션 인터페이스
export interface EmailOptions {
  to: string;
  type: NotificationType;
  data: Record<string, any>;
  attachments?: Array<{
    content: string;
    filename: string;
    type?: string;
    disposition?: 'attachment' | 'inline';
    contentId?: string;
  }>;
}

// 이메일 서비스 클래스
class EmailService {
  private isEnabled: boolean;
  private defaultFrom: string;

  constructor() {
    this.isEnabled = !!SENDGRID_API_KEY;
    this.defaultFrom = 'noreply@talez.com';
    
    if (!this.isEnabled) {
      console.warn('SendGrid API 키가 설정되지 않았습니다. 이메일 발송이 비활성화됩니다.');
    }
  }

  /**
   * 이메일을 발송합니다.
   * @param options 이메일 발송 옵션
   */
  async send(options: EmailOptions): Promise<void> {
    if (!this.isEnabled) {
      console.log('이메일 발송 건너뜀 (API 키 없음):', options);
      return;
    }

    try {
      // 알림 유형에 따른 템플릿 선택
      const template = this.getTemplateForType(options.type);
      
      // 이메일 템플릿 데이터 준비
      const templateData = this.prepareTemplateData(options.type, options.data);
      
      // 이메일 메시지 구성
      const msg = {
        to: options.to,
        from: this.defaultFrom,
        subject: templateData.subject,
        templateId: template.id,
        dynamicTemplateData: templateData,
        attachments: options.attachments
      };

      // 이메일 발송
      await sgMail.send(msg);
      console.log(`이메일 발송 성공: ${options.to}, 유형: ${options.type}`);
    } catch (error) {
      console.error('이메일 발송 실패:', error);
      throw new Error(`이메일 발송 실패: ${(error as Error).message}`);
    }
  }

  /**
   * 알림 유형에 따른 이메일 템플릿을 가져옵니다.
   */
  private getTemplateForType(type: NotificationType): { id: string; name: string } {
    // 알림 유형에 따른 이메일 템플릿 매핑
    const templateMap: Record<NotificationType, { id: string; name: string }> = {
      [NotificationType.SYSTEM]: {
        id: 'd-system-notification-template-id',
        name: 'System Notification'
      },
      [NotificationType.MESSAGE]: {
        id: 'd-message-notification-template-id',
        name: 'Message Notification'
      },
      [NotificationType.COURSE]: {
        id: 'd-course-notification-template-id',
        name: 'Course Notification'
      },
      [NotificationType.PAYMENT]: {
        id: 'd-payment-notification-template-id',
        name: 'Payment Notification'
      },
      [NotificationType.MARKETING]: {
        id: 'd-marketing-notification-template-id',
        name: 'Marketing Notification'
      },
      [NotificationType.NOTEBOOK]: {
        id: 'd-notebook-notification-template-id',
        name: 'Notebook Notification'
      },
      [NotificationType.REVIEW]: {
        id: 'd-review-notification-template-id',
        name: 'Review Notification'
      },
      [NotificationType.COMMENT]: {
        id: 'd-comment-notification-template-id',
        name: 'Comment Notification'
      },
      [NotificationType.VIDEO_CALL]: {
        id: 'd-video-call-notification-template-id',
        name: 'Video Call Notification'
      },
      [NotificationType.TRAINING]: {
        id: 'd-training-notification-template-id',
        name: 'Training Notification'
      }
    };

    return templateMap[type] || templateMap[NotificationType.SYSTEM];
  }

  /**
   * 템플릿에 필요한 데이터를 준비합니다.
   */
  private prepareTemplateData(type: NotificationType, data: Record<string, any>): Record<string, any> {
    // 기본 템플릿 데이터
    const baseData = {
      subject: data.title || '알림',
      title: data.title || '알림',
      message: data.message || '',
      date: new Date().toLocaleDateString('ko-KR'),
      app_name: 'Talez',
      year: new Date().getFullYear().toString()
    };

    // 알림 유형별 추가 데이터
    switch (type) {
      case NotificationType.PAYMENT:
        return {
          ...baseData,
          subject: `[Talez] 결제 알림: ${data.title || '결제 정보'}`,
          payment_amount: data.amount,
          payment_date: data.paymentDate || baseData.date,
          payment_method: data.paymentMethod || '카드',
          order_id: data.orderId || ''
        };
      
      case NotificationType.COURSE:
        return {
          ...baseData,
          subject: `[Talez] 강좌 알림: ${data.title || '강좌 정보'}`,
          course_name: data.courseName || '',
          course_date: data.courseDate || '',
          trainer_name: data.trainerName || '',
          location: data.location || '온라인'
        };
      
      case NotificationType.VIDEO_CALL:
        return {
          ...baseData,
          subject: `[Talez] 화상 수업 알림: ${data.title || '수업 정보'}`,
          meeting_url: data.meetingUrl || '',
          meeting_time: data.meetingTime || '',
          meeting_duration: data.meetingDuration || '60분'
        };
      
      default:
        return {
          ...baseData,
          subject: `[Talez] ${data.title || '알림'}`
        };
    }
  }

  /**
   * 환영 이메일을 발송합니다.
   */
  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    return this.send({
      to: email,
      type: NotificationType.SYSTEM,
      data: {
        title: 'Talez 가입을 환영합니다!',
        message: `안녕하세요, ${name}님! Talez 가입을 환영합니다. 반려견 교육의 새로운 경험을 시작해보세요.`,
        name: name
      }
    });
  }

  /**
   * 비밀번호 재설정 이메일을 발송합니다.
   */
  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.BASE_URL || 'https://talez.com'}/reset-password?token=${resetToken}`;
    
    return this.send({
      to: email,
      type: NotificationType.SYSTEM,
      data: {
        title: '비밀번호 재설정 요청',
        message: '비밀번호 재설정을 요청하셨습니다. 아래 링크를 클릭하여 비밀번호를 재설정하세요.',
        reset_url: resetUrl,
        expires_in: '24시간'
      }
    });
  }

  /**
   * 이메일 인증 메일을 발송합니다.
   */
  async sendVerificationEmail(email: string, verificationToken: string): Promise<void> {
    const verificationUrl = `${process.env.BASE_URL || 'https://talez.com'}/verify-email?token=${verificationToken}`;
    
    return this.send({
      to: email,
      type: NotificationType.SYSTEM,
      data: {
        title: '이메일 주소 인증',
        message: 'Talez 계정에 등록한 이메일 주소를 인증해주세요. 아래 링크를 클릭하여 인증을 완료하세요.',
        verification_url: verificationUrl,
        expires_in: '24시간'
      }
    });
  }

  /**
   * 결제 영수증 이메일을 발송합니다.
   */
  async sendPaymentReceiptEmail(email: string, paymentData: {
    orderId: string;
    amount: number;
    paymentDate: string;
    items: Array<{ name: string; price: number; quantity: number; }>
  }): Promise<void> {
    return this.send({
      to: email,
      type: NotificationType.PAYMENT,
      data: {
        title: '결제가 완료되었습니다',
        message: `주문 번호 ${paymentData.orderId}에 대한 결제가 완료되었습니다.`,
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        paymentDate: paymentData.paymentDate,
        items: paymentData.items
      }
    });
  }
}

// 싱글톤 인스턴스 생성
export const emailService = new EmailService();