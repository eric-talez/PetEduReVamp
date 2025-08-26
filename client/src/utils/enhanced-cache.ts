/**
 * 향상된 클라이언트 사이드 캐싱 시스템
 * IndexedDB와 메모리 캐시를 조합한 멀티레벨 캐싱
 */

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  version: string;
  size: number;
}

export interface CacheOptions {
  ttl?: number; // TTL in milliseconds
  version?: string; // Cache version for invalidation
  compress?: boolean; // Enable compression for large data
  persistent?: boolean; // Use IndexedDB for persistence
}

export class EnhancedCacheManager {
  private static readonly DB_NAME = 'TalezCache';
  private static readonly DB_VERSION = 1;
  private static readonly STORE_NAME = 'cache_entries';
  private static readonly MAX_MEMORY_SIZE = 50 * 1024 * 1024; // 50MB
  private static readonly MAX_IDB_SIZE = 200 * 1024 * 1024; // 200MB

  private static memoryCache = new Map<string, CacheEntry>();
  private static db: IDBDatabase | null = null;
  private static currentMemorySize = 0;

  /**
   * 캐시 시스템 초기화
   */
  static async initialize(): Promise<void> {
    if (typeof window === 'undefined' || !('indexedDB' in window)) return;

    try {
      this.db = await this.openDatabase();
      await this.cleanExpiredEntries();
      console.log('✅ Enhanced cache system initialized');
    } catch (error) {
      console.warn('Cache initialization failed:', error);
    }
  }

  /**
   * IndexedDB 데이터베이스 열기
   */
  private static openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'key' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  /**
   * 데이터 저장
   */
  static async set<T>(
    key: string, 
    data: T, 
    options: CacheOptions = {}
  ): Promise<void> {
    const {
      ttl = 30 * 60 * 1000, // 기본 30분
      version = '1.0',
      compress = false,
      persistent = true
    } = options;

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      version,
      size: this.calculateSize(data)
    };

    // 메모리 캐시에 저장
    this.memoryCache.set(key, entry);
    this.currentMemorySize += entry.size;

    // 메모리 사용량 관리
    if (this.currentMemorySize > this.MAX_MEMORY_SIZE) {
      await this.evictMemoryCache();
    }

