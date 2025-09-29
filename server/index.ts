import express from "express";
import { registerRoutes } from "./routes";
import { registerAIRoutes } from "./routes/ai";
import { registerAIProxyRoutes } from "./routes/ai-proxy";
import { registerAdminAIRoutes } from "./routes/admin-ai";
import { registerEnhancedAnalysisRoutes } from "./routes/enhanced-analysis";
import { registerExperienceRoutes } from "./routes/experience";
import { registerInstituteRoutes } from "./institutes/routes";
import { setupVite, serveStatic } from "./vite";
import { storage } from "./storage";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { setupPerformance } from "./performance";
import { registerAdminRoutes } from "./routes/admin";
import { registerPaymentIntegrationRoutes } from "./routes/payment-integration";
import { setupAuth } from "./auth";
import { extendResponse } from "./middleware/api-standards";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";

const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

// Production proxy compatibility - CRITICAL for production deployment
app.set('trust proxy', 1);

// Security middleware - 프로덕션에서 unsafe 제거
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: process.env.NODE_ENV === 'production' 
        ? ["'self'", "https://fonts.googleapis.com"]
        : ["'self'", "'unsafe-inline'"],
      scriptSrc: process.env.NODE_ENV === 'production'
        ? ["'self'", "https://dapi.kakao.com", "https://developers.kakao.com"]
        : ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"],
    },
  },
}));

// CORS 설정 개선
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      'https://funnytalez.com',
      'https://www.funnytalez.com'
      // 프로덕션에서는 와일드카드 도메인 제거 (보안 강화)
    ]
  : [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://localhost:3000',
      'https://localhost:5173',
      'https://*.replit.dev',
      'https://*.repl.co'
    ];

app.use(cors({
  origin: function(origin, callback) {
    // 개발 환경에서는 origin이 없을 수 있음 (같은 도메인)
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // 허용된 origin 목록 체크
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        const pattern = allowedOrigin.replace(/\*/g, '.*');
        return new RegExp(pattern).test(origin || '');
      }
      return allowedOrigin === origin;
    });

    if (isAllowed || !origin) {
      callback(null, true);
    } else {
      console.warn(`CORS 차단된 origin: ${origin}`);
      callback(new Error('CORS policy violation'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'Accept', 'Origin', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

// 운영 환경 보안 헤더
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    next();
  });
}

// 업로드된 파일을 정적으로 제공
app.use('/uploads', express.static('uploads'));

// 로고 및 기타 정적 파일 제공
app.use(express.static('public'));

// 로그인 엔드포인트 보안 강화를 위한 레이트 리미터
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 5, // 15분 동안 최대 5회 로그인 시도
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_LOGIN_ATTEMPTS',
      message: '너무 많은 로그인 시도입니다. 15분 후 다시 시도해주세요.'
    },
    meta: {
      timestamp: new Date().toISOString()
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

// 로그인 엔드포인트에만 적용
app.use('/api/auth/login', loginLimiter);

// 일반 API 레이트 리미터는 프로덕션에서만
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
  });
  app.use(limiter);
}

// 성능 최적화 설정 (압축, 캐시, 모니터링)
setupPerformance(app);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for images and assets (BEFORE Vite middleware)
app.use('/images', express.static('public/images'));
app.use('/assets', express.static('public/assets'));
app.use('/uploads', express.static('public/uploads'));
app.use('/attached_assets', express.static('attached_assets'));

// 로고 파일 직접 제공
app.get('/logo.svg', (req, res) => {
  res.sendFile('logo.svg', { root: 'public' });
});

app.get('/logo-compact.svg', (req, res) => {
  res.sendFile('logo-compact.svg', { root: 'public' });
});

app.get('/favicon.svg', (req, res) => {
  res.sendFile('favicon.svg', { root: 'public' });
});

