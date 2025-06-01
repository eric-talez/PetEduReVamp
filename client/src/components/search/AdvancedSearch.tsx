import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

export interface SearchFilters {
  query: string;
  category: string;
  location: string;
  priceRange: [number, number];
  difficulty: string;
  startDate: Date | null;
  endDate: Date | null;
  features: string[];
  sortBy: string;
  rating: number;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading?: boolean;
  initialFilters?: Partial<SearchFilters>;
}

const categories = [
  { value: "all", label: "전체 카테고리" },
  { value: "basic-training", label: "기본 훈련" },
  { value: "advanced-training", label: "고급 훈련" },
  { value: "behavior-correction", label: "행동 교정" },
  { value: "puppy-training", label: "퍼피 트레이닝" },
  { value: "agility", label: "애질리티" },
  { value: "therapy", label: "치료견 훈련" },
  { value: "grooming", label: "그루밍" },
  { value: "health", label: "건강 관리" }
];

const locations = [
  { value: "all", label: "전체 지역" },
  { value: "seoul", label: "서울특별시" },
  { value: "busan", label: "부산광역시" },
  { value: "daegu", label: "대구광역시" },
  { value: "incheon", label: "인천광역시" },
  { value: "gwangju", label: "광주광역시" },
  { value: "daejeon", label: "대전광역시" },
  { value: "ulsan", label: "울산광역시" },
  { value: "sejong", label: "세종특별자치시" },
  { value: "gyeonggi", label: "경기도" },
  { value: "gangwon", label: "강원도" },
  { value: "chungbuk", label: "충청북도" },
  { value: "chungnam", label: "충청남도" },
  { value: "jeonbuk", label: "전라북도" },
  { value: "jeonnam", label: "전라남도" },
  { value: "gyeongbuk", label: "경상북도" },
  { value: "gyeongnam", label: "경상남도" },
  { value: "jeju", label: "제주특별자치도" }
];

const difficulties = [
  { value: "all", label: "모든 난이도" },
  { value: "beginner", label: "초급" },
  { value: "intermediate", label: "중급" },
  { value: "advanced", label: "고급" },
  { value: "expert", label: "전문가" }
];

const features = [
  { id: "one-on-one", label: "1:1 수업" },
  { id: "group-class", label: "그룹 수업" },
  { id: "online", label: "온라인 수업" },
  { id: "offline", label: "오프라인 수업" },
  { id: "certificate", label: "수료증 발급" },
  { id: "weekend", label: "주말 수업" },
  { id: "evening", label: "저녁 수업" },
  { id: "pickup", label: "픽업 서비스" },
  { id: "boarding", label: "위탁 훈련" }
];

const sortOptions = [
  { value: "relevance", label: "관련도순" },
  { value: "price-low", label: "가격 낮은순" },
  { value: "price-high", label: "가격 높은순" },
  { value: "rating", label: "평점순" },
  { value: "newest", label: "최신순" },
  { value: "popular", label: "인기순" },
  { value: "distance", label: "거리순" }
];

export function AdvancedSearch({ onSearch, isLoading = false, initialFilters }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: initialFilters?.query || "",
    category: initialFilters?.category || "all",
    location: initialFilters?.location || "all",
    priceRange: initialFilters?.priceRange || [0, 500000],
    difficulty: initialFilters?.difficulty || "all",
    startDate: initialFilters?.startDate || null,
    endDate: initialFilters?.endDate || null,
    features: initialFilters?.features || [],
    sortBy: initialFilters?.sortBy || "relevance",
    rating: initialFilters?.rating || 0
  });

  const handleFeatureChange = (featureId: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      features: checked 
        ? [...prev.features, featureId]
        : prev.features.filter(f => f !== featureId)
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    const resetFilters: SearchFilters = {
      query: "",
      category: "all",
      location: "all",
      priceRange: [0, 500000],
      difficulty: "all",
      startDate: null,
      endDate: null,
      features: [],
      sortBy: "relevance",
      rating: 0
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  const activeFiltersCount = [
    filters.category !== "all",
    filters.location !== "all",
    filters.difficulty !== "all",
    filters.priceRange[0] > 0 || filters.priceRange[1] < 500000,
    filters.startDate !== null,
    filters.endDate !== null,
    filters.features.length > 0,
    filters.rating > 0
  ].filter(Boolean).length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>고급 검색</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}개 필터 적용됨
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 검색어 */}
        <div className="space-y-2">
          <Label htmlFor="search-query">검색어</Label>
          <Input
            id="search-query"
            placeholder="강의명, 훈련사명, 기관명을 입력하세요"
            value={filters.query}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 카테고리 */}
          <div className="space-y-2">
            <Label>카테고리</Label>
            <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 지역 */}
          <div className="space-y-2">
            <Label>지역</Label>
            <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.value} value={location.value}>
                    {location.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 난이도 */}
          <div className="space-y-2">
            <Label>난이도</Label>
            <Select value={filters.difficulty} onValueChange={(value) => setFilters(prev => ({ ...prev, difficulty: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 정렬 */}
          <div className="space-y-2">
            <Label>정렬</Label>
            <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 가격 범위 */}
        <div className="space-y-4">
          <Label>가격 범위</Label>
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
              min={0}
              max={500000}
              step={10000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>{filters.priceRange[0].toLocaleString()}원</span>
              <span>{filters.priceRange[1].toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* 최소 평점 */}
        <div className="space-y-4">
          <Label>최소 평점</Label>
          <div className="px-2">
            <Slider
              value={[filters.rating]}
              onValueChange={(value) => setFilters(prev => ({ ...prev, rating: value[0] }))}
              min={0}
              max={5}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>0점</span>
              <span className="font-medium">{filters.rating}점 이상</span>
              <span>5점</span>
            </div>
          </div>
        </div>

        {/* 날짜 범위 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>시작일</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.startDate ? format(filters.startDate, "PPP", { locale: ko }) : "날짜 선택"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={filters.startDate || undefined}
                  onSelect={(date) => setFilters(prev => ({ ...prev, startDate: date || null }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>종료일</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.endDate ? format(filters.endDate, "PPP", { locale: ko }) : "날짜 선택"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={filters.endDate || undefined}
                  onSelect={(date) => setFilters(prev => ({ ...prev, endDate: date || null }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Separator />

        {/* 특징 */}
        <div className="space-y-3">
          <Label>특징</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {features.map((feature) => (
              <div key={feature.id} className="flex items-center space-x-2">
                <Checkbox
                  id={feature.id}
                  checked={filters.features.includes(feature.id)}
                  onCheckedChange={(checked) => handleFeatureChange(feature.id, !!checked)}
                />
                <Label htmlFor={feature.id} className="text-sm font-normal">
                  {feature.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={handleSearch} disabled={isLoading} className="flex-1">
            {isLoading ? "검색 중..." : "검색"}
          </Button>
          <Button variant="outline" onClick={handleReset} className="flex-1">
            초기화
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}