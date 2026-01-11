import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dog, 
  Brain, 
  Mic, 
  Video, 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  Loader2,
  Mail,
  Phone,
  User,
  Shield,
  Lock,
  Building2,
  Target
} from "lucide-react";
import { SiGoogle, SiGithub, SiApple } from "react-icons/si";
import talezLogo from "@assets/talez-logo.png";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SplashPageProps {
  isLoading?: boolean;
}

export default function SplashPage({ isLoading = false }: SplashPageProps) {
  const [showContent, setShowContent] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    institution: "",
    purpose: ""
  });
  const [adminForm, setAdminForm] = useState({
    username: "",
    password: ""
  });
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdminLogging, setIsAdminLogging] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRegisterSubmit = async () => {
    if (!registerForm.fullName || !registerForm.email || !registerForm.password || !registerForm.purpose) {
      toast({
        title: "입력 오류",
        description: "필수 항목을 모두 입력해주세요 (이름, 이메일, 비밀번호, 사용 목적)",
        variant: "destructive",
      });
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "비밀번호 오류",
        description: "비밀번호가 일치하지 않습니다",
        variant: "destructive",
      });
      return;
    }

    if (registerForm.password.length < 6) {
      toast({
        title: "비밀번호 오류",
        description: "비밀번호는 6자 이상이어야 합니다",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/public/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registerForm.email,
          password: registerForm.password,
          fullName: registerForm.fullName,
          phoneNumber: registerForm.phone,
          institution: registerForm.institution,
          purpose: registerForm.purpose,
        }),
        credentials: "include",
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setRegistrationSuccess(true);
        toast({
          title: "회원가입 완료",
          description: "관리자 승인 후 로그인할 수 있습니다.",
        });
      } else {
        toast({
          title: "회원가입 실패",
          description: data.error || "다시 시도해주세요",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "회원가입 실패",
        description: "서버 연결에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async () => {
    window.location.href = "/api/login";
  };

  const handleUserLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      toast({
        title: "입력 오류",
        description: "이메일과 비밀번호를 입력해주세요",
        variant: "destructive",
      });
      return;
    }
    
    setIsLogging(true);
    try {
      const response = await fetch("/api/public/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
        credentials: "include",
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast({
          title: "로그인 성공",
          description: "환영합니다!",
        });
        window.location.href = "/dashboard";
      } else {
        if (data.approvalStatus === 'pending') {
          toast({
            title: "승인 대기 중",
            description: "관리자 승인을 기다려주세요",
            variant: "destructive",
          });
        } else if (data.approvalStatus === 'rejected') {
          toast({
            title: "가입 거절됨",
            description: "관리자에게 문의해주세요",
            variant: "destructive",
          });
        } else {
          toast({
            title: "로그인 실패",
            description: data.error || "이메일 또는 비밀번호를 확인해주세요",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "로그인 실패",
        description: "서버 연결에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLogging(false);
    }
  };

  const handleAdminLogin = async () => {
    if (!adminForm.username || !adminForm.password) {
      toast({
        title: "입력 오류",
        description: "아이디와 비밀번호를 입력해주세요",
        variant: "destructive",
      });
      return;
    }
    
    setIsAdminLogging(true);
    try {
      const response = await apiRequest("POST", "/api/admin/login", adminForm);
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "로그인 성공",
          description: "관리자로 로그인되었습니다",
        });
        setShowAuthDialog(false);
        await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        window.location.href = "/";
      }
    } catch (error: any) {
      toast({
        title: "로그인 실패",
        description: error.message || "아이디 또는 비밀번호를 확인해주세요",
        variant: "destructive",
      });
      setIsAdminLogging(false);
    }
  };

  const features = [
    {
      icon: Mic,
      title: "음성 분석",
      description: "강아지의 짖음, 울음소리를 AI가 분석하여 감정을 파악합니다",
      color: "text-orange-500"
    },
    {
      icon: Video,
      title: "행동 분석",
      description: "실시간 영상에서 자세와 움직임을 감지하고 분석합니다",
      color: "text-purple-500"
    },
    {
      icon: Brain,
      title: "AI 인사이트",
      description: "OpenAI 기반 분석으로 반려동물의 상태를 이해합니다",
      color: "text-blue-500"
    },
    {
      icon: Sparkles,
      title: "맞춤 리포트",
      description: "종합적인 행동 분석 리포트와 훈련 조언을 제공합니다",
      color: "text-green-500"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <img 
            src={talezLogo} 
            alt="Talez" 
            className="h-20 w-auto mx-auto mb-6 animate-pulse"
          />
          <Loader2 className="w-8 h-8 animate-spin text-[#8BC34A] mx-auto" />
          <p className="mt-4 text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      <div 
        className={`transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="text-center mb-12">
            <img 
              src={talezLogo} 
              alt="Talez" 
              className="h-24 md:h-32 w-auto mx-auto mb-6"
            />
            
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
              AI 반려동물 행동 분석
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-2">
              강아지의 마음을 읽어드립니다
            </p>
            
            <Badge className="bg-[#8BC34A] text-white text-sm px-4 py-1">
              <Dog className="w-4 h-4 mr-2" />
              Powered by OpenAI
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className={`hover:shadow-lg transition-all duration-300 border-t-4 border-t-[#8BC34A] 
                  ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100 + 300}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <feature.icon className={`w-12 h-12 mx-auto mb-4 ${feature.color}`} />
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                className="bg-[#8BC34A] hover:bg-[#7CB342] text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
                onClick={() => setShowAuthDialog(true)}
                data-testid="button-login"
              >
                로그인 / 회원가입
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            
            <p className="text-sm text-gray-500">
              Google, GitHub, Apple 계정으로 간편하게 시작하세요
            </p>
          </div>

          <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
            <DialogContent className="max-w-[95vw] sm:max-w-md bg-white border shadow-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-center text-xl text-gray-900 font-bold">로그인 / 회원가입</DialogTitle>
                <DialogDescription className="text-center text-gray-600">
                  Talez에 오신 것을 환영합니다
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gray-100">
                  <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-xs" data-testid="tab-login">로그인</TabsTrigger>
                  <TabsTrigger value="contact" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-xs" data-testid="tab-contact">회원가입</TabsTrigger>
                  <TabsTrigger value="social" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-xs" data-testid="tab-social">소셜</TabsTrigger>
                  <TabsTrigger value="admin" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-xs" data-testid="tab-admin">관리자</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4 mt-4">
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 mx-auto mb-3 bg-[#8BC34A]/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-[#8BC34A]" />
                    </div>
                    <p className="text-sm text-gray-600">
                      이메일로 로그인
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="flex items-center gap-2 text-gray-800 font-medium">
                        <Mail className="w-4 h-4 text-gray-600" />
                        이메일
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="example@email.com"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                        data-testid="input-login-email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="flex items-center gap-2 text-gray-800 font-medium">
                        <Lock className="w-4 h-4 text-gray-600" />
                        비밀번호
                      </Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="비밀번호"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                        data-testid="input-login-password"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleUserLogin();
                          }
                        }}
                      />
                    </div>
                    <Button 
                      className="w-full py-6 text-base bg-[#8BC34A] hover:bg-[#7CB342] text-white font-medium"
                      onClick={handleUserLogin}
                      disabled={isLogging}
                      data-testid="button-user-login"
                    >
                      {isLogging ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      ) : (
                        <ArrowRight className="w-5 h-5 mr-2" />
                      )}
                      로그인
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="social" className="space-y-4 mt-4">
                  <p className="text-sm text-gray-600 text-center mb-4">
                    소셜 계정으로 간편하게 시작하세요
                  </p>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full py-6 text-base bg-white hover:bg-gray-50 text-gray-800 border-gray-300"
                      onClick={() => handleSocialLogin()}
                      data-testid="button-google-login"
                    >
                      <SiGoogle className="w-5 h-5 mr-3 text-red-500" />
                      Google로 계속하기
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full py-6 text-base bg-white hover:bg-gray-50 text-gray-800 border-gray-300"
                      onClick={() => handleSocialLogin()}
                      data-testid="button-github-login"
                    >
                      <SiGithub className="w-5 h-5 mr-3 text-gray-900" />
                      GitHub로 계속하기
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full py-6 text-base bg-white hover:bg-gray-50 text-gray-800 border-gray-300"
                      onClick={() => handleSocialLogin()}
                      data-testid="button-apple-login"
                    >
                      <SiApple className="w-5 h-5 mr-3 text-gray-900" />
                      Apple로 계속하기
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="admin" className="space-y-4 mt-4">
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-gray-700" />
                    </div>
                    <p className="text-sm text-gray-600">
                      관리자 계정으로 로그인
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-username" className="flex items-center gap-2 text-gray-800 font-medium">
                        <User className="w-4 h-4 text-gray-600" />
                        아이디
                      </Label>
                      <Input
                        id="admin-username"
                        placeholder="관리자 아이디"
                        value={adminForm.username}
                        onChange={(e) => setAdminForm({...adminForm, username: e.target.value})}
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                        data-testid="input-admin-username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password" className="flex items-center gap-2 text-gray-800 font-medium">
                        <Lock className="w-4 h-4 text-gray-600" />
                        비밀번호
                      </Label>
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="비밀번호"
                        value={adminForm.password}
                        onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                        data-testid="input-admin-password"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAdminLogin();
                          }
                        }}
                      />
                    </div>
                    <Button 
                      className="w-full py-6 text-base bg-gray-800 hover:bg-gray-900 text-white font-medium"
                      onClick={handleAdminLogin}
                      disabled={isAdminLogging}
                      data-testid="button-admin-login"
                    >
                      {isAdminLogging ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      ) : (
                        <Shield className="w-5 h-5 mr-2" />
                      )}
                      관리자 로그인
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="contact" className="mt-4">
                  {registrationSuccess ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">회원가입 완료!</h3>
                      <p className="text-gray-600 mb-4">
                        관리자 승인 후 로그인할 수 있습니다.<br/>
                        승인 완료 시 이메일로 안내드립니다.
                      </p>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setRegistrationSuccess(false);
                          setShowAuthDialog(false);
                        }}
                        className="text-gray-700"
                      >
                        확인
                      </Button>
                    </div>
                  ) : (
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600 text-center mb-2">
                          회원가입 정보를 입력해주세요
                        </p>
                        <div className="space-y-2">
                          <Label htmlFor="fullName" className="flex items-center gap-2 text-gray-800 font-medium">
                            <User className="w-4 h-4 text-gray-600" />
                            이름 *
                          </Label>
                          <Input
                            id="fullName"
                            placeholder="홍길동"
                            value={registerForm.fullName}
                            onChange={(e) => setRegisterForm({...registerForm, fullName: e.target.value})}
                            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                            data-testid="input-fullname"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-email" className="flex items-center gap-2 text-gray-800 font-medium">
                            <Mail className="w-4 h-4 text-gray-600" />
                            이메일 *
                          </Label>
                          <Input
                            id="reg-email"
                            type="email"
                            placeholder="example@email.com"
                            value={registerForm.email}
                            onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                            data-testid="input-reg-email"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-password" className="flex items-center gap-2 text-gray-800 font-medium">
                            <Lock className="w-4 h-4 text-gray-600" />
                            비밀번호 *
                          </Label>
                          <Input
                            id="reg-password"
                            type="password"
                            placeholder="6자 이상"
                            value={registerForm.password}
                            onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                            data-testid="input-reg-password"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-confirm-password" className="flex items-center gap-2 text-gray-800 font-medium">
                            <Lock className="w-4 h-4 text-gray-600" />
                            비밀번호 확인 *
                          </Label>
                          <Input
                            id="reg-confirm-password"
                            type="password"
                            placeholder="비밀번호 다시 입력"
                            value={registerForm.confirmPassword}
                            onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                            data-testid="input-reg-confirm-password"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-phone" className="flex items-center gap-2 text-gray-800 font-medium">
                            <Phone className="w-4 h-4 text-gray-600" />
                            휴대폰 번호
                          </Label>
                          <Input
                            id="reg-phone"
                            type="tel"
                            placeholder="010-1234-5678"
                            value={registerForm.phone}
                            onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                            data-testid="input-reg-phone"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-institution" className="flex items-center gap-2 text-gray-800 font-medium">
                            <Building2 className="w-4 h-4 text-gray-600" />
                            소속
                          </Label>
                          <Input
                            id="reg-institution"
                            placeholder="회사/기관명"
                            value={registerForm.institution}
                            onChange={(e) => setRegisterForm({...registerForm, institution: e.target.value})}
                            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                            data-testid="input-reg-institution"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-purpose" className="flex items-center gap-2 text-gray-800 font-medium">
                            <Target className="w-4 h-4 text-gray-600" />
                            사용 목적 *
                          </Label>
                          <Textarea
                            id="reg-purpose"
                            placeholder="반려동물 행동 분석, 연구 목적 등 (10자 이상)"
                            value={registerForm.purpose}
                            onChange={(e) => setRegisterForm({...registerForm, purpose: e.target.value})}
                            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 min-h-[80px]"
                            data-testid="input-reg-purpose"
                          />
                        </div>
                        <Button 
                          className="w-full py-6 text-base bg-[#8BC34A] hover:bg-[#7CB342] text-white font-medium"
                          onClick={handleRegisterSubmit}
                          disabled={isSubmitting}
                          data-testid="button-register-submit"
                        >
                          {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          ) : null}
                          회원가입 신청
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        <p className="text-xs text-gray-500 text-center pb-4">
                          * 관리자 승인 후 서비스 이용이 가능합니다
                        </p>
                      </div>
                    </ScrollArea>
                  )}
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>

          <div className="mt-16 bg-white/80 rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
              왜 Talez인가요?
            </h2>
            <div className="space-y-4">
              {[
                "실시간 AI 분석으로 반려동물의 감정을 정확하게 파악",
                "TensorFlow.js 기반 브라우저 내 포즈 감지",
                "OpenAI GPT 모델로 전문적인 행동 인사이트 제공",
                "종합 리포트로 반려동물 케어에 도움"
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#8BC34A] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <footer className="mt-16 text-center text-gray-500 text-sm">
            <p>Talez - AI 반려동물 행동 분석 플랫폼</p>
            <p className="mt-1">© 2025 Talez. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
