import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertDogSubjectSchema } from "@shared/schema";
import { z } from "zod";
import AdvancedDogRegistration from "./AdvancedDogRegistration";
import { 
  Dog, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Heart,
  Weight,
  Calendar,
  User,
  Phone,
  FileText,
  Home,
  Activity,
  Users,
  ClipboardList
} from "lucide-react";

type DogSubjectForm = z.infer<typeof insertDogSubjectSchema>;

export default function ResearchSubjects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAdvancedDialogOpen, setIsAdvancedDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<DogSubjectForm>({
    resolver: zodResolver(insertDogSubjectSchema),
    defaultValues: {
      name: "",
      breed: "",
      age: 12,
      weight: 10,
      gender: "male",
      neutered: false,
      ownerName: "",
      ownerContact: "",
      behavioralNotes: "",
      environment: "home",
      socialLevel: "medium",
      activityLevel: "medium",
      medicalHistory: [],
    }
  });

  const { data: dogSubjects = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/research/dog-subjects'],
  });

  const addDogMutation = useMutation({
    mutationFn: async (data: DogSubjectForm) => {
      return apiRequest("/api/research/dog-subjects", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/research/dog-subjects'] });
      setIsAddDialogOpen(false);
      form.reset();
    },
  });

  const filteredDogs = dogSubjects.filter((dog: any) => {
    const matchesSearch = dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dog.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dog.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBreed = selectedBreed === "all" || dog.breed === selectedBreed;
    return matchesSearch && matchesBreed;
  });

  const uniqueBreeds = Array.from(new Set(dogSubjects.map((dog: any) => dog.breed))) as string[];

  const onSubmit = (data: DogSubjectForm) => {
    addDogMutation.mutate(data);
  };

  const getAgeInYears = (ageInMonths: number) => {
    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;
    return years > 0 ? `${years}년 ${months}개월` : `${months}개월`;
  };

  const getGenderLabel = (gender: string) => {
    return gender === "male" ? "수컷" : "암컷";
  };

  const getSocialLevelColor = (level: string) => {
    switch(level) {
      case "high": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Dog className="w-7 h-7 mr-3 text-blue-600" />
            연구 대상견 관리
          </h2>
          <p className="text-gray-600 mt-1">강아지 행동 연구를 위한 대상견 데이터베이스</p>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="flex items-center space-x-2 min-h-[44px]"
            onClick={() => setIsAdvancedDialogOpen(true)}
            data-testid="btn-advanced-registration"
          >
            <ClipboardList className="w-4 h-4" />
            <span>7단계 종합 평가</span>
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2 min-h-[44px]">
                <Plus className="w-4 h-4" />
                <span>간편 등록</span>
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>새 연구 대상견 등록</DialogTitle>
              <DialogDescription>
                행동 연구에 참여할 강아지의 상세 정보를 입력해주세요.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* 기본 정보 */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>이름</span>
                        </FormLabel>
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
                        <FormLabel className="flex items-center space-x-2">
                          <Dog className="w-4 h-4" />
                          <span>견종</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="골든리트리버" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>나이 (개월)</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="24" 
                            value={field.value || ''}
                            onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <Weight className="w-4 h-4" />
                          <span>체중 (kg)</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="25.5" 
                            value={field.value || ''}
                            onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>성별</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="성별 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">수컷</SelectItem>
                            <SelectItem value="female">암컷</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="neutered"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>중성화 여부</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* 소유자 정보 */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ownerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>소유자 이름</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="김철수" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ownerContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>연락처</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="010-1234-5678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* 환경 및 성향 정보 */}
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="environment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <Home className="w-4 h-4" />
                          <span>생활 환경</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="home">가정집</SelectItem>
                            <SelectItem value="apartment">아파트</SelectItem>
                            <SelectItem value="farm">농장</SelectItem>
                            <SelectItem value="shelter">보호소</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>사회성 수준</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="high">높음</SelectItem>
                            <SelectItem value="medium">보통</SelectItem>
                            <SelectItem value="low">낮음</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="activityLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <Activity className="w-4 h-4" />
                          <span>활동성 수준</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="high">높음</SelectItem>
                            <SelectItem value="medium">보통</SelectItem>
                            <SelectItem value="low">낮음</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* 행동 특성 */}
                <FormField
                  control={form.control}
                  name="behavioralNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>행동 특성 메모</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="특별한 행동 패턴이나 주의사항을 입력하세요..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    취소
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={addDogMutation.isPending}
                  >
                    {addDogMutation.isPending ? "등록 중..." : "등록하기"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <AdvancedDogRegistration 
        open={isAdvancedDialogOpen} 
        onOpenChange={setIsAdvancedDialogOpen}
      />

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="이름, 견종, 소유자로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Select value={selectedBreed} onValueChange={setSelectedBreed}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 견종</SelectItem>
                  {uniqueBreeds.map((breed) => (
                    <SelectItem key={breed} value={breed}>
                      {breed}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 대상견 목록 */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDogs.map((dog: any) => (
            <Card key={dog.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <Heart className="w-4 h-4 mr-2 text-red-500" />
                      {dog.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{dog.breed}</p>
                  </div>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span>{getAgeInYears(dog.age)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Weight className="w-3 h-3 text-gray-400" />
                    <span>{dog.weight}kg</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>{getGenderLabel(dog.gender)}</span>
                    {dog.neutered && <Badge variant="secondary" className="text-xs">중성화</Badge>}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Home className="w-3 h-3 text-gray-400" />
                    <span className="capitalize">{dog.environment}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className={getSocialLevelColor(dog.socialLevel)} variant="secondary">
                    사회성: {dog.socialLevel === 'high' ? '높음' : dog.socialLevel === 'medium' ? '보통' : '낮음'}
                  </Badge>
                  <Badge className={getSocialLevelColor(dog.activityLevel)} variant="secondary">
                    활동성: {dog.activityLevel === 'high' ? '높음' : dog.activityLevel === 'medium' ? '보통' : '낮음'}
                  </Badge>
                </div>

                <div className="pt-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <User className="w-3 h-3" />
                    <span>{dog.ownerName}</span>
                  </div>
                </div>

                {dog.behavioralNotes && (
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    <FileText className="w-3 h-3 inline mr-1" />
                    {dog.behavioralNotes.slice(0, 100)}...
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredDogs.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <Dog className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">등록된 연구 대상견이 없습니다.</p>
            <Button 
              className="mt-4" 
              onClick={() => setIsAddDialogOpen(true)}
            >
              첫 번째 대상견 등록하기
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}