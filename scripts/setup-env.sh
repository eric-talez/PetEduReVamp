#!/bin/bash

# 환경 설정 스크립트
# 사용법: ./scripts/setup-env.sh [환경명]
# 예: ./scripts/setup-env.sh production

# 오류 발생 시 스크립트 종료
set -e

# 환경 설정
ENV=${1:-development}
ENV_FILE=".env.${ENV}"
EXAMPLE_ENV_FILE=".env.example"

echo "===== 환경 설정 시작: $ENV 환경 ====="

# .env.example 파일이 없는 경우 생성
if [ ! -f "$EXAMPLE_ENV_FILE" ]; then
  echo "환경 변수 예제 파일 생성 중: $EXAMPLE_ENV_FILE"
  cat > $EXAMPLE_ENV_FILE << EOL
# 서버 설정
NODE_ENV=development
PORT=5000
HOST=0.0.0.0
SESSION_SECRET=your_session_secret_here
SESSION_MAX_AGE_MS=86400000

# 데이터베이스 설정
DATABASE_URL=postgresql://user:password@localhost:5432/talez
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=talez

# 소셜 로그인 설정
KAKAO_CLIENT_ID=your_kakao_client_id
KAKAO_MAPS_API_KEY=your_kakao_maps_api_key
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# API 키
OPENAI_API_KEY=your_openai_api_key

# 로깅 설정
LOG_LEVEL=info

# 성능 및 제한 설정
MAX_UPLOAD_SIZE_MB=20
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=60000

# 배포 알림 설정
SLACK_WEBHOOK_URL=your_slack_webhook_url

# S3 백업 설정
BACKUP_S3_BUCKET=your_backup_bucket_name
EOL
fi

# .env.{환경} 파일이 없는 경우 .env.example을 복사하여 생성
if [ ! -f "$ENV_FILE" ]; then
  echo "환경 파일 생성 중: $ENV_FILE"
  cp $EXAMPLE_ENV_FILE $ENV_FILE
  
  # 프로덕션 환경인 경우 기본값 수정
  if [ "$ENV" = "production" ]; then
    sed -i 's/NODE_ENV=development/NODE_ENV=production/g' $ENV_FILE
    echo "프로덕션 환경에 맞게 NODE_ENV를 수정했습니다."
  fi
  
  echo "환경 파일을 생성했습니다. 필요한 설정값을 업데이트하세요."
else
  echo "환경 파일이 이미 존재합니다: $ENV_FILE"
fi

echo "===== 환경 설정 완료 ====="
echo "다음 명령으로 환경 변수를 로드할 수 있습니다:"
echo "export \$(grep -v '^#' $ENV_FILE | xargs)"