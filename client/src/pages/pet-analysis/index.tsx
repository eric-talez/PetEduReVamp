import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PetBehaviorAnalysis } from '@/components/PetBehaviorAnalysis';
import { TrainingProgressChart } from '@/components/TrainingProgressChart';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function PetAnalysisPage() {
  const [selectedPetId, setSelectedPetId] = useState<number | undefined>(undefined);
  
  // 사용자의 반려동물 목록 가져오기
  const { 
    data: pets = [],
    isLoading,
    error 
  } = useQuery<any[]>({
    queryKey: ['/api/pets'],
    staleTime: 5 * 60 * 1000, // 5분
  });
  
  // 첫 번째 반려동물을 기본 선택
  useEffect(() => {
    if (pets.length > 0 && !selectedPetId) {
      setSelectedPetId(pets[0].id);
    }
  }, [pets, selectedPetId]);
  
  // 현재 선택된 반려동물 정보
  const selectedPet = pets.find(pet => pet.id === selectedPetId);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">반려동물 정보 로딩 중...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">오류가 발생했습니다</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          반려동물 정보를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.
        </p>
      </div>
    );
  }
  
  if (pets.length === 0) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">등록된 반려동물이 없습니다</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          AI 분석을 시작하려면 먼저 반려동물을 등록해주세요.
        </p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">AI 반려동물 분석</h1>
          <p className="text-gray-600 dark:text-gray-400">
            반려동물의 행동과 훈련 진행 상황을 AI로 분석하고 맞춤형 조언을 받아보세요
          </p>
        </div>
        
        <div className="w-full sm:w-auto min-w-[240px]">
          <Select
            value={selectedPetId?.toString()}
            onValueChange={(value) => setSelectedPetId(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="반려동물 선택" />
            </SelectTrigger>
            <SelectContent>
              {pets.map((pet: any) => (
                <SelectItem key={pet.id} value={pet.id.toString()}>
                  {pet.name} ({pet.breed})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {selectedPet && (
        <Tabs defaultValue="behavior" className="w-full">
          <TabsList className="mb-8 w-full justify-start">
            <TabsTrigger value="behavior">행동 분석</TabsTrigger>
            <TabsTrigger value="training">훈련 그래프</TabsTrigger>
          </TabsList>
          
          <TabsContent value="behavior">
            <PetBehaviorAnalysis 
              petId={selectedPet.id} 
              petName={selectedPet.name} 
            />
          </TabsContent>
          
          <TabsContent value="training">
            <TrainingProgressChart 
              petId={selectedPet.id} 
              petName={selectedPet.name} 
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}