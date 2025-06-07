import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import session from "express-session";
import memorystore from "memorystore";
import cors from "cors";
import { setupAuth } from "./auth";
import { setupMonitoring, setupErrorHandling } from "./monitoring";
import { setupSecurity } from "./security";
import { setupPerformance, monitorMemoryUsage } from "./performance";
// 비밀번호 재설정 관련 모듈 (별도 초기화 필요 없음)
// import { recovery } from './recovery';
import { registerNotificationRoutes } from './routes/notification-routes';
import { errorHandler, requestIdMiddleware } from './middleware/error-handler';

const MemoryStore = memorystore(session);
const app = express();

// 프록시 신뢰 설정 (Nginx, 로드밸서 등을 위해 필요)
app.set('trust proxy', 1);

// CORS 설정 - funnytalez.com과의 통신을 위해 허용
app.use(cors({
  origin: ['https://store.funnytalez.com', 'https://funnytalez.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 이미지 업로드를 위해 JSON 요청 크기 제한 증가 (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// 업로드된 파일을 정적으로 서빙
app.use('/uploads', express.static('public/uploads'));

// 개발 환경에서 반려동물 API 직접 우회 처리
if (process.env.NODE_ENV === 'development') {
  app.get('/api/pets', async (req, res) => {
    try {
      const { db } = await import('./db');
      const { pets } = await import('@shared/schema');
      const { eq } = await import('drizzle-orm');

      const userPets = await db
        .select()
        .from(pets)
        .where(eq(pets.ownerId, 1));

      res.json({ success: true, pets: userPets });
    } catch (error) {
      console.error('반려동물 조회 오류:', error);
      res.status(500).json({ message: "서버 오류가 발생했습니다" });
    }
  });

  app.get('/api/pets/:id', async (req, res) => {
    try {
      const { db } = await import('./db');
      const { pets } = await import('@shared/schema');
      const { eq, and } = await import('drizzle-orm');

      const petId = parseInt(req.params.id);

      const [pet] = await db
        .select()
        .from(pets)
        .where(and(eq(pets.id, petId), eq(pets.ownerId, 1)));

      if (!pet) {
        return res.status(404).json({ message: "반려동물을 찾을 수 없습니다" });
      }

      res.json({ success: true, pet });
    } catch (error) {
      console.error('반려동물 조회 오류:', error);
      res.status(500).json({ message: "서버 오류가 발생했습니다" });
    }
  });

  app.get('/api/vaccinations', async (req, res) => {
    try {
      const { db } = await import('./db');
      const { vaccinations, pets } = await import('@shared/schema');
      const { eq, and } = await import('drizzle-orm');

      const petId = req.query.petId ? parseInt(req.query.petId as string) : null;

      let query = db
        .select({
          id: vaccinations.id,
          petId: vaccinations.petId,
          vaccineName: vaccinations.vaccineName,
          vaccineDate: vaccinations.vaccineDate,
          nextDueDate: vaccinations.nextDueDate,
          veterinarian: vaccinations.veterinarian,
          clinicName: vaccinations.clinicName,
          notes: vaccinations.notes,
          petName: pets.name
        })
        .from(vaccinations)
        .leftJoin(pets, eq(vaccinations.petId, pets.id))
        .where(eq(pets.ownerId, 1));

      if (petId) {
        query = query.where(eq(vaccinations.petId, petId));
      }

      const records = await query;
      res.json({ success: true, vaccinations: records });
    } catch (error) {
      console.error('예방접종 기록 조회 오류:', error);
      res.status(500).json({ message: "서버 오류가 발생했습니다" });
    }
  });

  app.get('/api/health-checkups', async (req, res) => {
    try {
      const { db } = await import('./db');
      const { healthCheckups, pets } = await import('@shared/schema');
      const { eq, and } = await import('drizzle-orm');

      const petId = req.query.petId ? parseInt(req.query.petId as string) : null;

      let query = db
        .select({
          id: healthCheckups.id,
          petId: healthCheckups.petId,
          checkupDate: healthCheckups.checkupDate,
          weight: healthCheckups.weight,
          temperature: healthCheckups.temperature,
          heartRate: healthCheckups.heartRate,
          bloodPressure: healthCheckups.bloodPressure,
          diagnosis: healthCheckups.diagnosis,
          treatment: healthCheckups.treatment,
          medication: healthCheckups.medication,
          veterinarian: healthCheckups.veterinarian,
          clinicName: healthCheckups.clinicName,
          notes: healthCheckups.notes,
          nextCheckupDate: healthCheckups.nextCheckupDate,
          petName: pets.name
        })
        .from(healthCheckups)
        .leftJoin(pets, eq(healthCheckups.petId, pets.id))
        .where(eq(pets.ownerId, 1));

      if (petId) {
        query = query.where(eq(healthCheckups.petId, petId));
      }

      const records = await query;
      res.json({ success: true, checkups: records });
    } catch (error) {
      console.error('건강검진 기록 조회 오류:', error);
      res.status(500).json({ message: "서버 오류가 발생했습니다" });
    }
  });

  // 개별 반려동물 예방접종 기록 조회
  app.get('/api/pets/:petId/vaccinations', async (req, res) => {
    try {
      const { db } = await import('./db');
      const { vaccinations, pets } = await import('@shared/schema');
      const { eq, and } = await import('drizzle-orm');

      const petId = parseInt(req.params.petId);

      const records = await db
        .select({
          id: vaccinations.id,
          petId: vaccinations.petId,
          vaccineName: vaccinations.vaccineName,
          vaccineType: vaccinations.vaccineType,
          vaccineDate: vaccinations.vaccineDate,
          nextDueDate: vaccinations.nextDueDate,
          veterinarian: vaccinations.veterinarian,
          clinicName: vaccinations.clinicName,
          notes: vaccinations.notes,
          createdAt: vaccinations.createdAt
        })
        .from(vaccinations)
        .leftJoin(pets, eq(vaccinations.petId, pets.id))
        .where(and(eq(vaccinations.petId, petId), eq(pets.ownerId, 1)));

      res.json({ success: true, vaccinations: records });
    } catch (error) {
      console.error('반려동물 예방접종 기록 조회 오류:', error);
      res.status(500).json({ message: "서버 오류가 발생했습니다" });
    }
  });

  // 개별 반려동물 건강검진 기록 조회
  app.get('/api/pets/:petId/checkups', async (req, res) => {
    try {
      const { db } = await import('./db');
      const { healthCheckups, pets } = await import('@shared/schema');
      const { eq, and } = await import('drizzle-orm');

      const petId = parseInt(req.params.petId);

      const records = await db
        .select({
          id: healthCheckups.id,
          petId: healthCheckups.petId,
          checkupDate: healthCheckups.checkupDate,
          weight: healthCheckups.weight,
          temperature: healthCheckups.temperature,
          heartRate: healthCheckups.heartRate,
          bloodPressure: healthCheckups.bloodPressure,
          diagnosis: healthCheckups.diagnosis,
          treatment: healthCheckups.treatment,
          medication: healthCheckups.medication,
          veterinarian: healthCheckups.veterinarian,
          clinicName: healthCheckups.clinicName,
          notes: healthCheckups.notes,
          nextCheckupDate: healthCheckups.nextCheckupDate,
          createdAt: healthCheckups.createdAt
        })
        .from(healthCheckups)
        .leftJoin(pets, eq(healthCheckups.petId, pets.id))
        .where(and(eq(healthCheckups.petId, petId), eq(pets.ownerId, 1)));

      res.json({ success: true, checkups: records });
    } catch (error) {
      console.error('반려동물 건강검진 기록 조회 오류:', error);
      res.status(500).json({ message: "서버 오류가 발생했습니다" });
    }
  });
}



// 세션 설정 - 환경 변수 활용하여 보안성 강화
const sessionSecret = process.env.SESSION_SECRET || 'peteduplatform-secret-key';

const sessionStore = new MemoryStore({
  checkPeriod: 86400000 // 24시간마다 만료된 세션 정리
});

app.use(session({
  secret: sessionSecret,
  resave: false, // 최적화: 변경 사항이 있는 경우만 저장
  saveUninitialized: false, // 최적화: 초기화된 세션만 저장 (빈 세션 저장 방지)
  store: sessionStore,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24시간
    secure: process.env.NODE_ENV === 'production', // 프로덕션에서만 보안 쿠키 사용
    httpOnly: true, // 보안 강화: JS에서 쿠키 접근 방지
    sameSite: 'lax',
    path: '/' // 모든 경로에서 쿠키 사용 가능
  },
  name: 'talez.sid' // 서비스 이름 변경 반영
}));

// 인증 시스템 설정
setupAuth(app, sessionStore);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // 보안 설정 초기화
  setupSecurity(app);

  // 성능 최적화 설정 초기화
  setupPerformance(app);

  // 모니터링 설정 초기화
  setupMonitoring(app);

  // 요청 ID 미들웨어 추가
  app.use(requestIdMiddleware);

  // 라우트 등록
  const server = await registerRoutes(app);

  // Error handlers are now registered in routes.ts

  // 오류 처리 미들웨어 설정 (모든 라우트 등록 후)
  setupErrorHandling(app);

  // 백업 및 복구 시스템 초기화
  // 초기화 필요없음

  // 메모리 사용량 모니터링 시작
  if (process.env.NODE_ENV === 'production') {
    monitorMemoryUsage();
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  console.log("NODE_ENV:", process.env.NODE_ENV);
  if (process.env.NODE_ENV === "development") {
    console.log("Setting up Vite development server...");
    await setupVite(app, server);
    console.log("Vite setup complete");
  } else {
    console.log("Setting up static file serving...");
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();