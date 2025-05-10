import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Copy, 
  Check, 
  ShoppingBag, 
  Link as LinkIcon, 
  Share2, 
  BarChart3, 
  ArrowUpRight,
  ShoppingCart,
  RefreshCw,
  FileText,
  Tag,
  AlertCircle,
  Star
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

// 제품 타입 정의
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  discountRate?: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  description: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  referralCommission?: number;
  inStock: boolean;
}

// 추천 링크 정의
interface ProductReferralLink {
  id: string;
  productId: number;
  product: Product;
  code: string;
  url: string;
  createdAt: string;
  totalClicks: number;
  totalPurchases: number;
  totalCommission: number;
  isActive: boolean;
  lastClickedAt?: string;
  purchaseDetails: PurchaseDetail[];
}

// 구매 내역 정의
interface PurchaseDetail {
  id: string;
  purchasedAt: string;
  customerName: string;
  amount: number;
  commission: number;
  status: 'completed' | 'pending' | 'cancelled';
}

export default function ProductReferralsPage() {
  const auth = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [referralLinks, setReferralLinks] = useState<ProductReferralLink[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<string>("links");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState<string>("");
  const [showReferralForm, setShowReferralForm] = useState<boolean>(false);

  // 모의 데이터 초기화 (실제로는 API에서 데이터를 가져오도록 구현)
  useEffect(() => {
    // 로컬 스토리지에서 제품 데이터 가져오기
    const storedProducts = localStorage.getItem('adminProductsCommission');
    const storedReferralLinks = localStorage.getItem('trainerProductReferrals');
    
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      // 초기 제품 데이터 (shop/index.tsx와 동일한 데이터)
      const initialProducts: Product[] = [
        {
          id: 1,
          name: "프리미엄 반려견 훈련용 클리커",
          category: "training",
          price: 15000,
          rating: 4.8,
          reviewCount: 126,
          imageUrl: "https://images.unsplash.com/photo-1598875384021-4a23470c7997?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          description: "훈련사들이 추천하는 고품질 클리커. 명확한 소리로 반려견 훈련 효과를 높여줍니다.",
          isBestSeller: true,
          referralCommission: 10,
          inStock: true
        },
        {
          id: 2,
          name: "반려견 지능 개발 장난감 세트",
          category: "toys",
          price: 35000,
          discountRate: 15,
          rating: 4.6,
          reviewCount: 89,
          imageUrl: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          description: "반려견의 지능 개발을 돕는 다양한 퍼즐 장난감 세트. 지루함 해소와 두뇌 발달에 효과적입니다.",
          isOnSale: true,
          referralCommission: 15,
          inStock: true
        },
        {
          id: 3,
          name: "프리미엄 가죽 리드줄",
          category: "accessories",
          price: 45000,
          rating: 4.9,
          reviewCount: 203,
          imageUrl: "https://images.unsplash.com/photo-1581434271564-7e273485524c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          description: "고급 이탈리안 가죽으로 제작된 내구성 강한 리드줄. 편안한 그립감과 세련된 디자인.",
          isBestSeller: true,
          referralCommission: 12,
          inStock: true
        },
        {
          id: 4,
          name: "유기농 강아지 간식 모음",
          category: "food",
          price: 28000,
          rating: 4.7,
          reviewCount: 156,
          imageUrl: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          description: "100% 유기농 재료로 만든 건강한 간식 모음. 알레르기가 있는 반려견에게도 안전합니다.",
          isNew: true,
          referralCommission: 20,
          inStock: true
        },
        {
          id: 5,
          name: "반려견 행동 교정 훈련 매뉴얼",
          category: "training",
          price: 22000,
          discountRate: 10,
          rating: 4.5,
          reviewCount: 78,
          imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          description: "전문 훈련사가 작성한 상세한 행동 교정 가이드. 문제 행동별 단계적 훈련 방법을 제공합니다.",
          referralCommission: 25,
          inStock: true
        },
        {
          id: 6,
          name: "반려견 자동 급식기",
          category: "accessories",
          price: 89000,
          rating: 4.4,
          reviewCount: 112,
          imageUrl: "https://images.unsplash.com/photo-1603189949082-94d05ee232e2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          description: "스마트폰으로 제어 가능한 자동 급식기. 정해진 시간에 정확한 양의 사료를 제공합니다.",
          isNew: true,
          referralCommission: 8,
          inStock: false
        },
        {
          id: 7,
          name: "프리미엄 반려견 쿠션",
          category: "home",
          price: 68000,
          discountRate: 20,
          rating: 4.8,
          reviewCount: 95,
          imageUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          description: "메모리폼 소재의 편안한 반려견 쿠션. 관절이 약한 노령견에게 추천합니다.",
          isOnSale: true,
          referralCommission: 15,
          inStock: true
        },
        {
          id: 8,
          name: "반려견 털 관리 브러쉬 세트",
          category: "grooming",
          price: 42000,
          rating: 4.6,
          reviewCount: 132,
          imageUrl: "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          description: "다양한 털 길이와 유형에 맞는 브러쉬 세트. 효과적인 털 관리와 마사지 효과를 제공합니다.",
          isBestSeller: true,
          referralCommission: 18,
          inStock: true
        }
      ];
      
      setProducts(initialProducts);
      localStorage.setItem('adminProductsCommission', JSON.stringify(initialProducts));
    }
    
    if (storedReferralLinks) {
      setReferralLinks(JSON.parse(storedReferralLinks));
    } else {
      // 기존 추천인 코드 가져오기
      const storedReferrals = localStorage.getItem('trainerReferrals');
      let referralCode = "";
      
      if (storedReferrals) {
        const referrals = JSON.parse(storedReferrals);
        if (referrals.length > 0) {
          referralCode = referrals[0].code;
        }
      }
      
      if (!referralCode) {
        // 기본 추천 코드 생성
        const prefix = "TR" + (auth.userName?.toUpperCase().substring(0, 3) || "USR");
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        referralCode = prefix + randomSuffix;
      }
      
      setReferralCode(referralCode);
      
      // 초기 제품 추천 링크 데이터 (실제로는 빈 배열로 시작)
      const initialReferralLinks: ProductReferralLink[] = [
        {
          id: "pr-1",
          productId: 1,
          product: products.find(p => p.id === 1) || {} as Product,
          code: referralCode,
          url: `${window.location.origin}/shop/product/1?ref=${referralCode}`,
          createdAt: "2024-01-10T15:30:00",
          totalClicks: 28,
          totalPurchases: 5,
          totalCommission: 7500,
          isActive: true,
          lastClickedAt: "2024-02-10T09:15:00",
          purchaseDetails: [
            {
              id: "purch-1",
              purchasedAt: "2024-01-15T10:20:00",
              customerName: "김철수",
              amount: 15000,
              commission: 1500,
              status: 'completed'
            },
            {
              id: "purch-2",
              purchasedAt: "2024-01-20T14:45:00",
              customerName: "박지영",
              amount: 15000,
              commission: 1500,
              status: 'completed'
            },
            {
              id: "purch-3",
              purchasedAt: "2024-02-05T16:30:00",
              customerName: "최동훈",
              amount: 15000,
              commission: 1500,
              status: 'completed'
            }
          ]
        },
        {
          id: "pr-2",
          productId: 4,
          product: products.find(p => p.id === 4) || {} as Product,
          code: referralCode,
          url: `${window.location.origin}/shop/product/4?ref=${referralCode}`,
          createdAt: "2024-01-15T11:45:00",
          totalClicks: 35,
          totalPurchases: 4,
          totalCommission: 22400,
          isActive: true,
          lastClickedAt: "2024-02-09T13:20:00",
          purchaseDetails: [
            {
              id: "purch-4",
              purchasedAt: "2024-01-25T09:10:00",
              customerName: "이영희",
              amount: 28000,
              commission: 5600,
              status: 'completed'
            },
            {
              id: "purch-5",
              purchasedAt: "2024-02-02T15:30:00",
              customerName: "정미란",
              amount: 28000,
              commission: 5600,
              status: 'completed'
            }
          ]
        }
      ];
      
      // 초기 데이터 생성 시 제품 정보 연결
      const linksWithProducts = initialReferralLinks.map(link => {
        const product = initialProducts.find(p => p.id === link.productId);
        return {
          ...link,
          product: product || {} as Product
        };
      });
      
      setReferralLinks(linksWithProducts);
      localStorage.setItem('trainerProductReferrals', JSON.stringify(linksWithProducts));
    }
  }, [auth.userName]);

  // 필터링된 제품 목록
  const filteredProducts = products.filter(product => {
    // 카테고리 필터링
    if (categoryFilter !== "all" && product.category !== categoryFilter) {
      return false;
    }
    
    // 검색어 필터링
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // 제품 선택 토글
  const toggleProductSelection = (productId: number) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // 선택된 제품 모두 선택 해제
  const clearSelection = () => {
    setSelectedProducts([]);
  };

  // 모든 제품 선택
  const selectAllProducts = () => {
    setSelectedProducts(filteredProducts.map(product => product.id));
  };

  // 링크 복사
  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(url);
    
    setTimeout(() => {
      setCopiedLink(null);
    }, 2000);
  };

  // 선택한 제품들에 대한 추천 링크 생성
  const generateReferralLinks = () => {
    if (selectedProducts.length === 0) return;
    
    const newLinks: ProductReferralLink[] = selectedProducts.map(productId => {
      const product = products.find(p => p.id === productId);
      if (!product) return null;
      
      return {
        id: `pr-${Date.now()}-${productId}`,
        productId,
        product,
        code: referralCode,
        url: `${window.location.origin}/shop/product/${productId}?ref=${referralCode}`,
        createdAt: new Date().toISOString(),
        totalClicks: 0,
        totalPurchases: 0,
        totalCommission: 0,
        isActive: true,
        purchaseDetails: []
      };
    }).filter(Boolean) as ProductReferralLink[];
    
    const updatedLinks = [...referralLinks, ...newLinks];
    setReferralLinks(updatedLinks);
    localStorage.setItem('trainerProductReferrals', JSON.stringify(updatedLinks));
    
    // 선택 초기화
    setSelectedProducts([]);
    // 탭 전환
    setActiveTab("links");
  };

  // 링크 활성화/비활성화 토글
  const toggleLinkStatus = (linkId: string) => {
    const updatedLinks = referralLinks.map(link => {
      if (link.id === linkId) {
        return { ...link, isActive: !link.isActive };
      }
      return link;
    });
    
    setReferralLinks(updatedLinks);
    localStorage.setItem('trainerProductReferrals', JSON.stringify(updatedLinks));
  };

  // 모든 추천 통계 합산
  const getTotalStats = () => {
    return referralLinks.reduce((totals, link) => {
      return {
        clicks: totals.clicks + link.totalClicks,
        purchases: totals.purchases + link.totalPurchases,
        commission: totals.commission + link.totalCommission
      };
    }, { clicks: 0, purchases: 0, commission: 0 });
  };

  // 카테고리 레이블 가져오기
  const getCategoryLabel = (category: string) => {
    const categoryMap: {[key: string]: string} = {
      'training': '훈련용품',
      'toys': '장난감',
      'accessories': '액세서리',
      'food': '간식/사료',
      'grooming': '그루밍',
      'home': '생활용품'
    };
    
    return categoryMap[category] || category;
  };

  // 소셜 미디어 공유 함수
  const shareOnSocialMedia = (platform: string, url: string, productName: string) => {
    let shareUrl = '';
    const text = `${productName} - 이 제품을 확인해보세요! 내 추천 링크:`;
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'kakaotalk':
        // 카카오톡 공유는 SDK 필요
        alert('카카오톡으로 공유하기 기능은 카카오 SDK 연동이 필요합니다.');
        return;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">제품 추천 관리</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            제품별 추천 링크를 생성하고 추천 성과를 모니터링하세요
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <div>
            <Label htmlFor="referral-code" className="text-xs">내 추천인 코드</Label>
            <div className="flex items-center mt-1">
              <Input
                id="referral-code"
                value={referralCode}
                readOnly
                className="h-9 bg-gray-50 dark:bg-gray-800 text-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                className="ml-1"
                onClick={() => copyLink(referralCode)}
              >
                {copiedLink === referralCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <Button onClick={() => setShowReferralForm(!showReferralForm)}>
            {showReferralForm ? "취소" : "링크 생성하기"}
          </Button>
        </div>
      </div>
      
      {/* 요약 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-5">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-50 dark:bg-blue-900/20 p-3 mr-3">
              <LinkIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">총 클릭 수</p>
              <h3 className="text-2xl font-bold">{getTotalStats().clicks}회</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-5">
          <div className="flex items-center">
            <div className="rounded-full bg-green-50 dark:bg-green-900/20 p-3 mr-3">
              <ShoppingCart className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">총 구매 수</p>
              <h3 className="text-2xl font-bold">{getTotalStats().purchases}회</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-5">
          <div className="flex items-center">
            <div className="rounded-full bg-amber-50 dark:bg-amber-900/20 p-3 mr-3">
              <BarChart3 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">총 커미션</p>
              <h3 className="text-2xl font-bold">{getTotalStats().commission.toLocaleString()}원</h3>
            </div>
          </div>
        </Card>
      </div>
      
      <Tabs defaultValue="links" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="links" className="flex items-center">
            <LinkIcon className="mr-2 h-4 w-4" />
            내 추천 링크
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center">
            <ShoppingBag className="mr-2 h-4 w-4" />
            제품 목록
          </TabsTrigger>
          <TabsTrigger value="settlements" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            정산 내역
          </TabsTrigger>
        </TabsList>
        
        {/* 제품 선택 및 링크 생성 폼 */}
        {showReferralForm && activeTab === "products" && (
          <Card className="p-5 mb-6 border-primary/50 dark:border-primary/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">추천 링크 생성</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={clearSelection} disabled={selectedProducts.length === 0}>
                  선택 해제
                </Button>
                <Button variant="outline" size="sm" onClick={selectAllProducts} disabled={filteredProducts.length === 0}>
                  모두 선택
                </Button>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {selectedProducts.length}개 제품 선택됨
              </p>
              {selectedProducts.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedProducts.map(id => {
                    const product = products.find(p => p.id === id);
                    return product ? (
                      <Badge key={id} variant="outline" className="flex items-center gap-1">
                        {product.name.slice(0, 15)}{product.name.length > 15 ? '...' : ''}
                        <button 
                          className="ml-1 rounded-full p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700"
                          onClick={() => toggleProductSelection(id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </div>
            
            <Button
              className="w-full sm:w-auto"
              disabled={selectedProducts.length === 0}
              onClick={generateReferralLinks}
            >
              선택한 제품용 추천 링크 생성
            </Button>
          </Card>
        )}
        
        <TabsContent value="products" className="m-0">
          <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="search"
                  placeholder="제품 검색..."
                  className="pl-9 w-full md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="모든 카테고리" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 카테고리</SelectItem>
                  <SelectItem value="training">훈련용품</SelectItem>
                  <SelectItem value="toys">장난감</SelectItem>
                  <SelectItem value="accessories">액세서리</SelectItem>
                  <SelectItem value="food">간식/사료</SelectItem>
                  <SelectItem value="grooming">그루밍</SelectItem>
                  <SelectItem value="home">생활용품</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(product => {
                const isSelected = selectedProducts.includes(product.id);
                const existingLink = referralLinks.find(link => link.productId === product.id);
                
                return (
                  <Card 
                    key={product.id} 
                    className={`overflow-hidden border transition-all duration-200 ${
                      isSelected ? 'border-primary dark:border-primary' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="relative">
                      <div className="aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="absolute top-2 left-2">
                        <Checkbox 
                          checked={isSelected}
                          onCheckedChange={() => toggleProductSelection(product.id)}
                          className="h-5 w-5 border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </div>
                      
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        {product.isNew && (
                          <Badge className="px-2 py-1 bg-blue-500">신상품</Badge>
                        )}
                        {product.isBestSeller && (
                          <Badge variant="success" className="px-2 py-1">베스트셀러</Badge>
                        )}
                        {product.isOnSale && (
                          <Badge variant="destructive" className="px-2 py-1">할인 중</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center mb-1">
                        <Badge variant="outline">
                          {getCategoryLabel(product.category)}
                        </Badge>
                        {existingLink && (
                          <Badge variant="secondary" className="ml-2">
                            링크 있음
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="font-semibold line-clamp-1 mt-2 mb-1">{product.name}</h3>
                      
                      <div className="flex items-center mb-1">
                        <div className="flex items-center text-amber-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="ml-1 text-sm font-medium">{product.rating}</span>
                        </div>
                        <span className="mx-1 text-gray-300 dark:text-gray-600">|</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">리뷰 {product.reviewCount}개</span>
                      </div>
                      
                      <div className="flex items-center mb-2">
                        {product.discountRate ? (
                          <>
                            <span className="font-bold text-lg">
                              {Math.round(product.price * (1 - product.discountRate / 100)).toLocaleString()}원
                            </span>
                            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                              {product.price.toLocaleString()}원
                            </span>
                          </>
                        ) : (
                          <span className="font-bold text-lg">{product.price.toLocaleString()}원</span>
                        )}
                      </div>
                      
                      <div className="flex gap-2 mb-3">
                        <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/30">
                          <Tag className="h-3 w-3" />
                          추천시 {product.referralCommission}% 적립
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Button 
                          variant={isSelected ? "default" : "outline"}
                          className="w-full"
                          onClick={() => toggleProductSelection(product.id)}
                        >
                          {isSelected ? "선택됨" : "선택하기"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <AlertCircle className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                검색 결과가 없습니다
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                다른 검색어를 입력하거나 필터를 변경해보세요.
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                필터 초기화
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="links" className="m-0">
          {referralLinks.length > 0 ? (
            <div className="space-y-6">
              {referralLinks.map((link) => (
                <Card key={link.id} className="p-5 border border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-20 lg:w-24 shrink-0">
                      <div className="aspect-square rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img 
                          src={link.product.imageUrl} 
                          alt={link.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{link.product.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(link.createdAt).toLocaleDateString('ko-KR', { 
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })} 생성
                          </p>
                        </div>
                        <div className="mt-2 sm:mt-0 flex items-center">
                          <Badge variant={link.isActive ? 'success' : 'secondary'}>
                            {link.isActive ? '활성' : '비활성'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded p-2 text-sm font-mono text-gray-700 dark:text-gray-300 truncate">
                            {link.url}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => copyLink(link.url)}>
                              {copiedLink === link.url ? (
                                <span className="flex items-center"><Check className="h-4 w-4 mr-1" /> 복사됨</span>
                              ) : (
                                <span className="flex items-center"><Copy className="h-4 w-4 mr-1" /> 복사</span>
                              )}
                            </Button>
                            
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Share2 className="h-4 w-4 mr-1" />
                                  공유
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-2" align="end">
                                <div className="flex gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => shareOnSocialMedia('twitter', link.url, link.product.name)}
                                  >
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M22 5.8a8.49 8.49 0 0 1-2.36.64 4.13 4.13 0 0 0 1.81-2.27 8.21 8.21 0 0 1-2.61 1 4.1 4.1 0 0 0-7 3.74 11.64 11.64 0 0 1-8.45-4.29 4.16 4.16 0 0 0-.55 2.07 4.09 4.09 0 0 0 1.82 3.41 4.05 4.05 0 0 1-1.86-.51v.05a4.1 4.1 0 0 0 3.3 4 3.93 3.93 0 0 1-1.1.15 3.74 3.74 0 0 1-.77-.07 4.14 4.14 0 0 0 3.85 2.84 8.23 8.23 0 0 1-5.1 1.75A7.67 7.67 0 0 1 2 18.34a11.79 11.79 0 0 0 18.19-9.96v-.54a8.58 8.58 0 0 0 2.01-2.14"/>
                                    </svg>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => shareOnSocialMedia('facebook', link.url, link.product.name)}
                                  >
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M20.9 2H3.1A1.1 1.1 0 0 0 2 3.1v17.8A1.1 1.1 0 0 0 3.1 22h9.58v-7.75h-2.6v-3h2.6V9a3.64 3.64 0 0 1 3.88-4 20.26 20.26 0 0 1 2.33.12v2.7H17.3c-1.26 0-1.5.6-1.5 1.47v1.93h3l-.39 3H15.8V22h5.1a1.1 1.1 0 0 0 1.1-1.1V3.1A1.1 1.1 0 0 0 20.9 2Z"/>
                                    </svg>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => shareOnSocialMedia('kakaotalk', link.url, link.product.name)}
                                  >
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M12 3C6.48 3 2 6.48 2 11c0 2.83 1.46 5.34 3.68 6.88l-1.59 4.8c-.15.44.3.84.72.65l5.41-2.4c.6.08 1.21.11 1.83.11 5.52 0 10-3.48 10-8S17.52 3 12 3z"/>
                                    </svg>
                                  </Button>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                          <p className="text-xs text-gray-500 dark:text-gray-400">총 클릭 수</p>
                          <p className="text-lg font-semibold">{link.totalClicks}회</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                          <p className="text-xs text-gray-500 dark:text-gray-400">구매 완료</p>
                          <p className="text-lg font-semibold">{link.totalPurchases}회</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                          <p className="text-xs text-gray-500 dark:text-gray-400">총 커미션</p>
                          <p className="text-lg font-semibold">{link.totalCommission.toLocaleString()}원</p>
                        </div>
                      </div>
                      
                      {/* 구매 내역 */}
                      {link.purchaseDetails.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">최근 구매 내역</h4>
                          <div className="space-y-2">
                            {link.purchaseDetails.slice(0, 2).map(purchase => (
                              <div key={purchase.id} className="flex justify-between text-sm">
                                <div>
                                  <p className="font-medium">{purchase.customerName}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(purchase.purchasedAt).toLocaleDateString('ko-KR', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-green-600 dark:text-green-400">
                                    +{purchase.commission.toLocaleString()}원
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {purchase.amount.toLocaleString()}원 구매
                                  </p>
                                </div>
                              </div>
                            ))}
                            
                            {link.purchaseDetails.length > 2 && (
                              <Button variant="link" size="sm" className="px-0 h-6 text-xs">
                                더 보기 ({link.purchaseDetails.length - 2}건 더) <ArrowUpRight className="ml-1 h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-end mt-4">
                        <Button 
                          variant={link.isActive ? "outline" : "default"}
                          size="sm"
                          onClick={() => toggleLinkStatus(link.id)}
                        >
                          {link.isActive ? '비활성화' : '활성화'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <FileText className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                추천 링크가 없습니다
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                '제품 목록' 탭에서 제품을 선택하고 추천 링크를 생성하세요.
              </p>
              <Button onClick={() => setActiveTab("products")}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                제품 목록으로 이동
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="settlements" className="m-0">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">정산 내역</h3>
            
            <Table>
              <TableCaption>최근 3개월 정산 내역</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>정산일</TableHead>
                  <TableHead>정산 기간</TableHead>
                  <TableHead>추천 건수</TableHead>
                  <TableHead>구매 건수</TableHead>
                  <TableHead className="text-right">정산 금액</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">2024년 2월 15일</TableCell>
                  <TableCell>2024년 1월 1일 - 1월 31일</TableCell>
                  <TableCell>42회</TableCell>
                  <TableCell>7회</TableCell>
                  <TableCell className="text-right">75,400원</TableCell>
                  <TableCell><Badge variant="success">완료</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">2024년 1월 15일</TableCell>
                  <TableCell>2023년 12월 1일 - 12월 31일</TableCell>
                  <TableCell>35회</TableCell>
                  <TableCell>5회</TableCell>
                  <TableCell className="text-right">62,500원</TableCell>
                  <TableCell><Badge variant="success">완료</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">2023년 12월 15일</TableCell>
                  <TableCell>2023년 11월 1일 - 11월 30일</TableCell>
                  <TableCell>28회</TableCell>
                  <TableCell>3회</TableCell>
                  <TableCell className="text-right">45,000원</TableCell>
                  <TableCell><Badge variant="success">완료</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">2024년 3월 15일</TableCell>
                  <TableCell>2024년 2월 1일 - 2월 29일</TableCell>
                  <TableCell>51회</TableCell>
                  <TableCell>9회</TableCell>
                  <TableCell className="text-right">87,600원</TableCell>
                  <TableCell><Badge variant="secondary">예정</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
              <h4 className="text-sm font-medium mb-2">정산 정책 안내</h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300 list-disc pl-4">
                <li>정산은 매월 15일에 진행됩니다.</li>
                <li>정산 금액이 10,000원 미만인 경우 다음 달로 이월됩니다.</li>
                <li>구매 취소 시 해당 커미션은 차감됩니다.</li>
                <li>정산 관련 문의는 고객센터로 연락해주세요.</li>
              </ul>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}