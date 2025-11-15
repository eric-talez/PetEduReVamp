import express from 'express';
import { db } from '../db';
import { fcmTokens, insertFcmTokenSchema } from '../../shared/schema';
import { eq, and } from 'drizzle-orm';

const router = express.Router();

/**
 * POST /api/fcm/register-token
 * FCM 토큰 등록
 */
router.post('/register-token', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: '로그인이 필요합니다' });
    }

    const validation = insertFcmTokenSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: '잘못된 요청 데이터', 
        details: validation.error.errors 
      });
    }

    const { token, deviceType, deviceInfo } = validation.data;

    // 기존 토큰 확인 (이미 등록된 경우 업데이트)
    const existingToken = await db
      .select()
      .from(fcmTokens)
      .where(and(
        eq(fcmTokens.userId, req.user.id),
        eq(fcmTokens.token, token)
      ))
      .limit(1);

    if (existingToken.length > 0) {
      // 기존 토큰 활성화 및 업데이트
      await db
        .update(fcmTokens)
        .set({ 
          isActive: true, 
          deviceType,
          deviceInfo,
          updatedAt: new Date() 
        })
        .where(eq(fcmTokens.id, existingToken[0].id));

      console.log(`[FCM] 사용자 ${req.user.id}의 기존 토큰 갱신됨`);
      return res.json({ 
        message: '토큰이 갱신되었습니다',
        tokenId: existingToken[0].id 
      });
    }

    // 새 토큰 등록
    const [newToken] = await db
      .insert(fcmTokens)
      .values({
        userId: req.user.id,
        token,
        deviceType,
        deviceInfo,
        isActive: true,
      })
      .returning();

    console.log(`[FCM] 사용자 ${req.user.id}의 새 토큰 등록됨 (${deviceType || 'unknown'})`);

    res.status(201).json({ 
      message: '토큰이 등록되었습니다',
      tokenId: newToken.id 
    });
  } catch (error: any) {
    console.error('[FCM] 토큰 등록 실패:', error);
    
    // 중복 토큰 에러 처리
    if (error.code === '23505') { // PostgreSQL unique violation
      return res.status(409).json({ error: '이미 등록된 토큰입니다' });
    }
    
    res.status(500).json({ error: '토큰 등록에 실패했습니다' });
  }
});

/**
 * POST /api/fcm/unregister-token
 * FCM 토큰 제거 (로그아웃 시)
 */
router.post('/unregister-token', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: '로그인이 필요합니다' });
    }

    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: '토큰이 필요합니다' });
    }

    // 토큰 비활성화 (삭제하지 않고 비활성화)
    const result = await db
      .update(fcmTokens)
      .set({ 
        isActive: false, 
        updatedAt: new Date() 
      })
      .where(and(
        eq(fcmTokens.userId, req.user.id),
        eq(fcmTokens.token, token)
      ))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: '토큰을 찾을 수 없습니다' });
    }

    console.log(`[FCM] 사용자 ${req.user.id}의 토큰 비활성화됨`);

    res.json({ message: '토큰이 비활성화되었습니다' });
  } catch (error) {
    console.error('[FCM] 토큰 제거 실패:', error);
    res.status(500).json({ error: '토큰 제거에 실패했습니다' });
  }
});

/**
 * GET /api/fcm/tokens (디버그용)
 * 사용자의 등록된 FCM 토큰 목록 조회
 */
router.get('/tokens', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: '로그인이 필요합니다' });
    }

    const tokens = await db
      .select({
        id: fcmTokens.id,
        deviceType: fcmTokens.deviceType,
        deviceInfo: fcmTokens.deviceInfo,
        isActive: fcmTokens.isActive,
        createdAt: fcmTokens.createdAt,
        updatedAt: fcmTokens.updatedAt,
      })
      .from(fcmTokens)
      .where(eq(fcmTokens.userId, req.user.id));

    res.json({ tokens });
  } catch (error) {
    console.error('[FCM] 토큰 목록 조회 실패:', error);
    res.status(500).json({ error: '토큰 목록 조회에 실패했습니다' });
  }
});

export default router;
