import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Dog } from "lucide-react";

interface DogSubject {
  id: number;
  name: string;
  breed: string;
  ageMonths: number;
  gender: string;
  weight: number;
  healthStatus: string;
}

interface DogSelectorProps {
  selectedDogId: number | null;
  onSelectDog: (dogId: number | null, dog: DogSubject | null) => void;
  showDetails?: boolean;
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function DogSelector({
  selectedDogId,
  onSelectDog,
  showDetails = false,
  label = "분석 대상 강아지",
  placeholder = "강아지를 선택하세요",
  className = "",
}: DogSelectorProps) {
  const { data: dogs, isLoading, error } = useQuery<DogSubject[]>({
    queryKey: ['/api/research/dog-subjects'],
  });

  const selectedDog = dogs?.find(d => d.id === selectedDogId) || null;

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'male_neutered': return '수컷 (중성화O)';
      case 'male': return '수컷';
      case 'female_neutered': return '암컷 (중성화O)';
      case 'female': return '암컷';
      default: return gender;
    }
  };

  const getAgeLabel = (months: number) => {
    if (months < 12) return `${months}개월`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return `${years}세`;
    return `${years}세 ${remainingMonths}개월`;
  };

  const getHealthBadge = (status: string) => {
    switch (status) {
      case 'good':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">양호</Badge>;
      case 'minor_issues':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">경미한 이상</Badge>;
      case 'under_treatment':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">치료 중</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 text-gray-500 ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">강아지 목록 불러오는 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-red-500 text-sm ${className}`}>
        강아지 목록을 불러올 수 없습니다.
      </div>
    );
  }

  if (!dogs || dogs.length === 0) {
    return (
      <div className={`p-4 bg-yellow-50 border border-yellow-200 rounded-lg ${className}`}>
        <div className="flex items-center gap-2 text-yellow-800">
          <Dog className="w-5 h-5" />
          <span className="font-medium">등록된 강아지가 없습니다</span>
        </div>
        <p className="text-sm text-yellow-600 mt-1">
          연구 대상 탭에서 먼저 강아지를 등록해주세요.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <Select
          value={selectedDogId?.toString() || ""}
          onValueChange={(value) => {
            if (value) {
              const dogId = parseInt(value);
              const dog = dogs.find(d => d.id === dogId) || null;
              onSelectDog(dogId, dog);
            } else {
              onSelectDog(null, null);
            }
          }}
        >
          <SelectTrigger className="w-full" data-testid="select-dog">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {dogs.map((dog) => (
              <SelectItem key={dog.id} value={dog.id.toString()} data-testid={`select-dog-${dog.id}`}>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{dog.name}</span>
                  <span className="text-gray-500 text-sm">({dog.breed})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showDetails && selectedDog && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl">
                🐕
              </div>
              <div>
                <div className="font-bold text-lg">{selectedDog.name}</div>
                <div className="text-sm text-gray-600">{selectedDog.breed}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">나이:</span>
                <span className="font-medium">{getAgeLabel(selectedDog.ageMonths)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">성별:</span>
                <span className="font-medium">{getGenderLabel(selectedDog.gender)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">체중:</span>
                <span className="font-medium">{selectedDog.weight}kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">건강:</span>
                {getHealthBadge(selectedDog.healthStatus)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export type { DogSubject };
