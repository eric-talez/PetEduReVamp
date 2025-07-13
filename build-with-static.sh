#!/bin/bash

echo "🔨 빌드 및 정적 파일 복사 시작..."

# 1. 기존 빌드 실행
echo "📦 Vite 빌드 실행 중..."
vite build

# 2. 서버 빌드 실행
echo "🖥️  서버 빌드 실행 중..."
esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# 3. 정적 파일 복사
echo "📂 정적 파일 복사 실행 중..."
./copy-static-files.sh

echo "✅ 빌드 및 정적 파일 복사 완료!"

# 빌드 결과 확인
echo "📋 빌드 결과:"
echo "- 서버 파일: $(ls -la dist/index.js 2>/dev/null || echo '없음')"
echo "- 클라이언트 파일: $(ls -la dist/public/index.html 2>/dev/null || echo '없음')"
echo "- 로고 파일: $(ls -la dist/public/logo*.svg 2>/dev/null || echo '없음')"