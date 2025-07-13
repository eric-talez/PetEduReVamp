export default {
  apps: [
    {
      name: 'talez-service',
      script: 'dist/index.js',
      interpreter: 'node',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
        SESSION_SECRET: 'talez-super-secure-session-secret-2025-production-ready',
        CORS_ORIGIN: '*',
        ENCRYPTION_KEY: 'talez-32-character-encryption-key',
        VITE_KAKAO_MAPS_API_KEY: 'ce38e8a3c2b566aeb9faf4c60b0153d2',
        KAKAO_MAPS_API_KEY: 'ce38e8a3c2b566aeb9faf4c60b0153d2',
        OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'sk-your-openai-key-here'
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      ignore_watch: [
        'node_modules',
        'logs',
        '.git'
      ],
      merge_logs: true,
      kill_timeout: 5000,
      listen_timeout: 10000,
      wait_ready: true
    }
  ]
};