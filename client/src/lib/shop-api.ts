/**
 * 펫에듀 플랫폼과 FunnyTalez 쇼핑몰 API 연동을 위한 인터페이스
 */

// 상품 타입 정의
export interface Product {
  id: string;
  name: string; 
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  subcategory?: string;
  tags: string[];
  stock: number;
  rating?: number;
  reviewCount?: number;
  isRecommended?: boolean;
  trainerId?: number; // 추천 트레이너 ID
  instituteId?: number; // 추천 기관 ID
  referralCode?: string; // 추천 코드
  createdAt: string;
  updatedAt: string;
}

// 장바구니 항목 타입 정의
export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
  referralCode?: string; // 트레이너 추천 코드
}

// 장바구니 타입 정의
export interface Cart {
  userId?: number; // 로그인 사용자의 경우
  items: CartItem[];
  totalAmount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

// 주문 항목 타입 정의
export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  referralCode?: string;
}

// 훈련사 정보 타입 정의
export interface TrainerInfo {
  id: number;
  name: string;
  profileImage?: string;
  bio?: string;
  specialty?: string[];
  experience?: number; // 경력 연수
  rating?: number;
  reviewCount?: number;
  instituteId?: number;
  instituteName?: string;
}

// 상품 추천 정보 타입 정의
export interface ProductRecommendationInfo {
  trainerId: number;
  trainerName: string;
  instituteId?: number;
  instituteName?: string;
  referralCode: string;
  commissionRate: number; // 수수료 비율 (%)
  totalSales: number; // 총 판매액
  totalCommission: number; // 총 수수료
  salesCount: number; // 판매 건수
  recommendedAt: string; // 추천 일자
  reason?: string; // 추천 이유
}

// 주문 타입 정의
export interface Order {
  id: string;
  userId: number;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  verificationStatus: 'pending' | 'verified' | 'failed';
  createdAt: string;
  updatedAt: string;
}

// 찜 목록 타입 정의
export interface WishlistItem {
  productId: string;
  addedAt: string;
}

// 찜 목록 타입 정의
export interface Wishlist {
  userId: number;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

// 토스 본인인증 결과 타입 정의
export interface TossVerificationResult {
  success: boolean;
  txId?: string;
  userName?: string;
  birthDate?: string;
  gender?: string;
  phoneNumber?: string;
  errorCode?: string;
  errorMessage?: string;
}

// FunnyTalez Shop API 호출 클래스
export class ShopApiService {
  private baseUrl: string;
  private apiKey: string;
  
  constructor() {
    this.baseUrl = 'https://store.funnytalez.com/api';
    this.apiKey = import.meta.env.VITE_FUNNYTALEZ_API_KEY || '';
  }
  
  // 헤더 생성 메서드
  private getHeaders(withAuth: boolean = true): Headers {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey
    });
    
    if (withAuth) {
      const token = localStorage.getItem('shop_auth_token');
      if (token) {
        headers.append('Authorization', `Bearer ${token}`);
      }
    }
    