// 첨부 파일 이미지 직접 제공
app.get('/attached_assets/:filename', (req, res) => {
  const filename = req.params.filename;

  try {
    // 적절한 Content-Type 설정
    if (filename.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (filename.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
    }

    res.sendFile(filename, { root: 'attached_assets' });
  } catch (error) {
    console.error('첨부 파일 제공 오류:', error);
    res.status(404).send('File not found');
  }
});

// 세션 설정 - 크로스 도메인 지원 개선
const isProduction = process.env.NODE_ENV === 'production';
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'talez-super-secure-session-secret-2025-production-ready',
  resave: false,
  saveUninitialized: false,
  name: 'talez.sid', // 기본 세션 이름 변경으로 보안 강화
  cookie: {
    secure: isProduction, // HTTPS에서만 secure 쿠키
    httpOnly: true,
    sameSite: isProduction ? 'none' as const : 'lax' as const, // 프로덕션에서는 크로스사이트 허용
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    // 도메인 설정 (같은 2차 도메인 사용 시)
    ...(isProduction && process.env.COOKIE_DOMAIN && {
      domain: process.env.COOKIE_DOMAIN
    })
  },
  // sessionStore는 setupAuth에서 정의되거나, 필요시 여기서 초기화
  // 예: store: new (require('connect-redis'))(session)({ client: redisClient })
};
// 세션 미들웨어를 먼저 설정
app.use(session({ ...sessionConfig, store: storage.sessionStore }));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Setup authentication system
setupAuth(app);

// API 표준화 미들웨어 적용 - Response 객체에 표준 메서드 추가
app.use(extendResponse);

// Session to req.user middleware
app.use((req: any, res: any, next: any) => {
  try {
    if (req.session?.user && !req.user) {
      req.user = req.session.user;
    }
    next();
  } catch (error) {
    console.error('Session middleware error:', error);
    next();
  }
});

// REMOVED: Critical security fix - these endpoints have been moved to routes.ts with proper authentication

