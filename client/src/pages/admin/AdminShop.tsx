import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Pencil,
  Trash2,
  Package,
  Tag,
  DollarSign,
  AlignLeft,
  Image as ImageIcon,
  Award,
  Medal,
  UserCheck,
  MessageSquare,
  Percent,
  Upload,
  Eye,
  MoreVertical,
  ShoppingCart,
  Store,
  Truck,
  CircleDollarSign,
  HeartHandshake,
  Users,
  BarChart3,
  ListFilter,
  ExternalLink,
  Check,
  XCircle,
  Layers,
  Copy,
  Save
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 상품 타입
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  status: 'active' | 'draft' | 'out_of_stock';
  stock: number;
  sku: string;
  createdAt: string;
  updatedAt: string;
  ratings: number;
  reviewCount: number;
  brand?: string;
  featured: boolean;
  tags: string[];
  specifications?: Record<string, string>;
  relatedProducts?: number[];
  totalSales: number;
  referralCommission: number;
}

// 주문 타입
interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerAvatar?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  amount: number;
  items: number;
  createdAt: string;
  updatedAt: string;
  shippingAddress: string;
  trackingNumber?: string;
  paymentMethod: string;
  referralCode?: string;
  referralSource?: string;
  referredBy?: string;
}

// 카테고리 타입
interface Category {
  id: number;
  name: string;
  description?: string;
  productCount: number;
  subcategories?: { id: number; name: string }[];
}

// 훈련사 타입 정의
interface Trainer {
  id: number;
  name: string;
  email: string;
  profileImage?: string;
  specialty: string;
  totalSales: number;
  activeRecommendations: number;
}

// 훈련사 추천 상품 타입 정의
interface TrainerRecommendation {
  id: number;
  trainerId: number;
  trainerName: string;
  productId: number;
  productName: string;
  recommendationDate: string;
  status: 'active' | 'pending' | 'rejected';
  customMessage?: string;
  commissionRate: number;
  totalSales: number;
  totalCommission: number;
}

