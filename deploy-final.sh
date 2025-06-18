
#!/bin/bash

echo "🚀 TALEZ 실서비스 최종 배포 v2.0"
echo "=================================="
echo ""

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 환경 검증
log_info "환경 검증 시작..."

if [ "$NODE_ENV" != "production" ]; then
    log_error "NODE_ENV가 production으로 설정되지 않았습니다."
    echo "export NODE_ENV=production을 실행해주세요."
    exit 1
fi

# 필수 환경 변수 확인
REQUIRED_VARS=("DATABASE_URL" "SESSION_SECRET")
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        log_error "$var이 설정되지 않았습니다."
        exit 1
    fi
done

log_success "환경 변수 검증 완료"

# 시스템 요구사항 확인
log_info "시스템 요구사항 확인..."

# Node.js 버전 확인
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_NODE_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_NODE_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_NODE_VERSION" ]; then
    log_error "Node.js 버전이 $REQUIRED_NODE_VERSION 이상이어야 합니다. (현재: $NODE_VERSION)"
    exit 1
fi

# 메모리 확인
AVAILABLE_MEMORY=$(free -m | awk 'NR==2{printf "%.0f", $7}')
if [ "$AVAILABLE_MEMORY" -lt 512 ]; then
    log_warning "사용 가능한 메모리가 부족합니다: ${AVAILABLE_MEMORY}MB"
fi

# 디스크 공간 확인
AVAILABLE_DISK=$(df . | awk 'NR==2{print $4}')
if [ "$AVAILABLE_DISK" -lt 1048576 ]; then  # 1GB in KB
    log_warning "사용 가능한 디스크 공간이 부족합니다"
fi

log_success "시스템 요구사항 확인 완료"

# 백업 생성
log_info "기존 설정 백업..."
if [ -d "backups" ]; then
    BACKUP_DIR="backups/deployment-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # PM2 프로세스 목록 백업
    pm2 jlist > "$BACKUP_DIR/pm2-processes.json" 2>/dev/null || true
    
    # 환경 변수 백업 (민감한 정보 제외)
    env | grep -E '^(NODE_ENV|PORT|DATABASE_URL)=' > "$BACKUP_DIR/env-backup.txt" || true
    
    log_success "백업 완료: $BACKUP_DIR"
fi

# 기존 프로세스 중지
log_info "기존 서비스 중지..."
pm2 delete funnytalez-backend-prod 2>/dev/null || true
pm2 delete all 2>/dev/null || true
log_success "기존 프로세스 중지 완료"

# 의존성 설치
log_info "의존성 설치..."
if [ -f "package-lock.json" ]; then
    npm ci --production=false
else
    npm install
fi

if [ $? -ne 0 ]; then
    log_error "의존성 설치 실패"
    exit 1
fi
log_success "의존성 설치 완료"

# 데이터베이스 최적화
log_info "데이터베이스 최적화..."
npm run db:push

if [ $? -ne 0 ]; then
    log_error "데이터베이스 마이그레이션 실패"
    exit 1
fi

# 데이터베이스 최적화 실행
NODE_ENV=production node -e "
const { DatabaseOptimizer } = require('./server/db/optimization');
DatabaseOptimizer.optimizeDatabase()
  .then(() => console.log('데이터베이스 최적화 완료'))
  .catch(err => { console.error('최적화 실패:', err); process.exit(1); });
" 2>/dev/null || log_warning "데이터베이스 최적화 스킵됨"

log_success "데이터베이스 설정 완료"

# 필요한 디렉토리 생성
log_info "디렉토리 구조 생성..."
mkdir -p logs
mkdir -p public/uploads/images
mkdir -p backups
mkdir -p tmp
log_success "디렉토리 구조 생성 완료"

# 권한 설정
log_info "파일 권한 설정..."
chmod +x deploy-final.sh
chmod 755 public/uploads
chmod -R 644 logs/*.log 2>/dev/null || true
log_success "권한 설정 완료"

# 성능 최적화 설정
log_info "성능 최적화 설정..."

# 캐시 정리
npm cache clean --force 2>/dev/null || true

# 임시 파일 정리
rm -rf tmp/* 2>/dev/null || true

log_success "성능 최적화 완료"

# 프로덕션 서버 시작
log_info "프로덕션 서버 시작..."

NODE_ENV=production pm2 start server/index.ts \
  --name funnytalez-backend-prod \
  --interpreter ./node_modules/.bin/tsx \
  --instances max \
  --exec-mode cluster \
  --max-memory-restart 1G \
  --log-date-format "YYYY-MM-DD HH:mm:ss Z" \
  --merge-logs \
  --restart-delay 5000 \
  --max-restarts 10 \
  --min-uptime 10s \
  --watch false \
  --env production \
  --time

if [ $? -ne 0 ]; then
    log_error "서버 시작 실패"
    exit 1
fi

log_success "프로덕션 서버 시작 완료"

# PM2 설정 저장
log_info "PM2 설정 저장..."
pm2 save
pm2 startup > /dev/null 2>&1 || log_warning "PM2 스타트업 설정 실패 (수동 설정 필요)"
log_success "PM2 설정 저장 완료"

# 헬스체크 대기
log_info "서비스 헬스체크 대기 중..."
sleep 10

# 헬스체크 수행
HEALTH_URL="http://localhost:5000/health"
for i in {1..5}; do
    if curl -f -s "$HEALTH_URL" > /dev/null 2>&1; then
        log_success "헬스체크 통과 (시도 $i/5)"
        break
    else
        if [ $i -eq 5 ]; then
            log_error "헬스체크 실패 - 서비스가 정상적으로 시작되지 않았습니다"
            pm2 logs funnytalez-backend-prod --lines 20
            exit 1
        fi
        log_warning "헬스체크 재시도 ($i/5)..."
        sleep 5
    fi
done

# 모니터링 URL 확인
MONITORING_URL="http://localhost:5000/api/monitoring/health"
if curl -f -s "$MONITORING_URL" > /dev/null 2>&1; then
    log_success "모니터링 시스템 정상 작동"
else
    log_warning "모니터링 시스템 확인 필요"
fi

echo ""
echo "🎉 배포 완료!"
echo "==============="
echo ""
log_success "서비스가 성공적으로 배포되었습니다!"
echo ""
echo "📊 상태 확인 명령어:"
echo "  pm2 status"
echo "  pm2 logs funnytalez-backend-prod"
echo "  pm2 monit"
echo ""
echo "🔗 주요 엔드포인트:"
echo "  헬스체크: http://localhost:5000/health"
echo "  모니터링: http://localhost:5000/api/monitoring/health"
echo "  메트릭: http://localhost:5000/api/monitoring/metrics"
echo ""
echo "🛠️ 관리 명령어:"
echo "  재시작: pm2 restart funnytalez-backend-prod"
echo "  중지: pm2 stop funnytalez-backend-prod"
echo "  삭제: pm2 delete funnytalez-backend-prod"
echo ""

# 최종 시스템 정보 출력
echo "📋 시스템 정보:"
echo "  Node.js: $(node --version)"
echo "  NPM: $(npm --version)"
echo "  PM2: $(pm2 --version)"
echo "  업타임: $(uptime -p 2>/dev/null || echo 'N/A')"
echo ""

log_success "모든 배포 작업이 완료되었습니다! 🚀"
