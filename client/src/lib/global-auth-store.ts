/**
 * global-auth-store.ts
 * 
 * 모든 컴포넌트에서 일관된 인증 상태를 공유하기 위한 전역 상태 저장소
 * - localStorage와 동기화
 * - 이벤트 발행/구독 패턴으로 실시간 상태 공유
 */

// shared/schema.ts의 UserRole 타입 사용 (타입 일관성 유지)
import { UserRole } from '@shared/schema';

// 인증 상태 인터페이스
export interface AuthState {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  userName: string | null;
}

// 기본 상태
const defaultState: AuthState = {
  isAuthenticated: false,
  userRole: null,
  userName: null
};

// 이벤트 이름 상수화
const AUTH_CHANGE_EVENT = 'petedu-auth-global-change';
const STORAGE_KEY = 'petedu_auth';

// 구독자 콜백 타입
type AuthListener = (state: AuthState) => void;

// 전역 상태 관리 클래스
class AuthStore {
  private _state: AuthState;
  private _listeners: Set<AuthListener> = new Set();

  constructor() {
    this._state = this.loadFromStorage() || { ...defaultState };
    
    // 다른 탭/창에서의 변경 감지
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        this.syncFromStorage();
      }
    });
    
    // 윈도우 전역 객체에 접근 가능하도록 설정 (웹뷰 통신용)
    this.updateGlobalState();
    
    console.log('[GlobalAuth] 초기화 완료:', this._state);
  }
  
  // 현재 상태 가져오기
  get state(): AuthState {
    return { ...this._state };
  }
  
  // 상태 변경하기
  setState(newState: Partial<AuthState>): void {
    const updatedState = { ...this._state, ...newState };
    this._state = updatedState;
    
    // 로컬 스토리지에 저장
    this.saveToStorage(updatedState);
    
    // 전역 객체 업데이트
    this.updateGlobalState();
    
    // 이벤트 발행
    this.notifyListeners();
    
    console.log('[GlobalAuth] 상태 변경:', updatedState);
  }
  
  // 로그인 처리
  login(role: UserRole, name: string): void {
    this.setState({
      isAuthenticated: true,
      userRole: role,
      userName: name
    });
  }
  
  // 로그아웃 처리
  logout(): void {
    this.setState({
      isAuthenticated: false,
      userRole: null,
      userName: null
    });
    
    // 로컬 스토리지에서 삭제
    localStorage.removeItem(STORAGE_KEY);
  }
  
  // 이벤트 구독
  subscribe(listener: AuthListener): () => void {
    this._listeners.add(listener);
    
    // 구독 시점에 현재 상태 즉시 전달
    listener(this.state);
    
    // 구독 해제 함수 반환
    return () => {
      this._listeners.delete(listener);
    };
  }
  
  // 구독자들에게 상태 변경 알림
  private notifyListeners(): void {
    const currentState = this.state;
    this._listeners.forEach(listener => {
      try {
        listener(currentState);
      } catch (error) {
        console.error('[GlobalAuth] 리스너 호출 오류:', error);
      }
    });
    
    // DOM 이벤트로도 발행 (컴포넌트 외부 호환용)
    const event = new CustomEvent(AUTH_CHANGE_EVENT, {
      detail: currentState
    });
    window.dispatchEvent(event);
  }
  
  // 로컬 스토리지에서 데이터 로드
  private loadFromStorage(): AuthState | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      
      const parsed = JSON.parse(stored);
      
      // 필요한 키가 있는지 검증
      if (parsed && (parsed.role || parsed.userRole)) {
        return {
          isAuthenticated: true,
          userRole: parsed.role || parsed.userRole,
          userName: parsed.name || parsed.userName
        };
      }
      
      return null;
    } catch (error) {
      console.error('[GlobalAuth] 스토리지 로드 오류:', error);
      return null;
    }
  }
  
  // 로컬 스토리지에 데이터 저장
  private saveToStorage(state: AuthState): void {
    if (!state.isAuthenticated) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    
    try {
      // 역호환성을 위해 두 가지 형태로 저장
      const storageData = {
        role: state.userRole,
        name: state.userName,
        userRole: state.userRole,  // 역호환성
        userName: state.userName   // 역호환성
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
    } catch (error) {
      console.error('[GlobalAuth] 스토리지 저장 오류:', error);
    }
  }
  
  // 로컬 스토리지에서 상태 동기화
  private syncFromStorage(): void {
    const storedState = this.loadFromStorage();
    if (storedState) {
      this._state = storedState;
      this.updateGlobalState();
      this.notifyListeners();
    } else {
      this._state = { ...defaultState };
      this.updateGlobalState();
      this.notifyListeners();
    }
  }
  
  // 전역 객체에 인증 상태 노출 (웹뷰 통신용)
  private updateGlobalState(): void {
    window.__peteduAuthState = {
      isAuthenticated: this._state.isAuthenticated,
      userRole: this._state.userRole,
      userName: this._state.userName
    };
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
export const authStore = new AuthStore();

// 글로벌 타입 확장 (Window 객체에 추가 프로퍼티 정의)
declare global {
  interface Window {
    __peteduAuthState?: {
      isAuthenticated: boolean;
      userRole: string | null;
      userName: string | null;
    };
  }
}

// 이벤트 핸들러 등록 함수 제공
export function initGlobalAuthListener(): void {
  // 기존 이벤트 리스너와 호환
  window.addEventListener('login', (e: Event) => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail) {
      const role = customEvent.detail.role || customEvent.detail.userRole;
      const name = customEvent.detail.name || customEvent.detail.userName;
      
      if (role && name) {
        console.log('[GlobalAuth] login 이벤트 처리:', { role, name });
        authStore.login(role, name);
      }
    }
  });
  
  window.addEventListener('logout', () => {
    console.log('[GlobalAuth] logout 이벤트 처리');
    authStore.logout();
  });
}