export default function AdminShop() {
  const { userName } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('products');
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showProductModal, setShowProductModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add'>('view');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  // 훈련사 추천 상품 관련 상태
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [trainerRecommendations, setTrainerRecommendations] = useState<TrainerRecommendation[]>([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState<TrainerRecommendation[]>([]);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<TrainerRecommendation | null>(null);
  const [filterTrainer, setFilterTrainer] = useState<number | null>(null);
  
  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // 실제 구현 시 API 호출로 대체
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 임시 카테고리 데이터
        const mockCategories: Category[] = [
          { 
            id: 1, 
            name: '사료', 
            description: '균형 잡힌 영양의 강아지 사료',
            productCount: 24,
            subcategories: [
              { id: 101, name: '건식 사료' },
              { id: 102, name: '습식 사료' },
              { id: 103, name: '특수 사료' }
            ]
          },
          { 
            id: 2, 
            name: '장난감', 
            description: '다양한 강아지 장난감',
            productCount: 18,
            subcategories: [
              { id: 201, name: '인형' },
              { id: 202, name: '공' },
              { id: 203, name: '지능 개발 장난감' }
            ]
          },
          { 
            id: 3, 
            name: '훈련 용품', 
            description: '훈련에 필요한 다양한 용품',
            productCount: 15,
            subcategories: [
              { id: 301, name: '클리커' },
              { id: 302, name: '리드줄' },
              { id: 303, name: '훈련 간식' }
            ]
          },
          { 
            id: 4, 
            name: '의류', 
            description: '강아지 의류 및 액세서리',
            productCount: 12,
            subcategories: [
              { id: 401, name: '옷' },
              { id: 402, name: '신발' },
              { id: 403, name: '액세서리' }
            ]
          },
          { 
            id: 5, 
            name: '위생 용품', 
            description: '강아지 위생 관리 용품',
            productCount: 10,
            subcategories: [
              { id: 501, name: '샴푸' },
              { id: 502, name: '브러쉬' },
              { id: 503, name: '치아 관리' }
            ]
          }
        ];
        
        // 임시 상품 데이터
        const mockProducts: Product[] = [
          {
            id: 1,
            name: '프리미엄 건식 사료 1kg',
            description: '영양 균형이 완벽한 프리미엄 건식 사료입니다. 현직 수의사가 추천하는 최고의 사료로, 강아지의 건강한 성장을 돕습니다.',
            price: 35000,
            discountPrice: 29900,
            images: ['https://placedog.net/500/280?id=1'],
            category: '사료',
            subcategory: '건식 사료',
            status: 'active',
            stock: 50,
            sku: 'PRD-DRY-FOOD-001',
            createdAt: '2024-03-10',
            updatedAt: '2024-05-01',
            ratings: 4.7,
            reviewCount: 128,
            brand: '퍼피 네이처',
            featured: true,
            tags: ['프리미엄', '건식', '올 연령'],
            specifications: {
              '중량': '1kg',
              '원산지': '한국',
              '유통기한': '제조일로부터 12개월',
              '주 원료': '닭고기, 현미, 야채 혼합'
            },
            relatedProducts: [2, 3, 5],
            totalSales: 547,
            referralCommission: 10
          },
          {
            id: 2,
            name: '고단백 습식 사료 세트 (10개입)',
            description: '신선한 육류와 채소로 만든 고단백 습식 사료 세트입니다. 먹기 까다로운 강아지에게 이상적입니다.',
            price: 45000,
            images: ['https://placedog.net/500/280?id=2'],
            category: '사료',
            subcategory: '습식 사료',
            status: 'active',
            stock: 35,
            sku: 'PRD-WET-FOOD-002',
            createdAt: '2024-03-15',
            updatedAt: '2024-04-28',
            ratings: 4.9,
            reviewCount: 95,
            brand: '웻 테이스티',
            featured: false,
            tags: ['고단백', '습식', '소포장'],
            totalSales: 312,
            referralCommission: 8
          },
          {
            id: 3,
            name: '올인원 훈련 클리커 세트',
            description: '전문가용 훈련 클리커와 파우치, 가이드북이 포함된 올인원 세트입니다. 초보 견주도 쉽게 훈련을 시작할 수 있습니다.',
            price: 24000,
            discountPrice: 19800,
            images: ['https://placedog.net/500/280?id=3'],
            category: '훈련 용품',
            subcategory: '클리커',
            status: 'active',
            stock: 42,
            sku: 'PRD-TRN-CLK-003',
            createdAt: '2024-04-02',
            updatedAt: '2024-05-05',
            ratings: 4.8,
            reviewCount: 63,
            brand: '트레이닝 버디',
            featured: true,
            tags: ['클리커', '훈련', '초보자용'],
            specifications: {
              '구성품': '클리커, 파우치, 가이드북, 간식 보관 용기',
              '재질': '내구성 있는 플라스틱 및 금속',
              '크기': '6 x 3 x 2cm (클리커)'
            },
            totalSales: 201,
            referralCommission: 12
          },
          {
            id: 4,
            name: '울트라 컴포트 하네스 (중형견)',
            description: '착용감이 우수한 프리미엄 하네스로, 산책 시 반려견의 편안함을 최우선으로 설계되었습니다.',
            price: 52000,
            images: ['https://placedog.net/500/280?id=4'],
            category: '훈련 용품',
            subcategory: '리드줄',
            status: 'out_of_stock',
            stock: 0,
            sku: 'PRD-TRN-HRNS-004',
            createdAt: '2024-02-25',
            updatedAt: '2024-05-03',
            ratings: 4.6,
            reviewCount: 87,
            brand: '컴포트 펫',
            featured: false,
            tags: ['하네스', '중형견', '편안함'],
            specifications: {
              '사이즈': '중형견용 (15-25kg)',
              '재질': '나일론, 패딩 메모리폼',
              '색상': '블랙, 레드, 블루',
              '특징': '반사 스트립, 조절 가능한 스트랩'
            },
            totalSales: 158,
            referralCommission: 15
          },
          {
            id: 5,
            name: '독투스 치석 제거 장난감',
            description: '놀면서 치석을 제거하는 혁신적인 장난감입니다. 특수 설계된 재질이 치아 건강을 케어합니다.',
            price: 18500,
            discountPrice: 14800,
            images: ['https://placedog.net/500/280?id=5'],
            category: '장난감',
            subcategory: '지능 개발 장난감',
            status: 'active',
            stock: 65,
            sku: 'PRD-TOY-DNTL-005',
            createdAt: '2024-04-10',
            updatedAt: '2024-05-02',
            ratings: 4.5,
            reviewCount: 42,
            brand: '독투스',
            featured: true,
            tags: ['치아 관리', '장난감', '내구성'],
            totalSales: 175,
            referralCommission: 10
          }
        ];
        
        // 임시 주문 데이터
        const mockOrders: Order[] = [
          {
            id: 1,
            orderNumber: 'ORD-20240510-001',
            customerName: '김지훈',
            customerEmail: 'jihoon.kim@example.com',
            status: 'delivered',
            amount: 64700,
            items: 2,
            createdAt: '2024-05-10 09:23:45',
            updatedAt: '2024-05-12 15:30:22',
            shippingAddress: '서울시 강남구 테헤란로 123, 502호',
            trackingNumber: 'KR1234567890',
            paymentMethod: '신용카드',
            referralCode: 'TRAINER001',
            referralSource: '훈련사',
            referredBy: '박훈련'
          },
          {
            id: 2,
            orderNumber: 'ORD-20240509-002',
            customerName: '이미영',
            customerEmail: 'miyoung.lee@example.com',
            status: 'shipped',
            amount: 19800,
            items: 1,
            createdAt: '2024-05-09 15:45:12',
            updatedAt: '2024-05-10 11:20:05',
            shippingAddress: '경기도 성남시 분당구 판교로 45, 101동 1502호',
            trackingNumber: 'KR9876543210',
            paymentMethod: '무통장입금',
            referralCode: 'INST002',
            referralSource: '기관',
            referredBy: '알파 트레이닝 센터'
          },
          {
            id: 3,
            orderNumber: 'ORD-20240508-003',
            customerName: '박준영',
            customerEmail: 'junyoung.park@example.com',
            status: 'processing',
            amount: 52000,
            items: 1,
            createdAt: '2024-05-08 12:10:30',
            updatedAt: '2024-05-08 12:30:15',
            shippingAddress: '부산시 해운대구 해운대로 50, 34호',
            paymentMethod: '카카오페이',
          },
          {
            id: 4,
            orderNumber: 'ORD-20240507-004',
            customerName: '최수진',
            customerEmail: 'sujin.choi@example.com',
            status: 'pending',
            amount: 80300,
            items: 3,
            createdAt: '2024-05-07 18:05:22',
            updatedAt: '2024-05-07 18:05:22',
            shippingAddress: '대구시 수성구 들안로 45, 202호',
            paymentMethod: '신용카드',
            referralCode: 'TRAINER003',
            referralSource: '훈련사',
            referredBy: '이하은'
          },
          {
            id: 5,
            orderNumber: 'ORD-20240506-005',
            customerName: '정민호',
            customerEmail: 'minho.jung@example.com',
            status: 'cancelled',
            amount: 45000,
            items: 1,
            createdAt: '2024-05-06 10:15:44',
            updatedAt: '2024-05-06 14:22:31',
            shippingAddress: '인천시 연수구 송도동 123-45',
            paymentMethod: '무통장입금',
          }
        ];
        
        setCategories(mockCategories);
        setProducts(mockProducts);
        setOrders(mockOrders);
      } catch (error) {
        console.error('데이터 로딩 오류:', error);
        toast({
          title: '데이터 로딩 오류',
          description: '쇼핑몰 데이터를 불러오는 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);
  
  // 상품 필터링
  useEffect(() => {
    let filtered = [...products];
    
    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        product => 
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query)
      );
    }
    
    // 카테고리 필터링
    if (filterCategory && filterCategory !== 'all') {
      filtered = filtered.filter(product => product.category === filterCategory);
    }
    
    // 상태 필터링
    if (filterStatus && filterStatus !== 'all') {
      filtered = filtered.filter(product => product.status === filterStatus);
    }
    
    // 정렬
    filtered = filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'ratings':
          comparison = a.ratings - b.ratings;
          break;
        case 'stock':
          comparison = a.stock - b.stock;
          break;
        case 'sales':
          comparison = a.totalSales - b.totalSales;
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredProducts(filtered);
  }, [products, searchQuery, filterCategory, filterStatus, sortBy, sortOrder]);
  
  // 주문 필터링
  useEffect(() => {
    let filtered = [...orders];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        order => 
          order.orderNumber.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.customerEmail.toLowerCase().includes(query)
      );
    }
    
    if (filterStatus && filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }
    
    setFilteredOrders(filtered);
  }, [orders, searchQuery, filterStatus]);
  
  // 페이지네이션 처리 (상품)
  const totalProductPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  
  // 페이지네이션 처리 (주문)
  const totalOrderPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  
  // 상품 상세 보기
  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setModalMode('view');
    setShowProductModal(true);
  };
  
  // 상품 편집
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setModalMode('edit');
    setShowProductModal(true);
  };
  
  // 새 상품 추가
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setModalMode('add');
    setShowProductModal(true);
  };
  
  // 상품 삭제
  const handleDeleteProduct = (productId: number) => {
    if (window.confirm('정말로 이 상품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      setProducts(prev => prev.filter(product => product.id !== productId));
      
      toast({
        title: '상품 삭제',
        description: '상품이 성공적으로 삭제되었습니다.',
      });
      
      if (showProductModal && selectedProduct && selectedProduct.id === productId) {
        setShowProductModal(false);
      }
    }
  };
  
  // 상품 상태 변경
  const handleChangeProductStatus = (productId: number, newStatus: 'active' | 'draft' | 'out_of_stock') => {
    setProducts(prev => prev.map(product => 
      product.id === productId ? { ...product, status: newStatus } : product
    ));
    
    const statusMap = {
      active: '판매 중',
      draft: '임시저장',
      out_of_stock: '재고 없음'
    };
    
    toast({
      title: '상품 상태 변경',
      description: `상품 상태가 '${statusMap[newStatus]}'(으)로 변경되었습니다.`,
    });
    
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct({ ...selectedProduct, status: newStatus });
    }
  };
  
  // 주문 상세 보기
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };
  
  // 주문 상태 변경
  const handleChangeOrderStatus = (orderId: number, newStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded') => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? 
      { 
        ...order, 
        status: newStatus, 
        updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
      } : 
      order
    ));
    
    const statusMap = {
      pending: '결제 대기',
      processing: '처리 중',
      shipped: '배송 중',
      delivered: '배송 완료',
      cancelled: '취소됨',
      refunded: '환불됨'
    };
    
    toast({
      title: '주문 상태 변경',
      description: `주문 상태가 '${statusMap[newStatus]}'(으)로 변경되었습니다.`,
    });
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        status: newStatus,
        updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
      });
    }
  };
  
  // 상태별 배지 색상 (상품)
  const getProductStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">판매 중</Badge>;
      case 'draft':
        return <Badge className="bg-amber-500">임시저장</Badge>;
      case 'out_of_stock':
        return <Badge variant="outline" className="text-gray-500">재고 없음</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // 상태별 배지 색상 (주문)
  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-500">결제 대기</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500">처리 중</Badge>;
      case 'shipped':
        return <Badge className="bg-purple-500">배송 중</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500">배송 완료</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-gray-500">취소됨</Badge>;
      case 'refunded':
        return <Badge className="bg-red-500">환불됨</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // 추천인 출처 배지
  const getReferralBadge = (source?: string) => {
    if (!source) return null;
    
    switch (source) {
      case '훈련사':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">훈련사 추천</Badge>;
      case '기관':
        return <Badge variant="outline" className="border-purple-500 text-purple-500">기관 추천</Badge>;
      default:
        return <Badge variant="outline">{source}</Badge>;
    }
  };
  
  // 데이터 새로고침
  const handleRefresh = () => {
    setIsLoading(true);
    
    // 실제 구현 시 API 호출로 대체
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: '새로고침 완료',
        description: '쇼핑몰 데이터가 업데이트되었습니다.',
      });
    }, 1000);
  };
  
  // 할인율 계산
  const calculateDiscount = (price: number, discountPrice?: number) => {
    if (!discountPrice) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  };
  
  // 별점 표시
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 > 0.3;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {Array(fullStars).fill(0).map((_, i) => (
          <svg key={`full-${i}`} className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
        {halfStar && (
          <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
          </svg>
        )}
        {Array(emptyStars).fill(0).map((_, i) => (
          <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
          </svg>
        ))}
        <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">쇼핑몰 관리</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => window.open('/shop', '_blank')}>
            <ExternalLink className="mr-2 h-4 w-4" />
            쇼핑몰 방문
          </Button>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            새로고침
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="products">
              <Package className="h-4 w-4 mr-2" />
              상품 관리
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingCart className="h-4 w-4 mr-2" />
              주문 관리
            </TabsTrigger>
            <TabsTrigger value="categories">
              <Tag className="h-4 w-4 mr-2" />
              카테고리
            </TabsTrigger>
            <TabsTrigger value="recommendations">
              <Award className="h-4 w-4 mr-2" />
              훈련사 추천
            </TabsTrigger>
            <TabsTrigger value="referrals">
              <HeartHandshake className="h-4 w-4 mr-2" />
              추천 관리
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              판매 분석
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* 상품 관리 탭 */}
        <TabsContent value="products">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="상품명, 설명, SKU 검색..."
                    className="pl-8 h-9 md:w-[300px] w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={filterCategory || 'all'} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px] h-9">
                    <SelectValue placeholder="카테고리" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 카테고리</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus || 'all'} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px] h-9">
                    <SelectValue placeholder="상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 상태</SelectItem>
                    <SelectItem value="active">판매 중</SelectItem>
                    <SelectItem value="draft">임시저장</SelectItem>
                    <SelectItem value="out_of_stock">재고 없음</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={handleAddProduct}>
                <PlusCircle className="h-4 w-4 mr-2" />
                상품 추가
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>상품</TableHead>
                      <TableHead>카테고리</TableHead>
                      <TableHead>가격</TableHead>
                      <TableHead>재고</TableHead>
                      <TableHead>평점</TableHead>
                      <TableHead>판매량</TableHead>
                      <TableHead>추천 커미션</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead className="text-right">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-10">
                          <div className="flex justify-center">
                            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">데이터를 불러오고 있습니다...</div>
                        </TableCell>
                      </TableRow>
                    ) : paginatedProducts.length > 0 ? (
                      paginatedProducts.map(product => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0 h-10 w-16 rounded-md bg-muted overflow-hidden">
                                {product.images && product.images.length > 0 ? (
                                  <img 
                                    src={product.images[0]} 
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full w-full bg-secondary">
                                    <Package className="h-6 w-6 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-xs text-muted-foreground">{product.sku}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <Badge variant="outline">{product.category}</Badge>
                              {product.subcategory && (
                                <div className="text-xs text-muted-foreground mt-1">{product.subcategory}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {product.discountPrice ? (
                              <div>
                                <div className="font-medium">{product.discountPrice.toLocaleString()}원</div>
                                <div className="text-xs text-muted-foreground line-through">{product.price.toLocaleString()}원</div>
                                <Badge className="bg-red-500 mt-1">{calculateDiscount(product.price, product.discountPrice)}% 할인</Badge>
                              </div>
                            ) : (
                              <div className="font-medium">{product.price.toLocaleString()}원</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className={product.stock === 0 ? 'text-red-500' : ''}>{product.stock}</div>
                          </TableCell>
                          <TableCell>
                            {renderStars(product.ratings)}
                            <div className="text-xs text-muted-foreground mt-1">리뷰 {product.reviewCount}개</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{product.totalSales}개</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{product.referralCommission}%</div>
                          </TableCell>
                          <TableCell>{getProductStatusBadge(product.status)}</TableCell>
                          <TableCell>
                            <div className="flex justify-end">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleViewProduct(product)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    상세 보기
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    상품 편집
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {product.status !== 'active' && (
                                    <DropdownMenuItem onClick={() => handleChangeProductStatus(product.id, 'active')}>
                                      <Check className="h-4 w-4 mr-2 text-green-500" />
                                      판매 활성화
                                    </DropdownMenuItem>
                                  )}
                                  {product.status !== 'draft' && (
                                    <DropdownMenuItem onClick={() => handleChangeProductStatus(product.id, 'draft')}>
                                      <AlignLeft className="h-4 w-4 mr-2 text-amber-500" />
                                      임시저장으로 변경
                                    </DropdownMenuItem>
                                  )}
                                  {product.status !== 'out_of_stock' && (
                                    <DropdownMenuItem onClick={() => handleChangeProductStatus(product.id, 'out_of_stock')}>
                                      <XCircle className="h-4 w-4 mr-2 text-gray-500" />
                                      재고 없음으로 변경
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="text-red-500"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    삭제
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-10">
                          <div className="text-muted-foreground">검색 결과가 없습니다</div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              {!isLoading && totalProductPages > 1 && (
                <CardFooter className="flex justify-between py-4">
                  <div className="text-sm text-muted-foreground">
                    총 {filteredProducts.length}개 중 {(currentPage - 1) * itemsPerPage + 1}-
                    {Math.min(currentPage * itemsPerPage, filteredProducts.length)}개 표시
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: Math.min(5, totalProductPages) }, (_, i) => {
                      const pageNum = currentPage > 3 ? currentPage - 3 + i + 1 : i + 1;
                      if (pageNum <= totalProductPages) {
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                      return null;
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalProductPages))}
                      disabled={currentPage === totalProductPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>
        
        {/* 주문 관리 탭 */}
        <TabsContent value="orders">
          <div className="space-y-4">
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="주문번호, 고객명, 이메일 검색..."
                  className="pl-8 h-9 md:w-[300px] w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={filterStatus || 'all'} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="주문 상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 상태</SelectItem>
                  <SelectItem value="pending">결제 대기</SelectItem>
                  <SelectItem value="processing">처리 중</SelectItem>
                  <SelectItem value="shipped">배송 중</SelectItem>
                  <SelectItem value="delivered">배송 완료</SelectItem>
                  <SelectItem value="cancelled">취소됨</SelectItem>
                  <SelectItem value="refunded">환불됨</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>주문번호</TableHead>
                      <TableHead>고객</TableHead>
                      <TableHead>주문일시</TableHead>
                      <TableHead>금액</TableHead>
                      <TableHead>품목 수</TableHead>
                      <TableHead>추천인</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead className="text-right">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-10">
                          <div className="flex justify-center">
                            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">데이터를 불러오고 있습니다...</div>
                        </TableCell>
                      </TableRow>
                    ) : paginatedOrders.length > 0 ? (
                      paginatedOrders.map(order => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <div className="font-medium">{order.orderNumber}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-7 w-7">
                                <AvatarImage src={order.customerAvatar} alt={order.customerName} />
                                <AvatarFallback>{order.customerName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div>{order.customerName}</div>
                                <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>{order.createdAt.split(' ')[0]}</div>
                            <div className="text-xs text-muted-foreground">{order.createdAt.split(' ')[1]}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{order.amount.toLocaleString()}원</div>
                          </TableCell>
                          <TableCell>
                            <div>{order.items}개</div>
                          </TableCell>
                          <TableCell>
                            {order.referredBy ? (
                              <div>
                                <div>{order.referredBy}</div>
                                <div className="mt-1">{getReferralBadge(order.referralSource)}</div>
                              </div>
                            ) : (
                              <div className="text-muted-foreground text-sm">직접 방문</div>
                            )}
                          </TableCell>
                          <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                          <TableCell>
                            <div className="flex justify-end">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    주문 상세
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {order.status === 'pending' && (
                                    <DropdownMenuItem onClick={() => handleChangeOrderStatus(order.id, 'processing')}>
                                      <Check className="h-4 w-4 mr-2 text-blue-500" />
                                      처리 중으로 변경
                                    </DropdownMenuItem>
                                  )}
                                  {order.status === 'processing' && (
                                    <DropdownMenuItem onClick={() => handleChangeOrderStatus(order.id, 'shipped')}>
                                      <Truck className="h-4 w-4 mr-2 text-purple-500" />
                                      배송 중으로 변경
                                    </DropdownMenuItem>
                                  )}
                                  {order.status === 'shipped' && (
                                    <DropdownMenuItem onClick={() => handleChangeOrderStatus(order.id, 'delivered')}>
                                      <Check className="h-4 w-4 mr-2 text-green-500" />
                                      배송 완료로 변경
                                    </DropdownMenuItem>
                                  )}
                                  {(order.status === 'pending' || order.status === 'processing') && (
                                    <DropdownMenuItem onClick={() => handleChangeOrderStatus(order.id, 'cancelled')}>
                                      <XCircle className="h-4 w-4 mr-2 text-gray-500" />
                                      주문 취소
                                    </DropdownMenuItem>
                                  )}
                                  {(order.status === 'delivered' || order.status === 'shipped') && (
                                    <DropdownMenuItem onClick={() => handleChangeOrderStatus(order.id, 'refunded')}>
                                      <CircleDollarSign className="h-4 w-4 mr-2 text-red-500" />
                                      환불 처리
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-10">
                          <div className="text-muted-foreground">검색 결과가 없습니다</div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              {!isLoading && totalOrderPages > 1 && (
                <CardFooter className="flex justify-between py-4">
                  <div className="text-sm text-muted-foreground">
                    총 {filteredOrders.length}개 중 {(currentPage - 1) * itemsPerPage + 1}-
                    {Math.min(currentPage * itemsPerPage, filteredOrders.length)}개 표시
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: Math.min(5, totalOrderPages) }, (_, i) => {
                      const pageNum = currentPage > 3 ? currentPage - 3 + i + 1 : i + 1;
                      if (pageNum <= totalOrderPages) {
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                      return null;
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalOrderPages))}
                      disabled={currentPage === totalOrderPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>
        
        {/* 카테고리 관리 탭 */}
        <TabsContent value="categories">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">카테고리 관리</h2>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                카테고리 추가
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map(category => (
                <Card key={category.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex justify-between items-center">
                      <span>{category.name}</span>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">상품 수</span>
                        <span className="font-medium">{category.productCount}</span>
                      </div>
                      {category.subcategories && category.subcategories.length > 0 && (
                        <div className="mt-4">
                          <div className="text-sm font-medium mb-2">하위 카테고리</div>
                          <div className="flex flex-wrap gap-2">
                            {category.subcategories.map(sub => (
                              <Badge key={sub.id} variant="outline">{sub.name}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      <PlusCircle className="h-3 w-3 mr-1" />
                      하위 카테고리 추가
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        {/* 추천 관리 탭 */}
        <TabsContent value="referrals">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>추천 프로그램 설정</CardTitle>
                <CardDescription>
                  훈련사와 기관의 상품 추천 프로그램 설정을 관리합니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">훈련사 추천 프로그램</h3>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="trainerReferrals" className="flex-1 cursor-pointer">
                        <div>훈련사 추천 활성화</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          훈련사가 상품을 추천하고 수수료를 받을 수 있습니다.
                        </p>
                      </Label>
                      <Switch id="trainerReferrals" defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="trainerDefaultCommission">기본 추천 수수료 (%)</Label>
                      <Input id="trainerDefaultCommission" type="number" defaultValue="10" />
                      <p className="text-sm text-muted-foreground">
                        상품별로 다른 수수료를 설정하지 않았을 때 적용되는 기본값입니다.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="trainerReferralPrefix">훈련사 추천 코드 접두사</Label>
                      <Input id="trainerReferralPrefix" defaultValue="TRAINER" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">기관 추천 프로그램</h3>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="instituteReferrals" className="flex-1 cursor-pointer">
                        <div>기관 추천 활성화</div>
                        <p className="text-sm font-normal text-muted-foreground">
                          교육 기관에서 상품을 추천하고 수수료를 받을 수 있습니다.
                        </p>
                      </Label>
                      <Switch id="instituteReferrals" defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="instituteDefaultCommission">기본 추천 수수료 (%)</Label>
                      <Input id="instituteDefaultCommission" type="number" defaultValue="8" />
                      <p className="text-sm text-muted-foreground">
                        상품별로 다른 수수료를 설정하지 않았을 때 적용되는 기본값입니다.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="instituteReferralPrefix">기관 추천 코드 접두사</Label>
                      <Input id="instituteReferralPrefix" defaultValue="INST" />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">추천 정산 설정</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="settlementCycle">정산 주기</Label>
                    <Select defaultValue="monthly">
                      <SelectTrigger id="settlementCycle">
                        <SelectValue placeholder="정산 주기 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">매주</SelectItem>
                        <SelectItem value="biweekly">격주</SelectItem>
                        <SelectItem value="monthly">매월</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="minimumSettlement">최소 정산 금액 (원)</Label>
                    <Input id="minimumSettlement" type="number" defaultValue="10000" />
                    <p className="text-sm text-muted-foreground">
                      이 금액 미만의 수수료는 다음 정산 주기로 이월됩니다.
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="automaticSettlement" className="flex-1 cursor-pointer">
                      <div>자동 정산 활성화</div>
                      <p className="text-sm font-normal text-muted-foreground">
                        정산 주기에 따라 자동으로 정산을 진행합니다.
                      </p>
                    </Label>
                    <Switch id="automaticSettlement" defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto">
                  <Save className="h-4 w-4 mr-2" />
                  설정 저장
                </Button>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>상위 추천인</CardTitle>
                  <CardDescription>판매 추천 실적이 가장 좋은 훈련사 및 기관</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b">
                      <div className="font-medium">이름</div>
                      <div className="font-medium">총 추천 금액</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>박</AvatarFallback>
                        </Avatar>
                        <div>
                          <div>박훈련</div>
                          <Badge variant="outline" className="border-blue-500 text-blue-500">훈련사</Badge>
                        </div>
                      </div>
                      <div className="font-medium">₩1,245,000</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>알</AvatarFallback>
                        </Avatar>
                        <div>
                          <div>알파 트레이닝 센터</div>
                          <Badge variant="outline" className="border-purple-500 text-purple-500">기관</Badge>
                        </div>
                      </div>
                      <div className="font-medium">₩950,700</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>이</AvatarFallback>
                        </Avatar>
                        <div>
                          <div>이하은</div>
                          <Badge variant="outline" className="border-blue-500 text-blue-500">훈련사</Badge>
                        </div>
                      </div>
                      <div className="font-medium">₩785,200</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>베</AvatarFallback>
                        </Avatar>
                        <div>
                          <div>베타 애견 학교</div>
                          <Badge variant="outline" className="border-purple-500 text-purple-500">기관</Badge>
                        </div>
                      </div>
                      <div className="font-medium">₩635,800</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>상위 추천 상품</CardTitle>
                  <CardDescription>가장 많이 추천된 인기 상품</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b">
                      <div className="font-medium">상품명</div>
                      <div className="font-medium">추천 판매량</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-10 w-10 bg-muted rounded overflow-hidden">
                          <img src="https://placedog.net/500/280?id=1" alt="Product" className="h-full w-full object-cover" />
                        </div>
                        <div>프리미엄 건식 사료 1kg</div>
                      </div>
                      <div className="font-medium">126개</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-10 w-10 bg-muted rounded overflow-hidden">
                          <img src="https://placedog.net/500/280?id=3" alt="Product" className="h-full w-full object-cover" />
                        </div>
                        <div>올인원 훈련 클리커 세트</div>
                      </div>
                      <div className="font-medium">98개</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-10 w-10 bg-muted rounded overflow-hidden">
                          <img src="https://placedog.net/500/280?id=5" alt="Product" className="h-full w-full object-cover" />
                        </div>
                        <div>독투스 치석 제거 장난감</div>
                      </div>
                      <div className="font-medium">87개</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-10 w-10 bg-muted rounded overflow-hidden">
                          <img src="https://placedog.net/500/280?id=2" alt="Product" className="h-full w-full object-cover" />
                        </div>
                        <div>고단백 습식 사료 세트</div>
                      </div>
                      <div className="font-medium">65개</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* 판매 분석 탭 */}
        <TabsContent value="analytics">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="text-muted-foreground text-sm">총 판매액</div>
                    <div className="text-3xl font-bold">₩4,283,500</div>
                    <div className="text-sm text-green-500 flex items-center">
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.14645 2.14645C7.34171 1.95118 7.65829 1.95118 7.85355 2.14645L11.8536 6.14645C12.0488 6.34171 12.0488 6.65829 11.8536 6.85355C11.6583 7.04882 11.3417 7.04882 11.1464 6.85355L8 3.70711V12.5C8 12.7761 7.77614 13 7.5 13C7.22386 13 7 12.7761 7 12.5V3.70711L3.85355 6.85355C3.65829 7.04882 3.34171 7.04882 3.14645 6.85355C2.95118 6.65829 2.95118 6.34171 3.14645 6.14645L7.14645 2.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                      </svg>
                      <span className="ml-1">12.5% 증가</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="text-muted-foreground text-sm">총 주문 수</div>
                    <div className="text-3xl font-bold">127</div>
                    <div className="text-sm text-green-500 flex items-center">
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.14645 2.14645C7.34171 1.95118 7.65829 1.95118 7.85355 2.14645L11.8536 6.14645C12.0488 6.34171 12.0488 6.65829 11.8536 6.85355C11.6583 7.04882 11.3417 7.04882 11.1464 6.85355L8 3.70711V12.5C8 12.7761 7.77614 13 7.5 13C7.22386 13 7 12.7761 7 12.5V3.70711L3.85355 6.85355C3.65829 7.04882 3.34171 7.04882 3.14645 6.85355C2.95118 6.65829 2.95118 6.34171 3.14645 6.14645L7.14645 2.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                      </svg>
                      <span className="ml-1">8.3% 증가</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="text-muted-foreground text-sm">평균 주문 금액</div>
                    <div className="text-3xl font-bold">₩33,729</div>
                    <div className="text-sm text-green-500 flex items-center">
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.14645 2.14645C7.34171 1.95118 7.65829 1.95118 7.85355 2.14645L11.8536 6.14645C12.0488 6.34171 12.0488 6.65829 11.8536 6.85355C11.6583 7.04882 11.3417 7.04882 11.1464 6.85355L8 3.70711V12.5C8 12.7761 7.77614 13 7.5 13C7.22386 13 7 12.7761 7 12.5V3.70711L3.85355 6.85355C3.65829 7.04882 3.34171 7.04882 3.14645 6.85355C2.95118 6.65829 2.95118 6.34171 3.14645 6.14645L7.14645 2.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                      </svg>
                      <span className="ml-1">3.8% 증가</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="text-muted-foreground text-sm">추천 판매 비율</div>
                    <div className="text-3xl font-bold">38.2%</div>
                    <div className="text-sm text-green-500 flex items-center">
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.14645 2.14645C7.34171 1.95118 7.65829 1.95118 7.85355 2.14645L11.8536 6.14645C12.0488 6.34171 12.0488 6.65829 11.8536 6.85355C11.6583 7.04882 11.3417 7.04882 11.1464 6.85355L8 3.70711V12.5C8 12.7761 7.77614 13 7.5 13C7.22386 13 7 12.7761 7 12.5V3.70711L3.85355 6.85355C3.65829 7.04882 3.34171 7.04882 3.14645 6.85355C2.95118 6.65829 2.95118 6.34171 3.14645 6.14645L7.14645 2.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                      </svg>
                      <span className="ml-1">5.7% 증가</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>카테고리별 판매</CardTitle>
                  <CardDescription>지난 30일간 카테고리별 판매 분포</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Store className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                      <p>차트 데이터 로딩 중...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>판매 추이</CardTitle>
                  <CardDescription>지난 6개월간 판매 추이</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                      <p>차트 데이터 로딩 중...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>인기 상품 랭킹</CardTitle>
                <CardDescription>가장 많이 판매된 상위 10개 상품</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>순위</TableHead>
                      <TableHead>상품명</TableHead>
                      <TableHead>카테고리</TableHead>
                      <TableHead>판매량</TableHead>
                      <TableHead>매출액</TableHead>
                      <TableHead>평점</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.slice(0, 5).map((product, index) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 bg-muted rounded overflow-hidden">
                              {product.images && product.images.length > 0 ? (
                                <img 
                                  src={product.images[0]} 
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full w-full bg-secondary">
                                  <Package className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div>{product.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.totalSales}개</TableCell>
                        <TableCell>₩{(product.totalSales * (product.discountPrice || product.price)).toLocaleString()}</TableCell>
                        <TableCell>{renderStars(product.ratings)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* 상품 상세/편집 모달 */}
      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modalMode === 'view' ? '상품 상세 정보' : modalMode === 'edit' ? '상품 편집' : '새 상품 추가'}
            </DialogTitle>
            <DialogDescription>
              {modalMode === 'view'
                ? selectedProduct
                  ? `${selectedProduct.name} 상품의 상세 정보입니다.`
                  : ''
                : modalMode === 'edit'
                ? '상품 정보를 수정합니다.'
                : '새로운 상품을 추가합니다.'}
            </DialogDescription>
          </DialogHeader>
          
          {(modalMode === 'view' || modalMode === 'edit') && selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  <div className="rounded-md overflow-hidden h-48">
                    <img 
                      src={selectedProduct.images[0]} 
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 bg-secondary rounded-md">
                    <Package className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                
                {modalMode === 'view' ? (
                  <div className="space-y-3">
                    <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{selectedProduct.category}</Badge>
                      {selectedProduct.subcategory && (
                        <Badge variant="outline">{selectedProduct.subcategory}</Badge>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      {selectedProduct.tags.map((tag, i) => (
                        <Badge key={i} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">상품명</Label>
                      <Input id="name" defaultValue={selectedProduct.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">설명</Label>
                      <Textarea id="description" defaultValue={selectedProduct.description} rows={5} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">카테고리</Label>
                      <Select defaultValue={selectedProduct.category}>
                        <SelectTrigger>
                          <SelectValue placeholder="카테고리 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subcategory">하위 카테고리</Label>
                      <Select defaultValue={selectedProduct.subcategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="하위 카테고리 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedProduct.category && 
                           categories.find(c => c.name === selectedProduct.category)?.subcategories?.map(sub => (
                            <SelectItem key={sub.id} value={sub.name}>
                              {sub.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
                      <Input id="tags" defaultValue={selectedProduct.tags.join(', ')} />
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <div>
                    {getProductStatusBadge(selectedProduct.status)}
                  </div>
                  <div className="flex items-center">
                    {renderStars(selectedProduct.ratings)}
                    <span className="text-sm text-muted-foreground ml-2">({selectedProduct.reviewCount})</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">가격 정보</h3>
                  
                  {modalMode === 'view' ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-[120px_1fr] gap-2">
                        <div className="font-medium text-muted-foreground">정상 가격</div>
                        <div className={selectedProduct.discountPrice ? 'line-through text-muted-foreground' : ''}>
                          {selectedProduct.price.toLocaleString()}원
                        </div>
                      </div>
                      
                      {selectedProduct.discountPrice && (
                        <>
                          <div className="grid grid-cols-[120px_1fr] gap-2">
                            <div className="font-medium text-muted-foreground">할인 가격</div>
                            <div className="font-medium">{selectedProduct.discountPrice.toLocaleString()}원</div>
                          </div>
                          <div className="grid grid-cols-[120px_1fr] gap-2">
                            <div className="font-medium text-muted-foreground">할인율</div>
                            <div>
                              <Badge className="bg-red-500">
                                {calculateDiscount(selectedProduct.price, selectedProduct.discountPrice)}% 할인
                              </Badge>
                            </div>
                          </div>
                        </>
                      )}
                      
                      <div className="grid grid-cols-[120px_1fr] gap-2">
                        <div className="font-medium text-muted-foreground">추천 수수료</div>
                        <div>{selectedProduct.referralCommission}%</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">정상 가격 (원)</Label>
                        <Input id="price" type="number" defaultValue={selectedProduct.price} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discountPrice">할인 가격 (원)</Label>
                        <Input 
                          id="discountPrice" 
                          type="number" 
                          defaultValue={selectedProduct.discountPrice || ''} 
                          placeholder="할인이 없으면 비워두세요"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="referralCommission">추천 수수료 (%)</Label>
                        <Input 
                          id="referralCommission" 
                          type="number" 
                          defaultValue={selectedProduct.referralCommission} 
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">재고 정보</h3>
                  
                  {modalMode === 'view' ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-[120px_1fr] gap-2">
                        <div className="font-medium text-muted-foreground">SKU</div>
                        <div>{selectedProduct.sku}</div>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] gap-2">
                        <div className="font-medium text-muted-foreground">현재 재고</div>
                        <div className={selectedProduct.stock === 0 ? 'text-red-500 font-medium' : ''}>
                          {selectedProduct.stock} 개
                        </div>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] gap-2">
                        <div className="font-medium text-muted-foreground">총 판매량</div>
                        <div>{selectedProduct.totalSales} 개</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="sku">SKU</Label>
                        <Input id="sku" defaultValue={selectedProduct.sku} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stock">재고 수량</Label>
                        <Input id="stock" type="number" defaultValue={selectedProduct.stock} />
                      </div>
                    </div>
                  )}
                </div>
                
                {selectedProduct.specifications && modalMode === 'view' && (
                  <>
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">상세 스펙</h3>
                      
                      <div className="space-y-2">
                        {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                          <div key={key} className="grid grid-cols-[120px_1fr] gap-2">
                            <div className="font-medium text-muted-foreground">{key}</div>
                            <div>{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                {modalMode === 'edit' && (
                  <div className="pt-4">
                    <Button className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      변경사항 저장
                    </Button>
                  </div>
                )}
                
                {modalMode === 'view' && (
                  <div className="pt-4 flex space-x-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setModalMode('edit')}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      상품 편집
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleDeleteProduct(selectedProduct.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      상품 삭제
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {modalMode === 'add' && (
            <div className="space-y-6">
              {/* 새 상품 추가 폼 */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">상품명</Label>
                    <Input id="name" placeholder="상품명 입력" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input id="sku" placeholder="예: PRD-CAT-001" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">설명</Label>
                  <Textarea id="description" placeholder="상품에 대한 상세 설명을 입력하세요" rows={5} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">카테고리</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subcategory">하위 카테고리</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="하위 카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="placeholder">카테고리를 먼저 선택하세요</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">정상 가격 (원)</Label>
                    <Input id="price" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountPrice">할인 가격 (원)</Label>
                    <Input 
                      id="discountPrice" 
                      type="number" 
                      placeholder="할인이 없으면 비워두세요"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock">재고 수량</Label>
                    <Input id="stock" type="number" defaultValue="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referralCommission">추천 수수료 (%)</Label>
                    <Input id="referralCommission" type="number" defaultValue="10" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
                  <Input id="tags" placeholder="예: 프리미엄, 강아지, 훈련" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="productImage">상품 이미지</Label>
                  <div className="border border-dashed rounded-md p-6 text-center">
                    <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <div className="text-sm text-muted-foreground mb-2">
                      이미지를 드래그하거나 클릭하여 선택하세요
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      파일 선택
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="featured" className="flex-1 cursor-pointer">
                    <div>추천 상품으로 설정</div>
                    <p className="text-sm font-normal text-muted-foreground">
                      메인 페이지와 상품 목록에서 강조되어 표시됩니다.
                    </p>
                  </Label>
                  <Switch id="featured" />
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowProductModal(false)}
                >
                  취소
                </Button>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  상품 추가
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* 주문 상세 모달 */}
      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>주문 상세 정보</DialogTitle>
            <DialogDescription>
              {selectedOrder ? `주문번호 ${selectedOrder.orderNumber}의 상세 정보입니다.` : ''}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-medium">{selectedOrder.orderNumber}</div>
                  <div className="text-sm text-muted-foreground">주문일: {selectedOrder.createdAt.split(' ')[0]}</div>
                </div>
                <div>
                  {getOrderStatusBadge(selectedOrder.status)}
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">고객 정보</h3>
                  <div className="bg-secondary/50 p-3 rounded-md">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedOrder.customerAvatar} alt={selectedOrder.customerName} />
                        <AvatarFallback>{selectedOrder.customerName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{selectedOrder.customerName}</div>
                        <div className="text-sm text-muted-foreground">{selectedOrder.customerEmail}</div>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-medium text-muted-foreground">배송 정보</h3>
                  <div className="bg-secondary/50 p-3 rounded-md space-y-2">
                    <div className="font-medium">배송지</div>
                    <div className="text-sm">{selectedOrder.shippingAddress}</div>
                    
                    {selectedOrder.trackingNumber && (
                      <div className="pt-2">
                        <div className="font-medium">운송장 번호</div>
                        <div className="text-sm flex items-center">
                          {selectedOrder.trackingNumber}
                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">주문 정보</h3>
                  <div className="bg-secondary/50 p-3 rounded-md">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">총 금액</span>
                        <span className="font-medium">{selectedOrder.amount.toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">주문 항목</span>
                        <span>{selectedOrder.items}개</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">결제 방법</span>
                        <span>{selectedOrder.paymentMethod}</span>
                      </div>
                    </div>
                    
                    {selectedOrder.referralCode && (
                      <div className="mt-4 space-y-2">
                        <div className="font-medium">추천 정보</div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">추천 코드</span>
                          <span>{selectedOrder.referralCode}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">추천인</span>
                          <span>{selectedOrder.referredBy}</span>
                        </div>
                        <div className="mt-1">{getReferralBadge(selectedOrder.referralSource)}</div>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-sm font-medium text-muted-foreground">주문 상태 변경</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {selectedOrder.status === 'pending' && (
                        <Button 
                          variant="outline" 
                          onClick={() => handleChangeOrderStatus(selectedOrder.id, 'processing')}
                        >
                          <Check className="h-4 w-4 mr-2 text-blue-500" />
                          처리 중으로 변경
                        </Button>
                      )}
                      {selectedOrder.status === 'processing' && (
                        <Button 
                          variant="outline"
                          onClick={() => handleChangeOrderStatus(selectedOrder.id, 'shipped')}
                        >
                          <Truck className="h-4 w-4 mr-2 text-purple-500" />
                          배송 중으로 변경
                        </Button>
                      )}
                      {selectedOrder.status === 'shipped' && (
                        <Button 
                          variant="outline"
                          onClick={() => handleChangeOrderStatus(selectedOrder.id, 'delivered')}
                        >
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          배송 완료로 변경
                        </Button>
                      )}
                      {(selectedOrder.status === 'pending' || selectedOrder.status === 'processing') && (
                        <Button 
                          variant="outline"
                          onClick={() => handleChangeOrderStatus(selectedOrder.id, 'cancelled')}
                        >
                          <XCircle className="h-4 w-4 mr-2 text-gray-500" />
                          주문 취소
                        </Button>
                      )}
                      {(selectedOrder.status === 'delivered' || selectedOrder.status === 'shipped') && (
                        <Button 
                          variant="outline"
                          onClick={() => handleChangeOrderStatus(selectedOrder.id, 'refunded')}
                          className="col-span-2 text-red-500 border-red-300 hover:bg-red-50"
                        >
                          <CircleDollarSign className="h-4 w-4 mr-2" />
                          환불 처리
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground pt-4">
                    최종 업데이트: {selectedOrder.updatedAt}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}