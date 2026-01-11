import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { UserPlus, Building2, Briefcase, Phone, Target, Award, X } from "lucide-react";

const registerSchema = z.object({
  fullName: z.string().min(2, "이름은 2자 이상 입력해주세요"),
  institution: z.string().optional(),
  researchFocus: z.string().optional(),
  phoneNumber: z.string().optional(),
  purpose: z.string().min(10, "사용 목적을 10자 이상 입력해주세요"),
  experience: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { logout } = useAuth();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      institution: "",
      researchFocus: "",
      phoneNumber: "",
      purpose: "",
      experience: "",
    },
  });

  const { data: prefillResponse } = useQuery<{ prefillData: { name: string; email: string; phone: string } | null }>({
    queryKey: ["/api/auth/prefill"],
  });

  useEffect(() => {
    if (prefillResponse?.prefillData) {
      const { name, phone } = prefillResponse.prefillData;
      if (name) {
        form.setValue("fullName", name);
      }
      if (phone) {
        form.setValue("phoneNumber", phone);
      }
    }
  }, [prefillResponse, form]);

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "회원가입 완료",
        description: "관리자 승인 후 서비스를 이용하실 수 있습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setLocation("/pending-approval");
    },
    onError: (error: any) => {
      toast({
        title: "회원가입 실패",
        description: error.message || "다시 시도해주세요",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => logout()}
          className="absolute right-4 top-4 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
          data-testid="button-close-register"
        >
          <X className="h-5 w-5" />
        </Button>
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#8BC34A] rounded-full flex items-center justify-center">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">회원가입</CardTitle>
          <CardDescription className="text-gray-600">
            Talez 연구 플랫폼 이용을 위한 정보를 입력해주세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      이름 *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="홍길동" 
                        {...field} 
                        data-testid="input-fullname"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      소속 기관
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="대학교, 연구소, 회사명 등" 
                        {...field} 
                        data-testid="input-institution"
                      />
                    </FormControl>
                    <FormDescription>
                      소속 기관이 없으면 빈칸으로 두세요
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="researchFocus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      연구 분야
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="동물행동학, 수의학, 반려동물 훈련 등" 
                        {...field} 
                        data-testid="input-research-focus"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      경력
                    </FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger data-testid="select-experience">
                          <SelectValue placeholder="경력을 선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">관련 경력 없음</SelectItem>
                          <SelectItem value="1-2years">1-2년</SelectItem>
                          <SelectItem value="3-5years">3-5년</SelectItem>
                          <SelectItem value="5-10years">5-10년</SelectItem>
                          <SelectItem value="10+years">10년 이상</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      연락처
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="010-0000-0000" 
                        {...field} 
                        data-testid="input-phone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      사용 목적 *
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Talez 플랫폼을 어떤 목적으로 사용하실 예정인지 간단히 설명해주세요"
                        className="min-h-[100px]"
                        {...field} 
                        data-testid="textarea-purpose"
                      />
                    </FormControl>
                    <FormDescription>
                      연구, 교육, 반려동물 행동 분석 등 구체적인 목적을 알려주세요
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-[#8BC34A] hover:bg-[#7CB342] text-white py-6 text-lg"
                disabled={registerMutation.isPending}
                data-testid="button-submit-register"
              >
                {registerMutation.isPending ? "처리 중..." : "회원가입 신청"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
