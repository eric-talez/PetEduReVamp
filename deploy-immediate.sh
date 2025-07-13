#!/bin/bash

# TALEZ 즉시 배포 스크립트
# 이 스크립트는 EC2 서버에서 실행되어야 합니다

echo "🚀 TALEZ 즉시 배포 스크립트 시작..."

# 환경 변수 설정
export NODE_ENV=production
export PORT=3000

# 프로젝트 디렉토리로 이동
cd /home/ec2-user/talez-service || {
    echo "❌ 프로젝트 디렉토리가 없습니다. 먼저 코드를 클론해주세요."
    exit 1
}

# Git 최신 변경사항 가져오기
echo "📥 최신 코드 업데이트 중..."
git pull origin main

# 의존성 설치
echo "📦 의존성 설치 중..."
npm install

# 빌드
echo "🔧 프로덕션 빌드 중..."
npm run build

# 빌드 성공 확인
if [ -f "dist/index.js" ]; then
    echo "✅ 빌드 성공: dist/index.js 생성됨"
else
    echo "❌ 빌드 실패: dist/index.js 없음"
    exit 1
fi

# PM2로 서비스 시작/재시작
echo "🔄 PM2 서비스 재시작 중..."
pm2 restart talez-service || pm2 start dist/index.js --name talez-service

# 상태 확인
echo "📊 서비스 상태 확인 중..."
pm2 status talez-service

# 로그 확인
echo "📋 최근 로그 확인..."
pm2 logs talez-service --lines 10

echo "🎉 배포 완료!"
echo "서비스 URL: http://your-server-ip:3000"
echo "상태 확인: pm2 status talez-service"
echo "로그 확인: pm2 logs talez-service"