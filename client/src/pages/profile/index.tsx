import { useAuth } from "../../SimpleApp";
import { Redirect } from "wouter";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileUpload } from "@/components/ui/file-upload";

interface ProfilePageProps {
  userType?: string;
  section?: string;
}

// 프로필 편집을 위한 폼 스키마
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "이름은 2글자 이상이어야 합니다" }),
  email: z.string().email({ message: "올바른 이메일 형식이 아닙니다" }),
  phone: z.string().min(10, { message: "연락처를 정확히 입력해주세요" }),
  bio: z.string().optional(),
  location: z.string().optional(),
  avatar: z.string().optional()
});

export default function ProfilePage({ userType, section }: ProfilePageProps = {}) {
  const auth = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  // 권한 체크
  const checkAccess = (allowedRoles: string[]) => {
    return auth.isAuthenticated && auth.userRole && allowedRoles.includes(auth.userRole);
  };
  
  // 훈련사 프로필 접근은 훈련사와 관리자만 가능
  if (userType === "trainer" && !checkAccess(['trainer', 'admin'])) {
    return <Redirect to="/" />;
  }
  
  // 기관 관리자 프로필 접근은 기관 관리자와 관리자만 가능
  if (userType === "institute-admin" && !checkAccess(['institute-admin', 'admin'])) {
    return <Redirect to="/" />;
  }
  
  // props로 전달된 userType이 있으면 그것을 사용하고, 없으면 auth에서 가져옴
  const userRole = userType || auth.userRole;
  const userName = auth.userName;

  // 프로필 수정 폼
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: userName || "",
      email: "user@example.com", // 실제로는 서버에서 가져온 데이터 사용
      phone: "010-1234-5678",    // 실제로는 서버에서 가져온 데이터 사용
      bio: "",
      location: "",
      avatar: ""
    },
  });

  // API 호출을 위한 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 프로필 수정 제출 핸들러
  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    try {
      setIsSubmitting(true);
      
      // auth 컨텍스트의 updateUserInfo 함수를 사용하여 API 처리 일원화
      const result = await auth.updateUserInfo({
        name: values.name,
        email: values.email,
        phone: values.phone,
        bio: values.bio,
        location: values.location,
        avatar: values.avatar
      });
      
      // 업데이트 성공 시 편집 모드 종료
      if (result) {
        // 성공 메시지는 이미 updateUserInfo 내부에서 처리됨
        setIsEditing(false);
      }
      // 실패 시 메시지도 이미 updateUserInfo 내부에서 처리됨
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      // 중복 에러 메시지 방지를 위해 여기서는 표시하지 않음
    } finally {
      setIsSubmitting(false);
    }
  }

  // section이 certificates인 경우 자격증 페이지를 보여줌
  if (section === "certificates") {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">훈련사 자격증</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border dark:border-gray-700 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">반려동물 훈련사 자격증</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">발급: 한국반려동물관리협회</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">자격증 번호</p>
                  <p>PT-2023-0001</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">취득일</p>
                  <p>2023-01-15</p>
                </div>
              </div>
            </div>
            <div className="border dark:border-gray-700 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">동물행동 전문가 자격증</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">발급: 국제동물행동학회</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">자격증 번호</p>
                  <p>AB-2023-1234</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">취득일</p>
                  <p>2023-03-22</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">자격증 추가</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">자격증 이름</label>
                <input 
                  type="text" 
                  className="w-full p-2 border dark:border-gray-600 rounded-lg"
                  placeholder="자격증 이름을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">발급 기관</label>
                <input 
                  type="text" 
                  className="w-full p-2 border dark:border-gray-600 rounded-lg"
                  placeholder="발급 기관명을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">자격증 번호</label>
                <input 
                  type="text" 
                  className="w-full p-2 border dark:border-gray-600 rounded-lg"
                  placeholder="자격증 번호를 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">취득일</label>
                <input 
                  type="date" 
                  className="w-full p-2 border dark:border-gray-600 rounded-lg"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                자격증 추가
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">내 프로필</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {!isEditing ? (
          // 프로필 보기 모드
          <>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={auth.avatarUrl || ""} />
                  <AvatarFallback className="text-3xl font-bold text-primary bg-primary/10">
                    {userName ? userName.substring(0, 1).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-grow">
                <h2 className="text-xl font-semibold">{userName || "사용자"}</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {userRole === 'admin' && '시스템 관리자'}
                  {userRole === 'trainer' && '훈련사'}
                  {userRole === 'institute-admin' && '기관 관리자'}
                  {userRole === 'pet-owner' && '견주 회원'}
                  {userRole === 'user' && '일반 회원'}
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className="p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => setIsEditing(true)}
                    title="클릭하여 이메일 수정"
                  >
                    <p className="text-sm text-gray-500 dark:text-gray-400">이메일</p>
                    <p className="flex items-center">
                      {form.getValues("email") || "user@example.com"}
                    </p>
                  </div>
                  <div 
                    className="p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => setIsEditing(true)}
                    title="클릭하여 연락처 수정"
                  >
                    <p className="text-sm text-gray-500 dark:text-gray-400">연락처</p>
                    <p className="flex items-center">
                      {auth.user?.phone || "010-1234-5678"}
                    </p>
                  </div>
                  <div 
                    className="p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => window.location.href = "/certificates"}
                    title="클릭하여 활동 내역 보기"
                  >
                    <p className="text-sm text-gray-500 dark:text-gray-400">가입일</p>
                    <p>2023년 8월 15일</p>
                  </div>
                  <div 
                    className="p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => window.location.href = "/activities"}
                    title="클릭하여 활동 기록 보기"
                  >
                    <p className="text-sm text-gray-500 dark:text-gray-400">최근 로그인</p>
                    <p>2023년 10월 5일</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold mb-4">내 활동 요약</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => window.location.href = "/my-courses"}
                >
                  <h4 className="font-medium mb-2">수강 중인 강의</h4>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">클릭하여 수강 중인 강의 보기</p>
                </div>
                <div 
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => window.location.href = "/my-pets"}
                >
                  <h4 className="font-medium mb-2">등록된 반려견</h4>
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">클릭하여 등록된 반려견 보기</p>
                </div>
                <div 
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => window.location.href = "/certificates"}
                >
                  <h4 className="font-medium mb-2">완료된 훈련</h4>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">클릭하여 완료된 훈련 보기</p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <Button variant="default" onClick={() => setIsEditing(true)}>
                프로필 편집
              </Button>
            </div>
          </>
        ) : (
          // 프로필 편집 모드
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <Avatar className="w-32 h-32 mb-4">
                    <AvatarImage src={form.getValues("avatar") || ""} />
                    <AvatarFallback className="text-3xl font-bold text-primary bg-primary/10">
                      {form.getValues("name").substring(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="mt-2">
                    <FormField
                      control={form.control}
                      name="avatar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>프로필 이미지</FormLabel>
                          <FormControl>
                            <div className="flex flex-col gap-2">
                              <FileUpload
                                value={field.value || ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                disabled={isSubmitting}
                                accept="image/*"
                                maxSizeMB={2}
                                previewWidth={150}
                                previewHeight={150}
                              />
                              <p className="text-xs text-muted-foreground">
                                이미지를 직접 업로드하거나 드래그하세요
                              </p>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex-grow space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>이름</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>이메일</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>연락처</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>자기소개</FormLabel>
                    <FormControl>
                      <textarea 
                        className="w-full p-2 border dark:border-gray-600 rounded-lg bg-background" 
                        rows={4} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>지역</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  disabled={isSubmitting}
                >
                  취소
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2">저장 중</span>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    </>
                  ) : (
                    '저장'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}