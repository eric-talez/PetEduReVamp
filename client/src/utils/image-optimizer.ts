/**
 * 이미지 최적화 유틸리티
 * WebP 지원, 압축, 리사이징 등을 담당
 */

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'webp' | 'png';
  progressive?: boolean;
}

export class ImageOptimizer {
  private static readonly DEFAULT_OPTIONS: ImageOptimizationOptions = {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.85,
    format: 'webp',
    progressive: true,
  };

  /**
   * WebP 지원 여부 확인
   */
  static supportsWebP(): Promise<boolean> {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  /**
   * AVIF 지원 여부 확인
   */
  static supportsAVIF(): Promise<boolean> {
    return new Promise((resolve) => {
      const avif = new Image();
      avif.onload = avif.onerror = () => {
        resolve(avif.height === 2);
      };
      avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    });
  }

  /**
   * 최적 이미지 포맷 결정
   */
  static async getOptimalImageFormat(originalSrc: string): Promise<string> {
    // URL에서 파일 확장자 추출
    const extension = originalSrc.split('.').pop()?.toLowerCase();
    
    // 이미 최적화된 포맷이면 그대로 반환
    if (extension === 'webp' || extension === 'avif') {
      return originalSrc;
    }

    // AVIF 지원 확인
    if (await this.supportsAVIF()) {
      return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.avif');
    }

    // WebP 지원 확인
    if (await this.supportsWebP()) {
      return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }

    return originalSrc;
  }

  /**
   * 반응형 이미지 소스셋 생성
   */
  static generateResponsiveImageSources(src: string): string {
    const baseSrc = src.replace(/\.[^/.]+$/, '');
    const extension = src.split('.').pop();
    
    const sizes = [480, 768, 1024, 1440, 1920];
    const sources = sizes.map(size => `${baseSrc}_${size}w.${extension} ${size}w`);
    
    return sources.join(', ');
  }

  /**
   * 이미지 압축 및 최적화
   */
  static async compressImage(
    file: File,
    options: Partial<ImageOptimizationOptions> = {}
  ): Promise<Blob> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      img.onload = () => {
        // 최적 크기 계산
        const { width, height } = this.calculateOptimalSize(
          img.width,
          img.height,
          opts.maxWidth!,
          opts.maxHeight!
        );

        canvas.width = width;
        canvas.height = height;

        // 고품질 렌더링 설정
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // 이미지 그리기
        ctx.drawImage(img, 0, 0, width, height);

        // 최적 포맷으로 변환
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          this.getMimeType(opts.format!),
          opts.quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * 최적 크기 계산
   */
  private static calculateOptimalSize(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    let width = originalWidth;
    let height = originalHeight;

    // 비율 유지하면서 크기 조정
    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }

    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }

    return {
      width: Math.floor(width),
      height: Math.floor(height),
    };
  }

  /**
   * MIME 타입 변환
   */
  private static getMimeType(format: string): string {
    switch (format) {
      case 'webp':
        return 'image/webp';
      case 'png':
        return 'image/png';
      case 'jpeg':
      default:
        return 'image/jpeg';
    }
  }

  /**
   * 이미지 프리로딩
   */
  static preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  }

  /**
   * 이미지 메타데이터 추출
   */
  static async getImageMetadata(file: File): Promise<{
    width: number;
    height: number;
    size: number;
    type: string;
  }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          size: file.size,
          type: file.type,
        });
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
}

/**
 * 이미지 캐시 관리자
 */
export class ImageCacheManager {
  private static readonly CACHE_NAME = 'talez-images-v1';
  private static readonly MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB
  private static readonly MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7일

  /**
   * 이미지를 캐시에 저장
   */
  static async cacheImage(url: string, blob: Blob): Promise<void> {
    if (!('caches' in window)) return;

    try {
      const cache = await caches.open(this.CACHE_NAME);
      const response = new Response(blob, {
        headers: {
          'Content-Type': blob.type,
          'Cache-Control': 'max-age=604800', // 1주일
          'X-Cached-At': Date.now().toString(),
        },
      });
      await cache.put(url, response);
      await this.cleanOldCache();
    } catch (error) {
      console.warn('Failed to cache image:', error);
    }
  }

  /**
   * 캐시에서 이미지 가져오기
   */
  static async getCachedImage(url: string): Promise<Blob | null> {
    if (!('caches' in window)) return null;

    try {
      const cache = await caches.open(this.CACHE_NAME);
      const response = await cache.match(url);
      
      if (!response) return null;

      // 캐시 만료 확인
      const cachedAt = response.headers.get('X-Cached-At');
      if (cachedAt && Date.now() - parseInt(cachedAt) > this.MAX_CACHE_AGE) {
        await cache.delete(url);
        return null;
      }

      return await response.blob();
    } catch (error) {
      console.warn('Failed to get cached image:', error);
      return null;
    }
  }

  /**
   * 오래된 캐시 정리
   */
  private static async cleanOldCache(): Promise<void> {
    if (!('caches' in window)) return;

    try {
      const cache = await caches.open(this.CACHE_NAME);
      const requests = await cache.keys();
      
      let totalSize = 0;
      const cacheEntries: Array<{ request: Request; size: number; cachedAt: number }> = [];

      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          const cachedAt = parseInt(response.headers.get('X-Cached-At') || '0');
          
          totalSize += blob.size;
          cacheEntries.push({
            request,
            size: blob.size,
            cachedAt,
          });
        }
      }

      // 크기 초과 시 오래된 항목부터 삭제
      if (totalSize > this.MAX_CACHE_SIZE) {
        cacheEntries.sort((a, b) => a.cachedAt - b.cachedAt);
        
        for (const entry of cacheEntries) {
          await cache.delete(entry.request);
          totalSize -= entry.size;
          
          if (totalSize <= this.MAX_CACHE_SIZE * 0.8) break; // 80%까지 정리
        }
      }
    } catch (error) {
      console.warn('Failed to clean cache:', error);
    }
  }

  /**
   * 캐시 크기 확인
   */
  static async getCacheSize(): Promise<number> {
    if (!('caches' in window)) return 0;

    try {
      const cache = await caches.open(this.CACHE_NAME);
      const requests = await cache.keys();
      
      let totalSize = 0;
      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
      
      return totalSize;
    } catch (error) {
      console.warn('Failed to get cache size:', error);
      return 0;
    }
  }
}