    return headers;
  }
  
  // API 호출 메서드
  private async fetchApi(endpoint: string, options: RequestInit = {}): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      
      // 에러 처리
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `API 요청 실패: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Shop API 호출 중 오류 발생:', error);
      throw error;
    }
  }
  
  // 상품 목록 조회
  async getProducts(category?: string, page: number = 1, limit: number = 20): Promise<Product[]> {
    let url = `/products?page=${page}&limit=${limit}`;
    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }
    
    return this.fetchApi(url, {
      method: 'GET',
      headers: this.getHeaders(false)
    });
  }
  
  // 상품 상세 조회
  async getProduct(productId: string): Promise<Product> {
    return this.fetchApi(`/products/${productId}`, {
      method: 'GET',
      headers: this.getHeaders(false)
    });
  }
  
  // 상품 검색
  async searchProducts(query: string, page: number = 1, limit: number = 20): Promise<Product[]> {
    return this.fetchApi(`/products/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: this.getHeaders(false)
    });
  }
  
  // 추천 상품 목록 조회
  async getRecommendedProducts(trainerId?: number): Promise<Product[]> {
    let url = '/products/recommended';
    if (trainerId) {
      url += `?trainerId=${trainerId}`;
    }
    
    return this.fetchApi(url, {
      method: 'GET',
      headers: this.getHeaders(false)
    });
  }
  
  // 장바구니 조회
  async getCart(): Promise<Cart> {
    return this.fetchApi('/cart', {
      method: 'GET',
      headers: this.getHeaders(true)
    });
  }
  
  // 장바구니에 상품 추가
  async addToCart(productId: string, quantity: number = 1, referralCode?: string): Promise<Cart> {
    return this.fetchApi('/cart/items', {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ productId, quantity, referralCode })
    });
  }
  
  // 장바구니 상품 수량 변경
  async updateCartItem(productId: string, quantity: number): Promise<Cart> {
    return this.fetchApi(`/cart/items/${productId}`, {
      method: 'PATCH',
      headers: this.getHeaders(true),
      body: JSON.stringify({ quantity })
    });
  }
  
  // 장바구니에서 상품 제거
  async removeFromCart(productId: string): Promise<Cart> {
    return this.fetchApi(`/cart/items/${productId}`, {
      method: 'DELETE',
      headers: this.getHeaders(true)
    });
  }
  
  // 주문 생성
  async createOrder(shippingAddress: Order['shippingAddress'], paymentMethod: string): Promise<Order> {
    return this.fetchApi('/orders', {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ shippingAddress, paymentMethod })
    });
  }
  
  // 주문 목록 조회
  async getOrders(page: number = 1, limit: number = 10): Promise<Order[]> {
    return this.fetchApi(`/orders?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: this.getHeaders(true)
    });
  }
  
  // 주문 상세 조회
  async getOrder(orderId: string): Promise<Order> {
    return this.fetchApi(`/orders/${orderId}`, {
      method: 'GET',
      headers: this.getHeaders(true)
    });
  }
  
  // 찜 목록 조회
  async getWishlist(): Promise<Wishlist> {
    return this.fetchApi('/wishlist', {
      method: 'GET',
      headers: this.getHeaders(true)
    });
  }
  
  // 찜 목록에 상품 추가
  async addToWishlist(productId: string): Promise<Wishlist> {
    return this.fetchApi('/wishlist/items', {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ productId })
    });
  }
  
  // 찜 목록에서 상품 제거
  async removeFromWishlist(productId: string): Promise<Wishlist> {
    return this.fetchApi(`/wishlist/items/${productId}`, {
      method: 'DELETE',
      headers: this.getHeaders(true)
    });
  }
  
  // 상품 등록 (훈련사 또는 관리자용)
  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    return this.fetchApi('/products', {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(productData)
    });
  }
  
  // 상품 수정 (훈련사 또는 관리자용)
  async updateProduct(productId: string, productData: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product> {
    return this.fetchApi(`/products/${productId}`, {
      method: 'PATCH',
      headers: this.getHeaders(true),
      body: JSON.stringify(productData)
    });
  }
  
  // 상품 삭제 (관리자용)
  async deleteProduct(productId: string): Promise<void> {
    return this.fetchApi(`/products/${productId}`, {
      method: 'DELETE',
      headers: this.getHeaders(true)
    });
  }
  
  // 토스 본인인증 요청 시작
  async startTossVerification(returnUrl: string): Promise<{ redirectUrl: string }> {
    return this.fetchApi('/auth/toss/start', {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ returnUrl })
    });
  }
  
  // 토스 본인인증 결과 확인
  async verifyTossResult(txId: string): Promise<TossVerificationResult> {
    return this.fetchApi('/auth/toss/verify', {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ txId })
    });
  }
  
  // 쇼핑몰 로그인
  async login(username: string, password: string): Promise<{ token: string; user: any }> {
    const result = await this.fetchApi('/auth/login', {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ username, password })
    });
    
    // 로그인 성공시 토큰 저장
    if (result.token) {
      localStorage.setItem('shop_auth_token', result.token);
    }
    
    return result;
  }
  
  // 쇼핑몰 로그아웃
  async logout(): Promise<void> {
    localStorage.removeItem('shop_auth_token');
    // 서버 측 로그아웃은 선택적
    return this.fetchApi('/auth/logout', {
      method: 'POST',
      headers: this.getHeaders(true)
    });
  }
  
  // 추천 코드 생성 (훈련사용)
  async generateReferralCode(trainerId: number, instituteId?: number): Promise<{ referralCode: string }> {
    return this.fetchApi('/referral/generate', {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ trainerId, instituteId })
    });
  }
  
  // 추천 코드로 매출 확인 (훈련사용)
  async getReferralStats(referralCode: string): Promise<{
    totalSales: number;
    totalCommission: number;
    ordersCount: number;
  }> {
    return this.fetchApi(`/referral/stats/${referralCode}`, {
      method: 'GET',
      headers: this.getHeaders(true)
    });
  }
  
  // 훈련사 정보 조회
  async getTrainerInfo(trainerId: number): Promise<TrainerInfo> {
    return this.fetchApi(`/trainers/${trainerId}`, {
      method: 'GET',
      headers: this.getHeaders(false)
    });
  }
  
  // 상품 추천 정보 조회
  async getProductRecommendationInfo(productId: string, trainerId: number): Promise<ProductRecommendationInfo> {
    return this.fetchApi(`/products/${productId}/recommendations/${trainerId}`, {
      method: 'GET',
      headers: this.getHeaders(true)
    });
  }
  
  // 훈련사별 추천 상품 목록 및 정산 정보 조회
  async getTrainerRecommendations(trainerId: number): Promise<{
    products: Product[],
    commissionInfo: {
      totalSales: number;
      totalCommission: number;
      salesCount: number;
      averageCommissionRate: number;
    }
  }> {
    return this.fetchApi(`/trainers/${trainerId}/recommendations`, {
      method: 'GET',
      headers: this.getHeaders(true)
    });
  }
}

// API 클래스 인스턴스 생성
export const shopApi = new ShopApiService();