import { useState, useEffect } from "react";
import { AdvancedSearch, type SearchFilters } from "@/components/search/AdvancedSearch";
import { SearchResults } from "@/components/search/SearchResults";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface SearchResult {
  id: number;
  type: 'course' | 'trainer' | 'institute';
  title: string;
  description?: string;
  image?: string;
  price?: number;
  rating?: number;
  reviewCount?: number;
  location?: string;
  category?: string;
  difficulty?: string;
  duration?: string;
  startDate?: Date;
  endDate?: Date;
  maxParticipants?: number;
  currentParticipants?: number;
  features?: string[];
  trainer?: {
    id: number;
    name: string;
    avatar?: string;
    specialty?: string;
  };
  institute?: {
    id: number;
    name: string;
    location?: string;
  };
}

interface SearchResponse {
  results: SearchResult[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export default function SearchPage() {
  // URL 파라미터에서 초기 검색어 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('q') || '';
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: initialQuery,
    category: "all",
    location: "all",
    priceRange: [0, 500000],
    difficulty: "all",
    startDate: null,
    endDate: null,
    features: [],
    sortBy: "relevance",
    rating: 0
  });

  const [currentPage, setCurrentPage] = useState(1);

  // 검색 실행
  const { data: searchData, isLoading, refetch } = useQuery<SearchResponse>({
    queryKey: ['/api/search', filters, currentPage],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      // 기본 검색 매개변수
      if (filters.query) searchParams.append('q', filters.query);
      if (filters.category !== 'all') searchParams.append('category', filters.category);
      if (filters.location !== 'all') searchParams.append('location', filters.location);
      if (filters.difficulty !== 'all') searchParams.append('difficulty', filters.difficulty);
      if (filters.sortBy !== 'relevance') searchParams.append('sortBy', filters.sortBy);
      if (filters.rating > 0) searchParams.append('minRating', filters.rating.toString());
      
      // 가격 범위
      if (filters.priceRange[0] > 0) searchParams.append('minPrice', filters.priceRange[0].toString());
      if (filters.priceRange[1] < 500000) searchParams.append('maxPrice', filters.priceRange[1].toString());
      
      // 날짜 범위
      if (filters.startDate) searchParams.append('startDate', filters.startDate.toISOString());
      if (filters.endDate) searchParams.append('endDate', filters.endDate.toISOString());
      
      // 특징
      filters.features.forEach(feature => searchParams.append('features', feature));
      
      // 페이지네이션
      searchParams.append('page', currentPage.toString());
      searchParams.append('limit', '10');

      const response = await apiRequest('GET', `/api/search?${searchParams.toString()}`);
      return response.json();
    },
    enabled: false // 수동으로 검색 실행
  });

  // URL에서 초기 검색어 추출
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('q');
    if (initialQuery) {
      setFilters(prev => ({ ...prev, query: initialQuery }));
      refetch();
    }
  }, [refetch]);

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">검색</h1>
        <p className="text-gray-600">원하는 강의, 훈련사, 기관을 찾아보세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 검색 필터 */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <AdvancedSearch
              onSearch={handleSearch}
              isLoading={isLoading}
              initialFilters={filters}
            />
          </div>
        </div>

        {/* 검색 결과 */}
        <div className="lg:col-span-3">
          <SearchResults
            results={searchData?.results || []}
            isLoading={isLoading}
            totalCount={searchData?.totalCount}
            currentPage={currentPage}
            totalPages={searchData?.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}