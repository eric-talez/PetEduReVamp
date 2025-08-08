module.exports = {
  apps: [
    {
      name: 'talez-production',
      script: 'dist/index.js',
      instances: 'max', // 클러스터 모드로 CPU 코어 수만큼 인스턴스 생성
      exec_mode: 'cluster',
      
      // 환경 설정
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      
      // 메모리 및 성능 설정
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 5,
      
      // 로그 설정
      log_file: './logs/production.log',
      error_file: './logs/production-error.log',
      out_file: './logs/production-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // 자동 재시작 설정
      watch: false, // 운영환경에서는 watch 비활성화
      ignore_watch: ['node_modules', 'logs', 'uploads'],
      
      // 헬스 체크
      health_check_grace_period: 3000,
      health_check_fatal_timeout: 5000,
      
      // 클러스터 설정
      instance_var: 'INSTANCE_ID',
      
      // 자동 로드 밸런싱
      listen_timeout: 8000,
      kill_timeout: 5000,
      
      // 성능 모니터링
      pmx: true,
      
      // 환경별 설정
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
        LOG_LEVEL: 'warn'
      }
    }
  ],
  
  // 배포 설정
  deploy: {
    production: {
      user: 'ubuntu',
      host: ['your-server-ip'],
      ref: 'origin/main',
      repo: 'git@github.com:your-username/talez.git',
      path: '/var/www/talez',
      'pre-deploy-local': '',
      'post-deploy': 'npm ci --production && npm run build && pm2 reload ecosystem.config.production.cjs --env production',
      'pre-setup': '',
      'ssh_options': 'StrictHostKeyChecking=no'
    }
  }
};