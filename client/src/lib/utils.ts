import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 클래스명 병합 유틸리티 함수
 * clsx와 tailwind-merge를 결합하여 Tailwind 클래스를 효율적으로 관리
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 숫자 포맷팅 유틸리티
 * 숫자를 통화 형식으로 변환 (예: 1000 -> ₩1,000)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * 날짜 포맷팅 유틸리티
 * Date 객체를 한국 날짜 형식으로 변환 (예: 2023-01-01 -> 2023년 1월 1일)
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * 시간 포맷팅 유틸리티
 * Date 객체를 한국 시간 형식으로 변환 (예: 14:30:00 -> 오후 2시 30분)
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
}

/**
 * 날짜 및 시간 포맷팅 유틸리티
 * Date 객체를 한국 날짜 및 시간 형식으로 변환
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${formatDate(d)} ${formatTime(d)}`;
}

/**
 * 문자열 자르기 유틸리티
 * 긴 문자열을 지정된 길이로 자르고 말줄임표 추가
 */
export function truncateString(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * 랜덤 ID 생성 유틸리티
 * 고유한 ID 문자열 생성
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * 딜레이 유틸리티
 * 지정된 시간(ms) 동안 대기
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 문자열에서 HTML 태그 제거
 * 보안상의 이유로 HTML 문자열에서 태그 제거
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, '');
}

/**
 * 객체에서 null 또는 undefined 값을 가진 속성 제거
 */
export function removeEmptyValues<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null)
  ) as Partial<T>;
}

/**
 * 로컬 스토리지 래퍼 함수
 * 로컬 스토리지에 JSON 데이터 저장 및 불러오기
 */
export const storage = {
  get<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('로컬 스토리지 저장 오류:', error);
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('로컬 스토리지 삭제 오류:', error);
    }
  }
};

/**
 * 이름이나 문자열에서 이니셜 추출
 * 예: "홍길동" -> "홍", "John Doe" -> "JD"
 */
export function getInitials(name: string): string {
  if (!name) return '';
  
  // 공백으로 이름 분리
  const nameParts = name.split(' ');
  
  // 단일 단어인 경우 (한글 이름 등)
  if (nameParts.length === 1) {
    return name.charAt(0);
  }
  
  // 여러 단어인 경우 각 단어의 첫 글자 결합
  return nameParts
    .filter(part => part.length > 0)
    .map(part => part.charAt(0))
    .join('')
    .substring(0, 2); // 최대 2글자로 제한
}