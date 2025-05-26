import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, Clock, Edit, FileText, Heart, Info, Plus, TrendingUp, Award, PawPrint, Cake, Dna, 
  Weight, Target, Upload
} from "lucide-react";

export default function MyPets() {
  const [activePet, setActivePet] = useState(0);
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  const [newPet, setNewPet] = useState({
    name: "",
    breed: "",
    age: "",
    gender: "남아",
    weight: "",
    temperament: "",
    allergies: "",
    healthNotes: ""
  });

  // 반려견 추가 함수
  const handleAddPet = () => {
    if (!newPet.name || !newPet.breed || !newPet.age || !newPet.weight) {
      alert("필수 필드를 모두 입력해주세요.");
      return;
    }
    
    console.log("새 반려견 추가:", newPet);
    // 여기서 실제 API 호출 구현
    
    // 폼 초기화
    setNewPet({
      name: "",
      breed: "",
      age: "",
      gender: "남아",
      weight: "",
      temperament: "",
      allergies: "",
      healthNotes: ""
    });
    setIsAddPetOpen(false);
  };
  
  const pets = [
    {
      id: 1,
      name: "토리",
      breed: "골든 리트리버",
      age: "3세",
      gender: "남아",
      weight: "28kg",
      photo: "https://images.unsplash.com/photo-1600077106724-946750eeaf3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      health: "건강함",
      temperament: "활발함, 친근함",
      allergies: "없음",
      vaccinations: [
        { name: "종합백신", date: "2023-06-15", nextDue: "2024-06-15" },
        { name: "광견병", date: "2023-08-10", nextDue: "2024-08-10" }
      ],
      trainingSessions: [
        { name: "기초 훈련 3주차", date: "오늘 17:00" },
        { name: "어질리티 기초", date: "금요일 15:00" }
      ],
      achievements: [
        { name: "기초 명령어 마스터", date: "2023-04-10" },
        { name: "사회화 기초 완료", date: "2023-02-20" }
      ],
      medical: [
        { type: "검진", name: "연간 건강검진", date: "2023-05-15", notes: "특이사항 없음" },
        { type: "수술", name: "중성화 수술", date: "2021-09-12", notes: "정상 회복" }
      ]
    },
    {
      id: 2,
      name: "몽이",
      breed: "포메라니안",
      age: "2세",
      gender: "여아",
      weight: "3.5kg",
      photo: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      health: "건강함",
      temperament: "활발함, 경계심",
      allergies: "닭고기",
      vaccinations: [
        { name: "종합백신", date: "2023-07-20", nextDue: "2024-07-20" },
        { name: "광견병", date: "2023-07-20", nextDue: "2024-07-20" }
      ],
      trainingSessions: [
        { name: "사회화 훈련", date: "내일 14:00" }
      ],
      achievements: [
        { name: "기초 명령어 마스터", date: "2023-08-15" }
      ],
      medical: [
        { type: "검진", name: "연간 건강검진", date: "2023-07-10", notes: "특이사항 없음" },
        { type: "치과", name: "치석 제거", date: "2023-03-05", notes: "경미한 치주염 발견" }
      ]
    }
  ];

  const selectedPet = pets[activePet];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">내 반려견</h1>
        <p className="text-gray-600 dark:text-gray-300">
          반려견 프로필, 건강 기록, 훈련 일정을 관리하세요.
        </p>
      </div>

      {/* Pet Selection */}
      <div className="flex flex-wrap gap-4 mb-8">
        {pets.map((pet, index) => (
          <button
            key={pet.id}
            className={`flex items-center p-3 rounded-lg border ${
              activePet === index 
                ? "border-primary bg-primary/10" 
                : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
            }`}
            onClick={() => setActivePet(index)}
          >
            <Avatar
              src={pet.photo}
              alt={pet.name}
              className="w-10 h-10 mr-3"
              bordered
            />
            <div className="text-left">
              <h3 className="font-medium text-gray-800 dark:text-white">{pet.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{pet.breed}</p>
            </div>
          </button>
        ))}
        
        <Dialog open={isAddPetOpen} onOpenChange={setIsAddPetOpen}>
          <DialogTrigger asChild>
            <button
              className="flex items-center p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 hover:border-primary/50"
            >
              <Plus className="w-6 h-6 text-gray-400 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">반려견 추가</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>새 반려견 등록</DialogTitle>
              <DialogDescription>
                새로운 반려견을 등록하여 건강과 훈련을 관리하세요.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pet-name" className="text-right">
                  이름 *
                </Label>
                <Input
                  id="pet-name"
                  value={newPet.name}
                  onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                  className="col-span-3"
                  placeholder="토리"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pet-breed" className="text-right">
                  견종 *
                </Label>
                <Input
                  id="pet-breed"
                  value={newPet.breed}
                  onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                  className="col-span-3"
                  placeholder="골든 리트리버"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pet-age" className="text-right">
                  나이 *
                </Label>
                <Input
                  id="pet-age"
                  value={newPet.age}
                  onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
                  className="col-span-3"
                  placeholder="3세"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pet-gender" className="text-right">
                  성별
                </Label>
                <Select value={newPet.gender} onValueChange={(value) => setNewPet({ ...newPet, gender: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="남아">남아</SelectItem>
                    <SelectItem value="여아">여아</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pet-weight" className="text-right">
                  체중 *
                </Label>
                <Input
                  id="pet-weight"
                  value={newPet.weight}
                  onChange={(e) => setNewPet({ ...newPet, weight: e.target.value })}
                  className="col-span-3"
                  placeholder="28kg"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pet-temperament" className="text-right">
                  성격
                </Label>
                <Input
                  id="pet-temperament"
                  value={newPet.temperament}
                  onChange={(e) => setNewPet({ ...newPet, temperament: e.target.value })}
                  className="col-span-3"
                  placeholder="활발함, 친근함"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pet-allergies" className="text-right">
                  알레르기
                </Label>
                <Input
                  id="pet-allergies"
                  value={newPet.allergies}
                  onChange={(e) => setNewPet({ ...newPet, allergies: e.target.value })}
                  className="col-span-3"
                  placeholder="없음 또는 특정 알레르기"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pet-health-notes" className="text-right">
                  건강 메모
                </Label>
                <Textarea
                  id="pet-health-notes"
                  value={newPet.healthNotes}
                  onChange={(e) => setNewPet({ ...newPet, healthNotes: e.target.value })}
                  className="col-span-3"
                  placeholder="특별한 건강 상태나 주의사항"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddPet}>
                반려견 등록
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pet Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Profile */}
        <Card className="lg:col-span-1 overflow-hidden">
          <div className="aspect-square">
            <img
              src={selectedPet.photo}
              alt={selectedPet.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{selectedPet.name}</h2>
                <p className="text-gray-600 dark:text-gray-300">{selectedPet.breed}</p>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                수정
              </Button>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <Cake className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-3" />
                <span className="text-sm text-gray-700 dark:text-gray-300">나이: {selectedPet.age}</span>
              </div>
              <div className="flex items-center">
                <Dna className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-3" />
                <span className="text-sm text-gray-700 dark:text-gray-300">성별: {selectedPet.gender}</span>
              </div>
              <div className="flex items-center">
                <Weight className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-3" />
                <span className="text-sm text-gray-700 dark:text-gray-300">체중: {selectedPet.weight}</span>
              </div>
              <div className="flex items-center">
                <Heart className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-3" />
                <span className="text-sm text-gray-700 dark:text-gray-300">건강 상태: {selectedPet.health}</span>
              </div>
              <div className="flex items-start">
                <Target className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-3 mt-1" />
                <span className="text-sm text-gray-700 dark:text-gray-300">성격: {selectedPet.temperament}</span>
              </div>
              <div className="flex items-center">
                <Info className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-3" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  알레르기: {selectedPet.allergies}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                사진 업데이트
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                건강 기록 보기
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Training */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                예정된 훈련
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedPet.trainingSessions.length === 0 ? (
                <div className="text-center py-6">
                  <Calendar className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">예정된 훈련이 없습니다</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedPet.trainingSessions.map((session, i) => (
                    <div key={i} className="flex items-start p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="flex-shrink-0 h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-800 dark:text-white">{session.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{session.date}</p>
                      </div>
                      <Button variant="outline" size="sm" className="ml-auto text-xs">일정 보기</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Vaccinations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                예방 접종 기록
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedPet.vaccinations.map((vacc, i) => (
                  <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-start mb-2 md:mb-0">
                      <div className="flex-shrink-0 h-10 w-10 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                        <Heart className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-800 dark:text-white">{vacc.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">접종일: {vacc.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2">다음 예정: {vacc.nextDue}</Badge>
                      <Button variant="outline" size="sm" className="text-xs">기록 보기</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Award className="h-5 w-5 mr-2 text-primary" />
                훈련 성취
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedPet.achievements.map((achievement, i) => (
                  <div key={i} className="flex items-start p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex-shrink-0 h-10 w-10 bg-accent/20 text-accent dark:text-accent/90 rounded-full flex items-center justify-center">
                      <PawPrint className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-800 dark:text-white">{achievement.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">달성일: {achievement.date}</p>
                    </div>
                    <Badge className="ml-auto bg-accent/80 text-white">성취</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Medical Records */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                의료 기록
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedPet.medical.map((record, i) => (
                  <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-start mb-2 md:mb-0">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                        {record.type === "검진" ? (
                          <Heart className="h-5 w-5" />
                        ) : record.type === "수술" ? (
                          <TrendingUp className="h-5 w-5" />
                        ) : (
                          <Info className="h-5 w-5" />
                        )}
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-800 dark:text-white">{record.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {record.date} • {record.notes}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">상세 보기</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
