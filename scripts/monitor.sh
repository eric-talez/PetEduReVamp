#!/bin/bash

# TALEZ Production Monitoring Script
# 시스템 상태를 모니터링하고 알림을 보냅니다.

set -e

# 설정
DOCKER_COMPOSE_FILE="docker-compose.production.yml"
LOG_FILE="/var/log/talez-monitor.log"
ALERT_EMAIL=""
SLACK_WEBHOOK=""

# 임계값 설정
CPU_THRESHOLD=80
MEMORY_THRESHOLD=85
DISK_THRESHOLD=90
RESPONSE_TIME_THRESHOLD=2000

# 로깅 함수
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

alert() {
    local message="$1"
    log "ALERT: $message"
    
    # 이메일 알림 (선택적)
    if [ -n "$ALERT_EMAIL" ]; then
        echo "$message" | mail -s "TALEZ 시스템 알림" "$ALERT_EMAIL"
    fi
    
    # Slack 알림 (선택적)
    if [ -n "$SLACK_WEBHOOK" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚨 TALEZ 알림: $message\"}" \
            "$SLACK_WEBHOOK"
    fi
}

# 컨테이너 상태 확인
check_containers() {
    log "컨테이너 상태 확인 중..."
    
    local containers=("talez-app" "talez-nginx" "talez-redis")
    
    for container in "${containers[@]}"; do
        if ! docker ps --format "table {{.Names}}" | grep -q "$container"; then
            alert "$container 컨테이너가 실행되지 않고 있습니다."
            return 1
        fi
    done
    
    log "모든 컨테이너가 정상 실행 중입니다."
    return 0
}

# 헬스체크
check_health() {
    log "서비스 헬스체크 실행 중..."
    
    local start_time=$(date +%s%3N)
    local response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/health)
    local end_time=$(date +%s%3N)
    local response_time=$((end_time - start_time))
    
    if [ "$response" != "200" ]; then
        alert "헬스체크 실패: HTTP $response"
        return 1
    fi
    
    if [ "$response_time" -gt "$RESPONSE_TIME_THRESHOLD" ]; then
        alert "응답 시간이 느립니다: ${response_time}ms (임계값: ${RESPONSE_TIME_THRESHOLD}ms)"
    fi
    
    log "헬스체크 성공: HTTP $response, 응답시간: ${response_time}ms"
    return 0
}

# 시스템 리소스 확인
check_resources() {
    log "시스템 리소스 확인 중..."
    
    # CPU 사용률
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')
    cpu_usage=${cpu_usage%.*}
    
    if [ "$cpu_usage" -gt "$CPU_THRESHOLD" ]; then
        alert "CPU 사용률이 높습니다: ${cpu_usage}% (임계값: ${CPU_THRESHOLD}%)"
    fi
    
    # 메모리 사용률
    local memory_info=$(free | grep Mem)
    local total_mem=$(echo $memory_info | awk '{print $2}')
    local used_mem=$(echo $memory_info | awk '{print $3}')
    local memory_usage=$((used_mem * 100 / total_mem))
    
    if [ "$memory_usage" -gt "$MEMORY_THRESHOLD" ]; then
        alert "메모리 사용률이 높습니다: ${memory_usage}% (임계값: ${MEMORY_THRESHOLD}%)"
    fi
    
    # 디스크 사용률
    local disk_usage=$(df -h / | tail -1 | awk '{print $5}' | sed 's/%//')
    
    if [ "$disk_usage" -gt "$DISK_THRESHOLD" ]; then
        alert "디스크 사용률이 높습니다: ${disk_usage}% (임계값: ${DISK_THRESHOLD}%)"
    fi
    
    log "리소스 사용률 - CPU: ${cpu_usage}%, 메모리: ${memory_usage}%, 디스크: ${disk_usage}%"
}

# 데이터베이스 연결 확인
check_database() {
    log "데이터베이스 연결 확인 중..."
    
    if ! docker-compose -f "$DOCKER_COMPOSE_FILE" exec -T app node -e "
        const { Pool } = require('@neondatabase/serverless');
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        pool.query('SELECT 1').then(() => {
            console.log('DB 연결 성공');
            process.exit(0);
        }).catch(err => {
            console.error('DB 연결 실패:', err.message);
            process.exit(1);
        });
    " > /dev/null 2>&1; then
        alert "데이터베이스 연결 실패"
        return 1
    fi
    
    log "데이터베이스 연결 정상"
    return 0
}

