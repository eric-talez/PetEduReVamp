
import { useParams } from 'react-router-dom';
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CourseDetail() {
  const { id } = useParams();
  
  // Mock data for course detail - In real app, fetch this based on id
  const course = {
    id: parseInt(id as string),
    title: "반려견 기초 훈련 마스터하기",
    description: "앉아, 기다려, 엎드려 등 기본 명령어부터 산책 예절까지 체계적으로 배우는 초보 견주 필수 코스",
    image: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=350",
    price: "89,000원",
    trainer: {
      name: "김훈련 트레이너",
      avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    rating: 4.8,
    reviews: 45,
    popular: true,
    level: "초급",
    category: "기본 훈련",
    curriculum: [
      "1주차: 기본 복종 훈련의 이해",
      "2주차: 기본 명령어 훈련",
      "3주차: 산책 예절 교육",
      "4주차: 사회화 훈련 기초"
    ]
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <Card className="overflow-hidden">
        <div className="relative h-64 md:h-96">
          <img 
            src={course.image} 
            alt={course.title} 
            className="w-full h-full object-cover"
          />
          {course.popular && (
            <Badge variant="warning" className="absolute top-4 right-4">
              인기
            </Badge>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex flex-wrap justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{course.title}</h1>
            <Badge variant={course.level === "초급" ? "success" : "info"}>{course.level}</Badge>
          </div>
          
          <div className="flex items-center mb-4">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            <span className="ml-1 text-lg font-semibold">{course.rating}</span>
            <span className="ml-2 text-gray-600">({course.reviews} 후기)</span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">{course.description}</p>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Avatar 
                src={course.trainer.avatar} 
                alt={course.trainer.name}
                className="w-10 h-10"
              />
              <span className="ml-2 font-medium">{course.trainer.name}</span>
            </div>
            <span className="text-xl font-bold text-primary">{course.price}</span>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">커리큘럼</h2>
            <ul className="space-y-2">
              {course.curriculum.map((item, index) => (
                <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs mr-3">
                    {index + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <Button className="w-full">수강 신청하기</Button>
        </div>
      </Card>
    </div>
  );
}
