import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../../SimpleApp";
import { 
  BadgeCheck, 
  FileVideo, 
  FileText, 
  UserCheck, 
  AlertCircle, 
  Award, 
  CheckCircle, 
  ShoppingBag,
  Gift,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// 훈련사 인증 요구사항 타입 정의
interface CertificationRequirement {
  type: string;
  name: string;
  required: number;
  current: number;
  description: string;
  status: 'pending' | 'completed';
}

// 커스텀 상품 타입 정의
interface CustomProduct {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  customizable: boolean;
  available: boolean;
}

export default function TrainerCertificationPage() {
  const [location, navigate] = useLocation();
  const auth = useAuth();
  const { toast } = useToast();

  const [requirements, setRequirements] = useState<CertificationRequirement[]>([
    {
      type: 'video',
      name: '훈련 영상',
      required: 5,
      current: 3,
      description: '5개 이상의 훈련 영상을 업로드하세요.',
      status: 'pending'
    },
    {
      type: 'post',
      name: '게시글',
      required: 10,
      current: 8,
      description: '10개 이상의 게시글을 작성하세요.',
      status: 'pending'
    },
    {
      type: 'referral',
      name: '추천인',
      required: 1,
      current: 0,
      description: '최소 1명 이상의 추천인이 필요합니다.',
      status: 'pending'
    }
  ]);
  
  const [isVerified, setIsVerified] = useState(false);
  const [customProducts, setCustomProducts] = useState<CustomProduct[]>([
    {
      id: 1,
      name: '테일즈 공식 유니폼',
      description: '당신의 이름과 로고가 새겨진 고품질 테일즈 공식 유니폼입니다.',
      imageUrl: 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      customizable: true,
      available: false
    },
    {
      id: 2,
      name: '테일즈 공식 명함',
      description: '프리미엄 디자인의 테일즈 공식 인증 훈련사 명함입니다.',
      imageUrl: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      customizable: true,
      available: false
    }
  ]);

  // 요구사항 충족 여부 확인 및 인증 상태 업데이트
  useEffect(() => {
    // 모든 요구사항이 충족되었는지 확인
    const allCompleted = requirements.every(req => req.current >= req.required);
    
    // 인증 상태 업데이트
    setIsVerified(allCompleted);
    
    // 요구사항 상태 업데이트
    setRequirements(prev =>
      prev.map(req => ({
        ...req,
        status: req.current >= req.required ? 'completed' : 'pending'
      }))
    );
    
    // 인증 완료 시 커스텀 상품 가용성 업데이트
    if (allCompleted) {
      setCustomProducts(prev =>
        prev.map(product => ({
          ...product,
          available: true
        }))
      );
    }
  }, [requirements]);

  // 훈련 영상 추가 시뮬레이션
  const addTrainingVideo = () => {
    setRequirements(prev =>
      prev.map(req =>
        req.type === 'video'
          ? { ...req, current: Math.min(req.current + 1, req.required) }
          : req
      )
    );
    
    toast({
      title: "훈련 영상이 추가되었습니다",
      description: "인증 요구사항 진행 상황이 업데이트되었습니다."
    });
  };

  // 게시글 추가 시뮬레이션
  const addPost = () => {
    setRequirements(prev =>
      prev.map(req =>
        req.type === 'post'
          ? { ...req, current: Math.min(req.current + 1, req.required) }
          : req
      )
    );
    
    toast({
      title: "게시글이 추가되었습니다",
      description: "인증 요구사항 진행 상황이 업데이트되었습니다."
    });
  };

  // 추천인 추가 시뮬레이션
  const addReferral = () => {
    setRequirements(prev =>
      prev.map(req =>
        req.type === 'referral'
          ? { ...req, current: Math.min(req.current + 1, req.required) }
          : req
      )
    );
    
    toast({
      title: "추천인이 추가되었습니다",
      description: "인증 요구사항 진행 상황이 업데이트되었습니다."
    });
  };

  // 커스텀 상품 주문 페이지로 이동
  const goToCustomOrder = (productId: number) => {
    navigate(`/shop/custom-order/${productId}`);
  };

  // 전체 인증 진행률 계산
  const calculateOverallProgress = () => {
    const totalRequired = requirements.reduce((sum, req) => sum + req.required, 0);
    const totalCurrent = requirements.reduce((sum, req) => sum + Math.min(req.current, req.required), 0);
    return Math.floor((totalCurrent / totalRequired) * 100);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <a href="/trainer/dashboard" className="hover:text-primary">훈련사 대시보드</a>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="text-gray-700 font-medium">테일즈 공식 인증</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2 text-amber-500" />
              테일즈 공식 인증 마크
            </CardTitle>
            <CardDescription>
              테일즈 공식 인증 마크를 획득하여 전문성을 인정받고 특별한 혜택을 누리세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Badge variant={isVerified ? "default" : "outline"} className="mr-2">
                  {isVerified ? "인증 완료" : "미인증"}
                </Badge>
                <span className="text-sm text-gray-600">
                  {isVerified 
                    ? "축하합니다! 테일즈 공식 인증을 획득하셨습니다." 
                    : "아래 요구사항을 모두 충족하면 인증 마크를 획득할 수 있습니다."}
                </span>
              </div>
            </div>

            {isVerified ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <BadgeCheck className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">인증 완료!</h3>
                  <p className="text-green-700 text-sm">
                    이제 테일즈 공식 인증 마크를 프로필에서 확인할 수 있으며, 
                    커스텀 유니폼과 명함을 주문할 수 있습니다.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>전체 진행률</span>
                  <span>{calculateOverallProgress()}%</span>
                </div>
                <Progress value={calculateOverallProgress()} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gift className="w-5 h-5 mr-2 text-primary" />
              인증 혜택
            </CardTitle>
            <CardDescription>
              테일즈 인증 훈련사만의 특별한 혜택을 확인하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                <span>프로필과 게시글에 테일즈 공식 인증 마크 표시</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                <span>테일즈 공식 유니폼 및 명함 주문 가능</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                <span>훈련사 프로필 상위 노출 및 추천 시스템 가산점</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                <span>테일즈 공식 이벤트 및 워크샵 우선 초대</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                <span>수수료 우대 혜택 (일반 훈련사 대비 2% 낮은 수수료)</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>인증 요구사항</CardTitle>
          <CardDescription>
            테일즈 공식 인증을 받기 위한 요구사항을 충족하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>항목</TableHead>
                <TableHead>요구사항</TableHead>
                <TableHead>현재 상태</TableHead>
                <TableHead>진행률</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requirements.map((req) => (
                <TableRow key={req.type}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {req.type === 'video' && <FileVideo className="w-4 h-4 mr-2 text-blue-500" />}
                      {req.type === 'post' && <FileText className="w-4 h-4 mr-2 text-amber-500" />}
                      {req.type === 'referral' && <UserCheck className="w-4 h-4 mr-2 text-green-500" />}
                      {req.name}
                    </div>
                  </TableCell>
                  <TableCell>{req.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Badge variant={req.status === 'completed' ? "default" : "outline"}>
                        {req.current}/{req.required}
                      </Badge>
                      {req.status === 'completed' && (
                        <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-full">
                      <Progress 
                        value={Math.min((req.current / req.required) * 100, 100)} 
                        className="h-2" 
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {req.type === 'video' && (
                      <Button size="sm" onClick={addTrainingVideo} disabled={req.current >= req.required}>
                        영상 추가
                      </Button>
                    )}
                    {req.type === 'post' && (
                      <Button size="sm" onClick={addPost} disabled={req.current >= req.required}>
                        게시글 작성
                      </Button>
                    )}
                    {req.type === 'referral' && (
                      <Button size="sm" onClick={addReferral} disabled={req.current >= req.required}>
                        추천인 추가
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>테일즈 공식 커스텀 상품</CardTitle>
            {!isVerified && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
                <AlertCircle className="w-3 h-3 mr-1" />
                인증 완료 후 이용 가능
              </Badge>
            )}
          </div>
          <CardDescription>
            테일즈 인증 마크를 획득한 훈련사만 주문할 수 있는 특별한 상품입니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {customProducts.map((product) => (
              <Card key={product.id} className={`border overflow-hidden ${!product.available ? 'opacity-60' : ''}`}>
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    onClick={() => goToCustomOrder(product.id)}
                    disabled={!product.available}
                    className="w-full"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {product.available ? '주문하기' : '인증 후 이용 가능'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}