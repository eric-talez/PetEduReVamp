import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  MapPin, 
  Search, 
  Filter, 
  Star, 
  Phone, 
  Clock, 
  Calendar as CalendarIcon,
  Award,
  User,
  Building,
  Stethoscope,
  ShoppingBag,
  Car,
  Home,
  Coffee,
  Tent,
  TreePine,
  Hotel,
  Heart,
  Eye,
  MessageSquare,
  VideoIcon,
  Users,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';

export default function LocationFinder() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showReservation, setShowReservation] = useState(false);
  const [showTrainers, setShowTrainers] = useState(false);
  const [showConsultationBooking, setShowConsultationBooking] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({ lat: 37.5665, lng: 126.9780 });
  const [locations, setLocations] = useState([]);
  const [institutionTrainers, setInstitutionTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // 예약 폼 상태
  const [reservationForm, setReservationForm] = useState({
    date: new Date(),
    time: '',
    notes: '',
    contact: ''
  });

  // 상담 예약 폼 상태
  const [consultationForm, setConsultationForm] = useState({
    date: new Date(),
    time: '',
    petName: '',
    petAge: '',
    petBreed: '',
    concerns: '',
    phone: '',
    email: ''
  });

  // 상세 정보 모달 열기
  const handleLocationClick = (location) => {
    console.log('위치 상세보기 클릭:', location.id);
    setSelectedLocation(location);
    setShowDetails(true);
  };

  // 인증 업체 훈련사 목록 조회
  const fetchInstitutionTrainers = async (institutionId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/institutes/${institutionId}/trainers`);
      if (response.ok) {
        const trainers = await response.json();
        setInstitutionTrainers(trainers);
      } else {
        // 샘플 데이터 사용
        setInstitutionTrainers([
          {
            id: 1,
            name: '김민수 전문 훈련사',
            specialty: ['기본 복종 훈련', '사회화 훈련'],
            experience: '10년+',
            rating: 4.9,
            reviews: 156,
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
            bio: '10년 이상의 경력을 가진 전문 훈련사로서 수천 마리의 반려견을 교육했습니다.',
            certifications: ['국제 반려견 훈련사 자격증', 'KKF 공인 훈련사'],
            availableSlots: {
              '2025-06-20': ['10:00', '14:00', '16:00'],
              '2025-06-21': ['09:00', '11:00', '15:00'],
              '2025-06-22': ['10:30', '13:30', '16:30']
            }
          },
          {
            id: 2,
            name: '박지혜 행동교정사',
            specialty: ['행동 교정', '문제행동 해결'],
            experience: '8년+',
            rating: 4.8,
            reviews: 132,
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b4c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
            bio: '문제행동 전문가로 공격성, 분리불안 등의 해결에 특화되어 있습니다.',
            certifications: ['동물행동학 석사', 'CCPDT 공인 훈련사'],
            availableSlots: {
              '2025-06-20': ['11:00', '15:00'],
              '2025-06-21': ['10:00', '14:00', '16:00'],
              '2025-06-23': ['09:30', '13:00', '15:30']
            }
          }
        ]);
      }
    } catch (error) {
      console.error('훈련사 목록 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 훈련사 목록 보기
  const handleViewTrainers = (institution) => {
    console.log('훈련사 보기 클릭:', institution.id);
    setSelectedLocation(institution);
    fetchInstitutionTrainers(institution.id);
    setShowTrainers(true);
  };

  // 상담 예약하기
  const handleBookConsultation = (trainer) => {
    console.log('상담 예약 클릭:', trainer.id);
    setSelectedTrainer(trainer);
    setShowConsultationBooking(true);
  };

  // 상담 예약 제출
  const handleConsultationSubmit = async () => {
    if (!isAuthenticated) {
      alert('로그인이 필요한 서비스입니다.');
      setLocation('/auth');
      return;
    }

    try {
      const response = await fetch(`/api/trainers/${selectedTrainer.id}/consultation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...consultationForm,
          trainerId: selectedTrainer.id,
          institutionId: selectedLocation.id
        })
      });

      if (response.ok) {
        alert('상담 예약이 완료되었습니다. 곧 연락드리겠습니다.');
        setShowConsultationBooking(false);
        setConsultationForm({
          date: new Date(),
          time: '',
          petName: '',
          petAge: '',
          petBreed: '',
          concerns: '',
          phone: '',
          email: ''
        });
      } else {
        alert('예약에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('상담 예약 오류:', error);
      alert('예약 처리 중 오류가 발생했습니다.');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'training': return <GraduationCap className="h-4 w-4" />;
      case 'grooming': return <Scissors className="h-4 w-4" />;
      case 'hospital': return <Stethoscope className="h-4 w-4" />;
      case 'hotel': return <Hotel className="h-4 w-4" />;
      case 'daycare': return <Heart className="h-4 w-4" />;
      case 'park': return <TreePine className="h-4 w-4" />;
      case 'institute': return <Building className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'training': return '훈련소';
      case 'grooming': return '미용실';
      case 'hospital': return '동물병원';
      case 'hotel': return '펜션/호텔';
      case 'daycare': return '위탁관리';
      case 'park': return '놀이공원';
      case 'institute': return '종합센터';
      default: return '기타';
    }
  };

  useEffect(() => {
    // 위치 데이터 가져오기
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/locations');
        if (response.ok) {
          const data = await response.json();
          setLocations(data);
        } else {
          // 샘플 데이터 사용
          setLocations([
            {
              id: 1,
              name: '서울 펫 종합센터',
              type: 'institute',
              address: '서울시 강남구 테헤란로 123',
              phone: '02-123-4567',
              rating: 4.8,
              reviewCount: 156,
              distance: 0.8,
              operatingHours: { open: '09:00', close: '19:00' },
              services: ['기본 순종 훈련', '행동 교정', '사회화 훈련', '미용', '호텔'],
              priceRange: '50,000원 - 150,000원',
              isCertified: true,
              description: '전문 반려견 훈련 및 미용, 호텔 서비스를 제공하는 종합 시설입니다.',
              image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=400',
              latitude: 37.501,
              longitude: 127.039,
            },
            {
              id: 2,
              name: '강남 펫 호텔',
              type: 'hotel',
              address: '서울시 강남구 역삼동 456',
              phone: '02-234-5678',
              rating: 4.5,
              reviewCount: 120,
              distance: 1.5,
              operatingHours: { open: '24시간', close: '24시간' },
              services: ['호텔', '데이케어', '산책'],
              priceRange: '80,000원 - 200,000원',
              isCertified: false,
              description: '24시간 운영하는 프리미엄 펫 호텔입니다.',
              image: 'https://images.unsplash.com/photo-1518791841217-64358f0319c6?w=400',
              latitude: 37.498,
              longitude: 127.028,
            },
            {
              id: 3,
              name: '서초 동물 병원',
              type: 'hospital',
              address: '서울시 서초구 서초동 789',
              phone: '02-345-6789',
              rating: 4.7,
              reviewCount: 180,
              distance: 2.0,
              operatingHours: { open: '09:00', close: '21:00' },
              services: ['진료', '수술', '건강검진'],
              priceRange: '30,000원 - 500,000원',
              isCertified: false,
              description: '최첨단 장비를 갖춘 24시 동물 병원입니다.',
              image: 'https://images.unsplash.com/photo-1533738363-b7f903f9e709?w=400',
              latitude: 37.492,
              longitude: 127.016,
            },
            {
              id: 4,
              name: '역삼 펫 미용실',
              type: 'grooming',
              address: '서울시 강남구 역삼동 101',
              phone: '02-456-7890',
              rating: 4.6,
              reviewCount: 150,
              distance: 2.5,
              operatingHours: { open: '10:00', close: '20:00' },
              services: ['미용', '스파', '네일'],
              priceRange: '30,000원 - 100,000원',
              isCertified: false,
              description: '최고의 스타일리스트가 제공하는 프리미엄 펫 미용 서비스입니다.',
              image: 'https://images.unsplash.com/photo-1582665685278-501e739c91b3?w=400',
              latitude: 37.508,
              longitude: 127.045,
            },
            {
              id: 5,
              name: '삼성 펫 훈련소',
              type: 'training',
              address: '서울시 강남구 삼성동 202',
              phone: '02-567-8901',
              rating: 4.9,
              reviewCount: 200,
              distance: 3.0,
              operatingHours: { open: '09:00', close: '18:00' },
              services: ['기본 훈련', '행동 교정', '사회화 훈련'],
              priceRange: '50,000원 - 150,000원',
              isCertified: true,
              description: '반려견 문제 행동 교정 전문 훈련소입니다.',
              image: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=400',
              latitude: 37.512,
              longitude: 127.052,
            },
            {
              id: 6,
              name: '청담 펫 데이케어',
              type: 'daycare',
              address: '서울시 강남구 청담동 303',
              phone: '02-678-9012',
              rating: 4.4,
              reviewCount: 100,
              distance: 3.5,
              operatingHours: { open: '08:00', close: '20:00' },
              services: ['데이케어', '놀이', '간식'],
              priceRange: '30,000원 - 50,000원',
              isCertified: false,
              description: '반려견을 위한 안전하고 즐거운 데이케어 공간입니다.',
              image: 'https://images.unsplash.com/photo-1598550874454-4c6aa009f51b?w=400',
              latitude: 37.515,
              longitude: 127.058,
            },
            {
              id: 7,
              name: '압구정 펫 공원',
              type: 'park',
              address: '서울시 강남구 압구정동 404',
              phone: '02-789-0123',
              rating: 4.3,
              reviewCount: 80,
              distance: 4.0,
              operatingHours: { open: '24시간', close: '24시간' },
              services: ['산책', '놀이'],
              priceRange: '무료',
              isCertified: false,
              description: '반려견과 함께 즐거운 시간을 보낼 수 있는 공원입니다.',
              image: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=400',
              latitude: 37.518,
              longitude: 127.064,
            },
          ]);
        }
      } catch (error) {
        console.error('위치 데이터 가져오기 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    // 현재 위치 가져오기
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error('현재 위치 가져오기 오류:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    getCurrentLocation();
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2, unit) => {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      const radlat1 = Math.PI * lat1/180;
      const radlat2 = Math.PI * lat2/180;
      const theta = lon1-lon2;
      const radtheta = Math.PI * theta/180;
      let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }
      return dist;
    }
  }

  useEffect(() => {
    // 필터링 로직
    let filtered = locations;

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(location =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 타입 필터링
    if (selectedType !== 'all') {
      filtered = filtered.filter(location => location.type === selectedType);
    }

    // 거리 계산 및 추가
    filtered = filtered.map(location => {
      const distance = calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        location.latitude,
        location.longitude,
        "K"
      );
      return { ...location, distance: parseFloat(distance.toFixed(1)) };
    });

    // 거리순 정렬
    filtered.sort((a, b) => a.distance - b.distance);

  }, [locations, searchTerm, selectedType, currentLocation]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                내 주변 반려견 서비스 찾기
              </h2>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Button>
                지도 보기
              </Button>
            </div>
          </div>

          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">

                <div className="mb-4">
                  <Input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="sm:hidden">
                  <Label htmlFor="location-filter">필터</Label>
                  <Select
                    id="location-filter"
                    value={selectedType}
                    onValueChange={(value) => setSelectedType(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="institute">종합센터</SelectItem>
                      <SelectItem value="training">훈련소</SelectItem>
                      <SelectItem value="grooming">미용실</SelectItem>
                      <SelectItem value="hospital">동물병원</SelectItem>
                      <SelectItem value="hotel">호텔</SelectItem>
                      <SelectItem value="daycare">데이케어</SelectItem>
                      <SelectItem value="park">공원</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="hidden sm:block">
                  <div className="flex space-x-4">
                    <Button
                      variant={selectedType === 'all' ? 'default' : 'outline'}
                      onClick={() => setSelectedType('all')}
                    >
                      전체
                    </Button>
                    <Button
                      variant={selectedType === 'institute' ? 'default' : 'outline'}
                      onClick={() => setSelectedType('institute')}
                    >
                      종합센터
                    </Button>
                    <Button
                      variant={selectedType === 'training' ? 'default' : 'outline'}
                      onClick={() => setSelectedType('training')}
                    >
                      훈련소
                    </Button>
                    <Button
                      variant={selectedType === 'grooming' ? 'default' : 'outline'}
                      onClick={() => setSelectedType('grooming')}
                    >
                      미용실
                    </Button>
                    <Button
                      variant={selectedType === 'hospital' ? 'default' : 'outline'}
                      onClick={() => setSelectedType('hospital')}
                    >
                      동물병원
                    </Button>
                    <Button
                      variant={selectedType === 'hotel' ? 'default' : 'outline'}
                      onClick={() => setSelectedType('hotel')}
                    >
                      호텔
                    </Button>
                    <Button
                      variant={selectedType === 'daycare' ? 'default' : 'outline'}
                      onClick={() => setSelectedType('daycare')}
                    >
                      데이케어
                    </Button>
                    <Button
                      variant={selectedType === 'park' ? 'default' : 'outline'}
                      onClick={() => setSelectedType('park')}
                    >
                      공원
                    </Button>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-2 text-gray-600">위치 정보를 불러오는 중...</p>
                  </div>
                ) : (
                  <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {locations.map(location => (
                      <Card key={location.id} className="relative">
                        <CardHeader>
                          <CardTitle>
                            <div className="flex items-center gap-2">
                              {getTypeIcon(location.type)}
                              {location.name}
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-500">{location.address}</p>
                          <p className="text-sm text-gray-500">{location.phone}</p>
                          <div className="mt-2 flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                            <span>{location.rating} ({location.reviewCount})</span>
                          </div>
                          <p className="mt-2 text-sm">{location.description}</p>
                          <div className="mt-4">
                            <Badge variant="outline">
                              {location.distance} km
                            </Badge>
                          </div>
                        </CardContent>
                        
                        <div className="absolute top-2 right-2">
                          {location.isCertified && (
                            <Badge className="bg-green-500">
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                인증업체
                              </div>
                            </Badge>
                          )}
                        </div>

                        
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleLocationClick(location)}
                        className="flex-1"
                      >
                        상세보기
                      </Button>
                      {location.type === 'institute' && location.isCertified && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewTrainers(location)}
                          className="flex-1"
                        >
                          <Users className="h-4 w-4 mr-1" />
                          훈련사 보기
                        </Button>
                      )}
                      {location.type === 'institute' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            console.log('예약하기 클릭:', location.id);
                            setSelectedLocation(location);
                            setShowReservation(true);
                          }}
                          className="flex-1"
                        >
                          예약하기
                        </Button>
                      )}
                    </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 훈련사 목록 모달 */}
      <Dialog open={showTrainers} onOpenChange={setShowTrainers}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              {selectedLocation?.name} - 전문 훈련사 목록
            </DialogTitle>
            <DialogDescription>
              테일즈 인증 업체의 전문 훈련사들과 상담을 예약하세요.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-gray-600">훈련사 정보를 불러오는 중...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {institutionTrainers.map((trainer) => (
                  <Card key={trainer.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={trainer.avatar} alt={trainer.name} />
                        <AvatarFallback>{trainer.name[0]}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg">{trainer.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{trainer.rating}</span>
                            <span className="text-sm text-gray-500">({trainer.reviews} 리뷰)</span>
                            <Badge variant="outline" className="ml-2">
                              경력 {trainer.experience}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {trainer.specialty.map((spec, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>

                        <p className="text-sm text-gray-600">{trainer.bio}</p>

                        <div className="flex flex-wrap gap-2">
                          {trainer.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {cert}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleBookConsultation(trainer)}
                            className="flex items-center gap-1"
                          >
                            <MessageSquare className="h-4 w-4" />
                            상담 예약
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              console.log('화상 상담 클릭:', trainer.id);
                              setLocation(`/video-call?trainer=${trainer.id}&institution=${selectedLocation.id}`);
                            }}
                            className="flex items-center gap-1"
                          >
                            <VideoIcon className="h-4 w-4" />
                            화상 상담
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setShowTrainers(false)}>
              닫기
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 상담 예약 모달 */}
      <Dialog open={showConsultationBooking} onOpenChange={setShowConsultationBooking}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>상담 예약</DialogTitle>
            <DialogDescription>
              {selectedTrainer?.name} 훈련사와의 상담을 예약합니다.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="consultation-date">상담 날짜</Label>
              <Calendar
                mode="single"
                selected={consultationForm.date}
                onSelect={(date) => setConsultationForm(prev => ({ ...prev, date }))}
                className="rounded-md border"
                disabled={(date) => date < new Date()}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="consultation-time">시간</Label>
              <Select 
                value={consultationForm.time} 
                onValueChange={(value) => setConsultationForm(prev => ({ ...prev, time: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="시간을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {selectedTrainer?.availableSlots?.[consultationForm.date?.toISOString().split('T')[0]]?.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  )) || (
                    <>
                      <SelectItem value="09:00">09:00</SelectItem>
                      <SelectItem value="10:00">10:00</SelectItem>
                      <SelectItem value="11:00">11:00</SelectItem>
                      <SelectItem value="14:00">14:00</SelectItem>
                      <SelectItem value="15:00">15:00</SelectItem>
                      <SelectItem value="16:00">16:00</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pet-name">반려견 이름</Label>
              <Input
                id="pet-name"
                value={consultationForm.petName}
                onChange={(e) => setConsultationForm(prev => ({ ...prev, petName: e.target.value }))}
                placeholder="반려견 이름을 입력하세요"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="pet-age">나이</Label>
                <Input
                  id="pet-age"
                  value={consultationForm.petAge}
                  onChange={(e) => setConsultationForm(prev => ({ ...prev, petAge: e.target.value }))}
                  placeholder="예: 2살"
                />
              </div>
              <div>
                <Label htmlFor="pet-breed">견종</Label>
                <Input
                  id="pet-breed"
                  value={consultationForm.petBreed}
                  onChange={(e) => setConsultationForm(prev => ({ ...prev, petBreed: e.target.value }))}
                  placeholder="예: 골든 리트리버"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="concerns">상담 내용</Label>
              <Textarea
                id="concerns"
                value={consultationForm.concerns}
                onChange={(e) => setConsultationForm(prev => ({ ...prev, concerns: e.target.value }))}
                placeholder="상담받고 싶은 내용을 자세히 적어주세요"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">연락처</Label>
              <Input
                id="phone"
                value={consultationForm.phone}
                onChange={(e) => setConsultationForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="010-0000-0000"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={consultationForm.email}
                onChange={(e) => setConsultationForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="example@email.com"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowConsultationBooking(false)}>
              취소
            </Button>
            <Button onClick={handleConsultationSubmit}>
              상담 예약하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 예약하기 모달 */}
      <Dialog open={showReservation} onOpenChange={setShowReservation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>예약하기</DialogTitle>
            <DialogDescription>
              {selectedLocation?.name}에 예약을 진행합니다.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">예약 날짜</Label>
              <Calendar
                mode="single"
                selected={reservationForm.date}
                onSelect={(date) => setReservationForm(prev => ({ ...prev, date }))}
                className="rounded-md border"
                disabled={(date) => date < new Date()}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="time">시간</Label>
              <Select 
                value={reservationForm.time} 
                onValueChange={(value) => setReservationForm(prev => ({ ...prev, time: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="시간을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">09:00</SelectItem>
                  <SelectItem value="10:00">10:00</SelectItem>
                  <SelectItem value="11:00">11:00</SelectItem>
                  <SelectItem value="14:00">14:00</SelectItem>
                  <SelectItem value="15:00">15:00</SelectItem>
                  <SelectItem value="16:00">16:00</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contact">연락처</Label>
              <Input
                id="contact"
                value={reservationForm.contact}
                onChange={(e) => setReservationForm(prev => ({ ...prev, contact: e.target.value }))}
                placeholder="연락처를 입력하세요"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">요청사항</Label>
              <Textarea
                id="notes"
                value={reservationForm.notes}
                onChange={(e) => setReservationForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="특별한 요청사항이 있으시면 입력하세요"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowReservation(false)}>
              취소
            </Button>
            <Button onClick={() => {
              console.log('예약 완료:', reservationForm);
              alert('예약이 완료되었습니다!');
              setShowReservation(false);
            }}>
              예약하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}