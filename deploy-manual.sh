#!/bin/bash

# 수동 배포 스크립트 (로컬에서 직접 EC2로 배포)
# 사용법: ./deploy-manual.sh [EC2_HOST] [EC2_USER] [KEY_FILE]

set -e

# 파라미터 확인
if [ $# -lt 3 ]; then
  echo "사용법: $0 [EC2_HOST] [EC2_USER] [KEY_FILE]"
  echo "예시: $0 ec2-xx-xx-xx-xx.compute-1.amazonaws.com ubuntu ~/.ssh/my-key.pem"
  exit 1
fi

EC2_HOST=$1
EC2_USER=$2
KEY_FILE=$3

echo "🚀 수동 배포 시작..."
echo "📡 대상 서버: $EC2_USER@$EC2_HOST"

# 키 파일 권한 확인
chmod 600 "$KEY_FILE"

# SSH 연결 테스트
echo "🔗 SSH 연결 테스트 중..."
ssh -i "$KEY_FILE" -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" "echo '✅ SSH 연결 성공'"

# 로컬 빌드
echo "🔨 로컬 빌드 실행 중..."
npm install
npm run build
./copy-static-files.sh

# 빌드 파일 압축
echo "📦 빌드 파일 압축 중..."
tar -czf deploy.tar.gz -C dist .

# 서버로 파일 전송
echo "📤 서버로 파일 전송 중..."
scp -i "$KEY_FILE" -o StrictHostKeyChecking=no deploy.tar.gz "$EC2_USER@$EC2_HOST:~/"

# 서버에서 배포 실행
echo "🚀 서버에서 배포 실행 중..."
ssh -i "$KEY_FILE" -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" << 'EOF'
  set -e
  
  echo "📁 배포 디렉토리 준비 중..."
  mkdir -p ~/deployment_temp
  cd ~/deployment_temp
  
  # 업로드된 파일 압축 해제
  tar -xzf ~/deploy.tar.gz
  
  # 백업 생성
  BACKUP_NAME="funnytalez_manual_$(date +%Y%m%d%H%M%S).zip"
  echo "💾 백업 생성: $BACKUP_NAME"
  
  sudo mkdir -p /var/www/backup
  if [ -d "/var/www/funnytalez" ] && [ "$(ls -A /var/www/funnytalez 2>/dev/null)" ]; then
    sudo zip -r "/var/www/backup/$BACKUP_NAME" /var/www/funnytalez/ 2>/dev/null || echo "⚠️ 백업 중 일부 파일 제외됨"
    echo "✅ 백업 완료: /var/www/backup/$BACKUP_NAME"
  fi
  
  # 운영 폴더 정리 및 새 파일 배포
  echo "🗑️ 운영 폴더 정리 중..."
  sudo rm -rf /var/www/funnytalez/* /var/www/funnytalez/.[^.]* 2>/dev/null || true
  
  echo "📁 새 파일 배포 중..."
  sudo mkdir -p /var/www/funnytalez
  sudo cp -r * /var/www/funnytalez/ 2>/dev/null || true
  sudo cp -r .[^.]* /var/www/funnytalez/ 2>/dev/null || true
  
  # 권한 설정
  sudo chown -R www-data:www-data /var/www/funnytalez
  sudo chmod -R 755 /var/www/funnytalez
  
  # 운영 의존성 설치 (package.json이 있는 경우)
  if [ -f "/var/www/funnytalez/package.json" ]; then
    echo "📦 운영 의존성 설치 중..."
    cd /var/www/funnytalez
    sudo -u www-data npm install --production
  fi
  
  # PM2 재시작
  echo "🔄 서비스 재시작 중..."
  pm2 restart talez-service || pm2 start /var/www/funnytalez/ecosystem.config.cjs --name talez-service
  
  # 정리
  rm -rf ~/deployment_temp ~/deploy.tar.gz
  
  echo "✅ 배포 완료!"
  pm2 status talez-service
EOF

# 로컬 정리
rm -f deploy.tar.gz

echo "🎉 수동 배포 완료!"
echo "📊 배포 상태 확인: ssh -i $KEY_FILE $EC2_USER@$EC2_HOST 'pm2 status'"