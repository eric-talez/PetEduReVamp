import express from 'express';
import cors from 'cors';
import { db } from './server/db';
import { products, shopCategories } from './shared/schema';
import { eq, and, ilike, or } from 'drizzle-orm';

const app = express();
const PORT = 3001;

// CORS 설정
app.use(cors({
  origin: ['http://localhost:5000', 'https://store.funnytalez.com'],
  credentials: true
}));

app.use(express.json());

// 간단한 상품 API
app.get('/api/products', async (req, res) => {
  try {
    const { limit = 10, offset = 0, category, search } = req.query;
    
    let query = db.select().from(products).where(eq(products.is_active, true));
    
    if (category) {
      query = query.where(and(
        eq(products.is_active, true),
        eq(products.category_id, Number(category))
      ));
    }

    if (search) {
      query = query.where(and(
        eq(products.is_active, true),
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.description, `%${search}%`)
        )
      ));
    }

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

// 상품 상세 조회
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.select().from(products)
      .where(and(
        eq(products.id, Number(id)),
        eq(products.is_active, true)
      ))
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

// 카테고리 조회
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

// 헬스 체크
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API 서버가 정상적으로 작동 중입니다.',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📱 Local: http://localhost:${PORT}`);
});