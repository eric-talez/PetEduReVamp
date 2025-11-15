import { Router } from 'express';
import KJUR from 'jsrsasign';
import { csrfProtection } from '../middleware/csrf';
import { 
  ApiErrorCode,
  createSuccessResponse,
  HTTP_STATUS,
  extendResponse
} from '../middleware/api-standards';

const router = Router();
router.use(extendResponse);

// Zoom SDK 환경 변수
const ZOOM_SDK_KEY = process.env.ZOOM_SDK_KEY || process.env.VITE_ZOOM_SDK_KEY;
const ZOOM_SDK_SECRET = process.env.ZOOM_SDK_SECRET;

/**
 * Zoom Meeting SDK Signature 생성
 * POST /api/zoom/signature
 */
router.post('/signature', csrfProtection, (req, res) => {
  try {
    const { meetingNumber, role = 0 } = req.body;

    // 입력 검증
    if (!meetingNumber) {
      return res.error(
        ApiErrorCode.MISSING_REQUIRED_FIELD,
        'meetingNumber is required'
      );
    }

    // SDK 키 확인
    if (!ZOOM_SDK_KEY || !ZOOM_SDK_SECRET) {
      console.error('[Zoom] SDK Key 또는 Secret이 설정되지 않았습니다.');
      return res.error(
        ApiErrorCode.CONFIGURATION_ERROR,
        'Zoom SDK credentials not configured'
      );
    }

    // 타임스탬프 생성
    const iat = Math.round(new Date().getTime() / 1000) - 30;
    const exp = iat + 60 * 60 * 2; // 2시간 만료

    // JWT Header
    const oHeader = { 
      alg: 'HS256', 
      typ: 'JWT' 
    };

    // JWT Payload
    const oPayload = {
      sdkKey: ZOOM_SDK_KEY,
      appKey: ZOOM_SDK_KEY,
      mn: meetingNumber.toString(),
      role: role, // 0 = participant, 1 = host
      iat: iat,
      exp: exp,
      tokenExp: exp
    };

    // Signature 생성
    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);
    const signature = KJUR.jws.JWS.sign(
      'HS256', 
      sHeader, 
      sPayload, 
      ZOOM_SDK_SECRET
    );

    console.log('[Zoom] Signature 생성 성공:', {
      meetingNumber,
      role,
      exp: new Date(exp * 1000).toISOString()
    });

    return res.success({
      signature,
      sdkKey: ZOOM_SDK_KEY
    }, 'Zoom Meeting SDK signature generated successfully');

  } catch (error) {
    console.error('[Zoom] Signature 생성 오류:', error);
    return res.error(
      ApiErrorCode.INTERNAL_SERVER_ERROR,
      'Failed to generate Zoom signature'
    );
  }
});

/**
 * 헬스 체크
 * GET /api/zoom/health
 */
router.get('/health', (req, res) => {
  const isConfigured = !!(ZOOM_SDK_KEY && ZOOM_SDK_SECRET);
  
  return res.success({
    status: 'ok',
    configured: isConfigured,
    sdkKey: isConfigured ? ZOOM_SDK_KEY.substring(0, 8) + '...' : null
  }, 'Zoom service health check');
});

export default router;
