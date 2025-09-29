
# Replit Deploy 환경변수 설정 가이드

## 필수 환경변수 목록

Replit Deploy에서 다음 환경변수들을 설정해야 합니다:

### 1. 기본 설정
```
NODE_ENV=production
PORT=5000
```

### 2. 세션/보안
```
SESSION_SECRET=talez-super-secure-session-secret-2025-production
JWT_SECRET=talez-jwt-secret-key-2025
ENCRYPTION_KEY=talez-32-character-encryption-key
```

### 3. CORS 및 쿠키 도메인
```
CORS_ORIGIN=https://your-deploy-domain.replit.app,https://your-custom-domain.com
COOKIE_DOMAIN=.your-custom-domain.com
REPLIT_DEV_DOMAIN=your-deploy-domain.replit.app
```

### 4. 외부 서비스 API
```
OPENAI_API_KEY=sk-your-openai-key
KAKAO_MAPS_API_KEY=your-kakao-maps-key
KAKAO_CLIENT_ID=your-kakao-oauth-id
NAVER_CLIENT_ID=your-naver-oauth-id
NAVER_CLIENT_SECRET=your-naver-oauth-secret
```

### 5. 데이터베이스 (선택사항)
```
DATABASE_URL=postgresql://user:password@host:port/database
```

## 설정 방법

1. Replit에서 **Deploy** 탭 클릭
2. **Environment Variables** 섹션에서 위 변수들 추가
3. **Save** 후 다시 배포

## CORS 문제 해결

만약 크로스 도메인 이슈가 발생하면:

1. `CORS_ORIGIN`에 프론트엔드 도메인을 정확히 입력
2. 쿠키 문제가 있다면 `COOKIE_DOMAIN` 설정
3. 모든 요청에 `credentials: 'include'` 포함 확인

## OAuth 리다이렉트 URL 업데이트

### 네이버 개발자센터
- 콜백 URL: `https://your-domain.com/api/auth/naver/callback`

### 카카오 개발자센터  
- Redirect URI: `https://your-domain.com/api/auth/kakao/callback`

## 트러블슈팅

### 로그인이 안 되는 경우
1. 브라우저 개발자 도구 → Network 탭에서 Set-Cookie 헤더 확인
2. CORS 에러가 보이면 `CORS_ORIGIN` 환경변수 재확인
3. 쿠키가 저장되지 않으면 HTTPS 사용 여부 확인

### 세션이 유지되지 않는 경우
1. `SESSION_SECRET` 환경변수 설정 확인
2. 쿠키 SameSite 설정이 브라우저와 호환되는지 확인
3. 프록시 설정(`trust proxy`) 확인
