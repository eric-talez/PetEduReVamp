import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  Calendar,
  DollarSign,
  Award,
  Heart,
  BookOpen,
  User,
  Building
} from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

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

interface SearchResultsProps {
  results: SearchResult[];
  isLoading?: boolean;
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
}

const categoryLabels: Record<string, string> = {
  "basic-training": "기본 훈련",
  "advanced-training": "고급 훈련",
  "behavior-correction": "행동 교정",
  "puppy-training": "퍼피 트레이닝",
  "agility": "애질리티",
  "therapy": "치료견 훈련",
  "grooming": "그루밍",
  "health": "건강 관리"
};

const difficultyLabels: Record<string, string> = {
  "beginner": "초급",
  "intermediate": "중급",
  "advanced": "고급",
  "expert": "전문가"
};

const featureLabels: Record<string, string> = {
  "one-on-one": "1:1 수업",
  "group-class": "그룹 수업",
  "online": "온라인",
  "offline": "오프라인",
  "certificate": "수료증",
  "weekend": "주말",
  "evening": "저녁",
  "pickup": "픽업",
  "boarding": "위탁"
};

function CourseCard({ result }: { result: SearchResult }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {result.image && (
            <div className="flex-shrink-0">
              <img 
                src={result.image} 
                alt={result.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
            </div>
          )}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <Link href={`/courses/${result.id}`}>
                  <h3 className="text-lg font-semibold hover:text-primary cursor-pointer">
                    {result.title}
                  </h3>
                </Link>
                {result.category && (
                  <Badge variant="secondary" className="mt-1">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {categoryLabels[result.category] || result.category}
                  </Badge>
                )}
              </div>
              <div className="text-right">
                {result.price && (
                  <div className="text-lg font-bold text-primary">
                    {result.price.toLocaleString()}원
                  </div>
                )}
                {result.rating && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    {result.rating} ({result.reviewCount || 0})
                  </div>
                )}
              </div>
            </div>

            {result.description && (
              <p className="text-gray-600 text-sm line-clamp-2">
                {result.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2 text-xs">
              {result.difficulty && (
                <Badge variant="outline">
                  <Award className="w-3 h-3 mr-1" />
                  {difficultyLabels[result.difficulty] || result.difficulty}
                </Badge>
              )}
              {result.duration && (
                <Badge variant="outline">
                  <Clock className="w-3 h-3 mr-1" />
                  {result.duration}
                </Badge>
              )}
              {result.maxParticipants && (
                <Badge variant="outline">
                  <Users className="w-3 h-3 mr-1" />
                  {result.currentParticipants || 0}/{result.maxParticipants}명
                </Badge>
              )}
              {result.location && (
                <Badge variant="outline">
                  <MapPin className="w-3 h-3 mr-1" />
                  {result.location}
                </Badge>
              )}
            </div>

            {result.features && result.features.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {result.features.slice(0, 3).map((feature) => (
                  <Badge key={feature} variant="secondary" className="text-xs">
                    {featureLabels[feature] || feature}
                  </Badge>
                ))}
                {result.features.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{result.features.length - 3}개
                  </Badge>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              {result.trainer && (
                <Link href={`/trainers/${result.trainer.id}`}>
                  <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary cursor-pointer">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={result.trainer.avatar} />
                      <AvatarFallback>{result.trainer.name[0]}</AvatarFallback>
                    </Avatar>
                    <span>{result.trainer.name}</span>
                    {result.trainer.specialty && (
                      <span className="text-xs text-gray-500">· {result.trainer.specialty}</span>
                    )}
                  </div>
                </Link>
              )}
              {result.startDate && (
                <div className="text-xs text-gray-500">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  {format(result.startDate, "M월 d일", { locale: ko })} 시작
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TrainerCard({ result }: { result: SearchResult }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <Avatar className="w-16 h-16">
              <AvatarImage src={result.image} />
              <AvatarFallback>{result.title[0]}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <Link href={`/trainers/${result.id}`}>
                  <h3 className="text-lg font-semibold hover:text-primary cursor-pointer">
                    {result.title}
                  </h3>
                </Link>
                {result.category && (
                  <Badge variant="secondary" className="mt-1">
                    <User className="w-3 h-3 mr-1" />
                    {categoryLabels[result.category] || result.category}
                  </Badge>
                )}
              </div>
              <div className="text-right">
                {result.rating && (
                  <div className="flex items-center text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    {result.rating} ({result.reviewCount || 0})
                  </div>
                )}
              </div>
            </div>

            {result.description && (
              <p className="text-gray-600 text-sm line-clamp-2">
                {result.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2 text-xs">
              {result.location && (
                <Badge variant="outline">
                  <MapPin className="w-3 h-3 mr-1" />
                  {result.location}
                </Badge>
              )}
              {result.features && result.features.map((feature) => (
                <Badge key={feature} variant="outline">
                  {featureLabels[feature] || feature}
                </Badge>
              ))}
            </div>

            {result.institute && (
              <Link href={`/institutes/${result.institute.id}`}>
                <div className="text-sm text-gray-600 hover:text-primary cursor-pointer">
                  <Building className="w-3 h-3 inline mr-1" />
                  {result.institute.name}
                  {result.institute.location && (
                    <span className="text-xs text-gray-500 ml-1">· {result.institute.location}</span>
                  )}
                </div>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InstituteCard({ result }: { result: SearchResult }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {result.image && (
            <div className="flex-shrink-0">
              <img 
                src={result.image} 
                alt={result.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
            </div>
          )}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <Link href={`/institutes/${result.id}`}>
                  <h3 className="text-lg font-semibold hover:text-primary cursor-pointer">
                    {result.title}
                  </h3>
                </Link>
                <Badge variant="secondary" className="mt-1">
                  <Building className="w-3 h-3 mr-1" />
                  훈련기관
                </Badge>
              </div>
              <div className="text-right">
                {result.rating && (
                  <div className="flex items-center text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    {result.rating} ({result.reviewCount || 0})
                  </div>
                )}
              </div>
            </div>

            {result.description && (
              <p className="text-gray-600 text-sm line-clamp-2">
                {result.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2 text-xs">
              {result.location && (
                <Badge variant="outline">
                  <MapPin className="w-3 h-3 mr-1" />
                  {result.location}
                </Badge>
              )}
              {result.features && result.features.map((feature) => (
                <Badge key={feature} variant="outline">
                  {featureLabels[feature] || feature}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SearchResults({ results, isLoading, totalCount, currentPage = 1, totalPages = 1, onPageChange, suggestions, onSuggestionClick }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <BookOpen className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
        <p className="text-gray-600 mb-6">다른 검색어로 시도해보세요.</p>
        
        {suggestions && suggestions.length > 0 && (
          <div className="max-w-md mx-auto">
            <h4 className="text-sm font-medium text-gray-900 mb-3">추천 검색어</h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick?.(suggestion)}
                  className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          총 {totalCount?.toLocaleString() || results.length}개의 결과
        </div>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={`${result.type}-${result.id}-${index}`}>
            {result.type === 'course' && <CourseCard result={result} />}
            {result.type === 'trainer' && <TrainerCard result={result} />}
            {result.type === 'institute' && <InstituteCard result={result} />}
          </div>
        ))}
      </div>

      {totalPages > 1 && onPageChange && (
        <div className="flex justify-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            이전
          </Button>
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            const page = Math.max(1, currentPage - 2) + i;
            if (page > totalPages) return null;
            return (
              <Button 
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            );
          })}
          <Button 
            variant="outline" 
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}