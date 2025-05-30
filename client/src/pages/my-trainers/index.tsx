import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MessageCircle, Calendar, Phone, Mail, MapPin } from 'lucide-react';

const MyTrainersPage = () => {
  // 현재 담당 훈련사 데이터 (실제로는 API에서 가져옴)
  const myTrainers = [
    {
      id: 1,
      name: '김훈련',
      specialty: '기본 훈련, 행동 교정',
      rating: 4.8,
      reviews: 127,
      experience: '5년',
      contact: {
        phone: '010-1234-5678',
        email: 'trainer.kim@petedu.com'
      },
      location: '서울시 강남구',
      avatar: undefined,
      status: 'active',
      nextSession: '2025-06-02 14:00',
      totalSessions: 15,
      completedSessions: 12
    },
    {
      id: 2,
      name: '박전문가',
      specialty: '퍼피 트레이닝, 사회화',
      rating: 4.9,
      reviews: 89,
      experience: '7년',
      contact: {
        phone: '010-9876-5432',
        email: 'trainer.park@petedu.com'
      },
      location: '서울시 서초구',
      avatar: undefined,
      status: 'active',
      nextSession: '2025-06-05 10:00',
      totalSessions: 8,
      completedSessions: 6
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            담당 훈련사
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            현재 나의 반려동물을 담당하고 있는 전문 훈련사들을 관리하고 소통하세요.
          </p>
        </div>

        {/* 훈련사 목록 */}
        <div className="grid gap-6 md:grid-cols-2">
          {myTrainers.map((trainer) => (
            <Card key={trainer.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={trainer.avatar || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {trainer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{trainer.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {trainer.specialty}
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 text-sm font-medium">{trainer.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          ({trainer.reviews}개 리뷰)
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    활성
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* 기본 정보 */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">경력:</span>
                    <span className="ml-2 font-medium">{trainer.experience}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">완료 세션:</span>
                    <span className="ml-2 font-medium">
                      {trainer.completedSessions}/{trainer.totalSessions}
                    </span>
                  </div>
                </div>

                {/* 연락처 정보 */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{trainer.contact.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{trainer.contact.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{trainer.location}</span>
                  </div>
                </div>

                {/* 다음 세션 */}
                {trainer.nextSession && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        다음 세션: {trainer.nextSession}
                      </span>
                    </div>
                  </div>
                )}

                {/* 액션 버튼들 */}
                <div className="flex space-x-2 pt-4">
                  <Button variant="default" size="sm" className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    메시지
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    예약
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 빈 상태 */}
        {myTrainers.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">담당 훈련사가 없습니다</h3>
                <p>아직 배정된 훈련사가 없습니다. 강의를 신청하거나 훈련사를 찾아보세요.</p>
              </div>
              <Button>
                훈련사 찾기
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyTrainersPage;