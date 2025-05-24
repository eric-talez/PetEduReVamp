import { Router } from 'express';
import path from 'path';
import fs from 'fs';

const staticRouter = Router();

// 알림 테스트 페이지 제공
staticRouter.get('/notification-test', (req, res) => {
  const filePath = path.resolve(process.cwd(), 'public', 'notification-test.html');
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('알림 테스트 페이지를 찾을 수 없습니다.');
  }
});

export function registerStaticRoutes(app: any) {
  app.use('/', staticRouter);
  console.log('[StaticRoutes] 정적 파일 라우트 등록됨');
}