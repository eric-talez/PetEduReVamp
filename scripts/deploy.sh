#!/bin/bash

# 배포 스크립트
# 사용법: ./scripts/deploy.sh [환경명]
# 예: ./scripts/deploy.sh production

# 오류 발생 시 스크립트 종료
set -e

# 환경 설정
ENV=${1:-production}
TIMESTAMP=$(date +%Y%m%d%H%M%S)
LOG_FILE="deploy_${TIMESTAMP}.log"

echo "===== 배포 시작: $ENV 환경 ====="
echo "배포 로그는 $LOG_FILE 파일에 기록됩니다."

# 로그 디렉토리 생성
mkdir -p logs

# 로그 파일 생성
exec > >(tee -a logs/$LOG_FILE) 2>&1

# 환경 변수 로드
if [ -f ".env.$ENV" ]; then
  echo "환경 변수 로드 중: .env.$ENV"
  export $(grep -v '^#' .env.$ENV | xargs)
else
  echo "경고: .env.$ENV 파일이 존재하지 않습니다."
fi

# Git에서 최신 변경사항 가져오기
echo "Git 저장소 업데이트 중..."
git fetch --all
git checkout $ENV
git pull origin $ENV

# 의존성 설치
echo "의존성 설치 중..."
npm ci

# 빌드
echo "애플리케이션 빌드 중..."
npm run build

# 배포 전 테스트 실행 (선택적)
if [ "$ENV" = "production" ]; then
  echo "배포 전 테스트 실행 중..."
  npm test || { echo "테스트 실패"; exit 1; }
fi

# 데이터베이스 마이그레이션 (필요한 경우)
echo "데이터베이스 마이그레이션 실행 중..."
npm run db:push

# Docker 컨테이너 재시작 (선택적)
if [ -f "docker-compose.yml" ]; then
  echo "Docker 컨테이너 재시작 중..."
  docker-compose -f docker-compose.yml down
  docker-compose -f docker-compose.yml up -d
fi

# PM2 프로세스 재시작 (선택적)
if command -v pm2 &> /dev/null; then
  echo "PM2 프로세스 재시작 중..."
  pm2 reload talez-app || pm2 start dist/server/index.js --name talez-app
fi

# 배포 후 알림 (선택적)
echo "알림 전송 중..."
curl -X POST \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"✅ $ENV 환경에 Talez 앱이 성공적으로 배포되었습니다. (${TIMESTAMP})\"}" \
  ${SLACK_WEBHOOK_URL}

echo "===== 배포 완료: $ENV 환경 ====="