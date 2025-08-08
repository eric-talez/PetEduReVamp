#!/bin/bash

# TALEZ Database Backup Script
# 매일 자동으로 PostgreSQL 데이터베이스를 백업합니다.

set -e

# 환경 변수
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="talez_backup_$DATE.sql"
RETENTION_DAYS=7

# 로깅 함수
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# 백업 디렉토리 생성
mkdir -p $BACKUP_DIR

log "데이터베이스 백업 시작: $BACKUP_FILE"

# PostgreSQL 백업 실행
if pg_dump \
    --host="$PGHOST" \
    --port="$PGPORT" \
    --username="$PGUSER" \
    --dbname="$PGDATABASE" \
    --no-password \
    --format=custom \
    --compress=9 \
    --file="$BACKUP_DIR/$BACKUP_FILE.custom"; then
    
    log "데이터베이스 백업 성공: $BACKUP_FILE.custom"
    
    # SQL 형태로도 백업 (복구 용이성)
    pg_dump \
        --host="$PGHOST" \
        --port="$PGPORT" \
        --username="$PGUSER" \
        --dbname="$PGDATABASE" \
        --no-password \
        --file="$BACKUP_DIR/$BACKUP_FILE"
    
    log "SQL 백업 생성 완료: $BACKUP_FILE"
    
    # 백업 파일 압축
    gzip "$BACKUP_DIR/$BACKUP_FILE"
    log "백업 파일 압축 완료: $BACKUP_FILE.gz"
    
else
    log "ERROR: 데이터베이스 백업 실패"
    exit 1
fi

# 오래된 백업 파일 정리 (7일 이상)
log "오래된 백업 파일 정리 중..."
find $BACKUP_DIR -name "talez_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "talez_backup_*.custom" -mtime +$RETENTION_DAYS -delete

log "백업 완료. 파일 목록:"
ls -la $BACKUP_DIR/talez_backup_*

# 백업 검증
LATEST_BACKUP=$(ls -t $BACKUP_DIR/talez_backup_*.custom | head -1)
if [ -f "$LATEST_BACKUP" ]; then
    BACKUP_SIZE=$(stat -c%s "$LATEST_BACKUP")
    if [ $BACKUP_SIZE -gt 1024 ]; then
        log "백업 검증 성공: 파일 크기 $BACKUP_SIZE bytes"
    else
        log "WARNING: 백업 파일이 너무 작습니다: $BACKUP_SIZE bytes"
    fi
else
    log "ERROR: 백업 파일을 찾을 수 없습니다"
    exit 1
fi

log "백업 프로세스 완료"