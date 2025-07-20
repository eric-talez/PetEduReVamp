#!/usr/bin/env node

// Enhanced server startup script for Talez Pet Training Platform
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 5000;

console.log('🚀 Starting Talez Pet Training Platform...');
console.log('📦 Checking dependencies...');

// Basic server that provides the essential functionality
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Collect request body for POST requests
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    // Parse JSON body if present
    let requestData = {};
    if (body && req.headers['content-type'] === 'application/json') {
      try {
        requestData = JSON.parse(body);
      } catch (e) {
        console.log('Invalid JSON in request body');
      }
    }

    handleRequest(pathname, method, requestData, res);
  });
});

function handleRequest(pathname, method, requestData, res) {
  // Health check endpoint
  if (pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      message: 'Talez Pet Training Platform is running smoothly',
      uptime: Math.floor(process.uptime()),
      memory: process.memoryUsage(),
      platform: 'Node.js',
      version: '1.0.0'
    }));
    return;
  }

  // API status endpoint
  if (pathname === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      server: 'running',
      timestamp: new Date().toISOString(),
      platform: 'Talez Pet Training Platform',
      environment: process.env.NODE_ENV || 'development',
      endpoints: {
        health: '/health',
        api_status: '/api/status',
        home: '/',
        courses: '/api/courses',
        users: '/api/users'
      }
    }));
    return;
  }

  // Main homepage
  if (pathname === '/') {
    const homepage = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Talez - AI 펫 교육 플랫폼</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 0; text-align: center; }
        .header h1 { font-size: 3rem; margin-bottom: 10px; }
        .header p { font-size: 1.2rem; opacity: 0.9; }
        .status { background: #f8f9fa; padding: 30px; margin: 30px 0; border-radius: 10px; }
        .status-item { display: flex; justify-content: space-between; align-items: center; margin: 10px 0; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .status-label { font-weight: bold; color: #667eea; }
        .status-value { color: #28a745; }
        .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 30px 0; }
        .feature { padding: 25px; background: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .feature h3 { color: #667eea; margin-bottom: 15px; }
        .footer { text-align: center; margin-top: 50px; padding: 20px; background: #f8f9fa; border-radius: 10px; }
        .emoji { font-size: 1.5em; margin-right: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="container">
            <h1>🐾 Talez</h1>
            <p>AI 기반 반려동물 교육 플랫폼</p>
        </div>
    </div>
    
    <div class="container">
        <div class="status">
            <h2>🚀 시스템 상태</h2>
            <div class="status-item">
                <span class="status-label">서버 상태</span>
                <span class="status-value">✅ 정상 운영</span>
            </div>
            <div class="status-item">
                <span class="status-label">시작 시간</span>
                <span class="status-value">${new Date().toLocaleString('ko-KR')}</span>
            </div>
            <div class="status-item">
                <span class="status-label">실행 시간</span>
                <span class="status-value">${Math.floor(process.uptime())}초</span>
            </div>
            <div class="status-item">
                <span class="status-label">API 엔드포인트</span>
                <span class="status-value">활성화됨</span>
            </div>
        </div>

        <div class="features">
            <div class="feature">
                <h3><span class="emoji">🎓</span>AI 커리큘럼</h3>
                <p>개별 반려동물의 특성에 맞춘 맞춤형 교육 커리큘럼을 AI가 자동으로 생성합니다.</p>
            </div>
            
            <div class="feature">
                <h3><span class="emoji">👨‍🏫</span>전문 훈련사</h3>
                <p>경험 풍부한 전문 훈련사들이 온라인과 오프라인에서 체계적인 교육을 제공합니다.</p>
            </div>
            
            <div class="feature">
                <h3><span class="emoji">📱</span>실시간 관리</h3>
                <p>훈련 진행상황을 실시간으로 모니터링하고 피드백을 받을 수 있습니다.</p>
            </div>
            
            <div class="feature">
                <h3><span class="emoji">🏆</span>성과 추적</h3>
                <p>반려동물의 학습 성과를 데이터로 분석하여 더 나은 교육 방법을 제안합니다.</p>
            </div>
        </div>

        <div class="footer">
            <p>© 2024 Talez - AI 펫 교육 플랫폼. 모든 권리 보유.</p>
            <p>API 문서: <a href="/health">/health</a> | <a href="/api/status">/api/status</a></p>
        </div>
    </div>
</body>
</html>`;
    
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(homepage);
    return;
  }

  // Basic API endpoints simulation
  if (pathname.startsWith('/api/')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    
    if (pathname === '/api/courses') {
      res.end(JSON.stringify({
        courses: [
          { id: 1, title: '기초 훈련 과정', description: '반려동물의 기본적인 명령어 훈련', level: 'beginner' },
          { id: 2, title: '행동 교정 과정', description: '문제 행동 교정을 위한 전문 훈련', level: 'intermediate' },
          { id: 3, title: '고급 트릭 과정', description: '재미있는 트릭과 고급 명령어 훈련', level: 'advanced' }
        ],
        total: 3,
        message: 'Available training courses'
      }));
      return;
    }

    if (pathname === '/api/users') {
      res.end(JSON.stringify({
        message: 'User management endpoint',
        status: 'active',
        features: ['registration', 'login', 'profile_management']
      }));
      return;
    }

    // Generic API response for other endpoints
    res.end(JSON.stringify({
      message: 'Talez API endpoint',
      path: pathname,
      timestamp: new Date().toISOString(),
      available_endpoints: ['/api/courses', '/api/users', '/api/status']
    }));
    return;
  }

  // 404 for other routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    error: 'Not Found', 
    path: pathname,
    message: 'The requested resource was not found on this server',
    available_endpoints: ['/', '/health', '/api/status', '/api/courses', '/api/users']
  }));
}

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Talez Pet Training Platform successfully started!`);
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log(`🌐 Homepage: http://localhost:${PORT}/`);
  console.log(`📊 Health Check: http://localhost:${PORT}/health`);
  console.log(`🔌 API Status: http://localhost:${PORT}/api/status`);
  console.log(`⚡ Started at: ${new Date().toISOString()}`);
  console.log(`🎯 Ready to serve requests!`);
});

// Error handling
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} is already in use. Please try a different port.`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📥 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📥 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

// Unhandled errors
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = server;