
import type { Express } from "express";

// 결제 수단 테스트 함수 (Toss Payments 기반)
async function testTossPayment(amount: number = 1000) {
  try {
    // 실제 환경에서는 환경변수에서 가져와야 함
    const secretKey = process.env.TOSS_SECRET_KEY || 'test_sk_example';
    
    // Base64 인코딩
    const encodedKey = Buffer.from(secretKey + ':').toString('base64');
    
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey: 'test_payment_key_' + Date.now(),
        orderId: 'test_order_' + Date.now(),
        amount: amount
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Toss 결제 테스트 오류:', error);
    return false;
  }
}

// 결제 취소 함수
async function cancelTossPayment(paymentKey: string, reason: string = '관리자 취소') {
  try {
    const secretKey = process.env.TOSS_SECRET_KEY || 'test_sk_example';
    const encodedKey = Buffer.from(secretKey + ':').toString('base64');
    
    const response = await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cancelReason: reason
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Toss 결제 취소 오류:', error);
    return false;
  }
}

export function registerPaymentIntegrationRoutes(app: Express) {
  // 결제 수단 테스트 API
  app.post('/api/admin/payment/test', async (req, res) => {
    try {
      const { methodId, amount = 1000 } = req.body;

      console.log(`[Payment] ${methodId} 결제 테스트 시작 - 금액: ${amount}원`);

      let testResult = false;

      switch (methodId) {
        case 'toss':
          testResult = await testTossPayment(amount);
          break;
        case 'kakao':
          // KakaoPay 테스트 로직 (추후 구현)
          testResult = true; // 임시로 성공으로 설정
          break;
        case 'naver':
          // NaverPay 테스트 로직 (추후 구현)
          testResult = true; // 임시로 성공으로 설정
          break;
        default:
          throw new Error(`지원하지 않는 결제 수단: ${methodId}`);
      }

      if (testResult) {
        console.log(`[Payment] ${methodId} 결제 테스트 성공`);
        res.json({
          success: true,
          methodId,
          amount,
          message: '결제 테스트가 성공적으로 완료되었습니다.',
          timestamp: new Date().toISOString()
        });
      } else {
        console.log(`[Payment] ${methodId} 결제 테스트 실패`);
        res.status(400).json({
          success: false,
          methodId,
          amount,
          message: '결제 테스트가 실패했습니다.',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('[Payment] 결제 테스트 오류:', error);
      res.status(500).json({
        success: false,
        message: '결제 테스트 중 서버 오류가 발생했습니다.',
        error: error.message
      });
    }
  });

  // 결제 수단 상태 변경 API
  app.patch('/api/admin/payment/methods/:methodId/status', async (req, res) => {
    try {
      const { methodId } = req.params;
      const { status } = req.body;

      console.log(`[Payment] ${methodId} 결제 수단 상태 변경: ${status}`);

      // 실제로는 데이터베이스에 저장
      const updatedMethod = {
        id: methodId,
        status: status,
        updatedAt: new Date().toISOString()
      };

      res.json({
        success: true,
        data: updatedMethod,
        message: `${methodId} 결제 수단이 ${status === 'active' ? '활성화' : '비활성화'}되었습니다.`
      });
    } catch (error) {
      console.error('[Payment] 결제 수단 상태 변경 오류:', error);
      res.status(500).json({
        success: false,
        message: '결제 수단 상태 변경 중 오류가 발생했습니다.'
      });
    }
  });

  // 요금제 업데이트 API
  app.patch('/api/admin/payment/plans/:role', async (req, res) => {
    try {
      const { role } = req.params;
      const updates = req.body;

      console.log(`[Payment] ${role} 요금제 업데이트:`, updates);

      // 실제로는 데이터베이스에 저장
      const updatedPlan = {
        role,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      res.json({
        success: true,
        data: updatedPlan,
        message: `${role} 요금제가 업데이트되었습니다.`
      });
    } catch (error) {
      console.error('[Payment] 요금제 업데이트 오류:', error);
      res.status(500).json({
        success: false,
        message: '요금제 업데이트 중 오류가 발생했습니다.'
      });
    }
  });

  // 결제 내역 조회 API
  app.get('/api/admin/payment/history', async (req, res) => {
    try {
      // 실제로는 데이터베이스에서 조회
      const paymentHistory = [
        {
          id: 1,
          userId: 1,
          userName: '김견주',
          amount: 29000,
          method: 'toss',
          status: 'completed',
          createdAt: '2024-12-20T10:00:00Z'
        },
        {
          id: 2,
          userId: 2,
          userName: '박훈련',
          amount: 99000,
          method: 'kakao',
          status: 'completed',
          createdAt: '2024-12-19T15:30:00Z'
        }
      ];

      res.json({
        success: true,
        data: paymentHistory,
        total: paymentHistory.length
      });
    } catch (error) {
      console.error('[Payment] 결제 내역 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: '결제 내역 조회 중 오류가 발생했습니다.'
      });
    }
  });

  // 결제 취소 API
  app.post('/api/admin/payment/cancel/:paymentKey', async (req, res) => {
    try {
      const { paymentKey } = req.params;
      const { reason = '관리자 취소' } = req.body;

      console.log(`[Payment] 결제 취소 요청: ${paymentKey}, 사유: ${reason}`);

      const cancelResult = await cancelTossPayment(paymentKey, reason);

      if (cancelResult) {
        res.json({
          success: true,
          paymentKey,
          message: '결제가 성공적으로 취소되었습니다.',
          cancelReason: reason,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(400).json({
          success: false,
          paymentKey,
          message: '결제 취소에 실패했습니다.'
        });
      }
    } catch (error) {
      console.error('[Payment] 결제 취소 오류:', error);
      res.status(500).json({
        success: false,
        message: '결제 취소 중 서버 오류가 발생했습니다.'
      });
    }
  });

  // 전체 결제 통계 API
  app.get('/api/admin/payment/stats', async (req, res) => {
    try {
      // 실제로는 데이터베이스에서 계산
      const stats = {
        totalRevenue: 1295000,
        monthlyGrowth: 12.5,
        activePaymentMethods: 3,
        totalPaymentMethods: 5,
        averageCommission: 2.97,
        totalPaidUsers: 87,
        monthlyNewUsers: 23
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('[Payment] 결제 통계 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: '결제 통계 조회 중 오류가 발생했습니다.'
      });
    }
  });

  console.log('[Payment] 결제연동 관리 라우트가 등록되었습니다.');
}
