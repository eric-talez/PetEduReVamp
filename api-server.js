const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 3001;

// CORS 설정
app.use(cors({
  origin: ['http://localhost:5000', 'https://store.funnytalez.com'],
  credentials: true
}));

app.use(express.json());

// PostgreSQL 연결 설정
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// 간단한 상품 API
app.get('/api/products', async (req, res) => {
  try {
    const { limit = 10, offset = 0, category, search } = req.query;
    
    let query = 'SELECT * FROM products WHERE is_active = true';
    let params = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND category_id = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (search) {
      query += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      products: result.rows,
      total: result.rows.length,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(result.rows.length / limit)
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
    const result = await pool.query(
      'SELECT * FROM products WHERE id = $1 AND is_active = true',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: '상품을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      product: result.rows[0]
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
    const result = await pool.query('SELECT * FROM shop_categories ORDER BY name');
    res.json({
      success: true,
      categories: result.rows
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