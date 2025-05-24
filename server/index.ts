import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import session from "express-session";
import memorystore from "memorystore";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";

// 보안 설정
const securityConfig = {
  rateLimitWindow: 15 * 60 * 1000, // 15분
  rateLimitMax: 100, // IP당 최대 요청 수
  corsOrigins: ['https://talez.app']
};

const MemoryStore = memorystore(session);
const app = express();

// Replit는 프록시 환경에서 실행되므로 trust proxy 설정 활성화
app.set('trust proxy', 1);

// 보안 미들웨어 적용
app.use(helmet());
app.use(cors({
  origin: securityConfig.corsOrigins,
  credentials: true
}));
app.use(rateLimit({
  windowMs: securityConfig.rateLimitWindow,
  max: securityConfig.rateLimitMax
}));

// 이미지 업로드를 위해 JSON 요청 크기 제한 증가 (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// 세션 설정 - 환경 변수 활용하여 보안성 강화
const sessionSecret = process.env.SESSION_SECRET || 'peteduplatform-secret-key';

app.use(session({
  secret: sessionSecret,
  resave: false, // 최적화: 변경 사항이 있는 경우만 저장
  saveUninitialized: false, // 최적화: 초기화된 세션만 저장 (빈 세션 저장 방지)
  store: new MemoryStore({
    checkPeriod: 86400000 // 24시간마다 만료된 세션 정리
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24시간
    secure: process.env.NODE_ENV === 'production', // 프로덕션에서만 보안 쿠키 사용
    httpOnly: true, // 보안 강화: JS에서 쿠키 접근 방지
    sameSite: 'lax',
    path: '/' // 모든 경로에서 쿠키 사용 가능
  },
  name: 'talez.sid' // 서비스 이름 변경 반영
}));

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
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
