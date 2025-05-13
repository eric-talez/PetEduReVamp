import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PawPrint, Smartphone, Globe, Heart, Book, User, Clock } from 'lucide-react';

export default function GettingStartedPage() {
  const bannerStyle = {
    backgroundImage: 'linear-gradient(to right, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.8))',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="min-h-screen">
      {/* Banner 영역 */}
      <div className="relative">
        <div className="w-full py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center" style={bannerStyle}>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">시작하기</h1>
          <p className="text-lg text-white/90 max-w-3xl mx-auto mb-8">
            PetEdu 플랫폼의 기본 사용법과 주요 기능을 익혀보세요.
          </p>
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-8">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="registration">회원가입</TabsTrigger>
            <TabsTrigger value="pet-profile">반려동물 등록</TabsTrigger>
            <TabsTrigger value="courses">강의 수강</TabsTrigger>
            <TabsTrigger value="trainers">훈련사 찾기</TabsTrigger>
            <TabsTrigger value="communication">소통하기</TabsTrigger>
            <TabsTrigger value="ai-features">AI 기능</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Globe className="mr-2 h-6 w-6 text-primary" />
                  PetEdu 플랫폼 소개
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  PetEdu는 반려동물 교육을 위한 종합 플랫폼으로, 반려인들이 전문 훈련사의 도움을 받아 
                  더 나은 반려생활을 할 수 있도록 지원합니다. 온라인 강의, 1:1 화상 상담, 커뮤니티 활동 등 
                  다양한 기능을 제공합니다.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2 flex items-center">
                      <Book className="mr-2 h-5 w-5 text-blue-500" />
                      온라인 교육
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      전문 훈련사가 제공하는 다양한 온라인 강의를 언제 어디서나 수강할 수 있습니다.
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2 flex items-center">
                      <User className="mr-2 h-5 w-5 text-green-500" />
                      1:1 상담
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      개별적인 문제 해결을 위해 전문 훈련사와 1:1 화상 상담을 진행할 수 있습니다.
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2 flex items-center">
                      <Heart className="mr-2 h-5 w-5 text-red-500" />
                      커뮤니티
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      다른 반려인들과 정보를 공유하고 소통할 수 있는 커뮤니티 공간을 제공합니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Clock className="mr-2 h-6 w-6 text-primary" />
                  시작을 위한 단계
                </h2>
                <ol className="space-y-4 mt-4">
                  <li className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-start">
                      <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mr-4">
                        1
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">회원가입 및 로그인</h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          PetEdu 계정을 만들고 로그인하여 모든 기능을 이용하세요.
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-start">
                      <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mr-4">
                        2
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">반려동물 프로필 등록</h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          반려동물의 정보를 등록하여 맞춤 서비스를 받으세요.
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-start">
                      <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mr-4">
                        3
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">강의 탐색 및 수강</h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          다양한 강의를 탐색하고 필요한 교육 과정을 시작하세요.
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-start">
                      <div className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mr-4">
                        4
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">커뮤니티 참여</h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          다른 반려인들과 경험을 공유하고 질문하세요.
                        </p>
                      </div>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="registration" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">회원가입 및 계정 설정</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  PetEdu 플랫폼에 회원가입하고 계정을 설정하는 방법을 알아보세요.
                </p>
                
                <div className="space-y-6">
                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-semibold text-lg mb-2">회원가입 방법</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
                      <li>메인 페이지 우측 상단의 '로그인' 버튼을 클릭합니다.</li>
                      <li>'회원가입' 링크를 선택합니다.</li>
                      <li>필수 정보(이메일, 비밀번호, 이름)를 입력합니다.</li>
                      <li>이메일로 전송된 인증 링크를 통해 이메일을 인증합니다.</li>
                      <li>추가 정보를 입력하고 가입을 완료합니다.</li>
                    </ol>
                  </div>
                  
                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-semibold text-lg mb-2">프로필 설정</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      회원가입 후 프로필 설정을 통해 더 나은 경험을 제공받을 수 있습니다.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                      <li>프로필 사진 등록</li>
                      <li>관심 분야 설정</li>
                      <li>알림 설정</li>
                      <li>반려동물 정보 등록</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pet-profile" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <PawPrint className="mr-2 h-6 w-6 text-primary" />
                  반려동물 프로필 등록
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  반려동물의 정보를 등록하여 맞춤형 콘텐츠와 추천을 받아보세요.
                </p>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">등록 방법</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
                      <li>로그인 후 '마이 페이지'로 이동합니다.</li>
                      <li>'반려동물 관리' 메뉴를 선택합니다.</li>
                      <li>'새 반려동물 등록' 버튼을 클릭합니다.</li>
                      <li>반려동물의 정보(이름, 종류, 품종, 나이, 성별 등)를 입력합니다.</li>
                      <li>반려동물 사진을 등록합니다.</li>
                      <li>건강 정보와 특이사항을 입력합니다.</li>
                      <li>'등록' 버튼을 클릭하여 완료합니다.</li>
                    </ol>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">등록 시 유의사항</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                      <li>정확한 품종과 나이 정보를 입력하면 더 정확한 맞춤 정보를 받을 수 있습니다.</li>
                      <li>알레르기나 특이사항은 반드시 입력해 주세요.</li>
                      <li>여러 마리의 반려동물을 등록할 수 있습니다.</li>
                      <li>정보는 언제든지 수정이 가능합니다.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">강의 수강 방법</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  PetEdu에서 제공하는 다양한 강의를 수강하는 방법을 알아보세요.
                </p>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">강의 탐색</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      다양한 방법으로 강의를 찾아볼 수 있습니다.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                      <li>카테고리별 탐색</li>
                      <li>인기 강의 목록</li>
                      <li>검색 기능 활용</li>
                      <li>추천 강의 확인</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">수강 신청 및 결제</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
                      <li>원하는 강의를 선택합니다.</li>
                      <li>강의 상세 정보를 확인합니다.</li>
                      <li>'수강 신청' 버튼을 클릭합니다.</li>
                      <li>결제 방법을 선택하고 결제를 진행합니다.</li>
                      <li>결제 완료 후 바로 수강이 가능합니다.</li>
                    </ol>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">수강 관리</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      구매한 강의는 '내 강의실'에서 관리할 수 있습니다.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                      <li>학습 진도 확인</li>
                      <li>강의 노트 작성</li>
                      <li>수료증 발급</li>
                      <li>훈련사에게 질문하기</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trainers" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">훈련사 찾기</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  전문 훈련사를 찾고 1:1 상담을 예약하는 방법을 알아보세요.
                </p>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">훈련사 탐색</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                      <li>지역별 검색</li>
                      <li>전문 분야별 필터링</li>
                      <li>평점 및 리뷰 확인</li>
                      <li>프로필 및 포트폴리오 확인</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">상담 예약</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
                      <li>원하는 훈련사의 프로필 페이지로 이동합니다.</li>
                      <li>'상담 예약' 버튼을 클릭합니다.</li>
                      <li>상담 유형(화상, 채팅, 직접 방문 등)을 선택합니다.</li>
                      <li>희망 날짜와 시간을 선택합니다.</li>
                      <li>반려동물의 상황과 상담 내용을 간략히 작성합니다.</li>
                      <li>예약을 완료하고 결제를 진행합니다.</li>
                    </ol>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">상담 준비 및 참여</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                      <li>상담 전 반려동물의 상태와 문제점을 정리해 둡니다.</li>
                      <li>필요한 경우 동영상이나 사진을 준비합니다.</li>
                      <li>예약 시간 10분 전에 접속하여 준비합니다.</li>
                      <li>화상 상담의 경우 카메라와 마이크를 미리 테스트합니다.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="communication" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">소통하기</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  PetEdu 플랫폼에서 다양한 방법으로 소통하는 방법을 알아보세요.
                </p>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">커뮤니티 이용하기</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      다른 반려인들과 정보를 공유하고 소통할 수 있는 공간입니다.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                      <li>게시글 작성 및 댓글 달기</li>
                      <li>사진 및 영상 공유</li>
                      <li>질문 및 답변</li>
                      <li>유용한 정보 북마크</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">메시징 기능</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      훈련사나 다른 회원과 개인적으로 대화할 수 있습니다.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                      <li>1:1 메시지 보내기</li>
                      <li>파일 및 사진 전송</li>
                      <li>알림 설정</li>
                      <li>메시지 검색</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">강의 내 소통</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      강의를 수강하며 훈련사 및 다른 수강생과 소통할 수 있습니다.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                      <li>강의 댓글 및 질문</li>
                      <li>토론 참여</li>
                      <li>과제 제출 및 피드백 받기</li>
                      <li>스터디 그룹 형성</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ai-features" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Smartphone className="mr-2 h-6 w-6 text-primary" />
                  AI 기능 활용하기
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  PetEdu의 인공지능 기능을 활용하여 반려동물을 더 잘 이해하고 교육해보세요.
                </p>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">AI 행동 분석</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      반려동물의 행동 패턴을 분석하고 해석해 드립니다.
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
                      <li>반려동물의 영상을 업로드합니다.</li>
                      <li>AI가 행동을 분석하여 결과를 제공합니다.</li>
                      <li>행동의 의미와 대응 방법에 대한 설명을 확인합니다.</li>
                      <li>행동 개선을 위한 맞춤 교육 방법을 추천받습니다.</li>
                    </ol>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">AI 챗봇 상담</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      24시간 언제든지 질문할 수 있는 AI 챗봇 서비스입니다.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                      <li>간단한 행동 문제에 대한 질문</li>
                      <li>건강 관련 기초 정보 확인</li>
                      <li>교육 팁 및 조언 얻기</li>
                      <li>반려동물 관리에 대한 일반적인 질문</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">AI 맞춤 교육 계획</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      반려동물의 특성과 현재 상태에 맞는 맞춤형 교육 계획을 제공합니다.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                      <li>반려동물 정보 기반 교육 로드맵 제공</li>
                      <li>단계별 훈련 가이드</li>
                      <li>진행 상황 추적 및 분석</li>
                      <li>성공적인 교육을 위한 팁과 요령</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}