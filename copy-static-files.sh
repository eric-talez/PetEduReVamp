#!/bin/bash

echo "📂 정적 파일 복사 시작..."

# 소스 디렉토리 확인
if [ ! -d "public" ]; then
    echo "❌ public 디렉토리가 없습니다."
    exit 1
fi

# 대상 디렉토리 확인
if [ ! -d "dist/public" ]; then
    echo "❌ dist/public 디렉토리가 없습니다. 먼저 빌드를 실행하세요."
    exit 1
fi

# 정적 파일 복사 (덮어쓰기)
echo "🔄 로고 파일 복사 중..."
cp -f public/logo*.svg dist/public/ 2>/dev/null || echo "로고 파일 복사 실패"

echo "🔄 파비콘 복사 중..."
cp -f public/favicon.svg dist/public/ 2>/dev/null || echo "파비콘 복사 실패"

echo "🔄 이미지 파일 복사 중..."
cp -rf public/images dist/public/ 2>/dev/null || echo "이미지 폴더 복사 실패"

echo "🔄 기타 정적 파일 복사 중..."
cp -f public/*.jpg dist/public/ 2>/dev/null || echo "JPG 파일 복사 실패"
cp -f public/*.png dist/public/ 2>/dev/null || echo "PNG 파일 복사 실패"

echo "🔄 관리자 파일 복사 중..."
cp -rf public/admin dist/public/ 2>/dev/null || echo "관리자 파일 복사 실패"

echo "🔄 업로드 파일 복사 중..."
cp -rf public/uploads dist/public/ 2>/dev/null || echo "업로드 파일 복사 실패"

echo "🔄 자막 파일 복사 중..."
cp -rf public/subtitles dist/public/ 2>/dev/null || echo "자막 파일 복사 실패"

echo "🔄 로케일 파일 복사 중..."
cp -rf public/locales dist/public/ 2>/dev/null || echo "로케일 파일 복사 실패"

echo "🔄 assets 폴더 복사 중..."
cp -rf public/assets/* dist/public/assets/ 2>/dev/null || echo "assets 폴더 복사 실패"

echo "✅ 정적 파일 복사 완료!"

# 복사된 파일 확인
echo "📋 복사된 로고 파일:"
ls -la dist/public/logo*.svg 2>/dev/null || echo "로고 파일 없음"

echo "📋 복사된 파비콘:"
ls -la dist/public/favicon.svg 2>/dev/null || echo "파비콘 없음"

echo "📋 복사된 이미지 폴더:"
ls -la dist/public/images/ 2>/dev/null || echo "이미지 폴더 없음"