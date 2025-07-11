import express from 'express';
import cors from 'cors';
import { db } from './server/db';
import { products, shopCategories } from './shared/schema';
import { eq } from 'drizzle-orm';
import path from 'path';

const app = express();
const PORT = 8080;

// CORS 설정
app.use(cors({
  origin: ['http://localhost:5000', 'https://store.funnytalez.com', 'https://funnytalez.com'],
  credentials: true
}));

app.use(express.json());

// 기본 API 로그 미들웨어
app.use('/api', (req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

// 상품 목록 API
app.get('/api/products', async (req, res) => {
  try {
    const { limit = 10, offset = 0, category, search } = req.query;
    
    let query = db.select().from(products).where(eq(products.is_active, true));
    
    const result = await query.limit(Number(limit)).offset(Number(offset));
    
    res.json({
      success: true,
      products: result,
      total: result.length,
      page: Math.floor(Number(offset) / Number(limit)) + 1,
      totalPages: Math.ceil(result.length / Number(limit))
    });
  } catch (error) {
    console.error('상품 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '상품 목록을 불러오는 중 오류가 발생했습니다.',
      details: error.message
    });
  }
});

// 상품 상세 API
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.select().from(products)
      .where(eq(products.id, Number(id)))
      .limit(1);
    
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        error: '상품을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      product: result[0]
    });
  } catch (error) {
    console.error('상품 상세 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '상품 정보를 불러오는 중 오류가 발생했습니다.',
      details: error.message
    });
  }
});

// 카테고리 목록 API
app.get('/api/categories', async (req, res) => {
  try {
    const result = await db.select().from(shopCategories);
    res.json({
      success: true,
      categories: result
    });
  } catch (error) {
    console.error('카테고리 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '카테고리 정보를 불러오는 중 오류가 발생했습니다.',
      details: error.message
    });
  }
});

// 상품 검색 API
app.get('/api/search', async (req, res) => {
  try {
    const { q: query, category, minPrice, maxPrice, sort = 'created_at' } = req.query;
    
    let dbQuery = db.select().from(products).where(eq(products.is_active, true));
    
    if (query) {
      // 검색 기능 (이름 또는 설명에서 검색)
      const searchResults = await db.select().from(products).where(
        eq(products.is_active, true)
      );
      
      const filteredResults = searchResults.filter(product => 
        product.name.toLowerCase().includes(String(query).toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(String(query).toLowerCase()))
      );
      
      res.json({
        success: true,
        products: filteredResults,
        total: filteredResults.length,
        query: query
      });
      return;
    }
    
    const result = await dbQuery;
    res.json({
      success: true,
      products: result,
      total: result.length
    });
  } catch (error) {
    console.error('상품 검색 오류:', error);
    res.status(500).json({
      success: false,
      error: '상품 검색 중 오류가 발생했습니다.',
      details: error.message
    });
  }
});

// 헬스 체크 API
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Shopping API 서버가 정상적으로 작동 중입니다.',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /api/products',
      'GET /api/products/:id',
      'GET /api/categories',
      'GET /api/search'
    ]
  });
});

// 정적 파일 서빙 (프로덕션 환경 시뮬레이션)
app.use(express.static(path.join(process.cwd(), 'public')));

// 404 핸들러
app.use('*', (req, res) => {
  if (req.originalUrl.startsWith('/api/')) {
    res.status(404).json({
      success: false,
      error: 'API 엔드포인트를 찾을 수 없습니다.',
      url: req.originalUrl
    });
  } else {
    res.status(404).send('Page not found');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Production-style API 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📱 Local: http://localhost:${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`🛍️ Store URL: https://store.funnytalez.com`);
  console.log(`✅ 외부 쇼핑몰 연동 테스트 준비 완료`);
});