import { Context, useContext, createContext } from 'react';

/**
 * Context 안전하게 사용하기 위한 유틸리티 함수
 * 
 * React Context를 사용할 때 Provider 없이 사용하는 실수를 방지합니다.
 * 컴포넌트가 적절한 Provider 내에서 사용되지 않으면 명확한 오류 메시지를 표시합니다.
 * 
 * @param context 사용할 React Context
 * @param contextName 콘텍스트 이름 (오류 메시지용)
 * @returns Context 값
 */
export function createSafeContext<T>(context: Context<T | null>, contextName: string) {
  return function useSafeContext(): T {
    const contextValue = useContext(context);
    
    if (contextValue === null || contextValue === undefined) {
      throw new Error(
        `use${contextName} must be used within a ${contextName}Provider`
      );
    }
    
    return contextValue;
  };
}

/**
 * Context 생성 헬퍼 함수
 * 
 * Context 및 관련된 Provider와 훅을 더 편리하게 생성합니다.
 * 디버깅에 유용한 표시 이름을 자동으로 설정합니다.
 * 
 * @param contextName Context 이름
 * @param defaultValue 기본값 (선택 사항)
 * @returns Context, Provider, 커스텀 훅이 포함된 객체
 */
export function createContextPackage<T>(contextName: string, defaultValue: T | null = null) {
  // Context 생성
  const Context = createContext<T | null>(defaultValue);
  
  // 디버깅을 위한 표시 이름 설정
  Context.displayName = `${contextName}Context`;
  
  // 안전한 훅 생성
  const useContextSafely = createSafeContext(Context, contextName);
  
  return {
    Context,
    Provider: Context.Provider,
    useContext: useContextSafely,
  };
}

/**
 * 사용 예시:
 * 
 * // 일반적인 사용법
 * const AuthContext = createContext<AuthContextType | null>(null);
 * export const useAuth = createSafeContext(AuthContext, 'Auth');
 * 
 * // 혹은 더 간단하게
 * export const { Context: CartContext, Provider: CartProvider, useContext: useCart } = 
 *   createContextPackage<CartContextType>('Cart');
 */