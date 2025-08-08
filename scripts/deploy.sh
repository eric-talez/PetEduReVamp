#!/bin/bash

# TALEZ Production Deployment Script
# 운영 환경 배포를 위한 자동화 스크립트

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로깅 함수
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 설정 변수
APP_NAME="talez"
DEPLOY_USER="ubuntu"
DEPLOY_HOST=""
DEPLOY_PATH="/var/www/talez"
DOCKER_COMPOSE_FILE="docker-compose.production.yml"
BACKUP_BEFORE_DEPLOY=true

# 사용법 표시
usage() {
    echo "TALEZ 운영 배포 스크립트"
    echo ""
    echo "사용법: $0 [옵션] <서버주소>"
    echo ""
    echo "옵션:"
    echo "  -h, --help          이 도움말 표시"
    echo "  --no-backup         배포 전 백업 건너뛰기"
    echo "  --user <사용자>     배포 사용자 (기본값: ubuntu)"
    echo "  --path <경로>       배포 경로 (기본값: /var/www/talez)"
    echo ""
    echo "예시:"
    echo "  $0 192.168.1.100"
    echo "  $0 --user deployer --path /home/deployer/talez example.com"
    exit 1
}

# 인자 파싱
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            usage
            ;;
        --no-backup)
            BACKUP_BEFORE_DEPLOY=false
            shift
            ;;
        --user)
            DEPLOY_USER="$2"
            shift 2
            ;;
        --path)
            DEPLOY_PATH="$2"
            shift 2
            ;;
        *)
            if [ -z "$DEPLOY_HOST" ]; then
                DEPLOY_HOST="$1"
            else
                error "알 수 없는 인자: $1"
                usage
            fi
            shift
            ;;
    esac
done

# 필수 인자 검증
if [ -z "$DEPLOY_HOST" ]; then
    error "서버 주소가 필요합니다."
    usage
fi

log "TALEZ 운영 배포 시작"
log "서버: $DEPLOY_USER@$DEPLOY_HOST"
log "경로: $DEPLOY_PATH"

# 사전 검증
log "사전 검증 실행 중..."

