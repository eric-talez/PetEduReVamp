# 정적 파일 배포 가이드

## 🚨 문제점
- 로고 파일들이 `/var/www/funnytalez/public`에 있음
- Nginx는 `/var/www/funnytalez/dist/public`에서 정적 파일 서빙
- 빌드 과정에서 정적 파일들이 복사되지 않음

## ✅ 해결 방안

### 1. 정적 파일 복사 스크립트 생성
```bash
# copy-static-files.sh
- 로고 파일 (logo*.svg, favicon.svg)
- 이미지 파일 (images/, *.jpg, *.png)
- 관리자 파일 (admin/)
- 업로드 파일 (uploads/)
- 자막 파일 (subtitles/)
- 로케일 파일 (locales/)
- assets 폴더 내용
```

### 2. 통합 빌드 스크립트
```bash
# build-with-static.sh
1. vite build (클라이언트 빌드)
2. esbuild (서버 빌드)
3. copy-static-files.sh (정적 파일 복사)
```

### 3. 배포 스크립트 업데이트
- `deploy-for-nginx.sh`: 빌드 후 정적 파일 복사 추가
- `production-env-setup.sh`: 환경 설정 후 정적 파일 복사 추가

## 🚀 서버에서 실행할 명령어

### 즉시 해결 방법 (서버에서 실행)
```bash
# 1. 프로젝트 디렉토리로 이동
cd /var/www/funnytalez

# 2. 정적 파일 복사 스크립트 실행
chmod +x copy-static-files.sh
./copy-static-files.sh

# 3. 결과 확인
ls -la dist/public/logo*.svg
ls -la dist/public/favicon.svg
ls -la dist/public/images/
```

### 전체 배포 (권장)
```bash
# 1. 프로젝트 디렉토리로 이동
cd /var/www/funnytalez

# 2. 통합 빌드 스크립트 실행
chmod +x build-with-static.sh
./build-with-static.sh

# 3. PM2 재시작
pm2 restart funnytalez-backend-prod
```

## 📋 복사되는 파일 목록

### 로고 파일들
- logo.svg
- logo-dark.svg
- logo-light.svg
- logo-compact.svg
- logo-compact-dark.svg
- logo-symbol.svg
- favicon.svg

### 이미지 파일들
- images/ 폴더 전체
- *.jpg, *.png 파일들
- pet_event_banner.jpg

### 기타 파일들
- admin/ 폴더 (관리자 페이지)
- uploads/ 폴더 (업로드 파일)
- subtitles/ 폴더 (자막 파일)
- locales/ 폴더 (다국어 파일)
- assets/ 폴더 내용

## 🔍 확인 방법

### 배포 후 확인
```bash
# 로고 파일 확인
curl https://funnytalez.com/logo.svg
curl https://funnytalez.com/favicon.svg

# 이미지 파일 확인
curl https://funnytalez.com/images/wangzzang/logo.png

# 관리자 파일 확인
curl https://funnytalez.com/admin/dashboard.html
```

### 웹사이트에서 확인
- 메인 페이지 로고 표시 여부
- 파비콘 표시 여부
- 관리자 페이지 이미지 로드 여부
- 업로드된 파일 접근 가능 여부

## 🔧 향후 배포 시 주의사항

### 자동화된 배포 프로세스
1. `npm run build` → 클라이언트 빌드
2. `copy-static-files.sh` → 정적 파일 복사
3. `pm2 restart` → 서버 재시작

### 새로운 정적 파일 추가 시
- `public/` 폴더에 파일 추가
- `copy-static-files.sh` 스크립트에 복사 명령 추가
- 배포 시 자동으로 복사됨

이제 로고와 모든 정적 파일들이 올바르게 서빙될 것입니다.