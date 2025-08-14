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

## 주의사항

- EC2 인스턴스에 Node.js, npm, PM2, Git이 미리 설치되어 있어야 합니다
- 홈 디렉토리에 `funnytalez_www` 폴더가 Git 리포지토리로 설정되어 있어야 합니다
- `copy-static-files.sh` 스크립트가 실행 가능해야 합니다
- PM2 프로세스명이 `talez-service`로 설정되어 있어야 합니다

## 트러블슈팅

- 배포 실패 시 GitHub Actions 로그를 확인하세요
- EC2 키 권한이 600으로 설정되는지 확인하세요
- 보안 그룹에서 SSH 접속이 허용되어 있는지 확인하세요