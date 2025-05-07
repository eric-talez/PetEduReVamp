import { toast } from "@/hooks/use-toast";

/**
 * 화상 수업 상태 타입
 */
export type ClassStatus = 'open' | 'full' | 'closed' | 'completed' | 'cancelled';

/**
 * 화상 수업 정보 타입
 */
export interface VideoClass {
  id: number;
  title: string;
  trainer: string;
  trainerId: number;
  price: number;
  duration: number;
  rating?: number;
  reviews?: number;
  image: string;
  trainerImage?: string;
  tags: string[];
  description: string;
  availability: string;
  status: ClassStatus;
  seatsTotal: number;
  seatsBooked: number;
  nextSession: string;
  // 추가 필드
  createdAt?: string;
  updatedAt?: string;
  minParticipants?: number;
  cancellationDeadline?: string;
  isAutoCancelEnabled?: boolean;
}

/**
 * 화상 수업 예약 정보
 */
export interface ClassReservation {
  id: number;
  classId: number;
  userId: number;
  userName: string;
  reservationDate: string;
  reservationTime: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  createdAt: string;
}

/**
 * 수업 자동 취소 상태 점검
 * 수업 시작 전 최소 참가자 수에 미달하는 경우 자동 취소
 */
export function checkForAutoCancellation(videoClass: VideoClass): boolean {
  // 이미 취소된 클래스는 처리하지 않음
  if (videoClass.status === 'cancelled' || videoClass.status === 'completed') {
    return false;
  }
  
  // 자동 취소 설정이 없거나 비활성화된 경우
  if (videoClass.isAutoCancelEnabled === false) {
    return false;
  }
  
  // 최소 참가자 수가 설정되지 않은 경우 기본값 1 사용
  const minParticipants = videoClass.minParticipants || 1;
  
  // 현재 예약자 수가 최소 참가자 수보다 적으면 취소
  if (videoClass.seatsBooked < minParticipants) {
    // 취소 처리 로직 (실제로는 API 호출 등으로 처리)
    console.log(`클래스 ${videoClass.id} 자동 취소: 최소 참가자 수(${minParticipants}명) 미달`);
    
    // 알림 표시
    toast({
      title: "화상 수업 자동 취소",
      description: `'${videoClass.title}' 수업이 최소 참가 인원(${minParticipants}명) 미달로 자동 취소되었습니다.`,
      variant: "destructive",
    });
    
    return true; // 취소됨
  }
  
  return false; // 취소되지 않음
}

/**
 * 취소된 수업의 예약자들에게 환불 처리
 */
export function processRefundsForCancelledClass(classId: number): void {
  // 실제 구현에서는 해당 수업의 모든 예약자를 찾아 환불 처리
  // API 호출 등의 로직이 들어가야 함
  console.log(`클래스 ID ${classId}의 모든 예약자에게 환불 처리 중...`);
  
  // 성공 메시지
  toast({
    title: "환불 처리 완료",
    description: "취소된 수업의 모든 예약자에게 환불 처리가 완료되었습니다.",
  });
}

/**
 * 예약 가능한 화상 수업 목록 필터링
 */
export function getAvailableVideoClasses(classes: VideoClass[]): VideoClass[] {
  return classes.filter(cls => cls.status === 'open');
}

/**
 * 날짜별 화상 수업 그룹화
 */
export function groupClassesByDate(classes: VideoClass[]): Record<string, VideoClass[]> {
  const grouped: Record<string, VideoClass[]> = {};
  
  classes.forEach(cls => {
    const date = new Date(cls.nextSession).toLocaleDateString('ko-KR');
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(cls);
  });
  
  return grouped;
}

/**
 * 자동 취소 로직을 실행하는 함수
 * 서버에서 정기적으로 실행되어야 하지만, 프론트엔드 데모를 위해 클라이언트에 구현
 */
export function runAutoClassCancellationCheck(classes: VideoClass[]): VideoClass[] {
  const updatedClasses = [...classes];
  
  // 모든 수업에 대해 자동 취소 조건 확인
  updatedClasses.forEach((cls, index) => {
    // 자동 취소 조건 확인
    if (checkForAutoCancellation(cls)) {
      // 취소된 수업으로 상태 업데이트
      updatedClasses[index] = {
        ...cls,
        status: 'cancelled'
      };
      
      // 취소된 수업의 예약자에게 환불 처리 (실제 구현에서는 서버에서 처리)
      processRefundsForCancelledClass(cls.id);
    }
  });
  
  return updatedClasses;
}