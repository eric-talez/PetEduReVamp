// Working server startup for Talez Pet Training Platform
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:8080'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'Talez Pet Training Platform is running',
    uptime: Math.floor(process.uptime()),
    memory: process.memoryUsage(),
    version: '1.0.0'
  });
});

// Main homepage
app.get('/', (req, res) => {
  const html = `<!DOCTYPE html>
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
        }
        .header p { 
            font-size: 1.4rem; 
            opacity: 0.95; 
            margin-bottom: 30px;
        }
        .status-card { 
            background: rgba(255,255,255,0.95); 
            backdrop-filter: blur(10px);
            border-radius: 20px; 
            padding: 40px; 
            margin: 30px 0; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
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
            transition: transform 0.3s ease;
        }
        .status-item:hover { transform: translateY(-5px); }
        .status-icon { font-size: 2.5rem; margin-bottom: 15px; }
        .status-label { font-weight: 600; color: #667eea; margin-bottom: 8px; }
        .status-value { color: #27ae60; font-weight: bold; }
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
            transition: transform 0.3s ease;
        }
        .feature:hover { transform: translateY(-8px); }
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
            padding: 10px 20px; 
            background: rgba(255,255,255,0.2);
            border-radius: 25px;
            transition: all 0.3s ease;
        }
        .api-link:hover { 
            background: rgba(255,255,255,0.3); 
            transform: scale(1.05);
        }
        @media (max-width: 768px) {
            .header h1 { font-size: 2.5rem; }
            .header p { font-size: 1.1rem; }
            .status-card, .feature { padding: 25px; }
            .api-links { flex-direction: column; align-items: center; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🐾 Talez</h1>
            <p>AI 기반 반려동물 교육 플랫폼</p>
            <div style="font-size: 1rem; opacity: 0.8;">
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
                    <div class="status-value">${Math.floor(process.uptime())}초</div>
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
        setInterval(() => {
            fetch('/health')
                .then(response => response.json())
                .then(data => {
                    const uptimeElement = document.querySelector('.status-grid .status-item:nth-child(2) .status-value');
                    if (uptimeElement) {
                        uptimeElement.textContent = Math.floor(data.uptime) + '초';
                    }
                })
                .catch(console.error);
        }, 5000);

        // 클릭 효과
        document.addEventListener('click', (e) => {
            if (e.target.matches('.api-link')) {
                e.target.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    e.target.style.transform = 'scale(1.05)';
                }, 100);
            }
        });
    </script>
</body>
</html>`;
  res.send(html);
});

// API endpoints
app.get('/api/status', (req, res) => {
  res.json({
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
  });
});

app.get('/api/courses', (req, res) => {
  res.json({
    courses: [
      { 
        id: 1, 
        title: '기초 훈련 과정', 
        description: '반려동물의 기본적인 명령어와 예의 교육', 
        level: 'beginner',
        duration: '4주',
        price: 89000
      },
      { 
        id: 2, 
        title: '행동 교정 과정', 
        description: '문제 행동 분석 및 전문적인 교정 훈련', 
        level: 'intermediate',
        duration: '6주',
        price: 149000
      },
      { 
        id: 3, 
        title: '고급 트릭 과정', 
        description: '재미있는 트릭과 고급 명령어 마스터', 
        level: 'advanced',
        duration: '8주',
        price: 199000
      }
    ],
    total: 3,
    message: 'Available training courses for pets'
  });
});

app.get('/api/users', (req, res) => {
  res.json({
    message: 'User management system',
    status: 'active',
    features: ['회원가입', '로그인', '프로필 관리', '수강 이력'],
    total_users: 1247,
    active_sessions: 23
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.originalUrl,
    message: '요청하신 리소스를 찾을 수 없습니다',
    available_endpoints: ['/', '/health', '/api/status', '/api/courses', '/api/users']
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : '서버 내부 오류가 발생했습니다'
  });
});

// Start server
const server = createServer(app);
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Talez Pet Training Platform started successfully!`);
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🌐 Homepage: http://localhost:${PORT}/`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`🔌 API: http://localhost:${PORT}/api/status`);
  console.log(`⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🎯 Ready to serve requests!`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed successfully');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed successfully');
    process.exit(0);
  });
});