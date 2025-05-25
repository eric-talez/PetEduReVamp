import { logger } from '../monitoring/logger';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
import config from '../config';

// exec를 프로미스 기반으로 변환
const execPromise = util.promisify(exec);

/**
 * 백업 디렉토리 경로
 */
const BACKUP_DIR = path.join(process.cwd(), 'backups');

/**
 * 백업 디렉토리 초기화
 */
export function initializeBackupDirectory() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    logger.info(`백업 디렉토리 생성됨: ${BACKUP_DIR}`);
  }
}

/**
 * 데이터베이스 백업 수행
 */
export async function backupDatabase() {
  try {
    // 백업 디렉토리 확인
    initializeBackupDirectory();

    // 백업 파일명 생성 (날짜 포함)
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `talez_db_backup_${timestamp}.sql`;
    const backupFilePath = path.join(BACKUP_DIR, backupFileName);

    // pg_dump 명령 실행
    const pgDumpCommand = `PGPASSWORD=${process.env.PGPASSWORD} pg_dump -h ${process.env.PGHOST} -U ${process.env.PGUSER} -d ${process.env.PGDATABASE} -F c -f ${backupFilePath}`;
    await execPromise(pgDumpCommand);

    // 백업 파일 압축
    const gzipCommand = `gzip ${backupFilePath}`;
    await execPromise(gzipCommand);

    logger.info(`데이터베이스 백업 완료: ${backupFilePath}.gz`);
    return `${backupFilePath}.gz`;
  } catch (error) {
    logger.error(`데이터베이스 백업 실패: ${error.message}`);
    throw new Error(`데이터베이스 백업 실패: ${error.message}`);
  }
}

/**
 * 데이터베이스 복원
 * @param backupFile 백업 파일 경로
 */
export async function restoreDatabase(backupFile: string) {
  try {
    if (!fs.existsSync(backupFile)) {
      throw new Error(`백업 파일을 찾을 수 없음: ${backupFile}`);
    }

    // pg_restore 명령 실행
    let restoreCommand: string;
    
    if (backupFile.endsWith('.gz')) {
      // 압축된 백업 파일은 먼저 압축 해제 후 복원
      const uncompressedFile = backupFile.slice(0, -3);
      await execPromise(`gunzip -c ${backupFile} > ${uncompressedFile}`);
      restoreCommand = `PGPASSWORD=${process.env.PGPASSWORD} pg_restore -h ${process.env.PGHOST} -U ${process.env.PGUSER} -d ${process.env.PGDATABASE} -c -v ${uncompressedFile}`;
    } else {
      restoreCommand = `PGPASSWORD=${process.env.PGPASSWORD} pg_restore -h ${process.env.PGHOST} -U ${process.env.PGUSER} -d ${process.env.PGDATABASE} -c -v ${backupFile}`;
    }
    
    await execPromise(restoreCommand);
    
    logger.info(`데이터베이스 복원 완료: ${backupFile}`);
    return true;
  } catch (error) {
    logger.error(`데이터베이스 복원 실패: ${error.message}`);
    throw new Error(`데이터베이스 복원 실패: ${error.message}`);
  }
}

/**
 * 오래된 백업 파일 정리
 * @param maxAgeDays 보존할 최대 일수 (기본 30일)
 */
export async function cleanupOldBackups(maxAgeDays: number = 30) {
  try {
    // 백업 디렉토리 확인
    if (!fs.existsSync(BACKUP_DIR)) {
      return;
    }
    
    // 현재 시간
    const now = Date.now();
    // 최대 보존 기간 (밀리초)
    const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;
    
    // 백업 디렉토리 내 파일 목록
    const files = fs.readdirSync(BACKUP_DIR);
    
    // 오래된 파일 삭제
    let deletedCount = 0;
    for (const file of files) {
      if (file.startsWith('talez_db_backup_') && (file.endsWith('.sql') || file.endsWith('.sql.gz'))) {
        const filePath = path.join(BACKUP_DIR, file);
        const fileStats = fs.statSync(filePath);
        
        // 파일 생성 시간이 최대 보존 기간보다 오래된 경우
        if (now - fileStats.birthtimeMs > maxAgeMs) {
          fs.unlinkSync(filePath);
          deletedCount++;
        }
      }
    }
    
    logger.info(`오래된 백업 파일 ${deletedCount}개 정리 완료 (${maxAgeDays}일 이상)`);
  } catch (error) {
    logger.error(`백업 파일 정리 실패: ${error.message}`);
  }
}

/**
 * 정기적인 백업 스케줄 설정
 * @param intervalHours 백업 간격 (시간 단위, 기본 24시간)
 */
export function scheduleRegularBackups(intervalHours: number = 24) {
  // 백업 디렉토리 초기화
  initializeBackupDirectory();
  
  // 시작 시 최초 백업 수행
  if (config.NODE_ENV === 'production') {
    backupDatabase().catch(err => {
      logger.error(`초기 백업 실패: ${err.message}`);
    });
  }
  
  // 정기 백업 스케줄 설정
  const intervalMs = intervalHours * 60 * 60 * 1000;
  setInterval(async () => {
    try {
      await backupDatabase();
      // 30일 이상된 백업 정리
      await cleanupOldBackups(30);
    } catch (error) {
      logger.error(`정기 백업 실패: ${error.message}`);
    }
  }, intervalMs);
  
  logger.info(`정기 백업 스케줄 설정 완료 (간격: ${intervalHours}시간)`);
}

/**
 * 서버 시작 시 재해 복구 시스템 초기화
 */
export function initializeRecoverySystem() {
  // 백업 디렉토리 초기화
  initializeBackupDirectory();
  
  // 프로덕션 환경에서만 정기 백업 활성화
  if (config.NODE_ENV === 'production') {
    // 24시간마다 백업
    scheduleRegularBackups(24);
  }
  
  logger.info('[Recovery] 재해 복구 시스템이 초기화되었습니다.');
}