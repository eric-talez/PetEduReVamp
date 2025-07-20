// Working Talez server using CommonJS - bypasses all ES module issues
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 5000;

console.log('🚀 Starting Talez Pet Training Platform...');

// Create HTTP server
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

  // Collect request body
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    handleRequest(pathname, method, body, res);
  });
});

function handleRequest(pathname, method, body, res) {
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
      version: '1.0.0',
      endpoints: ['/', '/health', '/api/status', '/api/courses', '/api/users']
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

  // Courses API
  if (pathname === '/api/courses') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      courses: [
        { 
          id: 1, 
          title: '기초 훈련 과정', 
          description: '반려동물의 기본적인 명령어와 예의 교육', 
          level: 'beginner',
          duration: '4주',
          price: 89000,
          instructor: '김훈련 전문가',
          rating: 4.8
        },
        { 
          id: 2, 
          title: '행동 교정 과정', 
          description: '문제 행동 분석 및 전문적인 교정 훈련', 
          level: 'intermediate',
          duration: '6주',
          price: 149000,
          instructor: '박행동 전문가',
          rating: 4.9
        },
        { 
          id: 3, 
          title: '고급 트릭 과정', 
          description: '재미있는 트릭과 고급 명령어 마스터', 
          level: 'advanced',
          duration: '8주',
          price: 199000,
          instructor: '이트릭 전문가',
          rating: 4.7
        }
      ],
      total: 3,
      message: 'Available training courses for pets'
    }));
    return;
  }

  // Users API
  if (pathname === '/api/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'User management system',
      status: 'active',
      features: ['회원가입', '로그인', '프로필 관리', '수강 이력', '반려동물 등록'],
      total_users: 1247,
      active_sessions: 23,
      recent_registrations: 12
    }));
    return;
  }

  // Main homepage
  if (pathname === '/') {
    const homepage = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Talez - AI 펫 교육 플랫폼</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            line-height: 1.6; 
            color: #2c3e50;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { 
            text-align: center; 
            color: white; 
            padding: 60px 0 40px; 
            backdrop-filter: blur(10px);
        }
        .header h1 { 
            font-size: 4rem; 
            margin-bottom: 10px; 
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            animation: fadeInDown 1s ease-out;
        }
        .header p { 
            font-size: 1.4rem; 
            opacity: 0.95; 
            margin-bottom: 30px;
            animation: fadeInUp 1s ease-out 0.3s both;
        }
        .current-time {
            font-size: 1rem; 
            opacity: 0.8;
            animation: fadeIn 1s ease-out 0.6s both;
        }
        .status-card { 
            background: rgba(255,255,255,0.95); 
            backdrop-filter: blur(10px);
            border-radius: 20px; 
            padding: 40px; 
            margin: 30px 0; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            animation: slideInUp 0.8s ease-out 0.4s both;
        }
        .status-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            gap: 20px; 
            margin: 30px 0; 
        }
        .status-item { 
            background: white; 
            padding: 25px; 
            border-radius: 15px; 
            text-align: center;
            box-shadow: 0 8px 25px rgba(0,0,0,0.08);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            animation: fadeIn 0.6s ease-out;
        }
        .status-item:hover { 
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        }
        .status-icon { font-size: 2.5rem; margin-bottom: 15px; }
        .status-label { font-weight: 600; color: #667eea; margin-bottom: 8px; }
        .status-value { color: #27ae60; font-weight: bold; font-size: 1.1rem; }
        .features { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); 
            gap: 25px; 
            margin: 40px 0; 
        }
        .feature { 
            background: rgba(255,255,255,0.95); 
            padding: 35px; 
            border-radius: 20px; 
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            animation: slideInUp 0.6s ease-out;
        }
        .feature:hover { 
            transform: translateY(-8px);
            box-shadow: 0 25px 45px rgba(0,0,0,0.15);
        }
        .feature h3 { 
            color: #667eea; 
            margin-bottom: 20px; 
            font-size: 1.4rem;
        }
        .feature p { color: #5a6c7d; line-height: 1.8; }
        .footer { 
            text-align: center; 
            margin-top: 60px; 
            padding: 30px; 
            background: rgba(255,255,255,0.1); 
            border-radius: 20px;
            backdrop-filter: blur(10px);
            color: white;
            animation: fadeIn 0.8s ease-out 0.8s both;
        }
        .api-links { 
            display: flex; 
            justify-content: center; 
            gap: 20px; 
            margin-top: 20px;
            flex-wrap: wrap;
        }
        .api-link { 
            color: #e8f4fd; 
            text-decoration: none; 
            padding: 12px 24px; 
            background: rgba(255,255,255,0.2);
            border-radius: 25px;
            transition: all 0.3s ease;
            border: 1px solid rgba(255,255,255,0.3);
        }
        .api-link:hover { 
            background: rgba(255,255,255,0.3); 
            transform: scale(1.05);
            border-color: rgba(255,255,255,0.5);
        }
        
        @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInUp {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @media (max-width: 768px) {
            .header h1 { font-size: 2.5rem; }
            .header p { font-size: 1.1rem; }
            .status-card, .feature { padding: 25px; }
            .api-links { flex-direction: column; align-items: center; }
            .status-grid { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🐾 Talez</h1>
            <p>AI 기반 반려동물 교육 플랫폼</p>
            <div class="current-time">
                현재 시간: ${new Date().toLocaleString('ko-KR')}
            </div>
        </div>
        
        <div class="status-card">
            <h2 style="text-align: center; color: #667eea; margin-bottom: 30px; font-size: 2rem;">🚀 시스템 상태</h2>
            <div class="status-grid">
                <div class="status-item">
                    <div class="status-icon">✅</div>
                    <div class="status-label">서버 상태</div>
                    <div class="status-value">정상 운영</div>
                </div>
                <div class="status-item">
                    <div class="status-icon">⏱️</div>
                    <div class="status-label">실행 시간</div>
                    <div class="status-value" id="uptime">${Math.floor(process.uptime())}초</div>
                </div>
                <div class="status-item">
                    <div class="status-icon">🔌</div>
                    <div class="status-label">API 상태</div>
                    <div class="status-value">활성화</div>
                </div>
                <div class="status-item">
                    <div class="status-icon">💾</div>
                    <div class="status-label">메모리 사용</div>
                    <div class="status-value">${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB</div>
                </div>
            </div>
        </div>

        <div class="features">
            <div class="feature">
                <h3>🎓 AI 맞춤 커리큘럼</h3>
                <p>개별 반려동물의 특성, 성격, 학습 능력을 분석하여 AI가 최적의 교육 커리큘럼을 자동 생성합니다. 단계별 맞춤 학습으로 효과적인 교육이 가능합니다.</p>
            </div>
            
            <div class="feature">
                <h3>👨‍🏫 전문 훈련사 매칭</h3>
                <p>경험 풍부한 인증 전문 훈련사들과의 온라인/오프라인 수업을 통해 체계적이고 전문적인 반려동물 교육을 받으실 수 있습니다.</p>
            </div>
            
            <div class="feature">
                <h3>📱 실시간 진도 관리</h3>
                <p>훈련 진행상황과 반려동물의 학습 성과를 실시간으로 모니터링하고, 전문가 피드백을 통해 지속적인 개선이 이루어집니다.</p>
            </div>
            
            <div class="feature">
                <h3>🏆 데이터 기반 성과 분석</h3>
                <p>반려동물의 학습 데이터를 종합 분석하여 성장 패턴을 파악하고, 더욱 효과적인 교육 방법을 제안합니다.</p>
            </div>

            <div class="feature">
                <h3>🛒 통합 쇼핑몰</h3>
                <p>교육에 필요한 용품부터 건강 관리 제품까지, 반려동물 전용 상품을 한 곳에서 편리하게 구매하실 수 있습니다.</p>
            </div>

            <div class="feature">
                <h3>💬 커뮤니티 네트워킹</h3>
                <p>같은 고민을 가진 반려동물 보호자들과 경험을 공유하고, 전문가 조언을 받을 수 있는 활발한 커뮤니티를 제공합니다.</p>
            </div>
        </div>

        <div class="footer">
            <h3>© 2024 Talez - AI 펫 교육 플랫폼</h3>
            <p>모든 권리 보유 • 사업자등록번호: 123-45-67890</p>
            <div class="api-links">
                <a href="/health" class="api-link">📊 시스템 상태</a>
                <a href="/api/status" class="api-link">🔌 API 상태</a>
                <a href="/api/courses" class="api-link">📚 강의 목록</a>
                <a href="/api/users" class="api-link">👥 사용자 관리</a>
            </div>
        </div>
    </div>

    <script>
        // 실시간 업데이트
        function updateStatus() {
            fetch('/health')
                .then(response => response.json())
                .then(data => {
                    const uptimeElement = document.getElementById('uptime');
                    if (uptimeElement) {
                        uptimeElement.textContent = Math.floor(data.uptime) + '초';
                    }
                })
                .catch(console.error);
        }
        
        // 5초마다 상태 업데이트
        setInterval(updateStatus, 5000);

        // 클릭 효과
        document.addEventListener('click', (e) => {
            if (e.target.matches('.api-link')) {
                e.target.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    e.target.style.transform = 'scale(1.05)';
                }, 100);
            }
        });

        // 페이지 로드 애니메이션
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
        });
    </script>
</body>
</html>`;
    
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(homepage);
    return;
  }

  // 404 handler
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    error: 'Not Found',
    path: pathname,
    message: '요청하신 리소스를 찾을 수 없습니다',
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
  console.log(`📚 Courses API: http://localhost:${PORT}/api/courses`);
  console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
  console.log(`⚡ Started at: ${new Date().toISOString()}`);
  console.log(`🎯 Ready to serve requests!`);
});

// Error handling
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
    server.listen(PORT + 1, '0.0.0.0');
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown() {
  console.log('📥 Shutdown signal received, closing server gracefully...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.log('⏰ Force closing server...');
    process.exit(1);
  }, 10000);
}

// Unhandled errors
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  gracefulShutdown();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown();
});

console.log('🎉 Talez Pet Training Platform initialization complete!');
console.log('📋 Available features:');
console.log('   • Beautiful Korean homepage with animations');
console.log('   • Real-time system status monitoring');
console.log('   • RESTful API endpoints for courses and users');
console.log('   • Responsive design for all devices');
console.log('   • Graceful error handling and shutdown');
console.log('   • Live uptime tracking');
console.log('');
console.log('🔗 Quick test links:');
console.log(`   curl http://localhost:${PORT}/health`);
console.log(`   curl http://localhost:${PORT}/api/courses`);
console.log(`   curl http://localhost:${PORT}/api/users`);