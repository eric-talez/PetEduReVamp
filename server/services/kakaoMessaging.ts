/**
 * 카카오톡 비즈니스 메시징 서비스
 * 알림장 전송을 위한 카카오톡 메시지 발송 기능
 */

interface KakaoMessageTemplate {
  title: string;
  content: string;
  studentName: string;
  petName: string;
  trainingDate: string;
  progressRating: number;
  trainerName: string;
}

interface KakaoMessageResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class KakaoMessagingService {
  private readonly apiKey: string;
  private readonly templateCode: string;
  private readonly senderKey: string;
  private readonly baseUrl = 'https://alimtalk-api.bizmsg.kr/v2/sender/send';

  constructor() {
    this.apiKey = process.env.KAKAO_API_KEY || '';
    this.templateCode = process.env.KAKAO_TEMPLATE_CODE || 'NOTEBOOK_001';
    this.senderKey = process.env.KAKAO_SENDER_KEY || '';
    
    if (!this.apiKey || !this.senderKey) {
      console.warn('⚠️ 카카오 API 키가 설정되지 않았습니다. 메시지 발송이 비활성화됩니다.');
    }
  }

  /**
   * 알림장 완료 메시지 템플릿 생성
   */
  private createNotebookTemplate(data: KakaoMessageTemplate): string {
    const stars = '⭐'.repeat(data.progressRating);
    
    return `
🐕 **${data.petName} 훈련 알림장**

안녕하세요, ${data.studentName}님!
${data.trainerName} 훈련사입니다.

📅 **훈련일**: ${data.trainingDate}
📊 **진도평가**: ${stars} (${data.progressRating}/5)

📝 **${data.title}**

${data.content}

언제든 궁금한 점이 있으시면 연락주세요!
감사합니다. 🙏

---
TALEZ 반려동물 교육 플랫폼
    `.trim();
  }

  /**
   * 카카오톡 알림톡 메시지 전송 (전화번호 기반)
   */
  async sendNotebookMessage(
    phoneNumber: string, 
    messageData: KakaoMessageTemplate
  ): Promise<KakaoMessageResponse> {
    try {
      if (!this.apiKey || !this.senderKey) {
        console.error('📱 [KakaoMsg] 카카오톡 API 키가 설정되지 않았습니다.');
        
        return {
          success: false,
          error: 'Kakao API 키가 설정되지 않았습니다. 관리자에게 문의하세요.',
        };
      }

      const messageContent = this.createNotebookTemplate(messageData);
      
      // 카카오톡 알림톡 API 요청 구조
      const requestBody = {
        senderKey: this.senderKey,
        templateCode: this.templateCode,
        requestDate: new Date().toISOString(),
        recipientList: [
          {
            recipientNo: phoneNumber, // 수신자 전화번호 (E.164 형식)
            templateParameter: {
              studentName: messageData.studentName,
              petName: messageData.petName,
              trainingDate: messageData.trainingDate,
              title: messageData.title,
              content: messageData.content.substring(0, 1000), // 알림톡 길이 제한
              progressRating: '⭐'.repeat(messageData.progressRating),
              trainerName: messageData.trainerName
            }
          }
        ]
      };

      console.log('📱 [KakaoMsg] 알림톡 전송 시작:', {
        recipient: phoneNumber?.substring(0, 3) + '***',
        templateCode: this.templateCode,
        title: messageData.title
      });

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`카카오 API 오류: ${response.status} - ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      
      console.log('📱 [KakaoMsg] 전송 성공:', {
        messageId: result.message_id,
        recipient: phoneNumber?.substring(0, 3) + '***'
      });

      return {
        success: true,
        messageId: result.message_id,
      };

    } catch (error) {
      console.error('📱 [KakaoMsg] 전송 실패:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다',
      };
    }
  }

  /**
   * 전화번호 유효성 검사 (E.164 형식)
   */
  isValidPhoneNumber(phoneNumber: string): boolean {
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return false;
    }
    
    // E.164 형식: +821012345678 또는 01012345678
    const phonePattern = /^(\+82|82|0)?1[0-9]{8,9}$/;
    return phonePattern.test(phoneNumber.replace(/[^+0-9]/g, ''));
  }

  /**
   * 전화번호를 E.164 형식으로 정규화
   */
  normalizePhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/[^+0-9]/g, '');
    
    if (cleaned.startsWith('+82')) return cleaned;
    if (cleaned.startsWith('82')) return '+' + cleaned;
    if (cleaned.startsWith('010')) return '+82' + cleaned.substring(1);
    if (cleaned.startsWith('01')) return '+82' + cleaned.substring(1);
    
    return cleaned;
  }

  /**
   * 메시지 발송 가능 여부 확인
   */
  isMessagingEnabled(): boolean {
    return !!(this.apiKey && this.senderKey);
  }

  /**
   * 테스트 메시지 전송
   */
  async sendTestMessage(phoneNumber: string): Promise<KakaoMessageResponse> {
    const testData: KakaoMessageTemplate = {
      title: '카카오톡 연동 테스트',
      content: '카카오톡 메시지 연동이 정상적으로 작동합니다. 앞으로 훈련 알림장을 이 방법으로 받으실 수 있습니다.',
      studentName: '테스트 사용자',
      petName: '테스트',
      trainingDate: new Date().toLocaleDateString('ko-KR'),
      progressRating: 5,
      trainerName: 'TALEZ 시스템'
    };

    return this.sendNotebookMessage(phoneNumber, testData);
  }
}

// 싱글톤 인스턴스 생성
export const kakaoMessaging = new KakaoMessagingService();