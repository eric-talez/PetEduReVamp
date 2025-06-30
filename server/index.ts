import express from "express";
import { registerRoutes } from "./routes";
import { registerAIRoutes } from "./routes/ai";
import { registerExperienceRoutes } from "./routes/experience";
import { setupVite, serveStatic } from "./vite";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true
}));

// Disable rate limiting in development to avoid proxy issues
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
  });
  app.use(limiter);
}

// Compression
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

async function startServer() {
  try {
    // Register API routes BEFORE Vite middleware
    app.post('/api/login', async (req, res) => {
      try {
        const { username, password } = req.body;
        
        if (!username || !password) {
          return res.status(400).json({
            success: false,
            message: '아이디와 비밀번호를 입력해주세요.'
          });
        }

        // 테스트 계정 정보
        const testAccounts = {
          'testuser': { password: 'password123', role: 'pet-owner', name: '테스트 사용자' },
          'trainer01': { password: 'trainer123', role: 'trainer', name: '훈련사' },
          'admin': { password: 'admin123', role: 'admin', name: '관리자' },
          'institute01': { password: 'institute123', role: 'institute-admin', name: '기관 관리자' }
        };

        const account = testAccounts[username as keyof typeof testAccounts];
        
        if (!account || account.password !== password) {
          return res.status(401).json({
            success: false,
            message: '아이디 또는 비밀번호가 일치하지 않습니다.'
          });
        }

        // 세션에 사용자 정보 저장
        req.session.user = {
          id: username,
          username,
          role: account.role,
          name: account.name
        };

        return res.json({
          success: true,
          user: {
            id: username,
            username,
            role: account.role,
            name: account.name
          }
        });

      } catch (error) {
        console.error('로그인 오류:', error);
        return res.status(500).json({
          success: false,
          message: '로그인 처리 중 오류가 발생했습니다.'
        });
      }
    });

    // 로그아웃 API
    app.post('/api/logout', (req, res) => {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ success: false, message: '로그아웃 실패' });
        }
        res.clearCookie('connect.sid');
        return res.json({ success: true, message: '로그아웃 성공' });
      });
    });

    // 사용자 정보 확인 API
    app.get('/api/user', (req, res) => {
      if (req.session.user) {
        return res.json(req.session.user);
      }
      return res.status(401).json({ message: '인증되지 않은 사용자' });
    });
    
    // Register other API routes
    const server = await registerRoutes(app);
    
    // Register AI routes
    registerAIRoutes(app);
    
    // Register experience routes
    registerExperienceRoutes(app);

    // Setup Vite for development or serve static files for production
    if (process.env.NODE_ENV === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Start the server
    server.listen(PORT, () => {
      const mode = process.env.NODE_ENV || "development";
      console.log(`🚀 Server running on port ${PORT} in ${mode} mode`);
      console.log(`📱 Local: http://localhost:${PORT}`);
      if (process.env.NODE_ENV === "development") {
        console.log(`🌐 Network: http://0.0.0.0:${PORT}`);
      }
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer();