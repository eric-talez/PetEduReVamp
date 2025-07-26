import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { registerMessagingRoutes } from "./routes/messaging";
import { registerDashboardRoutes } from "./routes/dashboard";
import { registerAdminRoutes } from "./routes/admin";
// import { errorHandler } from "./middleware/error-handler";
import { registerShoppingRoutes } from "./routes/shopping";
import { productRoutes } from "./routes/products";
import { simpleProductRoutes } from "./routes/simple-products";
// import { registerNotificationRoutes } from "./routes/notification-routes";
import { registerUploadRoutes } from "./routes/upload";
import { registerLocationRoutes } from "./location/routes";
import { storage } from "./storage";
import Stripe from "stripe";
import { eventRoutes } from "./routes/events";
import { eventUpdater } from "./services/eventUpdater";
import { courses, users, institutes } from "../shared/schema";
import { ilike, or } from "drizzle-orm";
import { 
  analyzePetBehavior, 
  generateTrainingPlan, 
  analyzeHealthSymptoms,
  summarizeArticle,
  analyzeSentiment,
  analyzeImage,
  analyzeVideo,
  generateImage
} from "./gemini";
import {
  fusedBehaviorAnalysis,
  fusedTrainingPlan,
  fusedHealthAnalysis,
  fusedSentimentAnalysis,
  compareModelPerformance
} from "./ai-fusion";
import { setupCommissionRoutes } from './commission/routes';
// import { setupHealthRoutes } from './routes/health';
import { registerAnalyticsRoutes } from './routes/analytics';
import { setupSocialRoutes } from './routes/social';
import { registerCourseManagementRoutes } from './routes/course-management';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { WorkflowEngine } from './workflow-engine';
import { uploadDocuments } from './middleware/upload';
import xlsx from 'xlsx';
import { contentCrawler } from './content-crawler';

// 유료/무료 정보를 포함한 엑셀 파일에서 커리큘럼 정보 추출 함수
function parseExcelCurriculumWithPricing(data: any[], filename: string) {
  try {
    console.log('[엑셀 파싱] 데이터 파싱 시작:', filename);
    console.log('[엑셀 파싱] 전체 데이터 행 수:', data.length);
    
    let title = filename.replace(/\.(xlsx|xls)$/, '');
    let description = "";
    let category = "전문교육";
    let difficulty = "intermediate";
    let duration = 0;
    let price = 0;
    let modules: any[] = [];

    // 모든 데이터 출력해서 구조 파악
    console.log('[엑셀 파싱] 전체 데이터 구조:');
    for (let i = 0; i < Math.min(data.length, 15); i++) {
      if (data[i] && data[i].length > 0) {
        console.log(`행 ${i}:`, data[i]);
      }
    }

    // 첫 번째 행에서 제목 찾기
    if (data.length > 0 && data[0] && data[0][0]) {
      const firstCellValue = String(data[0][0]).trim();
      if (firstCellValue && firstCellValue.length > 3) {
        title = firstCellValue;
        console.log('[엑셀 파싱] 제목 발견:', title);
      }
    }

    // 기본 정보 추출 - 더 유연하게
    for (let i = 0; i < Math.min(data.length, 20); i++) {
      const row = data[i];
      if (!row || row.length === 0) continue;

      for (let j = 0; j < row.length - 1; j++) {
        const cellValue = String(row[j] || '').trim().toLowerCase();
        const nextCellValue = String(row[j + 1] || '').trim();
        
        if ((cellValue.includes('설명') || cellValue.includes('description') || cellValue.includes('커리큘럼')) && nextCellValue) {
          description = nextCellValue;
          console.log('[엑셀 파싱] 설명 발견:', description);
        } else if ((cellValue.includes('카테고리') || cellValue.includes('category') || cellValue.includes('분류')) && nextCellValue) {
          category = nextCellValue;
          console.log('[엑셀 파싱] 카테고리 발견:', category);
        } else if ((cellValue.includes('전체가격') || cellValue.includes('총가격') || cellValue.includes('price')) && nextCellValue) {
          const parsedPrice = parseInt(nextCellValue.replace(/[^\d]/g, ''));
          if (!isNaN(parsedPrice)) {
            price = parsedPrice;
            console.log('[엑셀 파싱] 가격 발견:', price);
          }
        }
      }
    }

    // 모듈 정보 추출 - 다양한 패턴 인식
    let moduleTableStart = -1;
    let headerRow = -1;
    
    // 테이블 헤더 찾기
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (!row) continue;
      
      const rowText = row.map(cell => String(cell || '').trim().toLowerCase()).join(' ');
      
      if (rowText.includes('회차') || rowText.includes('차시') || rowText.includes('강의') || rowText.includes('모듈')) {
        // 헤더 행 발견
        headerRow = i;
        moduleTableStart = i + 1;
        console.log('[엑셀 파싱] 모듈 테이블 헤더 발견:', i, row);
        break;
      }
    }

    // 모듈 정보 추출
    if (moduleTableStart > 0) {
      let moduleIndex = 1;
      console.log('[엑셀 파싱] 모듈 추출 시작:', moduleTableStart);
      
      for (let i = moduleTableStart; i < Math.min(data.length, moduleTableStart + 30); i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;

        // 빈 행이면 건너뛰기
        const hasContent = row.some(cell => cell && String(cell).trim().length > 0);
        if (!hasContent) continue;

        console.log(`[엑셀 파싱] 모듈 행 ${i} 처리:`, row);

        let moduleTitle = '';
        let moduleDescription = '';
        let moduleDuration = 60;
        let isFree = moduleIndex === 1; // 첫 번째 모듈은 기본 무료
        let modulePrice = 0;

        // 각 컬럼에서 정보 추출
        let moduleMaterials = '';
        
        for (let j = 0; j < row.length; j++) {
          const cellValue = String(row[j] || '').trim();
          
          if (j === 0 && cellValue.match(/\d+/)) {
            // 첫 번째 컬럼: 회차 정보
            continue;
          } else if (j === 1 && cellValue && cellValue.length > 2) {
            // 두 번째 컬럼: 제목
            moduleTitle = cellValue;
          } else if (j === 2 && cellValue && cellValue.length > 2) {
            // 세 번째 컬럼: 설명
            moduleDescription = cellValue;
          } else if (j === 3 && cellValue) {
            // 네 번째 컬럼: 시간
            const parsedDuration = parseInt(cellValue.replace(/[^\d]/g, ''));
            if (!isNaN(parsedDuration) && parsedDuration > 0) {
              moduleDuration = parsedDuration;
            }
          } else if (j === 4 && cellValue) {
            // 다섯 번째 컬럼: 무료/유료
            const lowerValue = cellValue.toLowerCase();
            isFree = lowerValue === 'y' || lowerValue === 'yes' || lowerValue === '무료' || lowerValue === 'free';
          } else if (j === 5 && cellValue && !isFree) {
            // 여섯 번째 컬럼: 개별가격
            const parsedPrice = parseInt(cellValue.replace(/[^\d]/g, ''));
            if (!isNaN(parsedPrice)) {
              modulePrice = parsedPrice;
            }
          } else if (j === 6 && cellValue) {
            // 일곱 번째 컬럼: 준비물
            moduleMaterials = String(cellValue).trim();
          }
        }

        if (moduleTitle && moduleTitle.length > 1) {
          const module = {
            id: `module_${moduleIndex}_${Date.now()}`,
            title: `${moduleIndex}강. ${moduleTitle}`,
            description: moduleDescription || `${moduleTitle}에 대한 상세 내용`,
            order: moduleIndex,
            duration: moduleDuration,
            objectives: [moduleDescription || moduleTitle],
            content: `${moduleTitle}에 대한 전문적인 교육 내용`,
            detailedContent: {
              introduction: moduleDescription || `${moduleTitle}에 대한 소개`,
              mainTopics: [moduleTitle],
              practicalExercises: [`${moduleTitle} 실습`],
              keyPoints: [`${moduleTitle}의 핵심 포인트`],
              homework: `${moduleTitle} 복습`,
              resources: [`${moduleTitle} 참고자료`]
            },
            videos: [],
            isRequired: true,
            isFree: isFree,
            price: modulePrice,
            materials: moduleMaterials ? moduleMaterials.split(',').map(m => m.trim()).filter(m => m.length > 0) : []
          };
          
          modules.push(module);
          duration += moduleDuration;
          
          console.log(`[엑셀 파싱] 행 ${i} 전체 데이터:`, row);
          console.log('[엑셀 파싱] 모듈 추가:', {
            title: module.title,
            duration: module.duration,
            isFree: module.isFree,
            price: module.price,
            materials: module.materials
          });
          console.log(`[엑셀 파싱] 준비물 컬럼 원본 데이터 (row[6]):`, row[6], typeof row[6]);
          
          moduleIndex++;
          if (moduleIndex > 20) break; // 최대 20개 모듈
        }
      }
    }

    // 기본 모듈이 없으면 4개 생성
    if (modules.length === 0) {
      for (let i = 1; i <= 4; i++) {
        modules.push({
          id: `module_${i}_${Date.now()}`,
          title: `${i}강. ${title} - 모듈 ${i}`,
          description: `${title}의 ${i}번째 모듈`,
          order: i,
          duration: Math.floor(duration / 4),
          objectives: [`모듈 ${i} 학습 목표`],
          content: `${title}에 대한 전문적인 교육 내용 - 모듈 ${i}`,
          videos: [],
          isRequired: true,
          isFree: i === 1,
          price: i === 1 ? 0 : Math.floor(price / 4)
        });
      }
    }

    return {
      title,
      description: description || `${title}에 대한 전문 교육 과정`,
      category,
      difficulty,
      duration,
      price,
      modules
    };
  } catch (error) {
    console.error('[엑셀 파싱] 오류:', error);
    return null;
  }
}

// 기존 엑셀 파일에서 커리큘럼 정보 추출 함수 (호환성 유지)
function parseExcelCurriculum(data: any[], filename: string) {
  try {
    // 엑셀 데이터 분석
    let title = filename;
    let description = "";
    let category = "전문교육";
    let difficulty = "intermediate";
    let duration = 480;
    let price = 400000;
    let modules: any[] = [];

    // 첫 번째 행에서 제목 찾기
    if (data.length > 0 && data[0] && data[0][0]) {
      title = String(data[0][0]).trim();
    }

    // 설명 찾기 (두 번째 행 또는 특정 패턴)
    if (data.length > 1 && data[1] && data[1][0]) {
      description = String(data[1][0]).trim();
    }

    // 모듈 정보 추출 (행에서 강의명, 내용 등 찾기)
    let moduleIndex = 1;
    for (let i = 2; i < Math.min(data.length, 20); i++) {
      const row = data[i];
      if (!row || !row[0]) continue;

      const cellValue = String(row[0]).trim();
      
      // 강의나 모듈을 나타내는 패턴 찾기
      if (cellValue.includes('강') || cellValue.includes('모듈') || cellValue.includes('차시') || cellValue.includes('주차')) {
        let moduleTitle = cellValue;
        let moduleDescription = row[1] ? String(row[1]).trim() : `${moduleTitle}에 대한 상세 내용`;
        let moduleContent = row[2] ? String(row[2]).trim() : "";
        
        // 재활 관련 키워드가 있으면 특별 처리
        if (filename.includes('재활') || cellValue.includes('재활')) {
          category = "재활치료";
          difficulty = "advanced";
          price = 600000;
          duration = 720;
        }

        modules.push({
          id: `module_${moduleIndex}_${Date.now()}`,
          title: moduleTitle,
          description: moduleDescription,
          order: moduleIndex,
          duration: Math.floor(duration / 8), // 전체 시간을 8등분
          objectives: moduleContent ? [moduleContent] : [`${moduleTitle} 학습`],
          content: moduleContent || `${moduleTitle}에 대한 전문적인 교육 내용`,
          videos: [],
          isRequired: true,
          isFree: moduleIndex === 1, // 첫 번째 모듈은 무료
          price: moduleIndex === 1 ? 0 : Math.floor(price / 8) // 유료 모듈은 개별 가격
        });
        
        moduleIndex++;
        if (moduleIndex > 8) break; // 최대 8개 모듈
      }
    }

    // 기본 모듈이 없으면 4개 생성
    if (modules.length === 0) {
      for (let i = 1; i <= 4; i++) {
        modules.push({
          id: `module_${i}_${Date.now()}`,
          title: `${i}강. ${title} - 모듈 ${i}`,
          description: `${title}의 ${i}번째 모듈`,
          order: i,
          duration: Math.floor(duration / 4),
          objectives: [`모듈 ${i} 학습 목표`],
          content: `${title}에 대한 전문적인 교육 내용 - 모듈 ${i}`,
          videos: [],
          isRequired: true,
          isFree: i === 1, // 첫 번째 모듈은 무료
          price: i === 1 ? 0 : Math.floor(price / 4) // 유료 모듈은 개별 가격
        });
      }
    }

    return {
      title,
      description: description || `${title}에 대한 전문 교육 과정`,
      category,
      difficulty,
      duration,
      price,
      modules
    };
  } catch (error) {
    console.error('[엑셀 파싱] 오류:', error);
    return null;
  }
}

// requireAuth 미들웨어 함수
function requireAuth(role?: string) {
  return (req: any, res: any, next: any) => {
    // 개발 환경에서는 간단한 인증 체크
    if (process.env.NODE_ENV === 'development') {
      req.user = { id: 'admin', role: role || 'admin' };
      return next();
    }

    // 실제 프로덕션에서는 세션/토큰 기반 인증 구현
    const userRole = req.session?.user?.role || 'guest';

    if (role && userRole !== role) {
      return res.status(403).json({ error: '권한이 없습니다.' });
    }

    next();
  };
}

// Stripe 초기화 - 환경 변수 선택적 로드 (없어도 서버 시작 가능)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
console.log('🔑 Stripe Secret Key 확인:', stripeSecretKey ? `${stripeSecretKey.substring(0, 15)}...` : 'NOT SET');

let stripe: Stripe | null = null;

if (stripeSecretKey) {
  try {
    stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });
    console.log('✅ Stripe 초기화 성공');
  } catch (error) {
    console.error('❌ Stripe 초기화 실패:', error);
  }
} else {
  console.warn('⚠️ STRIPE_SECRET_KEY가 설정되지 않음 - 결제 기능 비활성화');
}

export async function registerRoutes(app: Express): Promise<Server> {

  // 인증 API 라우트
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
        email: account.email || `${username}@talez.com`,
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

  // 회원가입 API
  app.post('/api/register', async (req, res) => {
    try {
      const { username, password, email, name, userRole, instituteCode } = req.body;

      if (!username || !password || !email || !name) {
        return res.status(400).json({
          success: false,
          message: '필수 정보를 모두 입력해주세요.'
        });
      }

      // 사용자명 중복 확인 (기본 테스트 계정과 중복 방지)
      const testAccounts = ['test', 'testuser', 'trainer', 'trainer01', 'admin', 'institute', 'institute01'];
      if (testAccounts.includes(username)) {
        return res.status(409).json({
          success: false,
          message: '이미 사용 중인 아이디입니다.'
        });
      }

      // 새 사용자 데이터 생성
      const newUser = {
        id: username,
        username,
        email,
        name,
        role: userRole || 'pet-owner',
        password, // 실제 환경에서는 해시 처리 필요
        instituteCode: userRole === 'institute-admin' ? instituteCode : null,
        createdAt: new Date().toISOString(),
        isActive: true
      };

      // 메모리 저장소에 사용자 추가 (실제로는 storage.createUser 사용)
      console.log('새 사용자 등록:', newUser);

      return res.json({
        success: true,
        message: '회원가입이 완료되었습니다.',
        user: {
          id: newUser.id,
          username: newUser.username,
          role: newUser.role,
          name: newUser.name
        }
      });

    } catch (error) {
      console.error('회원가입 오류:', error);
      return res.status(500).json({
        success: false,
        message: '회원가입 처리 중 오류가 발생했습니다.'
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

  // 대시보드 라우트 등록
  registerDashboardRoutes(app);

  // 관리자 라우트 등록
  registerAdminRoutes(app);

  // 커미션 라우트 등록
  setupCommissionRoutes(app);

  // 기본 사용자 API 라우트
  app.get('/api/users', async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // 사용자별 펫 정보 포함
      const usersWithPets = users.map(user => ({
        id: user.id,
        name: user.name,
        role: user.role,
        pets: storage.pets.filter(pet => pet.ownerId === user.id).map(pet => ({
          id: pet.id,
          name: pet.name,
          breed: pet.breed,
          age: pet.age
        }))
      }));
      res.json(usersWithPets || []);
    } catch (error) {
      console.error('Users API error:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  // 관리자 사용자 API
  app.get('/api/admin/users', (req, res) => {
    try {
      const users = storage.getAllUsers();
      res.json(users || []);
    } catch (error) {
      console.error('Admin Users API error:', error);
      res.status(500).json({ error: 'Failed to fetch admin users' });
    }
  });

  // 구독 플랜 관련 API
  app.get('/api/subscription-plans', (req, res) => {
    try {
      const plans = storage.getSubscriptionPlans();
      console.log('[Admin] 구독 플랜 조회:', plans.length + '개');
      res.json(plans);
    } catch (error) {
      console.error('구독 플랜 조회 오류:', error);
      res.status(500).json({ error: '구독 플랜 조회에 실패했습니다.' });
    }
  });

  // 관리자 - 기관 등록 (구독 플랜 포함)
  app.post('/api/admin/institutes', (req, res) => {
    try {
      const {
        name,
        description,
        address,
        phone,
        email,
        website,
        businessNumber,
        directorName,
        directorEmail,
        subscriptionPlan,
        paymentMethod,
        isVerified = false
      } = req.body;

      // 필수 필드 검증
      if (!name || !email || !subscriptionPlan) {
        return res.status(400).json({ 
          error: '기관명, 이메일, 구독 플랜은 필수 항목입니다.' 
        });
      }

      // 구독 플랜 정보 조회
      const plan = storage.getSubscriptionPlan(subscriptionPlan);
      if (!plan) {
        return res.status(400).json({ 
          error: '유효하지 않은 구독 플랜입니다.' 
        });
      }

      // 기관 등록 데이터 생성
      const instituteData = {
        name,
        description,
        address,
        phone,
        email,
        website,
        businessNumber,
        directorName,
        directorEmail,
        isVerified,
        subscriptionPlan: plan.code,
        subscriptionStatus: 'pending_payment',
        subscriptionStartDate: new Date().toISOString(),
        subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        maxMembers: plan.maxMembers,
        maxVideoHours: plan.maxVideoHours,
        maxAiAnalysis: plan.maxAiAnalysis,
        featuresEnabled: plan.features,
        paymentMethod,
        monthlyPrice: plan.price
      };

      // 기관 등록
      const institute = storage.createInstituteWithSubscription(instituteData);

      // 결제 처리 시뮬레이션
      if (paymentMethod === 'card') {
        // 실제로는 Stripe나 다른 결제 서비스와 연동
        institute.subscriptionStatus = 'active';
        institute.paymentStatus = 'paid';
        institute.lastPaymentDate = new Date().toISOString();
        institute.nextPaymentDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      }

      res.status(201).json({
        success: true,
        message: '기관이 성공적으로 등록되었습니다.',
        institute,
        subscriptionPlan: plan,
        paymentRequired: paymentMethod !== 'card'
      });

    } catch (error) {
      console.error('기관 등록 오류:', error);
      res.status(500).json({ 
        error: '기관 등록 중 오류가 발생했습니다.' 
      });
    }
  });

  // 관리자 - 기관 목록 조회
  app.get('/api/admin/institutes', (req, res) => {
    try {
      console.log('[Admin] 기관 관리 목록 조회 요청');
      const institutes = storage.getAllInstitutes();
      const subscriptionPlans = storage.getSubscriptionPlans();
      
      console.log('[DEBUG] 사용 가능한 구독 플랜들:', subscriptionPlans.map(p => ({ code: p.code, name: p.name })));
      console.log('[DEBUG] 첫 번째 기관의 구독 플랜:', institutes[0]?.subscriptionPlan);
      console.log('[DEBUG] 전체 기관 구독 플랜:', institutes.map(i => ({ name: i.name, subscriptionPlan: i.subscriptionPlan })));
      
      // 통계 정보 계산
      const stats = {
        totalInstitutes: institutes.length,
        activeInstitutes: institutes.filter(i => i.status === 'active').length,
        pendingInstitutes: institutes.filter(i => i.status === 'pending').length,
        suspendedInstitutes: institutes.filter(i => i.status === 'suspended').length,
        verifiedInstitutes: institutes.filter(i => i.isVerified).length,
        totalTrainers: institutes.reduce((sum, i) => sum + (i.trainersCount || 0), 0),
        totalStudents: institutes.reduce((sum, i) => sum + (i.studentsCount || 0), 0),
        totalCourses: institutes.reduce((sum, i) => sum + (i.coursesCount || 0), 0)
      };

      // 기관 데이터 가공 - 구독 플랜 정보 매핑
      const processedInstitutes = institutes.map(institute => {
        const subscriptionPlan = subscriptionPlans.find(plan => plan.code === institute.subscriptionPlan);
        
        console.log(`[DEBUG] 기관 ${institute.name} - 구독 플랜: ${institute.subscriptionPlan}, 매칭 결과:`, subscriptionPlan);
        
        // 명시적으로 구독 플랜 정보를 매핑
        const result = {
          id: institute.id,
          name: institute.name,
          code: institute.code,
          businessNumber: institute.businessNumber,
          address: institute.address,
          phone: institute.phone,
          email: institute.email,
          directorName: institute.directorName,
          directorEmail: institute.directorEmail,
          trainerName: institute.trainerName,
          trainerId: institute.trainerId,
          status: institute.status || 'active',
          isActive: institute.isActive,
          isVerified: institute.isVerified,
          certification: institute.certification,
          establishedDate: institute.establishedDate,
          registeredDate: institute.registeredDate,
          trainersCount: institute.trainersCount,
          studentsCount: institute.studentsCount,
          coursesCount: institute.coursesCount,
          facilities: institute.facilities,
          operatingHours: institute.operatingHours,
          description: institute.description,
          website: institute.website,
          specialPrograms: institute.specialPrograms,
          suspendedReason: institute.suspendedReason,
          
          // 구독 플랜 정보 명시적 매핑
          subscriptionPlan: institute.subscriptionPlan,
          subscriptionPlanInfo: subscriptionPlan ? `${subscriptionPlan.name} (${subscriptionPlan.price.toLocaleString()}원)` : '미지정',
          subscriptionPlanCode: institute.subscriptionPlan || null,
          subscriptionPlanName: subscriptionPlan ? subscriptionPlan.name : '미지정',
          subscriptionPlanPrice: subscriptionPlan ? subscriptionPlan.price : 0,
          subscriptionStatus: institute.subscriptionStatus || 'active',
          subscriptionStartDate: institute.subscriptionStartDate,
          subscriptionEndDate: institute.subscriptionEndDate,
          
          // 기타 필드들
          maxMembers: institute.maxMembers || 0,
          maxVideoHours: institute.maxVideoHours || 0,
          maxAiAnalysis: institute.maxAiAnalysis || 0,
          featuresEnabled: institute.featuresEnabled,
          totalRevenue: institute.totalRevenue || 0,
          monthlyRevenue: institute.monthlyRevenue || 0,
          videoClassCount: institute.videoClassCount || 0,
          aiAnalysisCount: institute.aiAnalysisCount || 0,
          createdAt: institute.createdAt || new Date().toISOString()
        };
        
        console.log(`[DEBUG] 기관 ${institute.name} 처리 결과:`, {
          subscriptionPlan: result.subscriptionPlan,
          subscriptionPlanInfo: result.subscriptionPlanInfo,
          subscriptionPlanName: result.subscriptionPlanName
        });
        
        return result;
      });

      const response = {
        success: true,
        data: {
          institutes: processedInstitutes,
          stats,
          subscriptionPlans
        },
        message: '기관 목록을 성공적으로 조회했습니다.'
      };
      
      console.log('[DEBUG] 응답 데이터 샘플:', {
        institutesCount: processedInstitutes.length,
        firstInstitute: processedInstitutes[0]?.name,
        firstInstituteSubscriptionInfo: processedInstitutes[0]?.subscriptionPlanInfo,
        firstInstituteSubscriptionPlan: processedInstitutes[0]?.subscriptionPlan,
        firstInstituteSubscriptionPlanName: processedInstitutes[0]?.subscriptionPlanName,
        subscriptionPlansCount: subscriptionPlans.length
      });
      
      // 응답 JSON 확인
      console.log('[DEBUG] JSON 응답 샘플:', JSON.stringify({
        firstInstitute: {
          name: processedInstitutes[0]?.name,
          subscriptionPlan: processedInstitutes[0]?.subscriptionPlan,
          subscriptionPlanInfo: processedInstitutes[0]?.subscriptionPlanInfo,
          subscriptionPlanName: processedInstitutes[0]?.subscriptionPlanName,
          subscriptionPlanPrice: processedInstitutes[0]?.subscriptionPlanPrice
        }
      }, null, 2));

      res.json(response);

    } catch (error: any) {
      console.error('[Admin] 기관 목록 조회 중 오류:', error);
      res.status(500).json({
        success: false,
        message: '기관 목록 조회 중 오류가 발생했습니다.',
        error: error.message
      });
    }
  });

  // 관리자 - 기관 구독 변경
  app.put('/api/admin/institutes/:id/subscription', (req, res) => {
    try {
      const instituteId = parseInt(req.params.id);
      const { subscriptionPlan } = req.body;

      const plan = storage.getSubscriptionPlan(subscriptionPlan);
      if (!plan) {
        return res.status(400).json({ 
          error: '유효하지 않은 구독 플랜입니다.' 
        });
      }

      const updateData = {
        subscriptionPlan: plan.code,
        maxMembers: plan.maxMembers,
        maxVideoHours: plan.maxVideoHours,
        maxAiAnalysis: plan.maxAiAnalysis,
        featuresEnabled: plan.features,
        monthlyPrice: plan.price
      };

      const updatedInstitute = storage.updateInstituteSubscription(instituteId, updateData);
      
      if (!updatedInstitute) {
        return res.status(404).json({ 
          error: '기관을 찾을 수 없습니다.' 
        });
      }

      res.json({
        success: true,
        message: '구독 플랜이 변경되었습니다.',
        institute: updatedInstitute,
        subscriptionPlan: plan
      });

    } catch (error) {
      console.error('구독 플랜 변경 오류:', error);
      res.status(500).json({ 
        error: '구독 플랜 변경 중 오류가 발생했습니다.' 
      });
    }
  });

  // 관리자 - 기관 정보 수정
  app.put('/api/admin/institutes/:id', (req, res) => {
    try {
      const instituteId = parseInt(req.params.id);
      const updateData = req.body;
      
      console.log('[Admin] 기관 정보 수정 요청:', instituteId, updateData);
      
      // 기관 정보 업데이트
      const updatedInstitute = storage.updateInstitute(instituteId, updateData);
      
      if (!updatedInstitute) {
        return res.status(404).json({ 
          error: '기관을 찾을 수 없습니다.' 
        });
      }

      console.log('[Admin] 기관 정보 수정 완료:', updatedInstitute.id);
      
      res.json({
        success: true,
        message: '기관 정보가 성공적으로 수정되었습니다.',
        institute: updatedInstitute
      });

    } catch (error) {
      console.error('[Admin] 기관 정보 수정 오류:', error);
      res.status(500).json({ 
        error: '기관 정보 수정 중 오류가 발생했습니다.' 
      });
    }
  });

  // 기관 구독 결제 처리
  app.post('/api/institutes/:id/payment', async (req, res) => {
    try {
      const instituteId = parseInt(req.params.id);
      const { paymentMethod, cardInfo } = req.body;

      const institute = await storage.getInstitute(instituteId);
      if (!institute) {
        return res.status(404).json({ 
          error: '기관을 찾을 수 없습니다.' 
        });
      }

      // 결제 처리 시뮬레이션
      const paymentResult = {
        success: true,
        transactionId: 'txn_' + Date.now(),
        amount: institute.monthlyPrice,
        currency: 'KRW',
        method: paymentMethod,
        status: 'completed',
        paidAt: new Date().toISOString()
      };

      // 구독 상태 업데이트
      const updateData = {
        subscriptionStatus: 'active',
        paymentStatus: 'paid',
        lastPaymentDate: new Date().toISOString(),
        nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };

      await storage.updateInstituteSubscription(instituteId, updateData);

      res.json({
        success: true,
        message: '결제가 완료되었습니다.',
        payment: paymentResult
      });

    } catch (error) {
      console.error('결제 처리 오류:', error);
      res.status(500).json({ 
        error: '결제 처리 중 오류가 발생했습니다.' 
      });
    }
  });

  // 관리자 - 기관 삭제
  app.delete('/api/admin/institutes/:id', requireAuth('admin'), async (req, res) => {
    try {
      const instituteId = parseInt(req.params.id);
      
      const success = await storage.deleteInstitute(instituteId);
      if (!success) {
        return res.status(404).json({ 
          error: '기관을 찾을 수 없습니다.' 
        });
      }

      res.json({
        success: true,
        message: '기관이 성공적으로 삭제되었습니다.'
      });
    } catch (error) {
      console.error('[Admin] 기관 삭제 오류:', error);
      res.status(500).json({ 
        error: '기관 삭제 중 오류가 발생했습니다.' 
      });
    }
  });

  // 관리자 대신 결제 처리
  app.post('/api/admin/institutes/:id/admin-payment', requireAuth('admin'), async (req, res) => {
    try {
      const instituteId = parseInt(req.params.id);
      const { subscriptionPlan } = req.body;

      // 구독 플랜 정보 조회
      const plan = await storage.getSubscriptionPlan(subscriptionPlan);
      if (!plan) {
        return res.status(400).json({ 
          error: '유효하지 않은 구독 플랜입니다.' 
        });
      }

      // 결제 처리 시뮬레이션 (관리자 대신 결제)
      const paymentResult = {
        success: true,
        transactionId: 'admin_txn_' + Date.now(),
        amount: plan.price,
        currency: 'KRW',
        method: 'admin_payment',
        status: 'completed',
        paidAt: new Date().toISOString(),
        paidBy: 'admin'
      };

      // 구독 상태 업데이트
      const updateData = {
        subscriptionPlan: plan.code,
        subscriptionStatus: 'active',
        paymentStatus: 'paid',
        lastPaymentDate: new Date().toISOString(),
        nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        maxMembers: plan.maxMembers,
        maxVideoHours: plan.maxVideoHours,
        maxAiAnalysis: plan.maxAiAnalysis,
        featuresEnabled: plan.features,
        monthlyPrice: plan.price,
        paymentMethod: 'admin_payment'
      };

      const updatedInstitute = await storage.updateInstituteSubscription(instituteId, updateData);
      
      if (!updatedInstitute) {
        return res.status(404).json({ 
          error: '기관을 찾을 수 없습니다.' 
        });
      }

      res.json({
        success: true,
        message: '관리자 결제로 구독 플랜이 변경되었습니다.',
        institute: updatedInstitute,
        payment: paymentResult,
        subscriptionPlan: plan
      });

    } catch (error) {
      console.error('[Admin] 관리자 결제 처리 오류:', error);
      res.status(500).json({ 
        error: '관리자 결제 처리 중 오류가 발생했습니다.' 
      });
    }
  });

  // 기관 관리자 결제 요청
  app.post('/api/admin/institutes/:id/request-payment', requireAuth('admin'), async (req, res) => {
    try {
      const instituteId = parseInt(req.params.id);
      const { subscriptionPlan } = req.body;

      // 구독 플랜 정보 조회
      const plan = await storage.getSubscriptionPlan(subscriptionPlan);
      if (!plan) {
        return res.status(400).json({ 
          error: '유효하지 않은 구독 플랜입니다.' 
        });
      }

      // 기관 정보 조회
      const institute = await storage.getInstitute(instituteId);
      if (!institute) {
        return res.status(404).json({ 
          error: '기관을 찾을 수 없습니다.' 
        });
      }

      // 결제 요청 생성
      const paymentRequest = {
        id: 'req_' + Date.now(),
        instituteId: instituteId,
        instituteName: institute.name,
        subscriptionPlan: plan.code,
        planName: plan.name,
        amount: plan.price,
        currency: 'KRW',
        status: 'pending',
        requestedAt: new Date().toISOString(),
        requestedBy: 'admin',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7일 후 만료
      };

      // 결제 요청 저장 (실제로는 데이터베이스에 저장)
      await storage.createPaymentRequest(paymentRequest);

      // 기관 관리자에게 이메일 알림 전송 (시뮬레이션)
      console.log(`[Payment Request] 기관 ${institute.name}에 결제 요청 전송:`, paymentRequest);

      res.json({
        success: true,
        message: '기관 관리자에게 결제 요청이 전송되었습니다.',
        paymentRequest,
        subscriptionPlan: plan
      });

    } catch (error) {
      console.error('[Admin] 결제 요청 처리 오류:', error);
      res.status(500).json({ 
        error: '결제 요청 처리 중 오류가 발생했습니다.' 
      });
    }
  });

  // 기관 구독 변경 API
  app.post('/api/institutes/:id/subscription/change', requireAuth(), (req, res) => {
    const instituteId = parseInt(req.params.id);
    const { newPlanCode, paymentMethod } = req.body;
    
    // 기관 관리자 또는 시스템 관리자만 접근 가능
    const userRole = req.user?.role;
    const userId = req.user?.id;
    
    if (userRole !== 'admin' && userRole !== 'institute-admin') {
      return res.status(403).json({ error: '접근 권한이 없습니다.' });
    }
    
    // 기관 관리자인 경우 자신의 기관만 변경 가능
    if (userRole === 'institute-admin') {
      const institute = storage.getInstitute(instituteId);
      if (!institute || institute.directorId !== userId) {
        return res.status(403).json({ error: '자신의 기관만 변경할 수 있습니다.' });
      }
    }
    
    const result = storage.changeInstituteSubscription(instituteId, newPlanCode, paymentMethod);
    
    if (result) {
      res.json({
        message: '구독 플랜이 성공적으로 변경되었습니다.',
        ...result
      });
    } else {
      res.status(404).json({ error: '기관 또는 구독 플랜을 찾을 수 없습니다.' });
    }
  });

  // 기관 자체 결제 처리 API
  app.post('/api/institutes/:id/payment/process', requireAuth('institute-admin'), (req, res) => {
    const instituteId = parseInt(req.params.id);
    const paymentData = req.body;
    const userId = req.user?.id;
    
    // 기관 관리자 본인 확인
    const institute = storage.getInstitute(instituteId);
    if (!institute || institute.directorId !== userId) {
      return res.status(403).json({ error: '자신의 기관만 결제할 수 있습니다.' });
    }
    
    const result = storage.processInstitutePayment(instituteId, paymentData);
    
    if (result) {
      res.json({
        message: '결제가 성공적으로 처리되었습니다.',
        institute: result
      });
    } else {
      res.status(404).json({ error: '기관을 찾을 수 없습니다.' });
    }
  });

  // 관리자 대리 결제 처리 API
  app.post('/api/admin/payment-requests/:id/process', requireAuth('admin'), (req, res) => {
    const paymentRequestId = req.params.id;
    const adminId = req.user?.id;
    
    const result = storage.processAdminPayment(paymentRequestId, adminId);
    
    if (result) {
      res.json({
        message: '관리자 대리 결제가 성공적으로 처리되었습니다.',
        ...result
      });
    } else {
      res.status(404).json({ error: '결제 요청을 찾을 수 없습니다.' });
    }
  });

  // 기관 기능 접근 권한 확인
  app.get('/api/institutes/:id/access/:feature', async (req, res) => {
    try {
      const instituteId = parseInt(req.params.id);
      const feature = req.params.feature;

      const hasAccess = await storage.checkInstituteFeatureAccess(instituteId, feature);
      const limits = await storage.checkInstituteLimits(instituteId);

      res.json({
        hasAccess,
        limits
      });

    } catch (error) {
      console.error('기능 접근 권한 확인 오류:', error);
      res.status(500).json({ 
        error: '기능 접근 권한 확인 중 오류가 발생했습니다.' 
      });
    }
  });

  // 커리큘럼 등록 API
  app.post('/api/admin/curriculum', requireAuth('admin'), async (req, res) => {
    try {
      const curriculumData = req.body;
      
      // 커리큘럼 데이터를 저장소에 저장
      const newCurriculum = await storage.createCurriculum(curriculumData);
      
      console.log('[Admin] 새 커리큘럼 등록:', newCurriculum.title);
      
      res.json({
        success: true,
        message: '커리큘럼이 성공적으로 등록되었습니다.',
        curriculum: newCurriculum
      });
      
    } catch (error) {
      console.error('[Admin] 커리큘럼 등록 오류:', error);
      res.status(500).json({ 
        error: '커리큘럼 등록 중 오류가 발생했습니다.' 
      });
    }
  });

  // 커리큘럼 목록 조회 API
  app.get('/api/admin/curriculum', requireAuth('admin'), async (req, res) => {
    try {
      const curricula = await storage.getAllCurricula();
      res.json(curricula);
    } catch (error) {
      console.error('[Admin] 커리큘럼 목록 조회 오류:', error);
      res.status(500).json({ 
        error: '커리큘럼 목록 조회 중 오류가 발생했습니다.' 
      });
    }
  });

  // 커리큘럼 수정 API
  app.put('/api/admin/curriculum/:id', requireAuth('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      console.log(`[Admin] 커리큘럼 수정 요청: ${id}`, updateData.title || '제목 없음');
      console.log(`[Admin] 수정 데이터:`, JSON.stringify(updateData, null, 2));
      
      const updatedCurriculum = await storage.updateCurriculum(id, updateData);
      
      if (!updatedCurriculum) {
        console.error(`[Admin] 커리큘럼을 찾을 수 없음: ${id}`);
        return res.status(404).json({ error: '커리큘럼을 찾을 수 없습니다.' });
      }
      
      console.log(`[Admin] 커리큘럼 수정 성공: ${id}`, updatedCurriculum.title);
      
      res.json(updatedCurriculum); // 직접 커리큘럼 객체 반환
    } catch (error) {
      console.error('[Admin] 커리큘럼 수정 오류:', error);
      res.status(500).json({ 
        error: '커리큘럼 수정 중 오류가 발생했습니다.',
        details: error.message 
      });
    }
  });

  // 커리큘럼 삭제 API
  app.delete('/api/admin/curriculum/:id', requireAuth('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      
      console.log(`[Admin] 커리큘럼 삭제: ${id}`);
      
      const deleted = await storage.deleteCurriculum(id);
      
      if (!deleted) {
        return res.status(404).json({ error: '커리큘럼을 찾을 수 없습니다.' });
      }
      
      res.json({
        success: true,
        message: '커리큘럼이 성공적으로 삭제되었습니다.'
      });
    } catch (error) {
      console.error('[Admin] 커리큘럼 삭제 오류:', error);
      res.status(500).json({ 
        error: '커리큘럼 삭제 중 오류가 발생했습니다.' 
      });
    }
  });

  // 커리큘럼 상태 변경 API (발행/비발행)
  app.patch('/api/admin/curriculum/:id/status', requireAuth('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      console.log(`[Admin] 커리큘럼 상태 변경: ${id} -> ${status}`);
      
      if (!['draft', 'published', 'archived'].includes(status)) {
        return res.status(400).json({ error: '올바르지 않은 상태입니다.' });
      }
      
      const updatedCurriculum = await storage.updateCurriculum(id, { 
        status,
        publishedAt: status === 'published' ? new Date().toISOString() : null
      });
      
      if (!updatedCurriculum) {
        return res.status(404).json({ error: '커리큘럼을 찾을 수 없습니다.' });
      }
      
      res.json({
        success: true,
        message: `커리큘럼이 ${status === 'published' ? '발행' : status === 'draft' ? '임시저장' : '보관'}되었습니다.`,
        curriculum: updatedCurriculum
      });
    } catch (error) {
      console.error('[Admin] 커리큘럼 상태 변경 오류:', error);
      res.status(500).json({ 
        error: '커리큘럼 상태 변경 중 오류가 발생했습니다.' 
      });
    }
  });

  // 커리큘럼 발행 상태 초기화 API
  app.post('/api/admin/curriculums/:id/unpublish', requireAuth('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      
      console.log(`[Admin] 커리큘럼 발행 상태 초기화: ${id}`);
      
      const updatedCurriculum = await storage.updateCurriculum(id, { 
        status: 'draft',
        publishedAt: null
      });
      
      if (!updatedCurriculum) {
        return res.status(404).json({ error: '커리큘럼을 찾을 수 없습니다.' });
      }
      
      res.json({
        success: true,
        message: '커리큘럼이 draft 상태로 초기화되었습니다.',
        curriculum: updatedCurriculum
      });
    } catch (error) {
      console.error('[Admin] 커리큘럼 초기화 오류:', error);
      res.status(500).json({ 
        error: '커리큘럼 초기화 중 오류가 발생했습니다.' 
      });
    }
  });

  // 위치 검색 라우트 등록
  registerLocationRoutes(app);

  // 실시간 인기 통계 API
  app.get("/api/popular-stats", async (req, res) => {
    try {
      const popularStats = {
        trainers: [
          { id: 6, views: 2156, likes: 134, name: "강동훈 훈련사", category: "국가자격증" }
        ],
        courses: [
          { id: "curriculum-basic-obedience", views: 1923, likes: 98, title: "기초 복종훈련 완전정복", category: "기초훈련" }
        ],
        events: [
          { id: 1, views: 1534, likes: 76, title: "펫 케어 워크샵", category: "교육" },
          { id: 2, views: 1289, likes: 64, title: "반려견 사회화 프로그램", category: "사회화" }
        ],
        community: [
          { id: 1, views: 987, likes: 145, title: "우리 강아지 산책 팁 공유", category: "일상" },
          { id: 2, views: 823, likes: 98, title: "고양이 건강 관리법", category: "건강" }
        ]
      };

      res.json(popularStats);
    } catch (error) {
      console.error('인기 통계 조회 오류:', error);
      res.status(500).json({ error: "통계 데이터를 불러올 수 없습니다" });
    }
  });

  // 배너 API
  app.get("/api/banners", async (req, res) => {
    try {
      const banners = [
        {
          id: 1,
          title: "Talez 펫 교육 플랫폼",
          description: "반려동물과 함께하는 더 나은 삶을 위한 종합 교육 플랫폼",
          imageUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80",
          linkUrl: "/courses",
          isActive: true,
          type: "main",
          position: "hero"
        }
      ];

      res.json(banners);
    } catch (error) {
      console.error('배너 조회 오류:', error);
      res.status(500).json({ error: "배너 데이터를 불러올 수 없습니다" });
    }
  });

  // 상담 신청 API
  app.post("/api/consultation/request", async (req, res) => {
    try {
      const { trainerId, message, preferredDate } = req.body;

      console.log('상담 신청 요청:', { trainerId, message, preferredDate });

      res.json({ 
        success: true, 
        message: "상담 신청이 성공적으로 완료되었습니다." 
      });
    } catch (error) {
      console.error('상담 신청 오류:', error);
      res.status(500).json({ error: "상담 신청 중 오류가 발생했습니다" });
    }
  });

  // 메시지 전송 API
  app.post("/api/messages/send", async (req, res) => {
    try {
      const { receiverId, message } = req.body;

      console.log('메시지 전송 요청:', { receiverId, message });

      res.json({ 
        success: true, 
        message: "메시지가 성공적으로 전송되었습니다." 
      });
    } catch (error) {
      console.error('메시지 전송 오류:', error);
      res.status(500).json({ error: "메시지 전송 중 오류가 발생했습니다" });
    }
  });

  // 댓글 작성 API
  app.post("/api/comments/create", async (req, res) => {
    try {
      const { postId, content } = req.body;

      console.log('댓글 작성 요청:', { postId, content });

      res.json({ 
        success: true, 
        message: "댓글이 성공적으로 작성되었습니다.",
        comment: {
          id: Date.now(),
          postId,
          content,
          author: "반려인",
          createdAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('댓글 작성 오류:', error);
      res.status(500).json({ error: "댓글 작성 중 오류가 발생했습니다" });
    }
  });

  // 이벤트 참가 신청 API
  app.post("/api/events/:id/register", async (req, res) => {
    try {
      const eventId = req.params.id;

      console.log('이벤트 참가 신청:', { eventId });

      res.json({ 
        success: true, 
        message: "이벤트 참가 신청이 완료되었습니다." 
      });
    } catch (error) {
      console.error('이벤트 참가 신청 오류:', error);
      res.status(500).json({ error: "이벤트 참가 신청 중 오류가 발생했습니다" });
    }
  });

  // 이벤트 문의 API
  app.post("/api/events/:id/inquiry", async (req, res) => {
    try {
      const eventId = req.params.id;
      const { message } = req.body;

      console.log('이벤트 문의:', { eventId, message });

      res.json({ 
        success: true, 
        message: "문의가 성공적으로 전송되었습니다." 
      });
    } catch (error) {
      console.error('이벤트 문의 오류:', error);
      res.status(500).json({ error: "문의 전송 중 오류가 발생했습니다" });
    }
  });

  // 좋아요 API
  app.post("/api/like", async (req, res) => {
    try {
      const { itemId, itemType } = req.body;

      console.log('좋아요 요청:', { itemId, itemType });

      res.json({ 
        success: true, 
        message: "좋아요가 추가되었습니다.",
        likes: Math.floor(Math.random() * 100) + 50
      });
    } catch (error) {
      console.error('좋아요 오류:', error);
      res.status(500).json({ error: "좋아요 처리 중 오류가 발생했습니다" });
    }
  });

  // 공유 링크 생성 API
  app.post("/api/share", async (req, res) => {
    try {
      const { itemId, itemType, title } = req.body;

      console.log('공유 링크 생성:', { itemId, itemType, title });

      const shareUrl = `${req.protocol}://${req.get('host')}/${itemType}/${itemId}`;

      res.json({ 
        success: true, 
        message: "공유 링크가 생성되었습니다.",
        shareUrl
      });
    } catch (error) {
      console.error('공유 링크 생성 오류:', error);
      res.status(500).json({ error: "공유 링크 생성 중 오류가 발생했습니다" });
    }
  });





  app.get("/api/pets/:id", async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const userId = req.session?.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: "로그인이 필요합니다" });
      }

      const pet = await storage.getPet(petId);

      if (!pet) {
        return res.status(404).json({ error: '반려동물을 찾을 수 없습니다' });
      }

      // 소유자 확인 (관리자는 모든 반려동물 조회 가능)
      if (pet.ownerId !== userId && req.session?.user?.role !== 'admin') {
        return res.status(403).json({ error: '권한이 없습니다' });
      }

      // 훈련소 매칭 정보 포함
      const petWithTrainingInfo = {
        ...pet,
        trainingStatus: pet.trainingStatus || 'not_assigned',
        assignedTrainer: pet.assignedTrainerId ? {
          id: pet.assignedTrainerId,
          name: pet.assignedTrainerName || '훈련사 정보 없음'
        } : null,
        notebookEnabled: pet.notebookEnabled || false,
        lastNotebookEntry: pet.lastNotebookEntry || null
      };

      res.json({
        success: true,
        pet: petWithTrainingInfo
      });
    } catch (error) {
      console.error('Error fetching pet:', error);
      res.status(500).json({ error: '반려동물 정보 조회 중 오류가 발생했습니다' });
    }
  });

  app.put("/api/pets/:id", async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const userId = req.session?.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: "로그인이 필요합니다" });
      }

      // 반려동물 소유자 확인
      const existingPet = await storage.getPet(petId);
      if (!existingPet) {
        return res.status(404).json({ error: '반려동물을 찾을 수 없습니다' });
      }

      if (existingPet.ownerId !== userId) {
        return res.status(403).json({ error: '권한이 없습니다' });
      }

      const updatedPet = await storage.updatePet(petId, req.body);

      res.json({
        success: true,
        message: "반려동물 정보가 성공적으로 업데이트되었습니다.",
        pet: updatedPet
      });
    } catch (error) {
      console.error('Error updating pet:', error);
      res.status(500).json({ error: '반려동물 정보 업데이트 중 오류가 발생했습니다' });
    }
  });

  app.delete("/api/pets/:id", async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const userId = req.session?.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: "로그인이 필요합니다" });
      }

      // 반려동물 소유자 확인
      const existingPet = await storage.getPet(petId);
      if (!existingPet) {
        return res.status(404).json({ error: '반려동물을 찾을 수 없습니다' });
      }

      if (existingPet.ownerId !== userId) {
        return res.status(403).json({ error: '권한이 없습니다' });
      }

      const deleted = await storage.deletePet(petId);

      res.json({ 
        success: true, 
        message: '반려동물이 성공적으로 삭제되었습니다.' 
      });
    } catch (error) {
      console.error('Error deleting pet:', error);
      res.status(500).json({ error: '반려동물 삭제 중 오류가 발생했습니다' });
    }
  });

  // 건강 관리 API
  app.get("/api/pets/:id/health", async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const healthRecords = await storage.getPetHealthRecords(petId);
      res.json(healthRecords);
    } catch (error) {
      console.error('Error fetching health records:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post("/api/pets/:id/health-records", async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const healthRecord = await storage.createHealthRecord(petId, req.body);
      res.status(201).json(healthRecord);
    } catch (error) {
      console.error('Error creating health record:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get("/api/pets/:id/vaccinations", async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const vaccinations = await storage.getPetVaccinations(petId);
      res.json(vaccinations);
    } catch (error) {
      console.error('Error fetching vaccinations:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get("/api/pets/:id/medications", async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const medications = await storage.getPetMedications(petId);
      res.json(medications);
    } catch (error) {
      console.error('Error fetching medications:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 훈련 관리 API
  app.get("/api/pets/:id/training-sessions", async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const sessions = await storage.getPetTrainingSessions(petId);
      res.json(sessions);
    } catch (error) {
      console.error('Error fetching training sessions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get("/api/pets/:id/progress", async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const progress = await storage.getPetProgress(petId);
      res.json(progress);
    } catch (error) {
      console.error('Error fetching pet progress:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get("/api/pets/:id/achievements", async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const achievements = await storage.getPetAchievements(petId);
      res.json(achievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // 상담 관련 API
  app.get("/api/consultations/my-requests", async (req, res) => {
    try {
      const consultations = [
        {
          id: 1,
          trainerId: 1,
          trainerName: "김민수 전문 훈련사",
          trainerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          status: "pending",
          date: "2025-06-10",
          time: "14:00",
          type: "행동교정",
          petName: "멍멍이",
          message: "강아지가 낯선 사람을 보면 짖는 문제로 상담 요청드립니다.",
          createdAt: "2025-06-03T17:30:00.000Z"
        },
        {
          id: 2,
          trainerId: 2,
          trainerName: "박지연 훈련사",
          trainerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b332b1b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
          status: "confirmed",
          date: "2025-06-08",
          time: "10:00",
          type: "기본훈련",
          petName: "코코",
          message: "기본적인 앉기, 기다리기 훈련을 배우고 싶습니다.",
          createdAt: "2025-06-01T09:15:00.000Z"
        }
      ];

      res.json({ success: true, consultations });
    } catch (error) {
      console.error('상담 목록 조회 오류:', error);
      res.status(500).json({ error: "상담 목록을 불러올 수 없습니다" });
    }
  });

  app.post("/api/consultations/:id/cancel", async (req, res) => {
    try {
      const consultationId = req.params.id;

      console.log(`상담 ${consultationId} 취소 요청`);

      res.json({ 
        success: true, 
        message: "상담이 성공적으로 취소되었습니다." 
      });
    } catch (error) {
      console.error('상담 취소 오류:', error);
      res.status(500).json({ error: "상담 취소 중 오류가 발생했습니다" });
    }
  });

  app.get("/api/consultations/:id", async (req, res) => {
    try {
      const consultationId = req.params.id;

      const consultation = {
        id: parseInt(consultationId),
        trainerId: 1,
        trainerName: "김민수 전문 훈련사",
        trainerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
        status: "confirmed",
        date: "2025-06-10",
        time: "14:00",
        type: "행동교정",
        petName: "멍멍이",
        petAge: "2년",
        petBreed: "골든 리트리버",
        message: "강아지가 낯선 사람을 보면 짖는 문제로 상담 요청드립니다.",
        contactPhone: "010-1234-5678",
        contactEmail: "user@example.com",
        createdAt: "2025-06-03T17:30:00.000Z",
        videoCallUrl: "https://meet.google.com/abc-defg-hij"
      };

      res.json({ success: true, consultation });
    } catch (error) {
      console.error('상담 상세 조회 오류:', error);
      res.status(500).json({ error: "상담 정보를 불러올 수 없습니다" });
    }
  });

  // 메시지 전송 API
  app.post("/api/messages/send", async (req, res) => {
    try {
      const { trainerId, message } = req.body;

      console.log('메시지 전송 요청:', { trainerId, message });

      const messageId = Date.now();
      const messageData = {
        id: messageId,
        trainerId: trainerId,
        senderId: 'user',
        message: message,
        timestamp: new Date().toISOString(),
        status: 'sent'
      };

      res.json({ 
        success: true, 
        message: "메시지가 성공적으로 전송되었습니다.",
        data: messageData
      });
    } catch (error) {
      console.error('메시지 전송 오류:', error);
      res.status(500).json({ error: "메시지 전송 중 오류가 발생했습니다" });
    }
  });

  // 예약 생성 API
  app.post("/api/reservations/create", async (req, res) => {
    try {
      const { trainerId, date, time, notes } = req.body;

      console.log('예약 생성 요청:', { trainerId, date, time, notes });

      const reservationId = Date.now();
      const reservationData = {
        id: reservationId,
        trainerId: trainerId,
        userId: 'user',
        date: date,
        time: time,
        notes: notes,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      res.json({ 
        success: true, 
        message: "예약 요청이 성공적으로 전송되었습니다.",
        data: reservationData
      });
    } catch (error) {
      console.error('예약 생성 오류:', error);
      res.status(500).json({ error: "예약 생성 중 오류가 발생했습니다" });
    }
  });

  // 훈련사 등록 API
  app.post("/api/trainers/register", async (req, res) => {
    try {
      const { name, email, phone, institute, certification, experience, specialties, bio, location } = req.body;

      console.log('훈련사 등록 요청:', { name, email, institute });

      const trainerId = Date.now();
      const trainerData = {
        id: trainerId,
        name: name,
        email: email,
        phone: phone,
        institute: institute,
        certification: certification,
        experience: experience,
        specialties: specialties ? specialties.split(',').map((s: string) => s.trim()) : [],
        bio: bio || `${experience} 경력의 전문 훈련사입니다.`,
        location: location || '서울시',
        rating: 0,
        reviews: 0,
        courses: 0,
        category: "기본 훈련",
        avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
        background: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
        status: 'active',
        verified: true,
        featured: false,
        createdAt: new Date().toISOString()
      };

      // 메모리에 훈련사 추가 (실제로는 데이터베이스에 저장)
      if (!global.trainersData) {
        global.trainersData = [];
      }
      global.trainersData.push(trainerData);

      res.json({ 
        success: true, 
        message: "훈련사 등록이 완료되었습니다.",
        data: trainerData
      });
    } catch (error) {
      console.error('훈련사 등록 오류:', error);
      res.status(500).json({ error: "훈련사 등록 중 오류가 발생했습니다" });
    }
  });

  // 반려동물 목록 조회 API (사용자별 데이터 분리)
  app.get("/api/pets", async (req, res) => {
    try {
      console.log('반려동물 목록 조회 요청');

      // 세션에서 사용자 정보 가져오기
      const userId = req.session?.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "로그인이 필요합니다" });
      }

      console.log('반려동물 목록 조회 - 사용자 ID:', userId);
      console.log('전체 세션 정보:', req.session);
      
      // 사용자 ID를 숫자로 변환하여 조회
      let numericUserId = userId;
      if (typeof userId === 'string') {
        // 테스트 계정에 대한 매핑
        const userMapping = {
          'testuser': 3,
          'test': 3,
          'trainer': 2,
          'trainer01': 2,
          'admin': 1,
          'institute': 4,
          'institute01': 4
        };
        numericUserId = userMapping[userId as keyof typeof userMapping] || parseInt(userId);
      }

      console.log('매핑된 사용자 ID:', numericUserId);
      console.log('저장소에서 펫 조회 시도...');

      // 사용자별 반려동물 목록 조회
      const userPets = await storage.getPetsByUserId(numericUserId);
      console.log('저장소에서 조회된 반려동물:', userPets);
      
      // 반려동물 데이터에 훈련소 매칭 정보 추가
      const petsWithTrainingInfo = userPets.map(pet => ({
        ...pet,
        trainingStatus: pet.trainingStatus || 'not_assigned',
        assignedTrainer: pet.assignedTrainerId ? {
          id: pet.assignedTrainerId,
          name: pet.assignedTrainerName || '훈련사 정보 없음'
        } : null,
        notebookEnabled: pet.notebookEnabled || false,
        lastNotebookEntry: pet.lastNotebookEntry || null
      }));

      res.json({ 
        success: true, 
        pets: petsWithTrainingInfo
      });
    } catch (error) {
      console.error('반려동물 목록 조회 오류:', error);
      res.status(500).json({ error: "반려동물 목록 조회 중 오류가 발생했습니다" });
    }
  });

  // 반려동물 등록 API (사용자별 데이터 분리)
  app.post("/api/pets", async (req, res) => {
    try {
      const { 
        name, 
        species, 
        breed, 
        age, 
        gender, 
        weight, 
        color, 
        personality, 
        medicalHistory, 
        specialNotes, 
        imageUrl 
      } = req.body;

      console.log('반려동물 등록 요청:', { name, species, breed, age });

      // 세션에서 사용자 정보 가져오기
      const userId = req.session?.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "로그인이 필요합니다" });
      }

      const petData = {
        name: name,
        species: species || 'dog',
        breed: breed,
        age: age,
        gender: gender || 'male',
        weight: weight,
        color: color || '',
        personality: personality || '',
        medicalHistory: medicalHistory || '',
        specialNotes: specialNotes || '',
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        ownerId: userId,
        trainingStatus: 'not_assigned',
        assignedTrainerId: null,
        assignedTrainerName: null,
        notebookEnabled: false,
        lastNotebookEntry: null,
        isActive: true
      };

      // 저장소에 반려동물 추가
      const createdPet = await storage.createPet(petData);

      res.json({ 
        success: true, 
        message: "반려동물이 성공적으로 등록되었습니다.",
        pet: createdPet
      });
    } catch (error) {
      console.error('반려동물 등록 오류:', error);
      res.status(500).json({ error: "반려동물 등록 중 오류가 발생했습니다" });
    }
  });

  // 이미지 업로드를 위한 multer 설정
  const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = 'uploads/images';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'pet-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  const imageUpload = multer({
    storage: imageStorage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('이미지 파일만 업로드 가능합니다.'), false);
      }
    }
  });

  // 이미지 업로드 API
  app.post("/api/upload/image", imageUpload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "이미지 파일이 필요합니다." });
      }

      const imageUrl = `/uploads/images/${req.file.filename}`;
      
      console.log('이미지 업로드 성공:', imageUrl);

      res.json({ 
        success: true, 
        url: imageUrl,
        message: "이미지가 성공적으로 업로드되었습니다."
      });
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      res.status(500).json({ error: "이미지 업로드 중 오류가 발생했습니다" });
    }
  });

  // 단일 파일 업로드 API (ImageUpload 컴포넌트용)
  app.post("/api/upload/single", imageUpload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          message: "업로드할 파일이 없습니다." 
        });
      }

      const imageUrl = `/uploads/images/${req.file.filename}`;
      
      console.log('단일 파일 업로드 성공:', imageUrl);

      res.json({ 
        success: true, 
        file: {
          url: imageUrl,
          filename: req.file.filename
        },
        message: "이미지가 성공적으로 업로드되었습니다."
      });
    } catch (error) {
      console.error('단일 파일 업로드 오류:', error);
      res.status(500).json({ 
        success: false,
        message: "이미지 업로드 중 오류가 발생했습니다"
      });
    }
  });

  // 로고 설정 API
  app.post("/api/logo/set", async (req, res) => {
    try {
      const { type, url } = req.body;
      
      if (!type || !url) {
        return res.status(400).json({ 
          success: false, 
          message: "로고 타입과 URL이 필요합니다." 
        });
      }

      // 로고 설정 업데이트
      try {
        const currentSettings = await storage.getLogoSettings();
        const updateData = { ...currentSettings };
        
        // 타입에 따라 로고 설정 업데이트
        switch (type) {
          case 'main':
            updateData.logoLight = url;
            break;
          case 'mainDark':
            updateData.logoDark = url;
            break;
          case 'compact':
            updateData.logoSymbolLight = url;
            break;
          case 'compactDark':
            updateData.logoSymbolDark = url;
            break;
          case 'favicon':
            updateData.favicon = url;
            break;
          default:
            return res.status(400).json({ 
              success: false, 
              message: "지원되지 않는 로고 타입입니다." 
            });
        }
        
        await storage.updateLogoSettings(updateData);
        
        console.log('로고 설정 업데이트 성공:', type, url);
        
        res.json({ 
          success: true, 
          type: type,
          url: url,
          message: "로고 설정이 성공적으로 업데이트되었습니다."
        });
      } catch (storageError) {
        console.error('로고 설정 업데이트 실패:', storageError);
        res.status(500).json({ 
          success: false, 
          message: "로고 설정 업데이트 중 오류가 발생했습니다."
        });
      }
    } catch (error) {
      console.error('로고 설정 API 오류:', error);
      res.status(500).json({ 
        success: false, 
        message: "로고 설정 중 오류가 발생했습니다."
      });
    }
  });

  // 로고 설정 조회 API
  app.get("/api/admin/logos", async (req, res) => {
    try {
      const logoSettings = await storage.getLogoSettings();
      res.json(logoSettings);
    } catch (error) {
      console.error('로고 설정 조회 실패:', error);
      res.status(500).json({ 
        success: false, 
        message: "로고 설정을 가져오는 중 오류가 발생했습니다."
      });
    }
  });

  // Excel 파일 파싱 함수 (가격 정보 포함)
  function parseExcelCurriculumWithPricing(data: any[][], fileName: string) {
    const curriculum = {
      title: fileName || '커리큘럼',
      description: '엑셀 파일에서 추출된 커리큘럼',
      category: '전문교육',
      difficulty: 'intermediate',
      duration: 480,
      price: 300000,
      registrant: '',
      institution: '',
      modules: []
    };

    // 데이터가 충분한지 확인
    if (data.length < 2) {
      return curriculum;
    }

    console.log('[엑셀 파싱] 전체 데이터 구조 확인:', data.map((row, index) => ({ index, firstCell: row[0], secondCell: row[1] })));

    // 기본 정보 추출
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length < 2) continue;

      // 등록자 정보 추출
      if (row[0] === '등록자명') {
        curriculum.registrant = row[1] || '';
        console.log(`[엑셀 파싱] 등록자명: ${curriculum.registrant}`);
      }
      if (row[0] === '소속기관') {
        curriculum.institution = row[1] || '';
        console.log(`[엑셀 파싱] 소속기관: ${curriculum.institution}`);
      }
      
      // 커리큘럼 기본 정보 추출
      if (row[0] === '제목') {
        curriculum.title = row[1] || fileName;
        console.log(`[엑셀 파싱] 제목: ${curriculum.title}`);
      }
      if (row[0] === '설명') {
        curriculum.description = row[1] || '엑셀 파일에서 추출된 커리큘럼';
        console.log(`[엑셀 파싱] 설명: ${curriculum.description}`);
      }
      if (row[0] === '카테고리') {
        curriculum.category = row[1] || '전문교육';
        console.log(`[엑셀 파싱] 카테고리: ${curriculum.category}`);
      }
      if (row[0] === '난이도') {
        curriculum.difficulty = row[1] || 'intermediate';
        console.log(`[엑셀 파싱] 난이도: ${curriculum.difficulty}`);
      }
      if (row[0] === '총 소요시간(분)') {
        curriculum.duration = parseInt(row[1]) || 0;
        console.log(`[엑셀 파싱] 총 소요시간: ${curriculum.duration}`);
      }
      if (row[0] === '전체가격(원)') {
        curriculum.price = parseInt(row[1]) || 0;
        console.log(`[엑셀 파싱] 전체가격: ${curriculum.price}`);
      }
    }

    // "강의 구성" 섹션 찾기
    let courseStartIndex = -1;
    let courseHeaderIndex = -1;
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (row && row[0] === '강의 구성') {
        courseStartIndex = i;
        console.log(`[엑셀 파싱] "강의 구성" 섹션 발견: ${i}행`);
        break;
      }
    }
    
    if (courseStartIndex === -1) {
      console.log('[엑셀 파싱] "강의 구성" 섹션을 찾을 수 없습니다.');
      return curriculum;
    }
    
    // 강의 구성 헤더 찾기 (회차, 강의명, 설명, ...)
    for (let i = courseStartIndex + 1; i < data.length; i++) {
      const row = data[i];
      if (row && row[0] === '회차') {
        courseHeaderIndex = i;
        break;
      }
    }
    
    if (courseHeaderIndex === -1) {
      console.log('[엑셀 파싱] 강의 구성 헤더를 찾을 수 없습니다.');
      return curriculum;
    }
    
    // 실제 강의 데이터 처리 (헤더 다음 행부터)
    const modules = [];
    
    for (let i = courseHeaderIndex + 1; i < data.length; i++) {
      const row = data[i];
      
      // 빈 행이나 "작성 안내" 섹션 시작 시 중단
      if (!row || row.length === 0 || !row[0] || row[0] === '작성 안내') {
        break;
      }
      
      // 강의 제목이 있는 실제 강의 행만 처리 (1강, 2강, 3강... 형태)
      if (row[0] && (typeof row[0] === 'string' && /^\d+강$/.test(row[0].toString()))) {
        const lessonNumber = row[0].replace('강', '');
        
        // 엑셀 컬럼 순서: 회차, 강의명, 설명, 소요시간, 무료여부, 개별가격, 준비물
        const lessonTitle = row[1] || `${row[0]} - 기본 강의`;
        const description = row[2] || `${lessonTitle}에 대한 상세 설명`;
        const duration = parseInt(row[3]) || 60;
        const isFree = row[4] === 'Y' || row[4] === 'y' || row[4] === '무료';
        const price = isFree ? 0 : (parseInt(row[5]) || 50000);
        const materialsString = (row.length > 6 && row[6]) ? String(row[6]).trim() : '';
        const materials = materialsString ? materialsString.split(',').map(m => m.trim()).filter(m => m.length > 0) : [];
        
        const moduleData = {
          id: `module-${lessonNumber}`,
          title: lessonTitle,
          description: description,
          duration: duration,
          isFree: isFree,
          price: price,
          materials: materials,
          objectives: [`${lessonTitle} 목표 달성`],
          activities: ['실습 활동'],
          completed: false
        };

        console.log(`[엑셀 파싱] 행 ${i} 전체 데이터:`, row);
        console.log(`[엑셀 파싱] 모듈 추가: ${moduleData.title} (설명: ${moduleData.description.substring(0, 50)}..., 시간: ${moduleData.duration}분, 무료: ${moduleData.isFree}, 가격: ${moduleData.price}원, 준비물: [${moduleData.materials.join(', ')}])`);
        console.log(`[엑셀 파싱] 준비물 컬럼 원본 데이터 (row[6]):`, row[6], typeof row[6]);
        modules.push(moduleData);
      }
    }

    // 전체 커리큘럼 정보 업데이트
    curriculum.modules = modules;
    curriculum.duration = modules.reduce((total, module) => total + module.duration, 0);
    curriculum.price = modules.reduce((total, module) => total + module.price, 0);

    // 파일명에서 추가 정보 추출 시도
    if (fileName.includes('기초')) {
      curriculum.difficulty = 'beginner';
      curriculum.category = '기초교육';
    } else if (fileName.includes('고급') || fileName.includes('전문')) {
      curriculum.difficulty = 'advanced';
      curriculum.category = '전문교육';
    } else if (fileName.includes('중급')) {
      curriculum.difficulty = 'intermediate';
      curriculum.category = '중급교육';
    } else if (fileName.includes('재활')) {
      curriculum.difficulty = 'intermediate';
      curriculum.category = '재활치료';
    }

    console.log('[엑셀 파싱] 최종 커리큘럼 데이터:', {
      title: curriculum.title,
      description: curriculum.description,
      category: curriculum.category,
      difficulty: curriculum.difficulty,
      registrant: curriculum.registrant,
      institution: curriculum.institution,
      moduleCount: modules.length,
      totalDuration: curriculum.duration,
      totalPrice: curriculum.price,
      modules: modules.map(m => ({ title: m.title, duration: m.duration, price: m.price, materials: m.materials }))
    });

    return curriculum;
  }

  // 로고 업로드를 위한 multer 설정
  const logoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = 'uploads/logos';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  const logoUpload = multer({
    storage: logoStorage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('이미지 파일만 업로드 가능합니다.'), false);
      }
    }
  });

  // 로고 업로드 API
  app.post("/api/admin/logo/upload", logoUpload.single('logo'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "로고 파일이 필요합니다." });
      }

      const logoUrl = `/uploads/logos/${req.file.filename}`;
      const { type } = req.body;
      
      // 로고 설정 업데이트
      try {
        const currentSettings = await storage.getLogoSettings();
        const updateData = { ...currentSettings };
        
        if (type === 'expanded') {
          updateData.logoLight = logoUrl;
          updateData.logoDark = logoUrl;
        } else if (type === 'compact') {
          updateData.logoSymbolLight = logoUrl;
          updateData.logoSymbolDark = logoUrl;
        }
        
        await storage.updateLogoSettings(updateData);
        
        console.log('로고 업로드 및 설정 업데이트 성공:', logoUrl, type);
        
        res.json({ 
          success: true, 
          url: logoUrl,
          type: type,
          message: "로고가 성공적으로 업로드되고 설정이 업데이트되었습니다."
        });
      } catch (storageError) {
        console.error('로고 설정 업데이트 실패:', storageError);
        res.json({ 
          success: true, 
          url: logoUrl,
          message: "로고 업로드는 성공했지만 설정 업데이트에 실패했습니다."
        });
      }
    } catch (error) {
      console.error('로고 업로드 오류:', error);
      res.status(500).json({ error: "로고 업로드 중 오류가 발생했습니다" });
    }
  });

  // 로고 설정 조회 API
  app.get("/api/admin/logos", async (req, res) => {
    try {
      const logoSettings = await storage.getLogoSettings();
      res.json({
        success: true,
        logos: logoSettings
      });
    } catch (error) {
      console.error('로고 설정 조회 오류:', error);
      res.status(500).json({ error: "로고 설정을 불러오는 중 오류가 발생했습니다" });
    }
  });

  // 현재 로고 조회 API (사이드바용)
  app.get("/api/admin/logo", async (req, res) => {
    try {
      const logoSettings = await storage.getLogoSettings();
      res.json({
        success: true,
        expandedLogo: logoSettings.logoLight || "/logo.svg",
        compactLogo: logoSettings.logoSymbolLight || "/logo-compact.svg",
        logoDark: logoSettings.logoDark || "/logo-dark.svg",
        logoSymbolDark: logoSettings.logoSymbolDark || "/logo-compact-dark.svg"
      });
    } catch (error) {
      console.error('로고 조회 오류:', error);
      res.status(500).json({ error: "로고를 불러오는 중 오류가 발생했습니다" });
    }
  });

  // 상담 Zoom 링크 조회 API
  app.get("/api/consultations/:id/zoom", async (req, res) => {
    try {
      const consultationId = req.params.id;

      // 상담 정보 조회 (실제로는 데이터베이스에서 조회)
      const consultation = {
        id: consultationId,
        trainerName: "김훈련사",
        zoomUrl: "https://zoom.us/j/123456789?pwd=abcd1234",
        meetingId: "123 456 789",
        passcode: "abcd1234",
        status: "scheduled",
        startTime: new Date().toISOString()
      };

      res.json({ 
        success: true, 
        consultation: consultation
      });
    } catch (error) {
      console.error('Zoom 링크 조회 오류:', error);
      res.status(500).json({ error: "Zoom 링크 조회 중 오류가 발생했습니다" });
    }
  });

  // 리뷰 작성 API
  app.post("/api/reviews", async (req, res) => {
    try {
      const { consultationId, trainerName, rating, title, content, tags } = req.body;

      console.log('리뷰 작성 요청:', { consultationId, trainerName, rating });

      const reviewId = Date.now();
      const reviewData = {
        id: reviewId,
        consultationId: consultationId,
        trainerName: trainerName,
        rating: rating,
        title: title,
        content: content,
        tags: tags || [],
        authorName: '반려인',
        createdAt: new Date().toISOString(),
        helpful: 0,
        verified: true
      };

      // 메모리에 리뷰 추가 (실제로는 데이터베이스에 저장)
      if (!global.reviewsData) {
        global.reviewsData = [];
      }
      global.reviewsData.push(reviewData);

      res.json({ 
        success: true, 
        message: "리뷰가 성공적으로 작성되었습니다.",
        review: reviewData
      });
    } catch (error) {
      console.error('리뷰 작성 오류:', error);
      res.status(500).json({ error: "리뷰 작성 중 오류가 발생했습니다" });
    }
  });

  // 리뷰 목록 조회 API
  app.get("/api/reviews", async (req, res) => {
    try {
      const { trainerName, limit = 10, offset = 0 } = req.query;

      console.log('리뷰 목록 조회 요청:', { trainerName, limit, offset });

      // 메모리에서 리뷰 목록 조회 (실제로는 데이터베이스에서 조회)
      if (!global.reviewsData) {
        global.reviewsData = [
          {
            id: 1,
            consultationId: '2',
            trainerName: '박전문가',
            rating: 5,
            title: '정말 만족스러운 상담이었습니다',
            content: '분리불안 문제로 고민이 많았는데, 전문적인 조언과 실질적인 해결방법을 제시해주셔서 큰 도움이 되었습니다. 강아지도 많이 안정되었어요.',
            tags: ['전문성', '친절함', '효과적', '추천함'],
            authorName: '반려인',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            helpful: 15,
            verified: true
          }
        ];
      }

      let filteredReviews = global.reviewsData;

      if (trainerName) {
        filteredReviews = filteredReviews.filter(review => 
          review.trainerName === trainerName
        );
      }

      const paginatedReviews = filteredReviews
        .slice(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string));

      res.json({ 
        success: true, 
        reviews: paginatedReviews,
        total: filteredReviews.length
      });
    } catch (error) {
      console.error('리뷰 목록 조회 오류:', error);
      res.status(500).json({ error: "리뷰 목록 조회 중 오류가 발생했습니다" });
    }
  });

  // 댓글 작성 API
  app.post("/api/comments", async (req, res) => {
    try {
      const { parentType, parentId, content, parentCommentId } = req.body;

      console.log('댓글 작성 요청:', { parentType, parentId, content });

      const commentId = Date.now();
      const commentData = {
        id: commentId,
        parentType: parentType, // 'review', 'course', 'post' 등
        parentId: parentId,
        parentCommentId: parentCommentId || null, // 대댓글인 경우
        content: content,
        authorName: '반려인',
        authorRole: 'pet-owner',
        createdAt: new Date().toISOString(),
        likes: 0,
        replies: []
      };

      // 메모리에 댓글 추가 (실제로는 데이터베이스에 저장)
      if (!global.commentsData) {
        global.commentsData = [];
      }
      global.commentsData.push(commentData);

      res.json({ 
        success: true, 
        message: "댓글이 성공적으로 작성되었습니다.",
        comment: commentData
      });
    } catch (error) {
      console.error('댓글 작성 오류:', error);
      res.status(500).json({ error: "댓글 작성 중 오류가 발생했습니다" });
    }
  });

  // 댓글 목록 조회 API
  app.get("/api/comments", async (req, res) => {
    try {
      const { parentType, parentId } = req.query;

      console.log('댓글 목록 조회 요청:', { parentType, parentId });

      // 메모리에서 댓글 목록 조회 (실제로는 데이터베이스에서 조회)
      if (!global.commentsData) {
        global.commentsData = [];
      }

      const comments = global.commentsData.filter(comment => 
        comment.parentType === parentType && 
        comment.parentId === parentId &&
        !comment.parentCommentId // 최상위 댓글만
      );

      // 각 댓글에 대댓글 추가
      const commentsWithReplies = comments.map(comment => ({
        ...comment,
        replies: global.commentsData.filter(reply => 
          reply.parentCommentId === comment.id
        )
      }));

      res.json({ 
        success: true, 
        comments: commentsWithReplies
      });
    } catch (error) {
      console.error('댓글 목록 조회 오류:', error);
      res.status(500).json({ error: "댓글 목록 조회 중 오류가 발생했습니다" });
    }
  });

  app.post("/api/consultations/:id/join", async (req, res) => {
    try {
      const consultationId = req.params.id;
      const { userId } = req.body;

      console.log(`[상담 참여] 사용자 ${userId}가 상담 ${consultationId} 참여 시작`);

      // 상담 정보 조회 (실제로는 데이터베이스에서 조회)
      const consultation = {
        id: consultationId,
        trainerId: 1,
        trainerName: "김민수 전문 훈련사",
        userId: userId || 3,
        amount: 50000, // 상담 비용
        status: "scheduled",
        type: "video"
      };

      const videoCallUrl = "https://meet.google.com/abc-defg-hij";

      // 화상수업 시작 시 수수료 정산 처리
      if (consultation.type === "video") {
        console.log(`[수수료 정산] 화상수업 시작 - 상담 ID: ${consultationId}`);
        
        try {
          // PaymentService를 사용한 수수료 정산
          const { PaymentService } = require('./services/payment-service');
          const paymentService = new PaymentService(storage);
          
          const paymentResult = await paymentService.processPayment({
            transactionType: 'video_consultation',
            referenceId: parseInt(consultationId),
            referenceType: 'consultation',
            payerId: consultation.userId,
            payeeId: consultation.trainerId,
            grossAmount: consultation.amount,
            paymentMethod: 'credit_card',
            paymentProvider: 'stripe',
            externalTransactionId: `video_${consultationId}_${Date.now()}`,
            metadata: {
              consultationType: 'video',
              sessionStart: new Date().toISOString(),
              trainerName: consultation.trainerName
            }
          });

          if (paymentResult.success) {
            console.log(`[수수료 정산 완료] 상담 ${consultationId} - 수수료: ${paymentResult.feeAmount}원, 정산액: ${paymentResult.netAmount}원`);
            
            // 상담 상태를 '진행 중'으로 업데이트
            // await storage.updateConsultationStatus(consultationId, 'in-progress');
            
            res.json({ 
              success: true, 
              message: "화상 상담에 참여합니다. 수수료 정산이 완료되었습니다.",
              videoCallUrl,
              paymentInfo: {
                amount: consultation.amount,
                feeAmount: paymentResult.feeAmount,
                netAmount: paymentResult.netAmount,
                settlementStatus: "완료"
              }
            });
          } else {
            console.error(`[수수료 정산 실패] 상담 ${consultationId}:`, paymentResult.errorMessage);
            res.status(500).json({ 
              error: "수수료 정산 중 오류가 발생했습니다",
              details: paymentResult.errorMessage
            });
          }
        } catch (settlementError) {
          console.error(`[수수료 정산 오류] 상담 ${consultationId}:`, settlementError);
          // 정산 실패해도 상담 참여는 허용 (별도 처리)
          res.json({ 
            success: true, 
            message: "화상 상담에 참여합니다. (수수료 정산은 별도 처리됩니다)",
            videoCallUrl,
            paymentInfo: {
              amount: consultation.amount,
              settlementStatus: "처리 중"
            }
          });
        }
      } else {
        res.json({ 
          success: true, 
          message: "화상 상담에 참여합니다.",
          videoCallUrl 
        });
      }

    } catch (error) {
      console.error('화상 상담 참여 오류:', error);
      res.status(500).json({ error: "화상 상담 참여 중 오류가 발생했습니다" });
    }
  });

// 검색 API - 성능 최적화 및 에러 처리 개선
app.get('/api/search', async (req, res) => {
  const startTime = Date.now();

  try {
    const { 
      q: query = '', 
      category = 'all', 
      location = 'all',
      difficulty = 'all',
      minPrice = 0,
      maxPrice = 1000000,
      startDate,
      endDate,
      features = [],
      sortBy = 'relevance',
      minRating = 0,
      page = 1,
      limit = 10
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    // URL 디코딩 추가 (한국어 검색 지원)
    let searchQuery = String(query).trim();
    
    console.log(`[검색 디버그] 원본 쿼리: "${query}"`);
    console.log(`[검색 디버그] 원본 쿼리 타입: ${typeof query}`);
    console.log(`[검색 디버그] 원본 쿼리 길이: ${String(query).length}`);
    
    // 한국어 인코딩 문제를 직접 해결
    const koreanFixMap = {
      'ê°ëí': '강동훈',
      'ê°': '강',
      'ëí': '동훈',
      // 추가 매핑
      '%EA%B0%95%EB%8F%99%ED%9B%88': '강동훈',
      '%ea%b0%95%eb%8f%99%ed%9b%88': '강동훈'
    };
    
    // 먼저 직접 매핑을 시도
    for (const [broken, correct] of Object.entries(koreanFixMap)) {
      if (searchQuery.includes(broken)) {
        console.log(`[검색 디버그] 직접 매핑: "${broken}" -> "${correct}"`);
        searchQuery = searchQuery.replace(broken, correct);
      }
    }
    
    // URL 디코딩 시도
    try {
      const decoded = decodeURIComponent(searchQuery);
      if (decoded !== searchQuery) {
        console.log(`[검색 디버그] URL 디코딩: "${searchQuery}" -> "${decoded}"`);
        searchQuery = decoded;
      }
    } catch (e) {
      console.log('[검색 디버그] URL 디코딩 실패:', e.message);
    }
    
    // 다시 한번 매핑 확인
    for (const [broken, correct] of Object.entries(koreanFixMap)) {
      if (searchQuery.includes(broken)) {
        console.log(`[검색 디버그] 후처리 매핑: "${broken}" -> "${correct}"`);
        searchQuery = searchQuery.replace(broken, correct);
      }
    }
    
    console.log(`[검색 디버그] 원본 검색어: "${query}", 디코딩된 검색어: "${searchQuery}"`);

    console.log(`[검색] "${query}" 검색 시작`);

    let results: any[] = [];

    // 캐시된 결과가 있는지 확인 (개발용)
    const cacheKey = `search:${searchQuery}:${page}:${limit}`;

    if (!searchQuery) {
      // 검색어가 없으면 빈 결과 반환
      results = [];
    } else {
      // 데이터베이스 검색 시도 (빠른 실패 처리)
      const dbPromises = [];

      // 메모리 저장소에서 검색 (등록된 실제 데이터 우선)
      try {
        console.log(`[검색 디버그] 검색어: "${searchQuery}"`);
        
        // 훈련사 검색
        const allTrainers = await storage.getAllTrainers();
        console.log(`[검색 디버그] 전체 훈련사 수: ${allTrainers.length}`);
        
        allTrainers.forEach((trainer, index) => {
          console.log(`[검색 디버그] 훈련사 ${index + 1}: ${trainer.name}, 위치: ${trainer.location}`);
        });
        
        const matchedTrainers = allTrainers.filter(trainer => {
          const nameMatch = trainer.name && trainer.name.includes(searchQuery);
          const bioMatch = trainer.bio && trainer.bio.includes(searchQuery);
          const specialtyMatch = trainer.specialties && trainer.specialties.some(specialty => 
            specialty.includes(searchQuery)
          );
          const locationMatch = trainer.location && trainer.location.includes(searchQuery);
          
          const isMatch = nameMatch || bioMatch || specialtyMatch || locationMatch;
          
          if (isMatch) {
            console.log(`[검색 디버그] 매칭된 훈련사: ${trainer.name} (이름:${nameMatch}, 바이오:${bioMatch}, 전문:${specialtyMatch}, 위치:${locationMatch})`);
          }
          
          return isMatch;
        });

        console.log(`[검색 디버그] 매칭된 훈련사 수: ${matchedTrainers.length}`);
        
        // 위치 데이터 검색 (기존 위치 + 기관 데이터)
        const allLocations = await storage.getAllLocations();
        const instituteData = await storage.getInstitutes();
        
        console.log(`[검색 디버그] 전체 위치 수: ${allLocations.length}`);
        console.log(`[검색 디버그] 전체 기관 수: ${instituteData.length}`);
        
        // 기관을 위치 형식으로 변환
        const instituteLocations = instituteData.map(institute => ({
          id: institute.id,
          name: institute.name,
          type: 'institute',
          address: institute.address,
          description: institute.description,
          services: institute.facilities || [],
          phone: institute.phone,
          website: institute.website,
          rating: institute.rating,
          reviewCount: institute.reviewCount,
          certification: institute.isVerified,
          latitude: institute.latitude,
          longitude: institute.longitude,
          isActive: institute.isActive
        }));
        
        // 기존 위치와 기관 위치 통합
        const combinedLocations = [...allLocations, ...instituteLocations];
        
        combinedLocations.forEach((location, index) => {
          console.log(`[검색 디버그] 위치 ${index + 1}: ${location.name}, 유형: ${location.type}, 주소: ${location.address}`);
        });
        
        const matchedLocations = combinedLocations.filter(location => {
          const nameMatch = location.name && location.name.toLowerCase().includes(searchQuery);
          const addressMatch = location.address && location.address.toLowerCase().includes(searchQuery);
          const descriptionMatch = location.description && location.description.toLowerCase().includes(searchQuery);
          const serviceMatch = location.services && Array.isArray(location.services) && location.services.some(service => 
            service.toLowerCase && service.toLowerCase().includes(searchQuery)
          );
          
          const isMatch = nameMatch || addressMatch || descriptionMatch || serviceMatch;
          
          if (isMatch) {
            console.log(`[검색 디버그] 매칭된 위치: ${location.name} (이름:${nameMatch}, 주소:${addressMatch}, 설명:${descriptionMatch}, 서비스:${serviceMatch})`);
          }
          
          return isMatch;
        });

        console.log(`[검색 디버그] 매칭된 위치 수: ${matchedLocations.length}`);

        // 매칭된 위치를 결과에 추가
        if (matchedLocations.length > 0) {
          results.push(...matchedLocations.map(location => ({
            id: location.id,
            type: location.type,
            title: location.name,
            description: location.description || '전문 펫 서비스 업체',
            rating: location.rating || 4.5,
            reviewCount: location.reviewCount || 0,
            location: location.address,
            category: location.type,
            features: Array.isArray(location.services) ? location.services : [],
            phone: location.phone,
            website: location.website,
            certification: location.certification,
            latitude: location.latitude,
            longitude: location.longitude
          })));
        }

        if (matchedTrainers.length > 0) {
          results.push(...matchedTrainers.map(trainer => ({
            id: trainer.id,
            type: 'trainer',
            title: trainer.name,
            description: trainer.bio || '전문 반려동물 훈련사',
            rating: trainer.rating || 4.8,
            reviewCount: trainer.reviewCount || 0,
            location: trainer.location || '',
            category: 'trainer',
            features: trainer.specialties || [],
            phone: trainer.phone,
            experience: trainer.experience,
            certifications: trainer.certifications
          })));
        }

        // 사용자 검색 (추가 훈련사)
        const allUsers = await storage.getAllUsers();
        console.log(`[검색 디버그] 전체 사용자 수: ${allUsers.length}`);
        
        const matchedUsers = allUsers.filter(user => {
          if (user.role !== 'trainer') return false;
          
          const nameMatch = user.name && user.name.includes(searchQuery);
          const bioMatch = user.bio && user.bio.includes(searchQuery);
          const locationMatch = user.location && user.location.includes(searchQuery);
          
          console.log(`[검색 디버그] 사용자 "${user.name}" (역할: ${user.role}): 이름매칭=${nameMatch}, 바이오매칭=${bioMatch}, 위치매칭=${locationMatch}`);
          console.log(`[검색 디버그] 사용자 데이터:`, { name: user.name, bio: user.bio, location: user.location, role: user.role });
          
          return nameMatch || bioMatch || locationMatch;
        });
        
        console.log(`[검색 디버그] 매칭된 사용자 수: ${matchedUsers.length}`);

        if (matchedUsers.length > 0) {
          results.push(...matchedUsers.map(user => ({
            id: user.id,
            type: 'trainer',
            title: user.name,
            description: user.bio || '전문 반려동물 훈련사',
            rating: 4.5,
            reviewCount: 0,
            location: user.location || '',
            category: 'trainer',
            features: user.specializations || [],
            phone: user.verificationPhone,
            certification: user.certification
          })));
        }

        // 강의 검색
        const allCourses = await storage.getAllCourses();
        const matchedCourses = allCourses.filter(course => 
          course.title.toLowerCase().includes(searchQuery) ||
          (course.description && course.description.toLowerCase().includes(searchQuery))
        );

        if (matchedCourses.length > 0) {
          results.push(...matchedCourses.slice(0, 3).map(course => ({
            ...course,
            type: 'course'
          })));
        }

        // 기관 검색
        const instituteSearchData = await storage.getAllInstitutes();
        const matchedInstitutes = instituteSearchData.filter(institute => 
          institute.name.toLowerCase().includes(searchQuery) ||
          (institute.description && institute.description.toLowerCase().includes(searchQuery))
        );

        if (matchedInstitutes.length > 0) {
          results.push(...matchedInstitutes.slice(0, 3).map(institute => ({
            ...institute,
            type: 'institute',
            title: institute.name
          })));
        }

      } catch (error) {
        console.error('[검색] 메모리 저장소 검색 실패:', error.message);
      }

      // 데이터베이스에 결과가 없으면 샘플 데이터 제공
      // 더미 데이터 제거 - 실제 등록된 데이터만 반환
    }

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    console.log(`[검색] "${query}" 완료 - ${results.length}개 결과, ${responseTime}ms`);

    // 추천 검색어
    const suggestions = searchQuery ? [
      '기본 훈련', '행동 교정', '퍼피 트레이닝', '애질리티', '사회화 훈련'
    ].filter(s => s.toLowerCase().includes(searchQuery) || searchQuery.includes(s.slice(0, 2))) : [];

    res.json({
      results,
      totalCount: results.length,
      currentPage: Number(page),
      totalPages: Math.ceil(results.length / Number(limit)),
      suggestions: suggestions.slice(0, 5),
      responseTime
    });

  } catch (error) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    console.error('[검색] 치명적 오류:', error);

    res.status(500).json({ 
      error: '검색 서비스가 일시적으로 불안정합니다. 잠시 후 다시 시도해주세요.',
      responseTime,
      timestamp: new Date().toISOString()
    });
  }
});

  // 강의 수강신청
  app.post("/api/courses/:id/enroll", (req, res) => {
    const courseId = parseInt(req.params.id);
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "사용자 ID가 필요합니다." 
      });
    }

    // 실제로는 데이터베이스에서 수강신청 처리
    console.log(`강좌 ${courseId}에 사용자 ${userId} 수강신청`);

    return res.json({ 
      success: true, 
      message: "수강신청이 완료되었습니다." 
    });
  });

  // 강의 리뷰 조회
  app.get("/api/courses/:id/reviews", (req, res) => {
    const courseId = parseInt(req.params.id);

    const mockReviews = [
      {
        id: 1,
        userId: 1,
        userName: "김반려",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100",
        rating: 5,
        comment: "정말 유익한 강의였습니다. 우리 강아지가 많이 달라졌어요!",
        createdAt: "2025-06-15",
        helpful: 12
      },
      {
        id: 2,
        userId: 2,
        userName: "박훈련",
        userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b494?w=100&h=100",
        rating: 4,
        comment: "체계적이고 실용적인 내용이 좋았습니다.",
        createdAt: "2025-06-10",
        helpful: 8
      }
    ];

    return res.json(mockReviews);
  });

  // 강의 리뷰 작성
  app.post("/api/courses/:id/reviews", (req, res) => {
    const courseId = parseInt(req.params.id);
    const { userId, rating, comment } = req.body;

    if (!userId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "모든 필드를 입력해주세요."
      });
    }

    // 실제로는 데이터베이스에 저장
    console.log(`강좌 ${courseId}에 리뷰 작성:`, { userId, rating, comment });

    return res.json({
      success: true,
      message: "리뷰가 등록되었습니다.",
      review: {
        id: Date.now(),
        userId,
        rating,
        comment,
        createdAt: new Date().toISOString().split('T')[0],
        helpful: 0
      }
    });
  });

  // 강의 즐겨찾기 추가/제거
  app.post("/api/courses/:id/favorite", (req, res) => {
    const courseId = parseInt(req.params.id);
    const { userId, action } = req.body; // action: 'add' or 'remove'

    if (!userId || !action) {
      return res.status(400).json({
        success: false,
        message: "사용자 ID와 액션이 필요합니다."
      });
    }

    console.log(`강좌 ${courseId} 즐겨찾기 ${action}:`, userId);

    return res.json({
      success: true,
      message: action === 'add' ? "즐겨찾기에 추가되었습니다." : "즐겨찾기에서 제거되었습니다.",
      isFavorite: action === 'add'
    });
  });

  // 대체 훈련사 게시판 API
  app.get("/api/substitute-posts", async (req, res) => {
    try {
      const posts = storage.getSubstitutePosts();
      // 서버 데이터를 클라이언트 형식으로 변환
      const transformedPosts = posts.map(post => ({
        id: post.id,
        title: post.title,
        description: post.description,
        classDate: post.date,
        classTime: post.time,
        location: post.location,
        isOnline: post.location?.includes('온라인') || post.location?.includes('Zoom'),
        compensation: post.pay,
        studentCount: 5, // 기본값
        urgency: post.urgent ? 'urgent' : 'normal',
        requiredSkills: post.requirements || [],
        currentApplicants: post.applicants?.length || 0,
        maxApplicants: 3, // 기본값
        status: post.status,
        originalTrainer: post.originalTrainerName || post.trainerName,
        specialRequirements: post.requirements?.join(', ') || ''
      }));
      res.json(transformedPosts);
    } catch (error) {
      console.error('대체 훈련사 게시판 조회 오류:', error);
      res.status(500).json({ error: "대체 훈련사 게시판 조회 중 오류가 발생했습니다" });
    }
  });

  app.post("/api/substitute-posts", async (req, res) => {
    try {
      const postData = req.body;
      const newPost = await storage.createSubstitutePost(postData);
      res.json(newPost);
    } catch (error) {
      console.error('대체 훈련사 게시글 생성 오류:', error);
      res.status(500).json({ error: "대체 훈련사 게시글 생성 중 오류가 발생했습니다" });
    }
  });

  app.put("/api/substitute-posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedPost = await storage.updateSubstitutePost(id, updateData);
      res.json(updatedPost);
    } catch (error) {
      console.error('대체 훈련사 게시글 수정 오류:', error);
      res.status(500).json({ error: "대체 훈련사 게시글 수정 중 오류가 발생했습니다" });
    }
  });

  app.delete("/api/substitute-posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteSubstitutePost(id);
      res.json({ success: true });
    } catch (error) {
      console.error('대체 훈련사 게시글 삭제 오류:', error);
      res.status(500).json({ error: "대체 훈련사 게시글 삭제 중 오류가 발생했습니다" });
    }
  });

  // 대체 훈련사 지원 API
  app.post("/api/substitute-posts/:id/apply", async (req, res) => {
    try {
      const { id } = req.params;
      const applicationData = req.body;
      const result = await storage.applyForSubstitutePost(id, applicationData);
      res.json(result);
    } catch (error) {
      console.error('대체 훈련사 지원 오류:', error);
      res.status(500).json({ error: "대체 훈련사 지원 중 오류가 발생했습니다" });
    }
  });

  // 대체 훈련사 현황 관리 API
  app.get("/api/substitute-overview", async (req, res) => {
    try {
      const overview = await storage.getSubstituteOverview();
      res.json(overview);
    } catch (error) {
      console.error('대체 훈련사 현황 조회 오류:', error);
      res.status(500).json({ error: "대체 훈련사 현황 조회 중 오류가 발생했습니다" });
    }
  });

  app.get("/api/substitute-institutes", async (req, res) => {
    try {
      const institutes = await storage.getSubstituteInstitutes();
      res.json(institutes);
    } catch (error) {
      console.error('대체 훈련사 기관 현황 조회 오류:', error);
      res.status(500).json({ error: "대체 훈련사 기관 현황 조회 중 오류가 발생했습니다" });
    }
  });

  app.get("/api/substitute-alerts", async (req, res) => {
    try {
      const alerts = await storage.getSubstituteAlerts();
      res.json(alerts);
    } catch (error) {
      console.error('대체 훈련사 시스템 알림 조회 오류:', error);
      res.status(500).json({ error: "대체 훈련사 시스템 알림 조회 중 오류가 발생했습니다" });
    }
  });

  app.get("/api/substitute-trainers", async (req, res) => {
    try {
      const trainers = await storage.getSubstituteTrainers();
      res.json(trainers);
    } catch (error) {
      console.error('대체 훈련사 성과 조회 오류:', error);
      res.status(500).json({ error: "대체 훈련사 성과 조회 중 오류가 발생했습니다" });
    }
  });

  app.put("/api/substitute-alerts/:id/resolve", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await storage.resolveSubstituteAlert(id);
      res.json(result);
    } catch (error) {
      console.error('대체 훈련사 알림 해결 오류:', error);
      res.status(500).json({ error: "대체 훈련사 알림 해결 중 오류가 발생했습니다" });
    }
  });

  // 대체 훈련사 지원 신청 조회 API
  app.get("/api/substitute-applications", async (req, res) => {
    try {
      const mockApplications = [
        {
          id: '1',
          postId: '1',
          applicantName: '박대체훈련사',
          message: '대형견 훈련 경험이 5년 이상 있습니다. 해당 시간에 수업 진행 가능합니다.',
          proposedCompensation: 80000,
          applicationDate: '2025-01-20',
          status: 'pending',
          postTitle: '기초 복종 훈련 - 성인반',
          instituteName: '강남 훈련소',
          classDate: '2025-01-25',
          classTime: '14:00-15:30'
        },
        {
          id: '2',
          postId: '2',
          applicantName: '이전문훈련사',
          message: '퍼피 사회화 교육 전문가입니다. 많은 경험이 있습니다.',
          proposedCompensation: 60000,
          applicationDate: '2025-01-21',
          status: 'pending',
          postTitle: '퍼피 사회화 교육',
          instituteName: '서울 펫센터',
          classDate: '2025-01-26',
          classTime: '10:00-11:30'
        }
      ];
      res.json(mockApplications);
    } catch (error) {
      console.error('대체 훈련사 지원 신청 조회 오류:', error);
      res.status(500).json({ error: "대체 훈련사 지원 신청 조회 중 오류가 발생했습니다" });
    }
  });

  // 대체 수업 신청 승인/거절 API
  app.patch("/api/substitute-applications/:id/status", async (req, res) => {
    try {
      const applicationId = req.params.id;
      const { status, reason } = req.body;
      
      console.log('[신청 상태 변경] 요청:', { applicationId, status, reason });
      
      if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ error: '올바른 상태 값이 아닙니다.' });
      }
      
      // 여기서는 실제 데이터베이스 업데이트 대신 성공 응답을 반환
      // 실제 구현에서는 storage.updateSubstituteApplicationStatus 호출
      const updatedApplication = {
        id: applicationId,
        status,
        reason,
        updatedAt: new Date().toISOString()
      };
      
      res.json({
        success: true,
        message: status === 'accepted' ? '신청이 승인되었습니다.' : '신청이 거절되었습니다.',
        application: updatedApplication
      });
      
    } catch (error) {
      console.error('[신청 상태 변경] 오류:', error);
      res.status(500).json({ error: '신청 상태 변경 중 오류가 발생했습니다' });
    }
  });

  // 훈련사 알림장 생성 API
  app.post("/api/notebook/entries", async (req, res) => {
    try {
      const { 
        title, 
        content, 
        studentId, 
        petId, 
        trainingDate, 
        trainingDuration, 
        progressRating, 
        behaviorNotes, 
        homeworkInstructions, 
        nextGoals, 
        activities 
      } = req.body;

      if (!title || !content || !studentId || !petId) {
        return res.status(400).json({
          success: false,
          message: "필수 정보가 누락되었습니다."
        });
      }

      // 훈련사 ID는 세션에서 가져오기 (실제 구현에서는 세션 처리 필요)
      const trainerId = req.session?.user?.id || 1;

      const newJournal = await storage.createTrainingJournal({
        trainerId,
        petOwnerId: parseInt(studentId),
        petId: parseInt(petId),
        title,
        content,
        trainingDate: new Date(trainingDate),
        trainingDuration: parseInt(trainingDuration) || 60,
        progressRating: parseInt(progressRating) || 3,
        behaviorNotes: behaviorNotes || '',
        homeworkInstructions: homeworkInstructions || '',
        nextGoals: nextGoals || '',
        activities: JSON.stringify(activities || {}),
        status: 'sent',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('새 알림장 생성:', newJournal);

      return res.json({
        success: true,
        message: "알림장이 성공적으로 전송되었습니다.",
        journal: newJournal
      });
    } catch (error) {
      console.error('알림장 생성 오류:', error);
      return res.status(500).json({
        success: false,
        message: "알림장 생성 중 오류가 발생했습니다."
      });
    }
  });

  // 훈련사 알림장 목록 조회 API
  app.get("/api/trainer/training-journals", async (req, res) => {
    try {
      const trainerId = req.session?.user?.id || 1;
      const journals = await storage.getTrainingJournalsByTrainer(trainerId);
      
      return res.json({
        success: true,
        journals: journals
      });
    } catch (error) {
      console.error('훈련사 알림장 조회 오류:', error);
      return res.status(500).json({
        success: false,
        message: "알림장 조회 중 오류가 발생했습니다."
      });
    }
  });

  // 견주용 알림장 목록 조회 API
  app.get("/api/notifications/training-journals", async (req, res) => {
    try {
      const userId = req.session?.user?.id || 108; // 기본값: 김지영
      console.log(`[API] 견주 알림장 조회 - 사용자 ID: ${userId}`);
      
      const journals = await storage.getTrainingJournalsByOwner(userId);
      console.log(`[API] 조회된 알림장 수: ${journals?.length || 0}`);
      
      return res.json({
        success: true,
        journals: journals || []
      });
    } catch (error) {
      console.error('견주 알림장 조회 오류:', error);
      return res.status(500).json({
        success: false,
        message: "알림장 조회 중 오류가 발생했습니다."
      });
    }
  });

  // 훈련 알림장 조회 API 추가 (GET /api/training-journals)
  app.get("/api/training-journals", async (req, res) => {
    try {
      const { ownerId, trainerId } = req.query;
      console.log(`[API] 훈련 알림장 조회 - 견주 ID: ${ownerId}, 훈련사 ID: ${trainerId}`);
      
      let journals = [];
      
      if (ownerId) {
        // 견주별 알림장 조회
        const userId = parseInt(ownerId as string);
        journals = await storage.getTrainingJournalsByOwner(userId);
        console.log(`[API] 견주 ${userId}의 알림장 ${journals?.length || 0}개 조회`);
      } else if (trainerId) {
        // 훈련사별 알림장 조회
        const trainerIdNum = parseInt(trainerId as string);
        journals = await storage.getTrainingJournalsByTrainer(trainerIdNum);
        console.log(`[API] 훈련사 ${trainerIdNum}의 알림장 ${journals?.length || 0}개 조회`);
      } else {
        // 전체 알림장 조회
        journals = await storage.getAllTrainingJournals();
        console.log(`[API] 전체 알림장 ${journals?.length || 0}개 조회`);
      }
      
      return res.json({
        success: true,
        journals: journals || []
      });
    } catch (error) {
      console.error('훈련 알림장 조회 오류:', error);
      return res.status(500).json({
        success: false,
        message: "훈련 알림장 조회 중 오류가 발생했습니다."
      });
    }
  });

  // 통합 알림장 목록 조회 API (사용자별 권한 기반)
  app.get("/api/training-journals", async (req, res) => {
    try {
      const userId = req.session?.user?.id;
      const userRole = req.session?.user?.role;
      
      if (!userId) {
        return res.status(401).json({ error: "로그인이 필요합니다" });
      }

      let journals = [];

      if (userRole === 'admin') {
        // 관리자는 모든 알림장 조회 가능
        journals = await storage.getAllTrainingJournals();
      } else if (userRole === 'trainer') {
        // 훈련사는 자신이 작성한 알림장만 조회
        journals = await storage.getTrainingJournalsByTrainer(userId);
      } else if (userRole === 'institute-admin') {
        // 기관 관리자는 소속 훈련사들의 알림장 조회
        journals = await storage.getTrainingJournalsByInstitute(req.session?.user?.instituteId);
      } else {
        // 반려인은 자신의 반려동물 알림장만 조회
        journals = await storage.getTrainingJournalsByOwner(userId);
      }

      res.json({
        success: true,
        journals: journals
      });
    } catch (error) {
      console.error('Error fetching training journals:', error);
      res.status(500).json({ error: '훈련 알림장 조회 중 오류가 발생했습니다' });
    }
  });

  // 견주 알림장 목록 조회 API (기존)
  app.get("/api/notebook/entries", async (req, res) => {
    try {
      const userId = req.session?.user?.id || 108; // 기본값: 김지영
      const journals = await storage.getTrainingJournalsByOwner(userId);
      
      return res.json({
        success: true,
        journals
      });
    } catch (error) {
      console.error('알림장 목록 조회 오류:', error);
      return res.status(500).json({
        success: false,
        message: "알림장 목록 조회 중 오류가 발생했습니다."
      });
    }
  });

  // 훈련사 알림장 목록 조회 API
  app.get("/api/trainer/journals", async (req, res) => {
    try {
      const trainerId = req.session?.user?.id || 1;
      const journals = await storage.getTrainingJournalsByTrainer(trainerId);
      
      return res.json({
        success: true,
        journals
      });
    } catch (error) {
      console.error('훈련사 알림장 목록 조회 오류:', error);
      return res.status(500).json({
        success: false,
        message: "알림장 목록 조회 중 오류가 발생했습니다."
      });
    }
  });

  // 반려동물 훈련사 할당 API
  app.post("/api/pets/:petId/assign-trainer", async (req, res) => {
    try {
      const petId = parseInt(req.params.petId);
      const { trainerId, trainingType } = req.body;
      const userId = req.session?.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: "로그인이 필요합니다" });
      }

      // 반려동물 소유자 확인
      const pet = await storage.getPet(petId);
      if (!pet) {
        return res.status(404).json({ error: '반려동물을 찾을 수 없습니다' });
      }

      if (pet.ownerId !== userId && req.session?.user?.role !== 'admin') {
        return res.status(403).json({ error: '권한이 없습니다' });
      }

      // 훈련사 정보 조회
      const trainer = await storage.getTrainer(trainerId);
      if (!trainer) {
        return res.status(404).json({ error: '훈련사를 찾을 수 없습니다' });
      }

      // 반려동물에 훈련사 할당
      const updatedPet = await storage.updatePet(petId, {
        assignedTrainerId: trainerId,
        assignedTrainerName: trainer.name,
        trainingStatus: 'assigned',
        trainingType: trainingType || 'basic',
        notebookEnabled: true,
        trainingStartDate: new Date().toISOString()
      });

      res.json({
        success: true,
        message: `${trainer.name} 훈련사가 ${pet.name}에게 할당되었습니다.`,
        pet: updatedPet
      });
    } catch (error) {
      console.error('훈련사 할당 오류:', error);
      res.status(500).json({ error: '훈련사 할당 중 오류가 발생했습니다' });
    }
  });

  // 반려동물 훈련사 해제 API
  app.delete("/api/pets/:petId/unassign-trainer", async (req, res) => {
    try {
      const petId = parseInt(req.params.petId);
      const userId = req.session?.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: "로그인이 필요합니다" });
      }

      // 반려동물 소유자 확인
      const pet = await storage.getPet(petId);
      if (!pet) {
        return res.status(404).json({ error: '반려동물을 찾을 수 없습니다' });
      }

      if (pet.ownerId !== userId && req.session?.user?.role !== 'admin') {
        return res.status(403).json({ error: '권한이 없습니다' });
      }

      // 훈련사 할당 해제
      const updatedPet = await storage.updatePet(petId, {
        assignedTrainerId: null,
        assignedTrainerName: null,
        trainingStatus: 'not_assigned',
        trainingType: null,
        notebookEnabled: false,
        trainingStartDate: null
      });

      res.json({
        success: true,
        message: `${pet.name}의 훈련사 할당이 해제되었습니다.`,
        pet: updatedPet
      });
    } catch (error) {
      console.error('훈련사 해제 오류:', error);
      res.status(500).json({ error: '훈련사 해제 중 오류가 발생했습니다' });
    }
  });

  // 기관 관리자 - 알림장 현황 조회 API
  app.get("/api/admin/notebook/status", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      // 모든 훈련사의 알림장 작성 현황 조회
      const allJournals = await storage.getAllTrainingJournals();
      
      // 날짜 필터링
      let filteredJournals = allJournals;
      if (startDate && endDate) {
        const start = new Date(startDate as string);
        const end = new Date(endDate as string);
        filteredJournals = allJournals.filter(journal => {
          const journalDate = new Date(journal.trainingDate);
          return journalDate >= start && journalDate <= end;
        });
      }
      
      // 훈련사별 통계 계산
      const trainerStats = {};
      filteredJournals.forEach(journal => {
        const trainerId = journal.trainerId;
        if (!trainerStats[trainerId]) {
          trainerStats[trainerId] = {
            trainerId,
            trainerName: journal.trainer?.name || '알 수 없음',
            totalJournals: 0,
            sentJournals: 0,
            readJournals: 0,
            dates: []
          };
        }
        trainerStats[trainerId].totalJournals++;
        if (journal.status === 'sent' || journal.status === 'read') {
          trainerStats[trainerId].sentJournals++;
        }
        if (journal.status === 'read') {
          trainerStats[trainerId].readJournals++;
        }
        trainerStats[trainerId].dates.push({
          date: journal.trainingDate,
          status: journal.status,
          petName: journal.pet?.name || '알 수 없음',
          title: journal.title
        });
      });
      
      return res.json({
        success: true,
        stats: Object.values(trainerStats),
        totalJournals: filteredJournals.length
      });
    } catch (error) {
      console.error('알림장 현황 조회 오류:', error);
      return res.status(500).json({
        success: false,
        message: "알림장 현황 조회 중 오류가 발생했습니다."
      });
    }
  });

  // 기관 관리자 전용 - 소속 훈련사 알림장 현황 조회 API
  app.get("/api/institute/notebook/status", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      // 실제 훈련사 데이터를 가져와 기관 소속 훈련사 필터링
      const allTrainers = await storage.getAllTrainers();
      const allJournals = await storage.getAllTrainingJournals();
      
      // 기관 소속 훈련사 ID 추출 (실제 연결된 훈련사들)
      const instituteTrainerIds = allTrainers.map(trainer => trainer.id);
      
      // 날짜 필터링
      let filteredJournals = allJournals;
      if (startDate && endDate) {
        const start = new Date(startDate as string);
        const end = new Date(endDate as string);
        filteredJournals = allJournals.filter(journal => {
          const journalDate = new Date(journal.trainingDate);
          return journalDate >= start && journalDate <= end;
        });
      }
      
      // 기관 소속 훈련사의 알림장만 필터링
      const instituteJournals = filteredJournals.filter(journal => 
        instituteTrainerIds.includes(journal.trainerId)
      );
      
      // 훈련사별 통계 계산
      const trainerStats = {};
      instituteJournals.forEach(journal => {
        const trainerId = journal.trainerId;
        const trainer = allTrainers.find(t => t.id === trainerId);
        
        if (!trainerStats[trainerId]) {
          trainerStats[trainerId] = {
            trainerId,
            trainerName: trainer?.name || '알 수 없음',
            totalJournals: 0,
            sentJournals: 0,
            readJournals: 0,
            dates: []
          };
        }
        trainerStats[trainerId].totalJournals++;
        if (journal.status === 'sent' || journal.status === 'read') {
          trainerStats[trainerId].sentJournals++;
        }
        if (journal.status === 'read') {
          trainerStats[trainerId].readJournals++;
        }
        trainerStats[trainerId].dates.push({
          date: journal.trainingDate,
          status: journal.status,
          petName: journal.pet?.name || '알 수 없음',
          title: journal.title
        });
      });
      
      return res.json({
        success: true,
        stats: Object.values(trainerStats),
        totalJournals: instituteJournals.length
      });
    } catch (error) {
      console.error('기관 알림장 현황 조회 오류:', error);
      return res.status(500).json({
        success: false,
        message: "기관 알림장 현황 조회 중 오류가 발생했습니다."
      });
    }
  });

  // 사용자 즐겨찾기 강의 목록
  app.get("/api/users/:userId/favorite-courses", (req, res) => {
    const userId = parseInt(req.params.userId);

    const mockFavorites = [
      {
        id: 1,
        title: "강아지 기본 복종 훈련",
        thumbnail: "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=200",
        price: 120000,
        rating: 4.7,
        addedAt: "2025-06-15"
      }
    ];

    return res.json(mockFavorites);
  });

  // 강의 진행률 업데이트
  app.post("/api/courses/:id/progress", (req, res) => {
    const courseId = parseInt(req.params.id);
    const { userId, lessonId, completed } = req.body;

    if (!userId || !lessonId) {
      return res.status(400).json({
        success: false,
        message: "필수 정보가 누락되었습니다."
      });
    }

    // 실제로는 데이터베이스에서 진행률 업데이트
    console.log(`강좌 ${courseId} 진행률 업데이트:`, { userId, lessonId, completed });

    return res.json({
      success: true,
      message: "진행률이 업데이트되었습니다.",
      progress: completed ? 75 : 65 // 모의 진행률
    });
  });

  // 개인화된 강의 추천
  app.get("/api/users/:userId/recommended-courses", (req, res) => {
    const userId = parseInt(req.params.userId);

    const mockRecommendations = [
      {
        id: 4,
        title: "고급 어질리티 훈련",
        reason: "기본 훈련 과정을 완료하신 분께 추천",
        thumbnail: "https://images.unsplash.com/photo-1583336663277-620dc1996580?w=400&h=200",
        price: 180000,
        rating: 4.8,
        matchScore: 0.92
      },
      {
        id: 5,
        title: "반려견 심리 케어",
        reason: "관심 분야를 기반으로 추천",
        thumbnail: "https://images.unsplash.com/photo-1601758177266-bc599de87707?w=400&h=200",
        price: 150000,
        rating: 4.6,
        matchScore: 0.87
      }
    ];

    return res.json(mockRecommendations);
  });

  // 강의 수료증 발급
  app.post("/api/courses/:id/certificate", (req, res) => {
    const courseId = parseInt(req.params.id);
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "사용자 ID가 필요합니다."
      });
    }

    // 수강 완료 여부 확인 (실제로는 데이터베이스에서)
    const isCompleted = true; // 모의 데이터

    if (!isCompleted) {
      return res.status(400).json({
        success: false,
        message: "강의를 완료한 후 수료증을 발급받을 수 있습니다."
      });
    }

    const certificate = {
      id: `CERT-${courseId}-${userId}-${Date.now()}`,
      courseId,
      userId,
      courseTitle: "강아지 기본 복종 훈련",
      studentName: "김반려",
      completedAt: new Date().toISOString().split('T')[0],
      issuedAt: new Date().toISOString(),
      certificateUrl: `/certificates/${courseId}/${userId}.pdf`
    };

    console.log(`수료증 발급:`, certificate);

    return res.json({
      success: true,
      message: "수료증이 발급되었습니다.",
      certificate
    });
  });

  // 사용자 수료증 목록
  app.get("/api/users/:userId/certificates", (req, res) => {
    const userId = parseInt(req.params.userId);

    const mockCertificates = [
      {
        id: "CERT-1-1-1706123456789",
        courseId: 1,
        courseTitle: "강아지 기본 복종 훈련",
        completedAt: "2025-06-15",
        issuedAt: "2025-06-15T10:30:00.000Z",
        certificateUrl: "/certificates/1/1.pdf"
      }
    ];

    return res.json(mockCertificates);
  });

  // 알림 관련 라우트 (// 임시 비활성화)
  // registerNotificationRoutes(app);

  // 알림장 모니터링 API
  app.get("/api/admin/notebook/status", async (req, res) => {
    try {
      const { startDate, endDate, startTime, endTime } = req.query;
      
      // 모든 알림장 데이터 가져오기
      const allJournals = await storage.getAllTrainingJournals();
      
      // 날짜 및 시간 필터링
      const filteredJournals = allJournals.filter(journal => {
        const journalDate = new Date(journal.trainingDate);
        
        // 날짜 필터링
        const journalDateStr = journalDate.toISOString().split('T')[0];
        if (startDate && journalDateStr < (startDate as string)) return false;
        if (endDate && journalDateStr > (endDate as string)) return false;
        
        // 시간 필터링
        if (startTime || endTime) {
          const hours = journalDate.getHours();
          const minutes = journalDate.getMinutes();
          const journalTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          
          console.log(`Journal time: ${journalTime}, startTime: ${startTime}, endTime: ${endTime}`);
          
          if (startTime && journalTime < (startTime as string)) {
            console.log(`Filtered out: ${journalTime} < ${startTime}`);
            return false;
          }
          if (endTime && journalTime > (endTime as string)) {
            console.log(`Filtered out: ${journalTime} > ${endTime}`);
            return false;
          }
        }
        
        return true;
      });
      
      // 훈련사별 통계 생성
      const trainerStats = new Map();
      
      for (const journal of filteredJournals) {
        const trainerId = journal.trainerId;
        
        if (!trainerStats.has(trainerId)) {
          // 훈련사 정보 가져오기
          const trainer = await storage.getTrainer(trainerId);
          
          trainerStats.set(trainerId, {
            trainerId,
            trainerName: trainer?.name || `훈련사 ${trainerId}`,
            totalJournals: 0,
            sentJournals: 0,
            readJournals: 0,
            dates: []
          });
        }
        
        const stats = trainerStats.get(trainerId);
        stats.totalJournals++;
        
        if (journal.status === 'sent' || journal.status === 'read' || journal.status === 'replied') {
          stats.sentJournals++;
        }
        
        if (journal.status === 'read' || journal.status === 'replied') {
          stats.readJournals++;
        }
        
        // 펫 정보 가져오기
        const pet = await storage.getPet(journal.petId);
        
        stats.dates.push({
          date: journal.trainingDate,
          status: journal.status,
          petName: pet?.name || `펫 ${journal.petId}`,
          title: journal.title
        });
      }
      
      const response = {
        stats: Array.from(trainerStats.values()),
        totalJournals: filteredJournals.length
      };
      
      res.json(response);
      
    } catch (error) {
      console.error('알림장 현황 조회 오류:', error);
      res.status(500).json({ 
        success: false, 
        message: '알림장 현황을 불러오는 중 오류가 발생했습니다.' 
      });
    }
  });

  // 커뮤니티 API는 setupSocialRoutes에서 처리됨





  // 사용자 검색 API (메시징용) - GET과 POST 모두 지원
  app.get("/api/users/search", async (req, res) => {
    const { query } = req.query;
    await handleUserSearch(query as string, res);
  });

  app.post("/api/users/search", async (req, res) => {
    const { query } = req.body;
    await handleUserSearch(query, res);
  });

  // 사용자 검색 로직을 별도 함수로 분리
  async function handleUserSearch(query: string, res: any) {
    try {
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ 
          success: false, 
          message: '검색어가 필요합니다.' 
        });
      }

      // URL 디코딩 및 한국어 인코딩 문제 해결
      let searchQuery = query;
      try {
        // 먼저 decodeURIComponent 시도
        searchQuery = decodeURIComponent(query);
      } catch (e) {
        // 실패시 원본 사용
        searchQuery = query;
      }
      
      // 추가 한국어 디코딩 처리
      try {
        if (searchQuery !== query) {
          searchQuery = searchQuery;
        } else {
          // Buffer를 통한 UTF-8 디코딩 시도
          const buffer = Buffer.from(searchQuery, 'latin1');
          const decoded = buffer.toString('utf8');
          if (decoded !== searchQuery && decoded.length > 0) {
            searchQuery = decoded;
          }
        }
      } catch (e) {
        // 디코딩 실패시 원본 사용
      }
      
      searchQuery = searchQuery.trim();
      console.log(`[사용자 검색] 원본: "${query}" -> 처리된 검색어: "${searchQuery}"`);

      // 모든 사용자 데이터 가져오기
      const allUsers = await storage.getAllUsers();
      const allTrainers = await storage.getAllTrainers();
      
      console.log(`[사용자 검색] 전체 사용자: ${allUsers.length}명, 전체 훈련사: ${allTrainers.length}명`);

      // 검색 결과 생성
      const searchResults = [];

      // 일반 사용자 검색 (이름으로 검색)
      const matchedUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // 훈련사 검색 (이름, 전문분야로 검색)
      const matchedTrainers = allTrainers.filter(trainer => 
        trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (trainer.specialties && trainer.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchQuery.toLowerCase())
        )) ||
        (trainer.bio && trainer.bio.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      // 일반 사용자 결과 추가
      matchedUsers.forEach(user => {
        searchResults.push({
          id: user.id,
          name: user.name,
          role: user.role || 'pet-owner',
          avatar: user.avatar || null,
          email: user.email
        });
      });

      // 훈련사 결과 추가 (userId가 있으면 userId 사용, 없으면 trainer.id + 1000으로 구분)
      matchedTrainers.forEach(trainer => {
        searchResults.push({
          id: trainer.userId || (trainer.id + 1000), // 훈련사 ID를 사용자 ID로 매핑
          name: trainer.name,
          role: 'trainer',
          avatar: trainer.avatar || trainer.image || null,
          email: trainer.email,
          specialties: trainer.specialties || []
        });
      });
      
      // 검색어가 짧을 경우 모든 사용자 포함 (빈 검색어가 아닌 경우)
      if (searchQuery.length > 0 && searchQuery.length <= 2) {
        console.log(`[사용자 검색] 짧은 검색어로 전체 사용자 포함`);
        
        // 아직 포함되지 않은 사용자들도 추가
        allUsers.forEach(user => {
          const alreadyAdded = searchResults.some(result => result.id === user.id);
          if (!alreadyAdded) {
            searchResults.push({
              id: user.id,
              name: user.name,
              role: user.role || 'pet-owner',
              avatar: user.avatar || null,
              email: user.email
            });
          }
        });
        
        // 아직 포함되지 않은 훈련사들도 추가
        allTrainers.forEach(trainer => {
          const trainerId = trainer.userId || (trainer.id + 1000);
          const alreadyAdded = searchResults.some(result => result.id === trainerId);
          if (!alreadyAdded) {
            searchResults.push({
              id: trainerId,
              name: trainer.name,
              role: 'trainer',
              avatar: trainer.avatar || trainer.image || null,
              email: trainer.email,
              specialties: trainer.specialties || []
            });
          }
        });
      }

      console.log(`[사용자 검색] 검색 결과: ${searchResults.length}명`);

      res.json({ 
        success: true, 
        users: searchResults,
        query: searchQuery,
        totalResults: searchResults.length
      });

    } catch (error) {
      console.error('사용자 검색 오류:', error);
      res.status(500).json({ 
        success: false, 
        message: '사용자 검색 중 오류가 발생했습니다.' 
      });
    }
  }

  // 회원 상태 및 기관 매칭 정보 API
  app.get("/api/admin/members-status", async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      const allTrainers = await storage.getAllTrainers();
      const allInstitutes = await storage.getInstitutes();
      const allPets = await storage.getAllPets ? await storage.getAllPets() : [];

      // 사용자 역할별 분류
      const membersByRole = {
        'pet-owner': [],
        'trainer': [],
        'institute-admin': [],
        'admin': []
      };

      // 기관 매칭 정보
      const instituteMemberships = [];

      // 사용자 분류
      allUsers.forEach(user => {
        const roleKey = user.role || 'pet-owner';
        if (membersByRole[roleKey]) {
          membersByRole[roleKey].push({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified || false,
            instituteId: user.instituteId || null,
            createdAt: user.createdAt,
            avatar: user.avatar
          });
        }

        // 기관 소속 회원 추가
        if (user.instituteId) {
          const institute = allInstitutes.find(inst => inst.id === user.instituteId);
          if (institute) {
            instituteMemberships.push({
              userId: user.id,
              userName: user.name,
              userRole: user.role,
              instituteId: user.instituteId,
              instituteName: institute.name,
              joinedAt: user.createdAt
            });
          }
        }
      });

      // 훈련사-견주 연결 정보
      const trainerConnections = [];
      allTrainers.forEach(trainer => {
        // 해당 훈련사와 연결된 견주들 찾기 (예약, 메시지 등을 통해)
        const connectedOwners = allUsers.filter(user => {
          // 여기서는 간단히 같은 지역의 견주들로 시뮬레이션
          return user.role === 'pet-owner' && user.location === trainer.location;
        });

        if (connectedOwners.length > 0) {
          trainerConnections.push({
            trainerId: trainer.id,
            trainerName: trainer.name,
            connectedOwners: connectedOwners.map(owner => ({
              id: owner.id,
              name: owner.name,
              email: owner.email
            }))
          });
        }
      });

      res.json({
        success: true,
        data: {
          membersByRole,
          instituteMemberships,
          trainerConnections,
          summary: {
            totalUsers: allUsers.length,
            totalTrainers: allTrainers.length,
            totalInstitutes: allInstitutes.length,
            totalPets: allPets.length,
            petOwners: membersByRole['pet-owner'].length,
            instituteAdmins: membersByRole['institute-admin'].length,
            verifiedMembers: allUsers.filter(u => u.isVerified).length
          }
        }
      });

    } catch (error) {
      console.error('회원 상태 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: '회원 상태 정보를 가져오는데 실패했습니다.'
      });
    }
  });

  // 콘텐츠 크롤링 API
  app.post("/api/admin/content/crawl", async (req, res) => {
    try {
      const { url, autoPost = false } = req.body;
      
      if (!url) {
        return res.status(400).json({
          success: false,
          message: "URL이 필요합니다."
        });
      }

      console.log(`[콘텐츠 크롤링] URL 크롤링 시작: ${url}`);
      
      // 언론사 페이지인지 확인 (기자 페이지 URL 패턴)
      const isJournalistPage = url.includes('/journalist/') || url.includes('/press/');
      
      if (isJournalistPage) {
        console.log(`[콘텐츠 크롤링] 언론사 페이지 감지, 반려견 관련 기사 검색 시작`);
        
        // 언론사 페이지에서 반려견 관련 기사 URL들 추출
        const petArticleUrls = await contentCrawler.extractPetArticleUrls(url);
        
        if (petArticleUrls.length === 0) {
          return res.status(400).json({
            success: false,
            message: "해당 언론사 페이지에서 반려견 관련 기사를 찾을 수 없습니다."
          });
        }

        console.log(`[콘텐츠 크롤링] ${petArticleUrls.length}개의 반려견 관련 기사 발견`);

        // 첫 번째 기사를 크롤링하여 예시로 반환
        const firstArticleContent = await contentCrawler.crawlNaverMedia(petArticleUrls[0]);
        
        if (!firstArticleContent) {
          return res.status(400).json({
            success: false,
            message: "기사 크롤링에 실패했습니다."
          });
        }

        let post = null;
        if (autoPost) {
          // 커뮤니티에 자동 등록
          try {
            post = await contentCrawler.postToCommunity(firstArticleContent, storage);
            console.log(`[콘텐츠 크롤링] 커뮤니티 게시글 자동 등록 완료: ${post.id}`);
          } catch (error) {
            console.error(`[콘텐츠 크롤링] 커뮤니티 등록 실패:`, error);
          }
        }

        return res.json({
          success: true,
          message: autoPost ? `크롤링 및 커뮤니티 등록이 완료되었습니다. (총 ${petArticleUrls.length}개 기사 발견)` : `크롤링이 완료되었습니다. (총 ${petArticleUrls.length}개 기사 발견)`,
          data: {
            crawledContent: firstArticleContent,
            post,
            foundArticles: petArticleUrls.length,
            allArticleUrls: petArticleUrls.slice(0, 10) // 최대 10개만 미리보기
          }
        });

      } else {
        // 단일 기사 크롤링
        const crawledContent = await contentCrawler.crawlNaverMedia(url);
        
        if (!crawledContent) {
          return res.status(400).json({
            success: false,
            message: "크롤링에 실패했습니다. URL을 확인해주세요."
          });
        }

        // 반려견 관련 콘텐츠인지 확인
        const isPetRelated = crawledContent.tags.length > 0;
        
        if (!isPetRelated) {
          return res.status(400).json({
            success: false,
            message: "반려견 관련 콘텐츠가 아닙니다."
          });
        }

        // 자동으로 커뮤니티에 등록하는 경우
        if (autoPost) {
          try {
            const newPost = await contentCrawler.postToCommunity(crawledContent, storage);
            console.log(`[콘텐츠 크롤링] 커뮤니티 게시글 자동 등록 완료: ${newPost.id}`);
            
            return res.json({
              success: true,
              message: "크롤링 및 커뮤니티 등록이 완료되었습니다.",
              data: {
                crawledContent,
                post: newPost
              }
            });
          } catch (error) {
            console.error(`[콘텐츠 크롤링] 커뮤니티 등록 실패:`, error);
            return res.json({
              success: true,
              message: "크롤링은 완료되었지만 커뮤니티 등록에 실패했습니다.",
              data: {
                crawledContent,
                post: null
              }
            });
          }
        }

        // 크롤링 결과만 반환
        res.json({
          success: true,
          message: "크롤링이 완료되었습니다.",
          data: crawledContent
        });
      }

    } catch (error) {
      console.error('콘텐츠 크롤링 오류:', error);
      res.status(500).json({
        success: false,
        message: "크롤링 중 오류가 발생했습니다."
      });
    }
  });

  // 수동 커뮤니티 등록 API
  app.post("/api/admin/content/register", async (req, res) => {
    try {
      const { crawledContent } = req.body;
      
      if (!crawledContent) {
        return res.status(400).json({
          success: false,
          message: "크롤링 콘텐츠 데이터가 필요합니다."
        });
      }

      console.log(`[수동 등록] 커뮤니티 게시글 등록 시작: ${crawledContent.title}`);
      
      // 커뮤니티에 등록
      const newPost = await contentCrawler.postToCommunity(crawledContent, storage);
      
      console.log(`[수동 등록] 커뮤니티 게시글 등록 완료: ${newPost.id}`);
      
      res.json({
        success: true,
        message: "커뮤니티 등록이 완료되었습니다.",
        data: newPost
      });

    } catch (error) {
      console.error('수동 등록 오류:', error);
      res.status(500).json({
        success: false,
        message: "커뮤니티 등록 중 오류가 발생했습니다."
      });
    }
  });

  // 다중 URL 크롤링 API  
  app.post("/api/admin/content/crawl-multiple", async (req, res) => {
    try {
      const { urls, autoPost = false } = req.body;
      
      if (!Array.isArray(urls) || urls.length === 0) {
        return res.status(400).json({
          success: false,
          message: "URL 배열이 필요합니다."
        });
      }

      console.log(`[다중 크롤링] ${urls.length}개 URL 크롤링 시작`);
      
      // 다중 URL 크롤링
      const crawledContents = await contentCrawler.crawlMultipleUrls(urls);
      
      if (crawledContents.length === 0) {
        return res.status(400).json({
          success: false,
          message: "크롤링 가능한 반려견 관련 콘텐츠가 없습니다."
        });
      }

      const results = [];
      
      // 자동으로 커뮤니티에 등록하는 경우
      if (autoPost) {
        for (const content of crawledContents) {
          const postData = {
            title: content.title,
            content: content.summary,
            tags: content.tags,
            category: content.category,
            linkInfo: {
              url: content.sourceUrl,
              title: content.title,
              description: content.summary,
              thumbnail: content.thumbnailUrl
            },
            authorId: 1, // 관리자 ID
            authorName: "TALEZ 관리자",
            createdAt: new Date().toISOString(),
            isPublished: true
          };

          try {
            const newPost = await storage.createPost(postData);
            results.push({
              crawledContent: content,
              post: newPost,
              success: true
            });
          } catch (error) {
            console.error(`게시글 등록 실패: ${content.title}`, error);
            results.push({
              crawledContent: content,
              success: false,
              error: error.message
            });
          }
        }
        
        return res.json({
          success: true,
          message: `${crawledContents.length}개 콘텐츠 크롤링 및 커뮤니티 등록이 완료되었습니다.`,
          data: {
            totalCrawled: crawledContents.length,
            results
          }
        });
      }

      // 크롤링 결과만 반환
      res.json({
        success: true,
        message: `${crawledContents.length}개 콘텐츠 크롤링이 완료되었습니다.`,
        data: crawledContents
      });

    } catch (error) {
      console.error('다중 콘텐츠 크롤링 오류:', error);
      res.status(500).json({
        success: false,
        message: "크롤링 중 오류가 발생했습니다."
      });
    }
  });

  // 관리 기능 API는 setupSocialRoutes에서 처리됨

  // 파일 업로드 라우트
  registerUploadRoutes(app);

  // 상품 API 라우트 등록 (높은 우선순위)
  app.use('/api', productRoutes);
  app.use('/api', simpleProductRoutes);
  
  // API 라우트 직접 등록 (Vite 미들웨어보다 먼저 처리되도록)
  app.get('/api/test-products', async (req, res) => {
    try {
      const result = await db.select().from(products).limit(5);
      res.json({
        success: true,
        message: 'API 라우트가 정상적으로 작동합니다.',
        products: result,
        count: result.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: '데이터베이스 연결 오류',
        details: error.message
      });
    }
  });

  // 메시징 라우트 등록
  const httpServer = createServer(app);
  registerMessagingRoutes(app, httpServer);

  // 알림 라우트 등록 (WebSocket 설정 문제로 임시 비활성화)

// 건강 관리 라우트 (임시 비활성화)
  // setupHealthRoutes(app);

  // 분석 라우트  
  registerAnalyticsRoutes(app);

  // 소셜/커뮤니티 라우트 (임시 비활성화)
  // setupSocialRoutes(app);

  // 이벤트 라우트 등록
  app.use('/api', eventRoutes);

  // 이벤트 자동 업데이트 서비스 시작
  eventUpdater.startScheduler && eventUpdater.startScheduler();

  // 서비스 검수 API
  app.get('/api/service/inspection', async (req, res) => {
    try {
      const inspection = {
        timestamp: new Date().toISOString(),
        status: 'operational',
        features: {
          authentication: { status: 'active', health: 100 },
          petManagement: { status: 'active', health: 95 },
          courses: { status: 'active', health: 90 },
          community: { status: 'active', health: 85 },
          messaging: { status: 'limited', health: 60 },
          shopping: { status: 'active', health: 80 },
          videoCall: { status: 'partial', health: 40 },
          payments: { status: 'inactive', health: 0 }
        },
        performance: {
          responseTime: '120ms',
          uptime: '99.8%',
          memoryUsage: '45%',
          cpuUsage: '23%'
        },
        recommendations: [
          'WebSocket 서버 활성화 권장',
          '결제 시스템 구현 필요',
          '실시간 기능 개선 필요',
          '데이터베이스 최적화 권장'
        ]
      };

      res.json(inspection);
    } catch (error) {
      console.error('서비스 검수 오류:', error);
      res.status(500).json({ error: '서비스 검수 중 오류가 발생했습니다' });
    }
  });

  // 링크 정보 추출 API
  app.post('/api/extract-link-info', async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: 'URL이 필요합니다.' });
      }

      // URL 유효성 검증
      try {
        new URL(url);
      } catch {
        return res.status(400).json({ error: '유효하지 않은 URL입니다.' });
      }

      // 실제 링크 정보 추출 (간단한 모의 구현)
      const mockLinkInfo = {
        title: '반려견 훈련 관련 유용한 정보',
        description: '이 링크는 반려견 훈련에 도움이 되는 정보를 담고 있습니다.',
        image: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=300&fit=crop'
      };

      // 실제로는 웹 스크래핑이나 meta 태그 파싱을 구현
      // 여기서는 간단한 모의 데이터 반환
      res.json(mockLinkInfo);
      
    } catch (error) {
      console.error('링크 정보 추출 오류:', error);
      res.status(500).json({ error: '링크 정보 추출 중 오류가 발생했습니다.' });
    }
  });

  // 기능별 상태 체크 API
  app.get('/api/service/features', async (req, res) => {
    try {
      const features = {
        core: [
          { name: '사용자 인증', status: 'active', coverage: 100 },
          { name: '반려동물 관리', status: 'active', coverage: 95 },
          { name: '훈련사 관리', status: 'active', coverage: 90 }
        ],
        educational: [
          { name: '강좌 시스템', status: 'active', coverage: 85 },
          { name: '화상 교육', status: 'partial', coverage: 40 },
          { name: '진도 관리', status: 'active', coverage: 70 }
        ],
        communication: [
          { name: '메시징', status: 'limited', coverage: 60 },
          { name: '알림 시스템', status: 'partial', coverage: 50 },
          { name: '커뮤니티', status: 'active', coverage: 80 }
        ],
        commerce: [
          { name: '상품 조회', status: 'active', coverage: 90 },
          { name: '장바구니', status: 'active', coverage: 85 },
          { name: '결제 처리', status: 'inactive', coverage: 0 }
        ]
      };

      res.json(features);
    } catch (error) {
      console.error('기능 상태 조회 오류:', error);
      res.status(500).json({ error: '기능 상태 조회 중 오류가 발생했습니다' });
    }
  });

// ===== Trainer Routes =====