    // 영구 저장소에 저장
    if (persistent && this.db) {
      try {
        await this.setInIndexedDB(key, entry);
      } catch (error) {
        console.warn('Failed to save to IndexedDB:', error);
      }
    }
  }

  /**
   * 데이터 조회
   */
  static async get<T>(key: string): Promise<T | null> {
    // 메모리 캐시에서 먼저 확인
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry && this.isEntryValid(memoryEntry)) {
      return memoryEntry.data as T;
    }

    // 메모리에 없으면 IndexedDB에서 확인
    if (this.db) {
      try {
        const idbEntry = await this.getFromIndexedDB(key);
        if (idbEntry && this.isEntryValid(idbEntry)) {
          // 메모리 캐시로 복원
          this.memoryCache.set(key, idbEntry);
          this.currentMemorySize += idbEntry.size;
          return idbEntry.data as T;
        }
      } catch (error) {
        console.warn('Failed to load from IndexedDB:', error);
      }
    }

    return null;
  }

  /**
   * 캐시된 fetch (네트워크 요청 캐싱)
   */
  static async cachedFetch<T>(
    url: string,
    options: RequestInit & CacheOptions = {}
  ): Promise<T> {
    const { ttl, version, compress, persistent, ...fetchOptions } = options;
    const cacheKey = `fetch:${url}:${JSON.stringify(fetchOptions)}`;

    // 캐시에서 먼저 확인
    const cached = await this.get<T>(cacheKey);
    if (cached) {
      return cached;
    }

    // 네트워크 요청
    try {
      const response = await fetch(url, fetchOptions);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // 캐시에 저장
      await this.set(cacheKey, data, { ttl, version, compress, persistent });
      
      return data;
    } catch (error) {
      console.error(`Cached fetch failed for ${url}:`, error);
      throw error;
    }
  }

  /**
   * 버전별 캐시 무효화
   */
  static async invalidateByVersion(version: string): Promise<void> {
    // 메모리 캐시 정리
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.version === version) {
        this.memoryCache.delete(key);
        this.currentMemorySize -= entry.size;
      }
    }

    // IndexedDB 정리
    if (this.db) {
      try {
        const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.openCursor();

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            const entry = cursor.value as CacheEntry & { key: string };
            if (entry.version === version) {
              cursor.delete();
            }
            cursor.continue();
          }
        };
      } catch (error) {
        console.warn('Failed to invalidate IndexedDB by version:', error);
      }
    }
  }

  /**
   * 패턴별 캐시 무효화
   */
  static async invalidateByPattern(pattern: RegExp): Promise<void> {
    // 메모리 캐시 정리
    for (const key of this.memoryCache.keys()) {
      if (pattern.test(key)) {
        const entry = this.memoryCache.get(key)!;
        this.memoryCache.delete(key);
        this.currentMemorySize -= entry.size;
      }
    }

    // IndexedDB 정리
    if (this.db) {
      try {
        const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.openCursor();

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            if (pattern.test(cursor.key as string)) {
              cursor.delete();
            }
            cursor.continue();
          }
        };
      } catch (error) {
        console.warn('Failed to invalidate IndexedDB by pattern:', error);
      }
    }
  }

  /**
   * IndexedDB에 저장
   */
  private static setInIndexedDB(key: string, entry: CacheEntry): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not available'));
        return;
      }

      const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      
      const request = store.put({ key, ...entry });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * IndexedDB에서 조회
   */
  private static getFromIndexedDB(key: string): Promise<CacheEntry | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve(null);
        return;
      }

      const transaction = this.db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      
      const request = store.get(key);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? { ...result } : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 항목 유효성 검사
   */
  private static isEntryValid(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  /**
   * 데이터 크기 계산
   */
  private static calculateSize(data: any): number {
    try {
      return new Blob([JSON.stringify(data)]).size;
    } catch {
      return 1024; // 기본값
    }
  }

  /**
   * 메모리 캐시 정리
   */
  private static async evictMemoryCache(): Promise<void> {
    const entries = Array.from(this.memoryCache.entries());
    
    // LRU 방식으로 정렬 (오래된 것부터)
    entries.sort(([, a], [, b]) => a.timestamp - b.timestamp);
    
    // 절반 정도 제거
    const toRemove = entries.slice(0, Math.floor(entries.length / 2));
    
    for (const [key, entry] of toRemove) {
      this.memoryCache.delete(key);
      this.currentMemorySize -= entry.size;
    }

    console.log(`🧹 Memory cache evicted ${toRemove.length} entries`);
  }

  /**
   * 만료된 항목 정리
   */
  private static async cleanExpiredEntries(): Promise<void> {
    const now = Date.now();
    
    // 메모리 캐시 정리
    for (const [key, entry] of this.memoryCache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.memoryCache.delete(key);
        this.currentMemorySize -= entry.size;
      }
    }

    // IndexedDB 정리
    if (this.db) {
      try {
        const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        const request = store.openCursor();

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            const entry = cursor.value as CacheEntry;
            if (now - entry.timestamp > entry.ttl) {
              cursor.delete();
            }
            cursor.continue();
          }
        };
      } catch (error) {
        console.warn('Failed to clean IndexedDB:', error);
      }
    }
  }

  /**
   * 캐시 통계 조회
   */
  static async getStats(): Promise<{
    memoryEntries: number;
    memorySize: number;
    indexedDBEntries: number;
    indexedDBSize: number;
  }> {
    let indexedDBEntries = 0;
    let indexedDBSize = 0;

    if (this.db) {
      try {
        const transaction = this.db.transaction([this.STORE_NAME], 'readonly');
        const store = transaction.objectStore(this.STORE_NAME);
        
        indexedDBEntries = await new Promise((resolve, reject) => {
          const request = store.count();
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });

        // 개별 항목의 크기를 합산
        indexedDBSize = await new Promise((resolve, reject) => {
          let totalSize = 0;
          const request = store.openCursor();
          
          request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest).result;
            if (cursor) {
              totalSize += cursor.value.size || 0;
              cursor.continue();
            } else {
              resolve(totalSize);
            }
          };
          request.onerror = () => reject(request.error);
        });
      } catch (error) {
        console.warn('Failed to get IndexedDB stats:', error);
      }
    }

    return {
      memoryEntries: this.memoryCache.size,
      memorySize: this.currentMemorySize,
      indexedDBEntries,
      indexedDBSize
    };
  }

  /**
   * 전체 캐시 정리
   */
  static async clear(): Promise<void> {
    // 메모리 캐시 정리
    this.memoryCache.clear();
    this.currentMemorySize = 0;

    // IndexedDB 정리
    if (this.db) {
      try {
        const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        await new Promise((resolve, reject) => {
          const request = store.clear();
          request.onsuccess = () => resolve(void 0);
          request.onerror = () => reject(request.error);
        });
      } catch (error) {
        console.warn('Failed to clear IndexedDB:', error);
      }
    }
  }
}

// 정리 스케줄러 (5분마다)
if (typeof window !== 'undefined') {
  EnhancedCacheManager.initialize();
  
  setInterval(() => {
    EnhancedCacheManager['cleanExpiredEntries']();
  }, 5 * 60 * 1000);
  
  // 페이지 언로드 시 정리
  window.addEventListener('beforeunload', () => {
    EnhancedCacheManager.clear();
  });
}