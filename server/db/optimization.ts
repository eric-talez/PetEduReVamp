
import { db } from '../db';
import * as schema from '../../shared/schema';
import { logger } from '../monitoring/logger';

export class DatabaseOptimizer {
  
  /**
   * 데이터베이스 성능 최적화
   */
  static async optimizeDatabase() {
    try {
      logger.info('[DB최적화] 데이터베이스 최적화 시작');
      
      // 인덱스 최적화 쿼리들
      const optimizationQueries = [
        // 사용자 테이블 인덱스
        `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`,
        `CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);`,
        `CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);`,
        
        // 강의 관련 인덱스
        `CREATE INDEX IF NOT EXISTS idx_courses_trainer ON courses(trainer_id);`,
        `CREATE INDEX IF NOT EXISTS idx_courses_active ON courses(is_active);`,
        `CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);`,
        `CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);`,
        
        // 쇼핑몰 관련 인덱스
        `CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);`,
        `CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);`,
        `CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);`,
        `CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);`,
        
        // 커뮤니티 관련 인덱스
        `CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);`,
        `CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);`,
        `CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(is_published);`,
        
        // 메시징 관련 인덱스
        `CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);`,
        `CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);`,
      ];
      
      for (const query of optimizationQueries) {
        try {
          await db.execute(query);
          logger.info(`[DB최적화] 인덱스 생성 완료: ${query.split(' ')[5]}`);
        } catch (error) {
          logger.warn(`[DB최적화] 인덱스 생성 실패: ${error.message}`);
        }
      }
      
      logger.info('[DB최적화] 데이터베이스 최적화 완료');
    } catch (error) {
      logger.error('[DB최적화] 최적화 실패:', error);
      throw error;
    }
  }
  
  /**
   * 데이터 무결성 검증
   */
  static async validateDataIntegrity() {
    const results = {
      orphanedRecords: [],
      duplicateEmails: [],
      inactiveReferences: [],
      inconsistentData: []
    };
    
    try {
      logger.info('[데이터검증] 데이터 무결성 검증 시작');
      
      // 1. 고아 레코드 찾기
      const orphanedEnrollments = await db.execute(`
        SELECT e.id, e.user_id, e.course_id 
        FROM enrollments e 
        LEFT JOIN users u ON e.user_id = u.id 
        LEFT JOIN courses c ON e.course_id = c.id 
        WHERE u.id IS NULL OR c.id IS NULL
      `);
      
      if (orphanedEnrollments.length > 0) {
        results.orphanedRecords.push({
          table: 'enrollments',
          count: orphanedEnrollments.length,
          records: orphanedEnrollments
        });
      }
      
      // 2. 중복 이메일 찾기
      const duplicateEmails = await db.execute(`
        SELECT email, COUNT(*) as count 
        FROM users 
        GROUP BY email 
        HAVING COUNT(*) > 1
      `);
      
      if (duplicateEmails.length > 0) {
        results.duplicateEmails = duplicateEmails;
      }
      
      // 3. 비활성 참조 데이터 찾기
      const inactiveUserCourses = await db.execute(`
        SELECT c.id, c.title, u.email 
        FROM courses c 
        JOIN users u ON c.trainer_id = u.id 
        WHERE u.is_active = false AND c.is_active = true
      `);
      
      if (inactiveUserCourses.length > 0) {
        results.inactiveReferences.push({
          type: 'courses_with_inactive_trainers',
          count: inactiveUserCourses.length,
          records: inactiveUserCourses
        });
      }
      
      logger.info('[데이터검증] 데이터 무결성 검증 완료', results);
      return results;
      
    } catch (error) {
      logger.error('[데이터검증] 검증 실패:', error);
      throw error;
    }
  }
  
  /**
   * 데이터베이스 통계 수집
   */
  static async collectStatistics() {
    try {
      const stats = {
        users: await db.select().from(schema.users).then(r => r.length),
        courses: await db.select().from(schema.courses).then(r => r.length),
        products: await db.select().from(schema.products).then(r => r.length),
        posts: await db.select().from(schema.posts).then(r => r.length),
        orders: await db.select().from(schema.orders).then(r => r.length),
        messages: await db.select().from(schema.messages).then(r => r.length),
        timestamp: new Date().toISOString()
      };
      
      logger.info('[DB통계] 데이터베이스 통계 수집 완료:', stats);
      return stats;
    } catch (error) {
      logger.error('[DB통계] 통계 수집 실패:', error);
      throw error;
    }
  }
}