# 로그 에러 확인
check_logs() {
    log "최근 에러 로그 확인 중..."
    
    local error_count=$(docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=100 app 2>&1 | grep -i error | wc -l)
    
    if [ "$error_count" -gt 5 ]; then
        alert "최근 100줄 로그에서 ${error_count}개의 에러가 발견되었습니다."
        
        # 최신 에러 로그 표시
        log "최근 에러 로그:"
        docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=10 app 2>&1 | grep -i error | tail -5 >> "$LOG_FILE"
    fi
}

# SSL 인증서 만료 확인
check_ssl() {
    log "SSL 인증서 확인 중..."
    
    local cert_file="/etc/nginx/ssl/certificate.crt"
    
    if [ -f "$cert_file" ]; then
        local expiry_date=$(openssl x509 -enddate -noout -in "$cert_file" | cut -d= -f2)
        local expiry_timestamp=$(date -d "$expiry_date" +%s)
        local current_timestamp=$(date +%s)
        local days_left=$(( (expiry_timestamp - current_timestamp) / 86400 ))
        
        if [ "$days_left" -lt 30 ]; then
            alert "SSL 인증서가 ${days_left}일 후 만료됩니다. 갱신이 필요합니다."
        elif [ "$days_left" -lt 7 ]; then
            alert "SSL 인증서가 ${days_left}일 후 만료됩니다. 즉시 갱신하세요!"
        fi
        
        log "SSL 인증서 만료일: $expiry_date (${days_left}일 남음)"
    else
        log "SSL 인증서 파일을 찾을 수 없습니다: $cert_file"
    fi
}

# 백업 상태 확인
check_backups() {
    log "백업 상태 확인 중..."
    
    local backup_dir="/var/www/talez/backups"
    local latest_backup=$(find "$backup_dir" -name "talez_backup_*.custom" -type f -printf '%T@ %p\n' | sort -n | tail -1 | cut -d' ' -f2-)
    
    if [ -n "$latest_backup" ]; then
        local backup_age=$(( ($(date +%s) - $(stat -c %Y "$latest_backup")) / 86400 ))
        
        if [ "$backup_age" -gt 1 ]; then
            alert "최신 백업이 ${backup_age}일 전입니다. 백업 시스템을 확인하세요."
        fi
        
        log "최신 백업: $(basename "$latest_backup") (${backup_age}일 전)"
    else
        alert "백업 파일을 찾을 수 없습니다."
    fi
}

# 네트워크 연결 확인
check_network() {
    log "외부 네트워크 연결 확인 중..."
    
    local test_urls=("https://google.com" "https://stripe.com" "https://api.openai.com")
    
    for url in "${test_urls[@]}"; do
        if ! curl -s --connect-timeout 10 "$url" > /dev/null; then
            alert "외부 네트워크 연결 실패: $url"
        fi
    done
    
    log "외부 네트워크 연결 정상"
}

# 전체 모니터링 실행
run_monitoring() {
    log "=== TALEZ 시스템 모니터링 시작 ==="
    
    local failed_checks=0
    
    check_containers || ((failed_checks++))
    check_health || ((failed_checks++))
    check_resources
    check_database || ((failed_checks++))
    check_logs
    check_ssl
    check_backups
    check_network
    
    if [ "$failed_checks" -eq 0 ]; then
        log "모든 체크가 성공했습니다."
    else
        log "WARNING: ${failed_checks}개의 체크가 실패했습니다."
    fi
    
    log "=== 모니터링 완료 ==="
}

# 메인 실행
case "${1:-monitor}" in
    monitor)
        run_monitoring
        ;;
    containers)
        check_containers
        ;;
    health)
        check_health
        ;;
    resources)
        check_resources
        ;;
    database)
        check_database
        ;;
    ssl)
        check_ssl
        ;;
    *)
        echo "사용법: $0 [monitor|containers|health|resources|database|ssl]"
        exit 1
        ;;
esac