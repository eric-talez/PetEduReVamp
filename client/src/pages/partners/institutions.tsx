
import React from 'react';
import { Card } from '@/components/ui/card';
import { Building, MapPin, Award, Users } from 'lucide-react';

export default function InstitutionsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">제휴 기관</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Building className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">반려동물 훈련학교 {i}</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>서울시 강남구</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Award className="w-4 h-4" />
                <span>인증 기관</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span>전문 훈련사 5명</span>
              </div>
              <button className="w-full mt-4 bg-primary text-white py-2 rounded-lg hover:bg-primary/90">
                상세 정보
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
