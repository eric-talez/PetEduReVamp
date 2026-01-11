import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import {
  Dog,
  Users,
  Home,
  Stethoscope,
  Brain,
  FileText,
  Upload,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertTriangle,
  X,
} from "lucide-react";

const STEPS = [
  { id: 1, title: "강아지 정보", icon: Dog, emoji: "🐕" },
  { id: 2, title: "보호자 정보", icon: Users, emoji: "👨‍👩‍👧‍👦" },
  { id: 3, title: "환경 정보", icon: Home, emoji: "🏠" },
  { id: 4, title: "건강 평가", icon: Stethoscope, emoji: "🩺" },
  { id: 5, title: "행동 평가", icon: Brain, emoji: "🧠" },
  { id: 6, title: "문제 행동", icon: FileText, emoji: "📝" },
  { id: 7, title: "파일 업로드", icon: Upload, emoji: "📱" },
];

const BREEDS = [
  "골든 리트리버",
  "래브라도 리트리버",
  "말티즈",
  "시츄",
  "푸들",
  "비글",
  "진돗개",
  "치와와",
  "포메라니안",
  "믹스견",
  "직접입력",
];

const advancedFormSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  breed: z.string().min(1, "품종을 선택해주세요"),
  customBreed: z.string().optional(),
  ageMonths: z.number().min(1).max(300),
  gender: z.string(),
  weight: z.number().min(0.1).max(100),
  healthStatus: z.string(),
  healthHistory: z.string().optional(),
  petExperience: z.string(),
  trainingExperience: z.string(),
  absenceHours: z.string(),
  adultCount: z.number().min(1),
  childCount: z.number().min(0),
  trainingPreference: z.string(),
  housingType: z.string(),
  floorLevel: z.number().min(0),
  outdoorSpace: z.string(),
  hasElevator: z.boolean(),
  noiseSourcesArray: z.array(z.string()),
  tactileSensitivity: z.object({
    toes: z.number().min(0).max(4),
    ears: z.number().min(0).max(4),
    mouth: z.number().min(0).max(4),
  }),
  gaitPatterns: z.object({
    walk: z.string(),
    trot: z.string(),
    canter: z.string(),
    gallop: z.string(),
  }),
  jointMobility: z.object({
    spineFlexibility: z.string(),
    shoulderNormal: z.boolean(),
    elbowNormal: z.boolean(),
    kneeNormal: z.boolean(),
    ankleNormal: z.boolean(),
  }),
  behaviorScores: z.object({
    strangerAggression: z.number().min(0).max(4),
    restraintAggression: z.number().min(0).max(4),
    dogAggression: z.number().min(0).max(4),
    noiseReaction: z.number().min(0).max(4),
    separationAnxiety: z.number().min(0).max(4),
    excitementLevel: z.number().min(0).max(4),
    obedience: z.number().min(0).max(4),
    destructiveBehavior: z.number().min(0).max(4),
    excessiveBarking: z.number().min(0).max(4),
    hyperactivity: z.number().min(0).max(4),
  }),
  problemBehavior: z.object({
    category: z.string(),
    antecedent: z.string(),
    behavior: z.string(),
    consequence: z.string(),
    severity: z.number().min(1).max(5),
    durationSeconds: z.number().min(0),
    weeklyFrequency: z.number().min(0),
  }),
  uploadedFiles: z.array(z.any()).optional(),
});

type AdvancedFormData = z.infer<typeof advancedFormSchema>;

interface AdvancedDogRegistrationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dogId?: number;
}

