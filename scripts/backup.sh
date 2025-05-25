#!/bin/bash

# 데이터베이스 백업 스크립트
# 사용법: ./scripts/backup.sh [환경명]
# 예: ./scripts/backup.sh production

# 오류 발생 시 스크립트 종료
set -e

# 환경 설정
ENV=${1:-production}
TIMESTAMP=$(date +%Y%m%d%H%M%S)
BACKUP_DIR="backups"
BACKUP_FILE="${BACKUP_DIR}/talez_db_${ENV}_${TIMESTAMP}.sql"

echo "===== 데이터베이스 백업 시작: $ENV 환경 ====="

# 백업 디렉토리 생성
mkdir -p $BACKUP_DIR

# 환경 변수 로드
if [ -f ".env.$ENV" ]; then
  echo "환경 변수 로드 중: .env.$ENV"
  export $(grep -v '^#' .env.$ENV | xargs)
else
  echo "경고: .env.$ENV 파일이 존재하지 않습니다."
fi

# 데이터베이스 백업
echo "데이터베이스 백업 중..."
PGPASSWORD=$PGPASSWORD pg_dump -h $PGHOST -U $PGUSER -d $PGDATABASE -F c -f $BACKUP_FILE

# 백업 파일 압축
echo "백업 파일 압축 중..."
gzip $BACKUP_FILE

# 백업 파일 권한 설정
chmod 600 "${BACKUP_FILE}.gz"

# 원격 저장소에 백업 업로드 (선택적)
if [ ! -z "$BACKUP_S3_BUCKET" ]; then
  echo "백업 파일을 S3에 업로드 중..."
  aws s3 cp "${BACKUP_FILE}.gz" "s3://${BACKUP_S3_BUCKET}/talez/db/${ENV}/${TIMESTAMP}/"
fi

# 오래된 백업 정리 (30일 이상 된 백업 삭제)
find $BACKUP_DIR -name "talez_db_${ENV}_*.sql.gz" -type f -mtime +30 -delete

echo "===== 데이터베이스 백업 완료 ====="
echo "백업 파일: ${BACKUP_FILE}.gz"

# 백업 후 알림 (선택적)
curl -X POST \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"✅ $ENV 환경의 Talez 데이터베이스가 성공적으로 백업되었습니다. (${TIMESTAMP})\"}" \
  ${SLACK_WEBHOOK_URL}