import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import session from "express-session";
import memorystore from "memorystore";
import path from "path";

const MemoryStore = memorystore(session);
const app = express();
// 이미지 업로드를 위해 JSON 요청 크기 제한 증가 (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// 먼저 정적 파일 서빙 설정 (public 디렉토리의 파일을 직접 제공)
app.use(express.static(path.resolve(import.meta.dirname, "..", "public")));

// 세션 설정
app.use(session({
  secret: 'peteduplatform-secret-key',
  resave: true, // 세션 변경이 없어도 항상 저장
  saveUninitialized: true, // 초기화되지 않은 세션도 저장
  store: new MemoryStore({
    checkPeriod: 86400000 // 24시간마다 만료된 세션 정리
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24시간
    secure: false, // 개발 환경에서는 false, 프로덕션에서는 true로 설정
    httpOnly: false, // 개발 중에는 false로 설정하여 디버깅 용이하게
    sameSite: 'lax',
    path: '/' // 모든 경로에서 쿠키 사용 가능
  },
  name: 'petedu.sid' // 명시적인 세션 쿠키 이름 설정
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