export default function AdvancedDogRegistration({
  open,
  onOpenChange,
  dogId,
}: AdvancedDogRegistrationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AdvancedFormData>({
    resolver: zodResolver(advancedFormSchema),
    defaultValues: {
      name: "",
      breed: "",
      customBreed: "",
      ageMonths: 12,
      gender: "male_neutered",
      weight: 10,
      healthStatus: "good",
      healthHistory: "",
      petExperience: "1-3years",
      trainingExperience: "basic",
      absenceHours: "2-4",
      adultCount: 2,
      childCount: 0,
      trainingPreference: "positive",
      housingType: "apartment",
      floorLevel: 5,
      outdoorSpace: "balcony",
      hasElevator: true,
      noiseSourcesArray: [],
      tactileSensitivity: { toes: 1, ears: 1, mouth: 1 },
      gaitPatterns: { walk: "normal", trot: "normal", canter: "normal", gallop: "normal" },
      jointMobility: {
        spineFlexibility: "normal",
        shoulderNormal: true,
        elbowNormal: true,
        kneeNormal: true,
        ankleNormal: true,
      },
      behaviorScores: {
        strangerAggression: 0,
        restraintAggression: 0,
        dogAggression: 0,
        noiseReaction: 1,
        separationAnxiety: 1,
        excitementLevel: 2,
        obedience: 1,
        destructiveBehavior: 0,
        excessiveBarking: 1,
        hyperactivity: 1,
      },
      problemBehavior: {
        category: "barking",
        antecedent: "",
        behavior: "",
        consequence: "",
        severity: 2,
        durationSeconds: 30,
        weeklyFrequency: 5,
      },
      uploadedFiles: [],
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: AdvancedFormData) => {
      const payload = {
        ...data,
        uploadedFileNames: uploadedFiles.map(f => f.name),
        uploadedFileCount: uploadedFiles.length,
      };
      
      return apiRequest("/api/research/dog-subjects/advanced", "POST", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/research/dog-subjects'] });
      toast({
        title: "등록 완료",
        description: "7단계 종합 평가가 성공적으로 저장되었습니다.",
      });
      onOpenChange(false);
      form.reset();
      setCurrentStep(1);
    },
    onError: () => {
      toast({
        title: "등록 실패",
        description: "저장 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const nextStep = () => {
    if (currentStep < 7) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const onSubmit = (data: AdvancedFormData) => {
    saveMutation.mutate(data);
  };

  const calculateHealthScore = () => {
    const tactile = form.watch("tactileSensitivity");
    const gait = form.watch("gaitPatterns");
    const joint = form.watch("jointMobility");

    let score = 10;
    score -= (tactile.toes + tactile.ears + tactile.mouth) * 0.3;
    if (gait.walk !== "normal") score -= 1;
    if (gait.trot !== "normal") score -= 0.5;
    if (!joint.shoulderNormal) score -= 0.5;
    if (!joint.elbowNormal) score -= 0.5;
    if (!joint.kneeNormal) score -= 0.5;
    if (!joint.ankleNormal) score -= 0.5;

    return Math.max(1, Math.round(score * 10) / 10);
  };

  const calculateBehaviorScore = () => {
    const scores = form.watch("behaviorScores");
    const total = Object.values(scores).reduce((sum, val) => sum + val, 0);
    const maxTotal = 40;
    return Math.round((1 - total / maxTotal) * 10 * 10) / 10;
  };

  const getBehaviorRiskLevel = () => {
    const score = calculateBehaviorScore();
    if (score >= 7) return { level: "낮음", color: "text-green-600", bg: "bg-green-100" };
    if (score >= 4) return { level: "보통", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { level: "높음", color: "text-red-600", bg: "bg-red-100" };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = ['video/mp4', 'video/quicktime', 'video/avi', 'image/jpeg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 500 * 1024 * 1024;
      return isValidType && isValidSize;
    });
    
    if (uploadedFiles.length + validFiles.length <= 5) {
      setUploadedFiles([...uploadedFiles, ...validFiles]);
    } else {
      toast({
        title: "파일 제한",
        description: "최대 5개까지 업로드 가능합니다.",
        variant: "destructive",
      });
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
          <DialogTitle className="text-xl flex items-center gap-2">
            <span className="text-2xl">{STEPS[currentStep - 1].emoji}</span>
            7단계 종합 평가 시스템
          </DialogTitle>
          <DialogDescription className="text-white/80">
            {STEPS[currentStep - 1].title} ({currentStep}/7)
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`flex flex-col items-center cursor-pointer transition-all ${
                  currentStep === step.id
                    ? "scale-110"
                    : currentStep > step.id
                    ? "opacity-60"
                    : "opacity-40"
                }`}
                onClick={() => setCurrentStep(step.id)}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    currentStep === step.id
                      ? "bg-purple-600 text-white"
                      : currentStep > step.id
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > step.id ? <Check className="w-5 h-5" /> : step.emoji}
                </div>
                <span className="text-xs mt-1 hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
          <Progress value={(currentStep / 7) * 100} className="h-2" />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {currentStep === 1 && (
                <Step1DogInfo form={form} />
              )}
              {currentStep === 2 && (
                <Step2GuardianInfo form={form} />
              )}
              {currentStep === 3 && (
                <Step3EnvironmentInfo form={form} />
              )}
              {currentStep === 4 && (
                <Step4HealthEvaluation form={form} healthScore={calculateHealthScore()} />
              )}
              {currentStep === 5 && (
                <Step5BehaviorEvaluation 
                  form={form} 
                  behaviorScore={calculateBehaviorScore()}
                  riskLevel={getBehaviorRiskLevel()}
                />
              )}
              {currentStep === 6 && (
                <Step6ProblemBehavior form={form} />
              )}
              {currentStep === 7 && (
                <Step7FileUpload
                  uploadedFiles={uploadedFiles}
                  onFileUpload={handleFileUpload}
                  onRemoveFile={removeFile}
                />
              )}
            </form>
          </Form>
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="min-h-[44px]"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            이전
          </Button>

          <div className="flex gap-2">
            {currentStep < 7 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="min-h-[44px] bg-gradient-to-r from-purple-600 to-blue-600"
              >
                다음
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                disabled={saveMutation.isPending}
                className="min-h-[44px] bg-gradient-to-r from-green-600 to-emerald-600"
              >
                {saveMutation.isPending ? "저장 중..." : "등록 완료"}
                <Check className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Step1DogInfo({ form }: { form: any }) {
  const selectedBreed = form.watch("breed");
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            🐕 강아지 기본 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이름 *</FormLabel>
                  <FormControl>
                    <Input placeholder="강아지 이름" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="breed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>품종 *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="품종 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BREEDS.map((breed) => (
                        <SelectItem key={breed} value={breed}>
                          {breed}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedBreed === "직접입력" && (
              <FormField
                control={form.control}
                name="customBreed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>품종 직접 입력</FormLabel>
                    <FormControl>
                      <Input placeholder="품종명 입력" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="ageMonths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>나이 (개월)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>성별</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male_neutered">수컷 (중성화O)</SelectItem>
                      <SelectItem value="male">수컷 (중성화X)</SelectItem>
                      <SelectItem value="female_neutered">암컷 (중성화O)</SelectItem>
                      <SelectItem value="female">암컷 (중성화X)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>체중 (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="healthStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>건강 상태</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="good">양호</SelectItem>
                      <SelectItem value="minor_issues">약간의 이상 징후</SelectItem>
                      <SelectItem value="under_treatment">치료 중</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="healthHistory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>건강 이력 (선택사항)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="과거 질병, 수술, 알레르기 등의 이력을 입력해주세요"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function Step2GuardianInfo({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            👨‍👩‍👧‍👦 보호자 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="petExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>반려 경험</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="first">첫 반려</SelectItem>
                      <SelectItem value="1-3years">1-3년</SelectItem>
                      <SelectItem value="3-5years">3-5년</SelectItem>
                      <SelectItem value="5+years">5년 이상</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trainingExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>훈련 경험</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">전혀 없음</SelectItem>
                      <SelectItem value="basic">기본적인 경험</SelectItem>
                      <SelectItem value="intermediate">중급 수준</SelectItem>
                      <SelectItem value="expert">전문가 수준</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="absenceHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>하루 부재 시간</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0-2">0-2시간</SelectItem>
                      <SelectItem value="2-4">2-4시간</SelectItem>
                      <SelectItem value="4-8">4-8시간</SelectItem>
                      <SelectItem value="8+">8시간 이상</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="adultCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>성인 수</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="childCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>아이 수</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="trainingPreference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>훈련 방식 선호도</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="positive" id="positive" />
                      <Label htmlFor="positive">긍정 강화 방식</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="balanced" id="balanced" />
                      <Label htmlFor="balanced">균형 잡힌 방식</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">기타</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function Step3EnvironmentInfo({ form }: { form: any }) {
  const NOISE_SOURCES = [
    { id: "doorbell", label: "초인종" },
    { id: "elevator", label: "엘리베이터" },
    { id: "hallway", label: "복도 소음" },
    { id: "other_dogs", label: "다른 개 짖음" },
    { id: "traffic", label: "차량 소음" },
    { id: "construction", label: "공사 소음" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            🏠 환경 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="housingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>주거 형태</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="apartment">아파트</SelectItem>
                      <SelectItem value="house">단독주택</SelectItem>
                      <SelectItem value="townhouse">타운하우스</SelectItem>
                      <SelectItem value="officetel">오피스텔</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="floorLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>층수</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="outdoorSpace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>마당/발코니</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">없음</SelectItem>
                      <SelectItem value="balcony">발코니</SelectItem>
                      <SelectItem value="small_yard">작은 마당</SelectItem>
                      <SelectItem value="large_yard">큰 마당</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hasElevator"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>엘리베이터</FormLabel>
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="noiseSourcesArray"
            render={() => (
              <FormItem>
                <FormLabel>주요 소음원 (복수 선택 가능)</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {NOISE_SOURCES.map((source) => (
                    <FormField
                      key={source.id}
                      control={form.control}
                      name="noiseSourcesArray"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(source.id)}
                              onCheckedChange={(checked) => {
                                const current = field.value || [];
                                if (checked) {
                                  field.onChange([...current, source.id]);
                                } else {
                                  field.onChange(current.filter((v: string) => v !== source.id));
                                }
                              }}
                            />
                          </FormControl>
                          <Label className="text-sm font-normal">{source.label}</Label>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function Step4HealthEvaluation({ form, healthScore }: { form: any; healthScore: number }) {
  const renderSlider = (name: string, label: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex justify-between">
            <FormLabel>{label}</FormLabel>
            <Badge variant="outline">{field.value}/4</Badge>
          </div>
          <FormControl>
            <Slider
              min={0}
              max={4}
              step={1}
              value={[field.value]}
              onValueChange={(value) => field.onChange(value[0])}
              className="mt-2"
            />
          </FormControl>
          <FormDescription className="text-xs">
            0: 전혀 민감하지 않음 → 4: 극도로 민감
          </FormDescription>
        </FormItem>
      )}
    />
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            🩺 촉각 민감도 평가
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderSlider("tactileSensitivity.toes", "발가락 터치 민감도")}
          {renderSlider("tactileSensitivity.ears", "귀 터치 민감도")}
          {renderSlider("tactileSensitivity.mouth", "입/주둥이 터치 민감도")}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            🚶 보행 패턴 분석
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "gaitPatterns.walk", label: "걷기 (Walk)" },
              { name: "gaitPatterns.trot", label: "빠른걸음 (Trot)" },
              { name: "gaitPatterns.canter", label: "뛰기 (Canter)" },
              { name: "gaitPatterns.gallop", label: "전력질주 (Gallop)" },
            ].map((gait) => (
              <FormField
                key={gait.name}
                control={form.control}
                name={gait.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{gait.label}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="normal">정상</SelectItem>
                        <SelectItem value="slight">약간 절뚝임/불균형</SelectItem>
                        <SelectItem value="clear">명확한 절뚝임/불균형</SelectItem>
                        <SelectItem value="severe">심함/불가능</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            🦴 관절 가동범위
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="jointMobility.spineFlexibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>척추 유연성</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="normal">정상</SelectItem>
                    <SelectItem value="slight">약간 제한적</SelectItem>
                    <SelectItem value="clear">명확히 제한적</SelectItem>
                    <SelectItem value="severe">심각하게 제한적</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "jointMobility.shoulderNormal", label: "어깨 관절" },
              { name: "jointMobility.elbowNormal", label: "팔꿈치 관절" },
              { name: "jointMobility.kneeNormal", label: "무릎 관절" },
              { name: "jointMobility.ankleNormal", label: "발목 관절" },
            ].map((joint) => (
              <FormField
                key={joint.name}
                control={form.control}
                name={joint.name}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0 p-3 border rounded-lg">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">{joint.label} 정상</FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">전반적 건강 점수</span>
            <Badge className="text-xl px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600">
              {healthScore}/10
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Step5BehaviorEvaluation({ 
  form, 
  behaviorScore,
  riskLevel 
}: { 
  form: any; 
  behaviorScore: number;
  riskLevel: { level: string; color: string; bg: string };
}) {
  const renderBehaviorSlider = (name: string, label: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex justify-between">
            <FormLabel className="text-sm">{label}</FormLabel>
            <Badge variant="outline" className="text-xs">{field.value}/4</Badge>
          </div>
          <FormControl>
            <Slider
              min={0}
              max={4}
              step={1}
              value={[field.value]}
              onValueChange={(value) => field.onChange(value[0])}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            😠 공격성 행동
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderBehaviorSlider("behaviorScores.strangerAggression", "낯선 사람 방문 시 반응")}
          {renderBehaviorSlider("behaviorScores.restraintAggression", "보호자 제지 시 반응")}
          {renderBehaviorSlider("behaviorScores.dogAggression", "다른 개 반응")}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            😰 불안 및 두려움
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderBehaviorSlider("behaviorScores.noiseReaction", "소음 반응")}
          {renderBehaviorSlider("behaviorScores.separationAnxiety", "분리 불안")}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            ⚡ 흥분성 및 에너지
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderBehaviorSlider("behaviorScores.excitementLevel", "흥분 수준")}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            🎓 훈련성 및 순종
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderBehaviorSlider("behaviorScores.obedience", "훈련 순종도 (낮을수록 좋음)")}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            ⚠️ 기타 문제행동
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderBehaviorSlider("behaviorScores.destructiveBehavior", "파괴 행동")}
          {renderBehaviorSlider("behaviorScores.excessiveBarking", "과도한 짖음")}
          {renderBehaviorSlider("behaviorScores.hyperactivity", "과잉 활동")}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <span className="text-sm text-gray-600">전체 행동 점수</span>
              <Badge className="text-xl px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 block mt-2">
                {behaviorScore}/10
              </Badge>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-600">위험도</span>
              <Badge className={`text-xl px-4 py-2 block mt-2 ${riskLevel.bg} ${riskLevel.color}`}>
                {riskLevel.level}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Step6ProblemBehavior({ form }: { form: any }) {
  const PROBLEM_CATEGORIES = [
    { value: "barking", label: "짖음" },
    { value: "separation_anxiety", label: "분리불안" },
    { value: "leash_reactive", label: "리드 리액티브" },
    { value: "resource_guarding", label: "리소스 가딩" },
    { value: "potty_training", label: "배변 훈련 실패" },
    { value: "jumping_biting", label: "점프/입질" },
    { value: "over_excitement", label: "과잉 흥분" },
    { value: "other", label: "기타" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            📝 문제 행동 분석 (ABC 분석)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="problemBehavior.category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>문제 행동 카테고리</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PROBLEM_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="problemBehavior.antecedent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>A (선행사건) - 언제, 어떤 상황에서 발생하는지</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="예: 보호자가 외출 준비를 할 때, 초인종이 울릴 때..."
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="problemBehavior.behavior"
            render={({ field }) => (
              <FormItem>
                <FormLabel>B (행동) - 구체적인 행동 설명</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="예: 큰 소리로 짖기 시작하고, 문 앞에서 왔다갔다 함..."
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="problemBehavior.consequence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>C (결과) - 행동 후 결과</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="예: 보호자가 달래거나, 간식을 주거나, 무시하거나..."
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="problemBehavior.severity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>심각도 (1-5)</FormLabel>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">경미함</span>
                    <Badge variant="outline">{field.value}/5</Badge>
                    <span className="text-xs text-gray-500">매우 심각</span>
                  </div>
                  <FormControl>
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="problemBehavior.durationSeconds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>지속 시간 (초)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="problemBehavior.weeklyFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>주간 빈도 (회/주)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Step7FileUpload({ 
  uploadedFiles, 
  onFileUpload, 
  onRemoveFile 
}: { 
  uploadedFiles: File[];
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            📱 영상/이미지 업로드
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">파일을 드래그하거나 클릭하여 업로드</p>
            <p className="text-sm text-gray-500 mb-4">
              MP4, MOV, AVI, JPG, PNG | 최대 500MB | 최대 5개
            </p>
            <input
              type="file"
              multiple
              accept="video/mp4,video/quicktime,video/avi,image/jpeg,image/png"
              onChange={onFileUpload}
              className="hidden"
              id="file-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              파일 선택
            </Button>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">업로드된 파일 ({uploadedFiles.length}/5)</h4>
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {file.type.startsWith('video') ? (
                      <Badge variant="secondary">영상</Badge>
                    ) : (
                      <Badge variant="outline">이미지</Badge>
                    )}
                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      ({(file.size / 1024 / 1024).toFixed(1)}MB)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveFile(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Card className="bg-blue-50">
            <CardContent className="pt-4">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-blue-600" />
                촬영 가이드
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 30-60초 분량의 영상 권장</li>
                <li>• 문제 행동 발생 전 5초를 포함해주세요</li>
                <li>• 강아지 전신이 보이도록 촬영</li>
                <li>• 가능하면 측면에서 촬영</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-4">
              <p className="text-sm text-yellow-800">
                📌 파일 업로드는 선택 사항입니다. 파일 없이도 평가를 완료할 수 있습니다.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
