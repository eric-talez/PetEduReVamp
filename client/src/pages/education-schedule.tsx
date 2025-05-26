import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Plus, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// 교육 일정 데이터
const educationSchedules = [
  {
    id: 1,
    title: '기본 훈련 - 앉기와 기다리기',
    trainer: '김훈련사',
    date: '2025-05-27',
    time: '14:00 - 15:30',
    location: '강남 반려견 교육센터',
    level: '초급',
    participants: 8,
    maxParticipants: 12,
    type: '그룹 수업',
    status: '예약 가능',
    price: 50000
  },
  {
    id: 2,
    title: '사회화 훈련',
    trainer: '박전문가',
    date: '2025-05-28',
    time: '10:00 - 11:30',
    location: '서초 반려견 놀이터',
    level: '중급',
    participants: 6,
    maxParticipants: 10,
    type: '그룹 수업',
    status: '예약 가능',
    price: 60000
  },
  {
    id: 3,
    title: '어질리티 기초',
    trainer: '이코치',
    date: '2025-05-29',
    time: '16:00 - 17:30',
    location: '용산 실내 훈련장',
    level: '중급',
    participants: 4,
    maxParticipants: 8,
    type: '소그룹 수업',
    status: '예약 가능',
    price: 80000
  },
  {
    id: 4,
    title: '개인 맞춤 훈련',
    trainer: '최전문가',
    date: '2025-05-30',
    time: '13:00 - 14:00',
    location: '강동 개인 훈련실',
    level: '모든 레벨',
    participants: 1,
    maxParticipants: 1,
    type: '개인 수업',
    status: '예약 완료',
    price: 120000
  }
];

const upcomingClasses = [
  {
    id: 5,
    title: '퍼피 클래스',
    date: '2025-06-01',
    time: '11:00 - 12:00',
    trainer: '신입강사',
    status: '곧 개강'
  },
  {
    id: 6,
    title: '고급 트릭 훈련',
    date: '2025-06-03',
    time: '15:00 - 16:30',
    trainer: '전문가',
    status: '사전 예약'
  }
];

export default function EducationSchedulePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const filteredSchedules = educationSchedules.filter(schedule => {
    const matchesSearch = schedule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.trainer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || schedule.level === filterLevel;
    const matchesType = filterType === 'all' || schedule.type === filterType;
    
    return matchesSearch && matchesLevel && matchesType;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case '초급': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case '중급': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case '고급': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '예약 가능': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case '예약 완료': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case '마감': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case '곧 개강': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case '사전 예약': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            교육 일정
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            반려견 훈련 수업 일정을 확인하고 예약하세요
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          수업 예약
        </Button>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="수업명 또는 강사명 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger>
                <SelectValue placeholder="레벨 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 레벨</SelectItem>
                <SelectItem value="초급">초급</SelectItem>
                <SelectItem value="중급">중급</SelectItem>
                <SelectItem value="고급">고급</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="수업 유형" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 유형</SelectItem>
                <SelectItem value="그룹 수업">그룹 수업</SelectItem>
                <SelectItem value="소그룹 수업">소그룹 수업</SelectItem>
                <SelectItem value="개인 수업">개인 수업</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              고급 필터
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 메인 일정 목록 */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>이번 주 수업 일정</CardTitle>
              <CardDescription>
                예약 가능한 수업들을 확인하고 신청하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{schedule.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          강사: {schedule.trainer}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getLevelColor(schedule.level)}>
                          {schedule.level}
                        </Badge>
                        <Badge className={getStatusColor(schedule.status)}>
                          {schedule.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{schedule.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{schedule.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{schedule.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{schedule.participants}/{schedule.maxParticipants}명</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {schedule.type}
                        </span>
                        <span className="ml-4 font-semibold text-primary">
                          {schedule.price.toLocaleString()}원
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          상세보기
                        </Button>
                        {schedule.status === '예약 가능' && (
                          <Button size="sm">
                            예약하기
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 사이드바 */}
        <div className="space-y-6">
          {/* 다가오는 신규 수업 */}
          <Card>
            <CardHeader>
              <CardTitle>신규 개설 예정</CardTitle>
              <CardDescription>
                곧 시작되는 새로운 수업들
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <h4 className="font-medium">{cls.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{cls.date} {cls.time}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm">{cls.trainer}</span>
                      <Badge className={getStatusColor(cls.status)}>
                        {cls.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 내 예약 현황 */}
          <Card>
            <CardHeader>
              <CardTitle>내 예약 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">이번 주 예약</span>
                  <span className="font-medium">2건</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">이번 달 예약</span>
                  <span className="font-medium">6건</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">완료된 수업</span>
                  <span className="font-medium">18건</span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  예약 내역 보기
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 빠른 예약 */}
          <Card>
            <CardHeader>
              <CardTitle>빠른 예약</CardTitle>
              <CardDescription>
                자주 찾는 수업 유형
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  기본 훈련 수업
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  사회화 훈련
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  개인 맞춤 훈련
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}