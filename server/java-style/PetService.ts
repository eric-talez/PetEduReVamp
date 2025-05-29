/**
 * Java Spring Boot 스타일의 PetService
 * Node.js/TypeScript로 구현된 Spring Boot 패턴
 */

import { storage } from '../storage';

export class PetService {
  
  /**
   * 사용자의 모든 반려동물 조회
   * @GetMapping("/api/pets/user/{userId}") 스타일
   */
  async findByUserId(userId: number): Promise<any[]> {
    console.log(`[PetService] findByUserId(${userId}) 호출됨`);
    return await storage.getPetsByUserId(userId);
  }

  /**
   * ID로 반려동물 조회
   * @GetMapping("/api/pets/{id}") 스타일
   */
  async findById(id: number): Promise<any | null> {
    console.log(`[PetService] findById(${id}) 호출됨`);
    return await storage.getPet(id);
  }

  /**
   * 반려동물 생성
   * @PostMapping("/api/pets") 스타일
   */
  async save(petData: any): Promise<any> {
    console.log('[PetService] save() 호출됨', petData);
    return await storage.createPet(petData);
  }

  /**
   * 모든 반려동물 조회 (관리자용)
   * @GetMapping("/api/pets") 스타일
   */
  async findAll(): Promise<any[]> {
    console.log('[PetService] findAll() 호출됨');
    // storage에 getAllPets 메서드가 없으므로 임시 구현
    return [];
  }

  /**
   * 반려동물 서비스 헬스 체크
   */
  health(): { status: string; service: string; timestamp: Date } {
    console.log('[PetService] health() 호출됨');
    return {
      status: 'UP',
      service: 'PetEdu Pet Service (Java Style)',
      timestamp: new Date()
    };
  }
}

// 싱글톤 패턴 (Spring Boot의 @Service Bean과 유사)
export const petService = new PetService();