// 인증 관련 라우트는 setupAuth()에서 처리됨
// /api/auth/login, /api/auth/register, /api/auth/logout, /api/auth/me

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
// 메모리 초기화 함수
function initializeMemoryData() {
  // 등록 신청 데이터 초기화
  if (!global.registrationApplications) {
    global.registrationApplications = [];
  }

  // 기존 데이터가 없는 경우에만 샘플 데이터 생성
  if (global.registrationApplications.length === 0) {
    const sampleTrainerApplications = [
      {
        id: 'trainer_' + Date.now() + '_1',
        type: 'trainer',
        applicantInfo: {
          personalInfo: {
            name: '김민준',
            phone: '010-1234-5678',
            email: 'trainer1@example.com',
            address: '서울시 강남구 테헤란로 123'
          },
          professionalInfo: {
            experience: 5,
            specialties: ['기초 복종 훈련', '사회화 훈련'],
            certifications: ['반려동물 훈련사 자격증', '동물행동교정사 자격증'],
            bio: '5년간의 경험을 바탕으로 체계적인 반려견 훈련을 제공합니다.',
            serviceArea: '서울시 강남구'
          },
          businessInfo: {
            hourlyRate: '50000'
          }
        },
        documents: {
          profileImage: '/uploads/trainer1_profile.jpg',
          certificationDocs: ['/uploads/trainer1_cert1.pdf', '/uploads/trainer1_cert2.pdf'],
          portfolioImages: ['/uploads/trainer1_portfolio1.jpg']
        },
        status: 'pending',
        submittedAt: new Date(Date.now() - 86400000).toISOString(), // 1일 전
        reviewerId: null,
        reviewedAt: null,
        notes: ''
      },
      {
        id: 'trainer_' + Date.now() + '_2',
        type: 'trainer',
        applicantInfo: {
          personalInfo: {
            name: '박수진',
            phone: '010-2345-6789',
            email: 'trainer2@example.com',
            address: '부산시 해운대구 센텀중앙로 456'
          },
          professionalInfo: {
            experience: 8,
            specialties: ['어질리티 훈련', '문제행동 교정'],
            certifications: ['국제 반려동물 훈련사 자격증', 'K9 트레이너 자격증'],
            bio: '어질리티와 문제행동 교정 전문가로 활동하고 있습니다.',
            serviceArea: '부산시 전체'
          },
          businessInfo: {
            hourlyRate: '60000'
          }
        },
        documents: {
          profileImage: '/uploads/trainer2_profile.jpg',
          certificationDocs: ['/uploads/trainer2_cert1.pdf'],
          portfolioImages: ['/uploads/trainer2_portfolio1.jpg', '/uploads/trainer2_portfolio2.jpg']
        },
        status: 'approved',
        submittedAt: new Date(Date.now() - 172800000).toISOString(), // 2일 전
        reviewerId: 'admin',
        reviewedAt: new Date(Date.now() - 86400000).toISOString(), // 1일 전
        notes: '우수한 경력과 자격을 갖춘 훈련사입니다. 승인합니다.'
      },
      {
        id: 'trainer_' + Date.now() + '_3',
        type: 'trainer',
        applicantInfo: {
          personalInfo: {
            name: '강동훈',
            phone: '010-4765-1909',
            email: 'donghoong@wangzzang.com',
            address: '경북 구미시 구평동 661 (왕짱 스쿨)'
          },
          professionalInfo: {
            experience: 10,
            specialties: ['국가자격증 훈련 (오비디언스 훈련)', '정서안정 및 동물교감 교육', '문제행동 교정', '퍼피 사회화 교육'],
            certifications: [
              '반려동물행동지도사 국가자격증 2급',
              '경기대학교 대체의학대학원 동물매개자연치유전공 석사',
              '한국애견연맹 사회공헌위원회 위원',
              '펫헬스케어아카데미 협회 공동대표'
            ],
            bio: '국가자격증 훈련부터 반려동물 교감 교육까지! 반려견과 보호자의 "진짜 관계"를 만들어 드립니다. 이해와 신뢰 중심의 훈련 철학으로 단순한 훈련이 아닌 반려견과 보호자가 진짜로 "함께 살아가는 법"을 교육합니다.',
            serviceArea: '경북 구미시, 칠곡군'
          },
          businessInfo: {
            hourlyRate: '70000'
          },
          additionalInfo: {
            businessLocations: [
              '경북 구미시 구평동 661 (왕짱 스쿨)',
              '경북 칠곡군 석적읍 북중리 10길 17 (왕짱애견유치원)'
            ],
            specialPrograms: [
              '구미시 2025 미래교육지구 마을학교 "반려꿈터" 운영',
              '정신건강 및 특수교육 대상자를 위한 교감 활동',
              '경북소방본부, 교육기관 대상 강의 및 상담',
              '수제간식 교육 및 반려견 건강식 제안'
            ],
            contentCreation: '교육 영상, 실습 시연 영상 등 직접 촬영·제작하여 시각 중심의 실전 교육 콘텐츠 제공'
          }
        },
        documents: {
          profileImage: '/uploads/trainer_kangdonghoon_profile.jpg',
          certificationDocs: [
            '/uploads/trainer_kangdonghoon_national_cert.pdf',
            '/uploads/trainer_kangdonghoon_masters_degree.pdf',
            '/uploads/trainer_kangdonghoon_association_cert.pdf'
          ],
          portfolioImages: [
            '/uploads/wangzzang_school_facility1.jpg',
            '/uploads/wangzzang_kindergarten_facility2.jpg',
            '/uploads/training_content_video_samples.jpg'
          ]
        },
        status: 'pending',
        submittedAt: new Date().toISOString(), // 방금 신청
        reviewerId: null,
        reviewedAt: null,
        notes: ''
      }
    ];

    const sampleInstituteApplications = [
      {
        id: 'institute_' + Date.now() + '_1',
        type: 'institute',
        applicantInfo: {
          basicInfo: {
            instituteName: '해피독 트레이닝 센터',
            email: 'info@happydog.com',
            phone: '02-1234-5678',
            establishedYear: '2020'
          },
          locationInfo: {
            address: '서울시 마포구 홍대입구역 12번 출구 앞'
          },
          serviceInfo: {
            description: '체계적인 강아지 교육과 사회화 프로그램을 제공하는 전문 교육기관입니다.',
            serviceTypes: ['기초 훈련', '사회화 교육', '문제행동 교정', '어질리티'],
            operatingHours: '평일 09:00-18:00, 주말 10:00-17:00'
          },
          facilityInfo: {
            capacity: '20',
            facilities: ['실내 훈련장', '실외 운동장', '개별 케어 룸', '상담실']
          }
        },
        documents: {
          businessLicense: '/uploads/institute1_license.pdf',
          facilityImages: ['/uploads/institute1_facility1.jpg', '/uploads/institute1_facility2.jpg']
        },
        status: 'pending',
        submittedAt: new Date(Date.now() - 43200000).toISOString(), // 12시간 전
        reviewerId: null,
        reviewedAt: null,
        notes: ''
      },
      {
        id: 'institute_' + Date.now() + '_2',
        type: 'institute',
        applicantInfo: {
          basicInfo: {
            instituteName: '펫케어 아카데미',
            email: 'academy@petcare.com',
            phone: '031-5678-9012',
            establishedYear: '2018'
          },
          locationInfo: {
            address: '경기도 성남시 분당구 정자일로 95'
          },
          serviceInfo: {
            description: '전문 수의사와 훈련사가 함께하는 종합 펫케어 교육기관입니다.',
            serviceTypes: ['기초 교육', '건강 관리', '그루밍', '수의학 상담'],
            operatingHours: '매일 08:00-20:00'
          },
          facilityInfo: {
            capacity: '50',
            facilities: ['대형 훈련장', '의료 시설', '그루밍실', '휴게실', '주차장']
          }
        },
        documents: {
          businessLicense: '/uploads/institute2_license.pdf',
          facilityImages: ['/uploads/institute2_facility1.jpg', '/uploads/institute2_facility2.jpg', '/uploads/institute2_facility3.jpg']
        },
        status: 'rejected',
        submittedAt: new Date(Date.now() - 259200000).toISOString(), // 3일 전
        reviewerId: 'admin',
        reviewedAt: new Date(Date.now() - 172800000).toISOString(), // 2일 전
        notes: '시설 기준이 미흡합니다. 안전 시설 보완 후 재신청 바랍니다.'
      }
    ];

    global.registrationApplications.push(
      ...sampleTrainerApplications,
      ...sampleInstituteApplications
    );

    console.log('✅ 등록 신청 데이터 초기화 완료:', global.registrationApplications.length, '건');
  }
}

