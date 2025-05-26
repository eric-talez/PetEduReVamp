
import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: 'active' | 'inactive';
}

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 1,
    name: '프리미엄 강아지 사료',
    price: 45000,
    stock: 100,
    category: '사료',
    status: 'active'
  },
  {
    id: 2,
    name: '반려견 장난감 세트',
    price: 25000,
    stock: 50,
    category: '장난감',
    status: 'active'
  }
];

export default function AdminShopPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-500">접근 권한이 없습니다</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">상품 관리</h1>
        <Button className="gap-2">
          <Plus size={20} />
          새 상품 등록
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>상품 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="상품명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>상품명</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>가격</TableHead>
                  <TableHead>재고</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-right">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.price.toLocaleString()}원</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                        {product.status === 'active' ? '판매중' : '판매중지'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="mr-2">
                        <Pencil size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500">
                        <Trash2 size={18} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