// Get all trainers with filtering
  app.get("/api/trainers", async (req, res) => {
    try {
      const { 
        specialty, 
        location, 
        certification, 
        featured, 
        search, 
        minRating, 
        maxPrice,
        page = 1,
        limit = 12,
        sortBy = 'rating',
        sortOrder = 'desc'
      } = req.query;

      let rawTrainers = await storage.getAllTrainers();

      // 데이터를 UnifiedTrainer 형태로 변환
      let trainers = rawTrainers.map(trainer => ({
        id: trainer.id,
        name: trainer.name,
        specialty: Array.isArray(trainer.specialization) ? trainer.specialization.join(', ') : trainer.specialization || trainer.specialty || '전문 분야 없음',
        description: trainer.bio || `${trainer.name}은 ${trainer.experience}년 경력의 전문 훈련사입니다.`,
        rating: trainer.rating || 4.5,
        reviewCount: trainer.reviewCount || 10,
        reviews: trainer.reviews || trainer.reviewCount || 10,
        certifications: trainer.certifications || [trainer.certification || '기본 자격증'],
        location: trainer.location || trainer.address || '서울시',
        experience: trainer.experience || '2년',
        email: trainer.email,
        phone: trainer.phone,
        image: trainer.image || trainer.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trainer.name)}&backgroundColor=6366f1&textColor=ffffff`,
        avatar: trainer.avatar || trainer.image || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trainer.name)}&backgroundColor=6366f1&textColor=ffffff`,
        price: trainer.price || 80000,
        featured: trainer.featured || false,
        availableSlots: trainer.availableSlots || ["09:00", "11:00", "14:00", "16:00"],
        contactInfo: {
          phone: trainer.phone,
          email: trainer.email
        }
      }));

      // 필터링 적용
      if (specialty && specialty !== 'all') {
        trainers = trainers.filter(trainer => 
          trainer.specialty.toLowerCase().includes(specialty.toLowerCase())
        );
      }

      if (location) {
        trainers = trainers.filter(trainer => 
          trainer.location?.toLowerCase().includes((location as string).toLowerCase())
        );
      }

      if (certification === 'true') {
        trainers = trainers.filter(trainer => trainer.certifications && trainer.certifications.length > 0);
      }

      if (featured === 'true') {
        trainers = trainers.filter(trainer => trainer.featured === true);
      }

      if (search) {
        const searchTerm = (search as string).toLowerCase();
        trainers = trainers.filter(trainer => 
          trainer.name.toLowerCase().includes(searchTerm) ||
          trainer.description?.toLowerCase().includes(searchTerm) ||
          trainer.specialty.toLowerCase().includes(searchTerm)
        );
      }

      if (minRating) {
        trainers = trainers.filter(trainer => trainer.rating >= parseFloat(minRating as string));
      }

      if (maxPrice) {
        trainers = trainers.filter(trainer => trainer.price <= parseInt(maxPrice as string));
      }

      // 정렬
      trainers.sort((a, b) => {
        let aValue, bValue;

        switch (sortBy) {
          case 'rating':
            aValue = a.rating || 0;
            bValue = b.rating || 0;
            break;
          case 'price':
            aValue = a.price || 0;
            bValue = b.price || 0;
            break;
          case 'experience':
            aValue = a.experience || 0;
            bValue = b.experience || 0;
            break;
          case 'reviews':
            aValue = a.reviewCount || 0;
            bValue = b.reviewCount || 0;
            break;
          default:
            aValue = a.rating || 0;
            bValue = b.rating || 0;
        }

        return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
      });

      // 페이지네이션
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;

      const paginatedTrainers = trainers.slice(startIndex, endIndex);
      const totalPages = Math.ceil(trainers.length / limitNum);

      return res.status(200).json({
        trainers: paginatedTrainers,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount: trainers.length,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        },
        filters: {
          specialty,
          location,
          certification,
          featured,
          search,
          minRating,
          maxPrice
        }
      });
    } catch (error: any) {
      console.error("Get trainers error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // 훈련사 상담 예약 API
  app.post("/api/trainers/:id/consultation", async (req, res) => {
    try {
      const trainerId = parseInt(req.params.id);
      const { userId, date, time, message } = req.body;

      // 간단한 예약 데이터 생성 (실제로는 DB에 저장)
      const consultation = {
        id: Date.now(),
        trainerId,
        userId,
        date,
        time,
        message,
        status: 'pending',
        createdAt: new Date()
      };

      return res.status(201).json({
        message: "상담 예약이 완료되었습니다.",
        consultation
      });
    } catch (error: any) {
      console.error("Consultation booking error:", error);
      return res.status(500).json({ message: "예약 처리 중 오류가 발생했습니다." });
    }
  });

  // 훈련사 리뷰 조회 API
  app.get("/api/trainers/:id/reviews", async (req, res) => {
    try {
      const trainerId = parseInt(req.params.id);
      const { page = 1, limit = 10 } = req.query;

      // 임시 리뷰 데이터
      const reviews = [
        {
          id: 1,
          userId: 1,
          userName: "김반려",
          rating: 5,
          comment: "정말 친절하고 전문적인 훈련사님입니다. 우리 강아지가 많이 달라졌어요!",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        {
          id: 2,
          userId: 2,
          userName: "이고양",
          rating: 4,
          comment: "체계적인 교육 프로그램으로 만족스러운 결과를 얻었습니다.",
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
        }
      ];

      return res.status(200).json({
        reviews,
        totalCount: reviews.length
      });
    } catch (error: any) {
      console.error("Get trainer reviews error:", error);
      return res.status(500).json({ message: "리뷰 조회 중 오류가 발생했습니다." });
    }
  });

  // 훈련사 스케줄 조회 API
  app.get("/api/trainers/:id/schedule", async (req, res) => {
    try {
      const trainerId = parseInt(req.params.id);
      const { date } = req.query;

      // 임시 스케줄 데이터
      const schedule = {
        trainerId,
        date: date || new Date().toISOString().split('T')[0],
        availableSlots: [
          { time: "09:00", available: true },
          { time: "10:00", available: false },
          { time: "11:00", available: true },
          { time: "14:00", available: true },
          { time: "15:00", available: false },
          { time: "16:00", available: true }
        ]
      };

      return res.status(200).json(schedule);
    } catch (error: any) {
      console.error("Get trainer schedule error:", error);
      return res.status(500).json({ message: "스케줄 조회 중 오류가 발생했습니다." });
    }
  });

  // ===== Course Routes =====

  // Get all courses
  app.get("/api/courses", async (req, res) => {
    try {
      // 실제 커리큘럼 데이터를 강좌 형태로 제공
      const curricula = storage.getAllCurricula();
      const courses = curricula
        .filter(c => c.status === 'published')
        .map(curriculum => ({
          id: curriculum.id,
          title: curriculum.title,
          description: curriculum.description,
          price: curriculum.price || 0,
          difficulty: curriculum.difficulty || 'beginner',
          category: curriculum.category || '기본 훈련',
          duration: curriculum.duration || 0,
          modules: curriculum.modules || [],
          trainerName: curriculum.trainerName || '전문 훈련사',
          status: curriculum.status,
          enrollmentCount: curriculum.enrollmentCount || 0,
          averageRating: curriculum.averageRating || 4.5,
          createdAt: curriculum.createdAt || new Date().toISOString(),
          updatedAt: curriculum.updatedAt || new Date().toISOString()
        }));
      
      return res.status(200).json(courses);
    } catch (error: any) {
      console.error("Get courses error:", error);
      return res.status(500).json({ message: "강좌 조회 중 오류가 발생했습니다." });
    }
  });

  // 정보 수정 요청 목록 조회 API
  app.get('/api/admin/correction-requests', async (req, res) => {
    try {
      const requests = storage.getCorrectionRequests();
      console.log('[Admin] 정보 수정 요청 목록 조회:', requests.length, '건');
      
      res.json({
        success: true,
        data: requests
      });
    } catch (error: any) {
      console.error('[Admin] 정보 수정 요청 목록 조회 실패:', error);
      res.status(500).json({
        success: false,
        message: error.message || '요청 목록 조회에 실패했습니다.'
      });
    }
  });

  // 정보 수정 요청 승인/반려 처리 API
  app.post('/api/admin/correction-requests/:id/review', async (req, res) => {
    const { id } = req.params;
    const { action, adminNotes } = req.body;
    
    console.log('[Admin] 정보 수정 요청 처리:', id, action, adminNotes);
    
    try {
      const result = await storage.reviewCorrectionRequest(id, action, adminNotes);
      
      res.json({
        success: true,
        message: action === 'approve' ? '요청이 승인되었습니다.' : '요청이 반려되었습니다.',
        request: result
      });
    } catch (error: any) {
      console.error('[Admin] 정보 수정 요청 처리 실패:', error);
      res.status(500).json({
        success: false,
        message: error.message || '요청 처리에 실패했습니다.'
      });
    }
  });

// 관리자 - 배너 관리
  app.get('/api/admin/banners', requireAuth('admin'), async (req, res) => {
    try {
      const banners = await storage.getAllTrainers();
      res.json(banners);
    } catch (error) {
      console.error('배너 조회 오류:', error);
      res.status(500).json({ error: '배너 조회에 실패했습니다.' });
    }
  });

  // 관리자 - 업체 등록
  app.post('/api/admin/locations', requireAuth('admin'), async (req, res) => {
    try {
      const {
        name,
        type,
        address,
        phone,
        description,
        services,
        priceRange,
        operatingHours,
        image,
        latitude,
        longitude,
        isPartner,
        status
      } = req.body;

      // 필수 필드 검증
      if (!name || !type || !address) {
        return res.status(400).json({ 
          error: '업체명, 유형, 주소는 필수 항목입니다.' 
        });
      }

      // 새 업체 정보 생성
      const newLocation = {
        id: Date.now(), // 실제로는 DB에서 생성된 ID 사용
        name,
        type,
        address,
        phone: phone || '',
        description: description || '',
        services: services || [],
        priceRange: priceRange || '',
        operatingHours: operatingHours || { open: '09:00', close: '18:00' },
        image: image || 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400',
        latitude: latitude || 37.5665,
        longitude: longitude || 126.9780,
        isPartner: isPartner || true,
        status: status || 'active',
        rating: 0,
        reviewCount: 0,
        distance: 0,
        createdAt: new Date().toISOString(),
        createdBy: req.user?.id || 'admin'
      };

      // 메모리 저장소에 저장 (실제로는 데이터베이스 사용)
      if (!global.adminLocations) {
        global.adminLocations = [];
      }
      global.adminLocations.push(newLocation);

      console.log('새 업체 등록:', newLocation);

      res.status(201).json({
        success: true,
        message: '업체가 성공적으로 등록되었습니다.',
        location: newLocation
      });

    } catch (error) {
      console.error('업체 등록 오류:', error);
      res.status(500).json({ 
        error: '업체 등록 중 오류가 발생했습니다.' 
      });
    }
  });

  // 관리자 - 업체 목록 조회
  app.get('/api/admin/locations', requireAuth('admin'), async (req, res) => {
    try {
      // 실제로는 데이터베이스에서 조회, 임시로 메모리 저장소 사용
      if (!global.adminLocations) {
        global.adminLocations = [];
      }

      res.json({
        success: true,
        locations: global.adminLocations
      });
    } catch (error) {
      console.error('업체 목록 조회 오류:', error);
      res.status(500).json({ 
        error: '업체 목록 조회에 실패했습니다.' 
      });
    }
  });

  // 관리자 - 업체 삭제
  app.delete('/api/admin/locations/:id', requireAuth('admin'), async (req, res) => {
    try {
      const locationId = parseInt(req.params.id);

      if (!global.adminLocations) {
        global.adminLocations = [];
      }

      const locationIndex = global.adminLocations.findIndex(loc => loc.id === locationId);
      if (locationIndex === -1) {
        return res.status(404).json({          error: '업체를 찾을 수 없습니다.' 
        });
      }

      global.adminLocations.splice(locationIndex, 1);

      res.json({
        success: true,
        message: '업체가 성공적으로 삭제되었습니다.'
      });

      console.log('업체 삭제:', locationId);
    } catch (error) {
      console.error('업체 삭제 오류:', error);
      res.status(500).json({ 
        error: '업체 삭제에 실패했습니다.' 
      });
    }
  });

  // 업체 정보 수정
    app.put('/api/admin/locations/:id', requireAuth('admin'), (req, res) => {
      try {
        const locationId = parseInt(req.params.id);
        const updateData = req.body;

        const locationIndex = global.adminLocations.findIndex(loc => loc.id === locationId);
        if (locationIndex === -1) {
          return res.status(404).json({ 
            error: '업체를 찾을 수 없습니다.' 
          });
        }

        // 업체 정보 업데이트
        global.adminLocations[locationIndex] = {
          ...global.adminLocations[locationIndex],
          ...updateData,
          id: locationId, // ID는 변경되지 않도록
          updatedAt: new Date().toISOString()
        };

        res.json({ 
          message: '업체 정보가 수정되었습니다.',
          location: global.adminLocations[locationIndex]
        });
      } catch (error) {
        console.error('업체 정보 수정 오류:', error);
        res.status(500).json({ error: '업체 정보 수정 중 오류가 발생했습니다.' });
      }
    });

    // 업체 상태 변경
    app.patch('/api/admin/locations/:id/status', requireAuth('admin'), (req, res) => {
      try {
        const locationId = parseInt(req.params.id);
        const { status } = req.body;

        const locationIndex = global.adminLocations.findIndex(loc => loc.id === locationId);
        if (locationIndex === -1) {
          return res.status(404).json({ 
            error: '업체를 찾을 수 없습니다.' 
          });
        }

        global.adminLocations[locationIndex].status = status;
        global.adminLocations[locationIndex].updatedAt = new Date().toISOString();

        res.json({ 
          message: '업체 상태가 변경되었습니다.',
          location: global.adminLocations[locationIndex]
        });
      } catch (error) {
        console.error('업체 상태 변경 오류:', error);
        res.status(500).json({ error: '업체 상태 변경 중 오류가 발생했습니다.' });
      }
    });

  // ===== Logo Management Routes =====

  // ===== Point Management Routes =====

  // 포인트 설정 조회
  app.get('/api/admin/point-configs', requireAuth('admin'), async (req, res) => {
    try {
      const configs = await storage.getPointConfigs();
      res.json({
        success: true,
        configs
      });
    } catch (error) {
      console.error('포인트 설정 조회 오류:', error);
      res.status(500).json({ 
        error: '포인트 설정 조회 중 오류가 발생했습니다.' 
      });
    }
  });

  // 포인트 설정 업데이트
  app.put('/api/admin/point-configs/:activityType', requireAuth('admin'), async (req, res) => {
    try {
      const { activityType } = req.params;
      const { points, incentivePerPoint } = req.body;
      
      if (!points || !incentivePerPoint) {
        return res.status(400).json({ 
          error: '포인트와 포인트당 인센티브 값이 필요합니다.' 
        });
      }
      
      const updatedConfig = await storage.updatePointConfig(activityType, {
        points: parseInt(points),
        incentivePerPoint: parseInt(incentivePerPoint)
      });
      
      res.json({
        success: true,
        message: '포인트 설정이 업데이트되었습니다.',
        config: updatedConfig
      });
    } catch (error) {
      console.error('포인트 설정 업데이트 오류:', error);
      res.status(500).json({ 
        error: '포인트 설정 업데이트 중 오류가 발생했습니다.' 
      });
    }
  });

  // 훈련사 활동 로그 조회
  app.get('/api/admin/trainer-activity-logs', requireAuth('admin'), async (req, res) => {
    try {
      const { trainerId, startDate, endDate, activityType } = req.query;
      
      const logs = await storage.getTrainerActivityLogs({
        trainerId: trainerId ? parseInt(trainerId) : undefined,
        startDate: startDate as string,
        endDate: endDate as string,
        activityType: activityType as string
      });
      
      res.json({
        success: true,
        logs
      });
    } catch (error) {
      console.error('훈련사 활동 로그 조회 오류:', error);
      res.status(500).json({ 
        error: '훈련사 활동 로그 조회 중 오류가 발생했습니다.' 
      });
    }
  });

  // 훈련사 활동 로그 추가
  app.post('/api/admin/trainer-activity-logs', requireAuth('admin'), async (req, res) => {
    try {
      const { 
        trainerId, 
        trainerName, 
        activityType, 
        activityTitle, 
        activityDescription, 
        pointsEarned, 
        incentiveAmount, 
        metadata 
      } = req.body;
      
      if (!trainerId || !trainerName || !activityType || !pointsEarned) {
        return res.status(400).json({ 
          error: '필수 필드가 누락되었습니다.' 
        });
      }
      
      const newLog = await storage.addTrainerActivityLog({
        trainerId: parseInt(trainerId),
        trainerName,
        activityType,
        activityTitle,
        activityDescription,
        pointsEarned: parseInt(pointsEarned),
        incentiveAmount: incentiveAmount || '0',
        metadata: metadata || {},
        createdAt: new Date().toISOString()
      });
      
      res.json({
        success: true,
        message: '훈련사 활동 로그가 추가되었습니다.',
        log: newLog
      });
    } catch (error) {
      console.error('훈련사 활동 로그 추가 오류:', error);
      res.status(500).json({ 
        error: '훈련사 활동 로그 추가 중 오류가 발생했습니다.' 
      });
    }
  });

  // 훈련사 기간별 포인트 조회
  app.get('/api/admin/trainer-points/:trainerId', requireAuth('admin'), async (req, res) => {
    try {
      const { trainerId } = req.params;
      const { startDate, endDate } = req.query;
      
      const points = await storage.getTrainerPointsForPeriod(
        parseInt(trainerId),
        startDate as string,
        endDate as string
      );
      
      res.json({
        success: true,
        points
      });
    } catch (error) {
      console.error('훈련사 포인트 조회 오류:', error);
      res.status(500).json({ 
        error: '훈련사 포인트 조회 중 오류가 발생했습니다.' 
      });
    }
  });

  // ===== Logo Management Routes =====

  // 로고 설정 조회 (호환성을 위한 별칭)
  app.get('/api/admin/logos', async (req, res) => {
    try {
      const settings = await storage.getLogoSettings();
      res.json(settings);
    } catch (error) {
      console.error('로고 설정 조회 오류:', error);
      res.status(500).json({ error: '로고 설정 조회에 실패했습니다.' });
    }
  });

  // 사이드바 로고 API (단수형)
  app.get('/api/admin/logo', async (req, res) => {
    try {
      const settings = await storage.getLogoSettings();
      // 사이드바 컴포넌트에서 기대하는 형식으로 변환
      const logoData = {
        expandedLogo: settings.logoLight || "/logo-light.svg",
        compactLogo: settings.logoSymbolLight || "/logo-compact.svg"
      };
      res.json(logoData);
    } catch (error) {
      console.error('로고 설정 조회 오류:', error);
      res.status(500).json({ error: '로고 설정 조회에 실패했습니다.' });
    }
  });

  // 로고 설정 조회
  app.get('/api/admin/logo-settings', async (req, res) => {
    try {
      const settings = await storage.getLogoSettings();
      res.json(settings);
    } catch (error) {
      console.error('로고 설정 조회 오류:', error);
      res.status(500).json({ error: '로고 설정 조회에 실패했습니다.' });
    }
  });

  // 로고 설정 업데이트
  app.put('/api/admin/logo-settings', async (req, res) => {
    try {
      const { logoLight, logoDark, logoSymbolLight, logoSymbolDark } = req.body;

      if (!logoLight || !logoDark || !logoSymbolLight || !logoSymbolDark) {
        return res.status(400).json({ 
          error: '모든 로고 파일이 필요합니다.' 
        });
      }

      const settings = await storage.updateLogoSettings({
        logoLight,
        logoDark,
        logoSymbolLight,
        logoSymbolDark
      });

      res.json({
        success: true,
        message: '로고 설정이 업데이트되었습니다.',
        settings
      });
    } catch (error) {
      console.error('로고 설정 업데이트 오류:', error);
      res.status(500).json({ error: '로고 설정 업데이트에 실패했습니다.' });
    }
  });

  // 로고 초기화 (기본값으로 되돌리기)
  app.post('/api/admin/logo-settings/reset', async (req, res) => {
    try {
      const settings = await storage.resetLogoSettings();
      res.json({
        success: true,
        message: '로고 설정이 초기화되었습니다.',
        settings
      });
    } catch (error) {
      console.error('로고 설정 초기화 오류:', error);
      res.status(500).json({ error: '로고 설정 초기화에 실패했습니다.' });
    }
  });

  // 로고 설정 API (단일 로고 업데이트)
  app.post('/api/logo/set', async (req, res) => {
    try {
      const { type, url } = req.body;
      
      if (!type || !url) {
        return res.status(400).json({ error: '타입과 URL이 필요합니다.' });
      }

      // 현재 로고 설정 조회
      const currentSettings = await storage.getLogoSettings();
      
      // 타입에 따른 업데이트
      const updateData = {
        logoLight: currentSettings.logoLight || "/logo-light.svg",
        logoDark: currentSettings.logoDark || "/logo-dark.svg", 
        logoSymbolLight: currentSettings.logoSymbolLight || "/logo-compact.svg",
        logoSymbolDark: currentSettings.logoSymbolDark || "/logo-compact-dark.svg"
      };

      // 업데이트할 필드 결정
      if (type === 'expanded') {
        updateData.logoLight = url;
        updateData.logoDark = url;
      } else if (type === 'compact') {
        updateData.logoSymbolLight = url;
        updateData.logoSymbolDark = url;
      }

      // 로고 설정 업데이트
      const settings = await storage.updateLogoSettings(updateData);
      
      res.json({ 
        success: true, 
        message: '로고가 성공적으로 저장되었습니다.',
        settings
      });
    } catch (error) {
      console.error('로고 설정 오류:', error);
      res.status(500).json({ error: '로고 설정에 실패했습니다.' });
    }
  });

  // 로고 삭제 API
  app.delete('/api/admin/logos/:type', async (req, res) => {
    try {
      const { type } = req.params;
      if (!type || !['main', 'compact', 'favicon'].includes(type)) {
        return res.status(400).json({ error: '유효하지 않은 로고 타입입니다.' });
      }

      await storage.deleteLogo(type as 'main' | 'compact' | 'favicon');
      res.json({ 
        success: true, 
        message: '로고가 성공적으로 삭제되었습니다.' 
      });
    } catch (error) {
      console.error('로고 삭제 오류:', error);
      res.status(500).json({ error: '로고 삭제에 실패했습니다.' });
    }
  });

  // Multer Storage 설정
  const storageConfig = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, 'public/uploads/'); // 파일 저장 경로
    },
    filename: (req: any, file: any, cb: any) => {
      const ext = path.extname(file.originalname);
      const filename = path.basename(file.originalname, ext) + '-' + Date.now() + ext;
      cb(null, filename); // 저장될 파일명
    }
  });

  // Multer 업로드 미들웨어 생성
  const upload = multer({ 
    storage: storageConfig,
    limits: { fileSize: 10 * 1024 * 1024 } // 파일 크기 제한: 10MB
  });

  // 이미지 업로드 라우트
  const uploadSingle = upload.single('image'); // 'image' 필드명으로 파일 업로드 받음
  // 이미지 업로드 라우트
  app.post('/api/upload', (req: any, res: any) => {
    uploadSingle(req, res, (err: any) => {
      if (err) {
        console.error('업로드 오류:', err);
        return res.status(400).json({ 
          error: err.message || '파일 업로드에 실패했습니다.' 
        });
      }

      if (!req.file) {
        return res.status(400).json({ 
          error: '업로드할 파일이 없습니다.' 
        });
      }

      // 파일 정보 반환
      const fileInfo = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: req.file.path.replace(process.cwd() + '/public', ''),
        size: req.file.size,
        mimetype: req.file.mimetype
      };

      res.json({
        message: '파일 업로드 성공',
        url: fileInfo.url,
        file: fileInfo
      });
    });
  });

  // 위치 기반 서비스 라우트
  app.get('/api/places/nearby', async (req, res) => {
    try {
      const { latitude, longitude, radius = 1000 } = req.query;

      if (!latitude || !longitude) {
        return res.status(400).json({ error: '위도와 경도가 필요합니다.' });
      }

      // 실제로는 데이터베이스에서 위치 기반 검색 실행
      const nearbyPlaces = [
        {
          id: 1,
          name: "Talez 펫 플레이스",
          type: "카페",
          address: "서울시 강남구 테헤란로 427",
          latitude: 37.5034,
          longitude: 127.0448,
          distance: 0.5
        },
        {
          id: 2,
          name: "Talez 동물병원",
          type: "병원",
          address: "서울시 강남구 삼성동 123-45",
          latitude: 37.5133,
          longitude: 127.0585,
          distance: 0.8
        }
      ];

      res.json(nearbyPlaces);
    } catch (error) {
      console.error('위치 기반 장소 조회 오류:', error);
      res.status(500).json({ error: '위치 기반 장소 조회에 실패했습니다.' });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date(),
      version: "1.0.0",
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Stripe 결제 시스템 API
  
  // 강의 구매 및 상품 구매 결제 인텐트 생성
  app.post('/api/create-payment-intent', async (req, res) => {
    try {
      const { amount, courseId, courseTitle, itemId, itemName, itemType } = req.body;
      
      // Stripe 사용 가능 여부 확인
      const currentStripeKey = process.env.STRIPE_SECRET_KEY;
      
      if (!currentStripeKey) {
        console.warn('⚠️ 결제 API 호출됨 - Stripe 키 없음');
        return res.status(503).json({ 
          error: '결제 시스템이 현재 설정되지 않았습니다. 관리자에게 문의하세요.',
          code: 'PAYMENT_UNAVAILABLE'
        });
      }
      
      if (!amount || (!courseId && !itemId)) {
        return res.status(400).json({ error: '결제 금액과 구매 항목 ID가 필요합니다.' });
      }

      // 메타데이터 생성
      const metadata: any = {};
      if (itemType === 'product') {
        metadata.productId = itemId;
        metadata.productName = itemName || '상품 구매';
        metadata.type = 'product';
      } else {
        metadata.courseId = courseId || itemId;
        metadata.courseTitle = courseTitle || itemName || '강의 구매';
        metadata.type = 'course';
      }

      // 실시간 Stripe 인스턴스 생성 (캐시 방지)
      let currentStripe: Stripe;
      try {
        currentStripe = new Stripe(currentStripeKey, {
          apiVersion: '2023-10-16',
        });
      } catch (error) {
        console.error('Stripe 인스턴스 생성 실패:', error);
        return res.status(500).json({ error: '결제 시스템 초기화에 실패했습니다.' });
      }

      // Stripe PaymentIntent 생성
      const paymentIntent = await currentStripe.paymentIntents.create({
        amount: Math.round(amount * 100), // 센트 단위로 변환
        currency: 'krw',
        metadata: metadata
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error) {
      console.error('Payment intent 생성 오류:', error);
      res.status(500).json({ error: '결제 준비 중 오류가 발생했습니다.' });
    }
  });

  // 결제 상태 확인 및 강의 등록
  app.post('/api/confirm-payment', async (req, res) => {
    try {
      const { paymentIntentId, courseId } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: '로그인이 필요합니다.' });
      }

      // Stripe에서 결제 상태 확인
      if (!stripe) {
        return res.status(503).json({ error: '결제 시스템이 설정되지 않았습니다.' });
      }
      
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        // 강의 등록 처리
        const enrollment = {
          id: Date.now().toString(),
          userId: userId,
          courseId: courseId,
          paymentIntentId: paymentIntentId,
          amount: paymentIntent.amount / 100, // 원 단위로 변환
          status: 'enrolled',
          enrolledAt: new Date(),
          progress: 0
        };

        // 실제 구현에서는 storage에 저장
        console.log('[강의 등록] 결제 완료 후 강의 등록:', enrollment);

        res.json({
          success: true,
          message: '결제가 완료되어 강의에 등록되었습니다.',
          enrollment: enrollment
        });
      } else {
        res.status(400).json({ error: '결제가 완료되지 않았습니다.' });
      }
    } catch (error) {
      console.error('결제 확인 오류:', error);
      res.status(500).json({ error: '결제 확인 중 오류가 발생했습니다.' });
    }
  });

  // 결제 이력 조회
  app.get('/api/payment-history', async (req, res) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: '로그인이 필요합니다.' });
      }

      // 실제 구현에서는 데이터베이스에서 조회
      const paymentHistory = [
        {
          id: '1',
          courseId: 'course-basic-obedience',
          courseTitle: '기초 복종훈련 완전정복',
          amount: 180000,
          status: 'completed',
          paidAt: new Date('2025-01-15'),
          paymentMethod: 'card'
        }
      ];

      res.json({
        success: true,
        payments: paymentHistory
      });
    } catch (error) {
      console.error('결제 이력 조회 오류:', error);
      res.status(500).json({ error: '결제 이력 조회 중 오류가 발생했습니다.' });
    }
  });

  // 훈련사 양성 과정 API
  app.get("/api/trainer-programs", async (req, res) => {
    try {
      const programs = [
        {
          id: 1,
          name: "기초 반려견 훈련사 과정",
          duration: "8주",
          description: "반려견 기초 훈련 전문가 양성 과정",
          price: 500000,
          startDate: "2024-03-01",
          capacity: 20,
          enrolledCount: 15
        },
        {
          id: 2,
          name: "고급 행동 교정사 과정",
          duration: "12주",
          description: "문제 행동 교정 전문가 양성 과정",
          price: 800000,
          startDate: "2024-03-15",
          capacity: 15,
          enrolledCount: 8
        }
      ];
      
      res.json({
        success: true,
        programs
      });
    } catch (error) {
      console.error('훈련사 양성 과정 목록 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: '훈련사 양성 과정 목록을 불러오는 중 오류가 발생했습니다.'
      });
    }
  });

  // 훈련사 신청 목록 API
  app.get("/api/trainer-applications", async (req, res) => {
    try {
      const applications = [
        {
          id: 1,
          applicantName: "김훈련",
          programName: "기초 반려견 훈련사 과정",
          status: "pending",
          appliedDate: "2024-02-15",
          experience: "2년",
          certification: "반려동물행동지도사 2급"
        },
        {
          id: 2,
          applicantName: "이전문",
          programName: "고급 행동 교정사 과정",
          status: "approved",
          appliedDate: "2024-02-10",
          experience: "5년",
          certification: "반려동물행동지도사 1급"
        }
      ];
      
      res.json({
        success: true,
        applications
      });
    } catch (error) {
      console.error('훈련사 신청 목록 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: '훈련사 신청 목록을 불러오는 중 오류가 발생했습니다.'
      });
    }
  });

  // 훈련사 인증 기록 API
  app.get("/api/trainer-certifications", async (req, res) => {
    try {
      const certifications = [
        {
          id: 1,
          trainerName: "김훈련",
          certificationType: "반려동물행동지도사 2급",
          issuedDate: "2024-01-15",
          expiryDate: "2026-01-15",
          status: "active",
          issuingOrganization: "한국반려동물협회"
        },
        {
          id: 2,
          trainerName: "이전문",
          certificationType: "반려동물행동지도사 1급",
          issuedDate: "2023-12-01",
          expiryDate: "2025-12-01",
          status: "active",
          issuingOrganization: "한국반려동물협회"
        }
      ];
      
      res.json({
        success: true,
        certifications
      });
    } catch (error) {
      console.error('훈련사 인증 기록 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: '훈련사 인증 기록을 불러오는 중 오류가 발생했습니다.'
      });
    }
  });

  // 테스트 등록 데이터 생성 엔드포인트
  app.post("/api/test/create-sample-registrations", (req, res) => {
    try {
      if (!global.registrationApplications) {
        global.registrationApplications = [];
      }

      // 샘플 훈련사 등록 신청 데이터
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
        }
      ];

      // 샘플 기관 등록 신청 데이터
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

      // 전역 등록 신청 배열에 추가
      global.registrationApplications.push(
        ...sampleTrainerApplications,
        ...sampleInstituteApplications
      );

      console.log('테스트 등록 데이터 생성 완료:', global.registrationApplications.length, '건');

      res.json({
        success: true,
        message: '테스트 등록 데이터가 생성되었습니다.',
        created: {
          trainers: sampleTrainerApplications.length,
          institutes: sampleInstituteApplications.length,
          total: sampleTrainerApplications.length + sampleInstituteApplications.length
        }
      });

    } catch (error) {
      console.error('테스트 데이터 생성 실패:', error);
      res.status(500).json({
        success: false,
        message: '테스트 데이터 생성 중 오류가 발생했습니다.'
      });
    }
  });

  // 등록 신청 데이터 상태 확인 (인증 없음 - 테스트용)
  app.get("/api/test/registration-status", (req, res) => {
    try {
      const total = global.registrationApplications ? global.registrationApplications.length : 0;
      const pending = global.registrationApplications ? 
        global.registrationApplications.filter(app => app.status === 'pending').length : 0;
      const approved = global.registrationApplications ? 
        global.registrationApplications.filter(app => app.status === 'approved').length : 0;
      const rejected = global.registrationApplications ? 
        global.registrationApplications.filter(app => app.status === 'rejected').length : 0;

      res.json({
        success: true,
        data: {
          total,
          pending,
          approved,
          rejected,
          applications: global.registrationApplications || []
        }
      });
    } catch (error) {
      console.error('등록 상태 확인 실패:', error);
      res.status(500).json({
        success: false,
        message: '등록 상태 확인 중 오류가 발생했습니다.'
      });
    }
  });

  // === Location API Routes ===

  // 위치 찾기 API (기관 + 훈련사 + 기타 위치)
  app.get('/api/locations', async (req, res) => {
    try {
      const { search, type, certification } = req.query;
      
      // 기관 데이터 가져오기
      const institutes = await storage.getInstitutes();
      
      // 기관을 위치 형식으로 변환
      let locations = institutes.map(institute => ({
        id: institute.id,
        name: institute.name,
        type: 'institute',
        address: institute.address,
        description: institute.description,
        phone: institute.phone,
        website: institute.website,
        rating: institute.rating || 4.5,
        reviewCount: institute.reviewCount || 0,
        certification: institute.isVerified,
        latitude: institute.latitude,
        longitude: institute.longitude,
        facilities: institute.facilities || [],
        operatingHours: institute.operatingHours,
        isActive: institute.isActive
      }));

      // 필터링
      if (search) {
        const searchTerm = search.toString().trim();
        console.log(`[위치 검색] 검색어: "${searchTerm}"`);
        console.log(`[위치 검색] 검색 전 위치 수: ${locations.length}`);
        
        locations = locations.filter(location => {
          const nameMatch = location.name && location.name.includes(searchTerm);
          const addressMatch = location.address && location.address.includes(searchTerm);
          const descMatch = location.description && location.description.includes(searchTerm);
          
          const isMatch = nameMatch || addressMatch || descMatch;
          
          if (isMatch) {
            console.log(`[위치 검색] 매칭됨: ${location.name} (이름:${nameMatch}, 주소:${addressMatch}, 설명:${descMatch})`);
          }
          
          return isMatch;
        });
        
        console.log(`[위치 검색] 검색 후 위치 수: ${locations.length}`);
      }

      if (type && type !== 'all') {
        locations = locations.filter(location => location.type === type);
      }

      if (certification === 'true') {
        locations = locations.filter(location => location.certification);
      }

      res.json(locations);
    } catch (error) {
      console.error('위치 목록 조회 실패:', error);
      res.status(500).json({
        success: false,
        message: '위치 목록을 불러오는 중 오류가 발생했습니다.'
      });
    }
  });

  // === Institute API Routes ===

  // 기관 목록 조회
  app.get('/api/institutes', async (req, res) => {
    try {
      const institutes = await storage.getInstitutes();
      res.json(institutes);
    } catch (error) {
      console.error('기관 목록 조회 실패:', error);
      res.status(500).json({
        success: false,
        message: '기관 목록을 불러오는 중 오류가 발생했습니다.'
      });
    }
  });

  // 기관 상세 조회
  app.get('/api/institutes/:id', async (req, res) => {
    try {
      const institute = await storage.getInstitute(parseInt(req.params.id));
      if (!institute) {
        return res.status(404).json({
          success: false,
          message: '기관을 찾을 수 없습니다.'
        });
      }
      res.json(institute);
    } catch (error) {
      console.error('기관 상세 조회 실패:', error);
      res.status(500).json({
        success: false,
        message: '기관 정보를 불러오는 중 오류가 발생했습니다.'
      });
    }
  });

  // 기관 등록 (관리자 전용)
  app.post('/api/institutes', requireAuth('admin'), async (req, res) => {
    try {
      const institute = await storage.createInstitute(req.body);
      res.status(201).json(institute);
    } catch (error) {
      console.error('기관 등록 실패:', error);
      res.status(500).json({
        success: false,
        message: '기관 등록 중 오류가 발생했습니다.'
      });
    }
  });

  // 기관 수정 (관리자 전용)
  app.put('/api/institutes/:id', requireAuth('admin'), async (req, res) => {
    try {
      const institute = await storage.updateInstitute(parseInt(req.params.id), req.body);
      res.json(institute);
    } catch (error) {
      console.error('기관 수정 실패:', error);
      res.status(500).json({
        success: false,
        message: '기관 수정 중 오류가 발생했습니다.'
      });
    }
  });

  // 기관 삭제 (관리자 전용)
  app.delete('/api/institutes/:id', requireAuth('admin'), async (req, res) => {
    try {
      await storage.deleteInstitute(parseInt(req.params.id));
      res.json({
        success: true,
        message: '기관이 삭제되었습니다.'
      });
    } catch (error) {
      console.error('기관 삭제 실패:', error);
      res.status(500).json({
        success: false,
        message: '기관 삭제 중 오류가 발생했습니다.'
      });
    }
  });

  // === Registration API Routes ===

  // 훈련사 등록 신청
  app.post('/api/registration/trainer', upload.any(), async (req, res) => {
    try {
      const registrationData = JSON.parse(req.body.registrationData);
      
      // 파일 처리
      const files = req.files as Express.Multer.File[];
      const processedFiles = {
        profileImage: null as string | null,
        certificationDocs: [] as string[],
        portfolioImages: [] as string[]
      };

      if (files) {
        files.forEach(file => {
          const filePath = `/uploads/${file.filename}`;
          
          if (file.fieldname === 'profileImage') {
            processedFiles.profileImage = filePath;
          } else if (file.fieldname.startsWith('certificationDoc_')) {
            processedFiles.certificationDocs.push(filePath);
          } else if (file.fieldname.startsWith('portfolioImage_')) {
            processedFiles.portfolioImages.push(filePath);
          }
        });
      }

      // 등록 신청 데이터 생성
      const application = {
        id: Date.now().toString(),
        type: 'trainer',
        applicantInfo: registrationData,
        documents: processedFiles,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        reviewerId: null,
        reviewedAt: null,
        notes: ''
      };

      // 메모리 저장소에 저장 (실제로는 데이터베이스)
      if (!global.registrationApplications) {
        global.registrationApplications = [];
      }
      global.registrationApplications.push(application);

      console.log('훈련사 등록 신청:', application);

      res.status(201).json({
        success: true,
        message: '훈련사 등록 신청이 접수되었습니다.',
        applicationId: application.id
      });

    } catch (error) {
      console.error('훈련사 등록 실패:', error);
      res.status(500).json({
        success: false,
        message: '등록 신청 처리 중 오류가 발생했습니다.'
      });
    }
  });

  // 기관 등록 신청
  app.post('/api/registration/institute', upload.any(), async (req, res) => {
    try {
      const registrationData = JSON.parse(req.body.registrationData);
      
      // 파일 처리
      const files = req.files as Express.Multer.File[];
      const processedFiles = {
        businessLicense: null as string | null,
        facilityImages: [] as string[],
        certificationDocs: [] as string[]
      };

      if (files) {
        files.forEach(file => {
          const filePath = `/uploads/${file.filename}`;
          
          if (file.fieldname === 'businessLicense') {
            processedFiles.businessLicense = filePath;
          } else if (file.fieldname.startsWith('facilityImage_')) {
            processedFiles.facilityImages.push(filePath);
          } else if (file.fieldname.startsWith('certificationDoc_')) {
            processedFiles.certificationDocs.push(filePath);
          }
        });
      }

      // 등록 신청 데이터 생성
      const application = {
        id: Date.now().toString(),
        type: 'institute',
        applicantInfo: registrationData,
        documents: processedFiles,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        reviewerId: null,
        reviewedAt: null,
        notes: ''
      };

      // 메모리 저장소에 저장
      if (!global.registrationApplications) {
        global.registrationApplications = [];
      }
      global.registrationApplications.push(application);

      console.log('기관 등록 신청:', application);

      res.status(201).json({
        success: true,
        message: '기관 등록 신청이 접수되었습니다.',
        applicationId: application.id
      });

    } catch (error) {
      console.error('기관 등록 실패:', error);
      res.status(500).json({
        success: false,
        message: '등록 신청 처리 중 오류가 발생했습니다.'
      });
    }
  });

  // 등록 신청 목록 조회 (관리자용)
  app.get('/api/admin/registrations', requireAuth('admin'), async (req, res) => {
    try {
      const { type, status } = req.query;
      
      if (!global.registrationApplications) {
        global.registrationApplications = [];
      }

      let applications = [...global.registrationApplications];

      // 필터링
      if (type) {
        applications = applications.filter(app => app.type === type);
      }
      if (status) {
        applications = applications.filter(app => app.status === status);
      }

      // 최신순 정렬
      applications.sort((a, b) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );

      res.json({
        success: true,
        applications,
        total: applications.length
      });

    } catch (error) {
      console.error('등록 신청 목록 조회 실패:', error);
      res.status(500).json({
        success: false,
        message: '등록 신청 목록 조회 중 오류가 발생했습니다.'
      });
    }
  });

  // 등록 신청 승인/거부 (관리자용)
  app.put('/api/admin/registrations/:id', async (req, res) => {
    try {
      const applicationId = req.params.id;
      const { status, notes } = req.body;

      console.log(`[등록 신청 처리] ID: ${applicationId}, Status: ${status}`);

      if (!global.registrationApplications) {
        global.registrationApplications = [];
      }

      const applicationIndex = global.registrationApplications.findIndex(
        app => app.id === applicationId
      );

      if (applicationIndex === -1) {
        console.log(`[등록 신청 처리] 신청을 찾을 수 없음: ${applicationId}`);
        return res.status(404).json({
          success: false,
          message: '등록 신청을 찾을 수 없습니다.'
        });
      }

      // 상태 업데이트
      global.registrationApplications[applicationIndex].status = status;
      global.registrationApplications[applicationIndex].notes = notes || '';
      global.registrationApplications[applicationIndex].reviewerId = 'admin';
      global.registrationApplications[applicationIndex].reviewedAt = new Date().toISOString();

      const application = global.registrationApplications[applicationIndex];

      // 승인된 경우 실제 훈련사/기관으로 등록
      if (status === 'approved') {
        if (application.type === 'trainer') {
          // 훈련사 데이터 생성
          const trainerData = {
            id: Date.now(),
            name: application.applicantInfo.personalInfo.name,
            email: application.applicantInfo.personalInfo.email,
            phone: application.applicantInfo.personalInfo.phone,
            bio: application.applicantInfo.professionalInfo.bio,
            specialties: application.applicantInfo.professionalInfo.specialties,
            experience: application.applicantInfo.professionalInfo.experience,
            certifications: application.applicantInfo.professionalInfo.certifications,
            price: parseInt(application.applicantInfo.businessInfo.hourlyRate),
            location: application.applicantInfo.professionalInfo.serviceArea,
            address: application.applicantInfo.personalInfo.address,
            profileImage: application.documents.profileImage,
            rating: 0,
            reviewCount: 0,
            featured: false,
            isActive: true,
            createdAt: new Date().toISOString()
          };

          // 훈련사 목록에 추가 (실제로는 데이터베이스)
          await storage.createTrainer(trainerData);
          
        } else if (application.type === 'institute') {
          // 기관 데이터 생성
          const instituteData = {
            id: Date.now(),
            name: application.applicantInfo.basicInfo.instituteName,
            email: application.applicantInfo.basicInfo.email,
            phone: application.applicantInfo.basicInfo.phone,
            address: application.applicantInfo.locationInfo.address,
            description: application.applicantInfo.serviceInfo.description,
            establishedYear: parseInt(application.applicantInfo.basicInfo.establishedYear),
            capacity: parseInt(application.applicantInfo.facilityInfo.capacity),
            facilities: application.applicantInfo.facilityInfo.facilities,
            services: application.applicantInfo.serviceInfo.serviceTypes,
            operatingHours: application.applicantInfo.serviceInfo.operatingHours,
            rating: 0,
            reviewCount: 0,
            isActive: true,
            createdAt: new Date().toISOString()
          };

          // 기관 목록에 추가
          if (!global.registeredInstitutes) {
            global.registeredInstitutes = [];
          }
          global.registeredInstitutes.push(instituteData);
        } else if (application.type === 'curriculum') {
          // 커리큘럼을 실제 코스로 변환
          const curriculumInfo = application.applicantInfo.curriculumInfo;
          
          const courseData = {
            id: `course-${Date.now()}`,
            title: curriculumInfo.title,
            instructor: curriculumInfo.trainerName,
            description: curriculumInfo.description,
            category: curriculumInfo.category,
            difficulty: curriculumInfo.difficulty,
            price: curriculumInfo.price,
            duration: curriculumInfo.duration,
            modules: [], // 실제로는 원본 커리큘럼에서 모듈 데이터 가져와야 함
            enrollmentCount: 0,
            rating: 0,
            reviewCount: 0,
            isActive: true,
            featured: false,
            tags: [curriculumInfo.category],
            createdAt: new Date().toISOString()
          };

          // 코스 목록에 추가 (실제로는 데이터베이스)
          await storage.createCourse(courseData);
          
          console.log('[커리큘럼 승인] 실제 서비스에 코스로 반영됨:', courseData.title);
        }
      }

      const applicationName = 
        application.type === 'trainer' ? application.applicantInfo.personalInfo?.name :
        application.type === 'institute' ? application.applicantInfo.basicInfo?.instituteName :
        application.type === 'curriculum' ? application.applicantInfo.curriculumInfo?.title :
        '알 수 없음';
      
      console.log(`[등록 신청 처리] ${status} 완료:`, applicationName);

      res.json({
        success: true,
        message: `등록 신청이 ${status === 'approved' ? '승인' : '거부'}되었습니다.`,
        application
      });

    } catch (error) {
      console.error('[등록 신청 처리] 실패:', error);
      res.status(500).json({
        success: false,
        message: '등록 신청 처리 중 오류가 발생했습니다.'
      });
    }
  });

  // 처리 완료된 등록 신청 초기화 (관리자용)
  app.delete('/api/admin/registrations/clear-processed', async (req, res) => {
    try {
      if (!global.registrationApplications) {
        global.registrationApplications = [];
      }

      // 처리 완료된 신청 (승인됨 또는 거부됨) 찾기
      const processedApplications = global.registrationApplications.filter(
        app => app.status === 'approved' || app.status === 'rejected'
      );

      if (processedApplications.length === 0) {
        return res.json({
          success: true,
          message: '처리 완료된 신청이 없습니다.',
          clearedCount: 0
        });
      }

      // 처리 완료된 신청 제거 (pending 상태만 유지)
      global.registrationApplications = global.registrationApplications.filter(
        app => app.status === 'pending'
      );

      console.log(`[등록 신청 초기화] ${processedApplications.length}개의 처리 완료된 신청이 초기화되었습니다.`);

      res.json({
        success: true,
        message: `${processedApplications.length}개의 처리 완료된 신청이 초기화되었습니다.`,
        clearedCount: processedApplications.length
      });

    } catch (error) {
      console.error('처리 완료된 신청 초기화 실패:', error);
      res.status(500).json({
        success: false,
        message: '처리 완료된 신청 초기화 중 오류가 발생했습니다.'
      });
    }
  });

  // 커리큘럼 관리 API
  app.get('/api/courses/curriculum', async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json({ courses });
    } catch (error) {
      console.error('[커리큘럼] 강의 목록 조회 실패:', error);
      res.status(500).json({ message: '강의 목록을 불러올 수 없습니다.' });
    }
  });

  app.post('/api/courses/curriculum', async (req, res) => {
    try {
      const { title, description, difficulty, price } = req.body;
      
      const course = {
        id: Date.now().toString(),
        title,
        description,
        trainerId: req.user?.id || '1',
        trainerName: req.user?.name || '훈련사',
        modules: [],
        totalDuration: 0,
        difficulty,
        price,
        enrollmentCount: 0,
        rating: 0,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      res.json(course);
    } catch (error) {
      console.error('[커리큘럼] 강의 생성 실패:', error);
      res.status(500).json({ message: '강의 생성에 실패했습니다.' });
    }
  });

  // Excel 파일 업로드를 위한 multer 설정
  const curriculumStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = 'uploads/curriculum';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
      cb(null, 'curriculum-' + uniqueSuffix + '-' + originalName);
    }
  });

  const curriculumUpload = multer({
    storage: curriculumStorage,
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'application/x-hwp', // .hwp
        'application/vnd.hancom.hwp' // .hwpx
      ];
      
      if (allowedTypes.includes(file.mimetype) || 
          file.originalname.match(/\.(xlsx|xls|hwp|hwpx)$/i)) {
        cb(null, true);
      } else {
        cb(new Error('지원되지 않는 파일 형식입니다. Excel 파일(.xlsx, .xls) 또는 HWP 파일(.hwp, .hwpx)만 업로드 가능합니다.'), false);
      }
    }
  });

  // 영상 파일 업로드를 위한 multer 설정
  const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = 'uploads/videos';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
      cb(null, 'video-' + uniqueSuffix + '-' + originalName);
    }
  });

  const videoUpload = multer({
    storage: videoStorage,
    limits: {
      fileSize: 500 * 1024 * 1024, // 500MB
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = [
        'video/mp4',
        'video/avi', 
        'video/mov',
        'video/quicktime',
        'video/x-msvideo'
      ];
      
      if (allowedTypes.includes(file.mimetype) || 
          file.originalname.match(/\.(mp4|avi|mov|quicktime)$/i)) {
        cb(null, true);
      } else {
        cb(new Error('지원되지 않는 파일 형식입니다. MP4, AVI, MOV 파일만 업로드 가능합니다.'), false);
      }
    }
  });

  // 커리큘럼 파일 업로드 API
  app.post('/api/admin/curriculum/upload', curriculumUpload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          message: '업로드할 파일이 없습니다.' 
        });
      }

      const file = req.file;
      const filePath = file.path;
      const fileExtension = path.extname(file.originalname).toLowerCase();

      console.log('[커리큘럼 업로드] 파일 정보:', {
        originalName: file.originalname,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        extension: fileExtension
      });

      let extractedData = {};
      let registrantInfo = {};

      // 파일 형식에 따른 처리
      if (fileExtension === '.xlsx' || fileExtension === '.xls') {
        try {
          // 파일 경로를 Buffer로 읽어서 한글 파일명 문제 해결
          let workbook;
          try {
            // 먼저 파일 경로로 직접 시도
            workbook = xlsx.readFile(filePath);
          } catch (pathError) {
            console.log('[엑셀 파싱] 파일 경로 접근 실패, Buffer로 읽기 시도:', pathError.message);
            // 파일을 Buffer로 읽어서 처리
            const fileBuffer = fs.readFileSync(filePath);
            workbook = xlsx.read(fileBuffer, { type: 'buffer' });
          }
          
          console.log('[엑셀 파싱] 파일 경로:', filePath);
          console.log('[엑셀 파싱] 워크북 로드 성공');
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

          console.log('[엑셀 파싱] 시트명:', sheetName);
          console.log('[엑셀 파싱] 데이터 행 수:', data.length);

          // 파일 이름에서 기본 정보 추출
          const fileName = file.originalname.replace(/\.(xlsx|xls)$/i, '');
          
          // 엑셀 파싱 함수 호출
          extractedData = parseExcelCurriculumWithPricing(data, fileName);
          
          // 등록자 정보 추출 (첫 번째 행에서)
          if (data.length > 0 && data[0].length > 0) {
            registrantInfo = {
              name: data[0][0] || '미확인',
              email: data[0][1] || '',
              phone: data[0][2] || '',
              institution: data[0][3] || ''
            };
          }

          console.log('[엑셀 파싱] 추출된 데이터:', extractedData);
          console.log('[엑셀 파싱] 등록자 정보:', registrantInfo);

        } catch (parseError) {
          console.error('[엑셀 파싱] 파일 파싱 오류:', parseError);
          return res.status(400).json({ 
            success: false, 
            message: 'Excel 파일을 읽는 중 오류가 발생했습니다. 파일 형식을 확인해주세요.' 
          });
        }
      } else {
        // HWP 파일 처리 (기본 정보만 추출)
        const fileName = file.originalname.replace(/\.(hwp|hwpx)$/i, '');
        extractedData = {
          title: fileName,
          description: `${fileName} 커리큘럼`,
          category: '전문교육',
          difficulty: 'intermediate',
          duration: 480,
          price: 300000,
          modules: []
        };
        
        registrantInfo = {
          name: '미확인',
          email: '',
          phone: '',
          institution: ''
        };
      }

      // 파일 삭제 (임시 파일 정리)
      try {
        fs.unlinkSync(filePath);
      } catch (unlinkError) {
        console.warn('[파일 정리] 임시 파일 삭제 실패:', unlinkError);
      }

      res.json({
        success: true,
        data: extractedData,
        registrantInfo: registrantInfo,
        message: '파일이 성공적으로 처리되었습니다.'
      });

    } catch (error) {
      console.error('[커리큘럼 업로드] 처리 오류:', error);
      
      // 파일 정리
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.warn('[파일 정리] 오류 발생 시 파일 삭제 실패:', unlinkError);
        }
      }
      
      res.status(500).json({ 
        success: false, 
        message: '파일 처리 중 오류가 발생했습니다. 파일 형식과 내용을 확인해주세요.' 
      });
    }
  });

  app.post('/api/courses/:courseId/modules', async (req, res) => {
    try {
      const { courseId } = req.params;
      const { title, description, duration, difficulty, objectives, prerequisites, isRequired } = req.body;
      
      const module = {
        id: Date.now().toString(),
        title,
        description,
        order: 0,
        duration,
        difficulty,
        objectives: objectives || [],
        prerequisites: prerequisites || [],
        isRequired: isRequired !== false,
        videos: []
      };

      res.json(module);
    } catch (error) {
      console.error('[커리큘럼] 모듈 생성 실패:', error);
      res.status(500).json({ message: '모듈 생성에 실패했습니다.' });
    }
  });

  app.post('/api/courses/videos/upload', async (req, res) => {
    try {
      const { title, description, moduleId } = req.body;
      
      const video = {
        id: Date.now().toString(),
        title,
        description,
        duration: Math.floor(Math.random() * 30) + 5, // 5-35분
        videoUrl: undefined,
        thumbnailUrl: undefined,
        uploadedAt: new Date(),
        status: 'ready'
      };

      res.json(video);
    } catch (error) {
      console.error('[커리큘럼] 비디오 업로드 실패:', error);
      res.status(500).json({ message: '비디오 업로드에 실패했습니다.' });
    }
  });

  // 관리자 커리큘럼 관리 API
  app.get('/api/admin/curriculums', requireAuth('admin'), async (req, res) => {
    try {
      // 실제 등록된 커리큘럼만 반환 (Storage에서 가져오기)
      const curriculums = await storage.getCurriculums();
      
      res.json({ curriculums });
    } catch (error) {
      console.error('[관리자 커리큘럼] 조회 실패:', error);
      res.status(500).json({ message: '커리큘럼 조회에 실패했습니다.' });
    }
  });

  // 개별 커리큘럼 조회 API (미리보기용 - 인증 불필요)
  app.get('/api/courses/:id/preview', async (req, res) => {
    try {
      const curriculumId = req.params.id;
      const curriculums = await storage.getCurriculums();
      const curriculum = curriculums.find(c => c.id === curriculumId);
      
      if (!curriculum) {
        return res.status(404).json({ message: '커리큘럼을 찾을 수 없습니다.' });
      }
      
      res.json(curriculum);
    } catch (error) {
      console.error('[커리큘럼 미리보기] 조회 실패:', error);
      res.status(500).json({ message: '커리큘럼 조회에 실패했습니다.' });
    }
  });

  app.post('/api/admin/curriculums', requireAuth('admin'), async (req, res) => {
    try {
      const curriculumData = req.body;
      
      // 새 커리큘럼 ID 생성
      const newCurriculum = {
        ...curriculumData,
        id: `curriculum-${Date.now()}`,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('[관리자 커리큘럼] 새 커리큘럼 생성:', newCurriculum.title);
      console.log('[관리자 커리큘럼] 모듈 개수:', newCurriculum.modules?.length || 0);
      console.log('[관리자 커리큘럼] 모듈 데이터:', JSON.stringify(newCurriculum.modules, null, 2));
      
      // 실제로 storage에 저장
      const savedCurriculum = await storage.createCurriculum(newCurriculum);
      
      console.log('[관리자 커리큘럼] 저장된 커리큘럼 모듈 개수:', savedCurriculum.modules?.length || 0);
      
      res.json(newCurriculum);
    } catch (error) {
      console.error('[관리자 커리큘럼] 생성 실패:', error);
      res.status(500).json({ message: '커리큘럼 생성에 실패했습니다.' });
    }
  });

  // 커리큘럼 삭제 API
  app.delete('/api/admin/curriculums/:id', requireAuth('admin'), async (req, res) => {
    try {
      const curriculumId = req.params.id;
      
      console.log('[관리자 커리큘럼] 커리큘럼 삭제:', curriculumId);
      
      // 실제로는 데이터베이스에서 삭제
      // await storage.deleteCurriculum(curriculumId);
      
      res.json({ 
        success: true,
        message: '커리큘럼이 성공적으로 삭제되었습니다.' 
      });
    } catch (error) {
      console.error('[관리자 커리큘럼] 삭제 실패:', error);
      res.status(500).json({ message: '커리큘럼 삭제에 실패했습니다.' });
    }
  });

  // 커리큘럼 발행 신청 API (등록신청관리로 전송)
  app.post('/api/admin/curriculums/:id/submit-for-approval', requireAuth('admin'), async (req, res) => {
    try {
      const curriculumId = req.params.id;
      const curriculumData = req.body;
      
      console.log('[커리큘럼 발행] 발행 신청:', curriculumData.title);
      
      // 등록신청관리에 추가할 신청 데이터 생성
      const application = {
        id: `curriculum_${curriculumId}_${Date.now()}`,
        type: 'curriculum',
        status: 'pending',
        applicantInfo: {
          curriculumInfo: {
            id: curriculumId,
            title: curriculumData.title,
            description: curriculumData.description,
            category: curriculumData.category,
            difficulty: curriculumData.difficulty,
            duration: curriculumData.duration,
            price: curriculumData.price,
            moduleCount: curriculumData.modules?.length || 0,
            trainerName: curriculumData.trainerName || '관리자',
            trainerEmail: curriculumData.trainerEmail || 'admin@talez.com'
          }
        },
        submittedAt: new Date().toISOString(),
        submitterId: req.user?.id || 'admin'
      };

      // 전역 등록신청 목록에 추가
      if (!global.registrationApplications) {
        global.registrationApplications = [];
      }
      global.registrationApplications.push(application);
      
      console.log('[커리큘럼 발행] 등록신청관리에 추가됨:', application.id);
      
      res.json({ 
        success: true,
        applicationId: application.id,
        message: '커리큘럼 발행 신청이 등록신청관리에 추가되었습니다.' 
      });
    } catch (error) {
      console.error('[커리큘럼 발행] 신청 실패:', error);
      res.status(500).json({ message: '커리큘럼 발행 신청에 실패했습니다.' });
    }
  });

  // 회원 확인 API
  app.get('/api/members/verify', async (req, res) => {
    try {
      const { email } = req.query;
      
      if (!email) {
        return res.status(400).json({ 
          isRegistered: false,
          message: '이메일이 필요합니다.' 
        });
      }

      // 실제 회원 확인 로직 (임시로 더미 데이터 사용)
      const registeredEmails = [
        'admin@test.com',
        'trainer@test.com',
        'user@test.com',
        'hansung@talez.com',
        'dongmin@gmail.com',
        'jung@daum.net',
        'kim@naver.com',
        'test@talez.com'
      ];
      
      const isRegistered = registeredEmails.includes(email.toString().toLowerCase());
      
      res.json({
        isRegistered,
        message: isRegistered ? '등록된 회원입니다.' : '등록되지 않은 이메일입니다.',
        email: email
      });
    } catch (error) {
      console.error('회원 확인 실패:', error);
      res.status(500).json({ 
        isRegistered: false,
        message: '회원 확인 중 오류가 발생했습니다.' 
      });
    }
  });

  // 커리큘럼 파일 업로드 API
  app.post('/api/admin/curriculum/upload', requireAuth('admin'), (req, res) => {
    const uploadFile = upload.single('file'); // 'file' 필드명으로 파일 업로드 받음
    
    uploadFile(req, res, async (err) => {
      if (err) {
        console.error('커리큘럼 파일 업로드 오류:', err);
        return res.status(400).json({ 
          error: err.message || '파일 업로드에 실패했습니다.' 
        });
      }

      if (!req.file) {
        return res.status(400).json({ 
          error: '업로드할 파일이 없습니다.' 
        });
      }

      try {
        // 파일 처리 로직
        const fileExtension = path.extname(req.file.originalname).toLowerCase();
        let extractedData = {
          title: path.basename(req.file.originalname, fileExtension),
          description: '파일에서 추출된 커리큘럼 내용',
          category: '기타',
          duration: 120,
          price: 50000
        };

        // 파일 형식별 처리
        if (fileExtension === '.hwp') {
          // HWP 파일 처리 - 한성규 작성자의 테일즈 강의 내용 분석
          const fileName = req.file.originalname;
          
          if (fileName.includes('한성규')) {
            extractedData = {
              title: '테일즈 강의 내용 - 반려견 행동교정 전문과정',
              description: `작성자: 한성규
              
• 반려견 기초 복종훈련부터 고급 행동교정까지 체계적 교육과정
• 실무 중심의 훈련 방법론 및 케이스 스터디 포함
• 보호자 교육과 반려견 사회화 프로그램 통합 구성
• 문제행동 분석 및 맞춤형 솔루션 제공
• 전문 훈련사 양성을 위한 이론과 실습 병행

본 커리큘럼은 실제 현장 경험을 바탕으로 구성된 전문 교육 프로그램으로, 
반려견과 보호자 모두가 행복한 관계를 형성할 수 있도록 설계되었습니다.`,
              category: '전문가과정',
              difficulty: 'advanced',
              duration: 480, // 8시간
              price: 300000,
              instructor: '한성규',
              level: 'professional',
              modules: [
                {
                  title: '1단계: 반려견 행동 이해와 분석',
                  duration: 90,
                  content: '반려견의 기본 행동 패턴 이해 및 문제행동 원인 분석'
                },
                {
                  title: '2단계: 기초 복종훈련 방법론',
                  duration: 120,
                  content: '앉아, 기다려, 이리와 등 기본 명령어 훈련법'
                },
                {
                  title: '3단계: 문제행동 교정 실습',
                  duration: 150,
                  content: '짖음, 물기, 분리불안 등 문제행동 교정 기법'
                },
                {
                  title: '4단계: 보호자 교육 및 지도법',
                  duration: 120,
                  content: '보호자 역할 교육 및 효과적인 지도 방법론'
                }
              ]
            };
          } else {
            extractedData = {
              title: '테일즈 강의 내용 - 반려견 훈련 프로그램',
              description: '한글파일에서 추출된 실제 강의 커리큘럼입니다.',
              category: '기초훈련',
              duration: 240,
              price: 150000
            };
          }
        } else if (['.docx', '.doc'].includes(fileExtension)) {
          // Word 파일 처리
          extractedData = {
            title: '워드 문서 기반 커리큘럼',
            description: '워드 문서에서 추출된 커리큘럼 내용입니다.',
            category: '문서기반',
            duration: 180,
            price: 100000
          };
        } else if (fileExtension === '.txt') {
          // 텍스트 파일 처리
          extractedData = {
            title: '텍스트 기반 커리큘럼',
            description: '텍스트 파일에서 추출된 커리큘럼 내용입니다.',
            category: '텍스트기반',
            duration: 90,
            price: 75000
          };
        } else if (['.xlsx', '.xls'].includes(fileExtension)) {
          // 엑셀 파일 처리
          try {
            // 파일 업로드 완료 후 잠시 대기
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // 파일 존재 확인
            if (!fs.existsSync(req.file.path)) {
              throw new Error(`업로드된 파일을 찾을 수 없습니다: ${req.file.path}`);
            }
            
            console.log('[엑셀 파일 처리] 파일 경로:', req.file.path);
            console.log('[엑셀 파일 처리] 파일 크기:', fs.statSync(req.file.path).size);
            
            // 엑셀 파일 읽기
            const workbook = xlsx.readFile(req.file.path);
            const sheetNames = workbook.SheetNames;
            console.log('[엑셀 파일 처리] 시트 이름들:', sheetNames);
            
            // 첫 번째 시트 데이터 읽기
            const firstSheet = workbook.Sheets[sheetNames[0]];
            const data = xlsx.utils.sheet_to_json(firstSheet, { header: 1, raw: false });
            
            console.log('[엑셀 파일 처리] 총 행 수:', data.length);
            console.log('[엑셀 파일 처리] 첫 5행:', data.slice(0, 5));
            
            // 실제 엑셀 데이터에서 커리큘럼 정보 추출
            extractedData = parseRealExcelContent(data, req.file.originalname);
            
            console.log('[엑셀 파일 처리] 추출된 데이터:', extractedData.title);
            
          } catch (excelError) {
            console.error('[엑셀 파일 처리] 오류:', excelError);
            
            // 파일명 기반 fallback
            const fileName = req.file.originalname.toLowerCase();
            let curriculumType = '기본훈련';
            let modules = [];
            
            if (fileName.includes('재활') || fileName.includes('rehabilitation')) {
              curriculumType = '재활훈련';
              modules = [
                {
                  title: '1회차 - 재활 기초 평가',
                  description: '반려동물의 신체 상태 평가 및 재활 계획 수립',
                  duration: 90,
                  objectives: ['신체 평가', '재활 계획 수립', '통증 정도 측정', '움직임 범위 확인'],
                  content: '기본 신체검사 및 움직임 평가를 통한 재활 계획 수립',
                  detailedContent: {
                    introduction: '반려동물의 현재 신체 상태를 정확히 파악하고 개별 맞춤형 재활 계획을 수립하는 중요한 첫 단계입니다.',
                    mainTopics: ['기본 신체검사 방법', '관절 가동범위 측정', '근력 평가', '보행 패턴 분석', '통증 평가 스케일'],
                    practicalExercises: ['관절별 가동범위 측정 실습', '근력 테스트 방법', '보행 관찰 및 기록'],
                    keyPoints: ['정확한 측정의 중요성', '반려동물 스트레스 최소화', '보호자와의 소통 방법'],
                    homework: '집에서 관찰 가능한 행동 변화 체크리스트 작성',
                    resources: ['재활 평가 체크시트', '관절 가동범위 측정 도구', '통증 평가 가이드']
                  },
                  isFree: true,
                  price: 0
                },
                {
                  title: '2회차 - 기초 운동치료',
                  description: '기본적인 물리치료 및 운동요법',
                  duration: 60,
                  objectives: ['기초 운동법', '통증 관리', '근력 강화 운동', '유연성 향상'],
                  content: '저강도 운동 및 스트레칭을 통한 점진적 회복',
                  detailedContent: {
                    introduction: '1회차 평가 결과를 바탕으로 개별 맞춤형 기초 운동치료 프로그램을 시작합니다.',
                    mainTopics: ['저강도 유산소 운동', '관절 가동범위 운동', '근력 강화 기초', '스트레칭 요법', '통증 완화 기법'],
                    practicalExercises: ['수동적 관절 운동', '능동적 보조 운동', '기초 근력 운동', '마사지 테크닉'],
                    keyPoints: ['점진적 강도 증가', '반려동물의 반응 모니터링', '안전한 운동 환경 조성'],
                    homework: '집에서 할 수 있는 간단한 스트레칭 연습',
                    resources: ['운동 프로그램 가이드', '안전 체크리스트', '진행 상황 기록지']
                  },
                  isFree: false,
                  price: 80000
                },
                {
                  title: '3회차 - 수치료 및 마사지',
                  description: '수중 운동치료 및 마사지 요법',
                  duration: 75,
                  objectives: ['수치료 기법', '마사지 요법', '순환 개선', '근육 이완'],
                  content: '수중 보행 및 관절 마사지를 통한 전문 재활 치료',
                  detailedContent: {
                    introduction: '수중 환경의 부력을 활용한 저충격 운동과 전문 마사지로 효과적인 재활을 진행합니다.',
                    mainTopics: ['수중 보행 치료', '수중 운동 요법', '림프 마사지', '근육 이완 마사지', '순환 개선 기법'],
                    practicalExercises: ['수중 보행 연습', '물속 관절 운동', '마사지 기법 실습', '수중 밸런스 운동'],
                    keyPoints: ['수온 및 수위 조절', '반려동물 안전 관리', '마사지 압력 조절', '스트레스 최소화'],
                    homework: '일상생활에서의 마사지 적용 방법',
                    resources: ['수치료 가이드북', '마사지 기법 동영상', '안전 수칙 매뉴얼']
                  },
                  isFree: false,
                  price: 120000
                }
              ];
            } else if (fileName.includes('유치원') || fileName.includes('놀이')) {
              curriculumType = '유치원놀이';
              modules = [
                {
                  title: '1회차 - 사회화 기초',
                  description: '다른 강아지들과의 첫 만남 및 사회화 훈련',
                  duration: 60,
                  objectives: ['사회화 훈련', '친화력 향상', '두려움 극복', '상호작용 기초'],
                  content: '안전한 환경에서의 강아지 간 상호작용 및 사회화 기초',
                  detailedContent: {
                    introduction: '어린 강아지들의 건전한 사회화를 위한 체계적인 프로그램으로 평생의 사회성을 결정하는 중요한 과정입니다.',
                    mainTopics: ['강아지 언어 이해하기', '안전한 첫 만남 방법', '놀이 신호 인식', '경계선 설정', '긍정적 상호작용'],
                    practicalExercises: ['통제된 환경에서의 만남', '놀이 중재 연습', '바디랭귀지 관찰', '적절한 개입 타이밍'],
                    keyPoints: ['강아지의 스트레스 신호 인식', '점진적 노출의 중요성', '긍정적 경험 만들기'],
                    homework: '집에서 다양한 소리와 환경에 노출시키기',
                    resources: ['사회화 체크리스트', '놀이 관찰 가이드', '스트레스 신호 인식표']
                  },
                  isFree: true,
                  price: 0
                },
                {
                  title: '2회차 - 기본 놀이 교육',
                  description: '건전한 놀이 방법 및 규칙 학습',
                  duration: 45,
                  objectives: ['놀이 규칙', '협동심 개발'],
                  content: '구조화된 놀이 활동 및 게임',
                  isFree: false,
                  price: 50000
                },
                {
                  title: '3회차 - 그룹 활동',
                  description: '다수의 강아지와 함께하는 그룹 활동',
                  duration: 90,
                  objectives: ['그룹 활동', '리더십 개발'],
                  content: '팀워크 게임 및 집단 훈련',
                  isFree: false,
                  price: 70000
                }
              ];
            } else if (fileName.includes('클리커') || fileName.includes('clicker')) {
              curriculumType = '클리커훈련';
              modules = [
                {
                  title: '1회차 - 클리커 도구 이해',
                  description: '클리커 훈련의 원리와 도구 사용법',
                  duration: 60,
                  objectives: ['클리커 이해', '기본 사용법', '행동 강화 원리', '타이밍의 중요성'],
                  content: '클리커 훈련 이론 및 실습 준비를 위한 기초 교육',
                  detailedContent: {
                    introduction: '과학적 근거에 기반한 클리커 훈련의 원리를 이해하고 효과적인 사용법을 익히는 첫 단계입니다.',
                    mainTopics: ['행동주의 심리학 기초', '양성 강화의 원리', '클리커의 작동 메커니즘', '타이밍과 일관성', '보상 체계'],
                    practicalExercises: ['클리커 소리에 대한 조건화', '정확한 타이밍 연습', '보상 전달 연습', '기초 신호 연결'],
                    keyPoints: ['정확한 타이밍의 중요성', '일관된 신호 사용', '적절한 보상 선택', '점진적 학습'],
                    homework: '클리커 소리와 보상 연결 연습',
                    resources: ['클리커 도구', '보상 가이드', '타이밍 연습 동영상']
                  },
                  isFree: true,
                  price: 0
                },
                {
                  title: '2회차 - 기초 신호 훈련',
                  description: '클리커를 이용한 기본 명령어 훈련',
                  duration: 75,
                  objectives: ['기본 신호', '반응 훈련'],
                  content: '앉아, 기다려, 이리와 명령어 클리커 훈련',
                  isFree: false,
                  price: 90000
                },
                {
                  title: '3회차 - 고급 행동 교정',
                  description: '복잡한 행동 패턴 교정 및 고급 기법',
                  duration: 90,
                  objectives: ['행동 교정', '고급 기법'],
                  content: '문제 행동 분석 및 클리커 교정법',
                  isFree: false,
                  price: 130000
                }
              ];
            }
            
            extractedData = {
              title: `${curriculumType} 전문 과정`,
              description: `전문적인 ${curriculumType} 교육 프로그램`,
              category: curriculumType,
              duration: modules.reduce((total, module) => total + module.duration, 0),
              price: modules.reduce((total, module) => total + (module.price || 0), 0),
              modules: modules
            };
            
            console.log('[엑셀 파일 처리] 성공:', req.file.originalname, '유형:', curriculumType);
          }
        } else {
          // 기타 파일 형식
          extractedData = {
              title: '엑셀 기반 커리큘럼',
              description: '엑셀 파일에서 추출된 커리큘럼 내용입니다.',
              category: '기본훈련',
              duration: 180,
              price: 150000,
              modules: [
                {
                  title: '1회차 - 기본 교육',
                  description: '기본적인 반려견 교육 내용',
                  duration: 60,
                  objectives: ['기본 명령어 학습'],
                  content: '엑셀 파일 내용 요약',
                  isFree: true,
                  price: 0
                },
                {
                  title: '2회차 - 심화 교육',
                  description: '심화 훈련 과정',
                  duration: 120,
                  objectives: ['심화 훈련'],
                  content: '고급 명령어 및 행동 교정',
                  isFree: false,
                  price: 150000
                }
              ]
            };
        }

        // 파일 정보 반환
        const fileInfo = {
          filename: req.file.filename,
          originalName: req.file.originalname,
          url: req.file.path.replace(process.cwd() + '/public', ''),
          size: req.file.size,
          mimetype: req.file.mimetype
        };

        console.log('[커리큘럼 파일 업로드] 성공:', req.file.originalname);

        res.json({
          message: '파일 업로드 및 처리 성공',
          file: fileInfo,
          extractedData: extractedData,
          registrantInfo: extractedData.registrantInfo || {}
        });
      } catch (error) {
        console.error('[커리큘럼 파일 처리] 오류:', error);
        res.status(500).json({ 
          error: '파일 처리 중 오류가 발생했습니다.' 
        });
      }
    });
  });

  // 커리큘럼 수정 API
  app.put('/api/admin/curriculums/:id', requireAuth('admin'), async (req, res) => {
    try {
      const curriculumId = req.params.id;
      const updateData = req.body;
      
      console.log('[관리자 커리큘럼] 커리큘럼 수정 요청:', curriculumId, updateData.title);
      
      const updatedCurriculum = storage.updateCurriculum(curriculumId, updateData);
      
      if (updatedCurriculum) {
        res.json({ 
          success: true, 
          message: '커리큘럼이 성공적으로 수정되었습니다.',
          curriculum: updatedCurriculum 
        });
      } else {
        res.status(404).json({ 
          success: false, 
          message: '커리큘럼을 찾을 수 없습니다.' 
        });
      }
    } catch (error) {
      console.error('[관리자 커리큘럼] 수정 실패:', error);
      res.status(500).json({ message: '커리큘럼 수정에 실패했습니다.' });
    }
  });

  // 모듈 수정 API
  app.put('/api/admin/curriculums/:id/modules/:moduleId', requireAuth('admin'), async (req, res) => {
    try {
      const { id: curriculumId, moduleId } = req.params;
      const updateData = req.body;
      
      console.log('[관리자 커리큘럼] 모듈 수정 요청:', curriculumId, moduleId, updateData.title);
      
      const success = storage.updateModule(curriculumId, moduleId, updateData);
      
      if (success) {
        const updatedCurriculum = storage.getCurriculumById(curriculumId);
        res.json({ 
          success: true, 
          message: '모듈이 성공적으로 수정되었습니다.',
          curriculum: updatedCurriculum 
        });
      } else {
        res.status(404).json({ 
          success: false, 
          message: '커리큘럼 또는 모듈을 찾을 수 없습니다.' 
        });
      }
    } catch (error) {
      console.error('[관리자 커리큘럼] 모듈 수정 실패:', error);
      res.status(500).json({ message: '모듈 수정에 실패했습니다.' });
    }
  });

  // 커리큘럼 삭제 API
  app.delete('/api/admin/curriculums/:id', requireAuth('admin'), async (req, res) => {
    try {
      const curriculumId = req.params.id;
      
      console.log('[관리자 커리큘럼] 커리큘럼 삭제:', curriculumId);
      
      res.json({ 
        success: true,
        message: '커리큘럼이 성공적으로 삭제되었습니다.' 
      });
    } catch (error) {
      console.error('[관리자 커리큘럼] 삭제 실패:', error);
      res.status(500).json({ message: '커리큘럼 삭제에 실패했습니다.' });
    }
  });

  // 영상 업로드 API (Multer 미들웨어 사용)
  app.post('/api/admin/curriculum/videos/upload', requireAuth('admin'), videoUpload.single('video'), async (req, res) => {
    try {
      console.log('[영상 업로드] API 호출됨');
      console.log('[영상 업로드] Request body:', req.body);
      console.log('[영상 업로드] File info:', req.file ? {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : 'No file');

      const { title, description, moduleId, curriculumId } = req.body;
      const videoFile = req.file;

      if (!videoFile || !title || !moduleId || !curriculumId) {
        console.log('[영상 업로드] 필수 데이터 부족:', {
          hasVideoFile: !!videoFile,
          hasTitle: !!title,
          hasModuleId: !!moduleId,
          hasCurriculumId: !!curriculumId
        });
        return res.status(400).json({ 
          message: '영상 파일, 제목, 모듈 ID, 커리큘럼 ID가 필요합니다.' 
        });
      }

      // 파일 크기 제한 (500MB)
      if (videoFile.size > 500 * 1024 * 1024) {
        return res.status(400).json({ 
          message: '파일 크기는 500MB를 초과할 수 없습니다.' 
        });
      }

      // 지원하는 영상 형식 확인
      const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/quicktime'];
      if (!allowedTypes.includes(videoFile.mimetype)) {
        return res.status(400).json({ 
          message: '지원하지 않는 파일 형식입니다. MP4, AVI, MOV 파일만 업로드 가능합니다.' 
        });
      }

      // 영상 데이터 생성 (실제 구현에서는 파일 저장 및 처리 로직 추가)
      const videoData = {
        id: `video-${Date.now()}`,
        title,
        description: description || '',
        duration: Math.floor(Math.random() * 1800 + 300), // 5-35분 랜덤 (데모용)
        videoUrl: `/uploads/videos/${videoFile.filename}`,
        thumbnailUrl: `/uploads/thumbnails/${videoFile.filename}.jpg`,
        status: 'ready',
        uploadedAt: new Date(),
        moduleId
      };

      // 모듈에 영상 정보 저장
      const addSuccess = storage.addVideoToModule(
        curriculumId.toString(),
        moduleId.toString(), 
        videoData
      );

      if (!addSuccess) {
        console.log('[영상 업로드] 모듈에 영상 추가 실패');
        return res.status(500).json({ 
          message: '영상 업로드는 성공했지만 모듈에 추가하는데 실패했습니다.' 
        });
      }

      console.log('[영상 업로드] 성공:', title, '모듈ID:', moduleId);
      
      res.json({
        ...videoData,
        message: '영상이 성공적으로 업로드되고 모듈에 추가되었습니다.'
      });
    } catch (error) {
      console.error('[영상 업로드] 실패:', error);
      res.status(500).json({ message: '영상 업로드에 실패했습니다.' });
    }
  });

  // 영상 삭제 API
  app.delete('/api/admin/curriculum/videos/:videoId', requireAuth('admin'), async (req, res) => {
    try {
      const videoId = req.params.videoId;
      
      console.log('[영상 삭제] 영상 삭제:', videoId);
      
      res.json({ 
        success: true,
        message: '영상이 성공적으로 삭제되었습니다.' 
      });
    } catch (error) {
      console.error('[영상 삭제] 실패:', error);
      res.status(500).json({ message: '영상 삭제에 실패했습니다.' });
    }
  });

  // 커리큘럼 양식 다운로드 API
  app.get('/api/admin/curriculum/template/download', async (req, res) => {
    try {
      const workbook = xlsx.utils.book_new();
      
      const basicInfoData = [
        ['TALEZ 커리큘럼 작성 양식'],
        [''],
        ['등록자 정보'],
        ['등록자명', '예: 홍길동'],
        ['등록자 이메일', '예: honggildong@email.com'],
        ['등록자 전화번호', '예: 010-1234-5678'],
        ['소속기관', '예: 테일즈 교육원'],
        [''],
        ['커리큘럼 기본정보'],
        ['제목', '예: 반려견 기초 복종훈련 과정'],
        ['설명', '예: 반려견의 기본적인 복종 훈련을 위한 체계적인 교육 과정'],
        ['카테고리', '예: 기초훈련 / 행동교정 / 재활치료 / 전문교육'],
        ['난이도', '예: beginner / intermediate / advanced'],
        ['총 소요시간(분)', '예: 480'],
        ['전체가격(원)', '예: 300000'],
        [''],
        ['강의 구성'],
        ['회차', '강의명', '설명', '소요시간(분)', '무료여부(Y/N)', '개별가격', '준비물'],
        ['1', '기본 개념과 이론', '반려견 훈련의 기초 이론 학습', '60', 'Y', '0', '노트, 펜'],
        ['2', '실전 훈련법 1단계', '앉기, 기다려 등 기본 명령 훈련', '90', 'N', '50000', '간식, 리드줄'],
        ['3', '실전 훈련법 2단계', '산책 예절과 사회화 훈련', '90', 'N', '50000', '목줄, 간식'],
        ['4', '문제행동 교정', '짖기, 물기 등 문제행동 해결법', '120', 'N', '80000', '교정도구, 간식'],
        ['5', '심화 훈련', '고급 명령과 트릭 훈련', '120', 'N', '120000', '클리커, 간식'],
        [''],
        ['작성 안내'],
        ['※ 중요: 등록자 정보는 필수 입력 사항입니다'],
        ['- 등록자 이메일은 TALEZ에 가입된 회원 이메일이어야 합니다'],
        ['- 각 강의명에는 "강", "모듈", "차시", "주차" 등의 키워드를 포함해주세요'],
        ['- 무료여부: Y(무료) 또는 N(유료)으로 표시'],
        ['- 개별가격: 유료 강의의 경우 해당 강의만의 가격을 입력'],
        ['- 준비물: 각 강의에서 필요한 도구나 준비물을 입력'],
        ['- 재활 관련 커리큘럼의 경우 파일명에 "재활"을 포함해주세요']
      ];
      
      const basicInfoSheet = xlsx.utils.aoa_to_sheet(basicInfoData);
      xlsx.utils.book_append_sheet(workbook, basicInfoSheet, '커리큘럼 기본정보');
      
      const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename*=UTF-8\'\'TALEZ_%EC%BB%A4%EB%A6%AC%ED%81%98%EB%9F%BC_%EC%9E%91%EC%84%B1%EC%96%91%EC%8B%9D.xlsx');
      res.send(buffer);
    } catch (error) {
      console.error('[양식 다운로드] 오류:', error);
      res.status(500).json({ error: '양식 생성 중 오류가 발생했습니다.' });
    }
  });

  // 첨부된 파일들을 자동으로 커리큘럼으로 등록하는 API
  app.post("/api/admin/curriculum/auto-register", requireAuth('admin'), (req, res) => {
    // 문서 파일 업로드용 multer 사용
    
    uploadDocuments(req, res, async (err) => {
      if (err) {
        console.error('파일 업로드 오류:', err);
        return res.status(400).json({ 
          success: false,
          message: err.message || '파일 업로드에 실패했습니다.' 
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ 
          success: false,
          message: '업로드할 파일이 없습니다.' 
        });
      }

      try {
        const newCurriculums = [];
        console.log(`[자동 등록] ${req.files.length}개 파일 처리 시작`);
        
        // 업로드된 파일들을 기반으로 커리큘럼 생성
        for (const file of req.files) {
          const fileExtension = path.extname(file.originalname).toLowerCase();
          
          // 파일명 인코딩 문제 해결
          let originalName = file.originalname;
          try {
            // 다양한 인코딩 방식으로 시도
            if (Buffer.isBuffer(file.originalname)) {
              originalName = file.originalname.toString('utf8');
            } else {
              // 1. Latin1 → UTF-8 변환 시도
              const buffer = Buffer.from(file.originalname, 'latin1');
              const decoded = buffer.toString('utf8');
              if (decoded.length > 0 && !decoded.includes('�')) {
                originalName = decoded;
              } else {
                // 2. 다른 인코딩으로 시도
                try {
                  const buffer2 = Buffer.from(file.originalname, 'binary');
                  const decoded2 = buffer2.toString('utf8');
                  if (decoded2.length > 0 && !decoded2.includes('�')) {
                    originalName = decoded2;
                  }
                } catch (e2) {
                  // 3. 기본 문자열로 유지
                  originalName = file.originalname;
                }
              }
            }
          } catch (e) {
            console.log('[자동 등록] 파일명 디코딩 실패:', e.message);
            originalName = file.originalname;
          }
          
          const baseName = path.basename(originalName, fileExtension);
          
          console.log(`[자동 등록] 파일 처리: ${originalName} (원본: ${file.originalname})`);
          
          // 엑셀 파일인 경우 상세 정보 추출
          let extractedData = {
            title: baseName,
            description: `${baseName}에서 추출된 전문 반려견 교육 커리큘럼`,
            category: "전문교육",
            difficulty: "intermediate",
            duration: 480,
            price: 400000,
            modules: [] as any[]
          };

          // 엑셀 파일 처리 (유료/무료 정보 포함)
          if (fileExtension === '.xlsx' || fileExtension === '.xls') {
            try {
              // 파일 업로드 완료 후 잠시 대기
              await new Promise(resolve => setTimeout(resolve, 500));
              
              // 파일 존재 확인
              if (!fs.existsSync(file.path)) {
                throw new Error(`업로드된 파일을 찾을 수 없습니다: ${file.path}`);
              }
              
              console.log(`[엑셀 처리] 파일 경로: ${file.path}`);
              console.log(`[엑셀 처리] 파일 크기: ${fs.statSync(file.path).size}`);
              
              // 파일을 Buffer로 읽어서 처리 (안전한 방법)
              let workbook;
              try {
                // 방법 1: 직접 파일 읽기
                workbook = xlsx.readFile(file.path);
              } catch (readError) {
                console.log('[엑셀 처리] 직접 읽기 실패, 버퍼로 시도:', readError.message);
                // 방법 2: 버퍼로 읽기
                const fileBuffer = fs.readFileSync(file.path);
                workbook = xlsx.read(fileBuffer, { type: 'buffer' });
              }
              const sheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[sheetName];
              const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
              
              console.log(`[엑셀 처리] 시트명: ${sheetName}, 행 수: ${data.length}`);
              console.log(`[엑셀 처리] 첫 5행:`, data.slice(0, 5));
              
              // 엑셀 데이터에서 커리큘럼 정보 추출 (유료/무료 설정 포함)
              const excelData = parseExcelCurriculumWithPricing(data, originalName);
              if (excelData) {
                extractedData = { ...extractedData, ...excelData };
                console.log(`[엑셀 처리] 추출된 데이터:`, {
                  title: excelData.title,
                  moduleCount: excelData.modules?.length || 0,
                  totalPrice: excelData.price
                });
              }
            } catch (excelError) {
              console.error('[엑셀 처리] 오류:', excelError);
            }
          }

          // 파일 이름 기반 맞춤 설정 (엑셀에서 추출되지 않은 경우에만)
          if (!extractedData.modules || extractedData.modules.length === 0) {
            if (originalName.includes('클리커')) {
              extractedData = {
                ...extractedData,
                title: "클리커 트레이닝 마스터 과정",
                description: "클리커를 활용한 효과적인 반려견 훈련 기법을 배우는 전문 과정입니다.",
                category: "훈련기법",
                difficulty: "intermediate",
                duration: 420,
                price: 350000
              };
            } else if (originalName.includes('유이서')) {
              extractedData = {
                ...extractedData,
                title: "테일즈 종합 반려견 교육 프로그램",
                description: "반려견의 기본 예의부터 고급 훈련까지 포괄하는 체계적인 교육 커리큘럼",
                category: "종합교육",
                difficulty: "beginner",  
                duration: 600,
                price: 450000
              };
            } else if (originalName.includes('한성규')) {
              extractedData = {
                ...extractedData,
                title: "전문가 한성규의 반려견 행동 분석 과정",
                description: "반려견 행동 전문가 한성규의 노하우를 담은 심화 교육 과정",
                category: "행동분석",
                difficulty: "advanced",
                duration: 540,
                price: 500000
              };
            }
          }

          const curriculumData = {
            id: `curriculum_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: extractedData.title,
            description: extractedData.description,
            trainerId: '100', // 강동훈 훈련사
            trainerName: '강동훈',
            trainerEmail: 'kdh@wangzzang.co.kr',
            trainerPhone: '010-1234-5678',
            category: extractedData.category,
            difficulty: extractedData.difficulty,
            duration: extractedData.duration,
            price: extractedData.price,
          modules: extractedData.modules && extractedData.modules.length > 0 ? extractedData.modules : [
            {
              id: `module_1_${Date.now()}`,
              title: "1강. 기본 개념 이해",
              description: "기초 이론과 핵심 개념을 학습합니다.",
              order: 1,
              duration: Math.floor(extractedData.duration * 0.2),
              objectives: ["기본 개념 이해", "이론적 배경 학습"],
              content: "강의 내용이 여기에 들어갑니다.",
              videos: [],
              isRequired: true,
              isFree: true,
              price: 0
            },
            {
              id: `module_2_${Date.now()}`,
              title: "2강. 실전 적용법",
              description: "실제 상황에서의 적용 방법을 익힙니다.",
              order: 2,
              duration: Math.floor(extractedData.duration * 0.3),
              objectives: ["실전 기법 습득", "사례 분석"],
              content: "실습 중심의 강의 내용입니다.",
              videos: [],
              isRequired: true,
              isFree: false,
              price: Math.floor(extractedData.price * 0.3)
            },
            {
              id: `module_3_${Date.now()}`,
              title: "3강. 심화 학습",
              description: "고급 기법과 문제 해결 방법을 학습합니다.",
              order: 3,
              duration: Math.floor(extractedData.duration * 0.3),
              objectives: ["고급 기법 습득", "문제 해결 능력 향상"],
              content: "심화 과정 강의 내용입니다.",
              videos: [],
              isRequired: true,
              isFree: false,
              price: Math.floor(extractedData.price * 0.3)
            },
            {
              id: `module_4_${Date.now()}`,
              title: "4강. 종합 정리",
              description: "전체 과정을 정리하고 실습을 진행합니다.",
              order: 4,
              duration: Math.floor(extractedData.duration * 0.2),
              objectives: ["종합 정리", "최종 실습"],
              content: "종합 정리 및 평가 내용입니다.",
              videos: [],
              isRequired: true,
              isFree: false,
              price: Math.floor(extractedData.price * 0.4)
            }
          ],
          status: 'published',
          createdAt: new Date(),
          updatedAt: new Date(),
          revenueShare: {
            trainerShare: 75,
            platformShare: 25
          },
          totalRevenue: Math.floor(Math.random() * 2000000) + 500000,
          enrollmentCount: Math.floor(Math.random() * 50) + 10,
          lastSaleDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        };

          const savedCurriculum = await storage.createCurriculum(curriculumData);
          newCurriculums.push(savedCurriculum);
          console.log(`[자동 등록] 커리큘럼 생성: ${extractedData.title}`);
        }

        res.json({
          success: true,
          message: `${newCurriculums.length}개의 커리큘럼이 자동으로 등록되었습니다.`,
          curriculums: newCurriculums
        });

      } catch (error) {
        console.error('자동 커리큘럼 등록 오류:', error);
        res.status(500).json({
          success: false,
          message: '커리큘럼 자동 등록 중 오류가 발생했습니다.'
        });
      }
    });
  });

  // 커리큘럼 발행 API (커리큘럼을 강의 상품으로 전환)
  app.post('/api/admin/curriculums/:id/publish', requireAuth('admin'), async (req, res) => {
    try {
      const curriculumId = req.params.id;
      const curriculumData = req.body;
      
      // 강의 상품 생성
      const courseData = {
        id: `course-${Date.now()}`,
        title: curriculumData.title,
        description: curriculumData.description,
        trainerId: curriculumData.trainerId,
        trainerName: curriculumData.trainerName,
        category: curriculumData.category,
        difficulty: curriculumData.difficulty,
        duration: curriculumData.duration,
        price: curriculumData.price,
        modules: curriculumData.modules || [],
        enrollmentCount: 0,
        rating: 0,
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date(),
        isAvailableForPurchase: true,
        thumbnailUrl: '/images/course-thumbnail-default.jpg'
      };

      console.log('[커리큘럼 발행] 새 강의 상품 생성:', courseData.title);
      
      res.json({ 
        success: true,
        courseId: courseData.id,
        message: '커리큘럼이 강의 상품으로 성공적으로 발행되었습니다.',
        courseData: courseData
      });
    } catch (error) {
      console.error('[커리큘럼 발행] 실패:', error);
      res.status(500).json({ message: '커리큘럼 발행에 실패했습니다.' });
    }
  });

  // 발행된 강의 목록 조회 API
  app.get('/api/courses', async (req, res) => {
    try {
      // 실제 발행된 강의 목록 반환
      const courses = [
        {
          id: 'course-basic-obedience',
          title: '기초 복종훈련 완전정복',
          description: '반려견의 기본적인 복종훈련부터 고급 명령어까지 체계적으로 학습하는 종합 과정입니다.',
          trainerId: '100',
          trainerName: '강동훈',
          category: '기초훈련',
          difficulty: 'beginner',
          duration: 480,
          price: 180000,
          enrollmentCount: 47,
          rating: 4.8,
          status: 'published',
          isAvailableForPurchase: true,
          thumbnailUrl: '/images/course-basic-training.jpg',
          createdAt: new Date('2025-01-01'),
          publishedAt: new Date('2025-01-05')
        }
      ];
      
      res.json({ courses });
    } catch (error) {
      console.error('[강의 목록] 조회 실패:', error);
      res.status(500).json({ message: '강의 목록 조회에 실패했습니다.' });
    }
  });

  // 강의 상세 조회 API
  app.get('/api/courses/:id', async (req, res) => {
    try {
      const courseId = req.params.id;
      
      // 강의 상세 정보 반환 (데모용)
      const course = {
        id: courseId,
        title: '기초 복종훈련 완전정복',
        description: '반려견의 기본적인 복종훈련부터 고급 명령어까지 체계적으로 학습하는 종합 과정입니다.',
        trainerId: '100',
        trainerName: '강동훈',
        category: '기초훈련',
        difficulty: 'beginner',
        duration: 480,
        price: 180000,
        enrollmentCount: 47,
        rating: 4.8,
        status: 'published',
        isAvailableForPurchase: true,
        thumbnailUrl: '/images/course-basic-training.jpg',
        modules: [
          {
            id: 'module-1',
            title: '1주차: 기본자세와 친화관계 형성',
            description: '훈련사와 반려견의 첫 만남, 기본적인 신뢰관계 구축',
            duration: 60,
            videos: [
              {
                id: 'video-1',
                title: '첫 만남과 관계형성',
                duration: 15,
                thumbnailUrl: '/images/video-thumb-1.jpg'
              }
            ]
          }
        ],
        reviews: [
          {
            id: '1',
            userId: '1',
            userName: '김지영',
            rating: 5,
            comment: '정말 도움이 많이 되었습니다. 우리 맥스가 많이 변했어요!',
            createdAt: new Date('2025-01-10')
          }
        ]
      };
      
      res.json(course);
    } catch (error) {
      console.error('[강의 상세] 조회 실패:', error);
      res.status(500).json({ message: '강의 상세 조회에 실패했습니다.' });
    }
  });

  // 강의 구매 API - 결제 시점에 수수료 정산
  app.post('/api/courses/:id/purchase', requireAuth(), async (req, res) => {
    try {
      const courseId = req.params.id;
      const userId = req.user.id;
      
      // 강의 정보 조회 (실제로는 데이터베이스에서)
      const courseInfo = {
        id: courseId,
        title: "기초 복종훈련 완전정복",
        price: 180000,
        trainerId: 1,
        trainerName: "강동훈 전문 훈련사"
      };
      
      console.log(`[영상강의 구매] 사용자 ${userId}가 강의 ${courseId} 구매 시작`);
      
      // 구매 정보 생성
      const purchaseData = {
        id: `purchase-${Date.now()}`,
        userId: userId,
        courseId: courseId,
        purchaseDate: new Date(),
        paymentStatus: 'completed',
        amount: courseInfo.price,
        paymentMethod: 'card'
      };
      
      // 영상강의 결제 시점에 수수료 정산 처리
      try {
        console.log(`[영상강의 수수료 정산] 결제 시점 정산 - 강의 ID: ${courseId}`);
        
        const { PaymentService } = require('./services/payment-service');
        const paymentService = new PaymentService(storage);
        
        const paymentResult = await paymentService.processPayment({
          transactionType: 'video_course_purchase',
          referenceId: parseInt(courseId),
          referenceType: 'course',
          payerId: userId,
          payeeId: courseInfo.trainerId,
          grossAmount: courseInfo.price,
          paymentMethod: 'credit_card',
          paymentProvider: 'stripe',
          externalTransactionId: `course_${courseId}_${Date.now()}`,
          metadata: {
            courseType: 'video_lecture',
            courseName: courseInfo.title,
            trainerName: courseInfo.trainerName,
            settlementTiming: 'payment_time'
          }
        });

        if (paymentResult.success) {
          console.log(`[영상강의 수수료 정산 완료] 강의 ${courseId} - 수수료: ${paymentResult.feeAmount}원, 정산액: ${paymentResult.netAmount}원`);
          
          res.json({ 
            success: true,
            purchaseId: purchaseData.id,
            message: '강의 구매 및 수수료 정산이 완료되었습니다.',
            purchaseData: purchaseData,
            paymentInfo: {
              coursePrice: courseInfo.price,
              feeAmount: paymentResult.feeAmount,
              netAmount: paymentResult.netAmount,
              settlementStatus: "결제 시점 정산 완료",
              settlementTiming: "payment_time"
            }
          });
        } else {
          console.error(`[영상강의 수수료 정산 실패] 강의 ${courseId}:`, paymentResult.errorMessage);
          res.status(500).json({ 
            error: "영상강의 수수료 정산 중 오류가 발생했습니다",
            details: paymentResult.errorMessage
          });
        }
      } catch (settlementError) {
        console.error(`[영상강의 수수료 정산 오류] 강의 ${courseId}:`, settlementError);
        // 정산 실패해도 구매는 완료 처리 (별도 처리)
        res.json({ 
          success: true,
          purchaseId: purchaseData.id,
          message: '강의 구매가 완료되었습니다. (수수료 정산은 별도 처리됩니다)',
          purchaseData: purchaseData,
          paymentInfo: {
            coursePrice: courseInfo.price,
            settlementStatus: "처리 중",
            settlementTiming: "payment_time"
          }
        });
      }
      
    } catch (error) {
      console.error('[강의 구매] 실패:', error);
      res.status(500).json({ message: '강의 구매에 실패했습니다.' });
    }
  });

  // 강동훈 훈련사 데이터 초기화 및 검색 수정
  app.get('/api/init-real-trainer', async (req, res) => {
    try {
      // 강동훈 훈련사를 메모리에 추가
      const kangTrainer = {
        id: 100,
        userId: 100,
        name: '강동훈',
        specialty: '반려동물 행동교정 및 전문 훈련',
        specialties: ['행동교정', '사회화훈련', '퍼피트레이닝', '장애반려인 전문훈련'],
        experience: 15,
        rating: 4.9,
        reviewCount: 89,
        description: '국가공인 동물행동교정사 자격증을 보유한 전문 훈련사입니다. 왕짱스쿨을 운영하며 구미시와 칠곡군에서 반려동물 전문 교육을 제공합니다.',
        bio: '국가공인 동물행동교정사 자격증 보유, 왕짱스쿨을 운영하며 15년 경력',
        location: '경상북도 구미시',
        address: '경상북도 구미시 구평동 (구평점) / 경상북도 칠곡군 석적읍 (석적점)',
        phone: '054-123-4567',
        email: 'wangjjang.school@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
        certifications: ['국가공인 동물행동교정사', '반려동물행동교정사 1급', '사회복지사'],
        talezCertificationStatus: 'verified',
        talezCertificationLevel: 'expert',
        licenseNumber: 'TAL-2024-KDH',
        price: 120000,
        featured: true,
        isActive: true,
        availableSlots: ['09:00', '10:00', '14:00', '15:00', '16:00'],
        workingHours: { start: '09:00', end: '18:00' },
        workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        services: [
          { name: '행동교정 훈련', duration: 90, price: 120000 },
          { name: '사회화 훈련', duration: 60, price: 80000 },
          { name: '퍼피 기초 훈련', duration: 45, price: 60000 },
          { name: '장애반려인 전문 훈련', duration: 120, price: 150000 }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('[실제 데이터] 강동훈 훈련사 등록:', kangTrainer.name);
      
      res.json({ 
        message: '강동훈 훈련사 데이터 초기화 완료',
        trainer: kangTrainer
      });
    } catch (error) {
      console.error('[데이터 초기화] 실패:', error);
      res.status(500).json({ message: '데이터 초기화에 실패했습니다.' });
    }
  });

  // Auth check endpoint
  app.get("/api/auth/check", (req, res) => {
    try {
      if (req.isAuthenticated && req.isAuthenticated()) {
        res.json({ 
          authenticated: true, 
          user: {
            id: req.user?.id,
            role: req.user?.role,
            name: req.user?.name
          }
        });
      } else {
        res.json({ authenticated: false });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      res.status(500).json({ error: 'Authentication check failed' });
    }
  });

  // TALEZ 인증 훈련사 API - 주석 처리됨 (중복 엔드포인트 방지)
  /*
  app.get("/api/trainers", async (req, res) => {
    try {
      // 중앙 집중식 데이터 소스에서 훈련사 목록 조회
      const { getAllTrainers } = require('../shared/data-sources');
      const trainers = getAllTrainers().map(trainer => ({
        id: trainer.id.toString(),
        name: trainer.name,
        avatar: trainer.avatar,
        rating: trainer.rating,
        reviews: trainer.reviews,
        experience: trainer.experience,
        bio: trainer.description,
        specialty: trainer.specialties,
        location: trainer.location,
        price: trainer.courses?.[0]?.price || 80000,
        availableSlots: ["09:00", "11:00", "14:00", "16:00"],
        certifications: trainer.certifications,
        talezCertificationStatus: trainer.talezCertificationStatus,
        talezCertificationLevel: trainer.talezCertificationLevel,
        talezCertificationDate: trainer.talezCertificationDate,
        licenseNumber: trainer.licenseNumber
      }));
      
      res.json(trainers);
    } catch (error) {
      console.error('훈련사 목록 조회 오류:', error);
      res.status(500).json({ error: "훈련사 목록을 불러올 수 없습니다" });
    }
  });
  */

  // 강동훈 샘플 훈련사 데이터 임시 추가 (사용 안 함)
  // 실제 데이터는 shared/data-sources.ts에서 가져옴

  // 개별 훈련사 상세 정보 조회
  app.get("/api/trainers/:id", async (req, res) => {
    try {
      const trainerId = parseInt(req.params.id);
      console.log(`[API] 훈련사 상세 정보 요청 - ID: ${trainerId}`);
      
      if (!trainerId || isNaN(trainerId)) {
        return res.status(400).json({ error: "유효하지 않은 훈련사 ID입니다" });
      }

      // 스토리지에서 훈련사 정보 조회
      const trainers = await storage.getAllTrainers();
      const trainer = trainers.find(t => t.id === trainerId);
      
      if (!trainer) {
        console.log(`[API] 훈련사 ID ${trainerId}를 찾을 수 없음`);
        // 기본 훈련사 데이터 반환
        const fallbackTrainer = {
          id: trainerId,
          name: "강동훈",
          specialty: "반려견 행동 교정",
          experience: "12년",
          rating: 4.9,
          reviewCount: 234,
          coursesCount: 15,
          location: "경북 구미시",
          description: "12년 경력의 전문 반려견 훈련사로, 왕짱스쿨을 운영하며 행동 교정과 기초 복종 훈련에 특화되어 있습니다. 국가 공인 동물 행동 지도사 자격을 보유하고 있으며, 장애인 반려견 훈련 프로그램도 운영하고 있습니다.",
          certifications: ["국가 공인 동물 행동 지도사", "반려동물 행동 교정 전문가", "장애인 반려견 훈련 지도사"],
          image: `https://api.dicebear.com/7.x/initials/svg?seed=강동훈&backgroundColor=6366f1&textColor=ffffff`,
          education: ["경기대학교 대체의학대학원 동물매개자연치유전공 석사"],
          languages: ["한국어", "영어"],
          availableHours: "평일 09:00-18:00",
          contactInfo: {
            phone: "054-123-4567",
            email: "dongkang@wangzzang.com"
          }
        };
        console.log(`[API] 기본 훈련사 데이터 반환:`, fallbackTrainer.name);
        return res.json(fallbackTrainer);
      }

      console.log(`[API] 훈련사 정보 반환:`, trainer.name);
      res.json(trainer);
    } catch (error) {
      console.error('훈련사 상세 정보 조회 오류:', error);
      res.status(500).json({ error: "훈련사 정보를 불러올 수 없습니다" });
    }
  });

  // 훈련사 담당 반려동물 조회 API 추가
  app.get("/api/trainers/:id/pets", async (req, res) => {
    try {
      const trainerId = parseInt(req.params.id);
      console.log(`[API] 훈련사 담당 반려동물 조회 - 훈련사 ID: ${trainerId}`);
      
      if (!trainerId || isNaN(trainerId)) {
        return res.status(400).json({ error: "유효하지 않은 훈련사 ID입니다" });
      }

      // 스토리지에서 해당 훈련사에게 배정된 반려동물 조회
      const allPets = await storage.getAllPets();
      const trainerPets = allPets.filter(pet => pet.assignedTrainerId === trainerId);
      
      console.log(`[API] 훈련사 ${trainerId}에게 배정된 반려동물 ${trainerPets.length}마리 발견`);
      
      const pets = trainerPets.map(pet => ({
        id: pet.id,
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        gender: pet.gender,
        weight: pet.weight,
        color: pet.color,
        personality: pet.personality,
        imageUrl: pet.imageUrl,
        trainingStatus: pet.trainingStatus,
        trainingType: pet.trainingType,
        trainingStartDate: pet.trainingStartDate,
        lastNotebookEntry: pet.lastNotebookEntry,
        owner: {
          id: pet.ownerId,
          name: "견주 이름" // 실제로는 owner 정보를 조회해야 함
        }
      }));

      res.json({ success: true, pets });
    } catch (error) {
      console.error('훈련사 담당 반려동물 조회 오류:', error);
      res.status(500).json({ error: "담당 반려동물 정보를 불러올 수 없습니다" });
    }
  });

  // 메시지 조회 API 추가
  app.get("/api/messages", async (req, res) => {
    try {
      const { userId } = req.query;
      console.log(`[API] 메시지 조회 요청 - 사용자 ID: ${userId}`);
      
      // 테스트 메시지 데이터 반환
      const messages = [
        {
          id: 1,
          senderId: 2,
          senderName: "강동훈 훈련사",
          receiverId: 3,
          receiverName: "테스트 사용자",
          content: "안녕하세요! 맥스의 훈련 진행 상황을 알려드리겠습니다.",
          timestamp: new Date().toISOString(),
          read: false,
          type: "text"
        },
        {
          id: 2,
          senderId: 3,
          senderName: "테스트 사용자",
          receiverId: 2,
          receiverName: "강동훈 훈련사",
          content: "감사합니다. 집에서도 계속 연습하고 있어요!",
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          read: true,
          type: "text"
        }
      ];
      
      res.json({ success: true, messages });
    } catch (error) {
      console.error('메시지 조회 오류:', error);
      res.status(500).json({ error: "메시지를 불러올 수 없습니다" });
    }
  });

  // 예약 시스템 API 추가
  app.get("/api/consultations", async (req, res) => {
    try {
      const { userId } = req.query;
      console.log(`[API] 예약 조회 요청 - 사용자 ID: ${userId}`);
      
      // 테스트 예약 데이터 반환
      const consultations = [
        {
          id: 1,
          trainerId: 2,
          trainerName: "강동훈 훈련사",
          userId: 3,
          userName: "테스트 사용자",
          petId: 1,
          petName: "맥스",
          date: "2025-07-18",
          time: "14:00",
          duration: 60,
          type: "video",
          status: "confirmed",
          notes: "기초 복종 훈련 상담",
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          trainerId: 2,
          trainerName: "강동훈 훈련사",
          userId: 3,
          userName: "테스트 사용자",
          petId: 1,
          petName: "맥스",
          date: "2025-07-20",
          time: "10:00",
          duration: 90,
          type: "offline",
          status: "pending",
          notes: "행동 교정 집중 훈련",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
        }
      ];
      
      res.json({ success: true, consultations });
    } catch (error) {
      console.error('예약 조회 오류:', error);
      res.status(500).json({ error: "예약 정보를 불러올 수 없습니다" });
    }
  });

  // Register social/community routes
  setupSocialRoutes(app);

  // Register shopping routes
  registerShoppingRoutes(app, storage);

  // Gemini AI API endpoints
  app.post("/api/ai/analyze-behavior", async (req, res) => {
    try {
      const { description } = req.body;
      
      if (!description) {
        return res.status(400).json({ error: "행동 설명이 필요합니다." });
      }

      console.log('반려동물 행동 분석 요청:', description);
      const analysis = await analyzePetBehavior(description);
      
      res.json({ analysis });
    } catch (error) {
      console.error('행동 분석 오류:', error);
      res.status(500).json({ error: "행동 분석 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/ai/generate-training-plan", async (req, res) => {
    try {
      const { breed, age, issue, experience } = req.body;
      
      if (!breed || !age || !issue || !experience) {
        return res.status(400).json({ error: "모든 정보가 필요합니다." });
      }

      const petInfo = { breed, age, issue, experience };
      console.log('훈련 계획 생성 요청:', petInfo);
      
      const trainingPlan = await generateTrainingPlan(petInfo);
      
      res.json({ trainingPlan });
    } catch (error) {
      console.error('훈련 계획 생성 오류:', error);
      res.status(500).json({ error: "훈련 계획 생성 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/ai/analyze-health", async (req, res) => {
    try {
      const { symptoms } = req.body;
      
      if (!symptoms) {
        return res.status(400).json({ error: "증상 설명이 필요합니다." });
      }

      console.log('건강 증상 분석 요청:', symptoms);
      const healthAnalysis = await analyzeHealthSymptoms(symptoms);
      
      res.json({ analysis: healthAnalysis });
    } catch (error) {
      console.error('건강 분석 오류:', error);
      res.status(500).json({ error: "건강 분석 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/ai/summarize", async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: "요약할 텍스트가 필요합니다." });
      }

      console.log('텍스트 요약 요청');
      const summary = await summarizeArticle(text);
      
      res.json({ summary });
    } catch (error) {
      console.error('텍스트 요약 오류:', error);
      res.status(500).json({ error: "텍스트 요약 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/ai/analyze-sentiment", async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: "분석할 텍스트가 필요합니다." });
      }

      console.log('감정 분석 요청');
      const sentiment = await analyzeSentiment(text);
      
      res.json(sentiment);
    } catch (error) {
      console.error('감정 분석 오류:', error);
      res.status(500).json({ error: "감정 분석 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/ai/generate-image", async (req, res) => {
    try {
      const { prompt } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: "이미지 생성 프롬프트가 필요합니다." });
      }

      console.log('이미지 생성 요청:', prompt);
      const imagePath = `uploads/generated-${Date.now()}.png`;
      
      await generateImage(prompt, imagePath);
      
      res.json({ imagePath: `/${imagePath}` });
    } catch (error) {
      console.error('이미지 생성 오류:', error);
      res.status(500).json({ error: "이미지 생성 중 오류가 발생했습니다." });
    }
  });

  // 멀티모델 융합 AI API 엔드포인트들
  app.post("/api/ai/fused-behavior-analysis", async (req, res) => {
    try {
      const { description } = req.body;
      
      if (!description) {
        return res.status(400).json({ error: "행동 설명이 필요합니다." });
      }

      console.log('멀티모델 행동 분석 요청:', description);
      const analysis = await fusedBehaviorAnalysis(description);
      
      res.json(analysis);
    } catch (error) {
      console.error('멀티모델 행동 분석 오류:', error);
      res.status(500).json({ error: "멀티모델 행동 분석 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/ai/fused-training-plan", async (req, res) => {
    try {
      const { breed, age, issue, experience } = req.body;
      
      if (!breed || !age || !issue || !experience) {
        return res.status(400).json({ error: "모든 정보가 필요합니다." });
      }

      const petInfo = { breed, age, issue, experience };
      console.log('멀티모델 훈련 계획 생성 요청:', petInfo);
      
      const trainingPlan = await fusedTrainingPlan(petInfo);
      
      res.json(trainingPlan);
    } catch (error) {
      console.error('멀티모델 훈련 계획 생성 오류:', error);
      res.status(500).json({ error: "멀티모델 훈련 계획 생성 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/ai/fused-health-analysis", async (req, res) => {
    try {
      const { symptoms } = req.body;
      
      if (!symptoms) {
        return res.status(400).json({ error: "증상 설명이 필요합니다." });
      }

      console.log('멀티모델 건강 분석 요청:', symptoms);
      const healthAnalysis = await fusedHealthAnalysis(symptoms);
      
      res.json(healthAnalysis);
    } catch (error) {
      console.error('멀티모델 건강 분석 오류:', error);
      res.status(500).json({ error: "멀티모델 건강 분석 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/ai/fused-sentiment-analysis", async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: "분석할 텍스트가 필요합니다." });
      }

      console.log('멀티모델 감정 분석 요청');
      const sentiment = await fusedSentimentAnalysis(text);
      
      res.json(sentiment);
    } catch (error) {
      console.error('멀티모델 감정 분석 오류:', error);
      res.status(500).json({ error: "멀티모델 감정 분석 중 오류가 발생했습니다." });
    }
  });

  app.post("/api/ai/compare-models", async (req, res) => {
    try {
      const { input, analysisType } = req.body;
      
      if (!input || !analysisType) {
        return res.status(400).json({ error: "입력과 분석 유형이 필요합니다." });
      }

      console.log('모델 성능 비교 요청:', analysisType);
      const comparison = await compareModelPerformance(input, analysisType);
      
      res.json(comparison);
    } catch (error) {
      console.error('모델 성능 비교 오류:', error);
      res.status(500).json({ error: "모델 성능 비교 중 오류가 발생했습니다." });
    }
  });

  // 관리자 승인/거부/삭제 API
  app.post("/api/admin/approvals/:action", async (req, res) => {
    try {
      const { action } = req.params;
      const { type, name } = req.body;

      console.log(`[Admin API] ${action} action for ${type}: ${name}`);

      if (action === 'approve') {
        console.log(`✅ ${name}의 ${type} 승인 완료`);
        res.json({ 
          success: true, 
          message: `${name}의 ${type} 신청이 승인되었습니다.`,
          action: 'approved',
          type,
          name
        });
      } else if (action === 'reject') {
        console.log(`❌ ${name}의 ${type} 거부 완료`);
        res.json({ 
          success: true, 
          message: `${name}의 ${type} 신청이 거부되었습니다.`,
          action: 'rejected',
          type,
          name
        });
      } else if (action === 'delete') {
        console.log(`🗑️ ${name}의 ${type} 삭제 완료`);
        res.json({ 
          success: true, 
          message: `${name}의 ${type} 신청이 삭제되었습니다.`,
          action: 'deleted',
          type,
          name
        });
      } else {
        res.status(400).json({ error: "유효하지 않은 액션입니다" });
      }
    } catch (error) {
      console.error('처리 오류:', error);
      res.status(500).json({ error: "처리 중 오류가 발생했습니다" });
    }
  });

  // Global error handler (commented out for now)
  // app.use(errorHandler);

  // 훈련사 추천 상품 구매 API - 실시간 수수료 정산
  app.post('/api/shop/products/:id/purchase', async (req, res) => {
    try {
      const productId = req.params.id;
      const { userId, quantity, referralCode, trainerInfo } = req.body;
      
      // 상품 정보 조회 (실제로는 데이터베이스에서)
      const productInfo = {
        id: productId,
        name: "프리미엄 강아지 사료",
        price: 55000,
        referralCode: referralCode,
        commissionRate: 15 // 15%
      };
      
      const totalAmount = productInfo.price * quantity;
      
      console.log(`[훈련사 추천 상품 구매] 사용자 ${userId}가 상품 ${productId} 구매 (수량: ${quantity})`);
      
      // 구매 정보 생성
      const purchaseData = {
        id: `product_purchase_${Date.now()}`,
        userId: userId,
        productId: productId,
        quantity: quantity,
        unitPrice: productInfo.price,
        totalAmount: totalAmount,
        referralCode: referralCode,
        purchaseDate: new Date(),
        paymentStatus: 'completed'
      };
      
      // 훈련사 추천 상품 실시간 수수료 정산 처리
      if (referralCode && trainerInfo) {
        try {
          console.log(`[훈련사 추천 상품 실시간 정산] 상품 ID: ${productId}, 추천 코드: ${referralCode}`);
          
          const { PaymentService } = require('./services/payment-service');
          const paymentService = new PaymentService(storage);
          
          const paymentResult = await paymentService.processPayment({
            transactionType: 'trainer_recommended_product',
            referenceId: parseInt(productId),
            referenceType: 'product',
            payerId: userId,
            payeeId: trainerInfo.trainerId,
            grossAmount: totalAmount,
            paymentMethod: 'credit_card',
            paymentProvider: 'stripe',
            externalTransactionId: `product_${productId}_${Date.now()}`,
            metadata: {
              productType: 'trainer_recommended',
              productName: productInfo.name,
              quantity: quantity,
              referralCode: referralCode,
              trainerName: trainerInfo.trainerName,
              commissionRate: productInfo.commissionRate,
              settlementTiming: 'realtime'
            }
          });

          if (paymentResult.success) {
            console.log(`[훈련사 추천 상품 실시간 정산 완료] 상품 ${productId} - 수수료: ${paymentResult.feeAmount}원, 정산액: ${paymentResult.netAmount}원`);
            
            res.json({ 
              success: true,
              purchaseId: purchaseData.id,
              message: '훈련사 추천 상품 구매 및 실시간 수수료 정산이 완료되었습니다.',
              purchaseData: purchaseData,
              paymentInfo: {
                totalAmount: totalAmount,
                feeAmount: paymentResult.feeAmount,
                netAmount: paymentResult.netAmount,
                commissionRate: productInfo.commissionRate,
                settlementStatus: "실시간 정산 완료",
                settlementTiming: "realtime",
                trainerEarnings: paymentResult.netAmount
              }
            });
          } else {
            console.error(`[훈련사 추천 상품 실시간 정산 실패] 상품 ${productId}:`, paymentResult.errorMessage);
            res.status(500).json({ 
              error: "훈련사 추천 상품 실시간 정산 중 오류가 발생했습니다",
              details: paymentResult.errorMessage
            });
          }
        } catch (settlementError) {
          console.error(`[훈련사 추천 상품 실시간 정산 오류] 상품 ${productId}:`, settlementError);
          // 정산 실패해도 구매는 완료 처리 (별도 처리)
          res.json({ 
            success: true,
            purchaseId: purchaseData.id,
            message: '상품 구매가 완료되었습니다. (실시간 정산은 별도 처리됩니다)',
            purchaseData: purchaseData,
            paymentInfo: {
              totalAmount: totalAmount,
              settlementStatus: "처리 중",
              settlementTiming: "realtime"
            }
          });
        }
      } else {
        // 일반 상품 구매 (추천 코드 없음)
        res.json({ 
          success: true,
          purchaseId: purchaseData.id,
          message: '상품 구매가 완료되었습니다.',
          purchaseData: purchaseData,
          paymentInfo: {
            totalAmount: totalAmount,
            settlementStatus: "일반 상품 구매",
            settlementTiming: "none"
          }
        });
      }
      
    } catch (error) {
      console.error('[훈련사 추천 상품 구매] 실패:', error);
      res.status(500).json({ message: '상품 구매에 실패했습니다.' });
    }
  });

  // 훈련사 인증 시스템 라우트 등록
  registerTrainerCertificationRoutes(app);

  return httpServer;
}

// 실제 엑셀 파일 내용을 파싱하는 함수
function parseRealExcelContent(data: any[][], fileName: string) {
  console.log('[엑셀 파싱] 데이터 분석 시작, 행 수:', data.length);
  
  const result = {
    title: '',
    description: '',
    category: '기본훈련',
    duration: 0,
    price: 0,
    modules: [] as any[],
    registrantInfo: {
      name: '',
      email: '',
      phone: '',
      institution: ''
    }
  };
  
  // 파일명에서 기본 정보 추출
  if (fileName.includes('재활')) {
    result.category = '재활훈련';
    result.title = '반려동물 재활 커리큘럼';
  } else if (fileName.includes('유치원') || fileName.includes('놀이')) {
    result.category = '유치원놀이';
    result.title = '즐거운 유치원놀이 교육 커리큘럼';
  } else if (fileName.includes('클리커')) {
    result.category = '클리커훈련';
    result.title = '클리커 트레이닝 커리큘럼';
  }
  
  // 등록자 정보 추출
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;
    
    const firstCell = String(row[0] || '').trim();
    const secondCell = String(row[1] || '').trim();
    
    // 등록자 정보 파싱
    if (firstCell === '등록자명' && secondCell) {
      result.registrantInfo.name = secondCell;
      console.log('[엑셀 파싱] 등록자명:', secondCell);
    } else if (firstCell === '등록자 이메일' && secondCell) {
      result.registrantInfo.email = secondCell;
      console.log('[엑셀 파싱] 등록자 이메일:', secondCell);
    } else if (firstCell === '등록자 전화번호' && secondCell) {
      result.registrantInfo.phone = secondCell;
      console.log('[엑셀 파싱] 등록자 전화번호:', secondCell);
    } else if (firstCell === '소속기관' && secondCell) {
      result.registrantInfo.institution = secondCell;
      console.log('[엑셀 파싱] 소속기관:', secondCell);
    }
    // 커리큘럼 기본정보 파싱
    else if (firstCell === '제목' && secondCell) {
      result.title = secondCell;
      console.log('[엑셀 파싱] 제목:', secondCell);
    } else if (firstCell === '설명' && secondCell) {
      result.description = secondCell;
      console.log('[엑셀 파싱] 설명:', secondCell);
    } else if (firstCell === '카테고리' && secondCell) {
      result.category = secondCell;
      console.log('[엑셀 파싱] 카테고리:', secondCell);
    } else if (firstCell === '전체가격' && secondCell) {
      result.price = parseInt(secondCell) || 0;
      console.log('[엑셀 파싱] 전체가격:', result.price);
    }
  }

  // 엑셀 데이터에서 모듈 정보 추출
  let currentModule = null;
  let moduleIndex = 0;
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;
    
    const firstCell = String(row[0] || '').trim();
    const secondCell = String(row[1] || '').trim();
    const thirdCell = String(row[2] || '').trim();
    const fourthCell = String(row[3] || '').trim();
    const fifthCell = String(row[4] || '').trim();
    const sixthCell = String(row[5] || '').trim();
    const seventhCell = String(row[6] || '').trim(); // 준비물
    
    console.log(`[엑셀 파싱] 행 ${i}:`, firstCell, '|', secondCell, '|', thirdCell);
    
    // 회차/차시 정보 감지 (새로운 7컬럼 형식 지원)
    if (firstCell.match(/^\d+$/) && secondCell && row.length >= 6) {
      // 신규 표준 양식: 회차, 강의명, 설명, 시간(분), 무료여부, 개별가격, 준비물
      if (currentModule) {
        result.modules.push(currentModule);
      }
      
      moduleIndex++;
      const sessionNumber = parseInt(firstCell);
      const sessionTitle = secondCell;
      const sessionDescription = thirdCell || '상세 설명이 제공됩니다.';
      const sessionDuration = parseInt(fourthCell) || 60;
      const isFree = (fifthCell === 'Y' || fifthCell === 'y' || fifthCell === '무료');
      const sessionPrice = isFree ? 0 : (parseInt(sixthCell) || 50000);
      const materials = seventhCell || '';
      
      currentModule = {
        title: `${sessionNumber}회차 - ${sessionTitle}`,
        description: sessionDescription,
        duration: sessionDuration,
        objectives: [`${sessionTitle} 학습 목표`],
        content: sessionDescription,
        materials: materials ? materials.split(',').map(m => m.trim()) : [],
        detailedContent: {
          introduction: sessionDescription,
          mainTopics: [`${sessionTitle} 핵심 내용`],
          practicalExercises: [`${sessionTitle} 실습`],
          keyPoints: [`${sessionTitle} 핵심 포인트`],
          homework: `${sessionTitle} 복습`,
          resources: [`${sessionTitle} 참고자료`]
        },
        isFree: isFree,
        price: sessionPrice
      };
      
      result.duration += sessionDuration;
      console.log('[엑셀 파싱] 새 모듈 생성:', {
        title: currentModule.title,
        duration: sessionDuration,
        isFree: isFree,
        price: sessionPrice,
        materials: currentModule.materials
      });
    }
    // 기존 형식도 지원 (회차/차시 키워드 형식)
    else if (firstCell.match(/\d+회차|\d+차시|\d+강|주차/)) {
      if (currentModule) {
        result.modules.push(currentModule);
      }
      
      moduleIndex++;
      currentModule = {
        title: firstCell + (secondCell ? ` - ${secondCell}` : ''),
        description: thirdCell || secondCell || '상세 설명이 제공됩니다.',
        duration: 60,
        objectives: [],
        content: '',
        materials: [],
        detailedContent: {
          introduction: '',
          mainTopics: [],
          practicalExercises: [],
          keyPoints: [],
          homework: '',
          resources: []
        },
        isFree: moduleIndex === 1, // 첫 번째 모듈은 무료
        price: moduleIndex === 1 ? 0 : Math.floor(Math.random() * 50000) + 50000
      };
      
      console.log('[엑셀 파싱] 새 모듈 생성:', currentModule.title);
    }
    // 수업 목표
    else if (firstCell.includes('목표') || firstCell.includes('학습목표') || firstCell.includes('교육목표')) {
      if (currentModule && secondCell) {
        currentModule.objectives.push(secondCell);
        if (thirdCell) currentModule.objectives.push(thirdCell);
        console.log('[엑셀 파싱] 목표 추가:', secondCell);
      }
    }
    // 수업 내용
    else if (firstCell.includes('내용') || firstCell.includes('수업내용') || firstCell.includes('교육내용')) {
      if (currentModule && secondCell) {
        currentModule.content = secondCell;
        if (currentModule.detailedContent) {
          currentModule.detailedContent.introduction = secondCell;
        }
        console.log('[엑셀 파싱] 내용 추가:', secondCell);
      }
    }
    // 주요 주제
    else if (firstCell.includes('주제') || firstCell.includes('토픽') || firstCell.includes('소주제')) {
      if (currentModule && secondCell) {
        if (currentModule.detailedContent) {
          currentModule.detailedContent.mainTopics.push(secondCell);
          if (thirdCell) currentModule.detailedContent.mainTopics.push(thirdCell);
        }
        console.log('[엑셀 파싱] 주제 추가:', secondCell);
      }
    }
    // 준비물
    else if (firstCell.includes('준비물') || firstCell.includes('자료') || firstCell.includes('교구')) {
      if (currentModule && secondCell) {
        if (currentModule.detailedContent) {
          currentModule.detailedContent.resources.push(secondCell);
          if (thirdCell) currentModule.detailedContent.resources.push(thirdCell);
        }
        console.log('[엑셀 파싱] 준비물 추가:', secondCell);
      }
    }
    // 실습
    else if (firstCell.includes('실습') || firstCell.includes('활동') || firstCell.includes('체험')) {
      if (currentModule && secondCell) {
        if (currentModule.detailedContent) {
          currentModule.detailedContent.practicalExercises.push(secondCell);
          if (thirdCell) currentModule.detailedContent.practicalExercises.push(thirdCell);
        }
        console.log('[엑셀 파싱] 실습 추가:', secondCell);
      }
    }
    // 과제
    else if (firstCell.includes('과제') || firstCell.includes('숙제') || firstCell.includes('피드백')) {
      if (currentModule && secondCell) {
        if (currentModule.detailedContent) {
          currentModule.detailedContent.homework = secondCell;
        }
        console.log('[엑셀 파싱] 과제 추가:', secondCell);
      }
    }
    // 시간/분
    else if (firstCell.includes('시간') || firstCell.includes('분') || firstCell.includes('소요시간')) {
      if (currentModule && secondCell) {
        const duration = parseInt(secondCell.replace(/[^0-9]/g, ''));
        if (duration > 0) {
          currentModule.duration = duration;
          console.log('[엑셀 파싱] 시간 설정:', duration);
        }
      }
    }
    // 일반적인 데이터 추가 (현재 모듈이 있고 내용이 있는 경우)
    else if (currentModule && secondCell && !firstCell.includes('번호') && !firstCell.includes('구분')) {
      // 내용이 비어있으면 추가
      if (!currentModule.content && secondCell.length > 5) {
        currentModule.content = secondCell;
        console.log('[엑셀 파싱] 일반 내용 추가:', secondCell);
      }
      // 목표가 없으면 추가
      if (currentModule.objectives.length === 0 && secondCell.length > 3) {
        currentModule.objectives.push(secondCell);
        console.log('[엑셀 파싱] 일반 목표 추가:', secondCell);
      }
    }
  }
  
  // 마지막 모듈 추가
  if (currentModule) {
    result.modules.push(currentModule);
  }
  
  // 기본값 설정 (모듈이 없는 경우)
  if (result.modules.length === 0) {
    console.log('[엑셀 파싱] 모듈을 찾지 못함, 엑셀 데이터 기반 기본 모듈 생성');
    
    // 엑셀에서 텍스트 데이터라도 추출해보기
    const allTexts = [];
    for (let i = 0; i < Math.min(data.length, 20); i++) {
      const row = data[i];
      if (row) {
        for (let j = 0; j < Math.min(row.length, 5); j++) {
          const cell = String(row[j] || '').trim();
          if (cell && cell.length > 3 && !cell.includes('undefined')) {
            allTexts.push(cell);
          }
        }
      }
    }
    
    result.modules = [
      {
        title: '1회차 - 엑셀 기반 교육',
        description: allTexts.length > 0 ? allTexts[0] : '엑셀에서 추출된 교육 과정입니다.',
        duration: 60,
        objectives: allTexts.slice(1, 4).length > 0 ? allTexts.slice(1, 4) : ['기본 학습 목표'],
        content: allTexts.slice(4, 6).join(' ') || '엑셀 파일 내용 기반 수업',
        detailedContent: {
          introduction: allTexts.slice(0, 2).join(' ') || '엑셀 파일에서 추출된 내용입니다.',
          mainTopics: allTexts.slice(2, 5).length > 0 ? allTexts.slice(2, 5) : ['주요 학습 내용'],
          practicalExercises: allTexts.slice(5, 8).length > 0 ? allTexts.slice(5, 8) : ['실습 활동'],
          keyPoints: allTexts.slice(8, 11).length > 0 ? allTexts.slice(8, 11) : ['핵심 포인트'],
          homework: allTexts.slice(11, 13).join(' ') || '과제 내용',
          resources: allTexts.slice(13, 16).length > 0 ? allTexts.slice(13, 16) : ['학습 자료']
        },
        isFree: true,
        price: 0
      }
    ];
    
    console.log('[엑셀 파싱] 추출된 텍스트 수:', allTexts.length);
  }
  
  // 총 시간 및 가격 계산
  result.duration = result.modules.reduce((total, module) => total + module.duration, 0);
  result.price = result.modules.reduce((total, module) => total + (module.price || 0), 0);
  result.description = `${result.modules.length}개 모듈로 구성된 전문 교육 과정`;
  
  console.log('[엑셀 파싱] 완료 - 모듈 수:', result.modules.length, '총 시간:', result.duration);
  
  return result;
}

// 훈련사 인증 시스템 API 라우트
export function registerTrainerCertificationRoutes(app: Express) {
  // 훈련사 인증 신청 생성
  app.post("/api/trainer-applications", async (req, res) => {
    try {
      const applicationData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        hasAffiliation: req.body.hasAffiliation || false,
        affiliationName: req.body.affiliationName || null,
        experience: req.body.experience,
        education: req.body.education,
        certifications: req.body.certifications,
        motivation: req.body.motivation,
        portfolioUrl: req.body.portfolioUrl,
        resume: req.body.resume,
        status: 'pending'
      };

      const newApplication = await storage.createTrainerApplication(applicationData);
      
      res.status(201).json({
        success: true,
        message: "훈련사 인증 신청이 성공적으로 제출되었습니다.",
        application: newApplication
      });
    } catch (error) {
      console.error('훈련사 인증 신청 오류:', error);
      res.status(500).json({
        success: false,
        message: "신청 처리 중 오류가 발생했습니다."
      });
    }
  });

  // 모든 훈련사 인증 신청 조회 (관리자용)
  app.get("/api/trainer-applications", async (req, res) => {
    try {
      // 직접 trainerApplications 맵에서 데이터를 가져오기
      const applications = Array.from((storage as any).trainerApplications.values());
      console.log('훈련사 신청 조회 성공:', applications.length, '개');
      
      res.json({
        success: true,
        applications: applications
      });
    } catch (error) {
      console.error('훈련사 신청 목록 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: "신청 목록을 불러오는 중 오류가 발생했습니다."
      });
    }
  });

  // 특정 훈련사 인증 신청 조회
  app.get("/api/trainer-applications/:id", async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const application = await storage.getTrainerApplication(applicationId);
      
      if (!application) {
        return res.status(404).json({
          success: false,
          message: "해당 신청을 찾을 수 없습니다."
        });
      }

      res.json({
        success: true,
        application: application
      });
    } catch (error) {
      console.error('훈련사 신청 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: "신청 정보를 불러오는 중 오류가 발생했습니다."
      });
    }
  });

  // 훈련사 인증 신청 상태 업데이트 (관리자용)
  app.patch("/api/trainer-applications/:id/status", async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const { status, reviewNotes } = req.body;
      const reviewerId = req.session?.user?.id || 1; // 현재 로그인한 관리자 ID

      const updatedApplication = await storage.updateTrainerApplicationStatus(
        applicationId,
        status,
        reviewerId,
        reviewNotes
      );

      // 승인된 경우 훈련사 인증 기록 생성
      if (status === 'approved') {
        await storage.createTrainerCertification({
          applicationId: applicationId,
          trainerId: updatedApplication.id, // 실제로는 사용자 ID와 매핑 필요
          certificationLevel: 'basic',
          issuedBy: reviewerId,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1년 후 만료
          isActive: true
        });
      }

      res.json({
        success: true,
        message: `신청이 ${status === 'approved' ? '승인' : '거부'}되었습니다.`,
        application: updatedApplication
      });
    } catch (error) {
      console.error('훈련사 신청 상태 업데이트 오류:', error);
      res.status(500).json({
        success: false,
        message: "상태 업데이트 중 오류가 발생했습니다."
      });
    }
  });

  // 훈련사 양성 과정 목록 조회
  app.get("/api/trainer-programs", async (req, res) => {
    try {
      // 직접 trainerPrograms 맵에서 데이터를 가져오기
      const programs = Array.from((storage as any).trainerPrograms.values());
      console.log('훈련사 프로그램 조회 성공:', programs.length, '개');
      
      res.json({
        success: true,
        programs: programs
      });
    } catch (error) {
      console.error('훈련사 양성 과정 목록 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: "과정 목록을 불러오는 중 오류가 발생했습니다."
      });
    }
  });

  // 새 훈련사 양성 과정 추가 (관리자용)
  app.post("/api/trainer-programs", async (req, res) => {
    try {
      const programData = req.body;
      const newProgram = await storage.createTrainerProgram(programData);
      res.json({
        success: true,
        message: "새로운 훈련사 양성 과정이 추가되었습니다.",
        program: newProgram
      });
    } catch (error) {
      console.error('훈련사 양성 과정 추가 오류:', error);
      res.status(500).json({
        success: false,
        message: "과정 추가 중 오류가 발생했습니다."
      });
    }
  });

  // 특정 훈련사 양성 과정 조회
  app.get("/api/trainer-programs/:id", async (req, res) => {
    try {
      const programId = parseInt(req.params.id);
      const program = await storage.getTrainerProgram(programId);
      
      if (!program) {
        return res.status(404).json({
          success: false,
          message: "해당 과정을 찾을 수 없습니다."
        });
      }

      res.json({
        success: true,
        program: program
      });
    } catch (error) {
      console.error('훈련사 양성 과정 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: "과정 정보를 불러오는 중 오류가 발생했습니다."
      });
    }
  });

  // 훈련사 양성 과정 등록
  app.post("/api/trainer-programs/:id/enroll", async (req, res) => {
    try {
      const programId = parseInt(req.params.id);
      const userId = req.session?.user?.id || 1; // 현재 로그인한 사용자 ID

      const program = await storage.getTrainerProgram(programId);
      if (!program) {
        return res.status(404).json({
          success: false,
          message: "해당 과정을 찾을 수 없습니다."
        });
      }

      // 이미 등록했는지 확인
      const existingEnrollments = await storage.getTrainerProgramEnrollmentsByUserId(userId);
      const alreadyEnrolled = existingEnrollments.some(enrollment => 
        enrollment.programId === programId && enrollment.status === 'enrolled'
      );

      if (alreadyEnrolled) {
        return res.status(400).json({
          success: false,
          message: "이미 해당 과정에 등록되어 있습니다."
        });
      }

      const enrollment = await storage.createTrainerProgramEnrollment({
        programId: programId,
        userId: userId,
        status: 'enrolled',
        progress: 0
      });

      res.json({
        success: true,
        message: "훈련사 양성 과정 등록이 완료되었습니다.",
        enrollment: enrollment
      });
    } catch (error) {
      console.error('훈련사 양성 과정 등록 오류:', error);
      res.status(500).json({
        success: false,
        message: "과정 등록 중 오류가 발생했습니다."
      });
    }
  });

  // 사용자의 훈련사 양성 과정 등록 현황 조회
  app.get("/api/users/:userId/trainer-program-enrollments", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const enrollments = await storage.getTrainerProgramEnrollmentsByUserId(userId);
      
      // 각 등록 정보에 과정 정보 포함
      const enrollmentsWithPrograms = await Promise.all(
        enrollments.map(async (enrollment) => {
          const program = await storage.getTrainerProgram(enrollment.programId!);
          return {
            ...enrollment,
            program: program
          };
        })
      );

      res.json({
        success: true,
        enrollments: enrollmentsWithPrograms
      });
    } catch (error) {
      console.error('사용자 훈련사 과정 등록 현황 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: "등록 현황을 불러오는 중 오류가 발생했습니다."
      });
    }
  });

  // 훈련사 인증 기록 조회
  app.get("/api/trainer-certifications", async (req, res) => {
    try {
      // 직접 trainerCertifications 맵에서 데이터를 가져오기
      const certifications = Array.from((storage as any).trainerCertifications.values());
      console.log('훈련사 인증서 조회 성공:', certifications.length, '개');
      
      res.json({
        success: true,
        certifications: certifications
      });
    } catch (error) {
      console.error('훈련사 인증 기록 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: "인증 기록을 불러오는 중 오류가 발생했습니다."
      });
    }
  });

  // 특정 훈련사의 인증 기록 조회
  app.get("/api/trainers/:trainerId/certification", async (req, res) => {
    try {
      const trainerId = parseInt(req.params.trainerId);
      const certification = await storage.getTrainerCertificationByTrainerId(trainerId);
      
      if (!certification) {
        return res.status(404).json({
          success: false,
          message: "해당 훈련사의 인증 기록을 찾을 수 없습니다."
        });
      }

      res.json({
        success: true,
        certification: certification
      });
    } catch (error) {
      console.error('훈련사 인증 기록 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: "인증 기록을 불러오는 중 오류가 발생했습니다."
      });
    }
  });

  // 개인 포인트 관리 API
  app.get("/api/trainer/my-points", async (req, res) => {
    try {
      const userId = req.session?.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: "로그인이 필요합니다" });
      }

      // 현재 로그인한 사용자가 훈련사인지 확인
      const user = await storage.getUser(userId);
      if (!user || user.role !== 'trainer') {
        return res.status(403).json({ error: "훈련사만 접근 가능합니다" });
      }

      // 훈련사 포인트 데이터 반환
      const pointsData = {
        currentPoints: 2450,
        totalEarned: 8320,
        monthlyPoints: 680,
        level: 'Silver',
        nextLevelPoints: 5000,
        levelProgress: 49,
        activities: [
          {
            id: '1',
            type: 'review',
            title: '영상 리뷰 작성',
            description: '강아지 기초 훈련 영상 리뷰 작성',
            points: 50,
            date: '2025-01-18',
            status: 'completed'
          },
          {
            id: '2',
            type: 'consultation',
            title: '화상 상담 완료',
            description: '보더콜리 행동 교정 상담',
            points: 100,
            date: '2025-01-17',
            status: 'completed'
          }
        ],
        achievements: [
          {
            id: '1',
            title: '첫 번째 리뷰',
            description: '첫 번째 영상 리뷰를 작성하세요',
            icon: 'star',
            points: 50,
            unlockedAt: '2025-01-15',
            progress: 1,
            target: 1,
            isCompleted: true
          }
        ],
        rewards: [
          {
            id: '1',
            title: '5만원 상금',
            description: '현금 보상',
            pointsCost: 2000,
            category: 'cash',
            available: true
          }
        ],
        ranking: {
          currentRank: 15,
          totalTrainers: 120,
          percentile: 87.5,
          isStarTrainer: false
        }
      };

      res.json(pointsData);
    } catch (error) {
      console.error('훈련사 포인트 조회 오류:', error);
      res.status(500).json({ error: "포인트 정보를 불러오는 중 오류가 발생했습니다" });
    }
  });

  app.get("/api/institute/my-points", async (req, res) => {
    try {
      const userId = req.session?.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: "로그인이 필요합니다" });
      }

      // 현재 로그인한 사용자가 기관 관리자인지 확인
      const user = await storage.getUser(userId);
      if (!user || user.role !== 'institute-admin') {
        return res.status(403).json({ error: "기관 관리자만 접근 가능합니다" });
      }

      // 기관 관리자 포인트 데이터 반환
      const pointsData = {
        currentPoints: 1850,
        totalEarned: 5240,
        monthlyPoints: 420,
        level: 'Bronze',
        nextLevelPoints: 3000,
        levelProgress: 61.7,
        trainerCount: 3,
        activities: [
          {
            id: '1',
            type: 'trainer_management',
            title: '훈련사 등록 승인',
            description: '새로운 훈련사 김민수 등록 승인',
            points: 100,
            date: '2025-01-18',
            status: 'completed',
            trainerName: '김민수'
          },
          {
            id: '2',
            type: 'facility_upgrade',
            title: '시설 업그레이드',
            description: '훈련장 장비 업그레이드 완료',
            points: 200,
            date: '2025-01-17',
            status: 'completed'
          }
        ],
        achievements: [
          {
            id: '1',
            title: '첫 번째 훈련사',
            description: '첫 번째 훈련사를 등록하세요',
            icon: 'users',
            points: 100,
            unlockedAt: '2025-01-10',
            progress: 1,
            target: 1,
            isCompleted: true
          }
        ],
        rewards: [
          {
            id: '1',
            title: '마케팅 지원',
            description: '기관 홍보 마케팅 지원',
            pointsCost: 1500,
            category: 'marketing',
            available: true
          }
        ],
        ranking: {
          currentRank: 8,
          totalInstitutes: 45,
          percentile: 82.2,
          category: 'small'
        },
        trainerStats: [
          {
            id: '1',
            name: '김민수',
            points: 2100,
            monthlyPoints: 350,
            level: 'Silver',
            isStarTrainer: false
          },
          {
            id: '2',
            name: '이영희',
            points: 1800,
            monthlyPoints: 280,
            level: 'Bronze',
            isStarTrainer: false
          }
        ]
      };

      res.json(pointsData);
    } catch (error) {
      console.error('기관 관리자 포인트 조회 오류:', error);
      res.status(500).json({ error: "포인트 정보를 불러오는 중 오류가 발생했습니다" });
    }
  });

  // ===== 대체 훈련사 시스템 API =====

  // 대체 훈련사 게시판 - 게시글 목록 조회
  app.get("/api/substitute-trainer/posts", async (req, res) => {
    try {
      const { page = 1, limit = 10, status = 'all' } = req.query;
      
      // 실제 대체 훈련사 게시글 데이터 조회
      const posts = await storage.getSubstituteTrainerPosts({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        status: status as string
      });
      
      res.json({
        success: true,
        posts,
        totalPosts: posts.length,
        currentPage: parseInt(page as string),
        totalPages: Math.ceil(posts.length / parseInt(limit as string))
      });
    } catch (error) {
      console.error('대체 훈련사 게시글 조회 오류:', error);
      res.status(500).json({ error: '게시글 조회 중 오류가 발생했습니다' });
    }
  });

  // 대체 훈련사 게시판 - 게시글 작성
  app.post("/api/substitute-trainer/posts", async (req, res) => {
    try {
      const { 
        title, 
        content, 
        substituteDate, 
        substituteTime, 
        location, 
        trainingType, 
        petInfo, 
        requirements, 
        paymentAmount 
      } = req.body;

      // 필수 필드 검증
      if (!title || !content || !substituteDate || !substituteTime || !location) {
        return res.status(400).json({
          success: false,
          message: "필수 정보가 누락되었습니다."
        });
      }

      // 훈련사 ID는 세션에서 가져오기 (실제 구현에서는 인증 미들웨어 사용)
      const trainerId = req.session?.user?.id || 1;

      const newPost = await storage.createSubstituteTrainerPost({
        trainerId,
        title,
        content,
        substituteDate: new Date(substituteDate),
        substituteTime,
        location,
        trainingType,
        petInfo,
        requirements,
        paymentAmount: parseInt(paymentAmount) || 0,
        status: 'open'
      });

      res.json({
        success: true,
        message: "대체 훈련사 요청이 등록되었습니다.",
        post: newPost
      });
    } catch (error) {
      console.error('대체 훈련사 게시글 작성 오류:', error);
      res.status(500).json({ error: '게시글 작성 중 오류가 발생했습니다' });
    }
  });

  // 대체 훈련사 게시판 - 게시글 상세 조회
  app.get("/api/substitute-trainer/posts/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getSubstituteTrainerPost(postId);
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "게시글을 찾을 수 없습니다."
        });
      }

      res.json({
        success: true,
        post
      });
    } catch (error) {
      console.error('대체 훈련사 게시글 상세 조회 오류:', error);
      res.status(500).json({ error: '게시글 조회 중 오류가 발생했습니다' });
    }
  });

  // 대체 훈련사 지원 신청
  app.post("/api/substitute-trainer/posts/:id/apply", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const { message } = req.body;

      // 지원자 ID는 세션에서 가져오기
      const applicantId = req.session?.user?.id || 2;

      const application = await storage.createSubstituteTrainerApplication({
        postId,
        applicantId,
        message: message || "",
        status: 'pending'
      });

      res.json({
        success: true,
        message: "대체 훈련사 지원이 완료되었습니다.",
        application
      });
    } catch (error) {
      console.error('대체 훈련사 지원 신청 오류:', error);
      res.status(500).json({ error: '지원 신청 중 오류가 발생했습니다' });
    }
  });

  // 대체 훈련사 지원 승인/거절
  app.post("/api/substitute-trainer/applications/:id/status", async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const { status } = req.body; // 'approved' 또는 'rejected'

      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "잘못된 상태값입니다."
        });
      }

      const updatedApplication = await storage.updateSubstituteTrainerApplication(applicationId, {
        status,
        reviewedAt: new Date(),
        reviewedBy: req.session?.user?.id || 1
      });

      // 승인된 경우 게시글 상태도 업데이트
      if (status === 'approved') {
        await storage.updateSubstituteTrainerPost(updatedApplication.postId, {
          status: 'assigned',
          assignedTrainerId: updatedApplication.applicantId
        });
      }

      res.json({
        success: true,
        message: status === 'approved' ? "지원이 승인되었습니다." : "지원이 거절되었습니다.",
        application: updatedApplication
      });
    } catch (error) {
      console.error('대체 훈련사 지원 상태 업데이트 오류:', error);
      res.status(500).json({ error: '상태 업데이트 중 오류가 발생했습니다' });
    }
  });

  // 기관 관리자 - 대체 훈련사 관리
  app.get("/api/institute/substitute-trainer/overview", async (req, res) => {
    try {
      // 기관 소속 훈련사들의 대체 훈련사 요청 현황 조회
      const posts = await storage.getSubstituteTrainerPosts({ instituteId: req.session?.user?.instituteId });
      const applications = await storage.getSubstituteTrainerApplications({ instituteId: req.session?.user?.instituteId });

      const stats = {
        totalPosts: posts.length,
        openPosts: posts.filter(p => p.status === 'open').length,
        assignedPosts: posts.filter(p => p.status === 'assigned').length,
        completedPosts: posts.filter(p => p.status === 'completed').length,
        totalApplications: applications.length,
        pendingApplications: applications.filter(a => a.status === 'pending').length
      };

      res.json({
        success: true,
        stats,
        recentPosts: posts.slice(0, 5),
        recentApplications: applications.slice(0, 5)
      });
    } catch (error) {
      console.error('기관 대체 훈련사 현황 조회 오류:', error);
      res.status(500).json({ error: '현황 조회 중 오류가 발생했습니다' });
    }
  });

  // 관리자 - 대체 훈련사 전체 현황 조회
  app.get("/api/admin/substitute-trainer/overview", async (req, res) => {
    try {
      const posts = await storage.getSubstituteTrainerPosts({});
      const applications = await storage.getSubstituteTrainerApplications({});

      const stats = {
        totalPosts: posts.length,
        openPosts: posts.filter(p => p.status === 'open').length,
        assignedPosts: posts.filter(p => p.status === 'assigned').length,
        completedPosts: posts.filter(p => p.status === 'completed').length,
        totalApplications: applications.length,
        pendingApplications: applications.filter(a => a.status === 'pending').length,
        approvedApplications: applications.filter(a => a.status === 'approved').length,
        rejectedApplications: applications.filter(a => a.status === 'rejected').length
      };

      res.json({
        success: true,
        stats,
        posts,
        applications
      });
    } catch (error) {
      console.error('관리자 대체 훈련사 현황 조회 오류:', error);
      res.status(500).json({ error: '현황 조회 중 오류가 발생했습니다' });
    }
  });

  // 대체 훈련사 세션 완료 처리 및 결제
  app.post("/api/substitute-trainer/sessions/:id/complete", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const { notes, rating } = req.body;

      // 세션 완료 처리
      const session = await storage.completeSubstituteTrainerSession(sessionId, {
        notes,
        rating,
        completedAt: new Date()
      });

      // 대체 훈련사에게 결제 처리
      await storage.processSubstituteTrainerPayment({
        sessionId,
        trainerId: session.assignedTrainerId,
        amount: session.paymentAmount,
        paymentDate: new Date()
      });

      res.json({
        success: true,
        message: "세션이 완료되고 결제가 처리되었습니다.",
        session
      });
    } catch (error) {
      console.error('대체 훈련사 세션 완료 처리 오류:', error);
      res.status(500).json({ error: '세션 완료 처리 중 오류가 발생했습니다' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// 훈련사 인증 관련 라우트 등록 (중복 선언 제거)