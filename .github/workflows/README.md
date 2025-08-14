# GitHub Actions 배포 워크플로우

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

## 배포 프로세스

1. **main/master 브랜치에 푸시** 시 자동 배포 실행
2. **수동 배포**도 GitHub Actions 탭에서 가능

### 배포 단계:
1. 소스코드 체크아웃
2. Node.js 환경 설정
3. AWS 자격증명 구성
4. EC2 서버 접속
5. Git pull로 최신 소스 업데이트
6. npm install & npm run build
7. 정적 파일 복사 (copy-static-files.sh)
8. 기존 운영 소스 백업 (타임스탬프 기반)
9. 운영 폴더 정리 및 새 소스 배포
10. PM2로 서비스 재시작

## 주의사항

- EC2 인스턴스에 Node.js, npm, PM2, Git이 미리 설치되어 있어야 합니다
- 홈 디렉토리에 `funnytalez_www` 폴더가 Git 리포지토리로 설정되어 있어야 합니다
- `copy-static-files.sh` 스크립트가 실행 가능해야 합니다
- PM2 프로세스명이 `talez-service`로 설정되어 있어야 합니다

## 트러블슈팅

- 배포 실패 시 GitHub Actions 로그를 확인하세요
- EC2 키 권한이 600으로 설정되는지 확인하세요
- 보안 그룹에서 SSH 접속이 허용되어 있는지 확인하세요