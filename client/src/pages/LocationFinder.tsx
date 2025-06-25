import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Star, Search, Filter } from 'lucide-react';

interface LocationItem {
  id: number;
  name: string;
  type: string;
  address: string;
  rating: number;
  distance: number;
}

export default function LocationFinder() {
  const [locations] = useState<LocationItem[]>([
    {
      id: 1,
      name: '서울 펫 트레이닝 센터',
      type: 'training',
      address: '서울시 강남구 테헤란로 123',
      rating: 4.8,
      distance: 0.8
    },
    {
      id: 2,
      name: '프리미엄 펫 그루밍',
      type: 'grooming',
      address: '서울시 마포구 연남동 123-45',
      rating: 4.6,
      distance: 3.1
    }
  ]);

  console.log('LocationFinder 컴포넌트 렌더링됨');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            🐕 반려견 서비스 지도
          </h1>
          <p className="text-gray-600 text-lg">
            훈련소, 미용실, 병원 등 반려견 관련 서비스를 찾아보세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <Input
                placeholder="지역명이나 업체명을 검색하세요..."
                className="pl-12 py-3"
              />
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                서비스 종류
              </h3>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">
                📍 주변 업체 ({locations.length}개)
              </h3>
              <div className="space-y-3">
                {locations.map((location) => (
                  <div 
                    key={location.id}
                    className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:border-blue-500 cursor-pointer transition-all"
                  >
                    <div className="font-bold text-gray-800 mb-1">
                      {location.name}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{location.address}</div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{location.rating}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {location.distance}km
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-96 bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">지도 영역</p>
                  <p className="text-sm">위치 찾기 기능이 정상 작동 중입니다</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}