# 1. 필요한 파일 존재 확인
required_files=(
    ".env.production"
    "Dockerfile.production"
    "$DOCKER_COMPOSE_FILE"
    "nginx/nginx.conf"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        error "필수 파일이 없습니다: $file"
        exit 1
    fi
done

# 2. Docker 이미지 빌드 테스트
log "Docker 이미지 빌드 테스트 중..."
if ! docker build -f Dockerfile.production -t talez-test .; then
    error "Docker 이미지 빌드 실패"
    exit 1
fi

# 테스트 이미지 정리
docker rmi talez-test

success "사전 검증 완료"

# 서버 연결 테스트
log "서버 연결 테스트 중..."
if ! ssh -o ConnectTimeout=10 "$DEPLOY_USER@$DEPLOY_HOST" "echo 'SSH 연결 성공'"; then
    error "서버에 연결할 수 없습니다: $DEPLOY_USER@$DEPLOY_HOST"
    exit 1
fi

success "서버 연결 확인"

# 배포 전 백업 (선택적)
if [ "$BACKUP_BEFORE_DEPLOY" = true ]; then
    log "배포 전 백업 생성 중..."
    ssh "$DEPLOY_USER@$DEPLOY_HOST" "
        cd $DEPLOY_PATH || exit 1
        if [ -f docker-compose.production.yml ]; then
            docker-compose -f docker-compose.production.yml exec -T db-backup /backup.sh
            echo '백업 완료'
        else
            echo '기존 배포가 없어 백업을 건너뜁니다.'
        fi
    " || warning "백업 실패 - 계속 진행합니다."
fi

# 소스 코드 배포
log "소스 코드 배포 중..."

# 배포할 파일 목록 생성
rsync -avz --progress \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='dist' \
    --exclude='logs' \
    --exclude='uploads' \
    --exclude='.env' \
    --exclude='.env.local' \
    ./ "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/"

success "소스 코드 배포 완료"

# 원격 서버에서 배포 실행
log "원격 서버에서 배포 실행 중..."

ssh "$DEPLOY_USER@$DEPLOY_HOST" "
    set -e
    cd $DEPLOY_PATH

    echo '[배포] 환경 확인 중...'
    if [ ! -f .env.production ]; then
        echo 'ERROR: .env.production 파일이 없습니다.'
        exit 1
    fi

    echo '[배포] 이전 컨테이너 중지 중...'
    if [ -f $DOCKER_COMPOSE_FILE ]; then
        docker-compose -f $DOCKER_COMPOSE_FILE down || true
    fi

    echo '[배포] Docker 이미지 빌드 중...'
    docker-compose -f $DOCKER_COMPOSE_FILE build --no-cache

    echo '[배포] 컨테이너 시작 중...'
    docker-compose -f $DOCKER_COMPOSE_FILE up -d

    echo '[배포] 헬스체크 대기 중...'
    sleep 30
    
    # 헬스체크
    for i in {1..12}; do
        if curl -f http://localhost/health > /dev/null 2>&1; then
            echo '헬스체크 성공'
            break
        fi
        if [ \$i -eq 12 ]; then
            echo 'ERROR: 헬스체크 실패'
            docker-compose -f $DOCKER_COMPOSE_FILE logs app
            exit 1
        fi
        echo \"헬스체크 재시도 (\$i/12)...\"
        sleep 10
    done

    echo '[배포] 불필요한 Docker 이미지 정리 중...'
    docker image prune -f

    echo '[배포] 컨테이너 상태 확인...'
    docker-compose -f $DOCKER_COMPOSE_FILE ps
"

success "배포 완료!"

# 배포 후 검증
log "배포 검증 중..."

# 1. 서비스 상태 확인
if ssh "$DEPLOY_USER@$DEPLOY_HOST" "curl -f http://localhost/health" > /dev/null 2>&1; then
    success "서비스 상태: 정상"
else
    error "서비스 상태: 비정상"
    ssh "$DEPLOY_USER@$DEPLOY_HOST" "cd $DEPLOY_PATH && docker-compose -f $DOCKER_COMPOSE_FILE logs --tail=50 app"
    exit 1
fi

# 2. 컨테이너 상태 확인
CONTAINER_STATUS=$(ssh "$DEPLOY_USER@$DEPLOY_HOST" "cd $DEPLOY_PATH && docker-compose -f $DOCKER_COMPOSE_FILE ps --format table")
log "컨테이너 상태:"
echo "$CONTAINER_STATUS"

# 3. 디스크 사용량 확인
DISK_USAGE=$(ssh "$DEPLOY_USER@$DEPLOY_HOST" "df -h $DEPLOY_PATH | tail -1 | awk '{print \$5}'")
log "디스크 사용량: $DISK_USAGE"

if [[ ${DISK_USAGE%\%} -gt 90 ]]; then
    warning "디스크 사용량이 높습니다: $DISK_USAGE"
fi

# 배포 완료 메시지
success "🎉 TALEZ 운영 배포가 성공적으로 완료되었습니다!"
log "서비스 URL: https://$DEPLOY_HOST"
log "배포 시간: $(date)"

# 유용한 명령어 안내
log ""
log "📝 유용한 명령어:"
log "   로그 확인: ssh $DEPLOY_USER@$DEPLOY_HOST 'cd $DEPLOY_PATH && docker-compose -f $DOCKER_COMPOSE_FILE logs -f app'"
log "   서비스 재시작: ssh $DEPLOY_USER@$DEPLOY_HOST 'cd $DEPLOY_PATH && docker-compose -f $DOCKER_COMPOSE_FILE restart app'"
log "   백업 생성: ssh $DEPLOY_USER@$DEPLOY_HOST 'cd $DEPLOY_PATH && docker-compose -f $DOCKER_COMPOSE_FILE exec db-backup /backup.sh'"
log ""
log "🎯 배포 완료 체크리스트:"
log "   □ 웹사이트 접속 확인"
log "   □ 로그인/회원가입 테스트"
log "   □ 결제 시스템 테스트"
log "   □ 모니터링 시스템 확인"