# GitHub Actions 배포 워크플로우 (간소화된 2단계 프로세스)

## 현재 활성 워크플로우
- **deploy.yml**: 빌드 테스트 → AWS 운영서버 배포 (2단계)
- 기타 워크플로우들 (ci-cd.yml, docker.yml, netlify.yml)은 비활성화됨

## 설정 방법

GitHub 리포지토리 Settings > Secrets and variables > Actions에서 다음 시크릿을 설정해주세요:

### AWS 관련 시크릿
- `AWS_ACCESS_KEY_ID`: AWS 액세스 키 ID
- `AWS_SECRET_ACCESS_KEY`: AWS 시크릿 액세스 키  
- `AWS_REGION`: AWS 리전 (예: ap-northeast-2)

### EC2 관련 시크릿
- `EC2_HOST`: EC2 인스턴스 공개 IP 또는 도메인
- `EC2_USER`: EC2 사용자명 (예: ubuntu, ec2-user)
- `EC2_KEY`: EC2 인스턴스 접속용 프라이빗 키 (PEM 파일 내용)
- `SECURITY_GROUP_ID`: EC2 보안 그룹 ID

### GitHub 관련 시크릿
- `GH_TOKEN`: GitHub Personal Access Token
- `GH_USERNAME`: GitHub 사용자명

## 배포 프로세스 (2단계)

### Step 1: 빌드 테스트
1. 소스코드 체크아웃
2. Node.js 환경 설정
3. 의존성 설치 (npm install)
4. 빌드 테스트 (npm run build)
5. 정적 파일 복사 (copy-static-files.sh)
6. 빌드 결과물을 아티팩트로 저장

### Step 2: AWS 운영서버 배포
1. 빌드 아티팩트 다운로드
2. AWS 자격증명 구성
3. EC2 서버 접속
4. 홈 디렉토리에서 Git pull, npm install, npm run build
5. 기존 운영 소스 백업 (타임스탬프 기반)
6. 운영 폴더 정리 (rm -rf {.,}*)
7. 새 소스 이동 (mv {.,}* /var/www/funnytalez/)
8. PM2 서비스 재시작 (pm2 restart talez-service)

**실행 조건:**
- main/master 브랜치 푸시 시 자동 실행
- GitHub Actions 탭에서 수동 실행 가능

## 주요 개선사항 (참고 파일 기반)

### SSH 연결 개선
- **동적 IP 관리**: GitHub Actions Runner IP를 자동으로 가져와서 보안 그룹에 임시 추가
- **SSH 디렉토리 생성**: ~/.ssh 디렉토리 자동 생성으로 known_hosts 오류 해결
- **연결 안정성**: ConnectTimeout, ServerAliveInterval 등 SSH 옵션 추가
- **보안 강화**: 배포 완료 후 보안 그룹에서 SSH 접근 자동 제거

### Git 작업 개선
- **인증 토큰**: GH_TOKEN을 환경변수로 전달하여 Git 작업 시 인증
- **다중 전략**: git pull 실패 시 force pull, re-clone 등 대안 전략 적용
- **검증 강화**: package.json 존재 확인 및 디렉토리 상태 검증

## 필수 사전 설정

- EC2 인스턴스에 Node.js, npm, PM2, Git, zip 패키지 설치
- AWS 보안 그룹이 동적 IP 추가/제거를 허용하도록 설정
- 홈 디렉토리에 `funnytalez_www` 폴더 자동 생성 (없으면 자동 클론)
- `copy-static-files.sh` 스크립트 실행 권한 설정
- PM2 프로세스명 `talez-service` 사용

## 트러블슈팅

### SSH 연결 오류
- **해결됨**: 동적 IP 기반 보안 그룹 관리로 SSH 접근 자동화
- GitHub Actions Runner IP가 자동으로 보안 그룹에 추가/제거됨

### Git 인증 오류
- **해결됨**: GH_TOKEN을 사용한 인증으로 private 리포지토리 접근 가능
- 다중 pull 전략으로 Git 작업 안정성 향상

### 배포 실패 시 확인사항
1. GitHub Actions 로그에서 상세 오류 확인
2. AWS 자격증명 시크릿 설정 확인
3. EC2 인스턴스 상태 및 필수 패키지 설치 확인
4. 보안 그룹 규칙 및 권한 확인