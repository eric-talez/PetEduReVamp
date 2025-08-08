// 클라이언트 보안 유틸리티

// XSS 방지를 위한 문자열 이스케이프
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 안전한 HTML 파싱
export function sanitizeHtml(html: string): string {
  const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const allowedAttributes = ['class', 'id'];
  
  // 기본적인 태그 및 속성 화이트리스트 적용
  let sanitized = html;
  
  // 스크립트 태그 완전 제거
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // 이벤트 핸들러 속성 제거
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // javascript: 프로토콜 제거
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  return sanitized;
}

// URL 검증
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

// 안전한 외부 링크 열기
export function openSafeExternalLink(url: string): void {
  if (!isValidUrl(url)) {
    console.warn('Invalid URL provided:', url);
    return;
  }
  
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.click();
}

// CSRF 토큰 관리
class CSRFTokenManager {
  private token: string | null = null;
  
  getToken(): string | null {
    if (!this.token) {
      // 메타 태그에서 CSRF 토큰 읽기
      const metaTag = document.querySelector('meta[name="csrf-token"]');
      this.token = metaTag ? metaTag.getAttribute('content') : null;
    }
    return this.token;
  }
  
  setToken(token: string): void {
    this.token = token;
  }
  
  addToHeaders(headers: Record<string, string>): Record<string, string> {
    const token = this.getToken();
    if (token) {
      return {
        ...headers,
        'X-CSRF-Token': token
      };
    }
    return headers;
  }
}

export const csrfManager = new CSRFTokenManager();

// 안전한 로컬 스토리지 래퍼
class SecureStorage {
  private prefix = 'talez_';
  
  set(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify({
        data: value,
        timestamp: Date.now(),
        checksum: this.generateChecksum(value)
      });
      localStorage.setItem(this.prefix + key, serializedValue);
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }
  
  get(key: string): any {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      const { data, timestamp, checksum } = parsed;
      
      // 체크섬 검증
      if (this.generateChecksum(data) !== checksum) {
        console.warn('Data integrity check failed for key:', key);
        this.remove(key);
        return null;
      }
      
      // 만료 시간 체크 (7일)
      if (Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000) {
        this.remove(key);
        return null;
      }
      
      return data;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return null;
    }
  }
  
  remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }
  
  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
  
  private generateChecksum(data: any): string {
    // 간단한 체크섬 생성 (실제 환경에서는 더 강력한 해시 사용)
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 32비트 정수로 변환
    }
    return hash.toString();
  }
}

export const secureStorage = new SecureStorage();

// 입력값 검증
export function validateInput(input: string, type: 'email' | 'phone' | 'name' | 'password'): boolean {
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/,
    name: /^[가-힣a-zA-Z\s]{2,20}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  };
  
  return patterns[type].test(input);
}

// 민감한 정보 마스킹
export function maskSensitiveInfo(value: string, type: 'email' | 'phone' | 'card'): string {
  switch (type) {
    case 'email':
      const [local, domain] = value.split('@');
      if (local.length <= 2) return value;
      return local.substring(0, 2) + '*'.repeat(local.length - 2) + '@' + domain;
      
    case 'phone':
      return value.replace(/(\d{3})-?(\d{4})-?(\d{4})/, '$1-****-$3');
      
    case 'card':
      return value.replace(/(\d{4})\s?(\d{4})\s?(\d{4})\s?(\d{4})/, '$1-****-****-$4');
      
    default:
      return value;
  }
}

// 세션 보안 관리
class SessionManager {
  private lastActivity: number = Date.now();
  private sessionTimeout: number = 30 * 60 * 1000; // 30분
  
  updateActivity(): void {
    this.lastActivity = Date.now();
  }
  
  isSessionValid(): boolean {
    return Date.now() - this.lastActivity < this.sessionTimeout;
  }
  
  getTimeUntilExpiry(): number {
    const timeLeft = this.sessionTimeout - (Date.now() - this.lastActivity);
    return Math.max(0, timeLeft);
  }
  
  extendSession(): void {
    this.lastActivity = Date.now();
  }
  
  invalidateSession(): void {
    this.lastActivity = 0;
    secureStorage.clear();
  }
}

export const sessionManager = new SessionManager();

// 자동으로 사용자 활동 추적
if (typeof window !== 'undefined') {
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
  events.forEach(event => {
    document.addEventListener(event, () => {
      sessionManager.updateActivity();
    }, { passive: true });
  });
}

// 콘텐츠 보안 정책 헬퍼
export function addCSPMeta(): void {
  if (typeof document !== 'undefined') {
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://maps.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.stripe.com https://maps.googleapis.com",
      "frame-src 'self' https://js.stripe.com"
    ].join('; ');
    
    document.head.appendChild(cspMeta);
  }
}