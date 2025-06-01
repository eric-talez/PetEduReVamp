
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Syringe, Heart, Calendar, FileText, Eye } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';

interface Pet {
  id: number;
  name: string;
  breed: string;
  age: number;
  ownerId: number;
}

interface Vaccination {
  id: number;
  petId: number;
  vaccineName: string;
  vaccineType: string;
  vaccineDate: string;
  nextDueDate?: string;
  veterinarian?: string;
  clinicName?: string;
  notes?: string;
}

interface HealthCheckup {
  id: number;
  petId: number;
  checkupDate: string;
  weight?: number;
  temperature?: string;
  diagnosis?: string;
  treatment?: string;
  veterinarian?: string;
  clinicName?: string;
  notes?: string;
  nextCheckupDate?: string;
}

export default function HealthRecordPage() {
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [isVaccinationDialogOpen, setIsVaccinationDialogOpen] = useState(false);
  const [isCheckupDialogOpen, setIsCheckupDialogOpen] = useState(false);
  const [isPetAddDialogOpen, setIsPetAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 반려동물 목록 조회
  const { data: petsData } = useQuery({
    queryKey: ['/api/pets'],
    enabled: true
  });

  const pets = petsData?.pets || [];
  const selectedPet = pets.find((pet: Pet) => pet.id === selectedPetId) || pets[0];

  // 예방접종 기록 조회
  const { data: vaccinationsData } = useQuery({
    queryKey: ['/api/pets', selectedPet?.id, 'vaccinations'],
    enabled: !!selectedPet?.id
  });

  // 건강검진 기록 조회  
  const { data: checkupsData } = useQuery({
    queryKey: ['/api/pets', selectedPet?.id, 'checkups'],
    enabled: !!selectedPet?.id
  });

  // 예방접종 기록 추가
  const addVaccinationMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/pets/${selectedPet?.id}/vaccinations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('예방접종 기록 추가 실패');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pets', selectedPet?.id, 'vaccinations'] });
      setIsVaccinationDialogOpen(false);
      toast({ title: "예방접종 기록이 추가되었습니다" });
    }
  });

  // 건강검진 기록 추가
  const addCheckupMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/pets/${selectedPet?.id}/checkups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('건강검진 기록 추가 실패');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pets', selectedPet?.id, 'checkups'] });
      setIsCheckupDialogOpen(false);
      toast({ title: "건강검진 기록이 추가되었습니다" });
    }
  });

  const handleVaccinationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      vaccineName: formData.get('vaccineName'),
      vaccineType: formData.get('vaccineType'),
      vaccineDate: formData.get('vaccineDate'),
      nextDueDate: formData.get('nextDueDate') || null,
      veterinarian: formData.get('veterinarian'),
      clinicName: formData.get('clinicName'),
      notes: formData.get('notes')
    };
    addVaccinationMutation.mutate(data);
  };

  const handleCheckupSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      checkupDate: formData.get('checkupDate'),
      weight: formData.get('weight') ? parseInt(formData.get('weight') as string) : null,
      temperature: formData.get('temperature'),
      diagnosis: formData.get('diagnosis'),
      treatment: formData.get('treatment'),
      veterinarian: formData.get('veterinarian'),
      clinicName: formData.get('clinicName'),
      notes: formData.get('notes'),
      nextCheckupDate: formData.get('nextCheckupDate') || null
    };
    addCheckupMutation.mutate(data);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">반려동물 건강 관리</h1>
      
      {/* 반려동물 선택 */}
      {pets.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>반려동물 선택</CardTitle>
            {selectedPet && (
              <Link href={`/pet-care/pet-detail/${selectedPet.id}`}>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  케어일지 상세보기
                </Button>
              </Link>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              {pets.map((pet: Pet) => (
                <Button
                  key={pet.id}
                  variant={selectedPet?.id === pet.id ? "default" : "outline"}
                  onClick={() => setSelectedPetId(pet.id)}
                  className="flex items-center gap-2"
                >
                  <Heart className="w-4 h-4" />
                  {pet.name} ({pet.breed})
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedPet && (
        <Tabs defaultValue="vaccinations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="vaccinations">
              <Syringe className="w-4 h-4 mr-2" />
              예방접종 기록
            </TabsTrigger>
            <TabsTrigger value="checkups">
              <Heart className="w-4 h-4 mr-2" />
              건강검진 기록
            </TabsTrigger>
          </TabsList>

          {/* 예방접종 기록 탭 */}
          <TabsContent value="vaccinations">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{selectedPet.name}의 예방접종 기록</CardTitle>
                  <Dialog open={isVaccinationDialogOpen} onOpenChange={setIsVaccinationDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        접종 기록 추가
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>예방접종 기록 추가</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleVaccinationSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="vaccineName">백신명</Label>
                          <Input id="vaccineName" name="vaccineName" required />
                        </div>
                        <div>
                          <Label htmlFor="vaccineType">백신 종류</Label>
                          <Select name="vaccineType">
                            <SelectTrigger>
                              <SelectValue placeholder="백신 종류 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="종합백신">종합백신</SelectItem>
                              <SelectItem value="광견병">광견병</SelectItem>
                              <SelectItem value="코로나">코로나</SelectItem>
                              <SelectItem value="켄넬코프">켄넬코프</SelectItem>
                              <SelectItem value="기타">기타</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="vaccineDate">접종일</Label>
                          <Input id="vaccineDate" name="vaccineDate" type="date" required />
                        </div>
                        <div>
                          <Label htmlFor="nextDueDate">다음 접종 예정일</Label>
                          <Input id="nextDueDate" name="nextDueDate" type="date" />
                        </div>
                        <div>
                          <Label htmlFor="veterinarian">수의사</Label>
                          <Input id="veterinarian" name="veterinarian" />
                        </div>
                        <div>
                          <Label htmlFor="clinicName">병원명</Label>
                          <Input id="clinicName" name="clinicName" />
                        </div>
                        <div>
                          <Label htmlFor="notes">메모</Label>
                          <Textarea id="notes" name="notes" />
                        </div>
                        <Button type="submit" className="w-full">
                          기록 저장
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vaccinationsData?.vaccinations?.map((vaccination: Vaccination) => (
                    <div key={vaccination.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{vaccination.vaccineName}</h3>
                        <Badge variant="outline">{vaccination.vaccineType}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>접종일: {new Date(vaccination.vaccineDate).toLocaleDateString()}</p>
                        {vaccination.nextDueDate && (
                          <p>다음 접종 예정: {new Date(vaccination.nextDueDate).toLocaleDateString()}</p>
                        )}
                        {vaccination.veterinarian && <p>수의사: {vaccination.veterinarian}</p>}
                        {vaccination.clinicName && <p>병원: {vaccination.clinicName}</p>}
                        {vaccination.notes && <p>메모: {vaccination.notes}</p>}
                      </div>
                    </div>
                  )) || <p className="text-gray-500">등록된 예방접종 기록이 없습니다.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 건강검진 기록 탭 */}
          <TabsContent value="checkups">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{selectedPet.name}의 건강검진 기록</CardTitle>
                  <Dialog open={isCheckupDialogOpen} onOpenChange={setIsCheckupDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        검진 기록 추가
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>건강검진 기록 추가</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCheckupSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="checkupDate">검진일</Label>
                          <Input id="checkupDate" name="checkupDate" type="date" required />
                        </div>
                        <div>
                          <Label htmlFor="weight">체중 (g)</Label>
                          <Input id="weight" name="weight" type="number" />
                        </div>
                        <div>
                          <Label htmlFor="temperature">체온</Label>
                          <Input id="temperature" name="temperature" placeholder="38.5°C" />
                        </div>
                        <div>
                          <Label htmlFor="diagnosis">진단</Label>
                          <Textarea id="diagnosis" name="diagnosis" />
                        </div>
                        <div>
                          <Label htmlFor="treatment">치료</Label>
                          <Textarea id="treatment" name="treatment" />
                        </div>
                        <div>
                          <Label htmlFor="veterinarian">수의사</Label>
                          <Input id="veterinarian" name="veterinarian" />
                        </div>
                        <div>
                          <Label htmlFor="clinicName">병원명</Label>
                          <Input id="clinicName" name="clinicName" />
                        </div>
                        <div>
                          <Label htmlFor="nextCheckupDate">다음 검진 예정일</Label>
                          <Input id="nextCheckupDate" name="nextCheckupDate" type="date" />
                        </div>
                        <div>
                          <Label htmlFor="notes">메모</Label>
                          <Textarea id="notes" name="notes" />
                        </div>
                        <Button type="submit" className="w-full">
                          기록 저장
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {checkupsData?.checkups?.map((checkup: HealthCheckup) => (
                    <div key={checkup.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">건강검진</h3>
                        <Badge variant="outline">
                          {new Date(checkup.checkupDate).toLocaleDateString()}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        {checkup.weight && <p>체중: {checkup.weight}g</p>}
                        {checkup.temperature && <p>체온: {checkup.temperature}</p>}
                        {checkup.diagnosis && <p>진단: {checkup.diagnosis}</p>}
                        {checkup.treatment && <p>치료: {checkup.treatment}</p>}
                        {checkup.veterinarian && <p>수의사: {checkup.veterinarian}</p>}
                        {checkup.clinicName && <p>병원: {checkup.clinicName}</p>}
                        {checkup.nextCheckupDate && (
                          <p>다음 검진 예정: {new Date(checkup.nextCheckupDate).toLocaleDateString()}</p>
                        )}
                        {checkup.notes && <p>메모: {checkup.notes}</p>}
                      </div>
                    </div>
                  )) || <p className="text-gray-500">등록된 건강검진 기록이 없습니다.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      
      {pets.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Heart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">등록된 반려동물이 없습니다</h3>
            <p className="text-gray-500 mb-4">먼저 반려동물을 등록해 주세요</p>
            <Button>반려동물 등록하기</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
