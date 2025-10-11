#!/bin/bash
set -e

echo "🔨 Building TALEZ for production..."

# 1. Vite 빌드 (프론트엔드)
echo "📦 Building frontend with Vite..."
npm run build 2>&1 | grep -v "Use of eval" || true

# 2. 빌드된 파일을 서버 디렉토리로 복사
echo "📁 Copying built files to server/public..."
rm -rf server/public
cp -r dist/public server/public

# 3. 백엔드 빌드 (이미 npm run build에 포함됨)
echo "✅ Production build complete!"
echo "📂 Frontend files: server/public"
echo "📂 Backend files: dist/index.js"
echo ""
echo "🚀 To start in production mode:"
echo "   NODE_ENV=production node dist/index.js"
