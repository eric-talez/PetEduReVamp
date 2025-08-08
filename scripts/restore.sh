#!/bin/bash

# TALEZ Database Restore Script
# 백업된 데이터베이스를 복원합니다.

set -e

# 사용법 표시
usage() {
    echo "사용법: $0 <백업파일>"
    echo "예시: $0 /backups/talez_backup_20250808_120000.custom"
    echo "      $0 /backups/talez_backup_20250808_120000.sql.gz"
    exit 1
}

# 인자 검증
if [ $# -ne 1 ]; then
    usage
fi

BACKUP_FILE="$1"

# 파일 존재 확인
if [ ! -f "$BACKUP_FILE" ]; then
    echo "ERROR: 백업 파일을 찾을 수 없습니다: $BACKUP_FILE"
    exit 1
fi

# 로깅 함수
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "데이터베이스 복원 시작: $BACKUP_FILE"

# 확인 메시지
echo "WARNING: 이 작업은 기존 데이터베이스를 완전히 대체합니다."
echo "계속하시겠습니까? (yes/no)"
read -r CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    log "복원 작업이 취소되었습니다."
    exit 0
fi

# 백업 타입 확인
if [[ "$BACKUP_FILE" == *.custom ]]; then
    # Custom format 복원
    log "Custom 형식 백업 복원 중..."
    
    # 기존 연결 종료
    psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d postgres -c \
        "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$PGDATABASE' AND pid <> pg_backend_pid();"
    
    # 데이터베이스 재생성
    dropdb -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" "$PGDATABASE" || true
    createdb -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" "$PGDATABASE"
    
    # 복원 실행
    pg_restore \
        --host="$PGHOST" \
        --port="$PGPORT" \
        --username="$PGUSER" \
        --dbname="$PGDATABASE" \
        --no-password \
        --clean \
        --if-exists \
        --verbose \
        "$BACKUP_FILE"

elif [[ "$BACKUP_FILE" == *.sql.gz ]]; then
    # Gzipped SQL 복원
    log "압축된 SQL 백업 복원 중..."
    
    # 기존 연결 종료
    psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d postgres -c \
        "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$PGDATABASE' AND pid <> pg_backend_pid();"
    
    # 데이터베이스 재생성
    dropdb -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" "$PGDATABASE" || true
    createdb -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" "$PGDATABASE"
    
    # 복원 실행
    gunzip -c "$BACKUP_FILE" | psql \
        -h "$PGHOST" \
        -p "$PGPORT" \
        -U "$PGUSER" \
        -d "$PGDATABASE"

elif [[ "$BACKUP_FILE" == *.sql ]]; then
    # Plain SQL 복원
    log "SQL 백업 복원 중..."
    
    # 기존 연결 종료
    psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d postgres -c \
        "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$PGDATABASE' AND pid <> pg_backend_pid();"
    
    # 데이터베이스 재생성
    dropdb -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" "$PGDATABASE" || true
    createdb -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" "$PGDATABASE"
    
    # 복원 실행
    psql \
        -h "$PGHOST" \
        -p "$PGPORT" \
        -U "$PGUSER" \
        -d "$PGDATABASE" \
        -f "$BACKUP_FILE"

else
    log "ERROR: 지원하지 않는 백업 파일 형식입니다."
    log "지원 형식: .custom, .sql, .sql.gz"
    exit 1
fi

# 복원 검증
log "복원 검증 중..."
TABLE_COUNT=$(psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -t -c \
    "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';")

if [ "$TABLE_COUNT" -gt 0 ]; then
    log "복원 검증 성공: $TABLE_COUNT 개의 테이블이 복원되었습니다."
else
    log "ERROR: 복원 검증 실패 - 테이블이 발견되지 않았습니다."
    exit 1
fi

log "데이터베이스 복원 완료"

# 애플리케이션 재시작 권장
log "주의: 애플리케이션을 재시작하여 새로운 데이터베이스 상태를 반영하세요."
log "명령어: docker-compose restart app 또는 pm2 restart all"