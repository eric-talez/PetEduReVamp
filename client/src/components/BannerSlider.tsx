import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const banners = [
  {
    title: "반려견 전문 훈련사와 함께하는 맞춤형 교육",
    description: "1:1 전문 상담으로 반려견에게 알맞은 교육 프로그램을 찾아보세요",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    link: "/courses"
  },
  {
    title: "이달의 베스트 트레이너",
    description: "높은 만족도를 자랑하는 전문 훈련사를 만나보세요",
    image: "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    link: "/trainers"
  },
  {
    title: "온라인 화상 교육으로 편리하게",
    description: "이동 시간 걱정 없이 집에서 편하게 교육받으세요",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    link: "/video-call"
  }
];

export function BannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      <Card className="relative h-[400px] overflow-hidden">
        <img
          src={banners[currentIndex].image}
          alt={banners[currentIndex].title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent">
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">{banners[currentIndex].title}</h2>
            <p className="text-lg mb-4">{banners[currentIndex].description}</p>
            <Button variant="default" asChild>
              <a href={banners[currentIndex].link}>자세히 보기</a>
            </Button>
          </div>
        </div>
      </Card>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}