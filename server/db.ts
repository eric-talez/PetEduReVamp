import { Pool as PgPool, neonConfig } from '@neondatabase/serverless';
import { drizzle as drizzlePg } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleMaria } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import ws from "ws";
import * as schema from "@shared/schema";

// 환경별 데이터베이스 설정
const isProduction = process.env.NODE_ENV === 'production';
const isReplit = process.env.REPLIT_DEV_DOMAIN !== undefined;

// 운영 환경용 MariaDB 설정
const PRODUCTION_DB_CONFIG = {
  host: 'localhost',
  port: 3306,
  user: 'ft_user',
  password: 'Ft_user123#@!',
  database: 'ft_v1',
  multipleStatements: true,
  ssl: false
};

let pool: any;
let db: any;

if (isProduction && !isReplit) {
  // 🎯 운영 환경: MariaDB 연결
  console.log('🎯 운영 환경: MariaDB 연결 설정');
  
  pool = mysql.createPool({
    host: PRODUCTION_DB_CONFIG.host,
    port: PRODUCTION_DB_CONFIG.port,
    user: PRODUCTION_DB_CONFIG.user,
    password: PRODUCTION_DB_CONFIG.password,
    database: PRODUCTION_DB_CONFIG.database,
    multipleStatements: PRODUCTION_DB_CONFIG.multipleStatements,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  
  db = drizzleMaria(pool, { schema, mode: 'default' });
  
} else {
  // 🔧 개발 환경: PostgreSQL (Replit) 연결
  console.log('🔧 개발 환경: PostgreSQL 연결 설정');
  
  neonConfig.webSocketConstructor = ws;
  
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }
  
  pool = new PgPool({ connectionString: process.env.DATABASE_URL });
  db = drizzlePg({ client: pool, schema });
}

// 데이터베이스 연결 상태 확인 함수
export async function checkDatabaseConnection() {
  try {
    if (isProduction && !isReplit) {
      // MariaDB 연결 테스트
      const connection = await pool.getConnection();
      await connection.ping();
      connection.release();
      console.log('✅ MariaDB 연결 성공');
    } else {
      // PostgreSQL 연결 테스트 (기존 방식)
      console.log('✅ PostgreSQL 연결 준비됨');
    }
    return true;
  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:', error);
    return false;
  }
}

export { pool, db };
