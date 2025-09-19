import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useQuery } from '@tanstack/react-query';

// 배너 타입 정의
interface Banner {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
}

export function BannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideLiveRegionId = "banner-live-region";

  // 데이터베이스에서 활성 배너 조회
  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['/api/banners/active'],
    queryFn: async () => {
      const response = await fetch('/api/banners/active');
      if (!response.ok) {
        throw new Error('배너를 불러오는데 실패했습니다');
      }
      return response.json() as Promise<Banner[]>;
    }
  });

  const nextSlide = () => {
    if (banners.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    if (banners.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // 로딩 중이거나 배너가 없으면 표시하지 않음
  if (isLoading || banners.length === 0) {
    return null;
  }

  return (
    <div 
      className="relative overflow-hidden rounded-xl"
      role="region"
      aria-label="배너 슬라이더" 
      aria-roledescription="carousel">
      <Card className="relative h-[400px] overflow-hidden">
        <img
          src={banners[currentIndex].imageUrl}
          alt={`${banners[currentIndex].title} - ${banners[currentIndex].content}`}
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent">
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <h2 className="text-3xl font-bold mb-2 drop-shadow-md">{banners[currentIndex].title}</h2>
            <p className="text-lg mb-4 drop-shadow-md font-medium">{banners[currentIndex].content}</p>
            {banners[currentIndex].linkUrl && (
              <Button 
                variant="default" 
                asChild
                className="bg-white text-primary hover:bg-white/90 shadow-md border-2 border-white"
              >
                <a href={banners[currentIndex].linkUrl}>자세히 보기</a>
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white focus:ring-2 focus:ring-primary"
        onClick={prevSlide}
        aria-label="이전 배너"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white focus:ring-2 focus:ring-primary"
        onClick={nextSlide}
        aria-label="다음 배너"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2" role="tablist">
        {banners.map((banner, index) => (
          <button
            key={banner.id}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`${banner.title} 배너로 이동`}
            aria-selected={index === currentIndex}
            role="tab"
          />
        ))}
      </div>
    </div>
  );
}