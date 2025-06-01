import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PawPrint, Heart, Calendar, FileText, Plus, Camera, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function MyPetsPage() {
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [newPet, setNewPet] = useState({
    name: "",
    breed: "",
    age: "",
    weight: "",
    gender: "",
    description: "",
    temperament: "",
    allergies: "",
    photo: null
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 반려견 목록 조회
  const { data: petsResponse, isLoading } = useQuery({
    queryKey: ['/api/pets'],
    enabled: true
  });

  const pets = petsResponse?.pets || [];

  // 반려견 등록 뮤테이션
  const registerPetMutation = useMutation({
    mutationFn: async (petData) => {
      return apiRequest("POST", "/api/pets", petData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      toast({
        title: "반려견 등록 완료",
        description: "새로운 반려견이 성공적으로 등록되었습니다.",
      });
      setIsRegisterDialogOpen(false);
      setNewPet({
        name: "",
        breed: "",
        age: "",
        weight: "",
        gender: "",
        description: "",
        temperament: "",
        allergies: "",
        photo: null
      });
    },
    onError: (error) => {
      toast({
        title: "등록 실패",
        description: "반려견 등록 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  // 프로필 사진 업데이트 뮤테이션
  const updatePhotoMutation = useMutation({
    mutationFn: async ({ petId, photoFile }) => {
      const formData = new FormData();
      formData.append("photo", photoFile);
      return apiRequest("PUT", `/api/pets/${petId}/photo`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      toast({
        title: "프로필 사진 변경 완료",
        description: "반려견 프로필 사진이 성공적으로 변경되었습니다.",
      });
      setIsPhotoDialogOpen(false);
      setSelectedPet(null);
    },
    onError: (error) => {
      toast({
        title: "사진 변경 실패",
        description: "프로필 사진 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  // 반려견 등록 핸들러
  const handleRegisterPet = () => {
    if (!newPet.name || !newPet.breed || !newPet.age || !newPet.weight) {
      toast({
        title: "입력 오류",
        description: "필수 항목을 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    registerPetMutation.mutate(newPet);
  };

  // 사진 변경 핸들러
  const handlePhotoChange = (petId) => {
    setSelectedPet(petId);
    setIsPhotoDialogOpen(true);
  };

  // 파일 업로드 핸들러
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && selectedPet) {
      updatePhotoMutation.mutate({ petId: selectedPet, photoFile: file });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">내 반려견</h1>
          <p className="text-gray-600">반려견 정보와 훈련 현황을 관리하세요.</p>
        </div>
        
        <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              반려견 등록
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>새 반려견 등록</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">이름 *</Label>
                <Input
                  id="name"
                  value={newPet.name}
                  onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                  placeholder="반려견 이름을 입력하세요"
                />
              </div>
              
              <div>
                <Label htmlFor="breed">품종 *</Label>
                <Select
                  value={newPet.breed}
                  onValueChange={(value) => setNewPet({ ...newPet, breed: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="품종을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="골든 리트리버">골든 리트리버</SelectItem>
                    <SelectItem value="말티즈">말티즈</SelectItem>
                    <SelectItem value="비숑 프리제">비숑 프리제</SelectItem>
                    <SelectItem value="포메라니안">포메라니안</SelectItem>
                    <SelectItem value="시바견">시바견</SelectItem>
                    <SelectItem value="푸들">푸들</SelectItem>
                    <SelectItem value="치와와">치와와</SelectItem>
                    <SelectItem value="코기">코기</SelectItem>
                    <SelectItem value="기타">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">나이 *</Label>
                  <Input
                    id="age"
                    value={newPet.age}
                    onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
                    placeholder="예: 2세 3개월"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">체중 *</Label>
                  <Input
                    id="weight"
                    value={newPet.weight}
                    onChange={(e) => setNewPet({ ...newPet, weight: e.target.value })}
                    placeholder="예: 5.2kg"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="gender">성별</Label>
                <Select
                  value={newPet.gender}
                  onValueChange={(value) => setNewPet({ ...newPet, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="성별을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="남아">남아</SelectItem>
                    <SelectItem value="여아">여아</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="temperament">성격</Label>
                <Input
                  id="temperament"
                  value={newPet.temperament}
                  onChange={(e) => setNewPet({ ...newPet, temperament: e.target.value })}
                  placeholder="예: 활발함, 온순함"
                />
              </div>
              
              <div>
                <Label htmlFor="allergies">알레르기</Label>
                <Input
                  id="allergies"
                  value={newPet.allergies}
                  onChange={(e) => setNewPet({ ...newPet, allergies: e.target.value })}
                  placeholder="예: 견과류, 특정 사료"
                />
              </div>
              
              <div>
                <Label htmlFor="description">특이사항</Label>
                <Textarea
                  id="description"
                  value={newPet.description}
                  onChange={(e) => setNewPet({ ...newPet, description: e.target.value })}
                  placeholder="반려견의 특이사항이나 건강 상태를 기록하세요"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={() => setIsRegisterDialogOpen(false)} 
                  variant="outline" 
                  className="flex-1"
                >
                  취소
                </Button>
                <Button 
                  onClick={handleRegisterPet}
                  disabled={registerPetMutation.isPending}
                  className="flex-1"
                >
                  {registerPetMutation.isPending ? "등록 중..." : "등록"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pets.map((pet) => (
          <Card key={pet.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl">{pet.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {pet.breed} • {pet.age}
                  </CardDescription>
                </div>
                <Badge variant={pet.status === "훈련중" ? "default" : "secondary"}>
                  {pet.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div 
                  className="relative mx-auto cursor-pointer group"
                  onClick={() => handlePhotoChange(pet.id)}
                >
                  <Avatar className="w-20 h-20 mx-auto">
                    <AvatarImage src={pet.photo} />
                    <AvatarFallback>
                      <PawPrint className="w-8 h-8 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 bg-primary rounded-full p-2 shadow-lg">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-medium">사진 변경</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">체중</span>
                    <p className="font-medium">{pet.weight ? `${(pet.weight / 1000).toFixed(1)}kg` : '미등록'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">나이</span>
                    <p className="font-medium">{pet.age}세</p>
                  </div>
                  <div>
                    <span className="text-gray-600">성별</span>
                    <p className="font-medium">{pet.gender || '미등록'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">품종</span>
                    <p className="font-medium">{pet.breed}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-900">건강 상태</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {pet.health || '건강함'}
                    </Badge>
                  </div>
                  
                  {pet.temperament && (
                    <div className="flex items-center text-gray-600 text-sm">
                      <Heart className="w-4 h-4 mr-2" />
                      성격: {pet.temperament}
                    </div>
                  )}
                  
                  {pet.description && (
                    <div className="text-gray-600 text-sm">
                      <p className="line-clamp-2">{pet.description}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Heart className="w-4 h-4 mr-2" />
                    케어 일지
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    상세 정보
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pets.length === 0 && (
        <div className="text-center py-12">
          <PawPrint className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">등록된 반려견이 없습니다</h3>
          <p className="text-gray-600 mb-4">새로운 반려견을 등록해보세요.</p>
          <Button onClick={() => setIsRegisterDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            반려견 등록
          </Button>
        </div>
      )}

      {/* 프로필 사진 변경 다이얼로그 */}
      <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>프로필 사진 변경</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                새로운 프로필 사진을 업로드하세요
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <Upload className="w-4 h-4 mr-2" />
                사진 선택
              </label>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => setIsPhotoDialogOpen(false)} 
                variant="outline" 
                className="flex-1"
              >
                취소
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}