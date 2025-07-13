# 환경 변수 설정 가이드

## 🔑 현재 누락된 API 키들

### 1. OpenAI API Key
```bash
# .env 파일에 추가
OPENAI_API_KEY=sk-your-actual-openai-api-key
```

### 2. Kakao Maps API Key
```bash
# .env 파일에 추가 (서버용)
KAKAO_MAPS_API_KEY=your-kakao-maps-api-key

# 프론트엔드용 (이미 설정됨)
VITE_KAKAO_MAPS_API_KEY=ce38e8a3c2b566aeb9faf4c60b0153d2
```

## 📍 환경 변수 파일 위치

### 개발 환경
```
/home/runner/workspace/.env
```

### 운영 환경 (현재 서버)
```
/var/www/funnytalez/.env
```

## 🔧 현재 서버에서 수정 방법

### 1. 서버 접속 후 파일 수정
```bash
# 서버 접속
ssh your-server

# 프로젝트 디렉토리로 이동
cd /var/www/funnytalez

# .env 파일 수정
nano .env

# 또는 vim 사용
vim .env
```

### 2. 추가해야 할 내용
```bash
# 현재 .env 파일에 다음 내용 추가:

# AI Services
OPENAI_API_KEY=sk-your-actual-openai-api-key-here

# Kakao Maps (서버용)
KAKAO_MAPS_API_KEY=your-kakao-maps-api-key
```

### 3. 서비스 재시작
```bash
# PM2 재시작
pm2 restart talez-service

# 또는 PM2 reload
pm2 reload talez-service
```

## 🔐 API 키 발급 방법

### OpenAI API Key
1. https://platform.openai.com 방문
2. 계정 생성/로그인
3. API Keys 섹션에서 새 키 생성
4. 키를 안전하게 복사하여 .env 파일에 추가

### Kakao Maps API Key
1. https://developers.kakao.com 방문
2. 카카오 개발자 계정 생성/로그인
3. 애플리케이션 생성
4. 지도 API 활성화
5. JavaScript 키를 .env 파일에 추가

## ⚠️ 보안 주의사항

### 1. API 키 보안
- API 키는 절대 Git에 커밋하지 마세요
- .env 파일은 .gitignore에 포함되어 있습니다
- 운영 서버에서만 실제 API 키를 사용하세요

### 2. 파일 권한 설정
```bash
# .env 파일 권한 제한
chmod 600 .env

# 소유자만 읽기/쓰기 가능하도록 설정
chown $USER:$USER .env
```

## 🔍 문제 해결

### 1. PM2 로그 확인
```bash
# 전체 로그 확인
pm2 logs

# 특정 서비스 로그 확인
pm2 logs talez-service

# 실시간 로그 모니터링
pm2 logs --follow
```

### 2. 환경 변수 확인
```bash
# PM2 환경 변수 확인
pm2 show talez-service

# 또는 직접 확인
node -e "console.log(process.env.OPENAI_API_KEY)"
```

### 3. API 키 테스트
```bash
# OpenAI API 키 테스트
curl -H "Authorization: Bearer sk-your-key" https://api.openai.com/v1/models

# Kakao Maps API 키 테스트
curl "https://dapi.kakao.com/v2/local/search/address.json?query=판교" \
  -H "Authorization: KakaoAK your-key"
```

## 📋 완료 체크리스트

- [ ] `/var/www/funnytalez/.env` 파일 수정
- [ ] `OPENAI_API_KEY` 추가 (실제 키 값으로)
- [ ] `KAKAO_MAPS_API_KEY` 추가 (실제 키 값으로)
- [ ] PM2 서비스 재시작
- [ ] 로그에서 오류 메시지 사라짐 확인
- [ ] 웹사이트 AI 기능 정상 작동 확인