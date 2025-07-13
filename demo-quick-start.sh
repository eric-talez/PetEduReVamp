#!/bin/bash

echo "🎯 TALEZ 서비스 시연 준비 스크립트"
echo "=================================="

# 1. 서비스 상태 확인
echo "📊 서비스 상태 확인 중..."
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health)
if [ "$API_STATUS" = "200" ]; then
    echo "✅ API 서버 정상 동작"
else
    echo "❌ API 서버 상태 이상 (HTTP $API_STATUS)"
    exit 1
fi

# 2. 정적 파일 확인
echo "🖼️  정적 파일 확인 중..."
if [ -f "dist/public/logo.svg" ]; then
    echo "✅ 로고 파일 정상"
else
    echo "⚠️  로고 파일 복사 필요"
    ./copy-static-files.sh
fi

# 3. 환경 변수 확인
echo "🔐 환경 변수 확인 중..."
if [ -f ".env" ]; then
    echo "✅ 환경 변수 파일 존재"
else
    echo "⚠️  환경 변수 파일 생성 필요"
    ./production-env-setup.sh
fi

# 4. 데이터베이스 연결 확인
echo "🗃️  데이터베이스 연결 확인 중..."
DB_STATUS=$(curl -s http://localhost:5000/api/dashboard/stats | grep -o '"totalUsers":[0-9]*' | cut -d':' -f2)
if [ "$DB_STATUS" -gt 0 ]; then
    echo "✅ 데이터베이스 연결 정상 (사용자 수: $DB_STATUS)"
else
    echo "⚠️  데이터베이스 연결 확인 필요"
fi

# 5. 시연 계정 정보 표시
echo ""
echo "🎭 시연용 계정 정보"
echo "==================="
echo "일반 사용자: test / test123"
echo "훈련사: trainer / trainer123"
echo "관리자: admin / admin123"
echo "기관: institute / institute123"
echo ""

# 6. 시연 URL 정보
echo "🌐 시연 URL 정보"
echo "==============="
echo "메인 페이지: http://localhost:5000"
echo "로그인 페이지: http://localhost:5000/login"
echo "관리자 페이지: http://localhost:5000/admin"
echo "쇼핑몰: http://localhost:5000/shop"
echo "커뮤니티: http://localhost:5000/community"
echo ""

# 7. 시연 시나리오 안내
echo "🎬 시연 시나리오"
echo "==============="
echo "1. 메인 페이지 → 서비스 소개"
echo "2. test 로그인 → 일반 사용자 여정"
echo "3. trainer 로그인 → 훈련사 기능"
echo "4. admin 로그인 → 관리자 시스템"
echo "5. 쇼핑몰 → 상품 구매 과정"
echo ""

# 8. 브라우저 시작 안내
echo "🔗 브라우저 시작"
echo "==============="
echo "Chrome 또는 Firefox에서 다음 URL을 열어주세요:"
echo "http://localhost:5000"
echo ""

# 9. 시연 준비 완료 확인
echo "✅ 시연 준비 완료!"
echo "📋 시연 중 확인할 포인트:"
echo "   - 로고 및 이미지 정상 표시"
echo "   - 빠른 로그인 기능 동작"
echo "   - AI 분석 기능 테스트"
echo "   - 실시간 채팅 기능"
echo "   - 반응형 디자인 확인"
echo ""

# 10. 성능 모니터링 명령어
echo "📊 성능 모니터링 명령어"
echo "====================="
echo "실시간 로그: curl -s http://localhost:5000/api/health"
echo "시스템 상태: curl -s http://localhost:5000/api/dashboard/stats"
echo "메모리 사용량: ps aux | grep node"
echo ""

echo "🎯 시연을 시작하세요!"