import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Building, Info, Upload, CheckCircle, Calendar, MapPin, Phone, Mail, FileQuestion, FileCheck } from 'lucide-react';

// 등록 요청 폼 스키마
const registerFormSchema = z.object({
  name: z.string().min(2, { message: "교육 기관 이름은 최소 2자 이상이어야 합니다." }),
  category: z.string({ required_error: "카테고리를 선택해주세요." }),
  representative: z.string().min(2, { message: "대표자 이름은 최소 2자 이상이어야 합니다." }),
  businessNumber: z.string().min(10, { message: "사업자 등록 번호 형식이 올바르지 않습니다." })
    .max(12, { message: "사업자 등록 번호 형식이 올바르지 않습니다." }),
  phone: z.string().min(10, { message: "연락처 형식이 올바르지 않습니다." })
    .max(13, { message: "연락처 형식이 올바르지 않습니다." }),
  email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요." }),
  website: z.string().optional(),
  address: z.string().min(5, { message: "주소는 최소 5자 이상이어야 합니다." }),
  detailedAddress: z.string().optional(),
  description: z.string().min(10, { message: "소개는 최소 10자 이상이어야 합니다." })
    .max(500, { message: "소개는 최대 500자까지 입력 가능합니다." }),
  facilities: z.array(z.string()).optional(),
  openingHours: z.string().min(2, { message: "운영 시간을 입력해주세요." }),
  established: z.string().min(4, { message: "설립 연도를 입력해주세요." }),
  trainerCount: z.string().min(1, { message: "훈련사 수를 입력해주세요." }),
  hasPhotos: z.boolean().optional(),
  hasCertification: z.boolean().optional(),
  termsAgreed: z.boolean().refine(val => val === true, {
    message: "이용약관에 동의해주세요."
  }),
  privacyAgreed: z.boolean().refine(val => val === true, {
    message: "개인정보 수집 및 이용에 동의해주세요."
  }),
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function InstituteRegister() {
  const [step, setStep] = useState(1);
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      category: "",
      representative: "",
      businessNumber: "",
      phone: "",
      email: "",
      website: "",
      address: "",
      detailedAddress: "",
      description: "",
      facilities: [],
      openingHours: "",
      established: "",
      trainerCount: "",
      hasPhotos: false,
      hasCertification: false,
      termsAgreed: false,
      privacyAgreed: false,
    },
  });
  
  // 다음 단계로 이동
  const handleNextStep = () => {
    if (step === 1) {
      form.trigger(['name', 'category', 'representative', 'businessNumber', 'phone', 'email', 'address']);
      
      const basicInfoErrors = [
        'name', 'category', 'representative', 'businessNumber', 'phone', 'email', 'address'
      ].some(field => !!form.formState.errors[field as keyof RegisterFormValues]);
      
      if (!basicInfoErrors) {
        setStep(2);
        window.scrollTo(0, 0);
      }
    }
  };
  
  // 이전 단계로 이동
  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1);
      window.scrollTo(0, 0);
    }
  };
  
  // 폼 제출 처리
  const onSubmit = (data: RegisterFormValues) => {
    toast({
      title: "교육 기관 등록 요청이 접수되었습니다",
      description: "검토 후 승인 여부를 이메일로 안내해 드리겠습니다."
    });
    
    console.log('Form data:', data);
    
    // 제출 완료 후 홈페이지로 리다이렉트
    setTimeout(() => {
      window.location.href = '/institutes';
    }, 2000);
  };

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">교육 기관 등록 요청</h1>
          <p className="text-gray-600 dark:text-gray-300">
            교육 기관 등록을 위한 정보를 입력해주세요. 제출 후 검토를 거쳐 승인 여부를 안내해 드립니다.
          </p>
        </div>
        
        {/* 진행 상태 표시 */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <div className={`flex-1 text-center ${step === 1 ? 'text-primary font-medium' : 'text-gray-500'}`}>
              1. 기본 정보
            </div>
            <div className={`flex-1 text-center ${step === 2 ? 'text-primary font-medium' : 'text-gray-500'}`}>
              2. 상세 정보 및 약관 동의
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all" 
              style={{ width: step === 1 ? '50%' : '100%' }}
            ></div>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 단계 1: 기본 정보 */}
            {step === 1 && (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Building className="mr-2 h-5 w-5 text-primary" />
                    교육 기관 기본 정보
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>교육 기관명 *</FormLabel>
                          <FormControl>
                            <Input placeholder="교육 기관 이름을 입력하세요" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>교육 기관 유형 *</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="교육 기관 유형을 선택하세요" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="종합 교육">종합 교육</SelectItem>
                              <SelectItem value="행동 교정">행동 교정</SelectItem>
                              <SelectItem value="사회화 중심">사회화 중심</SelectItem>
                              <SelectItem value="유견 특화">유견 특화</SelectItem>
                              <SelectItem value="운동 특화">운동 특화</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <FormField
                      control={form.control}
                      name="representative"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>대표자명 *</FormLabel>
                          <FormControl>
                            <Input placeholder="대표자 이름을 입력하세요" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="businessNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>사업자 등록번호 *</FormLabel>
                          <FormControl>
                            <Input placeholder="000-00-00000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Info className="mr-2 h-5 w-5 text-primary" />
                    연락처 정보
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>전화번호 *</FormLabel>
                          <FormControl>
                            <Input placeholder="02-000-0000 또는 010-0000-0000" {...field} />
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
                          <FormLabel>이메일 *</FormLabel>
                          <FormControl>
                            <Input placeholder="example@domain.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="mt-6">
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>웹사이트</FormLabel>
                          <FormControl>
                            <Input placeholder="https://www.example.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            웹사이트가 있는 경우 입력해주세요.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-primary" />
                    위치 정보
                  </h2>
                  
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>주소 *</FormLabel>
                          <FormControl>
                            <Input placeholder="도로명 주소를 입력하세요" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="detailedAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>상세 주소</FormLabel>
                          <FormControl>
                            <Input placeholder="상세 주소를 입력하세요" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="button" onClick={handleNextStep}>
                    다음 단계
                  </Button>
                </div>
              </>
            )}
            
            {/* 단계 2: 상세 정보 및 약관 동의 */}
            {step === 2 && (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <FileQuestion className="mr-2 h-5 w-5 text-primary" />
                    교육 기관 상세 정보
                  </h2>
                  
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>교육 기관 소개 *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="교육 기관에 대한 소개를 입력하세요" 
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            교육 기관의 특징, 강점, 교육 철학 등을 자세히 설명해주세요.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="openingHours"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>운영 시간 *</FormLabel>
                            <FormControl>
                              <Input placeholder="예) 평일 10:00-19:00, 주말 10:00-17:00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="established"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>설립 연도 *</FormLabel>
                            <FormControl>
                              <Input placeholder="예) 2018년" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="trainerCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>훈련사 수 *</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" placeholder="예) 3" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="hasPhotos"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>시설 사진 제공 가능</FormLabel>
                              <FormDescription>
                                승인 후 시설 사진을 제공할 수 있습니다.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="hasCertification"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>교육 기관 인증서 보유</FormLabel>
                              <FormDescription>
                                반려동물 교육과 관련된 공인 인증서를 보유하고 있습니다.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <FileCheck className="mr-2 h-5 w-5 text-primary" />
                    약관 동의
                  </h2>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="termsAgreed"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>이용약관 동의 *</FormLabel>
                            <FormDescription>
                              <a href="#" className="text-primary underline">이용약관</a>에 동의합니다.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="privacyAgreed"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>개인정보 수집 및 이용 동의 *</FormLabel>
                            <FormDescription>
                              <a href="#" className="text-primary underline">개인정보 수집 및 이용</a>에 동의합니다.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handlePrevStep}>
                    이전 단계
                  </Button>
                  <Button type="submit">
                    등록 요청하기
                  </Button>
                </div>
              </>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}