async function startServer() {
  try {
    // 메모리 데이터 초기화
    initializeMemoryData();

    console.log('🔧 개발 환경: PostgreSQL 연결 설정');
    console.log('🔄 운영 환경용 메모리 저장소 초기화...');

    // 기존 초기화 함수 실행 (if available)
    if (storage.initializeData && typeof storage.initializeData === 'function') {
      await storage.initializeData();
    }

    // Register other API routes BEFORE Vite
    const server = await registerRoutes(app);

    // Register AI routes
    registerAIRoutes(app);

    // AI Proxy Routes (개선된 AI 분석 시스템)
    registerAIProxyRoutes(app);

    // Admin AI Routes (AI API 관리)
    registerAdminAIRoutes(app);

    // Enhanced Analysis Routes (강화된 AI 분석)
    registerEnhancedAnalysisRoutes(app);

    // Register experience routes
    registerExperienceRoutes(app);

    // Register institute routes
    registerInstituteRoutes(app, storage);

    // 관리자 라우트 등록
    registerAdminRoutes(app);

    // 결제연동 관리 라우트 등록
    registerPaymentIntegrationRoutes(app);

    // Setup Vite for development or serve static files for production
    // This MUST come AFTER API routes to prevent catch-all from intercepting API calls
    if (process.env.NODE_ENV === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // 404 핸들러 (모든 라우트 후에 적용)
    app.use(notFoundHandler);

    // 글로벌 에러 핸들러 (맨 마지막에 적용)
    app.use(errorHandler);

    // Start the server
    server.listen(PORT, "0.0.0.0", () => {
      // 운영 환경 모니터링 설정
      if (process.env.NODE_ENV === 'production') {
        // 에러 로깅 강화
        app.use((err: any, req: any, res: any, next: any) => {
          console.error('🚨 Production Error:', {
            message: err.message,
            stack: err.stack,
            url: req.url,
            method: req.method,
            timestamp: new Date().toISOString()
          });

          res.status(500).json({
            success: false,
            message: '서비스 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
          });
        });

        console.log('🚀 Server running on port 5000 in PRODUCTION mode');
        console.log('📊 Production monitoring active');
      } else {
        console.log('🚀 Server running on port 5000 in development mode');
      }
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();