# 보안 가이드라인

## SESSION_SECRET 관리

### 환경별 SESSION_SECRET 설정

**개발 환경:**
```bash
export SESSION_SECRET="talez-super-secure-session-secret-2025-development"
```

**프로덕션 환경:**
```bash
# 32바이트 이상의 강력한 랜덤 문자열 사용
export SESSION_SECRET="$(openssl rand -base64 32)"
```

### SESSION_SECRET 로테이션 가이드라인

1. **정기 로테이션**: 최소 90일마다 SESSION_SECRET 변경
2. **보안 사고 시**: 즉시 SESSION_SECRET 변경
3. **배포 시**: 새로운 환경에는 반드시 새로운 SECRET 생성

### 로테이션 절차:
```bash
# 1. 새로운 SECRET 생성
NEW_SECRET=$(openssl rand -base64 32)

# 2. 환경 변수 업데이트
export SESSION_SECRET="$NEW_SECRET"

# 3. 애플리케이션 재시작
# 주의: 기존 세션은 모두 무효화됨
```

## CSRF 보호 사용법

### 프론트엔드에서 CSRF 토큰 사용:

```javascript
// 1. CSRF 토큰 가져오기
const response = await fetch('/api/auth/csrf');
const { csrfToken } = await response.json();

// 2. 요청 시 헤더에 포함
fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken
  },
  body: JSON.stringify({ username, password })
});
```

## 보안 체크리스트

- [ ] SESSION_SECRET가 환경 변수로 설정됨
- [ ] 프로덕션에서 HTTPS 사용
- [ ] secure 쿠키 설정 확인
- [ ] CSRF 보호 활성화
- [ ] 레이트 리미팅 설정
- [ ] 민감한 파일 .gitignore 추가

## 모니터링

다음 항목들을 정기적으로 모니터링하세요:
- 실패한 로그인 시도
- CSRF 공격 시도
- 비정상적인 세션 활동
- 레이트 리미트 초과