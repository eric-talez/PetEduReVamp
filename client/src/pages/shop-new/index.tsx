import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag, Star } from "lucide-react";

export default function ShopNewPage() {
  console.log("새로운 ShopNewPage 컴포넌트 렌더링");
  
  // 샘플 제품 데이터
  const sampleProducts = [
    {
      id: 1,
      name: "프리미엄 반려견 훈련용 클리커",
      price: 15000,
      rating: 4.8,
      imageUrl: "https://images.unsplash.com/photo-1598875384021-4a23470c7997?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
      id: 2,
      name: "반려견 지능 개발 장난감 세트",
      price: 35000, 
      rating: 4.6,
      imageUrl: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
      id: 3,
      name: "프리미엄 가죽 리드줄",
      price: 45000,
      rating: 4.9,
      imageUrl: "https://images.unsplash.com/photo-1581434271564-7e273485524c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    }
  ];
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">반려견 용품 쇼핑</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">품질 검증된 반려견 용품과 전문가 추천 제품을 한곳에서</p>
        </div>
        <Button className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4" />
          장바구니
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative">
              <img 
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center text-amber-500 mb-2">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1 text-sm">{product.rating}</span>
              </div>
              <h3 className="font-semibold mb-2">{product.name}</h3>
              <div className="flex justify-between items-center">
                <span className="font-bold">{product.price.toLocaleString()}원</span>
                <Button variant="outline" size="sm">
                  장바구니에 추가
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}