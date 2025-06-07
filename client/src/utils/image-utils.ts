
/**
 * 이미지 관련 유틸리티 함수들
 */

export interface ImageLoadOptions {
  fallbackSrc?: string;
  maxRetries?: number;
  retryDelay?: number;
}

/**
 * 이미지 로딩 상태를 확인하는 함수
 */
export const checkImageExists = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
};

/**
 * 기본 아바타 이미지 URL 생성
 */
export const generateDefaultAvatar = (name: string, backgroundColor = '6366f1'): string => {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=${backgroundColor}&textColor=ffffff`;
};

/**
 * 이미지 URL 유효성 검사 및 대체 이미지 반환
 */
export const getValidImageUrl = async (
  src: string | undefined, 
  fallbackName: string,
  options: ImageLoadOptions = {}
): Promise<string> => {
  const { fallbackSrc, maxRetries = 1 } = options;
  
  if (!src) {
    return fallbackSrc || generateDefaultAvatar(fallbackName);
  }
  
  // URL이 이미 기본 아바타인 경우 그대로 반환
  if (src.includes('dicebear.com')) {
    return src;
  }
  
  const isValid = await checkImageExists(src);
  if (isValid) {
    return src;
  }
  
  // 재시도 로직
  if (maxRetries > 0) {
    await new Promise(resolve => setTimeout(resolve, options.retryDelay || 1000));
    return getValidImageUrl(src, fallbackName, { ...options, maxRetries: maxRetries - 1 });
  }
  
  return fallbackSrc || generateDefaultAvatar(fallbackName);
};

/**
 * 이미지 프리로딩
 */
export const preloadImages = (urls: string[]): Promise<void[]> => {
  return Promise.all(
    urls.map(url => 
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // 에러가 나도 계속 진행
        img.src = url;
      })
    )
  );
};

/**
 * 반응형 이미지 URL 생성 (다양한 크기)
 */
export const generateResponsiveImageUrls = (baseUrl: string): Record<string, string> => {
  const sizes = ['small', 'medium', 'large'];
  const urls: Record<string, string> = {};
  
  sizes.forEach(size => {
    urls[size] = baseUrl.replace(/\.(jpg|jpeg|png|webp)$/i, `-${size}.$1`);
  });
  
  return urls;
};
