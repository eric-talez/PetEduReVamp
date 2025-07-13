import express from "express";
import { registerRoutes } from "./routes";
import { registerAIRoutes } from "./routes/ai";
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

// 업로드된 파일을 정적으로 제공
app.use('/uploads', express.static('uploads'));

// 로고 및 기타 정적 파일 제공
app.use(express.static('public'));

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

// Static file serving for images and assets (BEFORE Vite middleware)
app.use('/images', express.static('public/images'));
app.use('/assets', express.static('public/assets'));
app.use('/uploads', express.static('public/uploads'));

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

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'talez-super-secure-session-secret-2025-production-ready',
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

// Session to req.user middleware
app.use((req: any, res: any, next: any) => {
  if (req.session?.user && !req.user) {
    req.user = req.session.user;
  }
  next();
});

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
      'test': { password: 'test123', role: 'pet-owner', name: '테스트 사용자' },
      'testuser': { password: 'password123', role: 'pet-owner', name: '테스트 사용자' },
      'trainer': { password: 'trainer123', role: 'trainer', name: '강동훈' },
      'trainer01': { password: 'trainer123', role: 'trainer', name: '훈련사' },
      'admin': { password: 'admin123', role: 'admin', name: '관리자' },
      'institute': { password: 'institute123', role: 'institute-admin', name: '기관 관리자' },
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

    // Register experience routes
    registerExperienceRoutes(app);

    // Register institute routes
    registerInstituteRoutes(app, storage);

    // Setup Vite for development or serve static files for production
    // This MUST come AFTER API routes to prevent catch-all from intercepting API calls
    if (process.env.NODE_ENV === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Start the server
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`📱 Local: http://localhost:${PORT}`);
      console.log(`🌐 Network: http://0.0.0.0:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();